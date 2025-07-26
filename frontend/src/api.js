import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(async (config) => {
    let accessToken = localStorage.getItem(ACCESS_TOKEN);
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);

        if (accessToken) {
            try {
            const decoded = jwtDecode(accessToken);
            const now = Date.now() / 1000;

            if (decoded.exp < now && refreshToken) {
                const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/token/refresh/`, {
                refresh: refreshToken,
                });
                accessToken = res.data.access;
                localStorage.setItem(ACCESS_TOKEN, accessToken);
            }

            config.headers.Authorization = `Bearer ${accessToken}`;
            } catch (err) {
            console.error("Token error:", err);
            }
        }

        return config;
    }, (error) => {
        return Promise.reject(error);
    }
);

export default api;
