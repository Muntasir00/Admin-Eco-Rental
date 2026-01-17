import {Skeleton} from "@/components/ui/skeleton";
import {BlogTableSkeleton} from "@/components/blogs/blog-table-skeleton";

const BlogSkeleton = ({view}: { view: "table" | "grid" }) => {
    if (view === "table") {
        return (
            <BlogTableSkeleton/>
        );
    }
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                <div key={i} className="flex flex-col space-y-3">
                    <Skeleton className="h-[200px] w-full rounded-xl"/>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]"/>
                        <Skeleton className="h-4 w-[200px]"/>
                    </div>
                </div>
            ))}
        </div>
    );
};
export default BlogSkeleton;