// components/app-breadcrumb.tsx
"use client"

import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState, useMemo } from "react"
import { mockFolders, sharedFolders } from "@/data/mockStorageData"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import React from "react"
import { 
  AccessControlIcon, 
  ActivityLogsIcon, 
  CalendarIcon, 
  ChatIcon, 
  ConfugurationIcon, 
  CRMIcon, 
  DashboardIcon, 
  DealsCRMIcon, 
  EmailIcon, 
  EmployeesIcon, 
  FindJobsHRMIcon, 
  FolderIcon, 
  FormsIcon, 
  GeneralReportsIcon, 
  GuestsIcon, 
  HiringHRMIcon, 
  HRMIcon, 
  LeadsCRMIcon, 
  LeavesHRMIcon, 
  ManageIcon, 
  NotesIcon, 
  NoticesHRMIcon, 
  PayrollHRMIcon, 
  PerformanceHRMIcon, 
  ProjectReportsIcon, 
  ProjectsIcon, 
  ReportsIcon, 
  SettingsIcon, 
  SprintIcon, 
  StatisticsIcon, 
  StorageDriveIcon, 
  StorageIcon, 
  StorageSend2Icon, 
  StorageStatusIcon, 
  StorageTrashIcon, 
  TasksIcon, 
  TeamsIcon, 
  TimeTrackerIcon, 
  UserReportsIcon, 
  WeeklyReportsIcon 
} from "@/components/dashboard/SVGs"
import { NavigationData } from "@/data/navData"

