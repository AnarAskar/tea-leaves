#!/usr/bin/env node
/**
 * One-time devops script: seed Tea Leaves menu from MYNU into Supabase.
 * Not used by the app — menu data lives in Supabase after this runs once.
 *
 * Option A (recommended): paste supabase/migrations/005_seed_mynu_menu.sql
 *   into Supabase Dashboard → SQL Editor → Run.
 *
 * Option B: node scripts/seed-mynu-once.mjs
 *   Requires SUPABASE_SERVICE_ROLE_KEY in .env (bypasses RLS).
 */

import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";
import { importMynuToSupabase } from "../shared/mynuImport.js";

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

async function main() {
  loadEnvFile();

  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.error(
      "One-time seed: run supabase/migrations/005_seed_mynu_menu.sql in Supabase SQL Editor,\n" +
        "or add SUPABASE_SERVICE_ROLE_KEY to .env and run this script again.",
    );
    process.exit(1);
  }

  const supabase = createClient(url, serviceKey);
  console.log("Seeding menu from MYNU (replace mode)…");

  const result = await importMynuToSupabase(supabase, { replace: true });

  console.log("Done:");
  console.log(`  Categories: ${result.categories}`);
  console.log(`  Items:      ${result.items}`);
}

main().catch((err) => {
  console.error("Seed failed:", err.message || err);
  process.exit(1);
});
