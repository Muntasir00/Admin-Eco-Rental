// import axios from "@/lib/axios";
import {endpoints} from "@/config/paths";
import axios from "@/lib/axios";


export const blogService = {
    // ১. সব ব্লগ আনা
    getAll: async (page: number = 1) => {
        const res = await axios.get(endpoints.blogs.blogs, {
            params: {page}
        });
        // API রেস্পন্স স্ট্রাকচার অনুযায়ী রিটার্ন করবেন
        return res.data.blogs;
    },

    // ২. একটি নির্দিষ্ট ব্লগ আনা
    getById: async (id: string) => {
        const res = await axios.get(`${endpoints.blogs.blogs}/${id}`);
        return res.data.blog;
    },

    // ৩. নতুন ব্লগ তৈরি করা
    create: async (formData: FormData) => {
        // মাল্টিপার্ট ফর্ম ডেটার জন্য হেডার অটোমেটিক সেট হয়, আলাদা করার দরকার নেই
        const res = await axios.post(endpoints.blogs.create, formData);
        return res.data;
    },

    // ৪. ব্লগ আপডেট করা
    update: async (id: string, formData: FormData) => {
        const res = await axios.put(`${endpoints.blogs.update}/${id}`, formData);
        return res.data;
    },

    // ৫. ব্লগ ডিলিট করা
    delete: async (id: string) => {
        const res = await axios.delete(`${endpoints.blogs.delete}/${id}`);
        return res.data;
    }
};