import axios from "axios";

const api = axios.create({
  baseURL: "https://university-academic-system.onrender.com/api",
});

// Attach token automatically to every request (if logged in)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;