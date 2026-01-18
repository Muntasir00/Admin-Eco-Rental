import {useAppStore} from "@/stores/slices/store";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {MoreHorizontal, Edit, Trash2, Eye} from "lucide-react";
import {Avatar, AvatarImage, AvatarFallback} from "@/components/ui/avatar";
import DeleteConfirmDialog from "@/components/blogs/delete-confirm-dialog";
import {useState} from "react";
import BlogViewSheet from "@/components/blogs/blog-view-sheet";

const BlogTable = () => {
    const {blogs, setFormOpen, setDetailsOpen} = useAppStore();
    const [deleteId, setDeleteId] = useState<string | null>(null);

    return (
        <>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>SL</TableHead>
                            <TableHead className="w-[80px]">Image</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {blogs.map((blog, index: number) => (
                            <TableRow key={blog._id}>
                                <TableCell className="font-medium">
                                    {index + 1}
                                </TableCell>
                                <TableCell>
                                    <Avatar className="h-10 w-10 rounded-md">
                                        <AvatarImage
                                            src={blog.images[0]?.url}
                                            className="object-cover"
                                        />
                                        <AvatarFallback>IMG</AvatarFallback>
                                    </Avatar>
                                </TableCell>
                                <TableCell className="font-medium max-w-[150px] truncate">
                                    {blog.title}
                                </TableCell>
                                <TableCell className="font-medium max-w-[200px] truncate">
                                    {blog.content}
                                </TableCell>
                                <TableCell>{new Date(blog.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <MoreHorizontal className="h-4 w-4"/>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem className="cursor-pointer"
                                                              onClick={() => setDetailsOpen(true, blog)}>
                                                <Eye className="mr-2 h-4 w-4"/> View
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="cursor-pointer"
                                                              onClick={() => setFormOpen(true, blog)}>
                                                <Edit className="mr-2 h-4 w-4"/> Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-red-600 cursor-pointer"
                                                onClick={() => setDeleteId(blog._id)}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4"/> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <BlogViewSheet/>

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmDialog
                open={!!deleteId}
                onOpenChange={(open) => !open && setDeleteId(null)}
                blogId={deleteId}
            />
        </>
    );
};

export default BlogTable;