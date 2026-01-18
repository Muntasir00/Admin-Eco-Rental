import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { MoreVertical } from "lucide-react";

export type BookingItem = {
    id: string;
    name: string;
    type: string;
    typeColor: string;
    room: string;
    duration: string;
    dates: string;
    status: string;
    statusColor: string;
};

type BookingTableProps = {
    title?: string;
    data: BookingItem[];
    onFilterClick?: () => void;
};

const BookingList = ({
                          title = "Booking List",
                          data,
                          onFilterClick,
                      }: BookingTableProps) => {
    return (
        <Card className="xl:col-span-2 overflow-hidden p-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h3 className="font-bold text-lg">{title}</h3>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-green-50">
                            <TableHead>Booking ID</TableHead>
                            <TableHead>Guest Name</TableHead>
                            <TableHead>Room Type</TableHead>
                            <TableHead>Room Number</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Check-In & Check-Out</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead />
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {data.map((item) => (
                            <TableRow
                                key={item.id}
                                className="hover:bg-gray-50"
                            >
                                <TableCell className="font-medium">
                                    {item.id}
                                </TableCell>

                                <TableCell>{item.name}</TableCell>

                                <TableCell>
                                    <div className="flex items-center gap-2">
                    <span
                        className={`w-2 h-2 rounded-full ${item.typeColor}`}
                    />
                                        {item.type}
                                    </div>
                                </TableCell>

                                <TableCell>{item.room}</TableCell>
                                <TableCell>{item.duration}</TableCell>
                                <TableCell>{item.dates}</TableCell>

                                <TableCell>
                                  <span
                                      className={`px-3 py-1 rounded text-xs font-medium ${item.statusColor}`}
                                  >
                                    {item.status}
                                  </span>
                                </TableCell>

                                <TableCell className="text-gray-400">
                                    <MoreVertical className="cursor-pointer" size={16} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Card>
    );
};

export default BookingList;
