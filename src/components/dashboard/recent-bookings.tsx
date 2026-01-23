import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge"; // Shadcn Badge
import {ArrowUpRight} from "lucide-react";
import {useNavigate} from "react-router"; // অথবা react-router-dom

// টাইপ ডেফিনিশন (আপনার স্কিমা অনুযায়ী)
type Booking = {
    _id: string;
    name: string;
    email: string;
    room: { name: string } | null;
    checkIn: string;
    totalPrice: number;
    status: string;
};

type RecentBookingsProps = {
    bookings: Booking[];
};

export default function RecentBookings({bookings}: RecentBookingsProps) {
    const navigate = useNavigate();

    // মাত্র ৫টা ডাটা দেখাবো
    const recentData = bookings.slice(0, 5);

    const handleViewAll = () => {
        navigate("/booking-list"); // আপনার বুকিং লিস্ট পেজের রাউট
    };

    // স্ট্যাটাস কালার হ্যান্ডেল করার ফাংশন
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "completed":
                return "bg-green-100 text-green-700 hover:bg-green-100 border-green-200";
            case "pending":
                return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200";
            case "cancelled":
                return "bg-red-100 text-red-700 hover:bg-red-100 border-red-200";
            default:
                return "bg-gray-100 text-gray-700 hover:bg-gray-100";
        }
    };

    return (
        <Card className="xl:col-span-2 h-full border-none shadow-none lg:shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between border-b ">
                <div className="grid gap-1">
                    <CardTitle className="text-xl font-bold">Recent Bookings</CardTitle>
                    <CardDescription>Latest transaction from users</CardDescription>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 hidden sm:flex"
                    onClick={handleViewAll}
                >
                    View All <ArrowUpRight className="h-4 w-4"/>
                </Button>
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
                        {recentData.map((booking) => (
                            <TableRow key={booking._id} className="hover:bg-muted/50">
                                {/* Guest Info */}
                                <TableCell className="pl-6 py-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="font-medium leading-none">
                                          {booking.name}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                          {booking.email}
                                        </span>
                                    </div>
                                </TableCell>

                                {/* Room Info (Safe Check) */}
                                <TableCell className="max-w-[200px] truncate">
                                    {booking.room?.name || (
                                        <span className="text-red-400 text-xs italic">
                                          Room Unavailable
                                        </span>
                                    )}
                                </TableCell>

                                {/* Date */}
                                <TableCell>
                                    {new Date(booking.checkIn).toLocaleDateString()}
                                </TableCell>

                                {/* Status Badge */}
                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className={`capitalize ${getStatusColor(booking.status)}`}
                                    >
                                        {booking.status}
                                    </Badge>
                                </TableCell>

                                {/* Price */}
                                <TableCell className="text-right pr-6 font-medium">
                                    ${booking.totalPrice.toLocaleString()}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}