import {clsx, type ClassValue} from "clsx"
import {twMerge} from "tailwind-merge"
import {format} from "date-fns";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const getPageTitle = (path: string) => {
    switch (path) {
        case "/dashboard":
            return "Dashboard Overview";
        case "/blogs":
            return "Blog Management";
        case "/rooms":
            return "Room List";
        case "/facility":
            return "Facility Setup";
        case "/booking-list":
            return "Booking History";
        default:
            return path.replace("/", "").replace("-", " ").replace(/\b\w/g, c => c.toUpperCase()) || "Dashboard";
    }
}

export const formatDate = (date: string) => {
    try {
        return format(new Date(date), "MMM dd, yyyy");
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
        return date;
    }
};