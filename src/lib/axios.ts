import axios, {type AxiosRequestConfig, type InternalAxiosRequestConfig} from "axios";
import {CONFIG} from "@/utils/config-global";
import {REFRESH_KEY, STORAGE_KEY} from "@/utils/constant";
import {endpoints} from "@/config/paths";
import {setSession} from "@/lib/auth";

const axiosInstance = axios.create({baseURL: CONFIG.site.serverUrl});

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    try {
        // পরিবর্তন: localStorage থেকে টোকেন নেওয়া
        const token = localStorage.getItem(STORAGE_KEY);
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch (err) {
        console.error(err);
    }
    return config;
}, (error) => Promise.reject(error));

// Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // পরিবর্তন: localStorage থেকে রিফ্রেশ টোকেন নেওয়া
                const currentRefreshToken = localStorage.getItem(REFRESH_KEY);

                if (!currentRefreshToken) {
                    throw new Error("No refresh token available");
                }

                const response = await axiosInstance.post(endpoints.auth.refreshToken, {
                    refreshToken: currentRefreshToken
                });

                const {accessToken, refreshToken: newRefreshToken} = response.data;

                // setSession এখন localStorage ব্যবহার করবে (উপরে আপডেট করেছেন)
                await setSession(accessToken, newRefreshToken || currentRefreshToken);

                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return axiosInstance(originalRequest);

            } catch (refreshError) {
                await setSession(null, null);
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject((error.response && error.response.data) || 'Something went wrong!');
    }
);

// axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
//     try {
//         const token = sessionStorage.getItem(STORAGE_KEY);
//         if (token && config.headers) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//     } catch (err) {
//         console.log(err)
//     }
//     return config;
// }, (error) => Promise.reject(error));
//
// // ----------------------------------------------------------------------
// // Response Interceptor (এখানে পরিবর্তন হবে)
// // ----------------------------------------------------------------------
// axiosInstance.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//         const originalRequest = error.config;
//
//         // যদি Status 401 হয় এবং আগে একবার রিট্রাই না করা হয়ে থাকে
//         if (error.response?.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true; // মার্ক করে রাখা
//
//             try {
//                 // ১. স্টোরেজ থেকে রিফ্রেশ টোকেন নেওয়া
//                 const currentRefreshToken = sessionStorage.getItem(REFRESH_KEY);
//
//                 if (!currentRefreshToken) {
//                     throw new Error("No refresh token available");
//                 }
//
//                 // ২. Refresh API কল করা
//                 // আপনার পোস্টম্যান ইমেজ অনুযায়ী বডিতে refreshToken পাঠাতে হবে
//                 const response = await axiosInstance.post(endpoints.auth.refreshToken, {
//                     refreshToken: currentRefreshToken
//                 });
//
//                 // ৩. নতুন টোকেন রিসিভ করা
//                 const {accessToken, refreshToken: newRefreshToken} = response.data;
//
//                 // ৪. স্টোরেজ আপডেট করা
//                 // (যদি সার্ভার নতুন refreshToken দেয় সেটা সেভ হবে, না দিলে আগেরটাই থাকবে)
//                 await setSession(accessToken, newRefreshToken || currentRefreshToken);
//
//                 // ৫. ফেইল হওয়া রিকোয়েস্টের হেডারে নতুন টোকেন বসানো
//                 originalRequest.headers.Authorization = `Bearer ${accessToken}`;
//
//                 // ৬. অরিজিনাল রিকোয়েস্ট আবার পাঠানো
//                 return axiosInstance(originalRequest);
//
//             } catch (refreshError) {
//                 console.error('Refresh failed:', refreshError);
//
//                 // রিফ্রেশ ফেইল করলে সব ক্লিয়ার করে লগআউট
//                 await setSession(null, null);
//                 window.location.href = '/login'; // আপনার লগইন পেজের পাথ দিন
//
//                 return Promise.reject(refreshError);
//             }
//         }
//
//         return Promise.reject((error.response && error.response.data) || 'Something went wrong!');
//     }
// );

export default axiosInstance;


// Fetcher function updated with types
export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
    try {
        const [url, config] = Array.isArray(args) ? args : [args];

        const res = await axiosInstance.get(url, {...config});

        return res.data;
    } catch (error) {
        console.error('Failed to fetch:', error);
        throw error;
    }
};