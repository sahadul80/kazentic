"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MoreHorizontal, Folder, File, ChevronRight } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { EnhancedFolderItem, EnhancedFileItem } from "@/types/storage"
import { mockFiles, mockFolders } from "@/data/mockStorageData"

// New Table Components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Pagination } from "./Pagination"

interface LocalStorageUserData {
  id: number;
  name: string;
  email: string;
  role: string;
  workspaceIds: number[];
  preferences?: any;
  token?: string;
  expiresAt?: string;
  lastLogin?: string;
}

export function FilesTable() {
  const router = useRouter()
  const [activeTab, setActiveTab] = React.useState("all")
  const [currentPage, setCurrentPage] = React.useState(1)
  
  // Get current user from localStorage
  const [currentUser, setCurrentUser] = React.useState<LocalStorageUserData | null>(null)
  
  // State for folders and files
  const [folders, setFolders] = React.useState<EnhancedFolderItem[]>(mockFolders)
  const [files, setFiles] = React.useState<EnhancedFileItem[]>(mockFiles)

  React.useEffect(() => {
    // Get current user from localStorage
    const userData = localStorage.getItem('currentUser')
    if (userData) {
      try {
        const user = JSON.parse(userData)
        setCurrentUser(user)
      } catch (error) {
        console.error('Error parsing user data:', error)
        router.push("/login")
      }
    } else {
      
    }
  }, [])

  // Filter folders owned by current user
  const userFolders = React.useMemo(() => {
    if (!currentUser) return []
    return folders.filter(folder => folder.ownerId === currentUser.id && !folder.isTrashed)
  }, [currentUser, folders])

  // Filter files owned by current user (for "All Folder" tab - all files from all folders)
  const allUserFiles = React.useMemo(() => {
    if (!currentUser) return []
    return files.filter(file => file.ownerId === currentUser.id && !file.isTrashed)
  }, [currentUser, files])

  // Get files for "Folder Name" tab (when a folder is selected)
  const [selectedFolderId, setSelectedFolderId] = React.useState<number | null>(null)
  
  const filesInSelectedFolder = React.useMemo(() => {
    if (!selectedFolderId) return []
    return allUserFiles.filter(file => file.folderId === selectedFolderId)
  }, [selectedFolderId, allUserFiles])

  // Get the selected folder
  const selectedFolder = React.useMemo(() => {
    if (!selectedFolderId) return null
    return userFolders.find(folder => folder.id === selectedFolderId)
  }, [selectedFolderId, userFolders])

  // Handle folder click - navigate to folder route
  const handleFolderClick = (folderId: number) => {
    setSelectedFolderId(folderId)
  }

  // Data to display based on active tab
  const displayItems = React.useMemo(() => {
    if (!currentUser) return []
    
    if (activeTab === "all") {
      // "All Folder" tab: show all files owned by the user
      return allUserFiles
    } else {
      // "Folder Name" tab: show folders owned by the user
      return userFolders
    }
  }, [activeTab, currentUser, allUserFiles, userFolders])

  // Pagination
  const itemsPerPage = 6
  const totalPages = Math.ceil(displayItems.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedItems = displayItems.slice(startIndex, startIndex + itemsPerPage)

  // Format size
  const formatSize = (size: string) => {
    if (!size) return "0 MB"
    if (!size.toLowerCase().includes('mb')) {
      return `${size} MB`
    }
    return size
  }

  // Handle item actions
  const handleAction = (action: string, itemId: number, itemType: 'folder' | 'file') => {
    console.log(`${action} ${itemType} ${itemId}`)
    
    switch (action) {
      case 'open':
        if (itemType === 'folder') {
          handleFolderClick(itemId)
        } else {
          alert(`Opening file: ${itemId}`)
        }
        break
      case 'download':
        alert('Download started')
        break
      case 'share':
        const email = prompt('Enter email to share with:')
        if (email) {
          alert(`Shared with ${email}`)
        }
        break
      case 'rename':
        const newName = prompt('Enter new name:')
        if (newName) {
          if (itemType === 'folder') {
            setFolders(prev => prev.map(f => 
              f.id === itemId ? { ...f, name: newName, lastModified: new Date().toISOString() } : f
            ))
          } else {
            setFiles(prev => prev.map(f => 
              f.id === itemId ? { ...f, name: newName, lastModified: new Date().toISOString() } : f
            ))
          }
        }
        break
      case 'delete':
        if (confirm('Are you sure you want to move this item to trash?')) {
          if (itemType === 'folder') {
            setFolders(prev => prev.map(f => 
              f.id === itemId ? { ...f, isTrashed: true, trashedAt: new Date().toISOString() } : f
            ))
          } else {
            setFiles(prev => prev.map(f => 
              f.id === itemId ? { ...f, isTrashed: true, trashedAt: new Date().toISOString() } : f
            ))
          }
        }
        break
    }
  }

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files
    if (!uploadedFiles || uploadedFiles.length === 0) return
    
    const newFiles: EnhancedFileItem[] = Array.from(uploadedFiles).map((file, index) => {
      const fileId = Math.max(...files.map(f => f.id)) + index + 1
      return {
        id: fileId,
        name: file.name,
        owner: currentUser?.name || "You",
        ownerId: currentUser?.id || 1,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        lastModified: new Date().toISOString().split('T')[0],
        lastOpened: new Date().toISOString().split('T')[0],
        dateAdded: new Date().toISOString().split('T')[0],
        sharedWith: 0,
        isTrashed: false,
        color: "#4299E1",
        workspaceId: undefined,
        tags: [],
        sharedWithIds: [],
        type: "file" as const,
        fileType: file.name.split('.').pop()?.toUpperCase() || "FILE",
        version: 1,
        folderId: activeTab === "folders" && selectedFolderId ? selectedFolderId : undefined,
        sharingRecords: []
      }
    })
    
    setFiles(prev => [...prev, ...newFiles])
    alert(`Successfully uploaded ${uploadedFiles.length} file(s)!`)
  }

  // Calculate total storage used by current user
  const totalStorageUsed = React.useMemo(() => {
    if (!currentUser) return "0 MB"
    
    const userAllFiles = files.filter(file => file.ownerId === currentUser.id && !file.isTrashed)
    const totalSizeMB = userAllFiles.reduce((total, file) => {
      const sizeMatch = file.size?.match(/([\d.]+)\s*MB/i)
      if (sizeMatch) {
        return total + parseFloat(sizeMatch[1])
      }
      return total
    }, 0)
    
    return `${totalSizeMB.toFixed(1)} MB`
  }, [currentUser, files])

  // Get breadcrumb for folder navigation
  const getFolderBreadcrumb = (folderId: number): { id: number; name: string }[] => {
    const breadcrumb: { id: number; name: string }[] = []
    let currentFolder = folders.find(f => f.id === folderId)
    
    while (currentFolder) {
      breadcrumb.unshift({ id: currentFolder.id, name: currentFolder.name })
      if (currentFolder.parentFolderId) {
        currentFolder = folders.find(f => f.id === currentFolder!.parentFolderId)
      } else {
        currentFolder = undefined
      }
    }
    
    return breadcrumb
  }

  if (!currentUser) {
    return (
      <div 
        className="w-[770px] h-[400px] rounded-[12px] border border-[#E2E8F0] bg-white flex items-center justify-center"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user data...</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="min-w-[770px] h-[400px] rounded-[12px] border border-[#E2E8F0] bg-white overflow-hidden"
    >
      <div className="flex h-full">
        {/* Left Column - Vertical Tabs */}
        <div className="flex flex-col items-center justify-between w-[200px] p-[12px]">
          <Tabs 
            defaultValue="all" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full h-full space-y-[12px]"
            orientation="vertical"
          >
            <div className="relative p-[12px]">
              <h2 className="text-lg font-semibold text-gray-900">
                {activeTab === "all" ? "All Files" : "Folders"}
              </h2>
            </div>
            <TabsList className="flex flex-col items-start bg-transparent p-[12px] gap-[4px] w-full">
              <TabsTrigger
                value="all"
                className={cn(
                  "w-full min-h-[42px] rounded-lg justify-start p-[12px]",
                  "data-[state=active]:bg-[#F2F9FE] data-[state=active]:text-[#4157FE] data-[state=active]:font-medium",
                  "text-[#697588]"
                )}
              >
                <div className="flex items-center gap-[8px]">
                  <Folder />
                  <span>All Folder</span>
                </div>
              </TabsTrigger>
              
              <TabsTrigger
                value="folders"
                className={cn(
                  "w-full min-h-[42px] rounded-lg justify-start p-[12px]",
                  "data-[state=active]:bg-[#F2F9FE] data-[state=active]:text-[#4157FE] data-[state=active]:font-medium",
                  "text-[#697588]"
                )}
              >
                <div className="flex items-center gap-[8px]">
                  <Folder/>
                  <span>Folder Name</span>
                </div>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Right Column - Content Area */}
        <div className="flex-1 items-center p-[12px]">
          {/* Breadcrumb for folder navigation */}
          {activeTab === "folders" && selectedFolder && (
            <div>
              <div className="flex items-center text-sm">
                <span 
                  onClick={() => setSelectedFolderId(null)}
                  className="cursor-pointer hover:text-blue-600"
                >
                  Folders
                </span>
                <ChevronRight />
                <span className="font-medium">{selectedFolder.name}</span>
              </div>
            </div>
          )}

          {/* Table Container */}
          <div className="m-[12px] p-[4px] border-fs rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="h-[32px]">
                  <TableHead className="px-[12px] text-foreground ">
                    {activeTab === "all" ? "Files" : "Folder Name"}
                  </TableHead>
                  <TableHead className="text-foreground border-0 border-r-0 border-b border-l-0 border-[#EBEBEB]">
                    Storage Used
                  </TableHead>
                  <TableHead className="text-foreground border-0 border-r-0 border-b border-l-0 border-[#EBEBEB]">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedItems.length > 0 ? (
                  paginatedItems.map((item) => (
                    <TableRow 
                      key={`${item.type}-${item.id}`}
                      className="w-auto h-[40px] opacity-100 border-0 border-b border-[#EBEBEB] hover:bg-muted/50 data-[state=selected]:bg-muted transition-colors"
                    >
                      {/* File/Folder Name */}
                      <TableCell className="px-[12px] whitespace-nowrap border-0 border-b border-[#EBEBEB]">
                        <div className="flex items-center gap-[8px]">
                          {item.type === "folder" ? (
                            <div 
                              onClick={() => handleFolderClick(item.id)}
                              className="flex items-center justify-center bg-blue-100 rounded cursor-pointer hover:bg-blue-200"
                            >
                              <Folder />
                            </div>
                          ) : (
                            <div className="flex items-center justify-center rounded">
                              <File />
                            </div>
                          )}
                          <div>
                            <div 
                              className={cn(
                                "text-sm font-medium text-[#2D3748]",
                                item.type === "folder" && "cursor-pointer hover:text-blue-600"
                              )}
                              onClick={() => item.type === "folder" && handleFolderClick(item.id)}
                            >
                              {item.name.length > 30 ? item.name.substring(0, 27) + '...' : item.name}
                            </div>
                            {item.type === "folder" ? (
                              <div className="text-xs text-[#718096]">
                                {(item as EnhancedFolderItem).fileIds?.length || 0} files
                              </div>
                            ) : (
                              <div className="text-xs text-[#718096]">
                                {(item as EnhancedFileItem).fileType} • {formatSize(item.size)}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      {/* Storage Used */}
                      <TableCell className="whitespace-nowrap border-0 border-b border-[#EBEBEB]">
                        <span className="text-sm text-[#4A5568]">
                          {formatSize(item.size)}
                        </span>
                      </TableCell>

                      {/* Action Button */}
                      <TableCell className="whitespace-nowrap border-0 border-b border-[#EBEBEB]">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="hover:bg-gray-100"
                            >
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="text-[#718096]" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-[white]">
                            <DropdownMenuItem 
                              onClick={() => handleAction('open', item.id, item.type)}
                              className="cursor-pointer"
                            >
                              {item.type === "folder" ? "Open Folder" : "Open File"}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleAction('download', item.id, item.type)}
                              className="cursor-pointer"
                            >
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleAction('share', item.id, item.type)}
                              className="cursor-pointer"
                            >
                              Share ({item.sharedWith} people)
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleAction('rename', item.id, item.type)}
                              className="cursor-pointer"
                            >
                              Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleAction('delete', item.id, item.type)}
                              className="cursor-pointer text-red-600"
                            >
                              Move to Trash
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          {activeTab === "all" ? (
                            <File />
                          ) : (
                            <Folder />
                          )}
                          <p className="text-sm text-gray-500">
                            {activeTab === "all" ? "No files found" : "No folders found"}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {activeTab === "all" 
                              ? "Upload a file to get started" 
                              : selectedFolder 
                                ? "No files in this folder"
                                : "You don't have any folders yet"
                            }
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {/* Pagination Controls */}
            <div className="flex items-center justify-around p-[12px]">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Utility function to get user data from localStorage
export function getCurrentUserFromLocalStorage(): LocalStorageUserData | null {
  if (typeof window === 'undefined') return null
  
  const userData = localStorage.getItem('currentUser')
  if (!userData) return null
  
  try {
    return JSON.parse(userData)
  } catch (error) {
    console.error('Error parsing user data from localStorage:', error)
    return null
  }
}

// Function to set current user in localStorage
export function setCurrentUserInLocalStorage(user: LocalStorageUserData) {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem('currentUser', JSON.stringify(user))
  } catch (error) {
    console.error('Error saving user data to localStorage:', error)
  }
}

