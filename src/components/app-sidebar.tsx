import * as React from "react"
import {
    LayoutGrid,
    BookOpenIcon,
    Cuboid,
    Building2, CalendarCheck2
} from "lucide-react"
import Logo from "@/assets/logo.png"

import {NavMain} from "@/components/nav-main"
import {NavUser} from "@/components/nav-user"
import {TeamSwitcher} from "@/components/team-switcher"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    teams: [
        {
            name: "Lon",
            logo: Logo,
            plan: "Enterprise",
        },
    ],
    navMain: [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: LayoutGrid,
        },
        {
            title: "Blogs",
            url: "/blogs",
            icon: BookOpenIcon,
        },
        {
            title: "Rooms",
            url: "/rooms",
            icon: Cuboid,
        },
        {
            title: "Facility",
            url: "/facility",
            icon: Building2,
        },
        {
            title: "Booking List",
            url: "/booking-list",
            icon: CalendarCheck2,
        },
    ],
}

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={data.teams}/>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain}/>
            </SidebarContent>
            <SidebarFooter>
                <NavUser/>
            </SidebarFooter>
            <SidebarRail/>
        </Sidebar>
    )
}
