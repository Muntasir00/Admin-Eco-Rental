import {StateCreator} from 'zustand';
import {Facility, FacilityPagination} from "@/types";
import {RoomSlice} from "@/stores/slices/room-slice";
import {facilityService} from "@/services/facility.service";

export interface FacilitySlice {
    facilities: Facility[];
    facilityPagination: FacilityPagination;

    // Loading States
    isLoadingFacilities: boolean;
    isSubmitting: boolean;
    isDeleting: boolean;

    // UI States
    isFacilitySheetOpen: boolean;
    selectedFacility: Facility | null;
    selectedRoomIdForCreate: string | null;

    // Actions
    getFacilities: (page: number) => Promise<void>;
    createFacility: (data: any) => Promise<void>;
    updateFacility: (id: string, data: any) => Promise<void>;
    deleteFacility: (id: string) => Promise<void>;

    setFacilitySheetOpen: (open: boolean, facility?: Facility | null, roomId?: string) => void;
}

type StoreState = FacilitySlice & RoomSlice;

export const createFacilitySlice: StateCreator<StoreState, [], [], FacilitySlice> = (set, get) => ({
    facilities: [],
    facilityPagination: {total: 0, page: 1, limit: 10, totalPages: 1},
    isLoadingFacilities: false,
    isFacilitySheetOpen: false,
    selectedFacility: null,
    isSubmitting: false,
    selectedRoomIdForCreate: null,
    isDeleting: false,

    getFacilities: async (page = 1) => {
        set({isLoadingFacilities: true});
        try {
            const data = await facilityService.getAll(page);
            set({
                facilities: data.facilities,
                facilityPagination: data.pagination,
                isLoadingFacilities: false
            });
        } catch (error) {
            set({isLoadingFacilities: false});
            console.error(error);
        }
    },

    createFacility: async (data) => {
        set({isSubmitting: true});
        try {
            await facilityService.create(data);
            // লিস্ট রিফ্রেশ
            await get().getFacilities(1);

            // 🔥 Cross-Slice Logic: RoomSlice এর rooms আপডেট করা
            // যেহেতু set() গ্লোবাল স্টেটে কাজ করে, তাই আমরা এখানে rooms আপডেট করতে পারছি
            const currentRooms = get().rooms;
            if (currentRooms && currentRooms.length > 0) {
                const updatedRooms = currentRooms.map((room) => {
                    if (room._id === data.room) {
                        return {...room, hasFacility: true};
                    }
                    return room;
                });
                // TypeScript এরর এড়াতে 'as any' বা Partial ব্যবহার করা যেতে পারে যদি টাইপ না মিলে
                set({rooms: updatedRooms} as Partial<StoreState>);
            }

            set({
                isFacilitySheetOpen: false,
                isSubmitting: false,
                selectedRoomIdForCreate: null // রিসেট করা ভালো
            });
        } catch (error) {
            set({isSubmitting: false});
            throw error;
        }
    },

    updateFacility: async (id, data) => {
        set({isSubmitting: true});
        try {
            await facilityService.update(id, data);

            // বর্তমান পেজ রিফ্রেশ
            await get().getFacilities(get().facilityPagination.page);

            set({isFacilitySheetOpen: false, selectedFacility: null, isSubmitting: false});
        } catch (error) {
            set({isSubmitting: false});
            throw error;
        }
    },

    deleteFacility: async (id) => {
        set({isDeleting: true});

        const previousFacilities = get().facilities;

        // Optimistic Update
        set({facilities: previousFacilities.filter(f => f._id !== id)});

        try {
            await facilityService.delete(id);

            const currentPagination = get().facilityPagination;
            const currentFacilities = get().facilities; // Already filtered

            // Pagination Logic
            if (currentFacilities.length === 0 && currentPagination.page > 1) {
                await get().getFacilities(currentPagination.page - 1);
            } else {
                await get().getFacilities(currentPagination.page);
            }

            set({isDeleting: false});
        } catch (error) {
            console.error(error);
            // Revert on error
            set({
                facilities: previousFacilities,
                isDeleting: false
            });
            throw error;
        }
    },

    setFacilitySheetOpen: (open, facility = null, roomId = "") => {
        set({isFacilitySheetOpen: open, selectedFacility: facility, selectedRoomIdForCreate: roomId || null});
    }
});