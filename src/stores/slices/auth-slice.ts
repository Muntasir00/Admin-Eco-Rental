import {StateCreator} from 'zustand';
import {LoginResponse, User} from "@/types";
import {getAccessToken, setSession, isValidToken} from "@/lib/auth";
import {authService} from "@/services/auth.service";

export interface AuthSlice {
    user: User | null;
    isAuthenticated: boolean;
    isInitialized: boolean;
    loading: boolean;
    error: string | null;

    // Actions
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

    login: async ({email, password}) => {
        set({loading: true, error: null});
        try {
            const response: LoginResponse = await authService.login({email, password}); // signIn call to API

            if (response.user.role !== 'admin') {
                throw new Error('Access Denied: Admin only');
            }

            // এখানে এক্সেস এবং রিফ্রেশ টোকেন দুটোই পাঠাবেন
            setSession(response.accessToken, response.refreshToken);

            set({
                user: response.user,
                isAuthenticated: true,
                loading: false,
            });
        } catch (error: any) {
            set({loading: false, error: error.message});
            throw error;
        }
    },

    initialize: async () => {
        set({loading: true});
        try {
            const accessToken = getAccessToken();
            if (accessToken && isValidToken(accessToken)) {
                setSession(accessToken);
                set({isAuthenticated: true, isInitialized: true});
            } else {
                set({isAuthenticated: false, isInitialized: true});
            }
        } catch {
            set({isAuthenticated: false, isInitialized: true});
        } finally {
            set({loading: false});
        }
    },

    logout: async () => {
        await authService.signOut();
        set({user: null, isAuthenticated: false});
    },
});