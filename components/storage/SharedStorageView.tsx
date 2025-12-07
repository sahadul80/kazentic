"use client";

import { useState, useMemo } from "react";
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
  mockWorkspaces,
  getUserById 
} from "@/data/mockStorageData";

// Types
import { ViewMode, ActionType, EnhancedFileItem, EnhancedFolderItem } from "@/types/storage";

export function SharedStorageView() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  
  // Filter to show only shared items (sharedWith > 0)
  const [folders, setFolders] = useState<EnhancedFolderItem[]>(
    sharedFolders.filter(folder => folder.sharedWith > 0)
  );
  const [files, setFiles] = useState<EnhancedFileItem[]>(
    sharedFiles.filter(file => file.sharedWith > 0)
  );

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

  // Get current user from localStorage (similar to StorageView)
  const [currentUser] = useState(() => {
    try {
      const userDataStr = localStorage.getItem('userData');
      if (userDataStr) {
        return JSON.parse(userDataStr);
      }
    } catch (error) {
      console.error("Error getting user data:", error);
    }
    
    // Fallback for development
    return {
      id: 1,
      name: "Pat Cummins",
      email: "pat@example.com",
      role: "admin",
      workspaceIds: [1, 2, 3]
    };
  });

  // Filter items that are shared with the current user
  const getSharedItemsForView = useMemo(() => {
    // First filter by shared status
    const sharedFoldersList = sharedFolders.filter(folder => {
      // Only show folders with sharedWith > 0
      if (folder.sharedWith <= 0) return false;
      
      // Check if the current user is in the sharedWith list
      if (Array.isArray(folder.sharedWith)) {
        return folder.sharedWith.some(user => user.id === currentUser.id);
      }
      
      // Fallback: If folder has sharedWith > 0, show it
      return true;
    });

    const sharedFilesList = sharedFiles.filter(file => {
      // Only show files with sharedWith > 0
      if (file.sharedWith <= 0) return false;
      
      // Check if the current user is in the sharedWith list
      if (Array.isArray(file.sharedWith)) {
        return file.sharedWith.some(user => user.id === currentUser.id);
      }
      
      // Fallback: If file has sharedWith > 0, show it
      return true;
    });

    // Filter out items from workspaces the user doesn't have access to
    const userWorkspaceIds = currentUser?.workspaceIds || [];
    
    const accessibleFolders = sharedFoldersList.filter(folder => {
      // If folder has a workspaceId, check if user has access
      if (folder.workspaceId) {
        return userWorkspaceIds.includes(folder.workspaceId);
      }
      // Personal folders are always accessible if shared with user
      return true;
    });

    const accessibleFiles = sharedFilesList.filter(file => {
      // If file has a workspaceId, check if user has access
      if (file.workspaceId) {
        return userWorkspaceIds.includes(file.workspaceId);
      }
      // Personal files are always accessible if shared with user
      return true;
    });

    return {
      folders: accessibleFolders,
      files: accessibleFiles
    };
  }, [currentUser]);

  // Update state with filtered shared items
  useState(() => {
    const sharedItems = getSharedItemsForView;
    setFolders(sharedItems.folders);
    setFiles(sharedItems.files);
  });

  // Data filtering
  const { filteredFolders = [], filteredFiles = [] } = useStorageData({
    folders: getSharedItemsForView.folders,
    files: getSharedItemsForView.files,
    filters,
    sortConfig,
  });

  // Actions
  const { handleItemAction, handleBulkAction } = useStorageActions({
    setFolders,
    setFiles,
    clearSelection,
  });

  // Custom shared action handler
  const handleSharedItemAction = (id: number, action: string) => {
    if (action === "delete") {
      if (confirm("Are you sure you want to remove this item from shared?")) {
        handleItemAction(id, action as ActionType);
      }
      return;
    }
    handleItemAction(id, action as ActionType);
  };

  const handleSharedBulkAction = (action: string) => {
    if (action === "delete") {
      if (confirm(`Are you sure you want to remove ${selectedItems.length} items from shared?`)) {
        handleBulkAction(action as ActionType, selectedItems);
      }
      return;
    }
    handleBulkAction(action as ActionType, selectedItems);
  };

  const handleSharedAddNew = () => {
    console.log("Share new item");
    // TODO: Implement share new item logic
  };

  // Calculate selected info - FIXED: Use filtered items instead of all items
  const selectedInfo = useMemo(() => {
    // Use filtered items to get accurate selection
    const selectedFolders = filteredFolders.filter(f => selectedItems.includes(f.id));
    const selectedFiles = filteredFiles.filter(f => selectedItems.includes(f.id));
    const selectedAllItems = [...selectedFolders, ...selectedFiles];
    
    // Calculate total size
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
      avgSharedUsers: avgSharedUsers,
      totalSharedUsers: totalSharedUsers,
    };
  }, [selectedItems, filteredFolders, filteredFiles]);

  // Handle select all
  const handleSelectAll = useCallback(() => {
    const allItemIds = [
      ...(filteredFolders || []).map(f => f.id),
      ...(filteredFiles || []).map(f => f.id)
    ];
    selectAll(allItemIds);
  }, [filteredFolders, filteredFiles, selectAll]);

  // Handle folder click for shared items
  const handleFolderClick = useCallback((folderId: number) => {
    // Navigate to shared folder view
    console.log(`Opening shared folder: ${folderId}`);
    // TODO: Implement navigation to shared folder
  }, []);

  // Calculate total shared storage usage
  const storageInfo = useMemo(() => {
    const totalFoldersSize = getSharedItemsForView.folders.reduce((sum, folder) => {
      const sizeNum = parseFloat(folder.size.replace(/[^0-9.]/g, ''));
      return sum + (isNaN(sizeNum) ? 0 : sizeNum);
    }, 0);
    
    const totalFilesSize = getSharedItemsForView.files.reduce((sum, file) => {
      const sizeNum = parseFloat(file.size.replace(/[^0-9.]/g, ''));
      return sum + (isNaN(sizeNum) ? 0 : sizeNum);
    }, 0);
    
    const totalSize = totalFoldersSize + totalFilesSize;
    
    // Calculate average shared users
    const allSharedItems = [...getSharedItemsForView.folders, ...getSharedItemsForView.files];
    const totalSharedUsers = allSharedItems.reduce((sum, item) => {
      return sum + (item.sharedWith || 0);
    }, 0);
    const avgSharedUsers = allSharedItems.length > 0 
      ? Math.round(totalSharedUsers / allSharedItems.length)
      : 0;
    
    return {
      total: totalSize,
      folders: getSharedItemsForView.folders.length,
      files: getSharedItemsForView.files.length,
      avgSharedUsers: avgSharedUsers,
    };
  }, [getSharedItemsForView]);

  return (
    <BaseStorageLayout
      // Data
      folders={getSharedItemsForView.folders}
      files={getSharedItemsForView.files}
      filteredFolders={filteredFolders || []}
      filteredFiles={filteredFiles || []}
      
      // State
      viewMode={viewMode}
      selectedItems={selectedItems}
      filters={filters}
      sortConfig={sortConfig}
      hasActiveFilters={hasActiveFilters}
      
      // Callbacks
      onViewModeChange={setViewMode}
      onSearch={(query) => updateFilter("search", query)}
      onAddNew={handleSharedAddNew}
      onFilterChange={updateFilter}
      onClearFilters={clearFilters}
      onSort={handleSort}
      onItemAction={handleSharedItemAction}
      onBulkAction={handleSharedBulkAction}
      onSelectItem={toggleItemSelection}
      onSelectAll={handleSelectAll}
      onClearSelection={clearSelection}
      onFolderClick={handleFolderClick}
      
      // Info
      selectedInfo={selectedInfo}
      
      // Customization
      title="Shared Storage"
      storageType="shared"
      showProgressBar={false}
      showFolderNavigation={false}
      showBreadcrumbs={true}
      searchPlaceholder="Search Shared Items"
    />
  );
}

// Add missing useCallback import
import { useCallback } from "react";