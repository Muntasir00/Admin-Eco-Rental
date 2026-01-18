import { endpoints } from "@/config/paths";
import axios from "@/utils/axios";

export const roomService = {
    // ১. সব রুম আনা
    getAll: async (page: number = 1) => {
        const res = await axios.get(endpoints.rooms.allRooms, {
            params: { page }
        });
        return res.data;
    },

    // ২. সিঙ্গেল রুম আনা
    getById: async (id: string) => {
        const res = await axios.get(`${endpoints.rooms.singleRoom}/${id}`);
        return res.data;
    },

    // ৩. রুম তৈরি করা
    create: async (formData: FormData) => {
        const res = await axios.post(endpoints.rooms.createRoom, formData);
        return res.data;
    },

    // ৪. রুম আপডেট করা
    update: async (id: string, formData: FormData) => {
        const res = await axios.put(`${endpoints.rooms.updateRoom}/${id}`, formData);
        return res.data;
    },

    // ৫. রুম ডিলিট করা
    delete: async (id: string) => {
        const res = await axios.delete(`${endpoints.rooms.delete}/${id}`);
        return res.data;
    }
};