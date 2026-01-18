import axios from "@/lib/axios";
import { STORAGE_KEY, REFRESH_KEY } from "@/config/constants";

export function jwtDecode(token: string) {
    try {
        if (!token) return null;
        const parts = token.split('.');
        if (parts.length < 2) return null;
        const base64Url = parts[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const decoded = JSON.parse(atob(base64));
        return decoded;
    } catch (error) {
        console.error('Error decoding token:', error);
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

export async function setSession(accessToken: string | null, refreshToken: string | null = null) {
    try {
        if (accessToken) {
            localStorage.setItem(STORAGE_KEY, accessToken);
            if (refreshToken) {
                localStorage.setItem(REFRESH_KEY, refreshToken);
            }
            axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        } else {
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem(REFRESH_KEY);
            delete axios.defaults.headers.common.Authorization;
        }
    } catch (error) {
        console.error('Error during set session:', error);
        throw error;
    }
}


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