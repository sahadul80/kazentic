"use client";

import { useState, useMemo } from "react";
import { BaseStorageLayout } from "./BaseStorageLayout";
import { useStorageData } from "@/hooks/useStorageData";
import { useStorageActions } from "@/hooks/useStorageActions";

// Hooks
import { useStorageSelection } from "@/hooks/useStorageSelection";
import { useStorageFilters } from "@/hooks/useStorageFilters";

// Mock Data
import { mockFolders, mockFiles } from "@/data/mockStorageData";

// Types
import { ViewMode } from "@/types/storage";

export function StorageView() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [folders, setFolders] = useState(mockFolders);
  const [files, setFiles] = useState(mockFiles);

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

  // Calculate total storage usage
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
    const usedPercentage = Math.min(100, (totalSize / 1024) * 100);
    
    return {
      total: totalSize,
      usedPercentage,
      folders: folders.length,
      files: files.length,
      shared: folders.filter(f => f.sharedWith > 0).length + files.filter(f => f.sharedWith > 0).length,
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
      onAddNew={handleAddNew}
      onFilterChange={updateFilter}
      onClearFilters={clearFilters}
      onSort={handleSort}
      onItemAction={handleItemAction}
      onBulkAction={(action) => handleBulkAction(action, selectedItems)}
      onSelectItem={toggleItemSelection}
      onSelectAll={selectAll}
      onClearSelection={clearSelection}
      
      // Info
      selectedInfo={selectedInfo}
      storageInfo={storageInfo}
      
      // Customization
      storageType="personal"
      showProgressBar={true}
    />
  );
}