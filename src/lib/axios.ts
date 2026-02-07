import axios from 'axios';
import { getAccessToken, getRefreshToken, setSession } from './auth';
import { CONFIG } from "@/utils/config-global";
import { endpoints } from "@/config/paths";

const axiosInstance = axios.create({ baseURL: CONFIG.site.serverUrl });

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

axiosInstance.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
}, (error) => Promise.reject(error));

axiosInstance.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config as any;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise(function(resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return axiosInstance(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const rfToken = getRefreshToken();
                if(!rfToken) throw new Error("No Refresh Token");

                // রিফ্রেশ এপিআই কল (Raw Axios দিয়ে)
                const { data } = await axios.post(`${CONFIG.site.serverUrl}${endpoints.auth.refreshToken}`, {
                    refreshToken: rfToken
                });

                // আপনার JSON রেসপন্স স্ট্রাকচার অনুযায়ী
                const { accessToken, refreshToken } = data;

                // নতুন টোকেন সেভ (টাইমার অটো রিসেট হবে)
                setSession(accessToken, refreshToken || rfToken);

                // Queue তে থাকা রিকোয়েস্ট প্রসেস করা
                processQueue(null, accessToken);

                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return axiosInstance(originalRequest);

            } catch (err) {
                processQueue(err, null);
                setSession(null); // Logout
                window.location.href = '/login';
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;

// import axios from 'axios';
// import {getAccessToken, getRefreshToken, setSession} from './auth';
// import {CONFIG} from "@/utils/config-global";
// import {endpoints} from "@/config/paths";
// import {authService} from "@/services/auth.service";
//
// const axiosInstance = axios.create({baseURL: CONFIG.site.serverUrl});
//
// axiosInstance.interceptors.request.use((config) => {
//     const token = getAccessToken();
//     if (token) config.headers.Authorization = `Bearer ${token}`;
//     return config;
// });
//
// axiosInstance.interceptors.response.use(
//     (res) => res,
//     async (error) => {
//         const originalRequest = error.config;
//         if (error.response?.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true;
//             try {
//                 const rfToken = getRefreshToken();
//                 // রিফ্রেশ API কল (আপনার এন্ডপয়েন্ট অনুযায়ী পরিবর্তন করুন)
//                 // const { data }  = await axios.post(`${CONFIG.site.serverUrl}${endpoints.auth.refreshToken}`, {
//                 //     refreshToken: rfToken
//                 // });
//                 if (rfToken) {
//                     console.log(rfToken)
//                     const {data} = await authService.refreshToken(rfToken)
//                     setSession(data.accessToken, data.refreshToken);
//                     originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
//                     return axiosInstance(originalRequest);
//                 }
//                 else{
//                     localStorage.removeItem('app-storage');
//                 }
//                 // const { data } = await axios.post('/auth/refresh', { refreshToken: rfToken });
//
//             } catch (err) {
//                 setSession(null);
//                 window.location.href = '/login';
//                 return Promise.reject(err);
//             }
//         }
//         return Promise.reject(error);
//     }
// );
//
// export default axiosInstance;
//
//
// // import axios from "axios";
// // import {CONFIG} from "@/utils/config-global";
// // import {endpoints} from "@/config/paths";
// // import {setSession, getAccessToken, getRefreshToken} from "@/lib/auth";
// //
// // const axiosInstance = axios.create({baseURL: CONFIG.site.serverUrl});
// //
// // // Request Interceptor
// // axiosInstance.interceptors.request.use((config) => {
// //     const token = getAccessToken();
// //     if (token && config.headers) {
// //         config.headers.Authorization = `Bearer ${token}`;
// //     }
// //     return config;
// // }, (error) => Promise.reject(error));
// //
// // // Response Interceptor
// // axiosInstance.interceptors.response.use(
// //     (response) => response,
// //     async (error) => {
// //         const originalRequest = error.config;
// //
// //         // যদি ৪০১ এরর দেয় এবং আগে ট্রাই করা না হয়ে থাকে
// //         if (error.response?.status === 401 && !originalRequest._retry) {
// //             originalRequest._retry = true;
// //
// //             try {
// //                 const rfToken = getRefreshToken();
// //                 if (!rfToken) throw new Error("No refresh token");
// //
// //                 // রিফ্রেশ টোকেন দিয়ে নতুন টোকেন চাওয়া
// //                 const res = await axios.post(`${CONFIG.site.serverUrl}${endpoints.auth.refreshToken}`, {
// //                     refreshToken: rfToken
// //                 });
// //
// //                 const {accessToken, refreshToken: newRefreshToken} = res.data;
// //
// //                 // নতুন সেশন সেট করা
// //                 setSession(accessToken, newRefreshToken || rfToken);
// //
// //                 // অরিজিনাল রিকোয়েস্টটি আবার পাঠানো
// //                 originalRequest.headers.Authorization = `Bearer ${accessToken}`;
// //                 return axiosInstance(originalRequest);
// //             } catch (refreshError) {
// //                 setSession(null, null);
// //                 window.location.href = '/login';
// //                 return Promise.reject(refreshError);
// //             }
// //         }
// //         return Promise.reject(error);
// //     }
// // );
// //
// // export default axiosInstance;