import {StateCreator} from 'zustand';
import {LoginResponse, User} from "@/types";
import {STORAGE_KEY} from "@/utils/constant";
import {isValidToken, setSession} from "@/lib/utils";
import {signIn, signOut} from "@/utils/actions";

// ১. টাইপ এক্সপোর্ট করা (Interface)
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

// ২. স্লাইস ক্রিয়েটর ফাংশন
// StateCreator<TotalStoreType, MiddlewareTypes, [], SliceType>
export const createAuthSlice: StateCreator<AuthSlice> = (set, get) => ({
    user: null,
    isAuthenticated: false,
    isInitialized: false,
    loading: false,
    error: null,

    login: async ({email, password}) => {
        set({loading: true, error: null});
        try {
            const response: LoginResponse = await signIn({email, password});

            if (response.user.role !== 'admin') {
                throw new Error('Access Denied: You are not an Admin');
            }

            set({
                user: response.user,
                isAuthenticated: true,
                loading: false,
            });
        } catch (error: any) {
            set({
                loading: false,
                isAuthenticated: false,
                error: error.message || 'Login failed'
            });
            throw error;
        }
    },

    initialize: async () => {
        set({loading: true});
        try {
            const accessToken = sessionStorage.getItem(STORAGE_KEY);
            if (accessToken && isValidToken(accessToken)) {
                setSession(accessToken);
                set({isAuthenticated: true, isInitialized: true});
            } else {
                set({isAuthenticated: false, isInitialized: true, user: null});
            }
        } catch (error:any) {
            set({isAuthenticated: false, isInitialized: true, user: null});
        } finally {
            set({loading: false});
        }
    },

    logout: async () => {
        await signOut();
        set({user: null, isAuthenticated: false});
    },
});