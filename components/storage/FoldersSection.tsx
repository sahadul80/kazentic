// components/storage/FoldersSection.tsx - Updated with required onFolderClick
"use client";

import { ChevronDown, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Pagination } from "./Pagination";
import { FoldersListRow } from "./FoldersListRow";
import { EnhancedFolderItem } from "@/types/storage";
import { ViewMode, ActionType, SortConfig } from "@/types/storage";
import { useState, useEffect } from "react";
import { ActionMenu } from "./ActionMenu";

interface FoldersSectionProps {
  folders: EnhancedFolderItem[];
  viewMode: ViewMode;
  selectedItems: number[];
  onSelectItem: (id: number) => void;
  onSelectAll: (allIds: number[]) => void;
  onAction: (id: number, action: ActionType) => void;
  onFolderClick: (folderId: number) => void; // Changed to required
  onSort: (key: string) => void;
  sortConfig: SortConfig;
  itemsPerPage?: number;
  currentFolderId?: number | null;
  workspaceId?: number | null;
}

export function FoldersSection({
  folders,
  viewMode,
  selectedItems,
  onSelectItem,
  onSelectAll,
  onAction,
  onFolderClick,
  onSort,
  sortConfig,
  itemsPerPage = 8,
}: FoldersSectionProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(folders.length / itemsPerPage);
  
  const getCurrentPageFolders = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return folders.slice(startIndex, endIndex);
  };
  
  const currentPageFolders = getCurrentPageFolders();
  const allFolderIds = currentPageFolders.map(f => f.id);
  const allSelected = currentPageFolders.length > 0 && 
    currentPageFolders.every(f => selectedItems.includes(f.id));

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [folders.length, totalPages, currentPage]);

  // Grid View Card Component
  const FolderGridCard = ({ folder }: { folder: EnhancedFolderItem }) => {
    const isSelected = selectedItems.includes(folder.id);
    const folderColor = folder.color || "#3b82f6";
    
    // Calculate total items in folder
    const totalFiles = folder.fileIds?.length || 0;
    const totalChildFolders = folder.childFolderIds?.length || 0;
    const totalItems = totalFiles + totalChildFolders;
    
    return (
      <div className="relative">
        <Card 
          className="relative hover:bg-gray-50 transition-colors cursor-pointer group aspect-square rounded-sm aspect-square"
          onClick={() => onFolderClick(folder.id)}
        >
          {/* Selection Checkbox */}
          <div 
            className="absolute top-3 left-3 z-10 hidden group-hover:block"
            onClick={(e) => e.stopPropagation()}
          >
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => onSelectItem(folder.id)}
              className="h-4 w-4"
              aria-label={`Select ${folder.name}`}
            />
          </div>
          
          {/* Folder Icon with color */}
          <Folder 
            className="mx-auto h-24 w-24 mt-6" 
            style={{ color: folderColor }}
          />
          
          {/* Items count indicator */}
          <div className="absolute bottom-3 left-3">
            <div className="flex flex-col items-start">
              <span className="text-md font-medium">{totalItems}</span>
              {totalItems > 0 && (
                <div className="text-xs text-muted-foreground flex gap-1">
                  <span>{totalFiles}f</span>
                  <span>{totalChildFolders}d</span>
                </div>
              )}
            </div>
          </div>
        </Card>

        <div className="flex items-center justify-between mt-2">
          {/* Folder Name - clickable */}
          <div className="text-center flex-1">
            <h3 
              className="font-medium text-sm truncate cursor-pointer hover:text-blue-600 hover:underline"
              onClick={() => onFolderClick(folder.id)}
            >
              {folder.name}
            </h3>
          </div>
          <ActionMenu
            type="folder"
            itemId={folder.id}
            onAction={(action) => onAction(folder.id, action)}
          />
        </div>  
      </div>
    );
  };

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">Folders</h2>
        <span className="text-sm text-muted-foreground">{folders.length} items</span>
      </div>

      {viewMode === "grid" ? (
        <>
          {/* Grid View */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {currentPageFolders.length > 0 ? (
              currentPageFolders.map((folder) => (
                <FolderGridCard key={folder.id} folder={folder} />
              ))
            ) : (
              <div className="col-span-full h-40 flex items-center justify-center text-muted-foreground">
                No folders found
              </div>
            )}
          </div>
        </>
      ) : (
        /* List View */
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b bg-muted/50">
                  <TableHead className="w-[250px] px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={allSelected}
                        onCheckedChange={() => onSelectAll(allFolderIds)}
                        aria-label="Select all folders"
                        className="h-4 w-4"
                      />
                      <span className="text-sm font-medium">Name</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => onSort("name")}
                      >
                        <ChevronDown
                          className={`h-3 w-3 transition-transform ${
                            sortConfig?.key === "name" && sortConfig.direction === "ascending" ? "rotate-180" : ""
                          }`}
                        />
                      </Button>
                    </div>
                  </TableHead>
                  <TableHead className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium">Owner</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => onSort("owner")}
                      >
                        <ChevronDown
                          className={`h-3 w-3 transition-transform ${
                            sortConfig?.key === "owner" && sortConfig.direction === "ascending" ? "rotate-180" : ""
                          }`}
                        />
                      </Button>
                    </div>
                  </TableHead>
                  <TableHead className="px-4 py-3 text-sm font-medium">Shared Users</TableHead>
                  <TableHead className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium">File Size</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => onSort("size")}
                      >
                        <ChevronDown
                          className={`h-3 w-3 transition-transform ${
                            sortConfig?.key === "size" && sortConfig.direction === "ascending" ? "rotate-180" : ""
                          }`}
                        />
                      </Button>
                    </div>
                  </TableHead>
                  <TableHead className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium">Last Modified</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => onSort("lastModified")}
                      >
                        <ChevronDown
                          className={`h-3 w-3 transition-transform ${
                            sortConfig?.key === "lastModified" && sortConfig.direction === "ascending" ? "rotate-180" : ""
                          }`}
                        />
                      </Button>
                    </div>
                  </TableHead>
                  <TableHead className="px-4 py-3 text-sm font-medium">Last Opened</TableHead>
                  <TableHead className="px-4 py-3 text-sm font-medium">Inside Items</TableHead>
                  <TableHead className="px-4 py-3 text-sm font-medium">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentPageFolders.length > 0 ? (
                  currentPageFolders.map((folder) => (
                    <FoldersListRow
                      key={folder.id}
                      folder={folder}
                      isSelected={selectedItems.includes(folder.id)}
                      onSelect={onSelectItem}
                      onAction={onAction}
                      onFolderClick={onFolderClick}
                    />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                      No folders found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
      )}

      {folders.length > itemsPerPage && (
        <div className="mt-6">
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={handlePageChange} 
          />
        </div>
      )}
    </div>
  );
}