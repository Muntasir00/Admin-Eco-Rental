import axios from "axios";
import {CONFIG} from "@/utils/config-global";
import {endpoints} from "@/config/paths";
import {setSession, getAccessToken, getRefreshToken} from "@/lib/auth";

const axiosInstance = axios.create({baseURL: CONFIG.site.serverUrl});

// Request Interceptor
axiosInstance.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

// Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // যদি ৪০১ এরর দেয় এবং আগে ট্রাই করা না হয়ে থাকে
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const rfToken = getRefreshToken();
                if (!rfToken) throw new Error("No refresh token");

                // রিফ্রেশ টোকেন দিয়ে নতুন টোকেন চাওয়া
                const res = await axios.post(`${CONFIG.site.serverUrl}${endpoints.auth.refreshToken}`, {
                    refreshToken: rfToken
                });

                const {accessToken, refreshToken: newRefreshToken} = res.data;

                // নতুন সেশন সেট করা
                setSession(accessToken, newRefreshToken || rfToken);

                // অরিজিনাল রিকোয়েস্টটি আবার পাঠানো
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                setSession(null, null);
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;