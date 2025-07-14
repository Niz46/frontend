import { API_PATHS } from "./apiPath";
import axiosInstance from "./axiosInstance";

const uploadVideo = async (videoFile) => {
  const formData = new FormData();
  formData.append("video", videoFile);

  try {
    const response = await axiosInstance.post(
      API_PATHS.VIDEO.UPLOAD_VIDEO,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error("Error uploading the video", err);
    throw err;
  }
};

export default uploadVideo;
