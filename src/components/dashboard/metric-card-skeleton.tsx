import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton"; // আপনার Skeleton কম্পোনেন্ট ইম্পোর্ট করুন

const MetricCardSkeleton = () => {
    return (
        <Card className="flex flex-col p-5 gap-0 justify-between h-full py-6">
            {/* Header Section */}
            <div className="flex justify-between items-start mb-2">
                {/* Title Placeholder */}
                <Skeleton className="h-5 w-1/2" />

                {/* Icon Placeholder */}
                <Skeleton className="h-5 w-5 rounded-full" />
            </div>

            {/* Main Value & Badge Section */}
            <div className="flex items-center gap-3 mb-4">
                {/* Value Placeholder (Large) */}
                <Skeleton className="h-9 w-24" />

                {/* Badge Placeholder (Pill shape) */}
                <Skeleton className="h-6 w-16 rounded-full" />
            </div>

            {/* Footer Section */}
            <div className="flex justify-between pt-4 border-t border-gray-100 mt-auto">
                {/* Sub1 Placeholder */}
                <Skeleton className="h-3 w-16" />

                {/* Sub2 Placeholder */}
                <Skeleton className="h-3 w-16" />
            </div>
        </Card>
    );
};

export default MetricCardSkeleton;