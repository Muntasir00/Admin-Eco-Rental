import {create} from 'zustand';
import {devtools, persist} from 'zustand/middleware';
import {AuthSlice, createAuthSlice} from "@/stores/slices/auth-slice";
import {BlogSlice, createBlogSlice} from "@/stores/slices/blog-slice";
import {RoomSlice, createRoomSlice} from "@/stores/slices/room-slice";

// ১. সব স্লাইসের টাইপ এখানে জোড়া দিন
// ভবিষ্যতে CartSlice থাকলে: export type AppStore = AuthSlice & CartSlice;
export type AppStore = AuthSlice & BlogSlice & RoomSlice;

// ২. স্টোর তৈরি করা
export const useAppStore = create<AppStore>()(
    devtools(
        persist(
            (...a) => ({
                // এখানে স্প্রেড অপারেটর দিয়ে স্লাইসগুলো কল করতে হয়
                ...createAuthSlice(...a),
                ...createBlogSlice(...a),
                ...createRoomSlice(...a)

                // ভবিষ্যতে আরও স্লাইস থাকলে:
                // ...createCartSlice(...a),
            }),
            {
                name: 'app-storage', // লোকাল স্টোরেজে এই নামে সেভ হবে

                // (Optional) আপনি চাইলে শুধুমাত্র নির্দিষ্ট অংশ persist করতে পারেন
                // partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
            }
        )
    )
);