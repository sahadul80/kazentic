// components/dashboard/nav-main.tsx
"use client"

import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect } from "react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

import { useSidebar } from "@/components/ui/sidebar"
import { NavItem, SubItem } from "@/components/dashboard/navigation-provider"

interface NavMainProps {
  items: NavItem[];
  onNavigationChange?: (mainItem: NavItem, subItem?: SubItem) => void;
}

export function NavMain({
  items,
  onNavigationChange,
}: NavMainProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { state } = useSidebar()

  // Update context on initial load and when pathname changes
  useEffect(() => {
    const findActiveItems = () => {
      for (const item of items) {
        if (pathname.startsWith(item.url)) {
          const activeSubItem = item.items?.find(subItem => pathname === subItem.url)
          if (onNavigationChange) {
            onNavigationChange(item, activeSubItem)
          }
          break
        }
      }
    }
    
    findActiveItems()
  }, [pathname, items, onNavigationChange])

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const hasChildren = item.items && item.items.length > 0
          const parentActive = item.url && pathname.startsWith(item.url)
          const childActive =
            item.items?.some((s) => s.url && pathname === s.url) ?? false
          const isActive = parentActive || childActive
          const firstSub = item.items?.[0]

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                {/* MAIN BUTTON */}
                <SidebarMenuButton
                  asChild
                  data-active={isActive ? "true" : undefined}
                  className={cn(
                    "relative group/sidebar-btn",
                    isActive && "bg-accent text-accent-foreground"
                  )}
                >
                  <div
                    className="flex items-center w-full cursor-pointer select-none"
                    onClick={() => {
                      if (hasChildren && firstSub?.url) {
                        // Navigate to first subitem
                        router.push(firstSub.url)
                        if (onNavigationChange) {
                          onNavigationChange(item, firstSub)
                        }
                      } else if (item.url) {
                        router.push(item.url)
                        if (onNavigationChange) {
                          onNavigationChange(item)
                        }
                      }
                    }}
                  >
                    {item.icon && (
                      <item.icon
                        active={isActive}
                        size="18"
                      />
                    )}

                    <span className={cn(
                      "transition-all duration-200",
                      state === "expanded" ? "opacity-100 w-auto ml-2" : "opacity-0 w-0"
                    )}>
                      {item.title}
                    </span>

                    {/* CHEVRON */}
                    {hasChildren && (
                      <CollapsibleTrigger
                        onClick={(e) => {
                          e.stopPropagation()
                          // If sidebar is collapsed and has first subitem, navigate there
                          if (state === "collapsed" && firstSub?.url) {
                            router.push(firstSub.url)
                            if (onNavigationChange) {
                              onNavigationChange(item, firstSub)
                            }
                          }
                        }}
                        className={cn(
                          "ml-auto flex items-center justify-center px-1 hover:bg-muted rounded-md",
                          state === "collapsed" ? "opacity-100" : "opacity-100"
                        )}
                      >
                        <ChevronDown
                          size={16}
                          className={cn(
                            "transition-transform duration-200",
                            "group-data-[state=open]/collapsible:rotate-180"
                          )}
                        />
                      </CollapsibleTrigger>
                    )}
                  </div>
                </SidebarMenuButton>

                {/* SUB ITEMS */}
                {hasChildren && state === "expanded" && (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((sub) => {
                        const subIsActive = pathname === sub.url

                        return (
                          <SidebarMenuSubItem key={sub.title}>
                            <SidebarMenuSubButton
                              asChild
                              data-active={subIsActive ? "true" : undefined}
                              className={cn(
                                "cursor-pointer",
                                subIsActive &&
                                  "text-primary font-medium bg-muted"
                              )}
                              onClick={() => {
                                if (onNavigationChange) {
                                  onNavigationChange(item, sub)
                                }
                              }}
                            >
                              <Link href={sub.url || "#"} className="flex items-center">
                                {sub.Icon && (
                                  <sub.Icon
                                    active={subIsActive}
                                    size="18"
                                  />
                                )}
                                <span className="ml-2">{sub.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )}
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}