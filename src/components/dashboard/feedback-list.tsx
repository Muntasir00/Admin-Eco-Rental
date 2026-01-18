import React from 'react';
import {MoreVertical} from 'lucide-react';

export interface FeedbackItem {
    id?: string | number;
    name: string;
    comment: string;
    initial: string;
    color: string; // Tailwind color class (e.g., 'bg-indigo-500')
}

interface FeedbackListProps {
    title?: string;
    items: FeedbackItem[];
    className?: string;
    onMenuClick?: () => void;
}

const FeedbackList: React.FC<FeedbackListProps> = ({
                                                       title = "Customers feedback",
                                                       items,
                                                       className,
                                                       onMenuClick
                                                   }) => {
    return (
        <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-5 ${className}`}>

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-gray-800">{title}</h3>
                <button
                    onClick={onMenuClick}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <MoreVertical size={16}/>
                </button>
            </div>

            {/* List */}
            <div className="space-y-3">
                {items.map((fb, idx) => (
                    <div
                        key={fb.id || idx}
                        className="flex gap-4 items-start pb-4 border-b border-gray-50 last:border-none last:pb-0"
                    >
                        {/* Text Content */}
                        <div className="flex-1">
                            <h4 className="font-bold text-sm text-gray-800">{fb.name}</h4>
                            <p className="text-xs text-gray-500 mt-1">{fb.comment}</p>
                        </div>

                        {/* Avatar / Initial */}
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold ${fb.color}`}
                        >
                            {fb.initial}
                        </div>
                    </div>
                ))}

                {items.length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-4">No feedback available.</p>
                )}
            </div>
        </div>
    );
};

export default FeedbackList;