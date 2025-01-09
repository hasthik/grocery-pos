"use client";

import * as React from "react";
import {
  Home,
  FileText,
  ShoppingBag,
  Settings2,
  BarChart,
  User,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { UserSwitcher } from "@/components/user-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  users: [
    { name: "John Doe", role: "Admin" },
    { name: "Jane Smith", role: "Editor" },
    { name: "Alice Johnson", role: "Viewer" },
  ],
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
    {
      title: "Orders",
      url: "/orders",
      icon: FileText,
    },
    {
      title: "Inventory",
      url: "/inventory",
      icon: Settings2,
    },
    {
      title: "Reports",
      url: "/reports",
      icon: BarChart,
    },
    {
      title: "Profile",
      url: "/profile",
      icon: User,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <UserSwitcher users={data.users} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
