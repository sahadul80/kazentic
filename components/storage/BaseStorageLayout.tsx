"use client";

import { ReactNode, useMemo } from "react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, Share2, Trash2, Folder, Upload, FolderPlus, SearchIcon } from "lucide-react";
import { FiltersBar } from "./FiltersBar";
import { FoldersSection } from "./FoldersSection";
import { FilesSection } from "./FilesSection";

// Add this import
import { useSidebar } from "@/components/ui/sidebar";

import { 
  ViewMode, 
  ActionType, 
  FilterType,
  SortConfig,
  EnhancedFolderItem,
  EnhancedFileItem,
  SelectionInfo,
  BreadcrumbItem
} from "@/types/storage";
import { AppBreadcrumb } from "../dashboard/app-breadcrumb";
import { EmptyFolderIcon, HeaderSearchIcon } from "../dashboard/SVGs";

interface BaseStorageLayoutProps {
  folders: EnhancedFolderItem[];
  files: EnhancedFileItem[];
  filteredFolders: EnhancedFolderItem[];
  filteredFiles: EnhancedFileItem[];
  
  viewMode: ViewMode;
  selectedItems: number[];
  filters: FilterType;
  sortConfig: SortConfig | null;
  hasActiveFilters: boolean;
  
  currentFolderId?: number | null;
  currentFolder?: EnhancedFolderItem | null;
  breadcrumbs?: BreadcrumbItem[];
  
  onViewModeChange: (mode: ViewMode) => void;
  onSearch: (query: string) => void;
  onAddNew: () => void;
  onFilterChange: (key: keyof FilterType, value: string) => void;
  onClearFilters: () => void;
  onSort: (key: string) => void;
  onItemAction: (id: number, action: ActionType) => void;
  onBulkAction: (action: ActionType) => void;
  onSelectItem: (id: number) => void;
  onSelectAll: (ids: number[]) => void;
  onClearSelection: () => void;
  onFolderClick?: (folderId: number) => void;
  onGoBack?: () => void;
  onNavigateToFolder?: (folderId: number) => void;
  
  onDownload?: () => void;
  onShare?: () => void;
  onInfo?: () => void;
  onDelete?: () => void;
  
  selectedInfo: SelectionInfo;
  
  title?: string;
  headerContent?: ReactNode;
  searchPlaceholder?: string;
  storageType?: 'personal' | 'shared' | 'workspace' | 'folder' | 'trash';
  showProgressBar?: boolean;
  renderStorageSummary?: () => ReactNode;
  renderBulkActions?: () => ReactNode;
  showAddNewButton?: boolean;
  showFolderNavigation?: boolean;
  showBreadcrumbs?: boolean;
  workspaceId?: number;
}

