import {AppSidebar} from "@/components/app-sidebar"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import {Outlet} from "react-router";
import Header from "@/components/header";

export default function Layout() {
    const cookieValue = document.cookie
        .split('; ')
        .find((row) => row.startsWith('sidebar:state='))
        ?.split('=')[1]

    const defaultOpen = cookieValue === 'true'
    return (
        <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar/>
            <SidebarInset className="h-svh flex flex-col overflow-hidden">
                <Header/>
                <div className="flex-1 overflow-y-auto p-4 pt-5">
                    <Outlet/>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
