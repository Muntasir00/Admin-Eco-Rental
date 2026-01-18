import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, AreaChart, CartesianGrid, Area,
} from 'recharts';
import {
    Calendar, LogIn, LogOut, DollarSign, MoreVertical,
    Search, ChevronDown, MoreHorizontal, CalendarDays,
} from 'lucide-react';

// --- Mock Data (Existing) ---
const statsData = [
    { title: "New Bookings", value: "604", change: "+8.70%", period: "From Last Week", type: "primary", icon: Calendar },
    { title: "Check In", value: "405", change: "+8.70%", period: "From Last Week", type: "default", icon: LogIn },
    { title: "Check Out", value: "333", change: "-8.70%", period: "From Last Week", type: "default", icon: LogOut, isDown: true },
    { title: "Total Revenue", value: "$14,400,000", change: "+8.70%", period: "From Last Week", type: "default", icon: DollarSign },
];

const ratingsData = [
    { label: "Facilities", value: 4.1 },
    { label: "Services", value: 4.9 },
    { label: "Comfort", value: 4.5 },
    { label: "Food", value: 4.3 },
];

const reservationData = [
    { name: 'Jan', value: 186 },
    { name: 'Feb', value: 305 },
    { name: 'Mar', value: 237 },
    { name: 'Apr', value: 73 },
    { name: 'May', value: 209 },
    { name: 'Jun', value: 214 },
];

const pieData = [
    { name: 'Direct Booking', value: 275, color: '#2563EB' },
    { name: 'Bookin.web', value: 90, color: '#93C5FD' },
    { name: 'Airbnb', value: 173, color: '#60A5FA' },
    { name: 'Others', value: 185, color: '#3B82F6' },
    { name: 'Agoda', value: 200, color: '#1D4ED8' },
];

const bookingList = [
    { id: "GA-33456", name: "Alexander", type: "Deluxe", typeColor: "bg-orange-400", room: "#001", duration: "6 Nights", dates: "12/02/2022 - 16/02/2022", status: "Check-In", statusColor: "bg-green-100 text-green-600" },
    { id: "GA-33446", name: "Pegasus", type: "Standard", typeColor: "bg-green-400", room: "#002", duration: "4 Nights", dates: "20/04/2024 - 24/04/2024", status: "Check-Out", statusColor: "bg-red-100 text-red-600" },
    { id: "GA-34456", name: "Martin", type: "Suite", typeColor: "bg-purple-400", room: "#003", duration: "8 Nights", dates: "01/08/2025 - 08/08/2025", status: "Pending", statusColor: "bg-blue-100 text-blue-600" },
];

const feedbacks = [
    { name: "Mark", comment: "Food could be better.", initial: "A201", color: "bg-indigo-500" },
    { name: "Christian", comment: "Facilities are not enough for amount paid.", initial: "A101", color: "bg-purple-500" },
    { name: "Alexander", comment: "Room cleaning could be better.", initial: "A301", color: "bg-blue-500" },
];

// --- New Data (For Second Design) ---

const leftSideStats = [
    { title: "Total Booking", value: "10,829", sub1: "1892 This Month", sub2: "1029 This Week" },
    { title: "Rooms Available", value: "109", sub1: "241 Booked (M)", sub2: "191 Booked (W)" },
    { title: "Expenses", value: "$72,283.12", sub1: "$3,289.89 This Month", sub2: "$1,198.64 This Week" },
];

const salesRevenueData = Array.from({ length: 15 }, (_, i) => ({
    day: (i + 1) * 2,
    value: 1000 + Math.random() * 1000,
}));

