import { StateCreator } from 'zustand';
import { Booking, BookingPagination } from "@/types/booking";
import { getBookings } from "@/utils/booking-actions";

export interface BookingSlice {
    bookings: Booking[];
    bookingPagination: BookingPagination;
    isLoadingBookings: boolean;
    selectedBooking: Booking | null;
    isBookingSheetOpen: boolean;

    // ১. ফিল্টার স্টেট যোগ করা
    bookingFilters: {
        search: string;
        status: string;
    };

    // Actions
    fetchBookings: (page?: number) => Promise<void>;
    setBookingSheetOpen: (open: boolean, booking?: Booking | null) => void;

    // ২. ফিল্টার আপডেট করার অ্যাকশন
    setBookingFilters: (filters: Partial<{ search: string; status: string }>) => void;
}

export const createBookingSlice: StateCreator<BookingSlice> = (set, get) => ({
    bookings: [],
    bookingPagination: { total: 0, page: 1, limit: 10, totalPages: 1 },
    isLoadingBookings: false,
    selectedBooking: null,
    isBookingSheetOpen: false,

    // ডিফল্ট ফিল্টার
    bookingFilters: {
        search: "",
        status: "all"
    },

    fetchBookings: async (page = 1) => {
        set({ isLoadingBookings: true });

        // ৩. বর্তমান ফিল্টার স্টেট থেকে ভ্যালু নেওয়া
        const { search, status } = get().bookingFilters;

        try {
            // API তে search ও status পাঠানো
            const data = await getBookings(page, search, status);
            set({
                bookings: data.bookings,
                bookingPagination: data.pagination,
                isLoadingBookings: false
            });
        } catch (error) {
            set({ isLoadingBookings: false });
            console.error("Failed to fetch bookings:", error);
        }
    },

    setBookingSheetOpen: (open, booking = null) => {
        set({ isBookingSheetOpen: open, selectedBooking: booking });
    },

    // ৪. ফিল্টার সেট করার লজিক (সাথে সাথে পেজ ১ এ রিসেট হবে)
    setBookingFilters: (newFilters) => {
        set((state) => ({
            bookingFilters: { ...state.bookingFilters, ...newFilters }
        }));
        // ফিল্টার চেঞ্জ হলে ১ নম্বর পেজ থেকে ডাটা আনবে
        get().fetchBookings(1);
    }
});

// import { StateCreator } from 'zustand';
// import { Booking, BookingPagination } from "@/types/booking";
// import { getBookings } from "@/utils/booking-actions";
//
// export interface BookingSlice {
//     bookings: Booking[];
//     bookingPagination: BookingPagination;
//     isLoadingBookings: boolean;
//
//     // UI State for Details View
//     selectedBooking: Booking | null;
//     isBookingSheetOpen: boolean;
//
//     // Actions
//     fetchBookings: (page?: number) => Promise<void>;
//     setBookingSheetOpen: (open: boolean, booking?: Booking | null) => void;
// }
//
// export const createBookingSlice: StateCreator<BookingSlice> = (set, get) => ({
//     bookings: [],
//     bookingPagination: { total: 0, page: 1, limit: 10, totalPages: 1 },
//     isLoadingBookings: false,
//     selectedBooking: null,
//     isBookingSheetOpen: false,
//
//     fetchBookings: async (page = 1) => {
//         set({ isLoadingBookings: true });
//         try {
//             const data = await getBookings(page);
//             set({
//                 bookings: data.bookings,
//                 bookingPagination: data.pagination,
//                 isLoadingBookings: false
//             });
//         } catch (error) {
//             set({ isLoadingBookings: false });
//             console.error("Failed to fetch bookings:", error);
//         }
//     },
//
//     setBookingSheetOpen: (open, booking = null) => {
//         set({ isBookingSheetOpen: open, selectedBooking: booking });
//     }
// });