// src/utils/uploadVideos.js
import { API_PATHS } from "./apiPath";
import axiosInstance from "./axiosInstance";

/**
 * Upload one File or an Array<File> to the `/upload-videos` endpoint.
 * @param {File|File[]} videoFiles
 * @returns {Promise<Array<{url: string, timestamp: string}>>}
 */
const uploadVideos = async (videoFiles) => {
  const files = Array.isArray(videoFiles) ? videoFiles : [videoFiles];
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("videos", file);
  });

  try {
    const response = await axiosInstance.post(
      API_PATHS.VIDEO.UPLOAD_VIDEO,
      formData,
    );
    return response.data;
  } catch (err) {
    console.error(
      "Upload videos error:",
      err?.response?.data || err?.message || err,
    );
    throw err;
  }
};

export default uploadVideos;
