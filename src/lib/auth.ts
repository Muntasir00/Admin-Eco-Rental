import Cookies from 'js-cookie';
import axios from "@/lib/axios";
import { STORAGE_KEY, REFRESH_KEY } from "@/config/constants";

export function jwtDecode(token: string) {
    try {
        if (!token) return null;
        const parts = token.split('.');
        if (parts.length < 2) return null;
        const base64Url = parts[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(atob(base64));
    } catch (error) {
        return null;
    }
}

export function isValidToken(accessToken: string) {
    if (!accessToken) return false;
    try {
        const decoded = jwtDecode(accessToken);
        if (!decoded || !('exp' in decoded)) return false;
        const currentTime = Date.now() / 1000;
        return decoded.exp > currentTime;
    } catch (error) {
        return false;
    }
}

export const setSession = (accessToken: string | null, refreshToken: string | null = null) => {
    if (accessToken) {
        // Cookie তে সেভ করা (Security: 7 দিন পর এক্সপায়ার হবে, প্রোডাকশনে secure: true যোগ করবেন)
        Cookies.set(STORAGE_KEY, accessToken, { expires: 7 });
        if (refreshToken) {
            Cookies.set(REFRESH_KEY, refreshToken, { expires: 7 });
        }
        axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    } else {
        Cookies.remove(STORAGE_KEY);
        Cookies.remove(REFRESH_KEY);
        delete axios.defaults.headers.common.Authorization;
    }
};

export const getAccessToken = () => Cookies.get(STORAGE_KEY);
export const getRefreshToken = () => Cookies.get(REFRESH_KEY);

// export async function setSession(accessToken: string | null) {
//     try {
//         if (accessToken) {
//             sessionStorage.setItem(STORAGE_KEY, accessToken);
//
//             axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
//
//             const decodedToken = jwtDecode(accessToken); // ~3 days by minimals server
//
//             if (decodedToken && 'exp' in decodedToken) {
//                 tokenExpired(decodedToken.exp);
//             } else {
//                 throw new Error('Invalid access token!');
//             }
//         } else {
//             sessionStorage.removeItem(STORAGE_KEY);
//             delete axios.defaults.headers.common.Authorization;
//         }
//     } catch (error) {
//         console.error('Error during set session:', error);
//         throw error;
//     }
// }

// export async function setSession(accessToken: string | null, refreshToken: string | null = null) {
//     try {
//         if (accessToken) {
//             // ১. Access Token সেভ করা
//             sessionStorage.setItem(STORAGE_KEY, accessToken);
//
//             // ২. Refresh Token সেভ করা (যদি থাকে)
//             if (refreshToken) {
//                 sessionStorage.setItem(REFRESH_KEY, refreshToken);
//             }
//
//             // ৩. Axios এর ডিফল্ট হেডারে টোকেন বসানো
//             axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
//
//         } else {
//             // লগআউট বা টোকেন রিমুভ করার সময়
//             sessionStorage.removeItem(STORAGE_KEY);
//             sessionStorage.removeItem(REFRESH_KEY); // <-- রিফ্রেশ টোকেনও রিমুভ করতে হবে
//             delete axios.defaults.headers.common.Authorization;
//         }
//     } catch (error) {
//         console.error('Error during set session:', error);
//         throw error;
//     }
// }