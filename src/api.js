import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api", // URL da API
});

export default api;