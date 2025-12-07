// components/storage/BaseStorageLayout.tsx
"use client";

import { ReactNode, useMemo } from "react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, Share2, Trash2, Plus, Search, Folder, ChevronLeft, Home, Upload, FolderPlus, LucideMessageCircleQuestionMark } from "lucide-react";

// Components
import { FiltersBar } from "./FiltersBar";
import { FoldersSection } from "./FoldersSection";
import { FilesSection } from "./FilesSection";

// Types
import { 
  ViewMode, 
  ActionType, 
  FilterType,
  SortConfig,
  EnhancedFolderItem,
  EnhancedFileItem,
  SelectionInfo,
  StorageAnalytics,
  BreadcrumbItem
} from "@/types/storage";
import { AppBreadcrumb } from "../dashboard/app-breadcrumb";

interface BaseStorageLayoutProps {
  // Data
  folders: EnhancedFolderItem[];
  files: EnhancedFileItem[];
  filteredFolders: EnhancedFolderItem[];
  filteredFiles: EnhancedFileItem[];
  
  // State
  viewMode: ViewMode;
  selectedItems: number[];
  filters: FilterType;
  sortConfig: SortConfig | null;
  hasActiveFilters: boolean;
  
  // Folder Navigation
  currentFolderId?: number | null;
  currentFolder?: EnhancedFolderItem | null;
  breadcrumbs?: BreadcrumbItem[];
  
  // Callbacks
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
  
  // Action button handlers
  onDownload?: () => void;
  onShare?: () => void;
  onInfo?: () => void;
  onDelete?: () => void;
  
  // Info
  selectedInfo: SelectionInfo;
  
  // Customization
  title?: string;
  headerContent?: ReactNode;
  searchPlaceholder?: string;
  storageType?: 'personal' | 'shared' | 'workspace' | 'folder';
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
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onDownload}
        disabled={selectedInfo.count === 0}
      >
        <Download className="mr-2 h-4 w-4" />
        Download Selected
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onShare}
        disabled={selectedInfo.count === 0}
      >
        <Share2 className="mr-2 h-4 w-4" />
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
        <Trash2 className="mr-2 h-4 w-4" />
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

  return (
    <div className="px-10 flex flex-col h-full bg-background">
      {/* Sticky Top Bar with Breadcrumb */}
      <div className="sticky top-0 mx-auto min-w-[1184px] bg-background z-50 border-b">
        <div className="h-[38px] flex items-center justify-between">
          <div className="flex items-center gap-4">
            {showBreadcrumbs && (
              <AppBreadcrumb />
            )}
          </div>
          <LucideMessageCircleQuestionMark/>
        </div>
      </div>

      {/* Current Folder Info */}
      {currentFolder && showFolderNavigation && (
        <div className="bg-muted/30 border-b">
          <div className="px-6 py-4">
            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${currentFolder.color}20` }}
              >
                <Folder 
                  className="h-6 w-6" 
                  style={{ color: currentFolder.color }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg truncate">{currentFolder.name}</h3>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span>Owner: {currentFolder.owner}</span>
                  <span>•</span>
                  <span>Modified: {currentFolder.lastModified}</span>
                  {currentFolder.tags && currentFolder.tags.length > 0 && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        {currentFolder.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="px-1.5 py-0.5 bg-muted rounded text-xs">
                            {tag}
                          </span>
                        ))}
                        {currentFolder.tags.length > 2 && (
                          <span className="text-xs">+{currentFolder.tags.length - 2}</span>
                        )}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div className="text-center">
                  <div className="font-semibold">{folderStats.totalFolders}</div>
                  <div className="text-muted-foreground text-xs">Folders</div>
                </div>
                <Separator orientation="vertical" className="h-8" />
                <div className="text-center">
                  <div className="font-semibold">{folderStats.totalFiles}</div>
                  <div className="text-muted-foreground text-xs">Files</div>
                </div>
                <Separator orientation="vertical" className="h-8" />
                <div className="text-center">
                  <div className="font-semibold">
                    {Math.round(folderStats.totalSize)} MB
                  </div>
                  <div className="text-muted-foreground text-xs">Size</div>
                </div>
                <Separator orientation="vertical" className="h-8" />
                <div className="text-center">
                  <div className="font-semibold">{currentFolder.sharedWith || 0}</div>
                  <div className="text-muted-foreground text-xs">Shared</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">

          {/* Filters Bar */}
          <div className="mt-6">
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
          <div className="mt-6 space-y-8">
            {/* Folders Section */}
            {filteredFolders.length > 0 && (
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
            )}

            {/* Files Section */}
            {filteredFiles.length > 0 && (
              <>
                {filteredFolders.length > 0 && <Separator />}
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
              </>
            )}

            {/* No Items Found */}
            {filteredFolders.length === 0 && filteredFiles.length === 0 && (
              <Card className="p-12 text-center border-dashed">
                <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Folder className="h-8 w-8 text-muted-foreground" />
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
              <Card className="border-l-4 border-l-primary shadow-lg">
                <CardContent className="p-4">
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