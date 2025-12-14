"use client"

import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

import { TooltipProvider } from "@/components/ui/tooltip"

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
import { Button } from "@/components/ui/button"

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
  const [openItems, setOpenItems] = useState<string[]>([])

  useEffect(() => {
    const initialOpenItems: string[] = []
    
    items.forEach((item) => {
      const isItemActive = item.url && pathname.startsWith(item.url)
      const hasActiveChild = item.items?.some((subItem) => 
        subItem.url && pathname.startsWith(subItem.url)
      )
      
      if (isItemActive || hasActiveChild) {
        initialOpenItems.push(item.title)

        if (onNavigationChange) {
          if (hasActiveChild) {
            const activeSubItem = item.items?.find(sub => 
              sub.url && pathname.startsWith(sub.url)
            )
            onNavigationChange(item, activeSubItem)
          } else {
            onNavigationChange(item)
          }
        }
      }
    })
    
    setOpenItems(initialOpenItems)
  }, [pathname, items, onNavigationChange])

  const isMainItemActive = (item: NavItem): boolean => {
    if (pathname.startsWith(item.url)) return true
    return item.items?.some(sub => 
      sub.url && pathname.startsWith(sub.url)
    ) || false
  }

  const isSubItemActive = (subItem: SubItem): boolean => {
    return pathname.startsWith(subItem.url)
  }

  const toggleCollapsible = (itemTitle: string) => {
    setOpenItems(prev =>
      prev.includes(itemTitle)
        ? prev.filter(t => t !== itemTitle)
        : [...prev, itemTitle]
    )
  }

  const isCollapsibleOpen = (itemTitle: string) => {
    return openItems.includes(itemTitle)
  }

  const handleMainItemClick = (item: NavItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()

    const hasChildren = item.items && item.items.length > 0
    
    if (!hasChildren && item.url) {
      router.push(item.url)
      onNavigationChange?.(item)
    } else if (hasChildren && item.items?.[0]?.url) {
      router.push(item.items[0].url)
      onNavigationChange?.(item, item.items[0])
    }
  }

  const handleSubItemClick = (mainItem: NavItem, subItem: SubItem) => {
    if (subItem.url) {
      router.push(subItem.url)
      onNavigationChange?.(mainItem, subItem)
    }
  }

  return (
    <TooltipProvider delayDuration={0}>
      <SidebarGroup 
        className={cn(
          "transition-all duration-200 border-none",
          state === "collapsed" && "opacity-100 p-0"
        )}
      >
        <SidebarMenu>
          {items.map((item) => {
            const hasChildren = item.items && item.items.length > 0
            const isActive = isMainItemActive(item)
            const isOpen = isCollapsibleOpen(item.title)
            if (state === "collapsed") {
              return (
                <div key={item.title} className="relative">
                  <div className="flex flex-col items-center">

                    {/* MAIN ICON + CHEVRON */}
                    <div className="flex flex-row items-center justify-between w-full">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "rounded-md flex items-center",
                          isActive && "bg-[#F2F9FE]"
                        )}
                        onClick={() => {
                          if (!hasChildren) handleMainItemClick(item)
                          toggleCollapsible(item.title)
                        }}
                      >
                        {item.icon && (
                          <item.icon active={isActive} />
                        )}
                      </Button>

                      {hasChildren && (
                        <ChevronDown
                          size="16px"
                          className={cn(
                            "transition-transform duration-200 bg-white flex-shrink-0",
                            isOpen && "rotate-180"
                          )}
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleCollapsible(item.title)
                          }}
                        />
                      )}
                    </div>

                    {/* SUB ICON STACK (aligned with chevron) */}
                    {hasChildren && isOpen && (
                      <div className="flex flex-col items-end">
                        {item.items?.map((sub) => {
                          const subIsActive = isSubItemActive(sub)
                          return (
                            <Button
                              key={sub.title}
                              variant="ghost"
                              size="icon"
                              className={cn(
                                "rounded-md flex items-center justify-center",
                                subIsActive && "bg-[#F2F9FE]"
                              )}
                              onClick={() => handleSubItemClick(item, sub)}
                            >
                              {sub.Icon && (
                                <sub.Icon active={subIsActive}/>
                              )}
                            </Button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )
            }
            return (
              <Collapsible
                key={item.title}
                asChild
                open={isOpen}
                onOpenChange={() => toggleCollapsible(item.title)
                }
              >
                <SidebarMenuItem>
                  {/* MAIN BUTTON */}
                  <div className="flex items-center">
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className="group/main-button"
                    >
                      <div
                        className="flex items-center cursor-pointer select-none hover:bg-[#F5F6F7] group-hover/main-button:bg-[#F5F6F7]"
                        onClick={() => handleMainItemClick(item)}
                      >
                        {item.icon && (
                          <item.icon active={isActive} size="18px" />
                        )}
                        <span className="flex-1 text-left">{item.title}</span>
                      </div>
                    </SidebarMenuButton>

                    {/* EXPANDED CHEVRON */}
                    {hasChildren && (
                      <CollapsibleTrigger>
                          <ChevronDown
                            size="16px"
                            className={cn(
                              "transition-transform duration-200",
                              isOpen && "rotate-180"
                            )}
                          />
                      </CollapsibleTrigger>
                    )}
                  </div>

                  {/* SUB ITEMS */}
                  {hasChildren && (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((sub) => {
                          const subIsActive = isSubItemActive(sub)
                          return (
                            <SidebarMenuSubItem key={sub.title}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={subIsActive}
                                className="border-none"
                                onClick={() => handleSubItemClick(item, sub)}
                              >
                                <Link 
                                  href={sub.url || "#"} 
                                  className="flex hover:bg-[#F5F6F7] group-hover/sub-button:bg-[#F5F6F7]" 
                                >
                                  {sub.Icon && (
                                    <sub.Icon active={subIsActive} size="16px" />
                                  )}
                                  <span>{sub.title}</span>
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
    </TooltipProvider>
  )
}