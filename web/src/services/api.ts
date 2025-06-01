import axios from "axios";
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Automatically attach token if available
api.interceptors.request.use((config) => {
  const user = localStorage.getItem("user");
  const token = user ? JSON.parse(user).token : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
