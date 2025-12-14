"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Settings, LogOut, ChevronDownIcon, Circle } from "lucide-react"
import { User } from "@/types/storage"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { useState, useEffect } from "react"

interface UserDropdownProps {
  user: User[]
  trigger: User
  onProfileSettings?: () => void
  onSignOut?: () => void
  onUserChange?: (user: User) => void
}

export function UserDropdown({ 
  user, 
  trigger, 
  onProfileSettings, 
  onSignOut,
  onUserChange 
}: UserDropdownProps) {
  const [selectedUserId, setSelectedUserId] = useState<number>(() => {
    // Initialize from localStorage or trigger
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('selectedUserId')
      return stored ? parseInt(stored) : trigger?.id
    }
    return trigger?.id
  })
  
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  // Sync selected user with localStorage and trigger
  useEffect(() => {
    if (selectedUserId && typeof window !== 'undefined') {
      localStorage.setItem('selectedUserId', selectedUserId.toString())
    }
  }, [selectedUserId])

  // Get current user for display
  const currentUser = user.find(u => u.id === selectedUserId) || trigger

  // Handle user selection
  const handleUserSelect = (userId: number) => {
    setSelectedUserId(userId)
    const selectedUser = user.find(u => u.id === userId)
    if (selectedUser && onUserChange) {
      onUserChange(selectedUser)
    }
    setIsOpen(false)
  }

  // Handle navigation with dissolve animation
  const handleNavigation = (path: string) => {
    // Create dissolve animation effect
    const button = document.activeElement as HTMLElement
    if (button) {
      button.style.opacity = "0"
      button.style.transition = "opacity 300ms ease-out"
      
      setTimeout(() => {
        // Reset opacity
        button.style.opacity = "1"
        button.style.transition = ""
        // Navigate after animation
        router.push(path)
      }, 300)
    } else {
      // Fallback if no active element
      router.push(path)
    }
  }

  // Handle profile settings click
  const handleProfileSettings = () => {
    if (onProfileSettings) {
      onProfileSettings()
    } else {
      handleNavigation("/users/profile/settings")
    }
  }

  // Handle logout click
  const handleLogout = () => {
    if (onSignOut) {
      onSignOut()
    } else {
      handleNavigation("/login")
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <div className="h-[34px] w-auto flex items-center p-[5px] gap-[7px]">
          <Avatar className="h-[24px] w-[24px] border-fs">
            <AvatarFallback className="text-xs">
              {currentUser.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="relative flex flex-col items-start justify-start">
            <span className="text-sm font-bold">{currentUser.name}</span>
            <span className="text-xs text-white/70">{currentUser.email}</span>
          </div>
          <ChevronDownIcon className="h-[16px] w-[16px] text-white/70"/>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        style={{
          width: '343px',
          height: 'auto',
          borderRadius: '8px',
          borderWidth: '1px',
          display: 'flex',
          flexDirection: 'column' as const,
          justifyContent: 'space-between',
          transform: 'rotate(0deg)',
          opacity: 1,
          padding: '8px',
          background: '#FFFFFF',
          border: '1px solid var(--Stroke, #EBEBEB)',
          boxShadow: '0px 24px 64px 0px #0000000D',
        }}
        align="end"
        sideOffset={8}
      >
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Scrollable user list */}
          <div 
            style={{ 
              flex: 1,
              overflowY: 'auto',
              marginBottom: '8px',
              maxHeight: '152px'
            }}
          >
            <DropdownMenuRadioGroup
              value={selectedUserId?.toString()}
              onValueChange={(value) => handleUserSelect(parseInt(value))}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {user.map((u) => (
                  <DropdownMenuRadioItem 
                    key={u.id} 
                    value={u.id.toString()} 
                    style={{
                      width: '327px',
                      height: '76px',
                      borderRadius: '4px',
                      transform: 'rotate(0deg)',
                      opacity: 1,
                      padding: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: selectedUserId === u.id ? '#F2F9FE' : 'transparent',
                    }}
                    className="hover:bg-[#F2F9FE]"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '209px', height: '48px' }}>
                      <Avatar style={{ height: '48px', width: '48px' }}>
                        <AvatarFallback className="text-xs">
                          {u.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '14px', fontWeight: 500 }}>{u.name}</span>
                        <span style={{ fontSize: '12px', color: '#666' }}>{u.email}</span>
                      </div>
                    </div>
                  </DropdownMenuRadioItem>
                ))}
              </div>
            </DropdownMenuRadioGroup>
          </div>
          
          {/* Fixed bottom buttons */}
          <div 
            style={{ 
              flexShrink: 0,
              borderTop: '1px solid #EBEBEB',
              paddingTop: '8px',
              marginTop: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}
          >
            <Button
              onClick={handleProfileSettings}
              style={{
                width: '100%',
                height: '40px',
                justifyContent: 'flex-start',
                paddingLeft: '12px',
                paddingRight: '12px',
                animationTimingFunction: 'ease-out',
                animationDuration: '300ms',
              }}
              variant="ghost"
              className="hover:bg-gray-50"
            >
              <Settings style={{ height: '16px', width: '16px', marginRight: '8px' }} />
              <span>Profile Settings</span>
            </Button>
            
            <Button
              onClick={handleLogout}
              style={{
                width: '100%',
                height: '40px',
                justifyContent: 'flex-start',
                paddingLeft: '12px',
                paddingRight: '12px',
                animationTimingFunction: 'ease-out',
                animationDuration: '300ms',
                color: '#dc2626',
              }}
              variant="ghost"
              className="hover:text-red-700 hover:bg-red-50"
            >
              <LogOut style={{ height: '16px', width: '16px', marginRight: '8px' }} />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}