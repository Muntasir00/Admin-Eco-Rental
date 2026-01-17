import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface BlogPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function BlogPagination({ currentPage, totalPages, onPageChange }: BlogPaginationProps) {

    // পেজ নাম্বার জেনারেট করার লজিক (Smart Pagination Logic)
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5; // মোবাইল ও ছোট স্ক্রিনে কতগুলো বাটন দেখাবে

        if (totalPages <= maxVisiblePages) {
            // যদি পেজ সংখ্যা কম হয় (১-৫), সব দেখাবে
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // যদি পেজ সংখ্যা অনেক বেশি হয়
            if (currentPage <= 3) {
                // শুরুতে থাকলে: 1, 2, 3, ..., 10
                pages.push(1, 2, 3, '...', totalPages);
            } else if (currentPage >= totalPages - 2) {
                // শেষে থাকলে: 1, ..., 8, 9, 10
                pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
            } else {
                // মাঝখানে থাকলে: 1, ..., 4, 5, 6, ..., 10
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }
        return pages;
    };

    // যদি পেজ ১ এর কম হয়, কিছু রেন্ডার করবে না
    if (totalPages <= 1) return null;

    return (
        <Pagination className="mt-8">
            <PaginationContent>
                {/* Previous Button */}
                <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) onPageChange(currentPage - 1);
                        }}
                        className={`cursor-pointer ${currentPage === 1 ? 'pointer-events-none opacity-50' : ''}`}
                    />
                </PaginationItem>

                {/* Page Numbers (Hidden on very small mobile screens to save space, optional) */}
                <div className="hidden sm:flex flex-row items-center gap-1">
                    {getPageNumbers().map((page, index) => (
                        <PaginationItem key={index}>
                            {page === '...' ? (
                                <PaginationEllipsis />
                            ) : (
                                <PaginationLink
                                    href="#"
                                    isActive={page === currentPage}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onPageChange(page as number);
                                    }}
                                >
                                    {page}
                                </PaginationLink>
                            )}
                        </PaginationItem>
                    ))}
                </div>

                {/* Mobile View Current Page Indicator (Optional) */}
                <span className="text-sm font-medium sm:hidden mx-2">
                    Page {currentPage} of {totalPages}
                </span>

                {/* Next Button */}
                <PaginationItem>
                    <PaginationNext
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages) onPageChange(currentPage + 1);
                        }}
                        className={`cursor-pointer ${currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}`}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}