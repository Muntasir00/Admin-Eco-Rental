import { StateCreator } from 'zustand';
import { Booking, BookingPagination } from "@/types/booking";
import {bookingService} from "@/services/booking.service";

export interface BookingSlice {
    bookings: Booking[];
    bookingPagination: BookingPagination;
    isLoadingBookings: boolean;
    selectedBooking: Booking | null;
    isBookingSheetOpen: boolean;

    bookingFilters: {
        search: string;
        status: string;
    };

    // Actions
    getBookings: (page?: number) => Promise<void>;
    setBookingSheetOpen: (open: boolean, booking?: Booking | null) => void;
    setBookingFilters: (filters: Partial<{ search: string; status: string }>) => void;
}

export const createBookingSlice: StateCreator<BookingSlice> = (set, get) => ({
    bookings: [],
    bookingPagination: { total: 0, page: 1, limit: 10, totalPages: 1 },
    isLoadingBookings: false,
    selectedBooking: null,
    isBookingSheetOpen: false,

    bookingFilters: {
        search: "",
        status: "all"
    },

    getBookings: async (page = 1) => {
        set({ isLoadingBookings: true });

        const { search, status } = get().bookingFilters;

        try {
            // API তে search ও status পাঠানো
            const data = await bookingService.getAll({ page, search, status });
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

    setBookingFilters: (newFilters) => {
        set((state) => ({
            bookingFilters: { ...state.bookingFilters, ...newFilters }
        }));
        get().getBookings(1);
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