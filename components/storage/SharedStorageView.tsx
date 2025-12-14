"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BaseStorageLayout } from "./BaseStorageLayout";
import { useStorageData } from "@/hooks/useStorageData";
import { useStorageActions } from "@/hooks/useStorageActions";

// Hooks
import { useStorageSelection } from "@/hooks/useStorageSelection";
import { useStorageFilters } from "@/hooks/useStorageFilters";

// Mock Data
import { 
  sharedFolders, 
  sharedFiles,
} from "@/data/mockStorageData";

// Types
import { ViewMode, ActionType, EnhancedFileItem, EnhancedFolderItem } from "@/types/storage";

// Interface for user data
interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  workspaceIds: number[];
}

export function SharedStorageView() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [folders, setFolders] = useState<EnhancedFolderItem[]>([]);
  const [files, setFiles] = useState<EnhancedFileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load user data from localStorage
  useEffect(() => {
    const initializeUserData = () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Get user data from localStorage (this would be set after login)
        const userDataStr = localStorage.getItem('currentUser') || 
                           sessionStorage.getItem('currentUser');
        
        if (!userDataStr) {
          setError("Please log in to access shared items.");
          setIsLoading(false);
          return;
        }

        const userData: UserData = JSON.parse(userDataStr);
        setCurrentUser(userData);
        
        // Filter shared items that are accessible to the current user
        const userWorkspaceIds = userData.workspaceIds || [];
        
        // Filter shared folders
        const accessibleFolders = sharedFolders.filter(folder => {
          // Only show folders with sharedWith > 0
          if (folder.sharedWith <= 0) return false;
          
          // Don't show user's own items in shared view
          if (folder.ownerId === userData.id) return false;
          
          // Check workspace access
          if (folder.workspaceId && !userWorkspaceIds.includes(folder.workspaceId)) {
            return false;
          }
          
          return true;
        });

        // Filter shared files
        const accessibleFiles = sharedFiles.filter(file => {
          // Only show files with sharedWith > 0
          if (file.sharedWith <= 0) return false;
          
          // Don't show user's own items in shared view
          if (file.ownerId === userData.id) return false;
          
          // Check workspace access
          if (file.workspaceId && !userWorkspaceIds.includes(file.workspaceId)) {
            return false;
          }
          
          return true;
        });

        // For root view, show only top-level items
        const topLevelFolders = accessibleFolders.filter(folder => !folder.parentFolderId);
        
        const topLevelFiles = accessibleFiles.filter(file => {
          // Files without folderId are at root
          if (!file.folderId) return true;
          
          // Check if parent folder is in accessible folders
          const parentFolder = accessibleFolders.find(f => f.id === file.folderId);
          // Only show file if its parent folder is NOT in topLevelFolders
          return !parentFolder || !topLevelFolders.some(f => f.id === parentFolder.id);
        });

        setFolders(topLevelFolders);
        setFiles(topLevelFiles);
        
      } catch (error) {
        console.error("Error loading shared items:", error);
        setError("Failed to load shared items. Please try refreshing the page.");
        
        // Clear potentially corrupted data
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUser');
      } finally {
        setIsLoading(false);
      }
    };

    initializeUserData();
  }, []);

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
  const { filteredFolders = [], filteredFiles = [] } = useStorageData({
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

  // Handle folder click for shared items
  const handleFolderClick = useCallback((folderId: number) => {
    router.push(`/storage/shared/folder/${folderId}`);
  }, [router]);

  // Enhanced item action handler
  const handleItemActionWithNavigation = useCallback((id: number, action: ActionType) => {
    if (action === "open") {
      const folder = folders.find(f => f.id === id);
      if (folder) {
        handleFolderClick(id);
        return;
      }
      
      const file = files.find(f => f.id === id);
      if (file) {
        console.log(`Opening shared file: ${file.name}`);
        // TODO: Implement file preview/download for shared files
      }
    } else if (action === "delete") {
      const file = files.find(f => f.id === id);
      if (file && file.folderId) {
        router.push(`/storage/shared/folder/${file.folderId}`);
      }
      handleItemAction(id, action);
    } else {
      handleItemAction(id, action);
    }
  }, [folders, files, handleFolderClick, handleItemAction, router]);

  // Handle going back
  const handleGoBack = useCallback(() => {
    router.back();
  }, [router]);

  // Handle breadcrumb navigation
  const handleNavigateToFolder = useCallback((folderId: number) => {
    if (folderId === 0) {
      router.push("/storage/shared");
    } else {
      router.push(`/storage/shared/folder/${folderId}`);
    }
  }, [router]);

  // Handle bulk action
  const handleBulkActionWithSelection = useCallback((action: string) => {
    if (action === "delete") {
      if (confirm(`Are you sure you want to remove ${selectedItems.length} items from shared?`)) {
        handleBulkAction(action as ActionType, selectedItems);
      }
      return;
    }
    handleBulkAction(action as ActionType, selectedItems);
  }, [handleBulkAction, selectedItems]);

  // Handle select all
  const handleSelectAll = useCallback(() => {
    const allItemIds = [
      ...(filteredFolders || []).map(f => f.id),
      ...(filteredFiles || []).map(f => f.id)
    ];
    selectAll(allItemIds);
  }, [filteredFolders, filteredFiles, selectAll]);

  // Calculate selected info
  const selectedInfo = useMemo(() => {
    const selectedFolders = filteredFolders.filter(f => selectedItems.includes(f.id));
    const selectedFiles = filteredFiles.filter(f => selectedItems.includes(f.id));
    const selectedAllItems = [...selectedFolders, ...selectedFiles];
    
    const totalSize = selectedFolders.reduce((sum, folder) => {
      const sizeNum = parseFloat(folder.size.replace(/[^0-9.]/g, ''));
      return sum + (isNaN(sizeNum) ? 0 : sizeNum);
    }, 0) + selectedFiles.reduce((sum, file) => {
      const sizeNum = parseFloat(file.size.replace(/[^0-9.]/g, ''));
      return sum + (isNaN(sizeNum) ? 0 : sizeNum);
    }, 0);
    
    // Calculate shared users count for selected items
    const totalSharedUsers = selectedAllItems.reduce((sum, item) => {
      return sum + (item.sharedWith || 0);
    }, 0);
    const avgSharedUsers = selectedAllItems.length > 0 
      ? Math.round(totalSharedUsers / selectedAllItems.length)
      : 0;
    
    return {
      count: selectedItems.length,
      size: `${Math.round(totalSize)}MB`,
      folders: selectedFolders.length,
      files: selectedFiles.length,
      items: selectedAllItems,
      totalSizeMB: totalSize,
      avgSharedUsers,
      totalSharedUsers,
    };
  }, [selectedItems, filteredFolders, filteredFiles]);

  // Handle action buttons
  const handleDownload = useCallback(() => {
    console.log('Downloading selected shared items:', selectedItems);
    // TODO: Implement download logic for shared items
  }, [selectedItems]);

  const handleShare = useCallback(() => {
    console.log('Sharing selected shared items:', selectedItems);
    // TODO: Implement share logic for shared items
  }, [selectedItems]);

  const handleInfo = useCallback(() => {
    console.log('Info for selected shared items:', selectedItems);
    // TODO: Implement info panel for shared items
  }, [selectedItems]);

  const handleDelete = useCallback(() => {
    if (selectedItems.length === 0) return;
    
    if (confirm(`Remove ${selectedItems.length} item(s) from shared? You will no longer have access to these items.`)) {
      handleBulkAction('delete', selectedItems);
    }
  }, [handleBulkAction, selectedItems]);

  // Handle adding new items (for shared view, this means sharing new items)
  const handleAddNewWithContext = useCallback(() => {
    console.log("Share new item dialog");
    // TODO: Implement share new item dialog
  }, []);

  // Create breadcrumbs for shared view
  const breadcrumbs = useMemo(() => {
    return [{ id: 0, name: "Shared with me", type: 'root' as const }];
  }, []);

  // If loading, show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading shared items...</p>
        </div>
      </div>
    );
  }

  // If error, show error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Shared Items</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Refresh Page
            </button>
            <button
              onClick={() => router.push('/login')}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If no user data, show error
  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center max-w-md mx-auto p-6">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please log in to access shared items.</p>
          <button
            onClick={() => router.push('/login')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <BaseStorageLayout
      // Data
      folders={folders}
      files={files}
      filteredFolders={filteredFolders || []}
      filteredFiles={filteredFiles || []}
      
      // State
      viewMode={viewMode}
      selectedItems={selectedItems}
      filters={filters}
      sortConfig={sortConfig}
      hasActiveFilters={hasActiveFilters}
      
      // Folder Navigation
      currentFolderId={null}
      currentFolder={null}
      breadcrumbs={breadcrumbs}
      
      // Callbacks
      onViewModeChange={setViewMode}
      onSearch={(query) => updateFilter("search", query)}
      onAddNew={handleAddNewWithContext}
      onFilterChange={updateFilter}
      onClearFilters={clearFilters}
      onSort={handleSort}
      onItemAction={handleItemActionWithNavigation}
      onBulkAction={handleBulkActionWithSelection}
      onSelectItem={toggleItemSelection}
      onSelectAll={handleSelectAll}
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
      title="Shared with me"
      storageType="shared"
      showProgressBar={true}
      showFolderNavigation={false}
      showBreadcrumbs={true}
      searchPlaceholder="Search shared files and folders..."
    />
  );
}