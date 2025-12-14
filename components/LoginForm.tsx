"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Checkbox } from "./ui/checkbox"
import { Label } from "./ui/label"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { mockUsers, mockWorkspaces } from "@/data/mockStorageData"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [currentUser, setCurrentUser] = useState<typeof mockUsers[0] | null>(null)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser")
    const storedWorkspace = localStorage.getItem("currentWorkspace")
    
    if (storedUser && storedWorkspace) {
      // User already logged in and has selected a workspace
      router.push("/dashboard")
    } else if (storedUser) {
      // User logged in but hasn't selected workspace
      try {
        const user = JSON.parse(storedUser)
        setCurrentUser(user)
      } catch (e) {
        console.error("Error parsing stored user:", e)
        // Clear corrupted data
        localStorage.removeItem("currentUser")
        sessionStorage.removeItem("currentUser")
      }
    }
  }, [router])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Demo authentication - in real app, this would be an API call
    const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase())
    
    if (!user) {
      setError("User not found")
      return
    }

    // Demo password check (in real app, this would be hashed)
    if (password.length < 3) {
      setError("Invalid password")
      return
    }

    // Find workspaces where user is owner (preferred) or member
    const userWorkspaces = mockWorkspaces.filter(workspace => 
      workspace.ownerId === user.id || workspace.memberIds?.includes(user.id)
    )
    
    // Sort workspaces: owned workspaces first
    userWorkspaces.sort((a, b) => {
      if (a.ownerId === user.id && b.ownerId !== user.id) return -1
      if (a.ownerId !== user.id && b.ownerId === user.id) return 1
      return 0
    })
    
    const workspace = userWorkspaces[0]

    if (!workspace) {
      setError("No workspace found for this user")
      return
    }

    // Create user data object with workspace information
    const userData = {
      ...user,
      workspaceIds: userWorkspaces.map(w => w.id) // Add workspace IDs to user data
    }

    // Store user in state
    setCurrentUser(userData)

    // Store user data based on rememberMe setting
    if (rememberMe) {
      localStorage.setItem("currentUser", JSON.stringify(userData))
    } else {
      sessionStorage.setItem("currentUser", JSON.stringify(userData))
    }
    
    // Store workspace data
    localStorage.setItem("currentWorkspaceId", workspace.id.toString())
    localStorage.setItem("currentWorkspace", JSON.stringify(workspace))
    
    // Also store userData in localStorage for backward compatibility
    localStorage.setItem("currentUser", JSON.stringify(userData))
    
    // Store workspaces in localStorage for use in other components
    localStorage.setItem("workspaces", JSON.stringify(userWorkspaces))
    
    // Redirect to dashboard
    router.push("/dashboard")
  }

  return (
    <div className={cn("min-h-screen flex flex-col", className)} {...props}>
      <form 
        onSubmit={handleLogin}
        className="w-full h-full flex items-start justify-between"
      >
        <FieldGroup className="flex flex-col gap-[72px]">
          <Field>
            <FieldTitle className="font-bold text-2xl">Sign in to Your Workspace</FieldTitle>
            <FieldDescription className="text-muted-foreground text-sm text-balance">
              Login with your existing accounts
            </FieldDescription>
          </Field>
          
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm rounded">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-[16px]">
            <Field>
              <FieldLabel htmlFor="email">
                <span className="text-red-600 text-md">*</span>Email
              </FieldLabel>
              <Input 
                id="email" 
                type="email" 
                placeholder="pat@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Field>
            
            <Field className="relative">          
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"}
                  placeholder="password does not matter in demo"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </Field>
            
            <div className="relative">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="terms">Remember me</Label>
              </div>
            </div>
            
            <Field>
              <Button type="submit" className="btn-primary w-full">Sign in</Button>
            </Field>
            
            <Field>
              <div className="flex items-start">
                <FieldDescription className="text-center">
                  Don&apos;t have an account?{" "}
                  <Link href="/" className="underline underline-offset-4">
                    Sign up
                  </Link>
                </FieldDescription>
                <a
                  href="#"
                  className="ml-auto text-sm underline-offset-4 hover:underline"
                >
                  Forgot password?
                </a>
              </div>
            </Field>
          </div>
        </FieldGroup>
      </form>
    </div>
  )
}