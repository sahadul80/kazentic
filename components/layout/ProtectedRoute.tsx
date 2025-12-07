// components/layout/ProtectedRoute.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser")
      const storedWorkspace = localStorage.getItem("currentWorkspace")
      
      if (!storedUser) {
        router.push("/login")
        return
      }
      
      if (!storedWorkspace) {
        setIsAuthenticated(true)
        setIsLoading(false)
        return
      }
      
      setIsAuthenticated(true)
      setIsLoading(false)
    }
    
    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen min-w-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center">{children}</div>
  );
}