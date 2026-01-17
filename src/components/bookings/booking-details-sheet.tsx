import {useAppStore} from "@/stores/slices/store";
import {
    Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter
} from "@/components/ui/sheet";
import {Badge} from "@/components/ui/badge";
import {Separator} from "@/components/ui/separator";
import {Button} from "@/components/ui/button";
import {Calendar, User, CreditCard, Home, Mail, Phone} from "lucide-react";
import {format} from "date-fns";
import {ScrollArea} from "@/components/ui/scroll-area";

export default function BookingDetailsSheet() {
    const {isBookingSheetOpen, setBookingSheetOpen, selectedBooking} = useAppStore();

    if (!selectedBooking) return null;

    const formatDate = (date: string) => format(new Date(date), "PPP");

    return (
        <Sheet open={isBookingSheetOpen} onOpenChange={(open) => setBookingSheetOpen(open)}>
            {/*<SheetContent className="sm:max-w-md overflow-y-auto">*/}
            <SheetContent className="sm:max-w-xl w-full p-0 flex flex-col h-full">
                <div className="border-b">
                    <SheetHeader>
                        <div className="flex items-center justify-between">
                            <SheetTitle>Booking Details</SheetTitle>
                            <Badge variant={selectedBooking.status === "completed" ? "default" : "secondary"}>
                                {selectedBooking.status.toUpperCase()}
                            </Badge>
                        </div>
                        <SheetDescription>
                            ID: <span className="font-mono text-xs">{selectedBooking._id}</span>
                        </SheetDescription>
                    </SheetHeader>
                    {(
                        <style>{`
                            button[type="button"].absolute.right-4.top-4 {
                                display: none !important;
                            }
                        `}</style>
                    )}
                </div>

                <ScrollArea className="flex-1 w-full h-[calc(100vh-13rem)]">
                    <div className="mt-6 px-4 space-y-6">
                        {/* Customer Info */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                                <User className="w-4 h-4"/> Guest Information
                            </h4>
                            <div className="bg-slate-50 p-3 rounded-lg border text-sm space-y-2">
                                <div className="grid grid-cols-3">
                                    <span className="text-slate-500">Name:</span>
                                    <span className="col-span-2 font-medium">{selectedBooking.name}</span>
                                </div>
                                <div className="grid grid-cols-3">
                                    <span className="text-slate-500 flex items-center gap-1"><Mail className="w-3 h-3"/> Email:</span>
                                    <span className="col-span-2">{selectedBooking.email}</span>
                                </div>
                                <div className="grid grid-cols-3">
                                    <span className="text-slate-500 flex items-center gap-1"><Phone
                                        className="w-3 h-3"/> Phone:</span>
                                    <span className="col-span-2">{selectedBooking.phoneNumber}</span>
                                </div>
                            </div>
                        </div>

                        <Separator/>

                        {/* Room Info */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                                <Home className="w-4 h-4"/> Room Details
                            </h4>
                            {selectedBooking.room ? (
                                <div className="bg-slate-50 p-3 rounded-lg border text-sm space-y-2">
                                    <div className="font-medium text-base">{selectedBooking.room.name}</div>
                                    <div className="text-slate-500">{selectedBooking.room.location}</div>
                                    <div className="flex justify-between pt-1">
                                        <span className="text-slate-500">Price/Night:</span>
                                        <span>৳ {selectedBooking.room.pricePerNight}</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-3 rounded-lg border border-red-200 bg-red-50 text-red-600 text-sm">
                                    This room has been removed from the system.
                                </div>
                            )}
                        </div>

                        <Separator/>

                        {/* Booking Timeline */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                                <Calendar className="w-4 h-4"/> Schedule
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="border rounded-lg p-3 text-center bg-blue-50/50">
                                    <span className="text-xs text-slate-500 uppercase block mb-1">Check-in</span>
                                    <span
                                        className="font-bold text-slate-700">{formatDate(selectedBooking.checkIn)}</span>
                                </div>
                                <div className="border rounded-lg p-3 text-center bg-blue-50/50">
                                    <span className="text-xs text-slate-500 uppercase block mb-1">Check-out</span>
                                    <span
                                        className="font-bold text-slate-700">{formatDate(selectedBooking.checkOut)}</span>
                                </div>
                            </div>
                        </div>

                        <Separator/>

                        {/* Payment Info */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                                <CreditCard className="w-4 h-4"/> Payment Summary
                            </h4>
                            <div className="bg-slate-50 p-4 rounded-lg border space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Guests</span>
                                    <span>{selectedBooking.totalGuest} Person(s)</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Discount</span>
                                    <span>- ৳ {selectedBooking.discount}</span>
                                </div>
                                <Separator className="my-2"/>
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total Paid</span>
                                    <span className="text-green-600">৳ {selectedBooking.totalPrice}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                <SheetFooter className="mt-6">
                    <Button variant="outline" className="w-full" onClick={() => setBookingSheetOpen(false)}>
                        Close Details
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}