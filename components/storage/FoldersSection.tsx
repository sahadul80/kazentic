// components/storage/FoldersSection.tsx - Updated with required onFolderClick
"use client";

import { ChevronDown } from "lucide-react";
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
import { StorageFolderIcon } from "../dashboard/SVGs";

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
  itemsPerPage,
}: FoldersSectionProps) {
  itemsPerPage = viewMode === 'grid' ? 8 : 4;
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
      <div className="relative group">
        <Card 
          className="relative hover:bg-gray-50 transition-colors cursor-pointer group aspect-square rounded-sm border-fs max-h-[151px] max-w-[150px]"
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
              className="h-[16px] w-[16px]"
              aria-label={`Select ${folder.name}`}
            />
          </div>
          
          {/* Folder Icon with color */}
          <div className="flex items-center justify-around max-h-[150px] max-w-[150px]">
            <StorageFolderIcon />
          </div>
          
          {/* Items count indicator */}
          <div className="absolute bottom-3 left-3 h-[24px] w-[20px]">
              <span className="text-md font-medium">{totalItems}</span>
          </div>
        </Card> 
        <div className="flex justify-between max-w-[150px] min-h-[20px] p-[12px]">
          {/* Folder Name - clickable */}
          <div className="text-center">
            <span 
              className="text-sm truncate block max-w-[120px]"
              onClick={() => onFolderClick(folder.id)}
            >
              {folder.name}
            </span>
          </div>
          <div className="opacity-0 group-hover:cursor-pointer group-hover:opacity-100 max-w-[20px] max-h-[20px]">
            <ActionMenu
              type="folder"
              itemId={folder.id}
              onAction={(action) => onAction(folder.id, action)}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between p-[12px]">
        <h2 className="text-2xl font-semibold tracking-tight">Folders</h2>
        <span className="text-sm text-muted-foreground">{folders.length} items</span>
      </div>
      <div className="border-fs rounded-lg">
        {viewMode === "grid" ? (
          <div>
            {/* Grid View */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-[8px]">
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
          </div>
        ) : (
          /* List View */
            <div>
              <Table>
                <TableHeader>
                  <TableRow className="border-bs bg-[#F4F5F6] h-[32px]">
                    <TableHead className="w-[250px]">
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
                    <TableHead className="p-2">
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
          <div className="flex items-center justify-around p-[12px]">
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={handlePageChange} 
            />
          </div>
        )}
      </div>
    </div>
  );
}