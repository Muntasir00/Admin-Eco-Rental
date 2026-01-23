import Cookies from 'js-cookie';
import axios from 'axios';
import { CONFIG } from "@/utils/config-global";
import { endpoints } from "@/config/paths";
import { STORAGE_KEY, REFRESH_KEY } from "@/config/constants";

// টাইমার আইডি স্টোর করার জন্য
let refreshTokenTimeoutId: NodeJS.Timeout | null = null;

// =========================================================
// ১. টোকেন ডিকোড করার ইউটিলিটি (আলাদা লাইব্রেরি লাগবে না)
// =========================================================
export const parseJwt = (token: string) => {
    try {
        if (!token) return null;
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
};

// =========================================================
// ২. সেশন সেট এবং টাইমার হ্যান্ডলিং
// =========================================================
export const setSession = (accessToken: string | null, refreshToken: string | null = null) => {
    if (accessToken) {
        // কুকিতে সেভ (৭ দিন বা আপনার লজিক অনুযায়ী)
        Cookies.set(STORAGE_KEY, accessToken, { expires: 7, secure: true, sameSite: 'strict' });

        if (refreshToken) {
            Cookies.set(REFRESH_KEY, refreshToken, { expires: 7, secure: true, sameSite: 'strict' });
        }

        // টোকেন সেট হওয়ার সাথে সাথে টাইমার স্টার্ট করুন
        startRefreshTokenTimer(accessToken);
    } else {
        // লগআউট বা সেশন ক্লিয়ার
        Cookies.remove(STORAGE_KEY);
        Cookies.remove(REFRESH_KEY);
        sessionStorage.removeItem('user_info');
        stopRefreshTokenTimer();
    }
};

export const getAccessToken = () => Cookies.get(STORAGE_KEY);
export const getRefreshToken = () => Cookies.get(REFRESH_KEY);

// =========================================================
// ৩. টাইমার লজিক (আপনার ২ ঘন্টা ৫৯ মিনিটের লজিক এখানে)
// =========================================================
export const startRefreshTokenTimer = (token: string) => {
    // পুরনো টাইমার থাকলে ক্লিয়ার করুন
    stopRefreshTokenTimer();

    const decoded = parseJwt(token);

    // যদি টোকেন বা exp না থাকে, তাহলে কিছু করার নেই
    if (!decoded || !decoded.exp) return;

    // সার্ভারের exp থাকে সেকেন্ডে, তাই ১০০০ দিয়ে গুণ করে মিলি-সেকেন্ড করা হলো
    const expiresAt = decoded.exp * 1000;
    const currentTime = Date.now();

    // টোকেন এক্সপায়ার হওয়ার ১ মিনিট (60000 ms) আগে আমরা রিফ্রেশ কল করব
    // তাহলে ৩ ঘন্টার টোকেন হলে ২ ঘন্টা ৫৯ মিনিটে কল হবে।
    const bufferTime = 60000;
    const timeLeft = expiresAt - currentTime - bufferTime;

    console.log(`Token refresh scheduled in ${(timeLeft / 60000).toFixed(2)} minutes`);

    if (timeLeft > 0) {
        refreshTokenTimeoutId = setTimeout(async () => {
            try {
                const currentRefreshToken = getRefreshToken();
                if (currentRefreshToken) {
                    // এখানে axiosInstance ব্যবহার করবেন না, raw axios ব্যবহার করবেন
                    // কারণ ইন্টারসেপ্টর লুপে পড়ে যেতে পারে
                    const response = await axios.post(`${CONFIG.site.serverUrl}${endpoints.auth.refreshToken}`, {
                        refreshToken: currentRefreshToken
                    });

                    // আপনার JSON রেসপন্স অনুযায়ী ডাটা এক্সট্রাক্ট করা
                    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

                    // নতুন টোকেন সেভ (এটি আবার নতুন টাইমার চালু করবে রিকার্সিভলি)
                    setSession(newAccessToken, newRefreshToken || currentRefreshToken);

                    console.log("✅ Token Refreshed Automatically via Timer");
                }
            } catch (error) {
                console.error("❌ Auto Refresh Failed:", error);
                // ফেইল করলে কি করবেন? সাধারণত ইউজারকে লগইন পেজে না পাঠিয়ে
                // পরের বার যখন ইউজার রিকোয়েস্ট করবে তখন 401 Interceptor হ্যান্ডেল করবে।
            }
        }, timeLeft);
    }
};

export const stopRefreshTokenTimer = () => {
    if (refreshTokenTimeoutId) {
        clearTimeout(refreshTokenTimeoutId);
        refreshTokenTimeoutId = null;
    }
};

export const isValidToken = (accessToken: string) => {
    if (!accessToken) return false;
    const decoded = parseJwt(accessToken);
    if (!decoded || !decoded.exp) return false;
    return (decoded.exp * 1000) > Date.now();
};


// import Cookies from 'js-cookie';
// import axios from "@/lib/axios";
// import { STORAGE_KEY, REFRESH_KEY } from "@/config/constants";
//
// export function jwtDecode(token: string) {
//     try {
//         if (!token) return null;
//         const parts = token.split('.');
//         if (parts.length < 2) return null;
//         const base64Url = parts[1];
//         const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//         return JSON.parse(atob(base64));
//     } catch (error) {
//         return null;
//     }
// }
//
// export function isValidToken(exp: number | null | undefined) {
//     if (!exp) return false;
//     const currentTime = Math.floor(Date.now() / 1000);
//     console.log(exp > currentTime)
//     alert(exp > currentTime)
//     return exp > currentTime;
// }
//
// // export function isValidToken(accessTokenExp: number) {
// //     if (!accessTokenExp) return false;
// //     try {
// //         const decoded = jwtDecode(accessTokenExp);
// //         if (!decoded || !('exp' in decoded)) return false;
// //         const currentTime = Date.now() / 1000;
// //         return decoded.exp > currentTime;
// //     } catch (error) {
// //         return false;
// //     }
// // }
//
// export const setSession = (accessToken: string | null, refreshToken: string | null = null) => {
//     if (accessToken) {
//         Cookies.set(STORAGE_KEY, accessToken, { expires: 7, secure: true, sameSite: 'strict' });
//         if (refreshToken) Cookies.set(REFRESH_KEY, refreshToken, { expires: 7, secure: true, sameSite: 'strict'  });
//     } else {
//         Cookies.remove(STORAGE_KEY);
//         Cookies.remove(REFRESH_KEY);
//         sessionStorage.removeItem('app-storage');
//     }
// };
//
// // export const setSession = (accessToken: string | null, refreshToken: string | null = null) => {
// //     if (accessToken) {
// //         // Cookie তে সেভ করা (Security: 7 দিন পর এক্সপায়ার হবে, প্রোডাকশনে secure: true যোগ করবেন)
// //         Cookies.set(STORAGE_KEY, accessToken, { expires: 7 });
// //         if (refreshToken) {
// //             Cookies.set(REFRESH_KEY, refreshToken, { expires: 7 });
// //         }
// //         axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
// //     } else {
// //         Cookies.remove(STORAGE_KEY);
// //         Cookies.remove(REFRESH_KEY);
// //         delete axios.defaults.headers.common.Authorization;
// //     }
// // };
//
// export const getAccessToken = () => Cookies.get(STORAGE_KEY);
// export const getRefreshToken = () => Cookies.get(REFRESH_KEY);
//
// // export async function setSession(accessToken: string | null) {
// //     try {
// //         if (accessToken) {
// //             sessionStorage.setItem(STORAGE_KEY, accessToken);
// //
// //             axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
// //
// //             const decodedToken = jwtDecode(accessToken); // ~3 days by minimals server
// //
// //             if (decodedToken && 'exp' in decodedToken) {
// //                 tokenExpired(decodedToken.exp);
// //             } else {
// //                 throw new Error('Invalid access token!');
// //             }
// //         } else {
// //             sessionStorage.removeItem(STORAGE_KEY);
// //             delete axios.defaults.headers.common.Authorization;
// //         }
// //     } catch (error) {
// //         console.error('Error during set session:', error);
// //         throw error;
// //     }
// // }
//
// // export async function setSession(accessToken: string | null, refreshToken: string | null = null) {
// //     try {
// //         if (accessToken) {
// //             // ১. Access Token সেভ করা
// //             sessionStorage.setItem(STORAGE_KEY, accessToken);
// //
// //             // ২. Refresh Token সেভ করা (যদি থাকে)
// //             if (refreshToken) {
// //                 sessionStorage.setItem(REFRESH_KEY, refreshToken);
// //             }
// //
// //             // ৩. Axios এর ডিফল্ট হেডারে টোকেন বসানো
// //             axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
// //
// //         } else {
// //             // লগআউট বা টোকেন রিমুভ করার সময়
// //             sessionStorage.removeItem(STORAGE_KEY);
// //             sessionStorage.removeItem(REFRESH_KEY); // <-- রিফ্রেশ টোকেনও রিমুভ করতে হবে
// //             delete axios.defaults.headers.common.Authorization;
// //         }
// //     } catch (error) {
// //         console.error('Error during set session:', error);
// //         throw error;
// //     }
// // }