"use client";

import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Pagination } from "./Pagination";
import { FileItem } from "./FileItem";
import { FileItem as FileItemType } from "@/types/storage";
import { ViewMode, ActionType, SortConfig } from "@/types/storage";
import { useState, useEffect } from "react";

interface FilesSectionProps {
  files: FileItemType[];
  viewMode: ViewMode;
  selectedItems: number[];
  onSelectItem: (id: number) => void;
  onSelectAll: (allIds: number[]) => void;
  onAction: (id: number, action: ActionType) => void;
  onSort: (key: string) => void;
  sortConfig: SortConfig;
  itemsPerPage?: number;
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
  itemsPerPage = 4,
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
  const allSelected = currentPageFiles.length > 0 && currentPageFiles.every(f => selectedItems.includes(f.id));

  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ChevronDown className="ml-1 h-4 w-4 text-muted-foreground" />;
    }
    return (
      <ChevronDown
        className={`ml-1 h-4 w-4 transition-transform ${
          sortConfig.direction === "ascending" ? "rotate-180" : ""
        }`}
      />
    );
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [files.length, totalPages, currentPage]);

  if (viewMode === "list") {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold tracking-tight">Files</h2>
          <span className="text-sm text-muted-foreground">{files.length} items</span>
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={() => onSelectAll(allFileIds)}
                    />
                    <span>Name</span>
                  </div>
                </TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Shared Users</TableHead>
                <TableHead>File Size</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="hover:bg-transparent p-0 h-auto"
                    onClick={() => onSort("lastModified")}
                  >
                    Last Modified
                    {getSortIcon("lastModified")}
                  </Button>
                </TableHead>
                <TableHead>Last Opened</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="hover:bg-transparent p-0 h-auto"
                    onClick={() => onSort("fileType")}
                  >
                    File Type
                    {getSortIcon("fileType")}
                  </Button>
                </TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentPageFiles.map((file) => (
                <FileItem
                  key={file.id}
                  file={file}
                  isSelected={selectedItems.includes(file.id)}
                  onSelect={onSelectItem}
                  onAction={onAction}
                  viewMode="list"
                />
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Show pagination only if we have more than 4 files */}
        {files.length > itemsPerPage && (
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

  // Grid view
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold tracking-tight">Files</h2>
        <span className="text-sm text-muted-foreground">{files.length} items</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentPageFiles.map((file) => (
          <FileItem
            key={file.id}
            file={file}
            isSelected={selectedItems.includes(file.id)}
            onSelect={onSelectItem}
            onAction={onAction}
            viewMode="grid"
          />
        ))}
      </div>

      {/* Show pagination only if we have more than 4 files */}
      {files.length > itemsPerPage && (
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