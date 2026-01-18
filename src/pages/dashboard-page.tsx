import React from 'react';
import {
    Calendar, LogIn, LogOut, DollarSign,
} from 'lucide-react';
import MetricCard from "@/components/dashboard/metric-card";
import StatCard from "@/components/dashboard/stat-card";
import {ReservationChart} from "@/components/dashboard/reservation-chart";
import {BookingChart} from "@/components/dashboard/booking-chart";
import FeedbackList from "@/components/dashboard/feedback-list";
import BookingList from "@/components/dashboard/bookling-list";
import {SalesRevenueChart} from "@/components/dashboard/sales-revenue-chart";
import RatingCard from "@/components/dashboard/rating-card";


const statsData = [
    {title: "New Bookings", value: "604", change: "+8.70%", period: "From Last Week", type: "primary", icon: Calendar},
    {title: "Check In", value: "405", change: "+8.70%", period: "From Last Week", type: "default", icon: LogIn},
    {
        title: "Check Out",
        value: "333",
        change: "-8.70%",
        period: "From Last Week",
        type: "default",
        icon: LogOut,
        isDown: true
    },
    {
        title: "Total Revenue",
        value: "$14,400,000",
        change: "+8.70%",
        period: "From Last Week",
        type: "default",
        icon: DollarSign
    },
];

const bookingList = [
    {
        id: "GA-33456",
        name: "Alexander",
        type: "Deluxe",
        typeColor: "bg-orange-400",
        room: "#001",
        duration: "6 Nights",
        dates: "12/02/2022 - 16/02/2022",
        status: "Check-In",
        statusColor: "bg-green-100 text-green-600"
    },
    {
        id: "GA-33446",
        name: "Pegasus",
        type: "Standard",
        typeColor: "bg-green-400",
        room: "#002",
        duration: "4 Nights",
        dates: "20/04/2024 - 24/04/2024",
        status: "Check-Out",
        statusColor: "bg-red-100 text-red-600"
    },
    {
        id: "GA-34456",
        name: "Martin",
        type: "Suite",
        typeColor: "bg-purple-400",
        room: "#003",
        duration: "8 Nights",
        dates: "01/08/2025 - 08/08/2025",
        status: "Pending",
        statusColor: "bg-blue-100 text-blue-600"
    },
];

const leftSideStats = [
    {title: "Total Booking", value: "10,829", sub1: "1892 This Month", sub2: "1029 This Week"},
    {title: "Rooms Available", value: "109", sub1: "241 Booked (M)", sub2: "191 Booked (W)"},
    {title: "Expenses", value: "$72,283.12", sub1: "$3,289.89 This Month", sub2: "$1,198.64 This Week"},
];

const dashboardFeedbacks = [
    {
        id: 1,
        name: "Mark",
        comment: "Food could be better.",
        initial: "A201",
        color: "bg-indigo-500"
    },
    {
        id: 2,
        name: "Christian",
        comment: "Facilities are not enough for amount paid.",
        initial: "A101",
        color: "bg-purple-500"
    },
    {
        id: 3,
        name: "Alexander",
        comment: "Room cleaning could be better.",
        initial: "A301",
        color: "bg-blue-500"
    },
];


export default function DashboardPage() {
    return (
        <div className="  font-sans text-gray-800">

            {/* --- NEW SECTION: Sales Revenue & Stats (Second Image) --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

                {/* Left Column: 3 Small Cards */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    {leftSideStats.map((stat, idx) => (
                        <MetricCard key={idx} {...stat} />
                    ))}
                </div>

                <div className="lg:col-span-2 flex flex-col justify-between h-full">
                    <SalesRevenueChart/>
                </div>

            </div>

            {/* Top Row: Stats & Rating */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">

                {/* Metric Cards */}
                {statsData.map((stat, index) => (
                    <StatCard key={index} title={stat.title} value={stat.value} change={stat.change}
                              period={stat.period}
                              icon={stat.icon}/>
                ))}

                <RatingCard/>

            </div>

            {/* Middle Row: Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

                {/* Reservation Chart (Bar) */}
                <ReservationChart/>

                {/* Booking Chart (Pie) */}
                <div className="col-span-1">
                    <BookingChart/>
                </div>


                <FeedbackList
                    title="Recent Reviews"
                    items={dashboardFeedbacks}
                    className="max-w-md"
                />

            </div>

            {/* Bottom Row: Table & Feedback */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* Booking List Table */}
                <BookingList data={bookingList}/>

                {/* Customer Feedback */}

            </div>
        </div>
    )
}