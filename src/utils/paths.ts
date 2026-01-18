const ROOTS = {
    AUTH: '/',
    Home: '/',
    Public: '/',
};

// ----------------------------------------------------------------------

export const paths = {
    page404: '/error/404',

    // AUTH
    auth: {
        jwt: {
            signIn: `${ROOTS.AUTH}/login`,
            signUp: `${ROOTS.AUTH}/sign-up`,
            forgotPassword: `${ROOTS.AUTH}/forgot-password`,
            verifyOtp: `${ROOTS.AUTH}/verify-otp`,
            verify_otp: `${ROOTS.AUTH}/verify-otp/:email`,
            changePassword: `${ROOTS.AUTH}/change-password`,
        },
    },

    // DASHBOARD
    home: {
        root: ROOTS.Home,
    },
    public: {
        root: '/',
        blog: '/blog',
        blogDetail: '/blog/:slug',
        contact: '/contact-us',
        about: '/about-us',
    },
};
