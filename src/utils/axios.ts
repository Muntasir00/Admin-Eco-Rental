import axios from 'axios';
import { CONFIG } from "@/utils/config-global";
import { STORAGE_KEY } from "@/utils/constant";
import type { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: CONFIG.site.serverUrl });

// Request Interceptor
// Axios v1+ এ 'InternalAxiosRequestConfig' ব্যবহার করা ভালো
axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    try {
        const token = sessionStorage.getItem(STORAGE_KEY);
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch (err) {
        // ignore
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) =>
        Promise.reject(
            (error.response && error.response.data) || 'Something went wrong!'
        )
);

export default axiosInstance;


// Fetcher function updated with types
export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
    try {
        const [url, config] = Array.isArray(args) ? args : [args];

        const res = await axiosInstance.get(url, { ...config });

        return res.data;
    } catch (error) {
        console.error('Failed to fetch:', error);
        throw error;
    }
};


export const endpoints = {
    auth: {
        signIn: '/user/login',
        signUp: '/user/register',
        verify: '/user/verify',
        forgotPassword: '/user/forgot-password',
        verifyOtp: '/user/verify-otp/:email',
        changePassword: '/user/change-password/:email',
        logout: '/user/logout',
    },
    blogs: {
        blogs: '/blogs',
        create: '/blogs/create',
        update: '/blogs',
        delete: '/blogs',
    },
    rooms: {
        allRooms: '/rooms',
        singleRoom: '/rooms',
        createRoom: '/rooms',
        updateRoom: '/rooms',
        delete: '/rooms',

        availability: '/availability/rooms',
        bookings: '/bookings',
    }
};