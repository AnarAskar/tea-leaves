export const BASE_URL = (import.meta.env.VITE_BASE_URL || "").replace(/\/+$/, "");

// Default number of tables shown in the QR generator. The admin can change
// the count there; any table number on a scanned QR is accepted up to MAX_TABLE.
export const NUM_TABLES = Number(import.meta.env.VITE_NUM_TABLES) || 25;
export const MAX_TABLE = 999;

// The admin area lives at /<ADMIN_PATH> instead of the obvious /admin.
// Override VITE_ADMIN_PATH with your own secret slug in the deploy environment.
export const ADMIN_PATH = (import.meta.env.VITE_ADMIN_PATH || "ops-1b90ca64")
  .trim()
  .replace(/^\/+|\/+$/g, "");
