"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BaseStorageLayout } from "./BaseStorageLayout";
import { InfoSidebar } from "./InfoSidebar";
import { useStorageData } from "@/hooks/useStorageData";
import { useStorageActions } from "@/hooks/useStorageActions";

// Hooks
import { useStorageSelection } from "@/hooks/useStorageSelection";
import { useStorageFilters } from "@/hooks/useStorageFilters";

// Mock Data
import { 
  mockFolders, 
  mockFiles,
  mockWorkspaces,
  getUserById 
} from "@/data/mockStorageData";

// Types
import { ViewMode, ActionType, EnhancedFileItem, EnhancedFolderItem } from "@/types/storage";

// Interfaces for localStorage data
interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  workspaceIds: number[];
}

export function StorageView() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [folders, setFolders] = useState<EnhancedFolderItem[]>(mockFolders);
  const [files, setFiles] = useState<EnhancedFileItem[]>(mockFiles);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [userWorkspaces, setUserWorkspaces] = useState(mockWorkspaces);
  const [isInfoSidebarOpen, setIsInfoSidebarOpen] = useState(false);

  // Get selectedWorkspace from localStorage
  const [selectedWorkspace, setSelectedWorkspaceState] = useState<number | null>(null);
  
  // Read from localStorage on component mount and whenever it changes
  useEffect(() => {
    const workspaceStr = localStorage.getItem('selectedWorkspace');
    if (workspaceStr) {
      const workspace = JSON.parse(workspaceStr);
      setSelectedWorkspaceState(workspace);
    } else {
      // Default to null (all workspaces)
      setSelectedWorkspaceState(null);
    }
  }, []);

  // Write to localStorage whenever selectedWorkspace changes
  const setSelectedWorkspace = useCallback((workspaceId: number | null) => {
    setSelectedWorkspaceState(workspaceId);
    localStorage.setItem('selectedWorkspace', JSON.stringify(workspaceId));
  }, []);

  // Initialize user data from localStorage
  useEffect(() => {
    const initializeUserData = () => {
      setIsLoading(true);
      try {
        // Get user data from localStorage (this would be set after login)
        const userDataStr = localStorage.getItem('userData');
        const workspaceDataStr = localStorage.getItem('workspaces');
        
        if (userDataStr) {
          const userData: UserData = JSON.parse(userDataStr);
          setCurrentUser(userData);
          
          // If we have workspace data in localStorage, use it
          if (workspaceDataStr) {
            const workspaces = JSON.parse(workspaceDataStr);
            setUserWorkspaces(workspaces);
          } else {
            // Fallback: Filter mock workspaces based on user's workspace IDs
            const userWorkspaceIds = userData.workspaceIds || [];
            const filteredWorkspaces = mockWorkspaces.filter(workspace => 
              userWorkspaceIds.includes(workspace.id)
            );
            setUserWorkspaces(filteredWorkspaces);
            
            // Store in localStorage for future use
            localStorage.setItem('workspaces', JSON.stringify(filteredWorkspaces));
          }
          
          // If selectedWorkspace is not set, set default workspace to the first one if available
          if (selectedWorkspace === null && userData.workspaceIds && userData.workspaceIds.length > 0) {
            const defaultWorkspace = userData.workspaceIds[0];
            setSelectedWorkspace(defaultWorkspace);
          }
        } else {
          // Fallback for development: Use mock user (Pat Cummins)
          const fallbackUser: UserData = {
            id: 1,
            name: "Pat Cummins",
            email: "pat@example.com",
            role: "admin",
            workspaceIds: [1, 2, 3] // All workspaces for demo
          };
          setCurrentUser(fallbackUser);
          
          // Set default workspace if not already set
          if (selectedWorkspace === null) {
            setSelectedWorkspace(1); // Default to first workspace
          }
          
          // Store in localStorage for consistency
          localStorage.setItem('userData', JSON.stringify(fallbackUser));
          localStorage.setItem('workspaces', JSON.stringify(mockWorkspaces));
        }
      } catch (error) {
        console.error("Error initializing user data:", error);
        
        // Fallback to mock data
        const fallbackUser: UserData = {
          id: 1,
          name: "Pat Cummins",
          email: "pat@example.com",
          role: "admin",
          workspaceIds: [1, 2, 3]
        };
        setCurrentUser(fallbackUser);
        
        if (selectedWorkspace === null) {
          setSelectedWorkspace(1);
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeUserData();
  }, [selectedWorkspace, setSelectedWorkspace]);

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

  // Get items based on workspace selection and user ownership
  const getItemsForView = useCallback(() => {
    if (!currentUser) return { folders: [], files: [] };

    if (selectedWorkspace === null) {
      // Show all items that belong to the user (personal items + workspace items)
      const userFolders = folders.filter(folder => {
        // Items owned by the user
        const isOwnedByUser = folder.ownerId === currentUser.id;
        
        // Items in user's workspaces
        const isInUserWorkspace = folder.workspaceId && 
          currentUser.workspaceIds.includes(folder.workspaceId);
        
        return isOwnedByUser || isInUserWorkspace;
      });
      
      const userFiles = files.filter(file => {
        const isOwnedByUser = file.ownerId === currentUser.id;
        const isInUserWorkspace = file.workspaceId && 
          currentUser.workspaceIds.includes(file.workspaceId);
        
        return isOwnedByUser || isInUserWorkspace;
      });
      
      return { folders: userFolders, files: userFiles };
    } else {
      // Show items in the selected workspace
      const workspaceFolders = folders.filter(folder => 
        folder.workspaceId === selectedWorkspace
      );
      
      const workspaceFiles = files.filter(file => 
        file.workspaceId === selectedWorkspace
      );
      
      return { folders: workspaceFolders, files: workspaceFiles };
    }
  }, [folders, files, selectedWorkspace, currentUser]);

  // Filter for items that should be visible in the current view (top-level items)
  const visibleItems = useMemo(() => {
    const items = getItemsForView();
    
    // For root view, show items without parent folder (top-level items)
    const visibleFolders = items.folders.filter(folder => !folder.parentFolderId);
    
    // For root view, show files that are directly at root level
    const visibleFiles = items.files.filter(file => {
      // Files without folderId are at root
      if (!file.folderId) return true;
      
      // If file has a folderId, check if that folder is visible at this level
      const parentFolder = items.folders.find(f => f.id === file.folderId);
      // Only show file if its parent folder is NOT in visibleFolders (meaning parent is nested)
      return !parentFolder || !visibleFolders.some(f => f.id === parentFolder.id);
    });

    return { folders: visibleFolders, files: visibleFiles };
  }, [getItemsForView]);

  // Debug log
  useEffect(() => {
    if (!isLoading) {
      console.log("Current user:", currentUser);
      console.log("User workspaces:", userWorkspaces);
      console.log("Selected workspace:", selectedWorkspace);
      console.log("Visible folders count:", visibleItems.folders.length);
      console.log("Visible files count:", visibleItems.files.length);
      console.log("Sample visible files:", visibleItems.files.slice(0, 3));
    }
  }, [visibleItems, selectedWorkspace, userWorkspaces, currentUser, isLoading]);

  // Data filtering
  const { filteredFolders = [], filteredFiles = [] } = useStorageData({
    folders: visibleItems.folders,
    files: visibleItems.files,
    filters,
    sortConfig,
  });

  // Actions
  const { handleItemAction, handleBulkAction, handleAddNew } = useStorageActions({
    setFolders,
    setFiles,
    clearSelection,
  });

  // Handle folder click
  const handleFolderClick = useCallback((folderId: number) => {
    router.push(`/storage/my/folder/${folderId}`);
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
        console.log(`Opening file: ${file.name}`);
        // TODO: Implement file preview/download
      }
    } else if (action === "delete") {
      const file = files.find(f => f.id === id);
      if (file && file.folderId) {
        router.push(`/storage/my/folder/${file.folderId}`);
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
      router.push("/storage/my");
    } else {
      router.push(`/storage/my/folder/${folderId}`);
    }
  }, [router]);

  // Handle workspace selection
  const handleWorkspaceSelect = useCallback((workspaceId: number | null) => {
    setSelectedWorkspace(workspaceId);
    clearSelection();
    setIsInfoSidebarOpen(false);
  }, [clearSelection, setSelectedWorkspace]);

  // Calculate selected info - FIXED VERSION
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

  // Handle bulk action
  const handleBulkActionWithSelection = useCallback((action: string) => {
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

  // Handle action buttons from FiltersBar
  const handleDownload = useCallback(() => {
    console.log('Downloading selected items:', selectedItems);
    // TODO: Implement download logic
  }, [selectedItems]);

  const handleShare = useCallback(() => {
    console.log('Sharing selected items:', selectedItems);
    // TODO: Implement share logic
  }, [selectedItems]);

  const handleInfo = useCallback(() => {
    setIsInfoSidebarOpen(true);
  }, []);

  const handleDelete = useCallback(() => {
    handleBulkAction('delete', selectedItems);
    setIsInfoSidebarOpen(false);
  }, [handleBulkAction, selectedItems]);

  // Create breadcrumbs
  const breadcrumbs = useMemo(() => {
    const baseBreadcrumb = [{ id: 0, name: "All Folders", type: 'root' as const }];
    
    if (selectedWorkspace) {
      const workspace = userWorkspaces.find(ws => ws.id === selectedWorkspace);
      if (workspace) {
        return [
          { id: 0, name: "All Folders", type: 'root' as const },
          { id: workspace.id, name: workspace.name, type: 'workspace' as const }
        ];
      }
    }
    
    return baseBreadcrumb;
  }, [selectedWorkspace, userWorkspaces]);

  // Create workspace selector
  const headerContent = useMemo(() => {
    if (!currentUser) return null;

    return (
      <div className="flex items-center gap-4">
        <div className="text-sm font-medium">View:</div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleWorkspaceSelect(null)}
            className={`px-3 py-1 rounded-md text-sm ${selectedWorkspace === null ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
          >
            All ({currentUser.name})
          </button>
          {userWorkspaces.map(workspace => (
            <button
              key={workspace.id}
              onClick={() => handleWorkspaceSelect(workspace.id)}
              className={`px-3 py-1 rounded-md text-sm ${selectedWorkspace === workspace.id ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
            >
              {workspace.name}
            </button>
          ))}
        </div>
      </div>
    );
  }, [selectedWorkspace, userWorkspaces, currentUser, handleWorkspaceSelect]);

  // Get title based on workspace
  const getTitle = useMemo(() => {
    if (!currentUser) return "Storage";
    
    if (selectedWorkspace) {
      const workspace = userWorkspaces.find(ws => ws.id === selectedWorkspace);
      return workspace ? `${workspace.name} Storage` : "Storage";
    }
    return `${currentUser.name}'s Storage`;
  }, [selectedWorkspace, userWorkspaces, currentUser]);

  // Handle adding new items with workspace context
  const handleAddNewWithContext = useCallback(() => {
    handleAddNew(selectedWorkspace);
  }, [handleAddNew, selectedWorkspace]);

  // If loading, show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading storage...</p>
        </div>
      </div>
    );
  }

  // If no user data, show error
  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h2>
          <p className="text-gray-600 mb-4">Please log in to access your storage.</p>
          <button
            onClick={() => router.push('/login')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative">
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
          title={getTitle}
          headerContent={headerContent}
          storageType="personal"
          showProgressBar={true}
          showFolderNavigation={false}
          showBreadcrumbs={true}
        />
        
        {/* Info Sidebar */}
        <div className="fixed inset-y-0 right-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="relative">
            <InfoSidebar
              isOpen={isInfoSidebarOpen}
              onClose={() => setIsInfoSidebarOpen(false)}
              selectedInfo={selectedInfo}
              className="pointer-events-auto"
            />
          </div>
        </div>
      </div>
    </>
  );
}