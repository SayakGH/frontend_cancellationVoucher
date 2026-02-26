import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://nayqp7xifyoor6kh67aigarsha0ffrbo.lambda-url.ap-south-1.on.aws/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
