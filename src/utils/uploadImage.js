// src/utils/uploadImages.js
import { API_PATHS } from "./apiPath";
import axiosInstance from "./axiosInstance";

/**
 * Upload one File or an Array<File> to the `/upload-images` endpoint.
 * @param {File|File[]} imageFiles
 * @returns {Promise<Array<{url: string, timestamp: string}>>}
 */
const uploadImages = async (imageFiles) => {
  const files = Array.isArray(imageFiles) ? imageFiles : [imageFiles];
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("images", file);
  });

  try {
    const response = await axiosInstance.post(
      API_PATHS.IMAGE.UPLOAD_IMAGE,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    // always an array, even if you uploaded one
    return response.data;
  } catch (err) {
    console.error("Upload images error:", err.response?.data || err.message);
    throw err;
  }
};

export default uploadImages;
