"use client";

import { ReactNode, useMemo } from "react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, Share, Trash2 } from "lucide-react";

// Components
import { FiltersBar } from "./FiltersBar";
import { FoldersSection } from "./FoldersSection";
import { FilesSection } from "./FilesSection";
import { InfoSidebar } from "./InfoSidebar";

// Types
import { 
  FolderItem, 
  FileItem, 
  ViewMode, 
  ActionType, 
  FilterType,
  SortConfig 
} from "@/types/storage";
import { AppBreadcrumb } from "../dashboard/app-breadcrumb";

interface BaseStorageLayoutProps {
  // Data
  folders: FolderItem[];
  files: FileItem[];
  filteredFolders: FolderItem[];
  filteredFiles: FileItem[];
  
  // State
  viewMode: ViewMode;
  selectedItems: number[];
  filters: FilterType;
  sortConfig: SortConfig | null;
  hasActiveFilters: boolean;
  
  // Callbacks
  onViewModeChange: (mode: ViewMode) => void;
  onSearch: (query: string) => void;
  onAddNew: () => void;
  onFilterChange: (key: keyof FilterType, value: string) => void;
  onClearFilters: () => void;
  onSort: (key: string) => void;
  onItemAction: (id: number, action: ActionType) => void;
  onBulkAction: (action: string) => void;
  onSelectItem: (id: number) => void;
  onSelectAll: (ids: number[]) => void;
  onClearSelection: () => void;
  
  // Selected Info
  selectedInfo: {
    count: number;
    size: string;
    folders: number;
    files: number;
    items: (FolderItem | FileItem)[];
  };
  
  // Storage Info
  storageInfo: {
    total: number;
    folders: number;
    files: number;
    shared: number;
    usedPercentage?: number;
    sharedUsers?: number;
  };
  
