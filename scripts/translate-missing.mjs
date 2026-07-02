#!/usr/bin/env node
/**
 * Fill missing Arabic/Kurdish translations for menu items and categories using
 * Google Gemini. A field is translated ONLY when it is empty or still equal to
 * the English source (i.e. never actually translated). Real, distinct existing
 * translations are left untouched.
 *
 * Translates in BATCHES (many strings per request) to avoid the free-tier
 * per-minute request limit — a whole menu is usually a handful of calls.
 *
 * Prerequisites (.env or .env.local):
 *   VITE_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY   (secret / service_role key — NOT publishable)
 *     …or ADMIN_EMAIL + ADMIN_PASSWORD to run as a signed-in admin
 *   GEMINI_API_KEY
 *   TRANSLATE_MODEL             (optional, default gemini-2.0-flash)
 *   TRANSLATE_BATCH            (optional, strings per request; default 200 — a
 *                               normal menu is one request. Lower it only if a
 *                               huge menu truncates the response.)
 *   TRANSLATE_RATE_MS          (optional, delay between batches; default 1500)
 *
 * Usage:
 *   node scripts/translate-missing.mjs --dry     # preview, writes nothing
 *   node scripts/translate-missing.mjs           # apply changes
 */

import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

const DRY = process.argv.includes("--dry");
const LANGS = ["ar", "ku"];
const LANG_NAMES = {
  en: "English",
  ar: "Arabic",
  ku: "Central Kurdish (Sorani, written in the Arabic-based Kurdish script)",
};

function loadEnvFile(name) {
  try {
    const text = readFileSync(new URL(`../${name}`, import.meta.url), "utf8");
    for (const line of text.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const val = trimmed.slice(eq + 1).trim();
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    // optional
  }
}

function isPublishableKey(key) {
  if (!key) return true;
  if (key.startsWith("sb_publishable_")) return true;
  const publishable =
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;
  return publishable && key === publishable;
}

async function createSupabaseClient() {
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
  const anonKey =
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!url) throw new Error("Missing VITE_SUPABASE_URL");

  if (serviceKey && !isPublishableKey(serviceKey)) {
    return createClient(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!anonKey || !email || !password) {
    throw new Error(
      "Set SUPABASE_SERVICE_ROLE_KEY (secret key), or ADMIN_EMAIL + ADMIN_PASSWORD for a signed-in admin.",
    );
  }
  console.log("Using admin login (publishable key + ADMIN_EMAIL)…");
  const supabase = createClient(url, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return supabase;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function geminiConfig() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) throw new Error("Missing GEMINI_API_KEY");
  const model = process.env.TRANSLATE_MODEL || "gemini-2.0-flash";
  const batch = Number(process.env.TRANSLATE_BATCH || 200);
  const rateMs = Number(process.env.TRANSLATE_RATE_MS || 1500);
  return { apiKey, model, batch, rateMs };
}

// Translate a batch of items — each { src, target } — in ONE request, mixing
// languages. Returns an array of translations in the same order. Retries on 429.
async function translateBatchOnce({ apiKey, model }, batchTasks) {
  const system =
    "You are a professional translator for a café/restaurant menu. The user " +
    "sends a JSON array of objects, each { \"text\": <English string>, \"to\": " +
    "<target language> }. Translate each object's text into its own target " +
    "language. Respond with a JSON array of strings of the exact same length and " +
    "order, where element i is the translation of input[i].text into input[i].to. " +
    "Keep translations natural and concise, as on a menu. No notes, quotes, " +
    "romanization or extra elements.";

  const input = batchTasks.map((t) => ({ text: t.src, to: LANG_NAMES[t.target] }));

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: system }] },
      contents: [{ role: "user", parts: [{ text: JSON.stringify(input) }] }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
        responseSchema: { type: "ARRAY", items: { type: "STRING" } },
      },
    }),
  });

  const raw = await res.text();
  let data = {};
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    // leave empty
  }

  if (res.status === 429) {
    const msg = data?.error?.message || "";
    const m = msg.match(/retry in ([\d.]+)s/i);
    const wait = m ? Math.ceil(parseFloat(m[1]) * 1000) + 500 : 30000;
    const err = new Error("rate_limited");
    err.retryAfter = wait;
    throw err;
  }
  if (!res.ok) {
    throw new Error(`Gemini ${res.status}: ${data?.error?.message || raw.slice(0, 200)}`);
  }

  const cand = data?.candidates?.[0];
  const truncated = cand?.finishReason === "MAX_TOKENS";
  const textOut = cand?.content?.parts
    ?.map((p) => p?.text || "")
    .join("")
    .trim();
  let arr;
  try {
    arr = JSON.parse(textOut);
  } catch {
    const e = new Error(
      truncated
        ? "Response truncated (hit output-token cap)"
        : `Could not parse Gemini JSON: ${String(textOut).slice(0, 160)}`,
    );
    e.splittable = true; // splitting into smaller requests is the safe recovery
    throw e;
  }
  if (!Array.isArray(arr) || arr.length !== batchTasks.length) {
    const e = new Error(
      `Gemini returned ${Array.isArray(arr) ? arr.length : "non-array"} items, expected ${batchTasks.length}`,
    );
    e.splittable = true;
    throw e;
  }
  return arr.map((s) => String(s ?? "").trim());
}

