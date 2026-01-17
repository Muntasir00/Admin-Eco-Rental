import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // আপনার যদি cn utility না থাকে, সাধারণ string ব্যবহার করতে পারেন

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    isLoading?: boolean;
    className?: string;
}

export default function BookingPagination({
                                                currentPage,
                                                totalPages,
                                                onPageChange,
                                                isLoading = false,
                                                className
                                            }: PaginationProps) {

    // সেইফটি চেক: পেজ সংখ্যা যাতে ১ এর নিচে না দেখায়
    const safeTotalPages = totalPages > 0 ? totalPages : 1;

    return (
        <div className={cn("p-4 border-t flex items-center justify-between bg-slate-50/50", className)}>
            <span className="text-sm text-slate-500">
                Page {currentPage} of {safeTotalPages}
            </span>

            <div className="flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1 || isLoading}
                >
                    Previous
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= safeTotalPages || isLoading}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}