  // Customization
  title?: string;
  headerContent?: ReactNode;
  searchPlaceholder?: string;
  storageType?: 'personal' | 'shared';
  showProgressBar?: boolean;
  renderStorageSummary?: () => ReactNode;
  renderBulkActions?: () => ReactNode;
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
  selectedInfo,
  storageInfo,
  title = "Storage",
  headerContent,
  searchPlaceholder = "Search items...",
  storageType = 'personal',
  showProgressBar = true,
  renderStorageSummary,
  renderBulkActions,
}: BaseStorageLayoutProps) {
  
  const allItemIds = useMemo(() => {
    return [...filteredFolders.map(f => f.id), ...filteredFiles.map(f => f.id)];
  }, [filteredFolders, filteredFiles]);

  const defaultBulkActions = () => (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onBulkAction("download")}
      >
        <Download className="mr-2 h-4 w-4" />
        Download Selected
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onBulkAction("share")}
      >
        <Share className="mr-2 h-4 w-4" />
        {storageType === 'shared' ? 'Update Sharing' : 'Share Selected'}
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="text-red-600"
        onClick={() => onBulkAction("delete")}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        {storageType === 'shared' ? 'Remove from Shared' : 'Delete Selected'}
      </Button>
    </div>
  );

  const defaultStorageSummary = () => (
    <Card className="mt-12">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              {storageType === 'shared' ? 'Shared Storage' : 'Total Storage'}
            </h3>
            <p className="text-2xl font-bold">{Math.round(storageInfo.total)} MB</p>
            <p className="text-sm text-muted-foreground">
              {storageType === 'shared' 
                ? 'Total shared content' 
                : `of 1024 MB (${storageInfo.usedPercentage?.toFixed(1) || 0}%)`}
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              {storageType === 'shared' ? 'Shared Folders' : 'Folders'}
            </h3>
            <p className="text-2xl font-bold">{storageInfo.folders}</p>
            <p className="text-sm text-muted-foreground">
              {folders.reduce((sum, f) => {
                const sizeNum = parseFloat(f.size.replace(/[^0-9.]/g, ''));
                return sum + (isNaN(sizeNum) ? 0 : sizeNum);
              }, 0).toFixed(1)} MB total
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              {storageType === 'shared' ? 'Shared Files' : 'Files'}
            </h3>
            <p className="text-2xl font-bold">{storageInfo.files}</p>
            <p className="text-sm text-muted-foreground">
              {files.reduce((sum, f) => {
                const sizeNum = parseFloat(f.size.replace(/[^0-9.]/g, ''));
                return sum + (isNaN(sizeNum) ? 0 : sizeNum);
              }, 0).toFixed(1)} MB total
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              {storageType === 'shared' ? 'Avg Shared With' : 'Shared Items'}
            </h3>
            <p className="text-2xl font-bold">{storageInfo.shared}</p>
            <p className="text-sm text-muted-foreground">
              {storageType === 'shared' 
                ? 'users per item' 
                : `With ${Math.max(...folders.map(f => f.sharedWith), ...files.map(f => f.sharedWith))} users`}
            </p>
          </div>
        </div>

        {showProgressBar && (
          <div className="mt-6">
            <div className="flex justify-between text-sm text-muted-foreground mb-1">
              <span>
                {storageType === 'shared' ? 'Shared:' : 'Used:'} {Math.round(storageInfo.total)} MB
              </span>
              <span>
                {storageType === 'shared' ? 'Personal:' : 'Available:'} {1024 - Math.round(storageInfo.total)} MB
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  storageType === 'shared' ? 'bg-green-600' : 'bg-blue-600'
                }`} 
                style={{ 
                  width: storageType === 'shared' 
                    ? '100%' 
                    : `${storageInfo.usedPercentage || 0}%` 
                }}
              ></div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="flex min-h-screen mx-6">
      {/* Main Content */}
      <div className="flex-1">
        <AppBreadcrumb/>
        {/* Header */}
        {headerContent ? (
          headerContent
        ) : (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
              <div className="relative w-64">
                <input
                  placeholder={searchPlaceholder}
                  className="pl-4 pr-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={filters.search || ""}
                  onChange={(e) => onSearch(e.target.value)}
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
        )}

        {/* Filters Bar */}
        <FiltersBar
          filters={filters}
          onFilterChange={onFilterChange}
          onClearFilters={onClearFilters}
          hasActiveFilters={hasActiveFilters}
          selectedCount={selectedInfo.count}
          selectedSize={selectedInfo.size}
          onAddNew={onAddNew}
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
        />

        {/* Folders Section */}
        <FoldersSection
          folders={filteredFolders}
          viewMode={viewMode}
          selectedItems={selectedItems}
          onSelectItem={onSelectItem}
          onSelectAll={() => onSelectAll(allItemIds)}
          onAction={onItemAction}
          onSort={onSort}
          sortConfig={sortConfig}
        />

        <Separator className="my-8" />

        {/* Files Section */}
        <FilesSection
          files={filteredFiles}
          viewMode={viewMode}
          selectedItems={selectedItems}
          onSelectItem={onSelectItem}
          onSelectAll={() => onSelectAll(allItemIds)}
          onAction={onItemAction}
          onSort={onSort}
          sortConfig={sortConfig}
        />

        {/* Storage Summary */}
        {renderStorageSummary ? renderStorageSummary() : defaultStorageSummary()}

        {/* Bulk Actions */}
        {selectedItems.length > 0 && (
          <Card className="mt-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedItems.length === allItemIds.length && allItemIds.length > 0}
                    onCheckedChange={() => onSelectAll(allItemIds)}
                  />
                  <span className="text-sm text-muted-foreground">
                    Select All ({selectedItems.length} selected)
                  </span>
                </div>
                {renderBulkActions ? renderBulkActions() : defaultBulkActions()}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Info Sidebar */}
      {selectedItems.length > 0 && (
        <InfoSidebar selectedInfo={selectedInfo} onClose={onClearSelection} />
      )}
    </div>
  );
}