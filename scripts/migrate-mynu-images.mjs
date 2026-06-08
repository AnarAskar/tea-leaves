#!/usr/bin/env node
/**
 * One-time migration: download MYNU-hosted images and upload to Supabase Storage.
 * Updates categories.image_url and menu_items.photo_url in the database.
 *
 * Prerequisites:
 *   1. Run supabase/migrations/006_menu_images_bucket.sql in Supabase SQL Editor
 *   2. SUPABASE_SERVICE_ROLE_KEY in .env
 *
 *   node scripts/migrate-mynu-images.mjs
 */

import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

const MENU_IMAGES_BUCKET = "menu-images";
const MYNU_HOST = "r2.mynu.site";

function loadEnvFile() {
  try {
    const text = readFileSync(new URL("../.env", import.meta.url), "utf8");
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

  if (!url) {
    throw new Error("Missing VITE_SUPABASE_URL in .env");
  }

  if (serviceKey && !isPublishableKey(serviceKey)) {
    return createClient(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }

  if (!anonKey) {
    throw new Error(
      "Set SUPABASE_SERVICE_ROLE_KEY to your secret key (Supabase Dashboard → Project Settings → API → secret / service_role).\n" +
        "Do NOT use the publishable key (sb_publishable_…).\n" +
        "Or set ADMIN_EMAIL + ADMIN_PASSWORD to migrate as a signed-in admin.",
    );
  }

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is missing or set to the publishable key.\n" +
        "Use the secret key from Supabase Dashboard → Project Settings → API (labelled secret or service_role, often sb_secret_… or a long JWT).\n" +
        "Alternatively, set ADMIN_EMAIL and ADMIN_PASSWORD for your /admin account.",
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

function extFromUrl(url) {
  try {
    const pathname = new URL(url).pathname;
    const match = pathname.match(/\.([a-z0-9]+)$/i);
    if (match) {
      const ext = match[1].toLowerCase();
      if (["jpg", "jpeg", "png", "webp", "gif"].includes(ext)) return ext;
    }
  } catch {
    // fall through
  }
  return "jpeg";
}

function contentTypeFromExt(ext) {
  const map = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
  };
  return map[ext] || "image/jpeg";
}

async function downloadImage(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} fetching ${url}`);
  }
  const buffer = Buffer.from(await res.arrayBuffer());
  const ext = extFromUrl(url);
  return { buffer, ext, contentType: contentTypeFromExt(ext) };
}

async function uploadToStorage(supabase, storagePath, buffer, contentType) {
  const { error } = await supabase.storage
    .from(MENU_IMAGES_BUCKET)
    .upload(storagePath, buffer, {
      contentType,
      upsert: true,
      cacheControl: "31536000",
    });
  if (error) throw error;

  const { data } = supabase.storage
    .from(MENU_IMAGES_BUCKET)
    .getPublicUrl(storagePath);
  return data.publicUrl;
}

async function migrateUrl(supabase, urlCache, sourceUrl, storagePath) {
  if (urlCache.has(sourceUrl)) {
    return urlCache.get(sourceUrl);
  }

  const { buffer, ext, contentType } = await downloadImage(sourceUrl);
  const path =
    storagePath.includes(".") ? storagePath : `${storagePath}.${ext}`;
  const publicUrl = await uploadToStorage(supabase, path, buffer, contentType);
  urlCache.set(sourceUrl, publicUrl);
  return publicUrl;
}

async function main() {
  loadEnvFile();

  let supabase;
  try {
    supabase = await createSupabaseClient();
  } catch (err) {
    console.error(err.message || err);
    process.exit(1);
  }

  const urlCache = new Map();

  let categoryOk = 0;
  let categoryFail = 0;
  let itemOk = 0;
  let itemFail = 0;

  const { data: categories, error: catErr } = await supabase
    .from("categories")
    .select("id, image_url")
    .like("image_url", `%${MYNU_HOST}%`);

  if (catErr) {
    console.error("Failed to load categories:", catErr.message);
    process.exit(1);
  }

  console.log(`Migrating ${categories?.length || 0} category images…`);

  for (const cat of categories || []) {
    if (!cat.image_url?.includes(MYNU_HOST)) continue;
    try {
      const newUrl = await migrateUrl(
        supabase,
        urlCache,
        cat.image_url,
        `categories/${cat.id}`,
      );
      const { error } = await supabase
        .from("categories")
        .update({ image_url: newUrl })
        .eq("id", cat.id);
      if (error) throw error;
      console.log(`  ✓ category ${cat.id}`);
      categoryOk += 1;
    } catch (err) {
      console.error(`  ✗ category ${cat.id}:`, err.message || err);
      categoryFail += 1;
    }
  }

  const { data: items, error: itemErr } = await supabase
    .from("menu_items")
    .select("id, category_id, photo_url")
    .like("photo_url", `%${MYNU_HOST}%`);

  if (itemErr) {
    console.error("Failed to load menu items:", itemErr.message);
    process.exit(1);
  }

  console.log(`Migrating ${items?.length || 0} item photos…`);

  for (const item of items || []) {
    if (!item.photo_url?.includes(MYNU_HOST)) continue;
    try {
      const newUrl = await migrateUrl(
        supabase,
        urlCache,
        item.photo_url,
        `items/${item.category_id}/${item.id}`,
      );
      const { error } = await supabase
        .from("menu_items")
        .update({ photo_url: newUrl })
        .eq("id", item.id);
      if (error) throw error;
      console.log(`  ✓ item ${item.id} (${item.category_id})`);
      itemOk += 1;
    } catch (err) {
      console.error(`  ✗ item ${item.id}:`, err.message || err);
      itemFail += 1;
    }
  }

  console.log("\nDone:");
  console.log(`  Categories: ${categoryOk} ok, ${categoryFail} failed`);
  console.log(`  Items:      ${itemOk} ok, ${itemFail} failed`);
  console.log(`  Unique URLs uploaded: ${urlCache.size}`);

  if (categoryFail > 0 || itemFail > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Migration failed:", err.message || err);
  process.exit(1);
});
