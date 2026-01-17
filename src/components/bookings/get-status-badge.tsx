import {Badge} from "@/components/ui/badge";
import {CheckCircle, Clock, XCircle} from "lucide-react";

const getStatusBadge = (status: string) => {
    switch (status) {
        case "completed":
            return <Badge className="bg-green-100 text-green-700 border-green-200 gap-1"><CheckCircle className="w-3 h-3"/> Completed</Badge>;
        case "ongoing":
            return <Badge className="bg-blue-100 text-blue-700 border-blue-200 gap-1"><Clock className="w-3 h-3"/> Ongoing</Badge>;
        case "cancelled":
            return <Badge variant="destructive" className="gap-1"><XCircle className="w-3 h-3"/> Cancelled</Badge>;
        default:
            return <Badge variant="secondary" className="gap-1">Pending</Badge>;
    }
};

export default getStatusBadge;