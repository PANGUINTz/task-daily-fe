import axios from "axios";
const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/api`;

const ExternalApi = axios.create({
  baseURL: baseUrl,
});

export default ExternalApi;
