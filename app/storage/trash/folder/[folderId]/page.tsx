"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { BaseStorageLayout } from "@/components/storage/BaseStorageLayout";
import { useStorageData } from "@/hooks/useStorageData";
import { useStorageActions } from "@/hooks/useStorageActions";
import { useStorageSelection } from "@/hooks/useStorageSelection";
import { useStorageFilters } from "@/hooks/useStorageFilters";
import { 
  trashedFolders, 
  trashedFiles,
  getFilesInFolder,
  getChildFolders 
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

export default function TrashFolderPage() {
  const router = useRouter();
  const params = useParams();
  const folderId = parseInt(params.folderId as string);
  
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [folders, setFolders] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<Array<{ id: number; name: string; type?: 'folder' | 'root' }>>([]);
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
    
    // Find the folder in trashed folders
    const folder = trashedFolders.find(f => f.id === folderId);
    
    if (folder) {
      setCurrentFolder(folder);
      
      // Generate breadcrumbs for trash
      const breadcrumbPath: Array<{ id: number; name: string; type: 'folder' | 'root' }> = [];
      let current: any = folder;
      
      // Build breadcrumbs from current folder to root
      while (current) {
        breadcrumbPath.unshift({ 
          id: current.id, 
          name: current.name, 
          type: 'folder' as const 
        });
        
        if (current.parentFolderId) {
          // Look for parent in trashed folders
          current = trashedFolders.find(f => f.id === current.parentFolderId);
        } else {
          current = null;
        }
      }
      
      // Add "Trash" at the beginning
      setBreadcrumbs([
        { id: 0, name: "Trash", type: 'root' as const }, 
        ...breadcrumbPath
      ]);
      
      // Load items in this folder
      loadFolderItems(folder.id);
    } else {
      // Folder not found in trash, redirect to trash storage
      router.push("/storage/trash");
    }
    
    setIsLoading(false);
  }, [folderId, router, currentUser]);

  // Load items in current folder
  const loadFolderItems = (folderId: number) => {
    // Get child folders from trash
    const childFolders = trashedFolders.filter(folder => 
      folder.parentFolderId === folderId
    );
    
    // Get files in folder from trash
    const folderFiles = trashedFiles.filter(file => 
      file.folderId === folderId
    );
    
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

  // Custom actions for trash
  const handleRestoreItem = (id: number) => {
    const folder = folders.find(f => f.id === id);
    const file = files.find(f => f.id === id);
    
    if (folder) {
      if (confirm(`Restore this folder from trash?`)) {
        // In a real app, this would call an API
        console.log(`Restoring folder ${id} from trash`);
        setFolders(prev => prev.filter(f => f.id !== id));
        clearSelection();
      }
    } else if (file) {
      if (confirm(`Restore this file from trash?`)) {
        // In a real app, this would call an API
        console.log(`Restoring file ${id} from trash`);
        setFiles(prev => prev.filter(f => f.id !== id));
        clearSelection();
      }
    }
  };

  const handlePermanentlyDeleteItem = (id: number) => {
    const folder = folders.find(f => f.id === id);
    const file = files.find(f => f.id === id);
    
    if (folder) {
      if (confirm(`Permanently delete this folder? This action cannot be undone.`)) {
        // In a real app, this would call an API
        console.log(`Permanently deleting folder ${id}`);
        setFolders(prev => prev.filter(f => f.id !== id));
        clearSelection();
      }
    } else if (file) {
      if (confirm(`Permanently delete this file? This action cannot be undone.`)) {
        // In a real app, this would call an API
        console.log(`Permanently deleting file ${id}`);
        setFiles(prev => prev.filter(f => f.id !== id));
        clearSelection();
      }
    }
  };

  // Custom item action handler for trash
  const handleItemActionWithNavigation = (id: number, action: ActionType) => {
    if (action === "open") {
      const folder = folders.find(f => f.id === id);
      if (folder) {
        handleFolderClick(id);
        return;
      }
    } else if (action === "restore") {
      handleRestoreItem(id);
    } else if (action === "delete") {
      handlePermanentlyDeleteItem(id);
    }
  };

  // Custom bulk action handler for trash
  const handleTrashBulkAction = (action: string) => {
    if (action === "restore") {
      handleRestoreSelected();
    } else if (action === "delete") {
      handlePermanentlyDeleteSelected();
    }
  };

  // Handle folder click - navigate to subfolder
  const handleFolderClick = (subFolderId: number) => {
    router.push(`/storage/trash/folder/${subFolderId}`);
  };

  // Handle going back
  const handleGoBack = () => {
    if (currentFolder?.parentFolderId) {
      const parentFolder = trashedFolders.find(f => f.id === currentFolder.parentFolderId);
      if (parentFolder) {
        router.push(`/storage/trash/folder/${currentFolder.parentFolderId}`);
      } else {
        router.push("/storage/trash");
      }
    } else {
      router.push("/storage/trash");
    }
  };

  // Handle breadcrumb navigation
  const handleNavigateToFolder = (crumbFolderId: number) => {
    if (crumbFolderId === 0) {
      router.push("/storage/trash");
    } else {
      router.push(`/storage/trash/folder/${crumbFolderId}`);
    }
  };

  const handleRestoreSelected = () => {
    if (selectedItems.length === 0) return;
    
    if (confirm(`Restore ${selectedItems.length} item(s) from trash?`)) {
      console.log(`Restoring items from trash:`, selectedItems);
      setFolders(prev => prev.filter(f => !selectedItems.includes(f.id)));
      setFiles(prev => prev.filter(f => !selectedItems.includes(f.id)));
      clearSelection();
    }
  };

  const handlePermanentlyDeleteSelected = () => {
    if (selectedItems.length === 0) return;
    
    if (confirm(`Permanently delete ${selectedItems.length} item(s)? This action cannot be undone.`)) {
      console.log(`Permanently deleting items:`, selectedItems);
      setFolders(prev => prev.filter(f => !selectedItems.includes(f.id)));
      setFiles(prev => prev.filter(f => !selectedItems.includes(f.id)));
      clearSelection();
    }
  };

  // Calculate selected info
  const selectedInfo = useMemo(() => {
    const selectedFolders = filteredFolders.filter(f => selectedItems.includes(f.id));
    const selectedFiles = filteredFiles.filter(f => selectedItems.includes(f.id));
    const selectedAllItems = [...selectedFolders, ...selectedFiles];
    
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
  }, [selectedItems, filteredFolders, filteredFiles]);

  // Custom bulk actions for trash
  const renderTrashBulkActions = () => (
    <div className="flex items-center gap-2">
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
        onClick={handleRestoreSelected}
        disabled={selectedItems.length === 0}
      >
        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Restore Selected
      </button>
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 text-red-600"
        onClick={handlePermanentlyDeleteSelected}
        disabled={selectedItems.length === 0}
      >
        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Delete Selected Permanently
      </button>
    </div>
  );

  // Handle action buttons
  const handleDownload = () => {
    console.log('Downloading selected items from trash:', selectedItems);
  };

  const handleShare = () => {
    console.log('Sharing selected items from trash:', selectedItems);
  };

  const handleInfo = () => {
    console.log('Info for selected items from trash:', selectedItems);
  };

  // If loading, show loading state
  if (isLoading || !currentUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading trash folder...</p>
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
        onAddNew={() => {}} // No add new in trash
        onFilterChange={updateFilter}
        onClearFilters={clearFilters}
        onSort={handleSort}
        onItemAction={handleItemActionWithNavigation}
        onBulkAction={handleTrashBulkAction}
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
        onDelete={handlePermanentlyDeleteSelected}
        
        // Info
        selectedInfo={selectedInfo}
        
        // Customization
        storageType="trash"
        showProgressBar={false}
        showFolderNavigation={true}
        showBreadcrumbs={true}
        showAddNewButton={false}
        title={`${currentFolder?.name || ""} (Trash)`}
        searchPlaceholder="Search in trash folder..."
        
        // Custom components
        renderBulkActions={renderTrashBulkActions}
      />
    </div>
  );
}