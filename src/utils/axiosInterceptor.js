import axios from "axios";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
  baseURL: `http://localhost:8000/api`
});

const initializeAxiosInterceptors = async () => {

  axiosInstance.interceptors.request.use(
    (config) => {
      config.headers["Content-Type"] = "application/json";
      config.headers["Accept"] = "application/json";
      const token = localStorage.getItem("token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

initializeAxiosInterceptors();

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    if (response) {
      toast.error(response?.data?.error || "An unexpected error occurred.")
      
      if (response.status === 401) {
        localStorage.removeItem("token");
      }
    } else {
      // Handle network errors or other unexpected issues
      toast.error("Network error. Please try again later.");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
