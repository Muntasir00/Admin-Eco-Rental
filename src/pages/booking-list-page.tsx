import {useEffect, useState} from "react";
import {useSearchParams} from "react-router";
import {useAppStore} from "@/stores/slices/store";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import {
    Eye, MapPin, User, XCircle, Phone, Search, Filter, X
} from "lucide-react";
import BookingDetailsSheet from "@/components/bookings/booking-details-sheet";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import TableSkeletonRow from "@/components/bookings/table-skeleton-row";
import getStatusBadge from "@/components/bookings/get-status-badge";
import BookingPagination from "@/components/bookings/booking-pagination";
import {formatDate} from "@/lib/utils";

export default function BookingListPage() {
    const [searchParams, setSearchParams] = useSearchParams();

    const {
        bookings,
        fetchBookings,
        bookingPagination,
        isLoadingBookings,
        setBookingSheetOpen,
        setBookingFilters
    } = useAppStore();

    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");

    useEffect(() => {
        const search = searchParams.get("search") || "";
        const status = searchParams.get("status") || "all";
        const page = Number(searchParams.get("page")) || 1;

        setBookingFilters({search, status});

        fetchBookings(page);
    }, [searchParams, fetchBookings, setBookingFilters]);


    const updateURL = (key: string, value: string | number | null) => {
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);

            if (value === null || value === "" || value === "all") {
                newParams.delete(key);
            } else {
                newParams.set(key, String(value));
            }

            if (key !== "page") {
                newParams.set("page", "1");
            }

            return newParams;
        });
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            const currentUrlSearch = searchParams.get("search") || "";
            if (searchTerm !== currentUrlSearch) {
                updateURL("search", searchTerm);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, searchParams]);

    const handleStatusChange = (value: string) => {
        updateURL("status", value);
    };

    const handlePageChange = (newPage: number) => {
        updateURL("page", newPage);
    };

    const clearFilters = () => {
        setSearchTerm("");
        setSearchParams({});
    };

    return (
        <div className="w-full space-y-6 bg-slate-50/50 min-h-screen">

            {/* Header & Filters Section */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Bookings</h1>
                        <p className="text-slate-500 text-sm">
                            Manage reservations & search guests.
                        </p>
                    </div>
                    <div
                        className="flex items-center gap-2 bg-white px-3 py-1 rounded-md border text-sm text-slate-600 shadow-sm">
                        <span className="font-medium">Total Bookings:</span>
                        <Badge variant="secondary">
                            {isLoadingBookings ? <Skeleton className="w-4 h-4"/> : bookingPagination.total}
                        </Badge>
                    </div>
                </div>

                {/* Filter Bar */}
                <div
                    className="flex flex-col sm:flex-row gap-3 items-end sm:items-center bg-white p-4 rounded-xl border shadow-sm">
                    {/* Search Input */}
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500"/>
                        <Input
                            placeholder="Search by Name, Email..."
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="w-full sm:w-48">
                        <Select
                            value={searchParams.get("status") || "all"} // URL থেকে ভ্যালু নেওয়া
                            onValueChange={handleStatusChange}
                        >
                            <SelectTrigger>
                                <div className="flex items-center gap-2">
                                    <Filter className="w-4 h-4 text-slate-500"/>
                                    <SelectValue placeholder="Status"/>
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="ongoing">Ongoing</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Clear Button */}
                    {(searchTerm || (searchParams.get("status") && searchParams.get("status") !== "all")) && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearFilters}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                            <X className="w-4 h-4 mr-1"/> Reset
                        </Button>
                    )}
                </div>
            </div>

            {/* Table Section */}
            <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow>
                                <TableHead className="w-[50px]">#</TableHead>
                                <TableHead className="w-[200px]">Guest Details</TableHead>
                                <TableHead className="w-[200px]">Room Info</TableHead>
                                <TableHead className="w-[180px]">Timeline</TableHead>
                                <TableHead className="w-[120px]">Status</TableHead>
                                <TableHead className="text-right w-[150px]">Amount</TableHead>
                                <TableHead
                                    className="text-center w-[60px] sticky right-[-0.1px] bg-slate-50 z-20 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                                    Action
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoadingBookings ? (
                                Array.from({length: 9}).map((_, i) => (
                                    <TableSkeletonRow key={i}/>
                                ))
                            ) : bookings.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-32 text-center text-slate-500">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Search className="w-8 h-8 text-slate-300"/>
                                            <p>No bookings found.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                bookings.map((booking, index: number) => (
                                    <TableRow key={booking._id}
                                              className="group hover:bg-slate-50/60 transition-colors">
                                        <TableCell className="align-top py-4">
                                            {(bookingPagination.page - 1) * bookingPagination.limit + index + 1}
                                        </TableCell>
                                        <TableCell className="align-top py-4">
                                            <div className="flex flex-col gap-1">
                                                <span
                                                    className="font-semibold text-slate-900 flex items-center gap-1.5">
                                                    <User className="w-3.5 h-3.5 text-slate-400"/>
                                                    {booking.name}
                                                </span>
                                                <span className="text-xs text-slate-500 pl-5">{booking.email}</span>
                                                <span className="text-xs text-slate-500 pl-5 flex items-center gap-1">
                                                    <Phone className="w-3 h-3"/> {booking.phoneNumber}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="align-top py-4">
                                            {booking.room ? (
                                                <div className="flex flex-col gap-1">
                                                    <span
                                                        className="font-medium text-slate-700">{booking.room.name}</span>
                                                    <div className="flex items-start gap-1 text-xs text-slate-500">
                                                        <MapPin className="w-3 h-3 mt-0.5 shrink-0"/>
                                                        <span className="line-clamp-1">{booking.room.location}</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div
                                                    className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded w-fit text-xs font-medium border border-amber-200">
                                                    <XCircle className="w-3 h-3"/> Room Deleted
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="align-top py-4">
                                            <div className="flex flex-col gap-1 text-sm text-slate-600">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-slate-400 w-6">In:</span>
                                                    <span className="font-medium">{formatDate(booking.checkIn)}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-slate-400 w-6">Out:</span>
                                                    <span className="font-medium">{formatDate(booking.checkOut)}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="align-top py-4">
                                            {getStatusBadge(booking.status)}
                                        </TableCell>
                                        <TableCell className="align-top py-4 text-right">
                                            <div className="flex flex-col items-end">
                                                <span
                                                    className="font-bold text-slate-900">৳ {booking.totalPrice.toLocaleString()}</span>
                                                <span className="text-xs text-slate-500">
                                                    {booking.totalGuest} Guests • {booking.roomsBooked} Room(s)
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell
                                            className="align-top py-4 text-center sticky right-[-0.1px] z-10 bg-white group-hover:bg-slate-50 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)] border-l border-slate-100">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 hover:bg-slate-200"
                                                onClick={() => setBookingSheetOpen(true, booking)}
                                            >
                                                <Eye className="w-4 h-4 text-slate-600"/>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                <BookingPagination
                    currentPage={bookingPagination.page}
                    totalPages={bookingPagination.totalPages}
                    onPageChange={handlePageChange}
                    isLoading={isLoadingBookings}
                />
            </div>

            {/* Details Sheet Component */}
            <BookingDetailsSheet/>
        </div>
    );
}