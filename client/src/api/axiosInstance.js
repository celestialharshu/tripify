import axios from "axios";

// one shared axios instance for the whole app
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
});

// before every request, check if we have a saved token and attach it
// this way we don't have to repeat this logic in every single api call
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("tripify_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
