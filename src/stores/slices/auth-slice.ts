import { StateCreator } from 'zustand';
import { User } from "@/types";
import { getAccessToken, setSession, isValidToken, startRefreshTokenTimer } from "@/lib/auth"; // startRefreshTokenTimer ইমপোর্ট করুন
import { authService } from "@/services/auth.service";

// Types based on your JSON
interface LoginResponse {
    success: boolean;
    message: string;
    accessToken: string;
    refreshToken: string;
    accessTokenExp: number;
    refreshTokenExp: number;
    user: User;
}

export interface AuthSlice {
    user: User | null;
    isAuthenticated: boolean;
    isInitialized: boolean;
    loading: boolean;
    error: string | null;
    login: (params: { email: string; password: string }) => Promise<void>;
    logout: () => Promise<void>;
    initialize: () => Promise<void>;
}

export const createAuthSlice: StateCreator<AuthSlice> = (set, get) => ({
    user: null,
    isAuthenticated: false,
    isInitialized: false,
    loading: false,
    error: null,

    login: async ({ email, password }) => {
        set({ loading: true, error: null });
        try {
            // response টাইপ ডিফাইন করা হলো
            const response: LoginResponse = await authService.login({ email, password });

            if (!response.success) {
                throw new Error(response.message || "Login failed");
            }

            if (response.user.role !== 'admin') throw new Error('Access Denied: Admin only');

            if (!response.accessToken || !response.refreshToken) {
                throw new Error("Authentication tokens missing");
            }

            // 1. টোকেন সেশনে সেভ করুন (এটি টাইমারও স্টার্ট করবে)
            setSession(response.accessToken, response.refreshToken);

            // 2. ইউজার ইনফো সেশনে রাখুন (রিফ্রেশের পর ডাটা ধরে রাখার জন্য)
            // exp আলাদা করে রাখার দরকার নেই, কারণ টোকেন ডিকোড করলেই পাওয়া যায়
            sessionStorage.setItem('user_info', JSON.stringify(response.user));
            set({ user: response.user, isAuthenticated: true, isInitialized: true, loading: false });

            // set({ user: response.user, isAuthenticated: true, loading: false });
        } catch (error: any) {
            set({ loading: false, error: error.message });
            throw error;
        }
    },

    initialize: async () => {
        set({ loading: true });
        try {
            const accessToken = getAccessToken();
            const storedUser = sessionStorage.getItem('user_info');

            // টোকেন এবং ইউজার ডাটা দুটোই থাকতে হবে এবং টোকেন ভ্যালিড হতে হবে
            if (accessToken && isValidToken(accessToken)) {

                // পেজ রিফ্রেশ দিলে টাইমার মুছে যায়, তাই initialize এর সময় আবার চালু করতে হবে
                startRefreshTokenTimer(accessToken);

                set({
                    user: storedUser ? JSON.parse(storedUser) : null,
                    isAuthenticated: true,
                    isInitialized: true
                });
            } else {
                // টোকেন না থাকলে সব ক্লিন করুন
                setSession(null, null);
                set({ user: null, isAuthenticated: false, isInitialized: true });
            }
        } catch {
            setSession(null, null);
            set({ user: null, isAuthenticated: false, isInitialized: true });
        } finally {
            set({ loading: false });
        }
    },

    logout: async () => {
        await authService.signOut();
        set({
            user: null,
            isAuthenticated: false,
            isInitialized: true,
            loading: false,
            error: null
        });
    },
});


