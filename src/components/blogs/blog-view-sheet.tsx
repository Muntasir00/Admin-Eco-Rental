import {useAppStore} from "@/stores/slices/store";
import {Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {ScrollArea} from "@/components/ui/scroll-area";
import {CalendarDays, Clock} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import {Button} from "@/components/ui/button";
import {
    Carousel,
    type CarouselApi,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import {useEffect, useState} from "react";

export default function BlogViewSheet() {
    const {isDetailsOpen, setDetailsOpen, selectedSingleBlog} = useAppStore();
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const [count, setCount] = useState(0);


    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    useEffect(() => {
        if (!api) return;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap() + 1);

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1);
        });
    }, [api]);

    if (!selectedSingleBlog) return null;

    return (
        <Sheet open={isDetailsOpen} onOpenChange={(open) => setDetailsOpen(open)}>
            <SheetContent className="sm:max-w-xl w-full p-0 flex flex-col h-full">
                {/* 1. Header Area */}
                <SheetHeader className="px-6 py-4 border-b">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="text-xl font-bold">Blog Details</SheetTitle>
                        {/* ক্লোজ বাটন কাস্টম চাইলে এখানে দিতে পারেন, অথবা ডিফল্ট আছে */}
                    </div>
                    <SheetDescription className="hidden">Blog content view</SheetDescription>
                </SheetHeader>

                {/* 2. Scrollable Content Area */}
                <ScrollArea className="flex-1 w-full h-[calc(100vh-10rem)]">
                    <div className="px-4 space-y-6">

                        {/* Image Section (Hero) */}
                        <div
                            className="relative w-full aspect-video rounded-xl overflow-hidden shadow-sm border bg-muted">
                            {/*{selectedSingleBlog?.imageUrl ? (*/}
                                {selectedSingleBlog.images.length > 0 ? (
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
                                                {selectedSingleBlog.images.map((img, index) => (
                                                    <CarouselItem key={index} className="h-full">
                                                        <img
                                                            src={img.url}
                                                            alt={`${selectedSingleBlog.title} - ${index + 1}`}
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
                                                src={selectedSingleBlog.images[0]?.url || "/placeholder.png"}
                                                alt={selectedSingleBlog.title}
                                                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                                            />
                                            {/* ইমেজ না থাকলে বা ১টি থাকলে কাউন্টার দেখানোর দরকার নেই, অথবা চাইলে ১/১ দেখাতে পারেন */}
                                        </>
                                    )}
                        </div>

                        {/* Meta Data (Date & Tags) */}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5 bg-muted/50 px-3 py-1 rounded-full">
                                <CalendarDays className="w-4 h-4"/>
                                <span>{formatDate(selectedSingleBlog.createdAt)}</span>
                            </div>
                            {/* ডামি রিডিং টাইম (অপশনাল) */}
                            <div className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4"/>
                                <span>5 min read</span>
                            </div>
                        </div>

                        {/* Title */}
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-tight">
                                {selectedSingleBlog?.title}
                            </h1>
                        </div>

                        <Separator/>

                        {/* Content Body */}
                        <div className="prose prose-stone dark:prose-invert max-w-none">
                            <p className="text-md leading-relaxed text-muted-foreground whitespace-pre-wrap">
                                {selectedSingleBlog?.content}
                            </p>
                        </div>
                    </div>
                </ScrollArea>

                {/* 3. Footer Actions (Sticky Bottom) */}
                <SheetFooter
                    className="p-4 border-t bg-background/95 backdrop-blur sm:justify-between sm:flex-row gap-4">
                    <div className="text-xs text-muted-foreground flex items-center">
                        ID: <code
                        className="ml-2 bg-muted px-1 py-0.5 rounded">{selectedSingleBlog?._id.slice(-6)}...</code>
                    </div>
                    <Button variant="outline" onClick={() => setDetailsOpen(false)}>
                        Close
                    </Button>
                </SheetFooter>

            </SheetContent>

        </Sheet>
    )
}