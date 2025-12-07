// components/storage/FiltersBar.tsx - Updated with action buttons
"use client";

import { Grid, List, Info, Download, Share2, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FilterType, ViewMode } from "@/types/storage";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FolderPlus, FileUp, Folder } from "lucide-react";

interface FiltersBarProps {
  filters: FilterType;
  onFilterChange: (key: keyof FilterType, value: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  selectedCount?: number;
  selectedSize?: string;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onUploadFile?: () => void;
  onUploadFolder?: () => void;
  onCreateFolder?: (folderName: string) => void;
  onDownload?: () => void;
  onShare?: () => void;
  onInfo?: () => void;
  onDelete?: () => void;
}

export function FiltersBar({
  filters,
  onFilterChange,
  onClearFilters,
  hasActiveFilters,
  selectedCount = 0,
  selectedSize = "0 MB",
  viewMode,
  onViewModeChange,
  onUploadFile,
  onUploadFolder,
  onCreateFolder,
  onDownload,
  onShare,
  onInfo,
  onDelete,
}: FiltersBarProps) {
  const [isAddNewModalOpen, setIsAddNewModalOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [activeTab, setActiveTab] = useState<"upload" | "new-folder">("upload");

  // Check if any filter is active (excluding search)
  const isFilterActive = 
    filters.category !== 'all' || 
    filters.lastModified !== 'all' || 
    filters.dateAdded !== 'all' || 
    filters.people !== 'all';

  const handleCreateFolder = () => {
    if (folderName.trim() && onCreateFolder) {
      onCreateFolder(folderName.trim());
      setFolderName("");
      setIsAddNewModalOpen(false);
    }
  };

  const handleUploadFile = () => {
    if (onUploadFile) {
      onUploadFile();
      setIsAddNewModalOpen(false);
    }
  };

  const handleUploadFolder = () => {
    if (onUploadFolder) {
      onUploadFolder();
      setIsAddNewModalOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && folderName.trim() && activeTab === "new-folder") {
      handleCreateFolder();
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        {/* Left side: Filter dropdowns (only show when no items are selected) */}
        {selectedCount === 0 && (
          <div className="flex flex-wrap items-center gap-4">
            <Select
              value={filters.category || "all"}
              onValueChange={(value) => onFilterChange("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="folders">Folders</SelectItem>
                <SelectItem value="documents">Documents</SelectItem>
                <SelectItem value="images">Images</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
                <SelectItem value="pdfs">PDFs</SelectItem>
                <SelectItem value="presentations">Presentations</SelectItem>
                <SelectItem value="spreadsheets">Spreadsheets</SelectItem>
                <SelectItem value="others">Others</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.lastModified || "all"}
              onValueChange={(value) => onFilterChange("lastModified", value)}
            >
              <SelectTrigger className="w-40 h-9">
                <SelectValue placeholder="Last Modified" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
                <SelectItem value="older">Older</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.dateAdded || "all"}
              onValueChange={(value) => onFilterChange("dateAdded", value)}
            >
              <SelectTrigger className="w-36 h-9">
                <SelectValue placeholder="Date Added" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
                <SelectItem value="older">Older</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.people || "all"}
              onValueChange={(value) => onFilterChange("people", value)}
            >
              <SelectTrigger className="w-36 h-9">
                <SelectValue placeholder="People" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Everyone</SelectItem>
                <SelectItem value="me">Owned by me</SelectItem>
                <SelectItem value="shared">Shared with me</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClearFilters}
              >
                Clear filters
              </Button>
            )}
          </div>
        )}

        {/* Right side: Selection info + Action buttons or Add New + View toggle */}
        <div className="flex items-center gap-4">
          {selectedCount > 0 ? (
            <div className="flex items-center gap-4">
              {/* Selection Info */}
              <div className="flex items-center text-sm">
                <span className="font-medium">{selectedCount} Selected</span>
                <span>·</span>
                <span>{selectedSize}</span>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-1 border-l pl-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                  onClick={onDownload}
                  title="Download"
                >
                  <Download className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                  onClick={onShare}
                  title="Share"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                  onClick={onInfo}
                  title="Info"
                >
                  <Info className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                  onClick={onDelete}
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsAddNewModalOpen(true)}
            >
              + Add New
            </Button>
          )}
          
          {/* View Toggle Buttons */}
          <div className="flex items-center rounded-md border overflow-hidden">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              className="rounded-none px-3 h-8"
              onClick={() => onViewModeChange("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              className="rounded-none px-3 h-8"
              onClick={() => onViewModeChange("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Add New Modal */}
      <Dialog open={isAddNewModalOpen} onOpenChange={setIsAddNewModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New</DialogTitle>
            <DialogDescription>
              Upload a file, upload a folder, or create a new folder
            </DialogDescription>
          </DialogHeader>
          
          {/* Tabs for Upload/Create */}
          <div className="flex border-b mb-4">
            <button
              className={`flex-1 py-2 text-sm font-medium ${
                activeTab === "upload"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("upload")}
            >
              Upload
            </button>
            <button
              className={`flex-1 py-2 text-sm font-medium ${
                activeTab === "new-folder"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("new-folder")}
            >
              New Folder
            </button>
          </div>

          {activeTab === "upload" ? (
            <div className="space-y-4">
              <button
                onClick={handleUploadFile}
                className="w-full flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Upload className="h-5 w-5 text-gray-600" />
                <div className="text-left">
                  <div className="font-medium">Upload File</div>
                  <div className="text-xs text-gray-500">Upload a single file</div>
                </div>
              </button>

              <button
                onClick={handleUploadFolder}
                className="w-full flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FolderPlus className="h-5 w-5 text-gray-600" />
                <div className="text-left">
                  <div className="font-medium">Upload Folder</div>
                  <div className="text-xs text-gray-500">Upload entire folder</div>
                </div>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="folder-name" className="text-sm font-medium leading-none mb-2 block">
                  Folder Name
                </Label>
                <Input
                  id="folder-name"
                  placeholder="Enter folder name"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  className="w-full"
                />
              </div>
              
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setIsAddNewModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateFolder}
                  disabled={!folderName.trim()}
                >
                  Create
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}