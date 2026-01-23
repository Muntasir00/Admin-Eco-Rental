import axios from "@/lib/axios";
import { endpoints } from "@/config/paths";

// প্যারামিটারের জন্য টাইপ ডিফাইন করা ভালো
interface GetBookingParams {
    page: number;
    search?: string;
    status?: string;
}

export const bookingService = {
    getAll: async ({ page = 1, search = "", status = "" }: GetBookingParams) => {
        // Record<string, any> ব্যবহার করা any এর চেয়ে নিরাপদ
        const params: Record<string, any> = { page };

        // যদি সার্চ ভ্যালু থাকে
        if (search) {
            params.search = search;
        }

        // যদি স্ট্যাটাস থাকে এবং 'all' না হয়
        if (status && status !== "all") {
            params.status = status;
        }

        const res = await axios.get(endpoints.booking.getAllBookings, { params });
        return res.data;
    }
};