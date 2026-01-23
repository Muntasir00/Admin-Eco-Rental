import {endpoints} from "@/config/paths";
import axios from "@/lib/axios";


export const dashboardService = {
    // ১. সব ব্লগ আনা
    getAll: async () => {
        const res = await axios.get(endpoints.dashboard.overview);
        // API রেস্পন্স স্ট্রাকচার অনুযায়ী রিটার্ন করবেন
        return res.data;
    },
}