// src/utils/axios.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000", // Replace with your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add token from localStorage or Redux
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // or get from Redux
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
