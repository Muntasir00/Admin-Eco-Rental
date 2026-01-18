import {useAppStore} from "@/stores/slices/store";
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter} from "@/components/ui/sheet";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Separator} from "@/components/ui/separator";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Check, Wifi, Wind, MapPin, Bed, Bath, User, Ruler} from "lucide-react";
import {useEffect, useState} from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export default function RoomSheet() {
    const {isRoomSheetOpen, setRoomSheetOpen, selectedRoom} = useAppStore();
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!api) return;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap() + 1);

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1);
        });
    }, [api]);

    if (!selectedRoom) return null;
    return (
        <Sheet open={isRoomSheetOpen} onOpenChange={(open) => setRoomSheetOpen(open)}>
            <SheetContent className="sm:max-w-xl w-full p-0 flex flex-col h-full bg-background gap-2">

                {/* Header */}
                <div className="border-b">
                    <SheetHeader>
                        <div className="flex items-center justify-between gap-2">
                            <SheetTitle className="text-xl font-bold truncate">
                                {selectedRoom.name}
                            </SheetTitle>
                            <Badge variant={selectedRoom.available ? "outline" : "destructive"}>
                                {selectedRoom.available ? "Available" : "Booked"}
                            </Badge>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <MapPin className="w-3.5 h-3.5 mr-1"/>
                            {selectedRoom.location}
                        </div>
                    </SheetHeader>
                </div>

                {/* Scrollable Content */}
                <ScrollArea className="flex-1 w-full h-[calc(100vh-16rem)]">
                    <div className="px-4 space-y-8">

                        <div
                            className="rounded-xl overflow-hidden border shadow-sm aspect-video relative group bg-muted">
                            {selectedRoom.images.length > 0 ? (
                                // ১. মাল্টিপল ইমেজ থাকলে ক্যারোসেল দেখাবে
                                <Carousel
                                    setApi={setApi}
                                    className="w-full h-full"
                                    plugins={[
                                        Autoplay({
                                            delay: 2000,
                                        }),
                                    ]}
                                >
                                    <CarouselContent className="h-full">
                                        {selectedRoom.images.map((img, index) => (
                                            <CarouselItem key={index} className="h-full">
                                                <img
                                                    src={img.url}
                                                    alt={`${selectedRoom.name} - ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>

                                    {/* নেভিগেশন বাটন (ইমেজের উপরে ভাসমান) */}
                                    <CarouselPrevious
                                        className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"/>
                                    <CarouselNext
                                        className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"/>

                                    {/* ডাইনামিক কাউন্টার */}
                                    <div
                                        className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full font-medium">
                                        {current} / {count}
                                    </div>
                                </Carousel>
                            ) : (
                                // ২. সিঙ্গেল ইমেজ থাকলে সাধারণ img ট্যাগ (পারফরমেন্সের জন্য ভালো)
                                <>
                                    <img
                                        src={selectedRoom.images[0]?.url || "/placeholder.png"}
                                        alt={selectedRoom.name}
                                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                                    />
                                    {/* ইমেজ না থাকলে বা ১টি থাকলে কাউন্টার দেখানোর দরকার নেই, অথবা চাইলে ১/১ দেখাতে পারেন */}
                                </>
                            )}
                        </div>

                        {/* Hero Image */}
                        {/*<div className="rounded-xl overflow-hidden border shadow-sm aspect-video relative group">*/}
                        {/*    <img*/}
                        {/*        src={selectedRoom.images[0]?.url || "/placeholder.png"}*/}
                        {/*        alt={selectedRoom.name}*/}
                        {/*        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"*/}
                        {/*    />*/}
                        {/*    /!* Simple Gallery Dots if multiple images (optional logic) *!/*/}
                        {/*    {selectedRoom.images.length > 1 && (*/}
                        {/*        <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded">*/}
                        {/*            1 / {selectedRoom.images.length}*/}
                        {/*        </div>*/}
                        {/*    )}*/}
                        {/*</div>*/}

                        {/* Room Stats Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <StatCard icon={<User/>} label="Guests" value={selectedRoom.guest}/>
                            <StatCard icon={<Bed/>} label="Bedrooms" value={selectedRoom.bedroom}/>
                            <StatCard icon={<Bath/>} label="Bathrooms" value={selectedRoom.bathroom}/>
                            <StatCard icon={<Ruler/>} label="Size" value={`${selectedRoom.size}m²`}/>
                        </div>

                        <Separator/>

                        {/* Amenities / Features */}
                        <div>
                            <h4 className="font-semibold text-base mb-3">Room Features</h4>
                            <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                                {selectedRoom.balcony && (
                                    <FeatureItem label="Private Balcony"/>
                                )}
                                <FeatureItem label="Free Wi-Fi" icon={<Wifi className="w-4 h-4"/>}/>
                                <FeatureItem label="Air Conditioning" icon={<Wind className="w-4 h-4"/>}/>
                                <FeatureItem label="24/7 Room Service"/>
                                <FeatureItem label="Smart TV"/>
                            </div>
                        </div>

                        <Separator/>

                        {/* Description (Dummy text if not in DB) */}
                        <div>
                            <h4 className="font-semibold text-base mb-2">Description</h4>
                            <p className="text-muted-foreground leading-relaxed">
                                Experience luxury in this beautifully designed room located in the heart
                                of {selectedRoom.location.split(',')[1] || 'the city'}.
                                Perfect for families or groups, offering modern amenities and a serene atmosphere.
                            </p>
                        </div>
                    </div>
                </ScrollArea>

                {/* Sticky Footer */}
                <SheetFooter
                    className="p-4 h-auto border-t bg-background/95 backdrop-blur flex flex-wrap sm:flex-nowrap flex-row items-center justify-center sm:justify-between gap-4">
                    <div className="flex  sm:flex-col items-center sm:items-start gap-2">
                        <span className="text-xs text-muted-foreground uppercase font-medium">Total Price</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-primary">${selectedRoom.pricePerNight}</span>
                            <span className="text-sm text-muted-foreground">/ night</span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setRoomSheetOpen(false)}>
                            Close
                        </Button>
                        <Button className="px-8" disabled={!selectedRoom.available}>
                            Book Now
                        </Button>
                    </div>
                </SheetFooter>

            </SheetContent>
        </Sheet>
    );
}

// Helper Components for Cleaner Code
const StatCard = ({icon, label, value}: { icon: any, label: string, value: string | number }) => (
    <div
        className="flex flex-col items-center justify-center p-3 bg-muted/40 rounded-lg border border-transparent hover:border-border transition-colors">
        <div className="text-primary mb-1 [&>svg]:w-5 [&>svg]:h-5">{icon}</div>
        <span className="font-bold text-lg">{value}</span>
        <span className="text-xs text-muted-foreground">{label}</span>
    </div>
);

const FeatureItem = ({label, icon}: { label: string, icon?: any }) => (
    <div className="flex items-center gap-2 text-sm text-foreground/80">
        <div className="text-green-600 bg-green-100 p-1 rounded-full">
            {icon || <Check className="w-3 h-3"/>}
        </div>
        {label}
    </div>
);