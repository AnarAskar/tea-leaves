import { supabase } from "./supabaseClient";

export const MENU_IMAGES_BUCKET = "menu-images";
const MAX_INPUT_BYTES = 15 * 1024 * 1024; // raw file, before compression
const MAX_UPLOAD_BYTES = 2 * 1024 * 1024; // safety net after compression
const MAX_DIMENSION = 1000; // px, longest side — plenty for a menu thumbnail
const WEBP_QUALITY = 0.8;
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

// Downscale + re-encode as WebP so a full-res phone photo isn't served at
// full size to every visitor. Skips GIFs to keep animation intact, and falls
// back to the original file if the browser can't do canvas re-encoding.
async function compressImage(file, contentType) {
  if (contentType === "image/gif") return null;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.getContext("2d").drawImage(bitmap, 0, 0, width, height);
    bitmap.close?.();

    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/webp", WEBP_QUALITY),
    );
    return blob ? { blob, contentType: "image/webp", ext: "webp" } : null;
  } catch {
    return null;
  }
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

  if (file.size > MAX_INPUT_BYTES) {
    throw new Error("Image must be 15 MB or smaller.");
  }

  const compressed = await compressImage(file, contentType);
  const body = compressed ? compressed.blob : toUploadBody(file, contentType);
  const finalContentType = compressed ? compressed.contentType : contentType;
  const finalExt = compressed ? compressed.ext : ext;

  if (body.size > MAX_UPLOAD_BYTES) {
    throw new Error("Image is too large even after compression — try a smaller photo.");
  }

  const folder = folderPath.replace(/\/+$/, "");
  const path = `${folder}/${Date.now()}.${finalExt}`;

  const { error } = await supabase.storage
    .from(MENU_IMAGES_BUCKET)
    .upload(path, body, {
      contentType: finalContentType,
      upsert: true,
      cacheControl: "31536000",
    });

  if (error) {
    throw new Error(formatUploadError(error));
  }

  const { data } = supabase.storage.from(MENU_IMAGES_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
