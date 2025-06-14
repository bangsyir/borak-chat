import type React from "react";
import {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  Sidebar,
} from "../ui/sidebar";
import { Link } from "react-router";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import {
  ChartBarIcon,
  FolderIcon,
  LayoutDashboardIcon,
  LayoutListIcon,
  MedalIcon,
  UsersIcon,
} from "lucide-react";
import { ModeToggle } from "../mode-toggle";

const data = {
  user: {
    username: "bangsyir",
    email: "bangsyir@gmail.com",
    avatar: "",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Lifecycle",
      url: "#",
      icon: LayoutListIcon,
    },
    {
      title: "Analytics",
      url: "#",
      icon: ChartBarIcon,
    },
    {
      title: "Projects",
      url: "#",
      icon: FolderIcon,
    },
    {
      title: "Team",
      url: "#",
      icon: UsersIcon,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to={"/"}>
                <MedalIcon className="!size-5" />
                <span className="text-base font-semibold">Borak Inc.</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
