import { API_PATHS } from "./apiPath";
import axiosInstance from "./axiosInstance";

const uploadImage = async (imageFile) => {
  const formData = new FormData();

  formData.append("image", imageFile);

  try {
    const response = await axiosInstance.post(
      API_PATHS.IMAGE.UPLOAD_IMAGE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (err) {
    if (err.response && err.response.data) {
      console.error("Upload error response:", err.response.data);
      alert(`Upload failed: ${err.response.data.message}`);
    } else {
      console.error("Upload error:", err.message);
      alert(`Upload failed: ${err.message}`);
    }
  }
};

export default uploadImage;
