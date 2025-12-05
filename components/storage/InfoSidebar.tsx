"use client";

import { X, Folder, File, Calendar, User, Download, Trash2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InfoSidebarProps {
  selectedInfo: {
    count: number;
    size: string;
    folders: number;
    files: number;
    items: any[];
  };
  onClose: () => void;
}

export function InfoSidebar({ selectedInfo, onClose }: InfoSidebarProps) {
  // Get first item for individual details (if only one selected)
  const singleItem = selectedInfo.items.length === 1 ? selectedInfo.items[0] : null;
  
  return (
    <div className="w-64 border-l bg-white">
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium">Info</h2>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Selection Info */}
        <div className="mb-4">
          <h3 className="text-xs font-medium text-gray-500 mb-1">Selection</h3>
          <p className="text-sm">{selectedInfo.count} Selected · {selectedInfo.size}</p>
        </div>
        
        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Download className="h-3 w-3 mr-1" />
            Download
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <Share2 className="h-3 w-3 mr-1" />
            Share
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 text-red-600"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Delete
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Type */}
        <div>
          <h3 className="text-xs font-medium text-gray-500 mb-2">Type</h3>
          <div className="space-y-2">
            {selectedInfo.folders > 0 && (
              <div className="flex items-center gap-2">
                <Folder className="h-4 w-4 text-blue-500" />
                <span className="text-sm">Folder ({selectedInfo.folders})</span>
              </div>
            )}
            {selectedInfo.files > 0 && (
              <div className="flex items-center gap-2">
                <File className="h-4 w-4 text-gray-500" />
                <span className="text-sm">File ({selectedInfo.files})</span>
              </div>
            )}
          </div>
        </div>

        {/* When multiple items selected, show summary */}
        {selectedInfo.items.length > 1 ? (
          <>
            {/* Location */}
            <div>
              <h3 className="text-xs font-medium text-gray-500 mb-2">Location</h3>
              <div className="flex items-center gap-2">
                <Folder className="h-4 w-4 text-gray-400" />
                <span className="text-sm">Storage</span>
              </div>
            </div>

            {/* Date Range */}
            <div>
              <h3 className="text-xs font-medium text-gray-500 mb-2">Date Added</h3>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm">Various dates</span>
              </div>
            </div>
          </>
        ) : singleItem ? (
          <>
            {/* Single Item Details */}
            <div>
              <h3 className="text-xs font-medium text-gray-500 mb-2">Name</h3>
              <p className="text-sm font-medium">{singleItem.name}</p>
            </div>

            {/* Owner */}
            <div>
              <h3 className="text-xs font-medium text-gray-500 mb-2">Owner</h3>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{singleItem.owner}</span>
              </div>
            </div>

            {/* Size */}
            <div>
              <h3 className="text-xs font-medium text-gray-500 mb-2">Size</h3>
              <p className="text-sm">{singleItem.size}</p>
            </div>

            {/* Type */}
            <div>
              <h3 className="text-xs font-medium text-gray-500 mb-2">File Type</h3>
              <p className="text-sm">{singleItem.type === "folder" ? "Folder" : singleItem.fileType}</p>
            </div>

            {/* Date Added */}
            <div>
              <h3 className="text-xs font-medium text-gray-500 mb-2">Date Added</h3>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{singleItem.dateAdded}</span>
              </div>
            </div>

            {/* Last Modified */}
            <div>
              <h3 className="text-xs font-medium text-gray-500 mb-2">Last Modified</h3>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{singleItem.lastModified}</span>
              </div>
            </div>

            {/* Shared With */}
            <div>
              <h3 className="text-xs font-medium text-gray-500 mb-2">Shared With</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm">{singleItem.sharedWith} people</span>
                <Button variant="ghost" size="sm" className="h-6 px-2">
                  Manage
                </Button>
              </div>
            </div>
          </>
        ) : null}

        {/* Shared Status */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-medium text-gray-500 mb-1">Status</h3>
              <p className="text-sm">
                {selectedInfo.items.length === 1 
                  ? singleItem?.sharedWith > 0 ? "Shared" : "Private"
                  : "Mixed"
                }
              </p>
            </div>
            <Button variant="outline" size="sm">
              Manage Access
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}