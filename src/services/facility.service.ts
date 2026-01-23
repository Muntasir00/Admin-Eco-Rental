// import axios from "@/lib/axios";
import { endpoints } from "@/config/paths";
import { FacilityPayload } from "@/types";
import axios from "@/lib/axios"; // আপনার টাইপ ইমপোর্ট করুন

export const facilityService = {
    // ১. সব ফ্যাসিলিটি আনা
    getAll: async (page: number = 1) => {
        const res = await axios.get(endpoints.facilities.getAllFacilities, {
            params: { page },
        });
        return res.data;
    },

    // ২. তৈরি করা
    create: async (data: FacilityPayload) => {
        const res = await axios.post(endpoints.facilities.createFacilities, data);
        return res.data;
    },

    // ৩. আপডেট করা
    update: async (id: string, data: Partial<FacilityPayload>) => {
        const res = await axios.put(`${endpoints.facilities.updateFacilities}/${id}`, data);
        return res.data;
    },

    // ৪. ডিলিট করা
    delete: async (id: string) => {
        const res = await axios.delete(`${endpoints.facilities.deleteFacilities}/${id}`);
        return res.data;
    }
};