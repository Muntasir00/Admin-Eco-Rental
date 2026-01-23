export const endpoints = {
    auth: {
        signIn: '/user/login',
        refreshToken: '/user/refresh-token',
        signUp: '/user/register',
        verify: '/user/verify',
        forgotPassword: '/user/forgot-password',
        verifyOtp: '/user/verify-otp/:email',
        changePassword: '/user/change-password/:email',
        logout: '/login',
    },
    blogs: {
        blogs: '/blogs',
        create: '/blogs/create',
        update: '/blogs',
        delete: '/blogs',
    },
    rooms: {
        allRooms: '/rooms',
        singleRoom: '/rooms',
        createRoom: '/rooms',
        updateRoom: '/rooms',
        delete: '/rooms',
    },
    facilities: {
        getAllFacilities: '/facilities',
        getSingleFacilities: '/facilities/room',
        createFacilities: '/facilities/create',
        updateFacilities: '/facilities',
        deleteFacilities: '/facilities',
    },
    booking: {
        getAllBookings: '/bookings/bookings-list',
    },
    dashboard:{
        overview: '/admin/dashboard-overview',
    }
};