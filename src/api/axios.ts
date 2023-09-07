import axios from "axios";

export const apiBackend = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})