import axios from "axios";
import { decryptToken } from "../utils/tokenEncryption";

const api = axios.create({
  baseURL: "http://localhost:5000"
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

// Add request interceptor to decrypt and set token
api.interceptors.request.use(async (config) => {
  try {
    const encryptedToken = localStorage.getItem("token");
    if (encryptedToken) {
      const decrypted = await decryptToken(encryptedToken);
      config.headers.Authorization = `Bearer ${decrypted}`;
    }
  } catch (error) {
    console.error("Failed to decrypt token:", error);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
