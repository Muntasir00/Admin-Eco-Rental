import React from "react";

const ratingsData = [
    {label: "Facilities", value: 4.1},
    {label: "Services", value: 4.9},
    {label: "Comfort", value: 4.5},
    {label: "Food", value: 4.3},
];

const Card = ({children, className = ""}: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-5 ${className}`}>
        {children}
    </div>
);
export default function RatingCard() {
    return (
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
                            <div className="h-full bg-purple-500 rounded-full"
                                 style={{width: `${(rate.value / 5) * 100}%`}}></div>
                        </div>
                        <span className="font-bold text-gray-600">{rate.value}</span>
                    </div>
                ))}
            </div>
        </Card>
    )
}