import {useEffect} from "react";
import {useForm, useFieldArray} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useAppStore} from "@/stores/slices/store";
import {z} from "zod";
import {toast} from "sonner";
import {Loader2, Plus, Trash2, Save} from "lucide-react";

// UI Components
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter} from "@/components/ui/sheet";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Card, CardContent} from "@/components/ui/card";
import {Separator} from "@/components/ui/separator";

const facilitySchema = z.object({
    room: z.string(),
    facilityType: z.string().min(1, "Facility type is required"),
    facilityDetails: z.string()
        .min(1, "Facility details is required")
        .min(10, {message: "Facility details must be at least 10 characters."}),
    facilityList: z.array(z.object({
        name: z.string().min(1, "Facility name is required"),
        description: z.string().optional()
    })).min(1, "Add at least one facility item")
});

type FacilityFormValues = z.infer<typeof facilitySchema>;

export default function FacilitySheet() {
    const {
        isFacilitySheetOpen,
        setFacilitySheetOpen,
        selectedFacility,
        createFacility,
        updateFacility,
        isSubmitting,
        selectedRoomIdForCreate,
    } = useAppStore();

    const form = useForm<FacilityFormValues>({
        resolver: zodResolver(facilitySchema),
        defaultValues: {
            room: selectedRoomIdForCreate ?? "",
            facilityType: "room",
            facilityDetails: "",
            facilityList: [{name: "", description: ""}]
        }
    });

    // 2. Field Array for Dynamic Inputs
    const {fields, append, remove} = useFieldArray({
        control: form.control,
        name: "facilityList"
    });

    // 3. Populate Form for Edit Mode
    useEffect(() => {
        if (isFacilitySheetOpen) {
            if (selectedFacility) {
                form.reset({
                    room: selectedFacility.room,
                    facilityType: selectedFacility.facilityType,
                    facilityDetails: selectedFacility.facilityDetails || "",
                    facilityList: selectedFacility.facilityList.length > 0
                        ? selectedFacility.facilityList
                        : [{name: "", description: ""}]
                });
            } else {
                form.reset({
                    room: selectedRoomIdForCreate ?? "",
                    facilityType: "room",
                    facilityDetails: "",
                    facilityList: [{name: "", description: ""}]
                });
            }
        }
    }, [isFacilitySheetOpen, selectedFacility, form]);

    const onSubmit = async (data: FacilityFormValues) => {
        try {
            if (selectedFacility) {
                await updateFacility(selectedFacility._id, data);
                toast.success("Facility updated successfully!");
            } else {
                await createFacility(data);
                toast.success("Facility created successfully!");
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Operation failed");
        }
    };

    return (
        <Sheet
            open={isFacilitySheetOpen}
            onOpenChange={(open) => {
                if (!isSubmitting) setFacilitySheetOpen(open);
            }}
        >
            <SheetContent
                className="sm:max-w-xl w-full p-0 flex flex-col h-full bg-background"
                onInteractOutside={(e) => {
                    if (isSubmitting) e.preventDefault()
                }}
                onEscapeKeyDown={(e) => {
                    if (isSubmitting) e.preventDefault()
                }}
            >

                <div className="border-b">
                    <SheetHeader>
                        <SheetTitle>{selectedFacility ? "Edit Facility" : "Add New Facility"}</SheetTitle>
                        <SheetDescription>
                            Manage room amenities and features.
                        </SheetDescription>
                    </SheetHeader>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">

                        <ScrollArea className="flex-1 w-full h-[calc(100vh-16rem)] pb-5">
                            <div className="px-4 space-y-6">

                                {/* Facility Type */}
                                <FormField
                                    control={form.control}
                                    name="facilityType"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Facility Type</FormLabel>
                                            <FormControl>
                                                <Input readOnly placeholder="e.g. room" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                {/* Details */}
                                <FormField
                                    control={form.control}
                                    name="facilityDetails"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Facility Details</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Premium facilities..." {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <Separator/>

                                {/* Facility List (Dynamic Array) */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-semibold">Facility Items</h4>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => append({name: "", description: ""})}
                                        >
                                            <Plus className="w-3 h-3 mr-1"/> Add Item
                                        </Button>
                                    </div>

                                    {fields.map((field, index) => (
                                        <Card key={field.id} className="relative bg-muted/20">
                                            <CardContent className="p-3 space-y-3">
                                                <div className="flex gap-3 items-start">
                                                    <div className="flex-1 space-y-3">
                                                        <FormField
                                                            control={form.control}
                                                            name={`facilityList.${index}.name`}
                                                            render={({field}) => (
                                                                <FormItem className="space-y-1">
                                                                    <FormControl>
                                                                        <Input
                                                                            placeholder="Item Name (e.g. WiFi)" {...field}
                                                                            className="bg-background"/>
                                                                    </FormControl>
                                                                    <FormMessage/>
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <FormField
                                                            control={form.control}
                                                            name={`facilityList.${index}.description`}
                                                            render={({field}) => (
                                                                <FormItem className="space-y-1">
                                                                    <FormControl>
                                                                        <Textarea
                                                                            placeholder="Description (Optional)"
                                                                            {...field}
                                                                            className="min-h-[60px] resize-none bg-background"
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage/>
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>

                                                    {/* Remove Button */}
                                                    {fields.length > 1 && (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-muted-foreground hover:text-red-500 mt-1"
                                                            onClick={() => remove(index)}
                                                        >
                                                            <Trash2 className="w-4 h-4"/>
                                                        </Button>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                    {form.formState.errors.facilityList && (
                                        <p className="text-sm font-medium text-destructive">
                                            {form.formState.errors.facilityList.root?.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </ScrollArea>

                        <SheetFooter className="p-4 border-t bg-background mt-auto flex flex-row justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setFacilitySheetOpen(false)}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                <Save className="w-4 h-4 mr-2"/>
                                {selectedFacility ? "Update Facility" : "Save Facility"}
                            </Button>
                        </SheetFooter>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    );
}