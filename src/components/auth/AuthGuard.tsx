import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router';
import {useAppStore} from "@/stores/slices/store";
import * as React from "react";

interface AuthGuardProps {
    children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
    const { isAuthenticated, isInitialized } = useAppStore();
    const location = useLocation();

    // 1. App load হওয়ার সাথে সাথে সেশন চেক করা
    // useEffect(() => {
    //     if (!isInitialized) {
    //         initialize();
    //     }
    // }, [initialize, isInitialized]);

    // 2. লোডিং স্টেট হ্যান্ডেল করা (সেশন চেক চলাকালীন)
    if (!isInitialized) {
        return <div className="flex h-screen w-full items-center justify-center">Loading...</div>;
    }

    // 3. যদি ইউজার লগইন না থাকে, তবে লগইন পেজে রিডাইরেক্ট করুন
    if (!isAuthenticated) {
        // state={{ from: location }} ব্যবহার করা হয় যাতে লগইন করার পর
        // ইউজারকে আবার আগের পেজে ফেরত পাঠানো যায়।
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 4. সব ঠিক থাকলে চাইল্ড কম্পোনেন্ট রেন্ডার করুন
    return <>{children}</>;
};

export default AuthGuard;