import {useEffect, useState} from "react";
import {useAppStore} from "@/stores/slices/store";
import {Button} from "@/components/ui/button";
import {LayoutGrid, List, Plus} from "lucide-react";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";
import BlogTable from "@/components/blogs/blog-table";
import BlogGrid from "@/components/blogs/blog-grid";
import BlogSheet from "@/components/blogs/blog-sheet";
import BlogSkeleton from "@/components/blogs/blog-skeleton";
import {BlogPagination} from "@/components/blogs/blog-pagination";

const BlogsPage = () => {
    const {
        blogs,
        getBlogs,
        pagination,
        isLoadingBlogs,
        setFormOpen
    } = useAppStore();
    const [view, setView] = useState<"table" | "grid">("table");

    // প্রথমবার লোড হলে ১ নম্বর পেজ কল হবে
    useEffect(() => {
        getBlogs(1);
    }, [getBlogs]);


    // পেজ পরিবর্তনের হ্যান্ডলার
    const handlePageChange = (page: number) => {
        getBlogs(page);
        // পেজ চেঞ্জ হলে উপরে স্ক্রল করবে
        window.scrollTo({top: 0, behavior: 'smooth'});
    };

    return (
        <div className="w-full space-y-6">
            {/* Header Section */}
            <div className="flex flex-wrap flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Blog Management</h1>
                    <p className="text-muted-foreground">Manage your articles and posts.</p>
                </div>

                <div className="flex items-center gap-2">
                    {/* View Toggle */}
                    <Tabs value={view} onValueChange={(v) => setView(v as "table" | "grid")}>
                        <TabsList>
                            <TabsTrigger value="table"><List className="h-4 w-4 mr-2"/>Table</TabsTrigger>
                            <TabsTrigger value="grid"><LayoutGrid className="h-4 w-4 mr-2"/>Grid</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <Button onClick={() => setFormOpen(true, null)} >
                        <Plus className="mr-2 h-4 w-4"/> Add New
                    </Button>
                </div>
            </div>

            {/* Content Section */}
            <div className="min-h-[400px]">
                {isLoadingBlogs ? (
                    <BlogSkeleton view={view}/>
                ) : (
                    <>
                        {view === "table" ? <BlogTable/> : <BlogGrid/>}
                    </>
                )}

                <div className="py-4">
                    <BlogPagination
                        currentPage={pagination.page}
                        totalPages={pagination.totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>

            {/* Add/Edit Sheet Component */}
            <BlogSheet/>
        </div>
    );
};

export default BlogsPage;