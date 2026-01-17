import {StateCreator} from 'zustand';
import {Facility, FacilityPagination} from "@/types";
import {
    getFacilities,
    createFacility,
    updateFacility,
    deleteFacilityApi
} from "@/utils/facilities-actions";
import {RoomSlice} from "@/stores/slices/room-slice";

export interface FacilitySlice {
    facilities: Facility[];
    facilityPagination: FacilityPagination;
    isLoadingFacilities: boolean;
    isFacilitySheetOpen: boolean;
    selectedFacility: Facility | null;
    isSubmitting: boolean;
    isDeleting: boolean;

    selectedRoomIdForCreate: string | null;

    // Actions
    fetchFacilities: (page: number) => Promise<void>;
    addFacility: (data: any) => Promise<void>;
    editFacility: (id: string, data: any) => Promise<void>;
    removeFacility: (id: string) => Promise<void>;

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

    fetchFacilities: async (page = 1) => {
        set({isLoadingFacilities: true});
        try {
            const data = await getFacilities(page);
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

    addFacility: async (data) => {
        set({isSubmitting: true});
        try {
            await createFacility(data);
            await get().fetchFacilities(1);
            const currentRooms = get().rooms;
            const updatedRooms = currentRooms.map((room) => {
                if (room._id === data.room) {
                    return {
                        ...room,
                        hasFacility: true,
                    }
                }
                return room;
            });
            set({
                rooms: updatedRooms,
                isFacilitySheetOpen: false,
                isSubmitting: false
            });
        } catch (error) {
            set({isSubmitting: false});
            throw error;
        }
    },

    editFacility: async (id, data) => {
        set({isSubmitting: true});
        try {
            await updateFacility(id, data);
            // await get().fetchFacilities(1); // Refresh list
            await get().fetchFacilities(get().facilityPagination.page);
            set({isFacilitySheetOpen: false, selectedFacility: null, isSubmitting: false});
        } catch (error) {
            set({isSubmitting: false});
            throw error;
        }
    },

    removeFacility: async (id) => {
        set({isDeleting: true});
        const previousFacilities = get().facilities;
        set({facilities: previousFacilities.filter(f => f._id !== id)});

        try {
            await deleteFacilityApi(id);
            const currentPagination = get().facilityPagination
            const currentFacilities = get().facilities;

            if (currentFacilities.length === 0 && currentPagination.page > 1) {
                await get().fetchFacilities(currentPagination.page - 1);
            } else {
                await get().fetchFacilities(currentPagination.page);
            }

        } catch (error) {
            console.log(error);
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