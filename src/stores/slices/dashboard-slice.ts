import { StateCreator} from 'zustand';
import {dashboardService} from "@/services/dashboard.service";

// Define types based on your API response
export interface DashboardCard {
    key: string;
    title: string;
    value: number;
    percent?: number;
    direction?: 'up' | 'down';
}

interface ChartData {
    labels: string[];
    data: number[];
}

export interface DashboardSlice {
    cards: DashboardCard[];
    charts: {
        revenueByMonth: ChartData;
        bookingsByMonth: ChartData;
    } | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchDashboardData: () => Promise<void>;
}

export const createDashboardSlice: StateCreator<DashboardSlice> = (set, get) => ({
    cards: [],
    charts: null,
    isLoading: false,
    error: null,

    fetchDashboardData: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await dashboardService.getAll();
            console.log(response);
            set({
                cards: response.cards,
                charts: response.charts,
                isLoading: false
            });
        } catch (err: any) {
            set({
                error: err.message || 'Failed to fetch dashboard data',
                isLoading: false
            });
        }
    },

});