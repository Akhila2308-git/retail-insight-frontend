// frontend/src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // backend base
  timeout: 30000,
});

// attach token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // saved at login
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;

