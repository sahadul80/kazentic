// components/sidebar-context.tsx
"use client"

import * as React from "react"

type NavItem = {
  title: string;
  url: string;
}

type SidebarContextType = {
  activeMainItem: NavItem | null;
  activeSubItem: NavItem | null;
  setActiveMainItem: (item: NavItem) => void;
  setActiveSubItem: (item: NavItem | null) => void;
}

const SidebarContext = React.createContext<SidebarContextType | undefined>(undefined)

export function useSidebarContext() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebarContext must be used within SidebarContextProvider")
  }
  return context
}

export function SidebarContextProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const [activeMainItem, setActiveMainItem] = React.useState<NavItem | null>(null)
  const [activeSubItem, setActiveSubItem] = React.useState<NavItem | null>(null)

  return (
    <SidebarContext.Provider value={{
      activeMainItem,
      activeSubItem,
      setActiveMainItem,
      setActiveSubItem
    }}>
      {children}
    </SidebarContext.Provider>
  )
}