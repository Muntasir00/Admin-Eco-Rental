import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppStore } from "@/stores/slices/store";
import { z } from "zod";
import { toast } from "sonner";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Loader2, X, ImagePlus } from "lucide-react";
import {Textarea} from "@/components/ui/textarea";

const roomFormSchema = z.object({
    name: z.string().min(3, "Name is required"),
    description: z.string().min(20, "Description is required"),
    location: z.string().min(3, "Location is required"),
    size: z.coerce.number().min(1, "Size is required"),
    bedroom: z.coerce.number().min(1, "Bedroom count is required"),
    bathroom: z.coerce.number().min(1, "Bathroom count is required"),
    guest: z.coerce.number().min(1, "Guest capacity is required"),
    availableRooms: z.coerce.number().min(0, "Available rooms required"),
    pricePerNight: z.coerce.number().min(1, "Price is required"),
    balcony: z.boolean().default(false),
    images: z.array(z.any())
        .min(1, { message: "At least one image is required." })
        .max(5, { message: "You can upload a maximum of 5 images." }),
});

type RoomFormValues = z.infer<typeof roomFormSchema>;

export default function CreateUpdateRoomSheet() {
    const {
        isCreateRoomSheetOpen,
        setCreateRoomSheetOpen,
        createRoom,
        updateRoom,
        selectedRoom,
        isSubmitting
    } = useAppStore();

    const [removedImageIds, setRemovedImageIds] = useState<string[]>([]);

    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    const form = useForm({
        resolver: zodResolver(roomFormSchema),
        defaultValues: {
            name: "",
            description:"",
            location: "",
            size: 0,
            bedroom: 0,
            bathroom: 0,
            guest: 0,
            availableRooms: 0,
            pricePerNight: 0,
            balcony: false,
            images: [],
        },
    });

    const currentImages = form.watch("images");
    const isMaxImagesReached = currentImages && currentImages.length >= 5;

    useEffect(() => {
        if (isCreateRoomSheetOpen) {
            if (selectedRoom) {
                form.reset({
                    name: selectedRoom.name,
                    description: selectedRoom.description,
                    location: selectedRoom.location,
                    size: selectedRoom.size,
                    bedroom: selectedRoom.bedroom,
                    bathroom: selectedRoom.bathroom,
                    guest: selectedRoom.guest,
                    availableRooms: selectedRoom.availableRooms,
                    pricePerNight: selectedRoom.pricePerNight,
                    balcony: selectedRoom.balcony,
                });

                const existingImages = selectedRoom.images.map((img: any) => ({
                    url: img.url,
                    publicId: img.publicId || img._id
                }));

                form.setValue("images", existingImages);
                generatePreviews(existingImages);
                setRemovedImageIds([]);
            } else {
                form.reset({
                    name: "",
                    description: "",
                    location: "",
                    size: 0,
                    bedroom: 0,
                    bathroom: 0,
                    guest: 0,
                    availableRooms: 0,
                    pricePerNight: 0,
                    balcony: false,
                    images: [],
                });
                setPreviewUrls([]);
                setRemovedImageIds([]);
            }
        }
    }, [isCreateRoomSheetOpen, selectedRoom, form]);

    const generatePreviews = (filesOrImages: any[]) => {
        const urls = filesOrImages.map((item) => {
            if (item instanceof File) {
                return URL.createObjectURL(item);
            }
            return item.url;
        });
        setPreviewUrls(urls);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: any) => void) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const newFiles = Array.from(files);
            const currentImagesVal = form.getValues("images") || [];

            if (currentImagesVal.length + newFiles.length > 5) {
                toast.error("You can upload a maximum of 5 images.");
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
            if (itemToRemove.publicId) {
                setRemovedImageIds((prev) => [...prev, itemToRemove.publicId]);
            }
        }

        const updatedImages = currentImagesVal.filter((_, idx) => idx !== indexToRemove);
        form.setValue("images", updatedImages, { shouldValidate: true });
        generatePreviews(updatedImages);
    };

    const onSubmit = async (data: RoomFormValues) => {
        try {
            const formData = new FormData();

            formData.append("name", data.name);
            formData.append("description", data.description);
            formData.append("location", data.location);
            formData.append("size", data.size.toString());
            formData.append("bedroom", data.bedroom.toString());
            formData.append("bathroom", data.bathroom.toString());
            formData.append("guest", data.guest.toString());
            formData.append("availableRooms", data.availableRooms.toString());
            formData.append("pricePerNight", data.pricePerNight.toString());
            formData.append("balcony", data.balcony.toString());

            data.images.forEach((image) => {
                if (image instanceof File) {
                    formData.append("images", image);
                }
            });

            if (selectedRoom) {
                if (removedImageIds.length > 0) {
                    removedImageIds.forEach((id) => {
                        formData.append("removeImages[]", id);
                    });
                }

                await updateRoom(selectedRoom._id, formData);
                toast.success("Room updated successfully!");
            } else {
                await createRoom(formData);
                toast.success("Room created successfully!");
            }
        } catch (error: any) {
            toast.error(error.message || "Operation failed");
            console.error(error);
        }
    };

    return (
        <Sheet
            open={isCreateRoomSheetOpen}
            onOpenChange={(open) => {
                if (isSubmitting) return;
                setCreateRoomSheetOpen(open)
            }}
        >
            <SheetContent
                className="sm:max-w-xl w-full p-0 flex flex-col h-full bg-background"
                // সাবমিট হওয়ার সময় বন্ধ করা আটকানো
                onInteractOutside={(e) => { if(isSubmitting) e.preventDefault() }}
                onEscapeKeyDown={(e) => { if(isSubmitting) e.preventDefault() }}
            >

                <div className="border-b">
                    <SheetHeader>
                        <SheetTitle>{selectedRoom ? "Edit Room Details" : "Add New Room"}</SheetTitle>
                        <SheetDescription>
                            {selectedRoom ? "Update the details of existing room." : "Fill in the details to create a new room listing."}
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

                {/* ফর্ম স্ক্রল এরিয়া */}
                <ScrollArea className="flex-1 w-full h-[calc(100vh-14rem)]">
                    <div className="px-4 py-3">
                        <Form {...form}>
                            <form id="room-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                                {/* Name */}
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Room Name <span className="text-red-600">*</span></FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. Premium Ocean View Suite" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                {/* description */}
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Description<span className="text-red-600">*</span></FormLabel>
                                            <FormControl>
                                                <Textarea className="h-32"  placeholder="Description ...." {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                {/* Location */}
                                <FormField
                                    control={form.control}
                                    name="location"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Location <span className="text-red-600">*</span></FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. 6391 Elgin St. Celina, Delaware" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                {/* গ্রিড লেআউট */}
                                <div className="grid sm:grid-cols-2 gap-4 items-baseline">
                                    <FormField control={form.control} name="pricePerNight" render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Price ($) <span className="text-red-600">*</span></FormLabel>
                                            <FormControl><Input type="number" {...field} value={field.value as number} /></FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}/>

                                    <FormField control={form.control} name="size" render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Size (sq ft)<span className="text-red-600">*</span></FormLabel>
                                            <FormControl><Input type="number" {...field} value={field.value as number} /></FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}/>

                                    <FormField control={form.control} name="bedroom" render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Bedrooms<span className="text-red-600">*</span></FormLabel>
                                            <FormControl><Input type="number" {...field} value={field.value as number} /></FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}/>

                                    <FormField control={form.control} name="bathroom" render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Bathrooms<span className="text-red-600">*</span></FormLabel>
                                            <FormControl><Input type="number" {...field} value={field.value as number} /></FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}/>

                                    <FormField control={form.control} name="guest" render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Max Guests<span className="text-red-600">*</span></FormLabel>
                                            <FormControl><Input type="number" {...field} value={field.value as number} /></FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}/>

                                    <FormField control={form.control} name="availableRooms" render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Available Rooms</FormLabel>
                                            <FormControl><Input type="number" {...field} value={field.value as number} /></FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}/>
                                </div>

                                {/* Checkbox */}
                                <FormField
                                    control={form.control}
                                    name="balcony"
                                    render={({field}) => (
                                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>Has Balcony?</FormLabel>
                                                <FormDescription>
                                                    Include private balcony check.
                                                </FormDescription>
                                            </div>
                                        </FormItem>
                                    )}
                                />

                                {/* Image Upload Area */}
                                <FormField
                                    control={form.control}
                                    name="images"
                                    render={({ field: { onChange, value, ...rest } }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Room Images <span className="text-red-600">*</span>
                                                <span className="ml-2 text-xs text-muted-foreground font-normal">
                                                    (Max 5, Current: {currentImages?.length || 0})
                                                </span>
                                            </FormLabel>
                                            <FormControl>
                                                <div className="space-y-4">
                                                    {/* Previews */}
                                                    {previewUrls.length > 0 && (
                                                        <div className="grid grid-cols-3 gap-4">
                                                            {previewUrls.map((src, idx) => (
                                                                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border group bg-muted">
                                                                    <img
                                                                        src={src}
                                                                        alt="preview"
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeImage(idx)}
                                                                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                                                        title="Remove Image"
                                                                    >
                                                                        <X className="h-3 w-3" />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Upload Input - Hidden if Max Limit Reached */}
                                                    {!isMaxImagesReached ? (
                                                        <div className="flex flex-col gap-2">
                                                            <Input
                                                                type="file"
                                                                accept="image/*"
                                                                multiple
                                                                className="hidden"
                                                                id="room-image-upload"
                                                                onChange={(e) => handleImageChange(e, onChange)}
                                                                {...rest}
                                                            />
                                                            <label
                                                                htmlFor="room-image-upload"
                                                                className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors border-muted-foreground/25 bg-muted/5"
                                                            >
                                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                                    <ImagePlus className="w-8 h-8 mb-2 text-muted-foreground"/>
                                                                    <p className="text-sm text-muted-foreground">Click to upload images</p>
                                                                    <p className="text-xs text-muted-foreground mt-1">
                                                                        You can add {5 - (currentImages?.length || 0)} more
                                                                    </p>
                                                                </div>
                                                            </label>
                                                        </div>
                                                    ) : (
                                                        <div className="p-3 text-center border border-dashed rounded-lg bg-yellow-50/50 text-sm text-muted-foreground">
                                                            Maximum 5 images allowed. Remove one to add more.
                                                        </div>
                                                    )}
                                                </div>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </form>
                        </Form>
                    </div>
                </ScrollArea>

                {/* Footer Actions */}
                <SheetFooter className="p-4 border-t bg-background flex flex-row justify-end items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setCreateRoomSheetOpen(false)}
                        type="button"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" form="room-form" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                        {selectedRoom ? "Update Room" : "Create Room"}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}