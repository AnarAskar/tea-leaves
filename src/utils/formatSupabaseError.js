const MIGRATION_HINT =
  "Database not migrated yet. Run supabase/setup_category_images.sql in Supabase SQL Editor (includes schema reload), then sign out and back in.";

export function formatSupabaseError(err) {
  const code = err?.code;
  const message = err?.message || err?.details || err?.hint || "";

  if (code === "PGRST204" && /image_url/i.test(message)) {
    return MIGRATION_HINT;
  }

  if (code === "PGRST204") {
    return `Database schema is out of date. ${message || "Re-run supabase/setup_category_images.sql."}`;
  }

  if (code === "42501" || /row-level security/i.test(message)) {
    return "Permission denied. Re-run supabase/setup_category_images.sql and supabase/migrations/002_rls_policies.sql, then sign out and back in.";
  }

  if (code === "23502" && /emoji/i.test(message)) {
    return "Database schema mismatch on emoji column. Re-run supabase/setup_category_images.sql.";
  }

  if (code === "23505") {
    return "A category with this ID already exists. Use a different ID or edit the existing category.";
  }

  if (message) return message;
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  try {
    return JSON.stringify(err);
  } catch {
    return "Something went wrong. Check the browser console for details.";
  }
}
