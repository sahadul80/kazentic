// components/navigation-provider.tsx
"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'

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

type NavigationContextType = {
  activeMainItem: NavItem | null;
  activeSubItem: SubItem | null;
  setActiveMainItem: (item: NavItem | null) => void;
  setActiveSubItem: (item: SubItem | null) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [activeMainItem, setActiveMainItem] = useState<NavItem | null>(null)
  const [activeSubItem, setActiveSubItem] = useState<SubItem | null>(null)

  return (
    <NavigationContext.Provider 
      value={{ 
        activeMainItem, 
        activeSubItem, 
        setActiveMainItem, 
        setActiveSubItem 
      }}
    >
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  return context
}