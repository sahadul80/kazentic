// app/dashboard/layout.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { NavigationProvider } from "@/components/dashboard/navigation-provider"
import { Header } from "@/components/layout/Header"
import { ProtectedRoute } from "@/components/layout/ProtectedRoute"
import { SideMenu } from "@/components/layout/SideMenu"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { WorkspaceSelection } from "@/components/Workspace"
import { Loader2 } from "lucide-react"
import { mockUsers } from "@/data/mockStorageData"
import { AppBreadcrumb } from "@/components/dashboard/app-breadcrumb"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function StoorageLayout({ children }: DashboardLayoutProps) {
  const [authState, setAuthState] = useState<'loading' | 'authenticated' | 'needsWorkspace'>('loading')
  const [currentUser, setCurrentUser] = useState<typeof mockUsers[0] | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      // Check for user in localStorage first, then sessionStorage
      const storedUser = localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser")
      const storedWorkspaceId = localStorage.getItem("currentWorkspace")
      
      if (!storedUser) {
        router.push("/login")
        return
      }

      const user = JSON.parse(storedUser)
      setCurrentUser(user)

      if (!storedWorkspaceId) {
        setAuthState('needsWorkspace')
      } else {
        setAuthState('authenticated')
      }
    }

    checkAuth()
  }, [router])

  const handleWorkspaceSelect = (workspaceId: number) => {
    if (!currentUser) return

    // Store workspace selection
    localStorage.setItem("currentWorkspace", workspaceId.toString())
    
    // Refresh to update the entire layout with workspace context
    window.location.reload()
  }

  if (authState === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (authState === 'needsWorkspace' && currentUser) {
    return <WorkspaceSelection user={currentUser} onSelectWorkspace={handleWorkspaceSelect} />
  }

  return (
    <ProtectedRoute>
      <Header />
      <SideMenu />
        <ResizablePanelGroup direction="horizontal">

      <NavigationProvider>
          <SidebarProvider>
  <ResizablePanel className="flex rounded-lg mt-[38px] ml-[38px] w-full bg-white">
      <AppSidebar />
            <div className="bg-white">
                {children}
            </div>
  </ResizablePanel>
  </SidebarProvider>

      </NavigationProvider>
</ResizablePanelGroup>
    </ProtectedRoute>
  )
}