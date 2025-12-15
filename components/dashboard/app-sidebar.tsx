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
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { getWorkspaceById } from "@/data/mockStorageData"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ChevronLeft, X } from "lucide-react"
import { NavigationData } from "@/data/navData"
import { Workspace } from "@/types/storage"



interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  collapsed?: boolean;
}

export function AppSidebar({ collapsed, ...props }: AppSidebarProps) {
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace>()
  const [showUpgradeCard, setShowUpgradeCard] = useState(true)
  const sidebar = useSidebar() // Get sidebar state

  // Use the state property instead of collapsed

  useEffect(() => {
    const storedWorkspaceId = localStorage.getItem("currentWorkspaceId")
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

  return (
    <Sidebar 
      collapsible="icon" 
      {...props}
      className="top-[38px] left-[38px] w-[200px] h-[calc(100vh-38px)] bg-white rounded-l-lg border-rs"
    >
      <SidebarHeader className="h-[35px] flex items-center border-bs">
        <div className="flex items-center justify-between w-full h-full">
          {currentWorkspace ? (
            <div className="flex items-center gap-[8px]">
              <Avatar 
                className="h-[24px] w-[24px]"
              >
                <AvatarFallback className="text-xs font-bold">
                  {currentWorkspace.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {sidebar.state === "expanded" && (
                <div className="h-[20px] text-sm font-semibold truncate">{currentWorkspace.name}</div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-[8px]">
              <Avatar className="h-6 w-6">
                <AvatarFallback>WS</AvatarFallback>
              </Avatar>
              {!sidebar && (
                <div className="text-sm font-semibold">No workspace</div>
              )}
            </div>
          )}
          <SidebarTrigger className="z-50"/>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <NavMain 
          items={NavigationData.navMain}
        />
      </SidebarContent>
      
      {sidebar.state === "expanded" && showUpgradeCard && (
        <SidebarFooter>
          <div className="bg-gradient-to-br from-blue-500/10 to-white-500/10 border-fs border-blue-200/50 dark:border-blue-700/30 rounded-lg p-2 relative overflow-hidden">
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-1 right-1 h-5 w-5"
              onClick={() => setShowUpgradeCard(false)}
            >
              <X className="h-3 w-3" />
            </Button>
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
    </Sidebar>
  )
}