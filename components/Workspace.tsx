// components/auth/WorkspaceSelection.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldTitle,
} from "@/components/ui/field"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LogOut } from "lucide-react"
import { mockUsers, mockWorkspaces } from "@/data/mockStorageData"

interface WorkspaceSelectionProps {
  user: typeof mockUsers[0]
  onSelectWorkspace: (workspaceId: number) => void
}

export function WorkspaceSelection({ user, onSelectWorkspace }: WorkspaceSelectionProps) {
  const [selectedWorkspace, setSelectedWorkspace] = useState<number | null>(null)

  const userWorkspaces = mockWorkspaces.filter(
    workspace => workspace.ownerId === user.id || workspace.memberIds.includes(user.id)
  )

  const handleSignOut = () => {
    localStorage.removeItem("currentUser")
    localStorage.removeItem("currentWorkspace")
    sessionStorage.removeItem("currentUser")
    window.location.href = "/login"
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-background to-secondary/20">
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback>
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {user.name}!</h1>
              <p className="text-muted-foreground">Select a workspace to continue</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            onClick={handleSignOut}
            className="text-muted-foreground"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </Button>
        </div>

        <FieldGroup className="gap-8">
          <Field className="text-center">
            <FieldTitle className="font-bold text-2xl">Your Workspaces</FieldTitle>
            <FieldDescription>
              Choose a workspace to access your files and collaborate with your team
            </FieldDescription>
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userWorkspaces.map((workspace) => {
              const owner = mockUsers.find(u => u.id === workspace.ownerId)
              const memberCount = workspace.memberIds.length
              const isOwner = workspace.ownerId === user.id
              
              return (
                <div
                  key={workspace.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-lg ${
                    selectedWorkspace === workspace.id 
                      ? 'border-primary ring-2 ring-primary/20 bg-primary/5' 
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedWorkspace(workspace.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                      style={{ backgroundColor: workspace.color }}
                    >
                      {workspace.name.charAt(0)}
                    </div>
                    {isOwner && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        Owner
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{workspace.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {workspace.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>👥 {memberCount} member{memberCount !== 1 ? 's' : ''}</span>
                    <span>Created {workspace.createdAt}</span>
                  </div>
                </div>
              )
            })}
            
            {userWorkspaces.length === 0 && (
              <div className="col-span-full text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">No workspaces yet</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't been added to any workspaces. Contact an administrator to get access.
                </p>
                <Button 
                  variant="outline"
                  onClick={handleSignOut}
                >
                  Sign out
                </Button>
              </div>
            )}
          </div>

          {userWorkspaces.length > 0 && (
            <div className="flex justify-center gap-4 pt-6">
              <Button 
                variant="outline"
                onClick={handleSignOut}
              >
                Sign out
              </Button>
              <Button 
                disabled={!selectedWorkspace}
                onClick={() => selectedWorkspace && onSelectWorkspace(selectedWorkspace)}
                className="min-w-[120px]"
              >
                Continue
              </Button>
            </div>
          )}

          {userWorkspaces.length > 0 && (
            <Field className="text-center pt-8 border-t">
              <FieldDescription className="text-sm">
                Don't see the workspace you're looking for?{" "}
                <button 
                  onClick={() => {
                    // This would open a workspace creation or join dialog
                    console.log('Request to join workspace')
                  }}
                  className="text-primary hover:underline"
                >
                  Request to join
                </button>
              </FieldDescription>
            </Field>
          )}
        </FieldGroup>
      </div>
    </div>
  )
}