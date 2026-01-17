export interface UserShort {
    _id: string;
    username: string;
    email: string;
    role: string;
}

export interface RoomShort {
    _id: string;
    name: string;
    location: string;
    pricePerNight: number;
}

export interface Booking {
    _id: string;
    user: UserShort;
    room: RoomShort | null; // Room ডিলিট হয়ে গেলে null হতে পারে
    name: string; // Guest Name
    email: string;
    phoneNumber: string;
    checkIn: string;
    checkOut: string;
    discount: number;
    totalGuest: number;
    totalPrice: number;
    status: 'ongoing' | 'completed' | 'cancelled' | 'pending';
    roomsBooked: number;
    createdAt: string;
    updatedAt: string;
}

export interface BookingPagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface BookingResponse {
    bookings: Booking[];
    pagination: BookingPagination;
}