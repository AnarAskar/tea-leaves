import { uploadMenuImage } from "./uploadMenuImage";

/** @deprecated Use uploadMenuImage — kept for existing imports */
export async function uploadCategoryImage(file, categoryId) {
  return uploadMenuImage(file, `categories/${categoryId}`);
}
