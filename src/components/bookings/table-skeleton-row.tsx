import {
    TableCell, TableRow
} from "@/components/ui/table";
import {Skeleton} from "@/components/ui/skeleton";

const TableSkeletonRow = () => (
    <TableRow>
        <TableCell><Skeleton className="h-4 w-4" /></TableCell>
        <TableCell>
            <div className="space-y-2">
                <Skeleton className="h-4 w-[120px]" />
                <Skeleton className="h-3 w-[150px]" />
                <Skeleton className="h-3 w-[100px]" />
            </div>
        </TableCell>
        <TableCell>
            <div className="space-y-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-3 w-[140px]" />
            </div>
        </TableCell>
        <TableCell>
            <div className="space-y-2">
                <Skeleton className="h-3 w-[100px]" />
                <Skeleton className="h-3 w-[100px]" />
            </div>
        </TableCell>
        <TableCell><Skeleton className="h-6 w-[80px] rounded-full" /></TableCell>
        <TableCell className="text-right">
            <div className="flex flex-col items-end gap-1">
                <Skeleton className="h-4 w-[80px]" />
                <Skeleton className="h-3 w-[50px]" />
            </div>
        </TableCell>
        <TableCell className="text-center sticky right-0 bg-white">
            <Skeleton className="h-8 w-8 rounded-md mx-auto" />
        </TableCell>
    </TableRow>
);

export default TableSkeletonRow;