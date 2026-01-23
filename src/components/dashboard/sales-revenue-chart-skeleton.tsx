import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SalesRevenueChartSkeleton() {
    return (
        <Card className="pt-0 h-full border-none shadow-none lg:shadow-sm">
            {/* Header Skeleton */}
            <CardHeader className="flex flex-col items-start gap-2 border-b py-5">
                <Skeleton className="h-6 w-48" /> {/* Title */}
                <Skeleton className="h-4 w-64" /> {/* Description */}
            </CardHeader>

            {/* Chart Area Skeleton */}
            <CardContent className="px-2 pt-6">
                <div className="h-[380px] w-full flex items-end justify-between gap-2 px-4">
                    {/* Simulated Bars: ৭টি ডামি বার তৈরি করা হলো */}
                    {[...Array(7)].map((_, i) => (
                        <div key={i} className="flex flex-col gap-2 w-full items-center">
                            {/* Bar 1 (Revenue placeholder) */}
                            <Skeleton
                                className={`w-8 rounded-t-md ${
                                    // র‍্যান্ডম হাইট দেওয়া হলো যাতে রিয়ালিস্টিক লাগে
                                    i % 2 === 0 ? "h-64" : "h-40"
                                }`}
                            />
                            {/* Bar 2 (Bookings placeholder - optional if stacked or grouped) */}
                            {/* <Skeleton className="w-8 h-20 rounded-t-md opacity-50" /> */}
                        </div>
                    ))}
                </div>

                {/* X-Axis Labels Skeleton */}
                <div className="flex justify-between px-6 mt-4">
                    {[...Array(7)].map((_, i) => (
                        <Skeleton key={i} className="h-3 w-8" />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}