export function BaseStorageLayout({
  folders,
  files,
  filteredFolders,
  filteredFiles,
  viewMode,
  selectedItems,
  filters,
  sortConfig,
  hasActiveFilters,
  currentFolderId,
  currentFolder,
  breadcrumbs = [{ id: 0, name: "All Folders", type: 'root' }],
  onViewModeChange,
  onSearch,
  onAddNew,
  onFilterChange,
  onClearFilters,
  onSort,
  onItemAction,
  onBulkAction,
  onSelectItem,
  onSelectAll,
  onClearSelection,
  onFolderClick,
  onGoBack,
  onNavigateToFolder,
  onDownload,
  onShare,
  onInfo,
  onDelete,
  selectedInfo,
  title = "Storage",
  headerContent,
  searchPlaceholder = "Search files and folders...",
  storageType = 'personal',
  showProgressBar = true,
  renderStorageSummary,
  renderBulkActions,
  showAddNewButton = true,
  showFolderNavigation = true,
  showBreadcrumbs = true,
  workspaceId,
}: BaseStorageLayoutProps) {
  
  // Get sidebar state
  const sidebar = useSidebar();
  const isSidebarCollapsed = sidebar.state === "collapsed";
  
  const allItemIds = useMemo(() => {
    return [...filteredFolders.map(f => f.id), ...filteredFiles.map(f => f.id)];
  }, [filteredFolders, filteredFiles]);

  // Enhanced item action handler that includes folder navigation
  const handleItemAction = (id: number, action: ActionType) => {
    if (action === "open") {
      // Check if the item is a folder that we can navigate into
      const folder = filteredFolders.find(f => f.id === id);
      if (folder && onFolderClick) {
        onFolderClick(id);
        return;
      }
    }
    onItemAction(id, action);
  };

  // Default bulk actions based on storage type
  const defaultBulkActions = () => (
    <div className="flex items-center gap-[8px]">
      <Button
        variant="outline"
        size="sm"
        onClick={onDownload}
        disabled={selectedInfo.count === 0}
      >
        <Download />
        Download Selected
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onShare}
        disabled={selectedInfo.count === 0}
      >
        <Share2 />
        {storageType === 'shared' ? 'Update Sharing' : 
         storageType === 'workspace' ? 'Share in Workspace' : 'Share Selected'}
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="text-red-600 hover:text-red-700"
        onClick={onDelete}
        disabled={selectedInfo.count === 0}
      >
        <Trash2 />
        {storageType === 'shared' ? 'Remove from Shared' : 
         storageType === 'workspace' ? 'Remove from Workspace' : 'Move to Trash'}
      </Button>
    </div>
  );

  // Calculate folder statistics for display
  const folderStats = useMemo(() => {
    if (!currentFolderId) {
      // For root, count items without parent folder
      const rootFolders = folders.filter(f => !f.parentFolderId);
      const rootFiles = files.filter(f => !f.folderId);
      const rootFoldersSize = rootFolders.reduce((sum, f) => {
        const sizeNum = parseFloat(f.size.replace(/[^0-9.]/g, ''));
        return sum + (isNaN(sizeNum) ? 0 : sizeNum);
      }, 0);
      const rootFilesSize = rootFiles.reduce((sum, f) => {
        const sizeNum = parseFloat(f.size.replace(/[^0-9.]/g, ''));
        return sum + (isNaN(sizeNum) ? 0 : sizeNum);
      }, 0);
      
      return {
        totalFolders: rootFolders.length,
        totalFiles: rootFiles.length,
        totalSize: rootFoldersSize + rootFilesSize,
      };
    }
    
    // For specific folder, count items with matching parent/folder ID
    const childFolders = folders.filter(f => f.parentFolderId === currentFolderId);
    const childFiles = files.filter(f => f.folderId === currentFolderId);
    
    const childFoldersSize = childFolders.reduce((sum, f) => {
      const sizeNum = parseFloat(f.size.replace(/[^0-9.]/g, ''));
      return sum + (isNaN(sizeNum) ? 0 : sizeNum);
    }, 0);
    const childFilesSize = childFiles.reduce((sum, f) => {
      const sizeNum = parseFloat(f.size.replace(/[^0-9.]/g, ''));
      return sum + (isNaN(sizeNum) ? 0 : sizeNum);
    }, 0);
    
    return {
      totalFolders: childFolders.length,
      totalFiles: childFiles.length,
      totalSize: childFoldersSize + childFilesSize,
    };
  }, [currentFolderId, folders, files]);

  // Default upload handlers
  const handleUploadFile = () => {
    console.log('Upload file clicked');
    // This would trigger file input
  };

  const handleUploadFolder = () => {
    console.log('Upload folder clicked');
    // This would trigger folder input
  };

  const handleCreateFolder = (folderName: string) => {
    console.log('Create folder:', folderName);
    // This would create a new folder
  };

  // Get the appropriate title based on storage type and current folder
  const getHeaderTitle = () => {
    if (currentFolder) {
      return currentFolder.name;
    }
    
    switch (storageType) {
      case 'shared':
        return 'Shared with me';
      case 'workspace':
        return workspaceId ? `Workspace ${workspaceId}` : 'Workspace Storage';
      default:
        return title;
    }
  };

  return (
    <div
      className="flex flex-col w-full"
      style={{
        minWidth: isSidebarCollapsed ? 'calc(100vw - 96px)' : 'calc(100vw - 256px)',
        maxWidth: isSidebarCollapsed ? 'calc(100vw - 96px)' : 'calc(100vw - 256px)',
        animation: "ease-in-out"
      }}  
    >
      <div className="sticky top-0 h-[36px] bg-background border-bs flex items-center justify-between px-[12px]">
        <AppBreadcrumb />
      </div>
      <div className="w-full max-h-[calc(100vh-96px)]">
        {showBreadcrumbs ? (
        <div className="flex items-center justify-between p-[12px]">
          <h1 className="text-xl font-semibold tracking-tight">{getHeaderTitle()}</h1>
          <div className="flex items-center gap-[8px]">
            {/* Search Input */}
            <div className="relative">
              <input
                placeholder={searchPlaceholder}
                className="pl-[36px] w-full rounded-lg border-fs bg-background h-[36px] text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-[#DBE9FF] disabled:cursor-not-allowed disabled:opacity-50"
                value={filters.search}
                onChange={(e) => onSearch(e.target.value)}
              />
              <SearchIcon className="absolute inset-1.5 text-[#DBE9FF]"/>
            </div>
          </div>
        </div>
        ) : (
          <div className="border-bs p-[12px]">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold tracking-tight">{getHeaderTitle()}</h1>
              
              <div className="flex items-center gap-[8px]">
                {/* Search Input */}
                <div className="relative">
                  <input
                    placeholder={searchPlaceholder}
                    className="pl-[36px] w-full rounded-lg border-fs bg-background h-[36px] text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-[#DBE9FF] disabled:cursor-not-allowed disabled:opacity-50"
                    value={filters.search}
                    onChange={(e) => onSearch(e.target.value)}
                  />
                  <SearchIcon className="absolute inset-1.5 text-[#DBE9FF]"/>
                </div>
                
                {/* Action buttons */}
                {showAddNewButton && (
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleUploadFile}
                    >
                      <Upload/>
                      Upload
                    </Button>
                    <Button
                      size="sm"
                      onClick={onAddNew}
                    >
                      <FolderPlus/>
                      New Folder
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div 
          className="flex-1 p-[12px] w-full h-full"
        >
            {/* Filters Bar */}
            <div>
              <FiltersBar
                filters={filters}
                onFilterChange={onFilterChange}
                onClearFilters={onClearFilters}
                hasActiveFilters={hasActiveFilters}
                selectedCount={selectedInfo.count}
                selectedSize={selectedInfo.size}
                viewMode={viewMode}
                onViewModeChange={onViewModeChange}
                onUploadFile={handleUploadFile}
                onUploadFolder={handleUploadFolder}
                onCreateFolder={handleCreateFolder}
                onDownload={onDownload}
                onShare={onShare}
                onInfo={onInfo}
                onDelete={onDelete}
              />
            </div>

            {/* Content Sections */}
            <div>
              {/* Folders Section */}
              {filteredFolders.length > 0 && (
                <div>
                  <FoldersSection
                    folders={filteredFolders}
                    viewMode={viewMode}
                    selectedItems={selectedItems}
                    onSelectItem={onSelectItem}
                    onSelectAll={() => onSelectAll(allItemIds)}
                    onAction={handleItemAction}
                    onFolderClick={onFolderClick || (() => {})}
                    onSort={onSort}
                    sortConfig={sortConfig}
                    currentFolderId={currentFolderId}
                    workspaceId={workspaceId}
                  />
                </div>
              )}

              {/* Files Section */}
              {filteredFiles.length > 0 && (
                <div>
                  {filteredFolders.length > 0 }
                  <FilesSection
                    files={filteredFiles}
                    viewMode={viewMode}
                    selectedItems={selectedItems}
                    onSelectItem={onSelectItem}
                    onSelectAll={() => onSelectAll(allItemIds)}
                    onAction={onItemAction}
                    onSort={onSort}
                    sortConfig={sortConfig}
                    currentFolderId={currentFolderId}
                    workspaceId={workspaceId}
                  />
                </div>
              )}

              {/* No Items Found */}
              {filteredFolders.length === 0 && filteredFiles.length === 0 && (
                <Card className="text-center border-fs w-full">
                  <div className="bg-muted rounded-full flex items-center justify-center mb-4">
                    <EmptyFolderIcon/>
                  </div>
                  <h3 className="text-lg font-medium mb-2">No items found</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    {hasActiveFilters 
                      ? "No items match your filters. Try adjusting your search or filters."
                      : storageType === 'shared'
                      ? "No shared items found. Items shared with you will appear here."
                      : storageType === 'workspace'
                      ? "This workspace is empty. Start by adding files or folders."
                      : currentFolderId
                      ? "This folder is empty. Add files or create subfolders to organize your content."
                      : "Your storage is empty. Start by uploading files or creating folders."}
                  </p>
                  {showAddNewButton && (
                    <div className="flex items-center justify-center gap-3">
                      <Button 
                        variant="outline" 
                        onClick={onAddNew}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Files
                      </Button>
                      <Button onClick={onAddNew}>
                        <FolderPlus className="mr-2 h-4 w-4" />
                        Create Folder
                      </Button>
                    </div>
                  )}
                </Card>
              )}
            </div>

            {/* Bulk Actions */}
            {selectedItems.length > 0 && (
              <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
                <Card className="border-ls shadow-lg">
                  <CardContent className="p-[12px]">
                    <div className="flex items-center justify-between min-w-[600px]">
                      <div className="flex items-center gap-4">
                        <Checkbox
                          checked={selectedItems.length === allItemIds.length && allItemIds.length > 0}
                          onCheckedChange={() => onSelectAll(allItemIds)}
                          aria-label="Select all items"
                        />
                        <div>
                          <p className="font-medium">
                            {selectedInfo.count} item{selectedInfo.count !== 1 ? 's' : ''} selected
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {selectedInfo.folders} folder{selectedInfo.folders !== 1 ? 's' : ''}, 
                            {' '}{selectedInfo.files} file{selectedInfo.files !== 1 ? 's' : ''} • 
                            {' '}Total size: {selectedInfo.size}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {renderBulkActions ? renderBulkActions() : defaultBulkActions()}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={onClearSelection}
                          className="text-muted-foreground"
                        >
                          Clear
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}