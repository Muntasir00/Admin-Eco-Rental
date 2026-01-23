import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const StatCardSkeleton = () => {
    return (
        <Card className="p-3 gap-0 h-full">
            {/* Header: Title and Icon */}
            <div className="flex justify-between items-start mb-4">
                {/* Title Placeholder */}
                <Skeleton className="h-5 w-24" />

                {/* Icon Box Placeholder */}
                <Skeleton className="h-8 w-8 rounded-lg" />
            </div>

            {/* Value Placeholder */}
            <Skeleton className="h-9 w-32 mb-2" />

            {/* Footer: Badge and Period Text */}
            <div className="flex items-center gap-2 mt-auto">
                {/* Badge/Pill Placeholder */}
                <Skeleton className="h-5 w-12 rounded-lg" />

                {/* Period Text Placeholder */}
                <Skeleton className="h-4 w-20" />
            </div>
        </Card>
    );
};

export default StatCardSkeleton;