import {Skeleton} from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export function BlogTableSkeleton() {
    // ৫টি ফেইক রো (Row) তৈরি করছি
    const rows = Array.from({length: 9});

    return (
        <div className="rounded-md border">
            <Table>
                {/* হেডার ফিক্সড থাকবে যাতে ইউজার বুঝতে পারে কলামগুলো কী */}
                <TableHeader>
                    <TableRow>
                        <TableHead >SL</TableHead>
                        <TableHead className="w-[80px]">Image</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {rows.map((_, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                <Skeleton className="h-8 w-10 rounded-md"/>
                            </TableCell>

                            {/* Image Column */}
                            <TableCell>
                                <Skeleton className="h-8 w-10 rounded-md"/>
                            </TableCell>

                            {/* Title Column */}
                            <TableCell>
                                <div className="space-y-2">
                                    <Skeleton className="h-8 w-[250px]"/>
                                </div>
                            </TableCell>

                            {/* Title Column */}
                            <TableCell>
                                <div className="space-y-2">
                                    <Skeleton className="h-8 w-[250px]"/>
                                </div>
                            </TableCell>

                            {/* Date Column */}
                            <TableCell>
                                <Skeleton className="h-8 w-[100px]"/>
                            </TableCell>

                            {/* Action Column (Right Aligned) */}
                            <TableCell className="text-right">
                                <div className="flex justify-end">
                                    <Skeleton className="h-8 w-8 rounded-md"/>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}