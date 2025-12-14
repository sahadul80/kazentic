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
  trashedFolders, 
  trashedFiles, 
  storageManager 
} from "@/data/mockStorageData";

// Types
import { 
  ViewMode, ActionType,
  EnhancedFolderItem,
  EnhancedFileItem
} from "@/types/storage";

// Interface for user data
interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  workspaceIds: number[];
}

export function TrashStorageView() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [folders, setFolders] = useState<EnhancedFolderItem[]>([]);
  const [files, setFiles] = useState<EnhancedFileItem[]>([]);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize user data from localStorage
  useEffect(() => {
    const initializeUserData = () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Get user data from localStorage (this would be set after login)
        const userDataStr = localStorage.getItem('currentUser') || 
                           sessionStorage.getItem('currentUser');
        
        if (!userDataStr) {
          setError("Please log in to access trash.");
          setIsLoading(false);
          return;
        }

        const userData: UserData = JSON.parse(userDataStr);
        setCurrentUser(userData);
        
        // Load trash items for the current user
        const userId = userData.id;
        
        // Filter trash items for current user
        const userTrashFolders = trashedFolders.filter(folder => {
          // In a real app, you would filter by userId
          return true; // For demo, show all trash items
        });
        
        const userTrashFiles = trashedFiles.filter(file => {
          // In a real app, you would filter by userId
          return true; // For demo, show all trash items
        });

        // For root view, show only top-level items
        const topLevelFolders = userTrashFolders.filter(folder => !folder.parentFolderId);
        
        const topLevelFiles = userTrashFiles.filter(file => {
          // Files without folderId are at root
          if (!file.folderId) return true;
          
          // Check if parent folder is in trash folders
          const parentFolder = userTrashFolders.find(f => f.id === file.folderId);
          // Only show file if its parent folder is NOT in topLevelFolders
          return !parentFolder || !topLevelFolders.some(f => f.id === parentFolder.id);
        });

        setFolders(topLevelFolders);
        setFiles(topLevelFiles);
        
      } catch (error) {
        console.error("Error loading trash items:", error);
        setError("Failed to load trash items. Please try refreshing the page.");
        
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
  const { filteredFolders: baseFilteredFolders, filteredFiles: baseFilteredFiles } = useStorageData({
    folders: folders as EnhancedFolderItem[],
    files: files as EnhancedFileItem[],
    filters,
    sortConfig,
  });

  // Apply trash-specific sorting (by deletion date)
  const filteredFolders = useMemo(() => {
    const baseFolders = baseFilteredFolders as unknown as EnhancedFolderItem[];
    return [...baseFolders].sort((a, b) => {
      if (!a.trashedAt || !b.trashedAt) return 0;
      const aDaysLeft = storageManager.getDaysUntilPermanentDeletion(a.trashedAt);
      const bDaysLeft = storageManager.getDaysUntilPermanentDeletion(b.trashedAt);
      return aDaysLeft - bDaysLeft;
    });
  }, [baseFilteredFolders]);

  const filteredFiles = useMemo(() => {
    const baseFiles = baseFilteredFiles as unknown as EnhancedFileItem[];
    return [...baseFiles].sort((a, b) => {
      if (!a.trashedAt || !b.trashedAt) return 0;
      const aDaysLeft = storageManager.getDaysUntilPermanentDeletion(a.trashedAt);
      const bDaysLeft = storageManager.getDaysUntilPermanentDeletion(b.trashedAt);
      return aDaysLeft - bDaysLeft;
    });
  }, [baseFilteredFiles]);

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
    
    return {
      count: selectedItems.length,
      size: `${Math.round(totalSize)}MB`,
      folders: selectedFolders.length,
      files: selectedFiles.length,
      items: selectedAllItems,
      totalSizeMB: totalSize,
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

  // Calculate trash statistics
  const storageInfo = useMemo(() => {
    const totalFoldersSize = folders.reduce((sum, folder) => {
      const sizeNum = parseFloat(folder.size.replace(/[^0-9.]/g, ''));
      return sum + (isNaN(sizeNum) ? 0 : sizeNum);
    }, 0);
    
    const totalFilesSize = files.reduce((sum, file) => {
      const sizeNum = parseFloat(file.size.replace(/[^0-9.]/g, ''));
      return sum + (isNaN(sizeNum) ? 0 : sizeNum);
    }, 0);
    
    const totalSize = totalFoldersSize + totalFilesSize;
    
    // Count items expiring soon (within 7 days)
    const expiringItems = [...folders, ...files].filter(item => 
      item.trashedAt && storageManager.getDaysUntilPermanentDeletion(item.trashedAt) <= 7
    );
    
    // Calculate days until oldest item is permanently deleted
    const allItems = [...folders, ...files].filter(item => item.trashedAt);
    const oldestItem = allItems.length > 0 
      ? allItems.reduce((oldest, current) => {
          const oldestDate = new Date(oldest.trashedAt!);
          const currentDate = new Date(current.trashedAt!);
          return currentDate < oldestDate ? current : oldest;
        })
      : null;
    
    const daysUntilOldestDeletion = oldestItem 
      ? storageManager.getDaysUntilPermanentDeletion(oldestItem.trashedAt!)
      : 30;
    
    return {
      total: totalSize,
      folders: folders.length,
      files: files.length,
      expiringItems: expiringItems.length,
      daysUntilOldestDeletion,
    };
  }, [folders, files]);

  // Event handlers
  const handleRestoreItem = useCallback((id: number) => {
    const folder = folders.find(f => f.id === id);
    const file = files.find(f => f.id === id);
    const userId = currentUser?.id;
    
    if (!userId) {
      setError("User not authenticated. Please log in again.");
      return;
    }
    
    if (folder) {
      if (confirm(`Restore this folder from trash?`)) {
        storageManager.restoreFromTrash(id, 'folder', userId);
        setFolders(prev => prev.filter(f => f.id !== id));
        clearSelection();
      }
    } else if (file) {
      if (confirm(`Restore this file from trash?`)) {
        storageManager.restoreFromTrash(id, 'file', userId);
        setFiles(prev => prev.filter(f => f.id !== id));
        clearSelection();
      }
    }
  }, [folders, files, clearSelection, currentUser]);

  const handlePermanentlyDeleteItem = useCallback((id: number) => {
    const folder = folders.find(f => f.id === id);
    const file = files.find(f => f.id === id);
    const userId = currentUser?.id;
    
    if (!userId) {
      setError("User not authenticated. Please log in again.");
      return;
    }
    
    if (folder) {
      if (confirm(`Permanently delete this folder? This action cannot be undone.`)) {
        storageManager.permanentlyDelete(id, 'folder', userId);
        setFolders(prev => prev.filter(f => f.id !== id));
        clearSelection();
      }
    } else if (file) {
      if (confirm(`Permanently delete this file? This action cannot be undone.`)) {
        storageManager.permanentlyDelete(id, 'file', userId);
        setFiles(prev => prev.filter(f => f.id !== id));
        clearSelection();
      }
    }
  }, [folders, files, clearSelection, currentUser]);

  const handleRestoreSelected = useCallback(() => {
    if (selectedItems.length === 0) return;
    
    const userId = currentUser?.id;
    
    if (!userId) {
      setError("User not authenticated. Please log in again.");
      return;
    }
    
    if (confirm(`Restore ${selectedItems.length} item(s) from trash?`)) {
      const selectedFolders = folders.filter(f => selectedItems.includes(f.id));
      const selectedFiles = files.filter(f => selectedItems.includes(f.id));
      
      selectedFolders.forEach(folder => 
        storageManager.restoreFromTrash(folder.id, 'folder', userId)
      );
      selectedFiles.forEach(file => 
        storageManager.restoreFromTrash(file.id, 'file', userId)
      );
      
      setFolders(prev => prev.filter(f => !selectedItems.includes(f.id)));
      setFiles(prev => prev.filter(f => !selectedItems.includes(f.id)));
      clearSelection();
    }
  }, [selectedItems, folders, files, clearSelection, currentUser]);

  const handlePermanentlyDeleteSelected = useCallback(() => {
    if (selectedItems.length === 0) return;
    
    const userId = currentUser?.id;
    
    if (!userId) {
      setError("User not authenticated. Please log in again.");
      return;
    }
    
    const expiringItems = [...folders, ...files]
      .filter(item => selectedItems.includes(item.id))
      .filter(item => item.trashedAt && storageManager.shouldPermanentlyDelete(item.trashedAt));
    
    const hasExpiringItems = expiringItems.length > 0;
    
    if (hasExpiringItems) {
      alert(`Some items are already eligible for permanent deletion and will be removed immediately.`);
    }
    
    if (confirm(`Permanently delete ${selectedItems.length} item(s)? This action cannot be undone.`)) {
      const selectedFolders = folders.filter(f => selectedItems.includes(f.id));
      const selectedFiles = files.filter(f => selectedItems.includes(f.id));
      
      selectedFolders.forEach(folder => 
        storageManager.permanentlyDelete(folder.id, 'folder', userId)
      );
      selectedFiles.forEach(file => 
        storageManager.permanentlyDelete(file.id, 'file', userId)
      );
      
      setFolders(prev => prev.filter(f => !selectedItems.includes(f.id)));
      setFiles(prev => prev.filter(f => !selectedItems.includes(f.id)));
      clearSelection();
    }
  }, [selectedItems, folders, files, clearSelection, currentUser]);

  const handleEmptyTrash = useCallback(() => {
    if (folders.length + files.length === 0) return;
    
    const userId = currentUser?.id;
    
    if (!userId) {
      setError("User not authenticated. Please log in again.");
      return;
    }
    
    const expiringItems = [...folders, ...files].filter(item => 
      item.trashedAt && storageManager.shouldPermanentlyDelete(item.trashedAt)
    );
    
    if (expiringItems.length < folders.length + files.length) {
      if (!confirm(`Some items in trash haven't reached the 30-day limit yet. Empty trash anyway?`)) {
        return;
      }
    } else {
      if (!confirm(`Empty trash? This will permanently delete all items.`)) {
        return;
      }
    }
    
    storageManager.emptyTrash(userId);
    setFolders([]);
    setFiles([]);
    clearSelection();
  }, [folders, files, clearSelection, currentUser]);

  // Custom bulk action handler
  const handleTrashBulkAction = useCallback((action: string) => {
    switch (action) {
      case "restore":
        handleRestoreSelected();
        break;
      case "delete":
        handlePermanentlyDeleteSelected();
        break;
      default:
        console.log(`Bulk action ${action} not supported for trash`);
    }
  }, [handleRestoreSelected, handlePermanentlyDeleteSelected]);

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

  // Custom storage summary for trash
  const renderTrashStorageSummary = () => {
    const stats = storageInfo;
    
    return (
      <div className="w-full border rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Items in Trash</h3>
            <p className="text-2xl font-bold">{folders.length + files.length}</p>
            <p className="text-sm text-muted-foreground">
              {Math.round(stats.total)} MB total
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Folders</h3>
            <p className="text-2xl font-bold">{stats.folders}</p>
            <p className="text-sm text-muted-foreground">
              {folders.reduce((sum, f) => {
                const sizeNum = parseFloat(f.size.replace(/[^0-9.]/g, ''));
                return sum + (isNaN(sizeNum) ? 0 : sizeNum);
              }, 0).toFixed(1)} MB
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Files</h3>
            <p className="text-2xl font-bold">{stats.files}</p>
            <p className="text-sm text-muted-foreground">
              {files.reduce((sum, f) => {
                const sizeNum = parseFloat(f.size.replace(/[^0-9.]/g, ''));
                return sum + (isNaN(sizeNum) ? 0 : sizeNum);
              }, 0).toFixed(1)} MB
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Expiring Soon</h3>
            <p className="text-2xl font-bold text-red-600">{stats.expiringItems}</p>
            <p className="text-sm text-muted-foreground">
              {stats.daysUntilOldestDeletion <= 0 
                ? "Will be deleted soon" 
                : `Oldest expires in ${stats.daysUntilOldestDeletion} days`}
            </p>
          </div>
        </div>

        {/* Empty Trash Button */}
        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Items are automatically deleted after 30 days in trash
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2"
            onClick={handleEmptyTrash}
            disabled={folders.length + files.length === 0}
          >
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Empty Trash
          </button>
        </div>
      </div>
    );
  };

  // Handle folder click
  const handleFolderClick = useCallback((folderId: number) => {
    router.push(`/storage/trash/folder/${folderId}`);
  }, [router]);

  // Actions
  const { handleItemAction } = useStorageActions({
    setFolders,
    setFiles,
    clearSelection,
  });

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
        console.log(`Opening file: ${file.name}`);
        // TODO: Implement file preview/download
      }
    } else if (action === "delete") {
      const file = files.find(f => f.id === id);
      if (file && file.folderId) {
        router.push(`/storage/trash/folder/${file.folderId}`);
      }
      handleItemAction(id, action);
    } else {
      handleItemAction(id, action);
    }
  }, [folders, files, handleFolderClick, handleItemAction, router]);

  // Handle navigation
  const handleNavigateToFolder = useCallback((folderId: number) => {
    if (folderId === 0) {
      router.push("/storage/trash");
    } else {
      router.push(`/storage/trash/folder/${folderId}`);
    }
  }, [router]);

  // Handle going back
  const handleGoBack = useCallback(() => {
    router.back();
  }, [router]);

  // Handle action buttons
  const handleDownload = useCallback(() => {
    console.log('Downloading selected items from trash:', selectedItems);
  }, [selectedItems]);

  const handleShare = useCallback(() => {
    console.log('Sharing selected items from trash:', selectedItems);
  }, [selectedItems]);

  const handleInfo = useCallback(() => {
    console.log('Info for selected items from trash:', selectedItems);
  }, [selectedItems]);

  // If loading, show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading trash...</p>
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
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Trash</h2>
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
          <p className="text-gray-600 mb-6">Please log in to access trash.</p>
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
      folders={folders as EnhancedFolderItem[]}
      files={files as EnhancedFileItem[]}
      filteredFolders={filteredFolders as EnhancedFolderItem[]}
      filteredFiles={filteredFiles as EnhancedFileItem[]}
      
      // State
      viewMode={viewMode}
      selectedItems={selectedItems}
      filters={filters}
      sortConfig={sortConfig}
      hasActiveFilters={hasActiveFilters}
      
      // Folder Navigation
      currentFolderId={null}
      currentFolder={null}
      breadcrumbs={[{ id: 0, name: "Trash", type: 'root' }]}
      
      // Callbacks
      onViewModeChange={setViewMode}
      onSearch={(query) => updateFilter("search", query)}
      onAddNew={() => {}} // Dummy function, button will be hidden
      onFilterChange={updateFilter}
      onClearFilters={clearFilters}
      onSort={handleSort}
      onItemAction={handleItemActionWithNavigation}
      onBulkAction={handleTrashBulkAction}
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
      onDelete={handlePermanentlyDeleteSelected}
      
      // Info
      selectedInfo={selectedInfo}
      
      // Customization
      title="Trash"
      storageType="personal"
      showProgressBar={false}
      showFolderNavigation={false}
      showBreadcrumbs={true}
      showAddNewButton={false}
      searchPlaceholder="Search in Trash..."
      
      // Custom components
      renderStorageSummary={renderTrashStorageSummary}
      renderBulkActions={renderTrashBulkActions}
    />
  );
}