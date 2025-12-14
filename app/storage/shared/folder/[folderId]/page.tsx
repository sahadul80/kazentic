"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { BaseStorageLayout } from "@/components/storage/BaseStorageLayout";
import { useStorageData } from "@/hooks/useStorageData";
import { useStorageActions } from "@/hooks/useStorageActions";
import { useStorageSelection } from "@/hooks/useStorageSelection";
import { useStorageFilters } from "@/hooks/useStorageFilters";
import { 
  mockFolders, 
  mockFiles, 
  getFilesInFolder,
  getChildFolders,
  sharedFolders,
  sharedFiles
} from "@/data/mockStorageData";
import { 
  ViewMode, 
  ActionType 
} from "@/types/storage";

// Interface for user data
interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  workspaceIds: number[];
}

export default function SharedFolderPage() {
  const router = useRouter();
  const params = useParams();
  const folderId = parseInt(params.folderId as string);
  
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [folders, setFolders] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<Array<{ id: number; name: string }>>([]);
  const [currentFolder, setCurrentFolder] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load current user
  useEffect(() => {
    const userDataStr = localStorage.getItem('currentUser') || 
                       sessionStorage.getItem('currentUser');
    
    if (userDataStr) {
      try {
        const userData: UserData = JSON.parse(userDataStr);
        setCurrentUser(userData);
      } catch (error) {
        console.error("Error parsing user data:", error);
        router.push("/login");
      }
    } else {
      router.push("/login");
    }
  }, [router]);

  // Load current folder data
  useEffect(() => {
    if (!currentUser) return;

    setIsLoading(true);
    
    // Find the folder in shared folders first, then in regular folders
    let folder = sharedFolders.find(f => f.id === folderId);
    
    // If not found in sharedFolders, check regular folders but only if shared
    if (!folder) {
      folder = mockFolders.find(f => f.id === folderId && f.sharedWith > 0);
    }
    
    if (folder) {
      // Check if folder is shared with current user
      if (folder.sharedWith <= 0) {
        // Folder is not shared, redirect to shared storage
        router.push("/storage/shared");
        return;
      }
      
      // Don't show user's own items in shared view
      if (folder.ownerId === currentUser.id) {
        router.push("/storage/my");
        return;
      }
      
      setCurrentFolder(folder);
      
      // Generate breadcrumbs similar to MyFolderPage
      const newBreadcrumbs: Array<{ id: number; name: string }> = [];
      let current: any = folder;
      
      // Build breadcrumbs from current folder to root
      const breadcrumbPath: Array<{ id: number; name: string }> = [];
      
      while (current) {
        // Only add to breadcrumb if the folder is accessible (shared)
        const isShared = sharedFolders.some(f => f.id === current.id) || 
                        current.sharedWith > 0;
        
        if (isShared) {
          breadcrumbPath.unshift({ id: current.id, name: current.name });
        }
        
        if (current.parentFolderId) {
          // Look for parent in shared folders first
          const parentInShared = sharedFolders.find(f => f.id === current.parentFolderId);
          if (parentInShared) {
            current = parentInShared;
          } else {
            // Look in regular folders if it's shared
            const parentInMock = mockFolders.find(f => 
              f.id === current.parentFolderId && f.sharedWith > 0
            );
            if (parentInMock && parentInMock.ownerId !== currentUser.id) {
              current = parentInMock;
            } else {
              current = null;
            }
          }
        } else {
          current = null;
        }
      }
      
      // Add "Shared with me" at the beginning (similar to "All Folders" in MyFolderPage)
      setBreadcrumbs([{ id: 0, name: "Shared with me" }, ...breadcrumbPath]);
      
      // Load items in this folder
      loadFolderItems(folder.id);
    } else {
      // Folder not found, redirect to shared storage
      router.push("/storage/shared");
    }
    
    setIsLoading(false);
  }, [folderId, router, currentUser]);

  // Load items in current folder
  const loadFolderItems = (folderId: number) => {
    if (!currentUser) return;

    // Get child folders from shared folders
    const sharedChildFolders = sharedFolders.filter(folder => 
      folder.parentFolderId === folderId
    );
    
    // Get child folders from regular folders that are shared
    const regularChildFolders = getChildFolders(folderId).filter(folder => 
      folder.sharedWith > 0 && folder.ownerId !== currentUser.id
    );
    
    // Combine and filter unique folders
    const allChildFolders = [...sharedChildFolders, ...regularChildFolders];
    const uniqueChildFolders = allChildFolders.filter((folder, index, self) =>
      index === self.findIndex(f => f.id === folder.id)
    );
    
    // Filter out user's own items and ensure they're shared
    const childFolders = uniqueChildFolders.filter(folder => {
      if (folder.sharedWith <= 0) return false;
      if (folder.ownerId === currentUser.id) return false;
      return true;
    });
    
    // Get files in folder from shared files
    const sharedFolderFiles = sharedFiles.filter(file => 
      file.folderId === folderId
    );
    
    // Get files in folder from regular files that are shared
    const regularFolderFiles = getFilesInFolder(folderId).filter(file => 
      file.sharedWith > 0 && file.ownerId !== currentUser.id
    );
    
    // Combine and filter unique files
    const allFolderFiles = [...sharedFolderFiles, ...regularFolderFiles];
    const uniqueFolderFiles = allFolderFiles.filter((file, index, self) =>
      index === self.findIndex(f => f.id === file.id)
    );
    
    // Filter out user's own items and ensure they're shared
    const folderFiles = uniqueFolderFiles.filter(file => {
      if (file.sharedWith <= 0) return false;
      if (file.ownerId === currentUser.id) return false;
      return true;
    });
    
    setFolders(childFolders);
    setFiles(folderFiles);
  };

  // Hooks
  const {
    selectedItems,
    toggleItemSelection,
    selectAll,
    clearSelection,
  } = useStorageSelection();

  const {
    filters,
    sortConfig,
    updateFilter,
    clearFilters,
    handleSort,
    hasActiveFilters,
  } = useStorageFilters();

  // Data filtering
  const { filteredFolders, filteredFiles } = useStorageData({
    folders,
    files,
    filters,
    sortConfig,
  });

  // Actions
  const { handleItemAction, handleBulkAction, handleAddNew } = useStorageActions({
    setFolders,
    setFiles,
    clearSelection,
  });

  // Get items in current folder for selectAll functionality
  const folderItems = useMemo(() => {
    return {
      folders: folders,
      files: files
    };
  }, [folders, files]);

  // Handle folder click - navigate to subfolder
  const handleFolderClick = (subFolderId: number) => {
    router.push(`/storage/shared/folder/${subFolderId}`);
  };

  // Handle going back
  const handleGoBack = () => {
    if (currentFolder?.parentFolderId) {
      // Check if parent folder is shared and accessible
      const parentFolder = sharedFolders.find(f => f.id === currentFolder.parentFolderId) || 
                          mockFolders.find(f => f.id === currentFolder.parentFolderId);
      
      if (parentFolder && parentFolder.sharedWith > 0 && parentFolder.ownerId !== currentUser?.id) {
        router.push(`/storage/shared/folder/${currentFolder.parentFolderId}`);
      } else {
        router.push("/storage/shared");
      }
    } else {
      router.push("/storage/shared");
    }
  };

  // Handle breadcrumb navigation
  const handleNavigateToFolder = (crumbFolderId: number) => {
    if (crumbFolderId === 0) {
      router.push("/storage/shared");
    } else {
      router.push(`/storage/shared/folder/${crumbFolderId}`);
    }
  };

  // Enhanced item action handler
  const handleItemActionWithNavigation = (id: number, action: ActionType) => {
    if (action === "open") {
      const folder = folders.find(f => f.id === id);
      if (folder) {
        handleFolderClick(id);
        return;
      }
    }
    handleItemAction(id, action);
  };

  // Calculate selected info
  const selectedInfo = useMemo(() => {
    const allItems = [...folders, ...files];
    const selectedFolders = folders.filter(f => selectedItems.includes(f.id));
    const selectedFiles = files.filter(f => selectedItems.includes(f.id));
    const selectedAllItems = allItems.filter(item => selectedItems.includes(item.id));
    
    // Calculate total size in MB
    const totalSizeMB = selectedFolders.reduce((sum, folder) => {
      const sizeNum = parseFloat(folder.size.replace(/[^0-9.]/g, ''));
      return sum + (isNaN(sizeNum) ? 0 : sizeNum);
    }, 0) + selectedFiles.reduce((sum, file) => {
      const sizeNum = parseFloat(file.size.replace(/[^0-9.]/g, ''));
      return sum + (isNaN(sizeNum) ? 0 : sizeNum);
    }, 0);
    
    return {
      count: selectedItems.length,
      size: `${Math.round(totalSizeMB)}MB`,
      totalSizeMB: totalSizeMB,
      folders: selectedFolders.length,
      files: selectedFiles.length,
      items: selectedAllItems,
    };
  }, [selectedItems, folders, files]);

  // Calculate folder statistics
  const folderStats = useMemo(() => {
    return {
      totalFolders: folders.length,
      totalFiles: files.length,
    };
  }, [folders, files]);

  // Handle action buttons
  const handleDownload = () => {
    console.log('Downloading selected items:', selectedItems);
  };

  const handleShare = () => {
    console.log('Sharing selected items:', selectedItems);
  };

  const handleInfo = () => {
    console.log('Info for selected items:', selectedItems);
  };

  const handleDelete = () => {
    console.log('Deleting selected items:', selectedItems);
  };

  // If loading, show loading state
  if (isLoading || !currentUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading shared folder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-auto mx-auto">
      <BaseStorageLayout
        // Data
        folders={folders}
        files={files}
        filteredFolders={filteredFolders}
        filteredFiles={filteredFiles}
        
        // State
        viewMode={viewMode}
        selectedItems={selectedItems}
        filters={filters}
        sortConfig={sortConfig}
        hasActiveFilters={hasActiveFilters}
        
        // Folder Navigation
        currentFolderId={folderId}
        currentFolder={currentFolder}
        breadcrumbs={breadcrumbs}
        
        // Callbacks
        onViewModeChange={setViewMode}
        onSearch={(query) => updateFilter("search", query)}
        onAddNew={handleAddNew}
        onFilterChange={updateFilter}
        onClearFilters={clearFilters}
        onSort={handleSort}
        onItemAction={handleItemActionWithNavigation}
        onBulkAction={(action) => handleBulkAction(action, selectedItems)}
        onSelectItem={toggleItemSelection}
        onSelectAll={() => {
          const allItemIds = [
            ...filteredFolders.map(f => f.id),
            ...filteredFiles.map(f => f.id)
          ];
          selectAll(allItemIds);
        }}
        onClearSelection={clearSelection}
        onFolderClick={handleFolderClick}
        onGoBack={handleGoBack}
        onNavigateToFolder={handleNavigateToFolder}
        
        // Action button handlers
        onDownload={handleDownload}
        onShare={handleShare}
        onInfo={handleInfo}
        onDelete={handleDelete}
        
        // Info
        selectedInfo={selectedInfo}
        
        // Customization
        storageType="shared"
        showProgressBar={false}
        showFolderNavigation={true}
        showBreadcrumbs={true}
        showAddNewButton={false}
        title={currentFolder?.name || "Shared Folder"}
        searchPlaceholder="Search in shared folder..."
      />
    </div>
  );
}