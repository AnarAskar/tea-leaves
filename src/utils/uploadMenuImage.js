import { supabase } from "./supabaseClient";

export const MENU_IMAGES_BUCKET = "menu-images";
const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const MIME_BY_EXT = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

function resolveContentType(file, ext) {
  if (file.type && ALLOWED_TYPES.has(file.type)) {
    return file.type === "image/jpg" ? "image/jpeg" : file.type;
  }
  const fromExt = MIME_BY_EXT[ext];
  if (fromExt) return fromExt;
  throw new Error("Please upload a JPEG, PNG, WebP, or GIF image.");
}

function toUploadBody(file, contentType) {
  if (file.type === contentType) return file;
  return new Blob([file], { type: contentType });
}

function formatUploadError(error) {
  const msg = error?.message || "Upload failed";
  if (/bucket.*not found|not found.*bucket/i.test(msg)) {
    return "Storage bucket not set up. Run supabase/migrations/006_menu_images_bucket.sql in the Supabase SQL Editor.";
  }
  if (/row-level security|policy/i.test(msg)) {
    return "Upload blocked by storage permissions. Re-run 006_menu_images_bucket.sql, then sign out and back in.";
  }
  if (/mime|invalid.*type/i.test(msg)) {
    return `${msg} Try saving as JPEG or PNG.`;
  }
  return msg;
}

/**
 * Upload an image to Supabase Storage (menu-images bucket).
 * @param {File} file
 * @param {string} folderPath e.g. "categories/salads" or "items/salads/42"
 */
export async function uploadMenuImage(file, folderPath) {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    throw new Error("You must be logged in to upload images.");
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const contentType = resolveContentType(file, ext);

  if (file.size > MAX_BYTES) {
    throw new Error("Image must be 2 MB or smaller.");
  }

  const folder = folderPath.replace(/\/+$/, "");
  const path = `${folder}/${Date.now()}.${ext}`;
  const body = toUploadBody(file, contentType);

  const { error } = await supabase.storage
    .from(MENU_IMAGES_BUCKET)
    .upload(path, body, {
      contentType,
      upsert: true,
      cacheControl: "3600",
    });

  if (error) {
    throw new Error(formatUploadError(error));
  }

  const { data } = supabase.storage.from(MENU_IMAGES_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
