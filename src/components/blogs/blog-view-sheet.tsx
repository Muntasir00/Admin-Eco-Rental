import {useAppStore} from "@/stores/slices/store";
import {Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {ScrollArea} from "@/components/ui/scroll-area";
import {CalendarDays, Clock, ImageIcon} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import {Button} from "@/components/ui/button";

export default function BlogViewSheet() {
    const {isBlogSheetOpen, setBlogSheetOpen, selectedSingleBlog} = useAppStore();

    if (!selectedSingleBlog) return null;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <Sheet open={isBlogSheetOpen} onOpenChange={(open) => setBlogSheetOpen(open)}>
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
                            {selectedSingleBlog?.imageUrl ? (
                                <img
                                    src={selectedSingleBlog.imageUrl}
                                    alt={selectedSingleBlog.title}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                                    <ImageIcon className="w-10 h-10 mb-2 opacity-50"/>
                                    <span>No Image Available</span>
                                </div>
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
                    <Button variant="outline" onClick={() => setBlogSheetOpen(false)}>
                        Close
                    </Button>
                </SheetFooter>

            </SheetContent>

        </Sheet>
    )
}