async function translateBatch(cfg, batchTasks) {
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      return await translateBatchOnce(cfg, batchTasks);
    } catch (err) {
      if (err.retryAfter && attempt < 4) {
        console.log(`   …rate limited, waiting ${Math.round(err.retryAfter / 1000)}s`);
        await sleep(err.retryAfter);
        continue;
      }
      throw err;
    }
  }
  throw new Error("Exhausted retries");
}

// Try the whole set in one request; if the response is too large (truncated),
// split in half and retry each half. Uses the fewest requests that fit.
async function translateChunk(cfg, tasks) {
  try {
    return await translateBatch(cfg, tasks);
  } catch (err) {
    if (err.splittable && tasks.length > 1) {
      const mid = Math.ceil(tasks.length / 2);
      console.log(
        `   ↳ ${err.message} — splitting ${tasks.length} into ${mid} + ${tasks.length - mid}`,
      );
      const a = await translateChunk(cfg, tasks.slice(0, mid));
      await sleep(cfg.rateMs);
      const b = await translateChunk(cfg, tasks.slice(mid));
      return [...a, ...b];
    }
    throw err;
  }
}

// A target field needs translating if the source is non-empty AND the target
// is empty or just a copy of the source (never really translated).
function needs(source, current) {
  const s = String(source ?? "").trim();
  if (!s) return false;
  const c = String(current ?? "").trim();
  return c === "" || c === s;
}

const chunk = (arr, n) => {
  const out = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
};

async function run() {
  loadEnvFile(".env");
  loadEnvFile(".env.local");

  const cfg = geminiConfig();
  const supabase = await createSupabaseClient();

  console.log(
    `\n${DRY ? "DRY RUN — " : ""}Batched translate via ${cfg.model} ` +
      `(batch=${cfg.batch}, ${cfg.rateMs}ms between batches)\n`,
  );

  // Flat task list: each task points back to its row + field.
  const tasks = []; // { table, id, field, src, target }
  const patches = new Map(); // `${table}:${id}` -> { patch, table, id }

  const { data: cats, error: catErr } = await supabase
    .from("categories")
    .select("id, label_en, label_ar, label_ku");
  if (catErr) throw catErr;
  for (const c of cats) {
    for (const l of LANGS) {
      if (needs(c.label_en, c[`label_${l}`]))
        tasks.push({ table: "categories", id: c.id, field: `label_${l}`, src: c.label_en, target: l });
    }
  }

  const { data: items, error: itemErr } = await supabase
    .from("menu_items")
    .select("id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku");
  if (itemErr) throw itemErr;
  for (const it of items) {
    for (const l of LANGS) {
      if (needs(it.name_en, it[`name_${l}`]))
        tasks.push({ table: "menu_items", id: it.id, field: `name_${l}`, src: it.name_en, target: l });
      if (needs(it.ing_en, it[`ing_${l}`]))
        tasks.push({ table: "menu_items", id: it.id, field: `ing_${l}`, src: it.ing_en, target: l });
    }
  }

  console.log(`Found ${tasks.length} field(s) to translate.`);
  if (!tasks.length) return;

  // Start with one request for everything; translateChunk auto-splits only if a
  // response truncates. cfg.batch caps the first attempt to keep it sane.
  const allBatches = chunk(tasks, cfg.batch);
  console.log(
    `Sending up to ${allBatches.length} request(s) (auto-splits further only if a response is too large).\n`,
  );

  let batchNo = 0;
  for (const batchTasks of allBatches) {
    batchNo++;
    const outs = await translateChunk(cfg, batchTasks);
    batchTasks.forEach((t, i) => {
      const key = `${t.table}:${t.id}`;
      if (!patches.has(key)) patches.set(key, { table: t.table, id: t.id, patch: {} });
      patches.get(key).patch[t.field] = outs[i];
    });
    console.log(`[batch ${batchNo}/${allBatches.length}] ${batchTasks.length} strings ✓`);
    if (batchNo < allBatches.length) await sleep(cfg.rateMs);
  }

  if (DRY) {
    console.log("\n--- Preview (nothing written) ---");
    for (const { table, id, patch } of patches.values()) {
      console.log(`${table} ${id}:`, patch);
    }
    console.log(`\nDRY RUN complete — ${patches.size} rows would be updated.`);
    return;
  }

  let ok = 0;
  for (const { table, id, patch } of patches.values()) {
    const { error } = await supabase.from(table).update(patch).eq("id", id);
    if (error) console.error(`  ! update failed for ${table} ${id}:`, error.message);
    else ok++;
  }
  console.log(`\nDone. Updated ${ok}/${patches.size} rows in the live database.`);
}

run().catch((err) => {
  console.error("\nError:", err.message || err);
  process.exit(1);
});
