import axios, {endpoints} from "@/utils/axios";

export const getBookings = async (page: number = 1, search: string = "", status: string = "") => {
    const params: any = {page};

    // যদি সার্চ ভ্যালু থাকে তবেই প্যারামে যোগ হবে
    if (search) params.search = search;

    // যদি স্ট্যাটাস থাকে এবং সেটা 'all' না হয়
    if (status && status !== "all") params.status = status;

    const res = await axios.get(endpoints.booking.getAllBookings, {params});
    return res.data;
};