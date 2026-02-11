export interface User {
    _id: string;
    username: string;
    email: string;
    role: 'admin' | 'user'; // role based checking এর জন্য দরকার
    isVerified: boolean;
    avatar?: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    accessToken: string;
    refreshToken: string;
    accessTokenExp:number;
    refreshTokenExp:number;
    user: User;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isInitialized: boolean;
    loading: boolean;
}

export type BlogImage = {
    _id: string;
    url: string;
    publicId: string;
};

export interface Blog {
    _id: string;
    title: string;
    content: string;
    images: BlogImage[];
    imagePublicId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Pagination {
    total: number;
    page: number;
    totalPages: number;
}

// API থেকে যেই রেসপন্স আসবে তার টাইপ
export interface BlogResponse {
    success: boolean;
    blogs: {
        blogs: Blog[]; // এখানে blogs এর ভেতর আবার blogs অ্যারে আছে
        total: number;
        page: number;
        totalPages: number;
    };
}

export interface RoomImage {
    _id: string;
    url: string;
    publicId: string;
}

export interface Room {
    _id: string;
    name: string;
    description: string;
    location: string;
    size: number;
    bedroom: number;
    bathroom: number;
    balcony: boolean;
    availableRooms: number;
    pricePerNight: number;
    available: boolean;
    hasFacility: boolean;
    guest: number;
    images: RoomImage[];
    createdAt: string;
    updatedAt: string;
}

export interface RoomPagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface RoomResponse {
    rooms: Room[];
    pagination: Pagination;
}

export interface FacilityItem {
    _id: string;
    name: string;
    description?: string;
}

export interface Facility {
    _id: string;
    room: string; // Room ID
    facilityType: string;
    facilityDetails?: string;
    facilityList: FacilityItem[];
    createdAt?: string;
    updatedAt?: string;
}

export interface FacilityPayload {
    room: string;
    facilityType: string;
    facilityDetails?: string;
    facilityList: FacilityItem[];
}

export interface FacilityResponse {
    facilities: Facility[];
    pagination: FacilityPagination;
}

export interface FacilityPagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}