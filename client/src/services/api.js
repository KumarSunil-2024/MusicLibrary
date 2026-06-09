import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    // 👇 Ensure standard, bulletproof "Bearer <token>" formatting
    config.headers.Authorization = token.startsWith("Bearer ") 
      ? token 
      : `Bearer ${token}`;
  }

  return config;
});

export default api;