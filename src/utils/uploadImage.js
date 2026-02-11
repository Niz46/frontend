// src/utils/uploadImages.js
import { API_PATHS, BASE_URL } from "./apiPath";

/**
 * Upload one File or an Array<File> to the public `/upload-images-public` endpoint.
 * Uses the native Fetch API to avoid Content-Type header boundary issues.
 *
 * Returns Promise<Array<{url: string, timestamp: string}>> on success.
 * Throws an object { message, ... } on failure (same shape your frontend already expects).
 */
const uploadImagesPublic = async (imageFiles, { debugFormData = false } = {}) => {
  const files = Array.isArray(imageFiles) ? imageFiles : [imageFiles];
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("images", file);
  });

  if (debugFormData && typeof formData.forEach === "function") {
    // dev-only: inspect keys/values (safe to log objects only; don't print binary)
    formData.forEach((value, key) => {
      console.debug("[uploadImagesPublic] formData key:", key, value);
    });
  }

  const url = `${BASE_URL}${API_PATHS.IMAGE.UPLOAD_IMAGE_PUBLIC}`;

  const resp = await fetch(url, {
    method: "POST",
    // IMPORTANT: do NOT set Content-Type header — browser sets the proper multipart boundary.
    body: formData,
    credentials: "same-origin", // adjust if you rely on cookies; not required for tokenless public endpoint
  });

  // parse JSON (server returns { message: ... } on error or array on success)
  const body = await resp.json().catch(() => null);

  if (!resp.ok) {
    // normalize error object
    const err = body && body.message ? body : { message: resp.statusText || "Upload failed", ...body };
    throw err;
  }

  // expected: array like [{ url: "https://res.cloudinary.com/..", timestamp: "..." }, ...]
  return body;
};

export default uploadImagesPublic;
export { uploadImagesPublic };
