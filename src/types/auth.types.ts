export type SignInParams = {
    email: string;
    password: string;
};

export type ForgotPasswordParams = {
    email: string;
};

export type SignUpParams = {
    email: string;
    password: string;
    username: string;
};

export type ChangePasswordParams = {
    email: string;
    newPassword: string;
    confirmPassword: string;
};