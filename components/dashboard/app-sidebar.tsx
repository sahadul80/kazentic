// components/app-sidebar.tsx
"use client"

import * as React from "react"

import { NavMain } from "@/components/dashboard/nav-main"
import { NavUser } from "@/components/dashboard/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { DashboardIcon, NotesIcon, StorageDriveIcon, StorageIcon, StorageSend2Icon, StorageStatusIcon, StorageTrashIcon } from "./SVGs"
import { TeamSwitcher } from "./team-switcher"
import { useNavigation } from "./navigation-provider"

export type SubItem = {
  title: string;
  url: string;
  Icon: React.ComponentType<{ active?: boolean; size?: string }>;
}

export type NavItem = {
  title: string;
  url: string;
  icon: React.ComponentType<{ active?: boolean; size?: string }>;
  isActive: boolean;
  items?: SubItem[];
}

// This is sample data.
const data: { 
  user: { name: string; email: string; avatar: string }; 
  navMain: NavItem[] 
} = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: DashboardIcon,
      isActive: true,
    },
    {
      title: "Storage",
      url: "/storage/my",
      icon: StorageIcon,
      isActive: false,
      items: [
        {
            title: "My Storage",
            url: "/storage/my",
            Icon: StorageDriveIcon
        },
        {
            title: "Shared",
            url: "/storage/shared",
            Icon: StorageSend2Icon
        },
        {
            title: "Trash",
            url: "/storage/trash",
            Icon: StorageTrashIcon
        },
        {
            title: "Storage Status",
            url: "/storage/status",
            Icon: StorageStatusIcon
        }
      ]
    },
    {
      title: "Notes",
      url: "/notes",
      icon: NotesIcon,
      isActive: false,
    }
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { setActiveMainItem, setActiveSubItem } = useNavigation()

  return (
    <Sidebar collapsible="icon" {...props} className="left-[172px] top-[38px] w-[218px] rounded-lg">
        <div className="flex flex-row items-center justify-end">
            <NavUser user={data.user} />
            <SidebarTrigger/>
        </div>
      <SidebarContent>
        <NavMain 
          items={data.navMain}
          onNavigationChange={(mainItem, subItem) => {
            setActiveMainItem(mainItem)
            setActiveSubItem(subItem!)
          }}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}