export function AppBreadcrumb() {
  const pathname = usePathname()
  const router = useRouter()
  const [breadcrumbItems, setBreadcrumbItems] = useState<Array<{
    id: number
    name: string
    href: string
    isCurrent: boolean
    icon: React.ComponentType<{ active?: boolean; size?: string }> | null;
  }>>([])

  // Create a map of URLs to icons from NavigationData
  const urlToIconMap = useMemo(() => {
    const map = new Map<string, React.ComponentType<{ active?: boolean; size?: string }>>()
    
    NavigationData.navMain.forEach(item => {
      if (item.url) {
        map.set(item.url, item.icon)
      }
      
      // Add sub-items
      if (item.items) {
        item.items.forEach(subItem => {
          if (subItem.url && subItem.Icon) {
            map.set(subItem.url, subItem.Icon)
          }
        })
      }
    })
    
    return map
  }, [])

  // Helper function to find icon for a given path
  const findIconForPath = (path: string): React.ComponentType<{ active?: boolean; size?: string }> | null => {
    // Try exact match first
    if (urlToIconMap.has(path)) {
      return urlToIconMap.get(path)!
    }
    
    // Try to match by removing trailing slash
    const normalizedPath = path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path
    if (urlToIconMap.has(normalizedPath)) {
      return urlToIconMap.get(normalizedPath)!
    }
    
    // Check if it's a folder path
    if (path.includes('/folder/')) {
      return FolderIcon
    }
    
    // Try to match parent paths (for nested routes)
    const pathSegments = path.split('/').filter(Boolean)
    for (let i = pathSegments.length; i > 0; i--) {
      const parentPath = '/' + pathSegments.slice(0, i).join('/')
      if (urlToIconMap.has(parentPath)) {
        return urlToIconMap.get(parentPath)!
      }
    }
    
    return null
  }

  useEffect(() => {
    const buildBreadcrumbItems = () => {
      const items = []

      // Handle storage routes specially
      if (pathname.startsWith('/storage')) {
        // Always add "Storage" as the root for all storage routes
        items.push({
          id: 1,
          name: "Storage",
          href: "/storage",
          isCurrent: pathname === '/storage',
          icon: StorageIcon
        })

        // Check if we're in storage/my section
        if (pathname.startsWith('/storage/my')) {
          // Add "My Storage" as child
          items.push({
            id: 2,
            name: "My Storage",
            href: "/storage/my",
            isCurrent: pathname === '/storage/my',
            icon: StorageDriveIcon
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
                  // Find the current folder in mockFolders
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
                        isCurrent: folder.id === currentFolder.id,
                        icon: FolderIcon // Using FolderIcon for all folders
                      })
                    })
                  } else {
                    // Folder not found, just show the ID
                    items.push({
                      id: folderId,
                      name: `Folder ${folderId}`,
                      href: `/storage/my/folder/${folderId}`,
                      isCurrent: true,
                      icon: FolderIcon
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
                isCurrent: true,
                icon: findIconForPath(`/storage/${routePart}`) || StorageIcon
              })
            }
          }
        }
        // Check if we're in storage/shared section
        else if (pathname.startsWith('/storage/shared')) {
          // Add "Shared with me" as child
          items.push({
            id: 3,
            name: "Shared with me",
            href: "/storage/shared",
            isCurrent: pathname === '/storage/shared',
            icon: StorageSend2Icon
          })

          // Check if we're in a folder under storage/shared/folder/
          if (pathname.includes('/folder/')) {
            try {
              // Extract folder ID from path like /storage/shared/folder/1
              const segments = pathname.split('/')
              // Find the index of 'folder' and get the next segment
              const folderIndex = segments.indexOf('folder')
              if (folderIndex !== -1 && segments[folderIndex + 1]) {
                const folderId = parseInt(segments[folderIndex + 1])
                
                if (!isNaN(folderId)) {
                  // Find the current folder in sharedFolders first, then mockFolders
                  let currentFolder = sharedFolders.find(f => f.id === folderId)
                  
                  if (!currentFolder) {
                    // Check in mockFolders for shared folders
                    currentFolder = mockFolders.find(f => f.id === folderId && f.sharedWith > 0)
                  }
                  
                  if (currentFolder) {
                    // Build the shared folder hierarchy from root to current
                    const hierarchy = getSharedFolderHierarchy(currentFolder.id)
                    
                    // Add each folder in hierarchy
                    hierarchy.forEach(folder => {
                      items.push({
                        id: folder.id,
                        name: folder.name,
                        href: `/storage/shared/folder/${folder.id}`,
                        isCurrent: folder.id === currentFolder.id,
                        icon: FolderIcon // Using FolderIcon for all folders
                      })
                    })
                  } else {
                    // Folder not found, just show the ID
                    items.push({
                      id: folderId,
                      name: `Folder ${folderId}`,
                      href: `/storage/shared/folder/${folderId}`,
                      isCurrent: true,
                      icon: FolderIcon
                    })
                  }
                }
              }
            } catch (error) {
              console.error("Error parsing folder ID:", error)
            }
          }
          
          // Check for other sub-routes under /storage/shared/
          else if (pathname !== '/storage/shared') {
            const routePart = pathname.replace('/storage/shared/', '')
            if (routePart) {
              // Handle other routes like /storage/shared/trash, etc.
              const routeName = routePart
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')
              
              items.push({
                id: 3000,
                name: routeName,
                href: `/storage/shared/${routePart}`,
                isCurrent: true,
                icon: findIconForPath(`/storage/${routePart}`) || StorageSend2Icon
              })
            }
          }
        }
        // Check if we're in storage/trash section
        else if (pathname.startsWith('/storage/trash')) {
          // Add "Trash" as child
          items.push({
            id: 4,
            name: "Trash",
            href: "/storage/trash",
            isCurrent: pathname === '/storage/trash',
            icon: StorageTrashIcon
          })

          // Check if we're in a folder under storage/trash/folder/ (if you support nested trash)
          if (pathname.includes('/folder/')) {
            try {
              // Extract folder ID from path like /storage/trash/folder/1
              const segments = pathname.split('/')
              // Find the index of 'folder' and get the next segment
              const folderIndex = segments.indexOf('folder')
              if (folderIndex !== -1 && segments[folderIndex + 1]) {
                const folderId = parseInt(segments[folderIndex + 1])
                
                if (!isNaN(folderId)) {
                  // Find the current folder (check all folders, including deleted ones)
                  let currentFolder = mockFolders.find(f => f.id === folderId)
                  
                  // If not in mockFolders, check sharedFolders
                  if (!currentFolder) {
                    currentFolder = sharedFolders.find(f => f.id === folderId)
                  }
                  
                  if (currentFolder) {
                    // Build the folder hierarchy for trash
                    const hierarchy = getTrashFolderHierarchy(currentFolder.id)
                    
                    // Add each folder in hierarchy
                    hierarchy.forEach(folder => {
                      items.push({
                        id: folder.id,
                        name: folder.name,
                        href: `/storage/trash/folder/${folder.id}`,
                        isCurrent: folder.id === currentFolder.id,
                        icon: FolderIcon
                      })
                    })
                  } else {
                    // Folder not found, just show the ID
                    items.push({
                      id: folderId,
                      name: `Folder ${folderId}`,
                      href: `/storage/trash/folder/${folderId}`,
                      isCurrent: true,
                      icon: FolderIcon
                    })
                  }
                }
              }
            } catch (error) {
              console.error("Error parsing folder ID:", error)
            }
          }
        }
        // Handle other storage routes (not under /storage/my/, /storage/shared/, or /storage/trash/)
        else if (pathname !== '/storage') {
          const remainingPath = pathname.replace('/storage/', '')
          const segments = remainingPath.split('/').filter(Boolean)
          let currentPath = '/storage'
          
          segments.forEach((segment, index) => {
            currentPath += `/${segment}`
            const isLast = index === segments.length - 1
            
            // Format the segment for display
            const displayName = segment
              .split('-')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')
            
            items.push({
              id: 1000 + index,
              name: displayName,
              href: currentPath,
              isCurrent: isLast,
              icon: findIconForPath(currentPath) || StorageIcon
            })
          })
        }
      } 
      // Handle other routes (not under /storage/)
      else if (pathname !== '/') {
        const segments = pathname.split('/').filter(Boolean)
        let currentPath = ''
        
        segments.forEach((segment, index) => {
          currentPath += `/${segment}`
          const isLast = index === segments.length - 1
          
          // Format the segment for display
          const displayName = segment
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
          
          items.push({
            id: 10000 + index,
            name: displayName,
            href: currentPath,
            isCurrent: isLast,
            icon: findIconForPath(currentPath)
          })
        })
      }

      return items
    }

    setBreadcrumbItems(buildBreadcrumbItems())
  }, [pathname, urlToIconMap])

  // Helper function to get folder hierarchy from root to current folder (for my storage)
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

  // Helper function to get shared folder hierarchy (check both sharedFolders and mockFolders)
  const getSharedFolderHierarchy = (folderId: number): Array<{id: number, name: string}> => {
    const hierarchy: Array<{id: number, name: string}> = []
    let currentId = folderId
    
    while (currentId) {
      // Look for folder in sharedFolders first, then in mockFolders
      let folder = sharedFolders.find(f => f.id === currentId)
      if (!folder) {
        folder = mockFolders.find(f => f.id === currentId && f.sharedWith > 0)
      }
      
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

  // Helper function to get trash folder hierarchy
  const getTrashFolderHierarchy = (folderId: number): Array<{id: number, name: string}> => {
    const hierarchy: Array<{id: number, name: string}> = []
    let currentId = folderId
    
    while (currentId) {
      // Look for folder in all possible sources (including deleted items)
      let folder = mockFolders.find(f => f.id === currentId)
      
      if (!folder) {
        folder = sharedFolders.find(f => f.id === currentId)
      }
      
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

  // If no breadcrumb items (e.g., on homepage), return null
  if (breadcrumbItems.length === 0) {
    return null
  }

  // If we only have one item, show it as current page
  if (breadcrumbItems.length === 1) {
    const item = breadcrumbItems[0]
    const Icon = item.icon
    
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <div className="flex items-center gap-2">
              {Icon && <Icon active={item.isCurrent} size="16" />}
              <BreadcrumbPage>{item.name}</BreadcrumbPage>
            </div>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
  }

  return (
    <Breadcrumb separator="•" className="flex flex-row items-center justify-between">
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => {
          const Icon = item.icon
          
          return (
            <React.Fragment key={`${item.id}-${index}`}>
              {index > 0 && <BreadcrumbSeparator>•</BreadcrumbSeparator>}
              
              <BreadcrumbItem>
                {item.isCurrent ? (
                  <div className="flex items-center gap-2">
                    {Icon && <Icon active={item.isCurrent} size="16px" />}
                    <BreadcrumbPage>{item.name}</BreadcrumbPage>
                  </div>
                ) : (
                  <BreadcrumbLink
                    onClick={(e) => {
                      e.preventDefault()
                      router.push(item.href)
                    }}
                    className="cursor-pointer flex items-center gap-2"
                  >
                    {Icon && <Icon active={item.isCurrent} size="16" />}
                    {item.name}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}