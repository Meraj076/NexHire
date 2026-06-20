import axios from "axios";
import { useAuthStore } from "../store/authStore";

//Spring Boot Backend Base URL Config

const API = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082',
    headers: {
        'Content-Type' : 'application/json',
    },
});


//Auth Interceptor: Sending Time the every request check the Token is store in localStroge or not.

API.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if(token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default API;