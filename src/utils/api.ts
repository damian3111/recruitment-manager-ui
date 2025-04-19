import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

const api: AxiosInstance = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true
});

// Attach token only when running on the client side
// api.interceptors.request.use(
//     (config) => {
//         if (typeof window !== "undefined") {
//             const token = localStorage.getItem("authToken");
//             if (token && config.headers) {
//                 config.headers["Authorization"] = `Bearer ${token}`;
//             }
//         }
//         return config;
//     },
//     (error) => Promise.reject(error)
// );

export default api;
