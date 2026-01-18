import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    ResponsiveContainer,
    Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// Mock Data
const data = [
    {
        name: "status",
        occupied: 350,
        available_low: 140,
        available_high: 80,
        unavailable: 55,
    },
];

const RoomAvailability = () => {
    return (
        <Card className="w-full max-w-md shadow-sm border-none bg-white">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold text-gray-900">
                    Room Availability
                </CardTitle>
                <CardDescription className="text-gray-400 font-medium">
                    Recent
                </CardDescription>
            </CardHeader>

            <CardContent>
                {/* --- Chart Section --- */}
                <div className="h-[100px] w-full mb-8">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            layout="vertical"
                            data={data}
                            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                        >
                            {/* Hide Axes */}
                            <XAxis type="number" hide />
                            <YAxis type="category" dataKey="name" hide />
                            <Tooltip cursor={false} />

                            {/*
                We use stroke="#fff" and strokeWidth={6} to create the "Gap" effect
                between the bars while keeping them stacked.
              */}

                            {/* Occupied (Dark Blue) */}
                            <Bar
                                dataKey="occupied"
                                stackId="a"
                                fill="#3b82f6" // blue-500
                                radius={[4, 0, 0, 4]}
                                barSize={60}
                                stroke="#fff"
                                strokeWidth={6}
                            />

                            {/* Available Low (Very Light Blue) */}
                            <Bar
                                dataKey="available_low"
                                stackId="a"
                                fill="#eff6ff" // blue-50
                                barSize={60}
                                stroke="#fff"
                                strokeWidth={6}
                            />

                            {/* Available High (Medium Blue) */}
                            <Bar
                                dataKey="available_high"
                                stackId="a"
                                fill="#60a5fa" // blue-400
                                barSize={60}
                                stroke="#fff"
                                strokeWidth={6}
                            />

                            {/* Not Available (Light Blue) */}
                            <Bar
                                dataKey="unavailable"
                                stackId="a"
                                fill="#93c5fd" // blue-300
                                radius={[0, 4, 4, 0]}
                                barSize={60}
                                stroke="#fff"
                                strokeWidth={6}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* --- Legend / Stats Section --- */}
                <div className="grid grid-cols-2 gap-y-6 gap-x-4">

                    {/* Occupied */}
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-1 bg-blue-500 rounded-full"></div>
                        <div>
                            <p className="text-xs font-semibold text-gray-500 mb-0.5">Occupied</p>
                            <p className="text-xl font-bold text-gray-800">350</p>
                        </div>
                    </div>

                    {/* Available (Low) */}
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-1 bg-blue-50 rounded-full"></div>
                        <div>
                            <p className="text-xs font-semibold text-gray-500 mb-0.5">Available</p>
                            <p className="text-xl font-bold text-gray-800">14</p>
                        </div>
                    </div>

                    {/* Available (High) */}
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-1 bg-blue-400 rounded-full"></div>
                        <div>
                            <p className="text-xs font-semibold text-gray-500 mb-0.5">Available</p>
                            <p className="text-xl font-bold text-gray-800">80</p>
                        </div>
                    </div>

                    {/* Not Available */}
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-1 bg-blue-300 rounded-full"></div>
                        <div>
                            <p className="text-xs font-semibold text-gray-500 mb-0.5">Not Available</p>
                            <p className="text-xl font-bold text-gray-800">55</p>
                        </div>
                    </div>

                </div>
            </CardContent>
        </Card>
    );
};

export default RoomAvailability;