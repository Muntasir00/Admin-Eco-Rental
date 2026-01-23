import {create} from 'zustand';
import {devtools, persist} from 'zustand/middleware';
import {AuthSlice, createAuthSlice} from "@/stores/slices/auth-slice";
import {BlogSlice, createBlogSlice} from "@/stores/slices/blog-slice";
import {RoomSlice, createRoomSlice} from "@/stores/slices/room-slice";
import {FacilitySlice, createFacilitySlice} from "@/stores/slices/facility-slice";
import {BookingSlice,createBookingSlice} from "@/stores/slices/booking-slice"
import {DashboardSlice, createDashboardSlice} from "@/stores/slices/dashboard-slice"

export type AppStore = AuthSlice & BlogSlice & RoomSlice & FacilitySlice & BookingSlice & DashboardSlice;

export const useAppStore = create<AppStore>()(
    devtools(
        persist(
            (...a) => ({
                ...createAuthSlice(...a),
                ...createBlogSlice(...a),
                ...createRoomSlice(...a),
                ...createFacilitySlice(...a),
                ...createBookingSlice(...a),
                ...createDashboardSlice(...a),
            }),
            {
                name: 'app-storage', // লোকাল স্টোরেজে এই নামে সেভ হবে

                // (Optional) আপনি চাইলে শুধুমাত্র নির্দিষ্ট অংশ persist করতে পারেন
                // partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
            }
        )
    )
);