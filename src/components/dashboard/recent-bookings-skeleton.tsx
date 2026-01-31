import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function RecentBookingsSkeleton() {
    return (
        <Card className="xl:col-span-2 h-full border-none shadow-none lg:shadow-sm">
            {/* Header Skeleton */}
            <CardHeader className="flex flex-row items-center justify-between border-b py-5">
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-6 w-32" /> {/* Title */}
                    <Skeleton className="h-4 w-48" /> {/* Description */}
                </div>
                <Skeleton className="h-9 w-24" /> {/* View All Button */}
            </CardHeader>

            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="pl-6">Guest</TableHead>
                            <TableHead>Room</TableHead>
                            <TableHead>Check-In</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right pr-6">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {/* ৫টি ডামি রো জেনারেট করা হলো */}
                        {[...Array(5)].map((_, i) => (
                            <TableRow key={i}>
                                {/* Guest Info Skeleton */}
                                <TableCell className="pl-6 py-4">
                                    <div className="flex flex-col gap-2">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-3 w-40" />
                                    </div>
                                </TableCell>

                                {/* Room Name Skeleton */}
                                <TableCell>
                                    <Skeleton className="h-4 w-48" />
                                </TableCell>

                                {/* Date Skeleton */}
                                <TableCell>
                                    <Skeleton className="h-4 w-24" />
                                </TableCell>

                                {/* Status Badge Skeleton */}
                                <TableCell>
                                    <Skeleton className="h-6 w-20 rounded-full" />
                                </TableCell>

                                {/* Amount Skeleton */}
                                <TableCell className="text-right pr-6">
                                    <Skeleton className="h-4 w-16 ml-auto" />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}