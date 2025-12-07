// components/app-sidebar.tsx
"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { NavMain } from "@/components/dashboard/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { DashboardIcon, NotesIcon, StorageDriveIcon, StorageIcon, StorageSend2Icon, StorageStatusIcon, StorageTrashIcon } from "./SVGs"
import { getWorkspaceById } from "@/data/mockStorageData"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ChevronLeft, X } from "lucide-react"

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

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  collapsed?: boolean;
}

export function AppSidebar({ collapsed, ...props }: AppSidebarProps) {
  const [currentWorkspace, setCurrentWorkspace] = useState<ReturnType<typeof getWorkspaceById> | null>(null)
  const [showUpgradeCard, setShowUpgradeCard] = useState(true)
  const sidebar = useSidebar() // Get sidebar state

  // Use the state property instead of collapsed
  const isCollapsed = sidebar.state === "collapsed"

  useEffect(() => {
    const storedWorkspaceId = localStorage.getItem("currentWorkspace")
    if (storedWorkspaceId) {
      const workspace = getWorkspaceById(parseInt(storedWorkspaceId))
      setCurrentWorkspace(workspace)
    }
  }, [])

  // Sync external collapsed prop with sidebar state
  useEffect(() => {
    if (collapsed !== undefined) {
      sidebar.setOpen?.(!collapsed)
    }
  }, [collapsed, sidebar])

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

  return (
    <Sidebar 
      collapsible="icon" 
      {...props} 
      className="left-[168px] top-[38px] w-[218px] h-[calc(100vh-38px)] rounded-lg mx-auto"
    >
      <SidebarHeader className="h-[36px] flex items-center border-b">
        <div className="flex items-center justify-between w-full h-auto">
          {currentWorkspace ? (
            <div className="flex items-center gap-2">
              <Avatar 
                className="h-7 w-7"
              >
                <AvatarFallback className="text-xs font-bold">
                  {currentWorkspace.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="text-sm font-semibold truncate">{currentWorkspace.name}</div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Avatar className="h-7 w-7">
                <AvatarFallback>WS</AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="text-sm font-semibold">No workspace</div>
              )}
            </div>
          )}
          <SidebarTrigger className="z-50"/>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <NavMain 
          items={data.navMain}
        />
      </SidebarContent>
      
      {!isCollapsed && showUpgradeCard && (
        <SidebarFooter>
          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-200/50 dark:border-blue-700/30 rounded-lg p-3 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute top-0 right-0 w-16 h-16 opacity-10">
              <div className="absolute top-0 right-0 w-8 h-8 rounded-full bg-blue-500"></div>
              <div className="absolute bottom-0 left-0 w-6 h-6 rounded-full bg-purple-500"></div>
            </div>
            
            {/* Close button */}
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-1 right-1 h-5 w-5"
              onClick={() => setShowUpgradeCard(false)}
            >
              <X className="h-3 w-3" />
            </Button>
            
            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-semibold">Upgrade Space</div>
                  <div className="text-xs text-muted-foreground">Increase your storage</div>
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground">
                Lorem ipsum dolor sit amet consectetur. Get more space for your team and projects.
              </p>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs h-6"
                  onClick={() => setShowUpgradeCard(false)}
                >
                  Dismiss
                </Button>
                <Button
                  size="sm"
                  className="flex-1 text-xs h-6"
                >
                  Upgrade
                  <ChevronLeft className="rotate-120"/>
                </Button>
              </div>
            </div>
          </div>
        </SidebarFooter>
      )}
      
      <SidebarRail />
    </Sidebar>
  )
}