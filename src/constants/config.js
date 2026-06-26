export const BASE_URL = (import.meta.env.VITE_BASE_URL || "").replace(/\/+$/, "");
export const NUM_TABLES = Number(import.meta.env.VITE_NUM_TABLES) || 25;

// The admin area lives at /<ADMIN_PATH> instead of the obvious /admin.
// Set VITE_ADMIN_PATH to your own secret slug in the deploy environment.
export const ADMIN_PATH = (import.meta.env.VITE_ADMIN_PATH || "manage")
  .trim()
  .replace(/^\/+|\/+$/g, "");
