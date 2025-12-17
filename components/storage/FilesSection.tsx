// components/storage/FilesSection.tsx - Updated to match FoldersSection structure
"use client";

import { ChevronDown, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell, TableFooter } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Pagination } from "./Pagination";
import { FilesListRow } from "./FilesListRow";
import { EnhancedFileItem } from "@/types/storage";
import { ViewMode, ActionType, SortConfig } from "@/types/storage";
import { useState, useEffect } from "react";
import { ActionMenu } from "./ActionMenu";

interface FilesSectionProps {
  files: EnhancedFileItem[];
  viewMode: ViewMode;
  selectedItems: number[];
  onSelectItem: (id: number) => void;
  onSelectAll: (allIds: number[]) => void;
  onAction: (id: number, action: ActionType) => void;
  onSort: (key: string) => void;
  sortConfig: SortConfig;
  itemsPerPage?: number;
  currentFolderId?: number | null;
  workspaceId?: number | null;
}

export function FilesSection({
  files,
  viewMode,
  selectedItems,
  onSelectItem,
  onSelectAll,
  onAction,
  onSort,
  sortConfig,
  itemsPerPage = viewMode === 'grid' ? 8 : 4,
}: FilesSectionProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(files.length / itemsPerPage);
  
  const getCurrentPageFiles = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return files.slice(startIndex, endIndex);
  };
  
  const currentPageFiles = getCurrentPageFiles();
  const allFileIds = currentPageFiles.map(f => f.id);
  const allSelected = currentPageFiles.length > 0 && 
    currentPageFiles.every(f => selectedItems.includes(f.id));

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [files.length, totalPages, currentPage]);

  // Get file icon color based on file type
  const getFileColor = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case "pdf":
        return "#ef4444"; // red
      case "doc":
      case "docx":
        return "#3b82f6"; // blue
      case "xls":
      case "xlsx":
      case "csv":
        return "#10b981"; // green
      case "ppt":
      case "pptx":
        return "#f59e0b"; // amber
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "svg":
        return "#8b5cf6"; // violet
      case "mkv":
      case "mp4":
      case "avi":
      case "mov":
        return "#ec4899"; // pink
      case "mp3":
      case "wav":
      case "aac":
        return "#06b6d4"; // cyan
      default:
        return "#6b7280"; // gray
    }
  };

  // Grid View Card Component
  const FileGridCard = ({ file }: { file: EnhancedFileItem }) => {
    const isSelected = selectedItems.includes(file.id);
    const fileColor = getFileColor(file.fileType);
    const fileType = file.fileType.toUpperCase();
    
    return (
      <div className="relative group">
        <Card 
          className="relative hover:bg-gray-50 transition-colors cursor-pointer group aspect-square rounded-sm border-fs max-h-[151px] max-w-[150px]"
          onClick={() => onAction(file.id, "open")}
        >
          {/* Selection Checkbox */}
          <div 
            className="absolute top-3 left-3 z-10 hidden group-hover:block"
            onClick={(e) => e.stopPropagation()}
          >
            <Checkbox
              checked={isSelected}
              className="h-[16px] w-[16px]"
              onCheckedChange={() => onSelectItem(file.id)}
              aria-label={`Select ${file.name}`}
            />
          </div>
          
          {/* File Icon with file type indicator */}
          <div className="flex items-center justify-around max-h-[150px] max-w-[150px]">
            <div className="relative">
              <File 
                className="mx-auto h-[70px] w-[70px]" 
                style={{ color: fileColor }}
              />
              {/* File type indicator */}
              <div 
                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white border-fs rounded-lg p-[1px] text-xs font-medium"
                style={{ borderColor: fileColor }}
              >
                {fileType}
              </div>
            </div>
            
            {/* File size indicator */}
            <div className="absolute bottom-3 left-3 h-[24px] w-auto">
              <div className="flex flex-col items-start">
                <span className="text-md font-medium">{file.size}</span>
              </div>
            </div>
          </div>
        </Card>
        <div className="flex justify-between max-w-[150px] min-h-[20px] py-[12px]">
          <span 
            className="flex items-center justify-start text-sm truncate block max-w-[130px]"
            onClick={() => onAction(file.id, "open")}
          >
            {file.name}
          </span>
          <div className="opacity-0 cursor-pointer group-hover:opacity-100 w-[20px] h-[20px]">
            <ActionMenu
              type="file"
              itemId={file.id}
              onAction={(action) => onAction(file.id, action)}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between p-[12px]">
        <h2 className="text-2xl font-semibold tracking-tight">Files</h2>
        <span className="text-sm text-muted-foreground">{files.length} items</span>
      </div>
      <div className="overflow-auto">
        {viewMode === "grid" ? (
          <div className="flex-1 items-center justify-between">
            {/* Grid View */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-[8px]">
              {currentPageFiles.length > 0 ? (
                currentPageFiles.map((file) => (
                  <FileGridCard key={file.id} file={file} />
                ))
              ) : (
                <div className="col-span-full flex items-center justify-center text-muted-foreground">
                  No files found
                </div>
              )}
            </div>
            {files.length > itemsPerPage && (
              <div className="flex items-center justify-around p-[12px]">
                <Pagination 
                  currentPage={currentPage} 
                  totalPages={totalPages} 
                  onPageChange={handlePageChange} 
                />
              </div>
            )}
          </div>
        ) : (
          /* List View */
            <div className="border-fs rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow className="border-bs bg-[#F4F5F6] h-[32px]">
                    <TableHead role="checkbox">
                      <div className="flex items-center pl-[12px] gap-[8px]">
                        <Checkbox
                          checked={allSelected}
                          onCheckedChange={() => onSelectAll(allFileIds)}
                          aria-label="Select all files"
                        />
                        <span className="text-sm font-medium">Name</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-0 hover:bg-transparent"
                          onClick={() => onSort("name")}
                        >
                          <ChevronDown
                            className={`transition-transform ${
                              sortConfig?.key === "name" && sortConfig.direction === "ascending" ? "rotate-180" : ""
                            }`}
                          />
                        </Button>
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-[8px]">
                        <span className="text-sm font-medium">Owner</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-transparent"
                          onClick={() => onSort("owner")}
                        >
                          <ChevronDown
                            className={`transition-transform ${
                              sortConfig?.key === "owner" && sortConfig.direction === "ascending" ? "rotate-180" : ""
                            }`}
                          />
                        </Button>
                      </div>
                    </TableHead>
                    <TableHead>Shared Users</TableHead>
                    <TableHead>
                      <div className="flex items-center gap-[8px]">
                        <span className="text-sm font-medium">File Size</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-transparent"
                          onClick={() => onSort("size")}
                        >
                          <ChevronDown
                            className={`transition-transform ${
                              sortConfig?.key === "size" && sortConfig.direction === "ascending" ? "rotate-180" : ""
                            }`}
                          />
                        </Button>
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-[8px]">
                        <span className="text-sm font-medium">Last Modified</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-transparent"
                          onClick={() => onSort("lastModified")}
                        >
                          <ChevronDown
                            className={`transition-transform ${
                              sortConfig?.key === "lastModified" && sortConfig.direction === "ascending" ? "rotate-180" : ""
                            }`}
                          />
                        </Button>
                      </div>
                    </TableHead>
                    <TableHead className="text-sm font-medium">Last Opened</TableHead>
                    <TableHead>
                      <div className="flex items-center gap-[8px]">
                        <span className="text-sm font-medium">File Type</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-transparent"
                          onClick={() => onSort("fileType")}
                        >
                          <ChevronDown
                            className={`transition-transform ${
                              sortConfig?.key === "fileType" && sortConfig.direction === "ascending" ? "rotate-180" : ""
                            }`}
                          />
                        </Button>
                      </div>
                    </TableHead>
                    <TableHead className="text-sm font-medium">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentPageFiles.length > 0 ? (
                    currentPageFiles.map((file) => (
                      <FilesListRow
                        key={file.id}
                        file={file}
                        isSelected={selectedItems.includes(file.id)}
                        onSelect={onSelectItem}
                        onAction={onAction}
                      />
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground">
                        No files found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              {files.length > itemsPerPage && (
                <div className="flex items-center justify-around p-[12px]">
                  <Pagination 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                    onPageChange={handlePageChange} 
                  />
                </div>
              )}
            </div>
        )}
      </div>
    </div>
  );
}