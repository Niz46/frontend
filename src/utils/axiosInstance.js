import axios from "axios";
import { BASE_URL } from "./apiPath";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 0,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    try {
      const accessToken = localStorage.getItem("token");
      if (accessToken) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      // If the body is FormData, remove any pre-set Content-Type headers so the
      // browser/axios will set multipart/form-data with the correct boundary.
      if (config && config.data instanceof FormData) {
        if (config.headers) {
          // Remove both common casings
          if (config.headers["Content-Type"])
            delete config.headers["Content-Type"];
          if (config.headers["content-type"])
            delete config.headers["content-type"];
        }
      }
    } catch (err) {
      // don't block request on interceptor error; just log
      console.error("axiosInstance request interceptor error:", err);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 404) {
        // Redirect to login page
      } else if (error.response.status === 500) {
        console.error("Server Error. Please try again later.");
      }
    } else if (error.code === "ECONNABORTED") {
      console.error("Request timeout. Please try again.");
    }
    return Promise.reject(error);
  },
);

// in axiosInstance.js, update the response error handler to:
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // print the entire JSON error from the server
      console.error(">>> BACKEND ERROR PAYLOAD:", error.response.data);
    } else if (error.code === "ECONNABORTED") {
      console.error("Request timeout. Please try again.");
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
