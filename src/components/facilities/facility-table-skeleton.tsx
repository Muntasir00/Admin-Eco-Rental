import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {Skeleton} from "@/components/ui/skeleton";

const FacilityTableSkeleton = () => {
    return (
        <div className="rounded-md border border-slate-200 bg-white">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <Skeleton className="h-6 w-[150px]"/>
                <Skeleton className="h-9 w-[100px]"/>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <TableHead key={i}><Skeleton className="h-4 w-20"/></TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {[1, 2, 3, 4, 5].map((row) => (
                        <TableRow key={row}>
                            <TableCell><Skeleton className="h-5 w-24"/></TableCell>
                            <TableCell><Skeleton className="h-5 w-32"/></TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    <Skeleton className="h-6 w-16 rounded-full"/>
                                    <Skeleton className="h-6 w-12 rounded-full"/>
                                </div>
                            </TableCell>
                            <TableCell><Skeleton className="h-5 w-20"/></TableCell>
                            <TableCell><Skeleton className="h-8 w-8 rounded-md"/></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default FacilityTableSkeleton;