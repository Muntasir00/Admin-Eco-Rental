import {useEffect, useState} from "react";
import {useAppStore} from "@/stores/slices/store";
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import {
    MapPin,
    Users,
    BedDouble,
    Ruler, Plus, MoreVertical, Eye, Edit, Trash2,
} from "lucide-react";
import RoomSheet from "@/components/rooms/room-sheet";
import {Pagination} from "@/components/rooms/pagination";
import CreateUpdateRoomSheet from "@/components/rooms/create-update-room-sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import DeleteConfirmRoomDialog from "@/components/rooms/delete-confirm-room-dialog";

const RoomsPage = () => {
    const {rooms, fetchRooms, isLoadingRooms, setRoomSheetOpen, roomPagination, setCreateRoomSheetOpen} = useAppStore();
    const [deleteId, setDeleteId] = useState<string | null>(null);

    useEffect(() => {
        fetchRooms(1);
    }, [fetchRooms]);

    // পেজ চেঞ্জ হ্যান্ডলার
    const handlePageChange = (page: number) => {
        if (page > 0 && page <= roomPagination.totalPages) {
            fetchRooms(page);
            window.scrollTo({top: 0, behavior: 'smooth'});
        }
    };

    if (isLoadingRooms && rooms.length === 0) {
        return <RoomsSkeleton/>;
    }

    return (
        <div className="container mx-auto py-8">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold tracking-tight">Available Rooms</h2>

                <Button onClick={() => setCreateRoomSheetOpen(true)}>
                    <Plus className="mr-2 h-4 w-4"/> Add Room
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
                {rooms.map((room) => (
                    <Card key={room._id}
                          className="group overflow-hidden border-muted transition-all hover:shadow-lg pt-0">
                        {/* Image Section */}
                        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                            <img
                                src={room.images[0]?.url || "/placeholder-room.jpg"}
                                alt={room.name}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute top-3 left-3">
                                <Badge variant={room.availableRooms > 0 ? "secondary" : "destructive"}
                                       className="backdrop-blur-md bg-white/90 text-black">
                                    {room.availableRooms > 0 ? `${room.availableRooms} Available` : "Sold Out"}
                                </Badge>
                            </div>
                            <div className="absolute top-3 right-3">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="secondary"
                                            size="icon"
                                            className="h-8 w-8 rounded-full bg-white/90 shadow-sm backdrop-blur-sm hover:bg-white dark:bg-black/50 dark:hover:bg-black/70 transition-colors"
                                        >
                                            <span className="sr-only">Open menu</span>
                                            <MoreVertical className="h-4 w-4 text-foreground"/>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-40">
                                        <DropdownMenuItem
                                            className="cursor-pointer"
                                            onClick={() => setRoomSheetOpen(true, room)}
                                        >
                                            <Eye className="mr-2 h-4 w-4"/> View Details
                                        </DropdownMenuItem>

                                        {/* Edit & Delete (যদি দরকার হয় আনকমেন্ট করুন) */}
                                        <DropdownMenuItem
                                            className="cursor-pointer"
                                            onClick={() => setCreateRoomSheetOpen(true, room)}
                                        >
                                            <Edit className="mr-2 h-4 w-4"/> Edit
                                        </DropdownMenuItem>

                                        <DropdownMenuSeparator/>

                                        <DropdownMenuItem
                                            className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20"
                                            onClick={() => setDeleteId(room._id)}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4"/> Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        {/* Content Section */}
                        <CardHeader className="p-4 pb-2">
                            <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                                {room.name}
                            </h3>
                            <div className="flex items-center text-sm text-muted-foreground">
                                <MapPin className="mr-1 h-3.5 w-3.5"/>
                                <span className="line-clamp-1">{room.location}</span>
                            </div>
                        </CardHeader>

                        <CardContent className="p-4 pt-2">
                            {/* Quick Stats */}
                            <div className="grid grid-cols-3 divide-x border rounded-md py-2 bg-muted/30">
                                <div className="flex flex-col items-center justify-center text-xs gap-1">
                                    <Users className="h-3.5 w-3.5 text-muted-foreground"/>
                                    <span>{room.guest} Guests</span>
                                </div>
                                <div className="flex flex-col items-center justify-center text-xs gap-1">
                                    <BedDouble className="h-3.5 w-3.5 text-muted-foreground"/>
                                    <span>{room.bedroom} Beds</span>
                                </div>
                                <div className="flex flex-col items-center justify-center text-xs gap-1">
                                    <Ruler className="h-3.5 w-3.5 text-muted-foreground"/>
                                    <span>{room.size} m²</span>
                                </div>
                            </div>
                        </CardContent>

                        {/* Footer / Price & Action */}
                        <CardFooter
                            className="p-4 pt-0 flex items-center justify-between border-t bg-muted/20 mt-auto h-16">
                            <div>
                                <p className="text-xs text-muted-foreground">Price per night</p>
                                <p className="text-lg font-bold text-primary">${room.pricePerNight}</p>
                            </div>
                            <Button
                                size="sm"
                                onClick={() => setRoomSheetOpen(true, room)}
                                variant="outline"
                            >
                                View Details
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* Pagination Controls */}
            <Pagination
                page={roomPagination.page}
                limit={roomPagination.limit}
                totalItems={roomPagination.total}
                onChange={handlePageChange}
            />

            <CreateUpdateRoomSheet/>
            {/* Render the Sheet Component here */}
            <RoomSheet/>

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmRoomDialog
                open={!!deleteId}
                onOpenChange={(open) => !open && setDeleteId(null)}
                roomId={deleteId}
            />
        </div>
    );
};

// Simple Skeleton Loader for better UX
const RoomsSkeleton = () => (
    <div className="container mx-auto py-8 px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="space-y-3 border rounded-xl p-4">
                <Skeleton className="h-[200px] w-full rounded-lg"/>
                <div className="space-y-2 pt-2">
                    <Skeleton className="h-5 w-[80%]"/>
                    <Skeleton className="h-4 w-[50%]"/>
                    <div className="flex gap-2 pt-2">
                        <Skeleton className="h-8 w-full"/>
                        <Skeleton className="h-8 w-full"/>
                        <Skeleton className="h-8 w-full"/>
                    </div>
                </div>
            </div>
        ))}
    </div>
);

export default RoomsPage;