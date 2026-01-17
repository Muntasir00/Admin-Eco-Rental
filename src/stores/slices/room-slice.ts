import {StateCreator} from 'zustand';
import {Room, RoomPagination} from "@/types";
import {getRooms, getRoom, createRoom, updateRoom, deleteRoom} from "@/utils/rooms-actions";

export interface RoomSlice {
    rooms: Room[];
    selectedRoom: Room | null;
    roomPagination: RoomPagination;
    isLoadingRooms: boolean;
    isRoomSheetOpen: boolean;
    isCreateRoomSheetOpen: boolean;
    isSubmitting: boolean;
    isDeleting: boolean;

    fetchRooms: (page?: number) => Promise<void>;
    fetchRoom: (id: string) => Promise<void>;
    addRoom: (formData: FormData) => Promise<void>;
    editRoom: (id: string, formData: FormData) => Promise<void>;
    removeRoom: (id: string) => Promise<void>;

    setCreateRoomSheetOpen: (open: boolean, room?: Room | null) => void;
    setRoomSheetOpen: (open: boolean, room?: Room | null) => void;
}

export const createRoomSlice: StateCreator<RoomSlice> = (set, get) => ({
    rooms: [],
    selectedRoom: null,
    roomPagination: {total: 0, page: 1, limit: 10, totalPages: 1},
    isLoadingRooms: false,
    isRoomSheetOpen: false,
    isCreateRoomSheetOpen: false,
    isSubmitting: false,
    isDeleting: false,

    fetchRooms: async (page = 1) => {
        set({isLoadingRooms: true});
        try {
            const data = await getRooms(page);
            set({
                rooms: data.rooms,
                roomPagination: data.pagination,
                isLoadingRooms: false
            });
        } catch (error) {
            set({isLoadingRooms: false});
            console.error("Failed to fetch rooms:", error);
        }
    },

    fetchRoom: async (id: string) => {
        set({isLoadingRooms: true});
        try {
            const existingRoom = get().rooms.find(r => r._id === id);
            if (existingRoom) {
                set({selectedRoom: existingRoom, isLoadingRooms: false});
                return;
            }
            const data = await getRoom(id);
            set({selectedRoom: data, isLoadingRooms: false});
        } catch (error) {
            set({isLoadingRooms: false});
            console.error("Failed to fetch room details:", error);
        }
    },

    addRoom: async (formData: FormData) => {
        set({isSubmitting: true});
        try {
            await createRoom(formData);
            await get().fetchRooms(1);
            set({isCreateRoomSheetOpen: false, isSubmitting: false, selectedRoom: null});
        } catch (error) {
            console.error("Failed to create room:", error);
            set({isSubmitting: false});
            throw error;
        }
    },

    editRoom: async (id, formData) => {
        set({isSubmitting: true});
        try {
            await updateRoom(id, formData); // API Call

            // যেই পেজে আছেন সেই পেজটি রিফ্রেশ হবে
            await get().fetchRooms(get().roomPagination.page);

            // শিট বন্ধ করা এবং সিলেকশন ক্লিয়ার করা
            set({isCreateRoomSheetOpen: false, selectedRoom: null, isSubmitting: false});
        } catch (error) {
            console.error("Failed to update room:", error);
            set({isSubmitting: false});
            throw error;
        }
    },

    removeRoom: async (id) => {
        set({ isDeleting: true });
        const previousRooms = get().rooms;
        set({
            rooms: previousRooms.filter(room => room._id !== id)
        });

        try {
            await deleteRoom(id);

            // ৩. লজিক: এখন কোন পেজ রিফ্রেশ করব?
            const currentPagination = get().roomPagination;
            const currentRooms = get().rooms; // ডিলিট করার পর এখন কয়টা আছে

            // চেক: যদি এই পেজে আর কোনো ডাটা না থাকে এবং আমরা ১ নম্বর পেজে না থাকি
            // (যেমন: পেজ ২ এ ১টি আইটেম ছিল, সেটা ডিলিট করলে পেজ ১ এ পাঠানো উচিত)
            if (currentRooms.length === 0 && currentPagination.page > 1) {
                await get().fetchRooms(currentPagination.page - 1);
            } else {
                // সাধারণ ক্ষেত্রে: যেই পেজে আছি, সেই পেজের ডাটা আবার আনব
                // এতে ২য় পেজের ডাটা এসে ১ নম্বর পেজের গ্যাপ পূরণ করবে
                await get().fetchRooms(currentPagination.page);
            }

            set({ isDeleting: false });
        } catch (error) {
            console.log(error);
            set({
                rooms: previousRooms,
                isDeleting: false
            });
            throw error;
        }
    },

    setCreateRoomSheetOpen: (open, room = null) => {
        set({isCreateRoomSheetOpen: open, selectedRoom: room});
    },

    setRoomSheetOpen: (open, room = null) => {
        set({isRoomSheetOpen: open, selectedRoom: room});
    }
});