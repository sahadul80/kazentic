// components/app-breadcrumb.tsx
"use client"

import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { mockFolders } from "@/data/mockStorageData"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import React from "react"

export function AppBreadcrumb() {
  const pathname = usePathname()
  const router = useRouter()
  const [breadcrumbItems, setBreadcrumbItems] = useState<Array<{
    id: number
    name: string
    href: string
    isCurrent: boolean
  }>>([])

  useEffect(() => {
    const buildBreadcrumbItems = () => {
      const items = []
      
      // Always start with Menu
      items.push({
        id: 0,
        name: "Menu",
        href: "/",
        isCurrent: pathname === "/"
      })

      // Check if we're in storage/my section
      if (pathname.startsWith('/storage/my')) {
        // Add "My Storage" as parent
        items.push({
          id: 1000,
          name: "My Storage",
          href: "/storage/my",
          isCurrent: pathname === '/storage/my'
        })

        // Check if we're in a folder under storage/my/folder/
        if (pathname.includes('/folder/')) {
          try {
            // Extract folder ID from path like /storage/my/folder/1
            const segments = pathname.split('/')
            // Find the index of 'folder' and get the next segment
            const folderIndex = segments.indexOf('folder')
            if (folderIndex !== -1 && segments[folderIndex + 1]) {
              const folderId = parseInt(segments[folderIndex + 1])
              
              if (!isNaN(folderId)) {
                // Find the current folder
                const currentFolder = mockFolders.find(f => f.id === folderId)
                
                if (currentFolder) {
                  // Build the folder hierarchy from root to current
                  const hierarchy = getFolderHierarchy(currentFolder.id)
                  
                  // Add each folder in hierarchy
                  hierarchy.forEach(folder => {
                    items.push({
                      id: folder.id,
                      name: folder.name,
                      href: `/storage/my/folder/${folder.id}`,
                      isCurrent: folder.id === currentFolder.id
                    })
                  })
                } else {
                  // Folder not found, just show the ID
                  items.push({
                    id: folderId,
                    name: `Folder ${folderId}`,
                    href: `/storage/my/folder/${folderId}`,
                    isCurrent: true
                  })
                }
              }
            }
          } catch (error) {
            console.error("Error parsing folder ID:", error)
          }
        }
        
        // Check for other sub-routes under /storage/my/
        else if (pathname !== '/storage/my') {
          const routePart = pathname.replace('/storage/my/', '')
          if (routePart) {
            // Handle other routes like /storage/my/shared, /storage/my/trash, etc.
            const routeName = routePart
              .split('-')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')
            
            items.push({
              id: 2000,
              name: routeName,
              href: `/storage/my/${routePart}`,
              isCurrent: true
            })
          }
        }
      } 
      // Handle other routes (not under /storage/my/)
      else if (pathname !== '/') {
        const segments = pathname.split('/').filter(Boolean)
        let currentPath = ''
        
        segments.forEach((segment, index) => {
          currentPath += `/${segment}`
          const isLast = index === segments.length - 1
          
          // Format the segment for display
          let displayName = segment
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
          
          // Special case: convert "my" to "My Storage" for consistency
          if (segment === 'my' && pathname.startsWith('/storage/my')) {
            displayName = 'My Storage'
          }
          
          items.push({
            id: 10000 + index,
            name: displayName,
            href: currentPath,
            isCurrent: isLast
          })
        })
      }

      return items
    }

    setBreadcrumbItems(buildBreadcrumbItems())
  }, [pathname])

  // Helper function to get folder hierarchy from root to current folder
  const getFolderHierarchy = (folderId: number): Array<{id: number, name: string}> => {
    const hierarchy: Array<{id: number, name: string}> = []
    let currentId = folderId
    
    while (currentId) {
      const folder = mockFolders.find(f => f.id === currentId)
      if (!folder) break
      
      hierarchy.unshift({ id: folder.id, name: folder.name })
      
      if (folder.parentFolderId) {
        currentId = folder.parentFolderId
      } else {
        break
      }
    }
    
    return hierarchy
  }

  // If we only have Menu, show it as current page
  if (breadcrumbItems.length === 1) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Menu</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
  }

  return (
    <Breadcrumb separator="•">
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={`${item.id}-${index}`}>
            {index > 0 && <BreadcrumbSeparator>•</BreadcrumbSeparator>}
            
            <BreadcrumbItem>
              {item.isCurrent ? (
                <BreadcrumbPage>{item.name}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink
                  onClick={(e) => {
                    e.preventDefault()
                    router.push(item.href)
                  }}
                  className="cursor-pointer hover:underline"
                >
                  {item.name}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}