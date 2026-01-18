import {StateCreator} from 'zustand';
import {Room, RoomPagination} from "@/types";
import {roomService} from "@/services/room.service";

export interface RoomSlice {
    rooms: Room[];
    selectedRoom: Room | null;
    roomPagination: RoomPagination;

    // Loading States
    isLoadingRooms: boolean;
    isSubmitting: boolean;
    isDeleting: boolean;

    // UI States
    isRoomSheetOpen: boolean;  // Details View
    isCreateRoomSheetOpen: boolean; // Create/Edit Form

    // Actions (Standardized Naming)
    getRooms: (page?: number) => Promise<void>;
    getRoom: (id: string) => Promise<void>;
    createRoom: (formData: FormData) => Promise<void>; // add -> create
    updateRoom: (id: string, formData: FormData) => Promise<void>; // edit -> update
    deleteRoom: (id: string) => Promise<void>; // remove -> delete

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

    // 1. GET ALL
    getRooms: async (page = 1) => {
        set({ isLoadingRooms: true });
        try {
            const data = await roomService.getAll(page);
            set({
                rooms: data.rooms,
                roomPagination: data.pagination,
                isLoadingRooms: false
            });
        } catch (error) {
            set({ isLoadingRooms: false });
            console.error("Failed to fetch rooms:", error);
        }
    },

    // 2. GET ONE (With Local Cache Check) - Excellent Logic!
    getRoom: async (id: string) => {
        set({ isLoadingRooms: true });
        try {
            // আপনার লজিক: আগে স্টোরে চেক করা হচ্ছে
            const existingRoom = get().rooms.find(r => r._id === id);

            if (existingRoom) {
                set({ selectedRoom: existingRoom, isLoadingRooms: false });
                return;
            }

            // না থাকলে API কল
            const data = await roomService.getById(id);
            set({ selectedRoom: data, isLoadingRooms: false });
        } catch (error) {
            set({ isLoadingRooms: false });
            console.error("Failed to fetch room details:", error);
        }
    },

    // 3. CREATE
    createRoom: async (formData: FormData) => {
        set({ isSubmitting: true });
        try {
            await roomService.create(formData);
            await get().getRooms(1);
            set({ isCreateRoomSheetOpen: false, isSubmitting: false, selectedRoom: null });
        } catch (error) {
            console.error("Failed to create room:", error);
            set({ isSubmitting: false });
            throw error;
        }
    },

    // 4. UPDATE
    updateRoom: async (id, formData) => {
        set({ isSubmitting: true });
        try {
            await roomService.update(id, formData);

            // বর্তমান পেজ রিফ্রেশ
            await get().getRooms(get().roomPagination.page);

            set({ isCreateRoomSheetOpen: false, selectedRoom: null, isSubmitting: false });
        } catch (error) {
            console.error("Failed to update room:", error);
            set({ isSubmitting: false });
            throw error;
        }
    },

    // 5. DELETE (With Optimistic Update & Pagination Fix) - Excellent Logic!
    deleteRoom: async (id) => {
        set({ isDeleting: true });

        const previousRooms = get().rooms;

        // Optimistic UI Update
        set({
            rooms: previousRooms.filter(room => room._id !== id)
        });

        try {
            await roomService.delete(id);

            const currentPagination = get().roomPagination;
            const currentRooms = get().rooms;

            // Pagination Handling Logic
            if (currentRooms.length === 0 && currentPagination.page > 1) {
                await get().getRooms(currentPagination.page - 1);
            } else {
                await get().getRooms(currentPagination.page);
            }

            set({ isDeleting: false });
        } catch (error) {
            console.error(error);
            // Revert state on error
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