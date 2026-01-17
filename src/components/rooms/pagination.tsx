import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PaginationProps {
    page: number
    limit: number
    totalItems: number
    isLoading?: boolean
    onChange: (page: number) => void
}

type PageItem = number | 'dots'

function getPaginationPages(
    current: number,
    total: number,
    delta = 1
): PageItem[] {
    if (total <= 1) return []

    const pages: PageItem[] = []
    const left = Math.max(2, current - delta)
    const right = Math.min(total - 1, current + delta)

    pages.push(1)

    if (left > 2) pages.push('dots')

    for (let i = left; i <= right; i++) {
        pages.push(i)
    }

    if (right < total - 1) pages.push('dots')

    pages.push(total)

    return pages
}

export function Pagination({
                               page,
                               limit,
                               totalItems,
                               isLoading = false,
                               onChange
                           }: PaginationProps) {
    const totalPages = Math.ceil(totalItems / limit)
    if (totalPages <= 1) return null

    const start = totalItems ? (page - 1) * limit + 1 : 0
    const end = totalItems ? Math.min(page * limit, totalItems) : 0

    return (
        <div className="border-t py-4">

            {/* ===== Mobile view ===== */}
            <div className="flex items-center justify-between sm:hidden">
                <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1 || isLoading}
                    onClick={() => onChange(page - 1)}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                <span className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </span>

                <Button
                    variant="outline"
                    size="sm"
                    disabled={page === totalPages || isLoading}
                    onClick={() => onChange(page + 1)}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>

            {/* ===== Desktop view ===== */}
            <div className="hidden sm:flex items-center justify-between gap-3">

                <p className="text-sm text-muted-foreground">
                    Showing {start} – {end} of {totalItems}
                </p>

                <div className="flex items-center gap-2">

                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page === 1 || isLoading}
                        onClick={() => onChange(page - 1)}
                    >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Previous
                    </Button>

                    <div className="flex items-center gap-1">
                        {getPaginationPages(page, totalPages).map((item, index) =>
                                item === 'dots' ? (
                                    <span
                                        key={`dots-${index}`}
                                        className="px-2 text-muted-foreground"
                                    >
                  …
                </span>
                                ) : (
                                    <Button
                                        key={item}
                                        size="sm"
                                        variant={item === page ? 'default' : 'ghost'}
                                        disabled={item === page || isLoading}
                                        onClick={() => onChange(item)}
                                        className="h-9 w-9 p-0"
                                    >
                                        {item}
                                    </Button>
                                )
                        )}
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page === totalPages || isLoading}
                        onClick={() => onChange(page + 1)}
                    >
                        Next
                        <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>

                </div>
            </div>
        </div>
    )
}
