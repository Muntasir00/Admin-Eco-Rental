import React, {useEffect} from 'react';
import {
    Calendar, LogIn, LogOut,
} from 'lucide-react';
import MetricCard from "@/components/dashboard/metric-card";
import StatCard from "@/components/dashboard/stat-card";
import RecentBookings from "@/components/dashboard/recent-bookings";
import {SalesRevenueChart} from "@/components/dashboard/sales-revenue-chart";
import {useAppStore} from "@/stores/slices/store";
import MetricCardSkeleton from "@/components/dashboard/metric-card-skeleton";
import StatCardSkeleton from "@/components/dashboard/stat-card-skeleton";
import RecentBookingsSkeleton from "@/components/dashboard/recent-bookings-skeleton";


export default function DashboardPage() {
    const {cards, isLoading, fetchDashboardData, bookings, getBookings} = useAppStore();

    useEffect(() => {
        fetchDashboardData();
        getBookings()
    }, []);

    // 1. Filter for MetricCards (Total Booking, Rooms Available, Total Revenue)
    const metricKeys = ['totalBookings', 'roomsAvailable', 'revenue'];
    const metricData = cards.filter(card => metricKeys.includes(card.key));

    // 2. Filter for StatCards (New Bookings, Check-ins, Check-outs)
    // We map these to match the StatCard expected props
    const statKeys = ['newBookings', 'checkIn', 'checkOut'];
    const statData = cards.filter(card => statKeys.includes(card.key));

    const getIcon = (key: string) => {
        switch (key) {
            case 'newBookings':
                return Calendar;
            case 'checkIn':
                return LogIn;
            case 'checkOut':
                return LogOut;
            default:
                return Calendar;
        }
    };

    return (
        <div className="  font-sans text-gray-800">

            {/* --- NEW SECTION: Sales Revenue & Stats (Second Image) --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

                {/* Left Column: 3 Small Cards */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    {
                        isLoading ?
                            <>
                                <MetricCardSkeleton/>
                                <MetricCardSkeleton/>
                                <MetricCardSkeleton/>
                            </> :
                            metricData.map((stat) => (
                                <MetricCard
                                    key={stat.key}
                                    title={stat.title}
                                    value={stat.key === 'revenue' ? `$${stat.value.toLocaleString()}` : stat.value}
                                    // API doesn't provide sub1/sub2 yet, using placeholders or omitting
                                    sub1="Data from API"
                                    sub2="Current"
                                />
                            ))}
                </div>

                <div className="lg:col-span-2 flex flex-col justify-between h-full">
                    <SalesRevenueChart/>
                </div>

            </div>

            {/* Top Row: Stats & Rating */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6 mb-8">

                {/* Metric Cards */}
                {
                    isLoading ?
                        <>
                            <StatCardSkeleton/>
                            <StatCardSkeleton/>
                            <StatCardSkeleton/>
                        </> :
                        statData.map((stat) => (
                            <StatCard
                                key={stat.key}
                                title={stat.title}
                                value={stat.value}
                                period="Since last update"
                                icon={getIcon(stat.key)}
                                isDown={stat.direction === 'down'}
                                type={stat.key === 'newBookings' ? 'primary' : 'default'}
                            />
                        ))}

            </div>

            {/* Bottom Row: Table & Feedback */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* Booking List Table */}
                {
                    (isLoading || !bookings) ?
                        <RecentBookingsSkeleton/>
                        :
                        <RecentBookings bookings={bookings}/>
                }

            </div>
        </div>
    )
}