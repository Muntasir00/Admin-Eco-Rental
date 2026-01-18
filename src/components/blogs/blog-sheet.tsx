import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useAppStore} from "@/stores/slices/store";
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription} from "@/components/ui/sheet";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Loader2, Upload, X} from "lucide-react";
import {toast} from "sonner";
import {z} from "zod";
import {ScrollArea} from "@/components/ui/scroll-area";

// eslint-disable-next-line react-refresh/only-export-components
export const blogFormSchema = z.object({
    title: z.string().min(5, {message: "Title must be at least 5 characters."}),
    content: z.string().min(20, {message: "Content must be at least 20 characters."}),
    images: z.array(z.any())
        .min(1, {message: "At least one image is required."})
        .max(5, {message: "You can upload a maximum of 5 images."}),
});

export type BlogFormValues = z.infer<typeof blogFormSchema>;

const BlogSheet = () => {
    const {isFormOpen, setFormOpen, selectedBlog, createBlog, updateBlog, isSubmitting} = useAppStore();

    const [removedImageIds, setRemovedImageIds] = useState<string[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    const form = useForm<BlogFormValues>({
        resolver: zodResolver(blogFormSchema),
        defaultValues: {
            title: "",
            content: "",
            images: [],
        },
    });

    const currentImages = form.watch("images");
    const isMaxImagesReached = currentImages && currentImages.length >= 5;

    useEffect(() => {
        if (isFormOpen) {
            if (selectedBlog) {
                form.setValue("title", selectedBlog.title);
                form.setValue("content", selectedBlog.content);

                const existingImages = selectedBlog.images.map((img: any) => ({
                    url: img.url,
                    publicId: img.publicId || img._id
                }));

                form.setValue("images", existingImages);
                generatePreviews(existingImages);
                setRemovedImageIds([]);
            } else {
                form.reset({title: "", content: "", images: []});
                setPreviewUrls([]);
                setRemovedImageIds([]);
            }
        }
    }, [selectedBlog, form, isFormOpen]);

    const generatePreviews = (filesOrImages: any[]) => {
        const urls = filesOrImages.map((item) => {
            if (item instanceof File) return URL.createObjectURL(item);
            return item.url || item;
        });
        setPreviewUrls(urls);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: any) => void) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const newFiles = Array.from(files);
            const currentImagesVal = form.getValues("images") || [];

            if (currentImagesVal.length + newFiles.length > 5) {
                toast.error("You can only have up to 5 images total.");
                return;
            }

            const updatedImages = [...currentImagesVal, ...newFiles];
            onChange(updatedImages);
            generatePreviews(updatedImages);
        }
    };

    const removeImage = (indexToRemove: number) => {
        const currentImagesVal = form.getValues("images");
        const itemToRemove = currentImagesVal[indexToRemove];

        if (!(itemToRemove instanceof File)) {
            const publicId = itemToRemove.publicId;

            if (publicId) {
                setRemovedImageIds((prev) => [...prev, publicId]);
            } else {
                console.error("Public ID missing for image:", itemToRemove);
            }
        }

        const updatedImages = currentImagesVal.filter((_, index) => index !== indexToRemove);
        form.setValue("images", updatedImages, {shouldValidate: true});
        generatePreviews(updatedImages);
    };

    const onSubmit = async (data: BlogFormValues) => {
        try {
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("content", data.content);

            data.images.forEach((image) => {
                if (image instanceof File) {
                    formData.append("images", image);
                }
            });

            if (selectedBlog) {
                // Edit Mode
                if (removedImageIds.length > 0) {
                    removedImageIds.forEach((id) => {
                        formData.append("removeImageIds[]", id);
                    });
                }
                await updateBlog(selectedBlog._id, formData);
                toast.success("Blog updated successfully!");
            } else {
                // Create Mode
                await createBlog(formData);
                toast.success("Blog created successfully!");
            }
            setFormOpen(false);
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Something went wrong");
        }
    };

    return (
        <Sheet
            open={isFormOpen}
            onOpenChange={(open) => {
                if (isSubmitting) return;
                setFormOpen(open);
            }}>
            <SheetContent
                className="sm:max-w-xl w-full p-0 flex flex-col h-full"
                onEscapeKeyDown={(e) => {
                    if (isSubmitting) e.preventDefault();
                }}
                onInteractOutside={(e) => {
                    if (isSubmitting) e.preventDefault();
                }}
            >

                <div className="border-b">
                    <SheetHeader>
                        <SheetTitle>{selectedBlog ? "Edit Blog Post" : "Create New Blog"}</SheetTitle>
                        <SheetDescription>
                            {selectedBlog ? "Update existing details." : "Fill details to create post."}
                        </SheetDescription>
                    </SheetHeader>
                    {isSubmitting && (
                        <style>{`
                            button[type="button"].absolute.right-4.top-4 {
                                display: none !important;
                            }
                        `}</style>
                    )}
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
                        <ScrollArea className="flex-1 w-full h-[calc(100vh-14rem)]">
                            <div className="space-y-6 px-4 py-2">
                                {/* Title */}
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Blog Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter title" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                {/* Content */}
                                <FormField
                                    control={form.control}
                                    name="content"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Content</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Write content..."
                                                          className="min-h-[150px]" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                {/* Images */}
                                <FormField
                                    control={form.control}
                                    name="images"
                                    render={({field: {onChange, value, ...rest}}) => (
                                        <FormItem>
                                            <FormLabel>
                                                Blog Images
                                                <span className="ml-2 text-xs font-normal text-muted-foreground">
                                                    (Max 5, Selected: {currentImages?.length || 0})
                                                </span>
                                            </FormLabel>
                                            <FormControl>
                                                <div className="space-y-4">

                                                    {/* Previews */}
                                                    {previewUrls.length > 0 && (
                                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                                            {previewUrls.map((src, index) => (
                                                                <div key={index}
                                                                     className="relative aspect-video group rounded-md overflow-hidden border bg-muted">
                                                                    <img src={src} alt="preview"
                                                                         className="w-full h-full object-cover"/>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeImage(index)}
                                                                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                                                                    >
                                                                        <X className="w-3 h-3"/>
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {!isMaxImagesReached ? (
                                                        <div className="flex flex-col gap-2">
                                                            <Input
                                                                type="file"
                                                                accept="image/*"
                                                                multiple
                                                                className="hidden"
                                                                id="blog-image-upload"
                                                                onChange={(e) => handleImageChange(e, onChange)}
                                                                {...rest}
                                                            />
                                                            <label
                                                                htmlFor="blog-image-upload"
                                                                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors border-muted-foreground/25 bg-muted/5"
                                                            >
                                                                <div
                                                                    className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                                                                    <Upload
                                                                        className="w-8 h-8 mb-2 text-muted-foreground"/>
                                                                    <p className="text-sm text-muted-foreground">
                                                                        <span
                                                                            className="font-semibold">Click to upload</span>
                                                                    </p>
                                                                    <p className="text-xs text-muted-foreground mt-1">
                                                                        You can
                                                                        add {5 - (currentImages?.length || 0)} more
                                                                    </p>
                                                                </div>
                                                            </label>
                                                        </div>
                                                    ) : (
                                                        <div
                                                            className="p-4 rounded-lg border border-dashed text-center bg-muted/20 text-muted-foreground text-sm">
                                                            Maximum image limit (5) reached. <br/> Remove an image to
                                                            upload a new one.
                                                        </div>
                                                    )}
                                                </div>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </ScrollArea>

                        <div className="p-4 border-t bg-background mt-auto flex justify-end gap-3">
                            <Button type="button" variant="outline" disabled={isSubmitting}
                                    onClick={() => setFormOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                        Processing...
                                    </>
                                ) : (
                                    selectedBlog ? "Update Post" : "Publish Post"
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    );
};

export default BlogSheet;