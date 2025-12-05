"use client";

import { useState, useMemo } from "react";
import { BaseStorageLayout } from "./BaseStorageLayout";
import { useStorageData } from "@/hooks/useStorageData";
import { useStorageActions } from "@/hooks/useStorageActions";

// Hooks
import { useStorageSelection } from "@/hooks/useStorageSelection";
import { useStorageFilters } from "@/hooks/useStorageFilters";

// Mock Data
import { sharedFolders, sharedFiles } from "@/data/mockStorageData";

// Types
import { ViewMode } from "@/types/storage";

export function SharedStorageView() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [folders, setFolders] = useState(sharedFolders);
  const [files, setFiles] = useState(sharedFiles);

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
  const { handleItemAction, handleBulkAction } = useStorageActions({
    setFolders,
    setFiles,
    clearSelection,
  });

  // Custom shared action handler
  const handleSharedItemAction = (id: number, action: string) => {
    if (action === "delete") {
      if (confirm("Are you sure you want to remove this item from shared?")) {
        handleItemAction(id, action);
      }
      return;
    }
    handleItemAction(id, action as any);
  };

  const handleSharedBulkAction = (action: string) => {
    if (action === "delete") {
      if (confirm(`Are you sure you want to remove ${selectedItems.length} items from shared?`)) {
        handleBulkAction(action, selectedItems);
      }
      return;
    }
    handleBulkAction(action, selectedItems);
  };

  const handleSharedAddNew = () => {
    console.log("Share new item");
    // You would implement actual share new logic here
  };

  // Calculate selected info
  const selectedInfo = useMemo(() => {
    const selectedFolders = folders.filter(f => selectedItems.includes(f.id));
    const selectedFiles = files.filter(f => selectedItems.includes(f.id));
    
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
      items: [...selectedFolders, ...selectedFiles],
    };
  }, [selectedItems, folders, files]);

  // Calculate total shared storage usage
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
    
    // Calculate average shared users
    const totalSharedUsers = [...folders, ...files].reduce((sum, item) => {
      return sum + item.sharedWith;
    }, 0);
    const avgSharedUsers = folders.length + files.length > 0 
      ? Math.round(totalSharedUsers / (folders.length + files.length))
      : 0;
    
    return {
      total: totalSize,
      folders: folders.length,
      files: files.length,
      shared: avgSharedUsers,
    };
  }, [folders, files]);

  return (
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
      onSelectAll={selectAll}
      onClearSelection={clearSelection}
      
      // Info
      selectedInfo={selectedInfo}
      storageInfo={storageInfo}
      
      // Customization
      title="Shared Storage"
      storageType="shared"
      showProgressBar={false}
      searchPlaceholder="Search Shared Items"
    />
  );
}