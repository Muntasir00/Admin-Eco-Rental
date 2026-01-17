import { useEffect } from 'react';
import { Navigate } from 'react-router';
import { useAppStore } from '@/stores/slices/store';
import * as React from "react";

interface GuestGuardProps {
    children: React.ReactNode;
}

const GuestGuard = ({ children }: GuestGuardProps) => {
    const { isAuthenticated, isInitialized, initialize } = useAppStore();

    useEffect(() => {
        if (!isInitialized) {
            initialize();
        }
    }, [initialize, isInitialized]);

    if (!isInitialized) {
        return <div>Loading...</div>;
    }

    // যদি ইউজার অলরেডি লগইন থাকে, তাকে ড্যাশবোর্ডে পাঠিয়ে দিন
    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
};

export default GuestGuard;