import {LoginForm} from "@/components/auth/login-form";
import Logo from "@/assets/logo.png"

export default function LoginPage() {
    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <a href="#" className="flex items-center gap-2 self-center font-medium">
                    <img src={Logo} className="w-14 h-auto"/>
                </a>
                <LoginForm/>
            </div>
        </div>
    )
}