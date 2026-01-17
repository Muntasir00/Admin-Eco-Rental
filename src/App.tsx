import {BrowserRouter, Routes, Route, Navigate} from 'react-router';
import AuthGuard from '@/components/auth/AuthGuard';
import GuestGuard from '@/components/auth/GuestGuard';
import LoginPage from "@/pages/login-page";
import DashboardPage from "@/pages/dashboard-page";
import NotFoundPage from "@/pages/not-found-page";
import Layout from "@/components/layout";
import BlogsPage from "@/pages/blogs-page";
import {Toaster} from "sonner";
import RoomsPage from "@/pages/rooms-page";
import FacilityPage from "@/pages/facility-page";
import BookingListPage from "@/pages/booking-list-page";


function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* --- Public Routes (GuestGuard protects these) --- */}
                <Route
                    path="/login"
                    element={
                        <GuestGuard>
                            <LoginPage/>
                        </GuestGuard>
                    }
                />

                {/* --- Protected Routes (AuthGuard protects these) --- */}
                {/* আপনি চাইলে Layout কম্পোনেন্টও ব্যবহার করতে পারেন */}
                <Route
                    element={
                        <AuthGuard>
                            <Layout/>
                        </AuthGuard>
                    }
                >
                    <Route path="/dashboard" element={<DashboardPage/>}/>
                    <Route path="/blogs" element={<BlogsPage/>}/>
                    <Route path="/rooms" element={<RoomsPage/>}/>
                    <Route path="/facility" element={<FacilityPage/>}/>
                    <Route path="/booking-list" element={<BookingListPage/>}/>
                </Route>

                {/* --- Default Redirect --- */}
                <Route path="/" element={<Navigate to="/dashboard" replace/>}/>

                {/* --- 404 Route --- */}
                <Route path="*" element={<NotFoundPage/>}/>
            </Routes>
            <Toaster position="top-center" richColors/>
        </BrowserRouter>
    );
}

export default App;