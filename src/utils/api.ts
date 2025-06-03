import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

// const api: AxiosInstance = axios.create({
//     baseURL: "http://localhost:8080",
//     withCredentials: true
// });

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const api: AxiosInstance = axios.create({
    baseURL: `${BACKEND_URL}`,
    withCredentials: true
});

// api.interceptors.request.use((config) => {
//     const token = localStorage.getItem('authToken');
//     console.log('Interceptor: Token from localStorage:', token);
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//         console.log('Interceptor: Added Authorization header:', `Bearer ${token}`);
//     } else {
//         console.log('Interceptor: No token found in localStorage');
//     }
//     return config;
// });
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
