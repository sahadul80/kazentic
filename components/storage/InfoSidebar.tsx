// components/storage/InfoSidebar.tsx - Update props and rendering
"use client";

import { useState } from "react";
import { X, Folder, File, Calendar, User, Clock, Download, Share2, Trash2, Users, Eye, Star, Hash, Layers, Package, Grid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { EnhancedFileItem, EnhancedFolderItem } from "@/types/storage";

export type InfoSidebarVariant = 'default' | 'default-2' | 'variant3' | 'variant4';

interface InfoSidebarProps {
  variant?: InfoSidebarVariant;
  isOpen?: boolean;
  onClose?: () => void;
  selectedInfo?: {
    count: number;
    size: string;
    folders: number;
    files: number;
    items: (EnhancedFileItem | EnhancedFolderItem)[];
  };
  className?: string;
}

// Helper function to check if an item is a folder
function isFolder(item: EnhancedFileItem | EnhancedFolderItem): item is EnhancedFolderItem {
  return 'items' in item;
}

export function InfoSidebar({  
  variant = 'default',
  isOpen = true, 
  onClose, 
  selectedInfo = {
    count: 0,
    size: "0 B",
    folders: 0,
    files: 0,
    items: []
  },
  className = "" 
}: InfoSidebarProps) {
  const [activeTab, setActiveTab] = useState<"details" | "activity">("details");
  
  if (!isOpen) return null;

  const items = selectedInfo.items || [];
  const singleItem = items.length === 1 ? items[0] : null;
  const isMultiple = items.length > 1;
  const isAllFiles = items.length > 0 && items.every(item => !isFolder(item));
  const isAllFolders = items.length > 0 && items.every(item => isFolder(item));
  const isMixed = items.length > 0 && !isAllFiles && !isAllFolders;

  // Mock shared users data
  const sharedUsers = [
    { id: 1, name: "You", email: "you@example.com", role: "Owner" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Editor" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "Viewer" },
  ];

  // Mock activity data - generate activity for each item
  const generateActivityForItem = (item: EnhancedFileItem | EnhancedFolderItem, index: number) => {
    const isFolderItem = isFolder(item);
    const activities = [
      { 
        id: index * 4 + 1, 
        action: isFolderItem ? "Folder created" : "File uploaded", 
        time: item.dateAdded || 'Unknown', 
        itemName: item.name, 
        user: `User ${item.ownerId}` 
      },
      { 
        id: index * 4 + 2, 
        action: "Modified", 
        time: item.lastModified || 'Unknown', 
        itemName: item.name, 
        user: `User ${item.ownerId}` 
      },
      { 
        id: index * 4 + 3, 
        action: item.sharedWith && item.sharedWith > 0 ? "Shared with team" : "Set to private", 
        time: "Aug 10, 2025", 
        itemName: item.name, 
        user: `User ${item.ownerId}` 
      },
    ];
    
    // Add a recent activity for some items
    if (index < 2) {
      activities.unshift({
        id: index * 4 + 4,
        action: "Opened recently",
        time: "Today, 2:30 PM",
        itemName: item.name,
        user: `User ${item.ownerId}`
      });
    }
    
    return activities;
  };

  const allActivities = items.flatMap((item, index) => generateActivityForItem(item, index));
  const todayActivities = allActivities.filter(activity => activity.time.includes("Today") || activity.time.includes("Aug 11"));
  const olderActivities = allActivities.filter(activity => !activity.time.includes("Today") && !activity.time.includes("Aug 11"));

  // Format dates for display
  const formatDate = (dateString: string) => {
    if (!dateString || dateString === 'Unknown') return "Unknown";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

  // Get date range for multiple items
  const getDateRange = (dates: string[], type: 'created' | 'modified') => {
    if (dates.length === 0) return "Various dates";
    
    const validDates = dates
      .filter(d => d && d !== 'Unknown')
      .map(d => new Date(d))
      .filter(d => !isNaN(d.getTime()));
    
    if (validDates.length === 0) return "Various dates";
    
    const sorted = validDates.sort((a, b) => a.getTime() - b.getTime());
    const earliest = sorted[0];
    const latest = sorted[sorted.length - 1];
    
    if (earliest.toDateString() === latest.toDateString()) {
      return formatDate(earliest.toISOString());
    }
    
    return `${formatDate(earliest.toISOString())} - ${formatDate(latest.toISOString())}`;
  };

  // Render preview icon based on selection type
  const renderPreviewIcon = () => {
    if (isMultiple) {
      if (isAllFiles) {
        // All files selected
        return (
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <File className="h-16 w-16 text-gray-400" />
                <div className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  {selectedInfo.count}
                </div>
              </div>
            </div>
          </div>
        );
      } else if (isAllFolders) {
        // All folders selected
        return (
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <Folder className="h-16 w-16 text-blue-400" />
                <div className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  {selectedInfo.count}
                </div>
              </div>
            </div>
          </div>
        );
      } else {
        // Mixed selection (folders and files)
        return (
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute top-0 left-0 w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center border">
              <Folder className="h-8 w-8 text-blue-600" />
              <div className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {selectedInfo.folders}
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border">
              <File className="h-8 w-8 text-gray-600" />
              <div className="absolute -top-1 -right-1 bg-gray-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {selectedInfo.files}
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-background rounded-full w-10 h-10 flex items-center justify-center border">
                <span className="font-semibold">{selectedInfo.count}</span>
              </div>
            </div>
          </div>
        );
      }
    } else if (singleItem) {
      // Single item selected
      const isFolderItem = isFolder(singleItem);
      return (
        <div className="w-24 h-24 rounded-lg flex items-center justify-center mx-auto" 
          style={{ 
            backgroundColor: isFolderItem ? '#E3F2FD' : '#F5F5F5' 
          }}>
          {isFolderItem ? (
            <Folder className="h-12 w-12 text-blue-600" />
          ) : (
            <div className="text-center">
              <File className="h-12 w-12 text-gray-600 mx-auto mb-2" />
              <span className="text-xs font-medium bg-white px-2 py-1 rounded border">
                {(singleItem as EnhancedFileItem).type?.toUpperCase() || 'FILE'}
              </span>
            </div>
          )}
        </div>
      );
    }
    
    return null;
  };

  // Get shared access text
  const getSharedAccessText = () => {
    if (isMultiple) {
      const sharedItems = items.filter(item => item.sharedWith && item.sharedWith > 0);
      const privateItems = items.filter(item => !item.sharedWith || item.sharedWith === 0);
      
      if (sharedItems.length === 0) return "All items are private";
      if (privateItems.length === 0) return "All items are shared";
      return `${sharedItems.length} shared, ${privateItems.length} private`;
    } else if (singleItem) {
      return singleItem.sharedWith && singleItem.sharedWith > 0 
        ? `Shared with ${singleItem.sharedWith} people` 
        : "Private to you";
    }
    return "No access information";
  };

  // Render details tab content
  const renderDetailsTab = () => (
    <div className="space-y-6">
      {/* Preview Card */}
      <div className="bg-muted rounded-lg p-4 border">
        {renderPreviewIcon()}
        <div className="text-center mt-3">
          <p className="text-sm font-medium">
            {isMultiple ? `${selectedInfo.count} items selected` : singleItem?.name}
          </p>
          <p className="text-xs text-muted-foreground">
            Total size: {selectedInfo.size}
          </p>
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-4">
        {/* Type Section */}
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-2">Type</h4>
          {isMultiple ? (
            <div className="space-y-1">
              {selectedInfo.folders > 0 && (
                <div className="flex items-center gap-2">
                  <Folder className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">{selectedInfo.folders} Folder{selectedInfo.folders !== 1 ? 's' : ''}</span>
                </div>
              )}
              {selectedInfo.files > 0 && (
                <div className="flex items-center gap-2">
                  <File className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{selectedInfo.files} File{selectedInfo.files !== 1 ? 's' : ''}</span>
                </div>
              )}
              {isMixed && (
                <div className="flex items-center gap-2 pt-1">
                  <Grid className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Mixed selection</span>
                </div>
              )}
            </div>
          ) : singleItem ? (
            <p className="text-sm">{isFolder(singleItem) ? 'Folder' : (singleItem as EnhancedFileItem).type || 'File'}</p>
          ) : null}
        </div>

        {/* Items List (for multiple items) */}
        {isMultiple && items.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-2">Items</h4>
            <div className="space-y-1 max-h-40 overflow-y-auto pr-2">
              {items.slice(0, 8).map((item) => (
                <div key={item.id} className="flex items-center gap-2 py-1">
                  {isFolder(item) ? (
                    <Folder className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
                  ) : (
                    <File className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />
                  )}
                  <span className="text-sm truncate flex-1">{item.name}</span>
                  <span className="text-xs text-muted-foreground">{item.size}</span>
                </div>
              ))}
              {items.length > 8 && (
                <div className="text-xs text-muted-foreground text-center pt-1">
                  <Package className="h-3 w-3 inline mr-1" />
                  +{items.length - 8} more items
                </div>
              )}
            </div>
          </div>
        )}

        <Separator />

        {/* Creation Date */}
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-2">Creation Date</h4>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {isMultiple 
                ? getDateRange(items.map(i => i.dateAdded || ''), 'created')
                : singleItem 
                  ? formatDate(singleItem.dateAdded || '')
                  : "Unknown"
              }
            </span>
          </div>
        </div>

        {/* Last Modified Date */}
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-2">Last Modified Date</h4>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {isMultiple 
                ? getDateRange(items.map(i => i.lastModified || ''), 'modified')
                : singleItem 
                  ? formatDate(singleItem.lastModified || '')
                  : "Unknown"
              }
            </span>
          </div>
        </div>

        <Separator />

        {/* Who Has Access */}
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-3">Who has access</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{getSharedAccessText()}</span>
              </div>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                Manage Access
              </Button>
            </div>
            
            {/* Show avatars for shared users if any item is shared */}
            {isMultiple ? (
              <div className="text-xs text-muted-foreground">
                Access settings may vary across selected items
              </div>
            ) : singleItem && singleItem.sharedWith && singleItem.sharedWith > 0 && (
              <div className="flex -space-x-2">
                {sharedUsers.slice(0, 3).map((user) => (
                  <Avatar key={user.id} className="w-6 h-6 border-2 border-background">
                    <AvatarFallback className="text-xs">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {singleItem.sharedWith && singleItem.sharedWith > 3 && (
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                    +{singleItem.sharedWith - 3}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Render activity tab content
  const renderActivityTab = () => (
    <div className="space-y-6">
      {/* Activity summary */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Activity</h3>
        <p className="text-sm text-muted-foreground">
          {isMultiple 
            ? `Showing ${allActivities.length} activities across ${items.length} items` 
            : singleItem 
              ? `Recent activity for "${singleItem.name}"`
              : "No activity to show"
          }
        </p>
      </div>

      {/* Activity timeline */}
      <ScrollArea className="h-[calc(100vh-400px)]">
        <div className="space-y-6">
          {/* Today's activities */}
          {todayActivities.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-medium text-muted-foreground">Today</h4>
              <div className="space-y-3">
                {todayActivities.map((activity) => (
                  <div key={activity.id} className="space-y-1 pb-3 border-b last:border-0">
                    <p className="text-sm">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                    {activity.itemName && (
                      <p className="text-sm font-medium">{activity.itemName}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Older activities */}
          {olderActivities.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-medium text-muted-foreground">
                {isMultiple ? "Older Activities" : "History"}
              </h4>
              <div className="space-y-3">
                {olderActivities.slice(0, 10).map((activity) => (
                  <div key={activity.id} className="space-y-1 pb-3 border-b last:border-0">
                    <p className="text-sm">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                    {isMultiple && activity.itemName && (
                      <p className="text-sm font-medium">{activity.itemName}</p>
                    )}
                  </div>
                ))}
                {olderActivities.length > 10 && (
                  <div className="text-center pt-2">
                    <Button variant="ghost" size="sm" className="text-xs">
                      <Layers className="h-3 w-3 mr-1" />
                      Load more activities
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {allActivities.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No recent activity</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <div className={cn(
      "w-[308px] h-[calc(100vh-20px)] flex top-z-50 top-5 bg-background border-l border-[#EBEBEB] flex flex-col",
      "shadow-[0px_0px_1px_0px_rgba(0,0,0,0.04),0px_4px_8px_0px_rgba(0,0,0,0.04)]",
      className
    )}>
      {/* Header */}
      <div className="border-b px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold">Info</h2>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-transparent"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="details" value={activeTab} onValueChange={(v) => setActiveTab(v as "details" | "activity")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details" className="text-xs">Details</TabsTrigger>
            <TabsTrigger value="activity" className="text-xs">Activity</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 px-6 py-4">
        {activeTab === "details" ? renderDetailsTab() : renderActivityTab()}
      </ScrollArea>

      {/* Footer Actions */}
      <div className="border-t p-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex-1 h-8 text-xs">
            <Download className="mr-2 h-3.5 w-3.5" />
            Download
          </Button>
          <Button variant="outline" size="sm" className="flex-1 h-8 text-xs">
            <Share2 className="mr-2 h-3.5 w-3.5" />
            Share
          </Button>
          <Button variant="outline" size="sm" className="flex-1 h-8 text-xs">
            <Trash2 className="mr-2 h-3.5 w-3.5" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}