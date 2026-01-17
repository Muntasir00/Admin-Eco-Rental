import React, {useEffect, useState} from "react";
import {useAppStore} from "@/stores/slices/store";
import {
    Pencil,
    Trash2,
    Wifi,
    Wind,
    Wine,
    Coffee,
} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import FacilityTableSkeleton from "@/components/facilities/facility-table-skeleton";
import FacilitySheet from "@/components/facilities/facility-sheet";
import DeleteFacilityDialog from "@/components/facilities/delete-facility-dialog";

const getAmenityIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("wifi")) return <Wifi className="w-3 h-3 mr-1"/>;
    if (n.includes("ac") || n.includes("air")) return <Wind className="w-3 h-3 mr-1"/>;
    if (n.includes("bar")) return <Wine className="w-3 h-3 mr-1"/>;
    if (n.includes("coffee")) return <Coffee className="w-3 h-3 mr-1"/>;
    return null;
};


export default function FacilityPage() {
    const {fetchFacilities, facilities, isLoadingFacilities, setFacilitySheetOpen} = useAppStore();
    const [deleteId, setDeleteId] = useState<string | null>(null);

    useEffect(() => {
        fetchFacilities(1)
    }, [fetchFacilities]);

    if (isLoadingFacilities) {
        return (
            <div className="w-full bg-slate-50/50 min-h-screen p-6">
                <div className="mb-6 space-y-2">
                    <Skeleton className="h-8 w-64"/>
                    <Skeleton className="h-4 w-96"/>
                </div>
                <FacilityTableSkeleton/>
            </div>
        );
    }

    return (
        <div className="w-full bg-slate-50/50 min-h-screen">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Facility Management
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        View and manage room amenities across the hotel.
                    </p>
                </div>
            </div>

            {/* Main Table Card */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto relative">
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow>
                                <TableHead className="w-[50px]">#</TableHead>
                                <TableHead className="w-[250px]">Description</TableHead>
                                <TableHead className="min-w-[300px]">Amenities Included</TableHead>
                                <TableHead className="w-[150px]">Last Updated</TableHead>
                                <TableHead
                                    className="text-center w-[100px] sticky right-[-0.1px] bg-slate-50 z-20 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {facilities?.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                                        No facilities found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                facilities.map((facility, index: number) => {
                                    // FIX: Create a safe string variable
                                    const detailsText = facility.facilityDetails || "";

                                    return (
                                        <TableRow key={facility._id}
                                                  className="group hover:bg-slate-50/50 transition-colors">
                                            {/* Index Column */}
                                            <TableCell className="font-medium align-top py-4 text-slate-500">
                                                {index + 1}
                                            </TableCell>

                                            {/* Description Column (FIXED) */}
                                            <TableCell className="align-top py-4">
                                                <div className="flex flex-col max-w-[220px]">
                                                    {detailsText ? (
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <span className="cursor-help truncate block">
                                                                        {detailsText.length > 25
                                                                            ? `${detailsText.substring(0, 25)}...`
                                                                            : detailsText}
                                                                    </span>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p className="max-w-xs">{detailsText}</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    ) : (
                                                        <span className="text-slate-400 text-xs italic">
                                                            No description
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>

                                            {/* Amenities List (Badges) */}
                                            <TableCell className="align-top py-4">
                                                <div className="flex flex-wrap gap-2">
                                                    {facility.facilityList.map((item) => (
                                                        <TooltipProvider key={item._id}>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Badge
                                                                        variant="secondary"
                                                                        className="font-normal text-slate-700 bg-slate-100 hover:bg-slate-200 border-slate-200 px-2.5 py-1"
                                                                    >
                                                                        {getAmenityIcon(item.name)}
                                                                        {item.name}
                                                                    </Badge>
                                                                </TooltipTrigger>
                                                                {item.description && (
                                                                    <TooltipContent>
                                                                        <p>{item.description}</p>
                                                                    </TooltipContent>
                                                                )}
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    ))}
                                                </div>
                                            </TableCell>

                                            {/* Date Column */}
                                            <TableCell
                                                className="align-top py-4 text-slate-500 text-xs whitespace-nowrap">
                                                {facility.updatedAt ? new Date(facility.updatedAt).toLocaleDateString("en-US", {
                                                    month: "short", day: "numeric", year: "numeric"
                                                }) : "-"}
                                            </TableCell>

                                            {/* Actions Column */}
                                            {/*<TableCell className="align-top py-4 text-right">*/}
                                            <TableCell
                                                className="align-top py-4 text-right sticky right-[-0.1px] z-10 bg-white group-hover:bg-slate-50 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)] border-l border-slate-100">
                                                <div
                                                    className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-slate-400 hover:text-blue-600"
                                                        onClick={() => setFacilitySheetOpen(true, facility, "")}
                                                    >
                                                        <Pencil className="w-4 h-4"/>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-slate-400 hover:text-red-600"
                                                        onClick={() => setDeleteId(facility._id)}
                                                    >
                                                        <Trash2 className="w-4 h-4"/>
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <FacilitySheet/>

            <DeleteFacilityDialog
                facilityId={deleteId}
                open={!!deleteId}
                onOpenChange={(open) => !open && setDeleteId(null)}
            />

        </div>
    );
}