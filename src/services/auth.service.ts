import axios from "@/lib/axios";
import {endpoints} from "@/config/paths";
import {ChangePasswordParams, SignInParams, SignUpParams} from "@/types/auth.types";
import {setSession} from "@/lib/auth";

export const authService = {
    login: async (data: SignInParams) => {
        const res = await axios.post(endpoints.auth.signIn, data);
        const {accessToken} = res.data;

        if (!accessToken) throw new Error('Access token not found');
        return res.data;
    },
    refreshToken: async (token: string) => {
        const res = await axios.post(endpoints.auth.refreshToken, {refreshToken: token});
        return res.data;
    },
    signUp: async ({email, password, username}: SignUpParams) => {
        const res = await axios.post(endpoints.auth.signUp, {email, password, username});
        return res.data;
    },
    verifyOtp: async (email: string, otp: string) => {
        const url = endpoints.auth.verifyOtp.replace(':email', email);
        const res = await axios.post(url, {otp});
        return res.data;
    },
    forgotPassword: async (email: string) => {
        const res = await axios.post(endpoints.auth.forgotPassword, {email});
        return res.data;
    },
    changePassword: async ({email, newPassword, confirmPassword}: ChangePasswordParams) => {
        const url = endpoints.auth.changePassword.replace(':email', email);
        const res = await axios.post(url, {newPassword, confirmPassword});
        return res.data;
    },
    signOut: async () => {
        try {
            await axios.post(endpoints.auth.logout);
        } catch (error) {
            console.error('Error during sign out (server call):', error);
        } finally {
            try {
                setSession(null, null);
                window.location.href = '/login';
            } catch (err) {
                console.error('Error clearing session:', err);
            }
        }
    }
};