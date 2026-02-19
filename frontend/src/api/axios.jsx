import axios from "axios";

const api = axios.create({
  baseURL: "https://bazario-e-commerce.onrender.com/api",
  withCredentials: true
});

export default api;
