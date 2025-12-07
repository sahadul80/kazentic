"use client";

import { useState, useMemo, useCallback } from "react";
import { BaseStorageLayout } from "./BaseStorageLayout";
import { useStorageData } from "@/hooks/useStorageData";

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
  ViewMode, 
  FileItem, 
  FolderItem, 
  EnhancedFolderItem,
  EnhancedFileItem
} from "@/types/storage";

// Mock current user ID - in a real app, this would come from auth context
const CURRENT_USER_ID = 1;

export function TrashStorageView() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [folders, setFolders] = useState<EnhancedFolderItem[]>(trashedFolders as EnhancedFolderItem[]);
  const [files, setFiles] = useState<EnhancedFileItem[]>(trashedFiles as EnhancedFileItem[]);

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
    
    // Count items expiring soon
    const expiringItems = [...folders, ...files].filter(item => 
      item.trashedAt && storageManager.shouldPermanentlyDelete(item.trashedAt)
    );
    
    // Calculate average shared users (for compliance with BaseStorageLayout interface)
    const totalSharedUsers = [...folders, ...files].reduce((sum, item) => {
      return sum + (item.sharedWith || 0);
    }, 0);
    const avgSharedUsers = folders.length + files.length > 0 
      ? Math.round(totalSharedUsers / (folders.length + files.length))
      : 0;
    
    // Calculate days until oldest item is permanently deleted
    const allItems = [...folders, ...files].filter(item => item.trashedAt);
    const oldestItem = allItems.length > 0 
      ? allItems.reduce((oldest, current) => 
          new Date(current.trashedAt!) < new Date(oldest.trashedAt!) ? current : oldest
        )
      : null;
    
    const daysUntilOldestDeletion = oldestItem 
      ? storageManager.getDaysUntilPermanentDeletion(oldestItem.trashedAt!)
      : 30;
    
    return {
      total: totalSize,
      folders: folders.length,
      files: files.length,
      shared: avgSharedUsers,
      expiringItems: expiringItems.length,
      daysUntilOldestDeletion,
    };
  }, [folders, files]);

  // Event handlers
  const handleRestoreItem = useCallback((id: number) => {
    const folder = folders.find(f => f.id === id);
    const file = files.find(f => f.id === id);
    
    if (folder) {
      if (confirm(`Restore this folder from trash?`)) {
        storageManager.restoreFromTrash(id, 'folder', CURRENT_USER_ID);
        setFolders(prev => prev.filter(f => f.id !== id));
        clearSelection();
      }
    } else if (file) {
      if (confirm(`Restore this file from trash?`)) {
        storageManager.restoreFromTrash(id, 'file', CURRENT_USER_ID);
        setFiles(prev => prev.filter(f => f.id !== id));
        clearSelection();
      }
    }
  }, [folders, files, clearSelection]);

  const handlePermanentlyDeleteItem = useCallback((id: number) => {
    const folder = folders.find(f => f.id === id);
    const file = files.find(f => f.id === id);
    
    if (folder) {
      if (confirm(`Permanently delete this folder? This action cannot be undone.`)) {
        storageManager.permanentlyDelete(id, 'folder', CURRENT_USER_ID);
        setFolders(prev => prev.filter(f => f.id !== id));
        clearSelection();
      }
    } else if (file) {
      if (confirm(`Permanently delete this file? This action cannot be undone.`)) {
        storageManager.permanentlyDelete(id, 'file', CURRENT_USER_ID);
        setFiles(prev => prev.filter(f => f.id !== id));
        clearSelection();
      }
    }
  }, [folders, files, clearSelection]);

  const handleRestoreSelected = useCallback(() => {
    if (selectedItems.length === 0) return;
    
    if (confirm(`Restore ${selectedItems.length} item(s) from trash?`)) {
      const selectedFolders = folders.filter(f => selectedItems.includes(f.id));
      const selectedFiles = files.filter(f => selectedItems.includes(f.id));
      
      selectedFolders.forEach(folder => 
        storageManager.restoreFromTrash(folder.id, 'folder', CURRENT_USER_ID)
      );
      selectedFiles.forEach(file => 
        storageManager.restoreFromTrash(file.id, 'file', CURRENT_USER_ID)
      );
      
      setFolders(prev => prev.filter(f => !selectedItems.includes(f.id)));
      setFiles(prev => prev.filter(f => !selectedItems.includes(f.id)));
      clearSelection();
    }
  }, [selectedItems, folders, files, clearSelection]);

  const handlePermanentlyDeleteSelected = useCallback(() => {
    if (selectedItems.length === 0) return;
    
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
        storageManager.permanentlyDelete(folder.id, 'folder', CURRENT_USER_ID)
      );
      selectedFiles.forEach(file => 
        storageManager.permanentlyDelete(file.id, 'file', CURRENT_USER_ID)
      );
      
      setFolders(prev => prev.filter(f => !selectedItems.includes(f.id)));
      setFiles(prev => prev.filter(f => !selectedItems.includes(f.id)));
      clearSelection();
    }
  }, [selectedItems, folders, files, clearSelection]);

  const handleEmptyTrash = useCallback(() => {
    if (folders.length + files.length === 0) return;
    
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
    
    storageManager.emptyTrash(CURRENT_USER_ID);
    setFolders([]);
    setFiles([]);
    clearSelection();
  }, [folders, files, clearSelection]);

  // Custom shared action handler
  const handleTrashItemAction = useCallback((id: number, action: string) => {
    switch (action) {
      case "restore":
        handleRestoreItem(id);
        break;
      case "delete":
        handlePermanentlyDeleteItem(id);
        break;
      default:
        console.log(`Action ${action} not supported for trash`);
    }
  }, [handleRestoreItem, handlePermanentlyDeleteItem]);

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
    const stats = storageInfo as any;
    
    return (
      <div className="w-full border rounded-lg">
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
  const handleFolderClick = useCallback(() => {
    // In trash view, folder clicks might not navigate since items are trashed
    console.log("Folder click in trash view");
  }, []);

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
      
      // Callbacks
      onViewModeChange={setViewMode}
      onSearch={(query) => updateFilter("search", query)}
      onAddNew={() => {}} // Dummy function, button will be hidden
      onFilterChange={updateFilter}
      onClearFilters={clearFilters}
      onSort={handleSort}
      onItemAction={handleTrashItemAction}
      onBulkAction={handleTrashBulkAction}
      onSelectItem={toggleItemSelection}
      onSelectAll={handleSelectAll}
      onClearSelection={clearSelection}
      onFolderClick={handleFolderClick}
      
      // Info
      selectedInfo={selectedInfo}
      
      // Customization
      title="Trash"
      storageType="personal" // Using personal since trash doesn't have a specific type
      showProgressBar={false}
      searchPlaceholder="Search in Trash"
      
      // Custom components
      renderStorageSummary={renderTrashStorageSummary}
      renderBulkActions={renderTrashBulkActions}
      
      // Custom header content
      headerContent={
        <div className="mb-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Trash</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Items in trash will be automatically deleted after 30 days
              </p>
            </div>
            <div className="relative w-64">
              <input
                placeholder="Search in trash..."
                className="pl-4 pr-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={filters.search || ""}
                onChange={(e) => updateFilter("search", e.target.value)}
              />
              <svg
                className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      }
    />
  );
}