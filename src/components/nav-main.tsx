import {type LucideIcon} from "lucide-react"
import {
    SidebarContent,
    SidebarGroup, SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import {Link, useLocation} from "react-router";

interface NavItem {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
    items?: {
        title: string
        url: string
    }[]
}

interface NavMainProps {
    items: NavItem[]
}

export function NavMain({items}: NavMainProps) {
    const {pathname} = useLocation()
    return (
        <>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Menu</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname === item.url}
                                        tooltip={item.title}
                                    >
                                        <Link to={item.url}>
                                            <item.icon/>
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </>
    )
}
