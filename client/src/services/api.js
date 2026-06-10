import axios from "axios";

// INITIALIZE AXIOS NETWORK INSTANCE
const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// BIND REQUEST MIDDLEWARE INTERCEPTOR
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  // EVALUATE ACTIVE TOKEN EXISTENCE
  if (token) {
    // FORMAT BEARER SCHEMA STRINGS
    config.headers.Authorization = token.startsWith("Bearer ") 
      ? token 
      : `Bearer ${token}`;
  }

  return config;
});

export default api;
// EXPORT NETWORK INSTANCE