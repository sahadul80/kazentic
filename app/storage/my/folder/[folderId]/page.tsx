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
  getChildFolders 
} from "@/data/mockStorageData";
import { 
  ViewMode, 
  ActionType 
} from "@/types/storage";

export default function FolderPage() {
  const router = useRouter();
  const params = useParams();
  const folderId = parseInt(params.folderId as string);
  
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [folders, setFolders] = useState(mockFolders);
  const [files, setFiles] = useState(mockFiles);
  const [breadcrumbs, setBreadcrumbs] = useState<Array<{ id: number; name: string }>>([]);
  const [currentFolder, setCurrentFolder] = useState<any>(null);

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

  // Load current folder data
  useEffect(() => {
    const folder = mockFolders.find(f => f.id === folderId);
    if (folder) {
      setCurrentFolder(folder);
      
      // Generate breadcrumbs
      const newBreadcrumbs: Array<{ id: number; name: string }> = [];
      let current: any = folder;
      
      // Build breadcrumbs from current folder to root
      const breadcrumbPath: Array<{ id: number; name: string }> = [];
      while (current) {
        breadcrumbPath.unshift({ id: current.id, name: current.name });
        if (current.parentFolderId) {
          current = mockFolders.find(f => f.id === current.parentFolderId);
        } else {
          current = null;
        }
      }
      
      // Add "All Folders" at the beginning
      setBreadcrumbs([{ id: 0, name: "All Folders" }, ...breadcrumbPath]);
    } else {
      // Folder not found, redirect to storage
      router.push("/storage/my");
    }
  }, [folderId, router]);

  // Get items in current folder
  const folderItems = useMemo(() => {
    if (!folderId) return { folders: [], files: [] };
    
    // Get child folders
    const childFolders = getChildFolders(folderId);
    
    // Get files in folder
    const folderFiles = getFilesInFolder(folderId);
    
    return {
      folders: childFolders,
      files: folderFiles
    };
  }, [folderId]);

  // Data filtering
  const { filteredFolders, filteredFiles } = useStorageData({
    folders: folderItems.folders,
    files: folderItems.files,
    filters,
    sortConfig,
  });

  // Actions
  const { handleItemAction, handleBulkAction, handleAddNew } = useStorageActions({
    setFolders,
    setFiles,
    clearSelection,
  });

  // Handle folder click - navigate to subfolder
  const handleFolderClick = (subFolderId: number) => {
    router.push(`/storage/my/folder/${subFolderId}`);
  };

  // Handle going back
  const handleGoBack = () => {
    if (currentFolder?.parentFolderId) {
      router.push(`/storage/my/folder/${currentFolder.parentFolderId}`);
    } else {
      router.push("/storage/my");
    }
  };

  // Handle breadcrumb navigation
  const handleNavigateToFolder = (crumbFolderId: number) => {
    if (crumbFolderId === 0) {
      router.push("/storage/my");
    } else {
      router.push(`/storage/my/folder/${crumbFolderId}`);
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
    const allItems = [...folderItems.folders, ...folderItems.files];
    const selectedFolders = folderItems.folders.filter(f => selectedItems.includes(f.id));
    const selectedFiles = folderItems.files.filter(f => selectedItems.includes(f.id));
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
  }, [selectedItems, folderItems]);

  // Calculate folder statistics
  const folderStats = useMemo(() => {
    return {
      totalFolders: folderItems.folders.length,
      totalFiles: folderItems.files.length,
    };
  }, [folderItems]);

  return (
    <div className="flex flex-col max-w-6xl mx-auto">
      <BaseStorageLayout
        // Data
        folders={filteredFolders}
        files={filteredFiles}
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
        onSelectAll={selectAll}
        onClearSelection={clearSelection}
        onFolderClick={handleFolderClick}
        onGoBack={handleGoBack}
        onNavigateToFolder={handleNavigateToFolder}
        
        // Info
        selectedInfo={selectedInfo}
        
        // Customization
        storageType="folder"
        showProgressBar={false}
        showFolderNavigation={true}
        showBreadcrumbs={true}
      />
    </div>
  );
}