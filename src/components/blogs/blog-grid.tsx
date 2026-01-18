import {useAppStore} from "@/stores/slices/store";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Edit, Trash2, Eye, MoreVertical, CalendarDays} from "lucide-react";
import {Link} from "react-router";
import {useState} from "react";
import DeleteConfirmDialog from "@/components/blogs/delete-confirm-dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Badge} from "@/components/ui/badge";
import BlogViewSheet from "@/components/blogs/blog-view-sheet";

const BlogGrid = () => {
    const {blogs, setFormOpen, setDetailsOpen} = useAppStore();
    const [deleteId, setDeleteId] = useState<string | null>(null);

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((blog) => (
                    <Card
                        key={blog._id}
                        className="group flex flex-col overflow-hidden border-border/60 hover:shadow-lg transition-all duration-300 py-0"
                    >
                        {/* --- Image Section --- */}
                        <div className="relative aspect-[16/9] w-full overflow-hidden">
                            {/* Image */}
                            <img
                                src={blog.images[0].url}
                                alt={blog.title}
                                className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                            />

                            {/* Gradient Overlay (Optional: টেক্সট বা বাটন ক্লিয়ার দেখার জন্য) */}
                            <div
                                className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>

                            {/* --- Action Menu (FIXED) --- */}
                            <div className="absolute top-3 right-3 z-10">
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
                                            onClick={() => setDetailsOpen(true, blog)}
                                        >
                                            <Eye className="mr-2 h-4 w-4"/> View Details
                                        </DropdownMenuItem>

                                        {/* Edit & Delete (যদি দরকার হয় আনকমেন্ট করুন) */}
                                        <DropdownMenuItem
                                            className="cursor-pointer"
                                            onClick={() => setFormOpen(true, blog)}
                                        >
                                            <Edit className="mr-2 h-4 w-4"/> Edit
                                        </DropdownMenuItem>

                                        <DropdownMenuSeparator/>

                                        <DropdownMenuItem
                                            className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20"
                                            onClick={() => setDeleteId(blog._id)}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4"/> Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            {/* Optional: Category Badge */}
                            <Badge variant="secondary"
                                   className="absolute top-3 left-3 bg-background/80 backdrop-blur-sm z-10">
                                Blog
                            </Badge>
                        </div>

                        {/* --- Content Section --- */}
                        <CardHeader className="space-y-2 p-5 pb-2">
                            <div className="flex items-center text-xs text-muted-foreground">
                                <CalendarDays className="mr-1 h-3.5 w-3.5"/>
                                {new Date(blog.createdAt).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                            <Link to={`/blogs/${blog._id}`} className="block">
                                <h3 className="font-bold text-xl leading-tight tracking-tight hover:text-primary transition-colors line-clamp-2">
                                    {blog.title}
                                </h3>
                            </Link>
                        </CardHeader>

                        <CardContent className="p-5 pt-2 flex-grow">
                            <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                                {blog.content}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <BlogViewSheet />

            <DeleteConfirmDialog
                open={!!deleteId}
                onOpenChange={(open) => !open && setDeleteId(null)}
                blogId={deleteId}
            />
        </>
    );
};

export default BlogGrid;