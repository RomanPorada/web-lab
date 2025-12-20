import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:4000";

const axiosClient = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 10000
});

export default axiosClient;
