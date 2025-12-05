"use client";

import { ChevronDown, MoreVertical, Save, Edit2, Share2, Copy, Info, FolderOpen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Pagination } from "./Pagination";
import { FolderItem as FolderItemType } from "@/types/storage";
import { ViewMode, ActionType, SortConfig } from "@/types/storage";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FoldersSectionProps {
  folders: FolderItemType[];
  viewMode: ViewMode;
  selectedItems: number[];
  onSelectItem: (id: number) => void;
  onSelectAll: (allIds: number[]) => void;
  onAction: (id: number, action: ActionType) => void;
  onSort: (key: string) => void;
  sortConfig: SortConfig;
  itemsPerPage?: number;
}

export function FoldersSection({
  folders,
  viewMode,
  selectedItems,
  onSelectItem,
  onSelectAll,
  onAction,
  onSort,
  sortConfig,
  itemsPerPage = 4,
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
  const allSelected = currentPageFolders.length > 0 && currentPageFolders.every(f => selectedItems.includes(f.id));

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
  }, [folders.length, totalPages, currentPage]);

  // Action menu items with icons from screenshot
  const actionItems = [
    { icon: <Save className="h-4 w-4" />, label: "Save as", action: "save-as" as ActionType },
    { icon: <Edit2 className="h-4 w-4" />, label: "Rename", action: "rename" as ActionType },
    { icon: <Share2 className="h-4 w-4" />, label: "Share", action: "share" as ActionType },
    { icon: <Copy className="h-4 w-4" />, label: "Copy", action: "copy" as ActionType },
    { icon: <Info className="h-4 w-4" />, label: "Info", action: "info" as ActionType },
    { icon: <FolderOpen className="h-4 w-4" />, label: "Move", action: "move" as ActionType },
    { icon: <Trash2 className="h-4 w-4" />, label: "Move to trash", action: "delete" as ActionType, destructive: true },
  ];

  if (viewMode === "list") {
    return (
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold tracking-tight">Folders</h2>
          <span className="text-sm text-muted-foreground">{folders.length} items</span>
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={() => onSelectAll(allFolderIds)}
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
                <TableHead>Inside Files</TableHead>
                <TableHead className="w-[80px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentPageFolders.map((folder) => (
                <TableRow key={folder.id} className="h-[60px]">
                  <TableCell className="w-[300px]">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={selectedItems.includes(folder.id)}
                        onCheckedChange={() => onSelectItem(folder.id)}
                      />
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                          </svg>
                        </div>
                        <span className="font-medium">{folder.name}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs">
                        PC
                      </div>
                      <span>{folder.owner}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex -space-x-2">
                      {folder.sharedWith > 0 ? (
                        Array.from({ length: Math.min(folder.sharedWith, 3) }).map((_, i) => (
                          <div key={i} className="w-6 h-6 bg-gray-300 rounded-full border-2 border-white"></div>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500">None</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{folder.size}</TableCell>
                  <TableCell>{folder.lastModified}</TableCell>
                  <TableCell>{folder.lastOpened}</TableCell>
                  <TableCell>{folder.filesInside}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        {actionItems.map((item, index) => (
                          <div key={item.action}>
                            {/* Add separator before "Move to trash" (index 6) */}
                            {index === 6 && <DropdownMenuSeparator />}
                            <DropdownMenuItem
                              onClick={() => onAction(folder.id, item.action)}
                              className={`${item.destructive ? "text-red-600" : ""} ${index === 5 ? "border-b border-gray-200 pb-2 mb-2" : ""}`}
                            >
                              {item.icon}
                              <span className="ml-2">{item.label}</span>
                            </DropdownMenuItem>
                          </div>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Show pagination only if we have more than 4 folders */}
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

  // Grid view
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold tracking-tight">Folders</h2>
        <span className="text-sm text-muted-foreground">{folders.length} items</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentPageFolders.map((folder) => (
          <Card key={folder.id} className="p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                </svg>
              </div>
              <Checkbox
                checked={selectedItems.includes(folder.id)}
                onCheckedChange={() => onSelectItem(folder.id)}
              />
            </div>
            <h3 className="font-medium text-sm mb-1">{folder.name}</h3>
            <p className="text-xs text-gray-500 mb-2">{folder.filesInside} files</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{folder.size}</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {actionItems.map((item, index) => (
                    <div key={item.action}>
                      {index === 6 && <DropdownMenuSeparator />}
                      <DropdownMenuItem
                        onClick={() => onAction(folder.id, item.action)}
                        className={`${item.destructive ? "text-red-600" : ""} ${index === 5 ? "border-b border-gray-200 pb-2 mb-2" : ""}`}
                      >
                        {item.icon}
                        <span className="ml-2">{item.label}</span>
                      </DropdownMenuItem>
                    </div>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Card>
        ))}
      </div>

      {/* Show pagination only if we have more than 4 folders */}
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