// import {StateCreator} from 'zustand';
// import {LoginResponse, User} from "@/types";
// import {getAccessToken, setSession, isValidToken} from "@/lib/auth";
// import {authService} from "@/services/auth.service";
//
// export interface AuthSlice {
//     user: User | null;
//     isAuthenticated: boolean;
//     isInitialized: boolean;
//     loading: boolean;
//     error: string | null;
//
//     // Actions
//     login: (params: { email: string; password: string }) => Promise<void>;
//     logout: () => Promise<void>;
//     initialize: () => Promise<void>;
// }
//
// export const createAuthSlice: StateCreator<AuthSlice> = (set, get) => ({
//     user: null,
//     isAuthenticated: false,
//     isInitialized: false,
//     loading: false,
//     error: null,
//
//     // login: async ({email, password}) => {
//     //     set({loading: true, error: null});
//     //     try {
//     //         const response: LoginResponse = await authService.login({email, password}); // signIn call to API
//     //
//     //         if (response.user.role !== 'admin') {
//     //             throw new Error('Access Denied: Admin only');
//     //         }
//     //
//     //         // এখানে এক্সেস এবং রিফ্রেশ টোকেন দুটোই পাঠাবেন
//     //         setSession(response.accessToken, response.refreshToken);
//     //
//     //         set({
//     //             user: response.user,
//     //             isAuthenticated: true,
//     //             loading: false,
//     //         });
//     //     } catch (error: any) {
//     //         set({loading: false, error: error.message});
//     //         throw error;
//     //     }
//     // },
//
//     login: async ({ email, password }) => {
//         set({ loading: true, error: null });
//         try {
//             const response: LoginResponse = await authService.login({ email, password });
//
//             if (response.user.role !== 'admin') throw new Error('Access Denied: Admin only');
//
//             // টোকেন সেভ করা
//             setSession(response.accessToken, response.refreshToken);
//
//             // এক্সপায়ারি টাইম সহ ইউজার অবজেক্ট স্টোর করা (Initialize এ চেক করার জন্য)
//             const userWithExp = { ...response.user, exp: response.accessTokenExp };
//             sessionStorage.setItem('user_info', JSON.stringify(userWithExp));
//
//             set({ user: response.user, isAuthenticated: true, loading: false });
//         } catch (error: any) {
//             set({ loading: false, error: error.message });
//             throw error;
//         }
//     },
//
//     initialize: async () => {
//         set({ loading: true });
//         try {
//             const accessToken = getAccessToken();
//             const storedUser = sessionStorage.getItem('user_info');
//             const userObj = storedUser ? JSON.parse(storedUser) : null;
//
//             // টোকেন আছে কি না এবং তা এখনো ভ্যালিড কি না (API এর expiry time দিয়ে চেক)
//             if (accessToken && userObj && isValidToken(userObj.exp)) {
//                 set({ user: userObj, isAuthenticated: true, isInitialized: true });
//             } else {
//                 // টোকেন এক্সপায়ার হলে সেশন ক্লিন করে দিন
//                 setSession(null);
//                 set({ user: null, isAuthenticated: false, isInitialized: true });
//             }
//         } catch {
//             set({ isAuthenticated: false, isInitialized: true });
//         } finally {
//             set({ loading: false });
//         }
//     },
//
//     // initialize: async () => {
//     //     set({loading: true});
//     //     try {
//     //         const accessToken = getAccessToken();
//     //         if (accessToken && isValidToken(user?.accessTokenExp)) {
//     //             setSession(accessToken);
//     //             set({isAuthenticated: true, isInitialized: true});
//     //         } else {
//     //             set({isAuthenticated: false, isInitialized: true});
//     //         }
//     //     } catch {
//     //         set({isAuthenticated: false, isInitialized: true});
//     //     } finally {
//     //         set({loading: false});
//     //     }
//     // },
//
//     logout: async () => {
//         await authService.signOut();
//         set({user: null, isAuthenticated: false});
//     },
// });

// {
//     "success": true,
//     "message": "Welcome back Admin",
//     "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NGUyYjUxNTRhYWI3OTEwNzIwNGM4NiIsInJvbGUiOiJhZG1pbiIsInR5cGUiOiJhY2Nlc3MiLCJpYXQiOjE3NjkxNjg5MjcsImV4cCI6MTc2OTE3MjUyN30.LHEUuBlaiv80Qua8bGZZJu6j0PvQSK6aAdQtqAaTnQ4",
//     "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NGUyYjUxNTRhYWI3OTEwNzIwNGM4NiIsInR5cGUiOiJyZWZyZXNoIiwianRpIjoiYzJkOGE4NzgtYjVmMC00YWJiLThhZDItMjRhN2E0OWIxYmIzIiwiaWF0IjoxNzY5MTY4OTI3LCJleHAiOjE3NjkxOTA1Mjd9.v5mGGLlLKkt4Cv9LtNjcMHWS8qu2Pxwujrg8D7NLP3k",
//     "accessTokenExp": 1769172527,
//     "refreshTokenExp": 1769190527,
//     "user": {
//     "id": "694e2b5154aab79107204c86",
//         "username": "Admin",
//         "email": "admin@gmail.com",
//         "role": "admin",
//         "isVerified": true
// }
// }