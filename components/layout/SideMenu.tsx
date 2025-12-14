"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { PlusIcon, Settings2, Bug, HelpCircle, Users, ChevronDown, Plus } from "lucide-react"
import { useState, useEffect } from "react"
import { mockUsers, getWorkspaceById, mockWorkspaces } from "@/data/mockStorageData"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function SideMenu() {
  const [currentWorkspace, setCurrentWorkspace] = useState<ReturnType<typeof getWorkspaceById> | null>(null)
  const [workspaceMembers, setWorkspaceMembers] = useState<typeof mockUsers>([])
  const [availableWorkspaces, setAvailableWorkspaces] = useState<typeof mockWorkspaces>([])
  const [currentUser, setCurrentUser] = useState<typeof mockUsers[0] | null>(null)

  useEffect(() => {
    try {
      // Get current user
      const storedUserStr = localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser")
      
      if (storedUserStr) {
        const user = JSON.parse(storedUserStr)
        setCurrentUser(user)
        
        // Get user's available workspaces
        if (user && user.id) {
          const userWorkspaces = mockWorkspaces.filter(workspace => 
            workspace.ownerId === user.id || workspace.memberIds?.includes(user.id)
          )
          setAvailableWorkspaces(userWorkspaces)
        }
      }
      
      // Get current workspace (try object first, then ID)
      let workspace = null
      const storedWorkspaceStr = localStorage.getItem("currentWorkspace")
      
      if (storedWorkspaceStr) {
        try {
          workspace = JSON.parse(storedWorkspaceStr)
        } catch (e) {
          // If parsing fails, try to get by ID
          const workspaceId = parseInt(storedWorkspaceStr)
          if (!isNaN(workspaceId)) {
            workspace = getWorkspaceById(workspaceId)
          }
        }
      } else {
        // Try getting by workspace ID
        const storedWorkspaceId = localStorage.getItem("currentWorkspaceId")
        if (storedWorkspaceId) {
          const workspaceId = parseInt(storedWorkspaceId)
          if (!isNaN(workspaceId)) {
            workspace = getWorkspaceById(workspaceId)
          }
        }
      }
      
      setCurrentWorkspace(workspace)
      
      if (workspace) {
        // Get workspace members
        const members = mockUsers.filter(user => 
          workspace.memberIds?.includes(user.id)
        )
        setWorkspaceMembers(members)
      }
    } catch (error) {
      console.error("Error loading sidebar data:", error)
      // Clear invalid data
      localStorage.removeItem("currentUser")
      localStorage.removeItem("currentWorkspace")
      localStorage.removeItem("currentWorkspaceId")
      sessionStorage.removeItem("currentUser")
    }
  }, [])

  const switchWorkspace = (workspaceId: number) => {
    const workspace = getWorkspaceById(workspaceId)
    if (workspace) {
      localStorage.setItem("currentWorkspaceId", workspaceId.toString())
      localStorage.setItem("currentWorkspace", JSON.stringify(workspace))
      window.location.reload()
    }
  }

  return (
    <aside className="fixed left-0 top-[38px] w-[38px] h-[calc(100vh-38px)] flex flex-col justify-between items-center overflow-hidden text-white">
      {/* TOP PART */}
      <div className="flex flex-col items-center">
        {/* Workspace Avatar with Dropdown */}
        <div className="relative">
          <DropdownMenu>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="w-full h-auto cursor-pointer">
                      <AvatarFallback
                        style={{ 
                          backgroundColor: currentWorkspace ? `${currentWorkspace.color}20` : undefined,
                          color: currentWorkspace ? currentWorkspace.color : undefined
                        }}
                      >
                        {currentWorkspace ? currentWorkspace.name.charAt(0) : "C"}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p className="font-medium">{currentWorkspace?.name || "No workspace"}</p>
                  <p className="text-xs text-muted-foreground">Click to switch workspace</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <DropdownMenuContent align="start" className="w-auto h-auto bg-white" side="right">
              <DropdownMenuLabel>My Workspaces</DropdownMenuLabel>
              {availableWorkspaces.map((workspace) => {
                const owner = mockUsers.find(u => u.id === workspace.ownerId)
                const isCurrent = workspace.id === currentWorkspace?.id
                
                return (
                  <DropdownMenuItem
                    key={workspace.id}
                    onClick={() => switchWorkspace(workspace.id)}
                    className={`flex items-center justify-between ${isCurrent ? "bg-accent" : ""}`}
                  >
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold text-white"
                        style={{ backgroundColor: workspace.color }}
                      >
                        {workspace.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{workspace.name}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {owner?.name}
                        </div>
                      </div>
                    </div>
                    {isCurrent && (
                      <ChevronDown className="h-3 w-3 text-primary ml-2" />
                    )}
                  </DropdownMenuItem>
                )
              })}
              
              {availableWorkspaces.length === 0 && (
                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                  No workspaces available
                </div>
              )}
              
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => {
                console.log("Create new workspace")
              }}>
                <PlusIcon className="mr-2 h-4 w-4" />
                Create New Workspace
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Current workspace indicator dot */}
          {currentWorkspace && (
            <div 
              className="absolute top-1/5 -left-6 w-4 h-4 rounded-full border"
              style={{ backgroundColor: currentWorkspace.color }}
            />
          )}
        </div>

        {/* Add Member */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost" className="h-6 w-6">
                <Plus/>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Add team member</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Separator className="w-8 my-2" />

        {/* Team Member Avatars */}
        {workspaceMembers.slice(0, 3).map((member) => (
          <TooltipProvider key={member.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar className="h-8 w-8 cursor-pointer mb-1">
                  <AvatarFallback className="text-xs">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{member.name}</p>
                <p className="text-xs text-muted-foreground">{member.role}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}

        {workspaceMembers.length > 3 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs cursor-pointer mb-1">
                  +{workspaceMembers.length - 3}
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className="font-medium">More team members</p>
                {workspaceMembers.slice(3).map(member => (
                  <p key={member.id} className="text-sm">{member.name}</p>
                ))}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        <Separator className="w-8 my-2" />

        {/* New Folder */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost" className="h-6 w-6">
                <PlusIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Create new folder</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Separator className="w-8 my-2" />

        {/* New File */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost" className="h-6 w-6">
                <PlusIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Upload new file</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* BOTTOM BUTTON GROUP */}
      <div className="flex flex-col p-4 space-y-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost" className="h-8 w-8">
                <Settings2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Workspace settings</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost" className="h-8 w-8">
                <Bug className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Report bug</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost" className="h-8 w-8">
                <HelpCircle className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Help & Support</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </aside>
  )
}