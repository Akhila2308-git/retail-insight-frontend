import axios from "axios";

// 👇 Use your Render backend URL here
const API = axios.create({
  baseURL: "https://backend-ncwt.onrender.com",
});

export default API;
