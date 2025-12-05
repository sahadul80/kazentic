// components/app-breadcrumb.tsx
"use client"

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useNavigation } from "./navigation-provider"

export function AppBreadcrumb() {
  const { activeMainItem, activeSubItem } = useNavigation()

  // Format title to be human-readable
  const formatTitle = (title: string) => {
    if (!title) return ""
    return title
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  // Handle case when no navigation context is set yet
  if (!activeMainItem && !activeSubItem) {
    return (
      <Breadcrumb className="top-[38px]">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Menu</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
      <BreadcrumbItem>
        Menu
      </BreadcrumbItem>

        {activeMainItem && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {activeSubItem ? (
                <BreadcrumbLink href={activeMainItem.url}>
                  {formatTitle(activeMainItem.title)}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{formatTitle(activeMainItem.title)}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </>
        )}

        {activeSubItem && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{formatTitle(activeSubItem.title)}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  )
}