// --- Components ---

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-5 ${className}`}>
        {children}
    </div>
);

// Custom Tooltip for Sales Chart
const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-xl min-w-[150px]">
                <p className="text-gray-400 text-xs mb-1">16 December 2025</p>
                <div className="flex items-center justify-between">
                    <span className="font-bold text-lg text-gray-800">1.598K</span>
                    <span className="text-green-600 text-xs font-bold bg-green-50 px-1.5 py-0.5 rounded">↗ 3.2%</span>
                </div>
            </div>
        );
    }
    return null;
};

export default function DashboardPage() {
    return (
        <div className="min-h-screen   font-sans text-gray-800">

            {/* --- NEW SECTION: Sales Revenue & Stats (Second Image) --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

                {/* Left Column: 3 Small Cards */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    {leftSideStats.map((stat, idx) => (
                        <Card key={idx} className="flex flex-col justify-between h-full py-6">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-gray-800">{stat.title}</h3>
                                <MoreHorizontal size={20} className="text-gray-400 cursor-pointer" />
                            </div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
                                <span className="bg-green-50 text-green-600 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                     ↗ 3.2%
                   </span>
                            </div>
                            <div className="flex justify-between text-xs text-gray-400 pt-4 border-t border-gray-100">
                                <span>{stat.sub1}</span>
                                <span>{stat.sub2}</span>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Right Column: Sales Revenue Chart */}
                <Card className="lg:col-span-2 flex flex-col justify-between">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                        <h3 className="font-bold text-lg text-gray-800">Sales Revenue</h3>
                        <MoreHorizontal size={20} className="text-gray-400 cursor-pointer" />
                    </div>

                    {/* Sub-header Stats & Filter */}
                    <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mb-6">
                        <div className="flex gap-6 w-full md:w-auto">
                            <div>
                                <p className="text-xs text-gray-400 mb-1">Monthly</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-xl font-bold">8,282K</span>
                                    <span className="bg-green-50 text-green-600 text-[10px] font-bold px-1.5 py-0.5 rounded">↗ 3.2%</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 mb-1">Weekly</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-xl font-bold">2,181K</span>
                                    <span className="bg-green-50 text-green-600 text-[10px] font-bold px-1.5 py-0.5 rounded">↗ 3.2%</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 mb-1">Daily (Avg)</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-xl font-bold">1.318K</span>
                                    <span className="bg-green-50 text-green-600 text-[10px] font-bold px-1.5 py-0.5 rounded">↗ 3.2%</span>
                                </div>
                            </div>
                        </div>

                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
                            <CalendarDays size={16} />
                            30 Days
                            <ChevronDown size={14} />
                        </button>
                    </div>

                    {/* The Area Chart */}
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={salesRevenueData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f3f4f6" />
                                <XAxis
                                    dataKey="day"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                    tickFormatter={(val) => val < 10 ? `0${val}` : `${val}`}
                                    padding={{ left: 20, right: 20 }}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#6366F1', strokeDasharray: '4 4' }} />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#6366F1"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorValue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            {/* Top Row: Stats & Rating */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">

                {/* Metric Cards */}
                {statsData.map((stat, index) => (
                    <Card key={index} className={stat.type === 'primary' ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white border-none' : ''}>
                        <div className="flex justify-between items-start mb-4">
                            <h3 className={`font-medium ${stat.type === 'primary' ? 'text-blue-100' : 'text-gray-500'}`}>{stat.title}</h3>
                            <div className={`p-2 rounded-lg ${stat.type === 'primary' ? 'bg-white/20' : 'bg-gray-100'}`}>
                                <stat.icon size={16} className={stat.type === 'primary' ? 'text-white' : 'text-gray-600'} />
                            </div>
                        </div>
                        <div className="text-3xl font-bold mb-2">{stat.value}</div>
                        <div className="flex items-center gap-2 text-sm">
              <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                  stat.type === 'primary' ? 'bg-white/20 text-white' :
                      stat.isDown ? 'bg-red-100 text-red-500' : 'bg-cyan-100 text-cyan-600'
              }`}>
                {stat.isDown ? '↘' : '↗'} {stat.change}
              </span>
                            <span className={stat.type === 'primary' ? 'text-blue-100' : 'text-gray-400'}>{stat.period}</span>
                        </div>
                    </Card>
                ))}

                {/* Overall Rating Card */}
                <Card>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium text-gray-500">Overall Rating</h3>
                        <span className="px-2 py-1 bg-purple-100 text-purple-600 font-bold rounded text-xs">4.5/5</span>
                    </div>
                    <div className="space-y-3">
                        {ratingsData.map((rate, i) => (
                            <div key={i} className="flex items-center gap-3 text-xs">
                                <span className="w-16 text-gray-500">{rate.label}</span>
                                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${(rate.value / 5) * 100}%` }}></div>
                                </div>
                                <span className="font-bold text-gray-600">{rate.value}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Middle Row: Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

                {/* Reservation Chart (Bar) */}
                <Card className="col-span-1">
                    <div className="mb-6">
                        <h3 className="font-bold text-lg text-gray-800">Reservation</h3>
                        <p className="text-sm text-gray-400">By months</p>
                    </div>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={reservationData} margin={{ left: -20 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: '#6B7280' }} width={70} axisLine={false} tickLine={false} />
                                <Tooltip cursor={{fill: 'transparent'}} />
                                <Bar dataKey="value" fill="url(#colorGradient)" radius={[0, 4, 4, 0]} barSize={20} />
                                <defs>
                                    <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#A78BFA" />
                                        <stop offset="100%" stopColor="#6366F1" />
                                    </linearGradient>
                                </defs>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4">
                        <div className="flex items-center gap-2 text-sm font-semibold">
                            Trending up by 5.2% this month <span className="text-gray-400">↗</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Showing total visitors for the last 6 months</p>
                    </div>
                </Card>

                {/* Booking Chart (Pie) */}
                <Card className="col-span-1">
                    <div className="mb-2 text-center">
                        <h3 className="font-bold text-lg text-gray-800">Booking</h3>
                        <p className="text-sm text-gray-400">By Platform</p>
                    </div>
                    <div className="h-64 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={pieData} cx="50%" cy="50%" innerRadius={0} outerRadius={80} dataKey="value" stroke="none">
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3 text-xs mt-2">
                        {pieData.map((d, i) => (
                            <div key={i} className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full" style={{backgroundColor: d.color}}></div>
                                <span className="text-gray-500">{d.name}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 text-center">
                        <div className="flex items-center justify-center gap-2 text-sm font-semibold">
                            Trending up by 5.2% this month <span className="text-gray-400">↗</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Showing total visitors for the last 6 months</p>
                    </div>
                </Card>

                {/* Room Availability */}
                <Card className="col-span-1">
                    <div className="mb-6">
                        <h3 className="font-bold text-lg text-gray-800">Room Availability</h3>
                        <p className="text-sm text-gray-400">Recent</p>
                    </div>

                    {/* Custom Visual for Room Availability */}
                    <div className="flex h-20 w-full rounded-lg overflow-hidden mb-8 gap-1">
                        <div className="w-[45%] bg-blue-500 h-full rounded-l-md"></div>
                        <div className="w-[10%] bg-blue-100 h-full"></div>
                        <div className="w-[15%] bg-blue-400 h-full"></div>
                        <div className="w-[30%] bg-blue-300 h-full rounded-r-md"></div>
                    </div>

                    <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                        <div>
                            <div className="text-xs text-gray-500 mb-1">Occupied</div>
                            <div className="text-xl font-bold flex items-center gap-2">350</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 mb-1">Available</div>
                            <div className="text-xl font-bold flex items-center gap-2">14</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 mb-1">Available</div>
                            <div className="text-xl font-bold flex items-center gap-2">80</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 mb-1">Not Available</div>
                            <div className="text-xl font-bold flex items-center gap-2">55</div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Bottom Row: Table & Feedback */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* Booking List Table */}
                <Card className="xl:col-span-2 overflow-hidden">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                        <h3 className="font-bold text-lg">Booking List</h3>
                        <div className="flex gap-3 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-3 top-2.5 text-gray-400" size={16}/>
                                <input type="text" placeholder="Search" className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                            </div>
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                                All Status <ChevronDown size={14} />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-green-50 text-xs font-semibold text-gray-700">
                            <tr>
                                <th className="p-3 rounded-l-lg">Booking ID</th>
                                <th className="p-3">Guest Name</th>
                                <th className="p-3">Room Type</th>
                                <th className="p-3">Room Number</th>
                                <th className="p-3">Duration</th>
                                <th className="p-3">Check-In & Check-Out</th>
                                <th className="p-3 rounded-r-lg">Status</th>
                                <th className="p-3"></th>
                            </tr>
                            </thead>
                            <tbody className="text-sm text-gray-600">
                            {bookingList.map((item, idx) => (
                                <tr key={idx} className="border-b border-gray-50 last:border-none hover:bg-gray-50">
                                    <td className="p-4 font-medium">{item.id}</td>
                                    <td className="p-4">{item.name}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${item.typeColor}`}></span>
                                            {item.type}
                                        </div>
                                    </td>
                                    <td className="p-4">{item.room}</td>
                                    <td className="p-4">{item.duration}</td>
                                    <td className="p-4">{item.dates}</td>
                                    <td className="p-4">
                                <span className={`px-3 py-1 rounded text-xs font-medium ${item.statusColor}`}>
                                    {item.status}
                                </span>
                                    </td>
                                    <td className="p-4 text-gray-400"><MoreVertical size={16} /></td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Customer Feedback */}
                <Card className="xl:col-span-1">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg">Customers feedback</h3>
                        <MoreVertical size={16} className="text-gray-400"/>
                    </div>
                    <div className="space-y-6">
                        {feedbacks.map((fb, idx) => (
                            <div key={idx} className="flex gap-4 items-start pb-4 border-b border-gray-50 last:border-none last:pb-0">
                                <div className="flex-1">
                                    <h4 className="font-bold text-sm text-gray-800">{fb.name}</h4>
                                    <p className="text-xs text-gray-500 mt-1">{fb.comment}</p>
                                </div>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold ${fb.color}`}>
                                    {fb.initial}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

            </div>
        </div>
    )
}