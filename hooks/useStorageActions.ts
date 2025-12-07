// hooks/useStorageActions.ts
"use client";

import { useCallback } from "react";
import { ActionType, EnhancedFolderItem, EnhancedFileItem } from "@/types/storage";

// Base interface for items
interface BaseItem {
  isTrashed: any;
  id: number;
  name: string;
}

// Make the hook generic to accept any item type that extends BaseItem
interface UseStorageActionsProps<F extends BaseItem = any, G extends BaseItem = any> {
  setFolders: (folders: F[] | ((prev: F[]) => F[])) => void;
  setFiles: (files: G[] | ((prev: G[]) => G[])) => void;
  clearSelection: () => void;
}

export function useStorageActions<F extends BaseItem, G extends BaseItem>({
  setFolders,
  setFiles,
  clearSelection,
}: UseStorageActionsProps<F, G>) {
  const handleItemAction = useCallback((id: number, action: ActionType) => {
    console.log(`Action ${action} on item ${id}`);
    
    switch (action) {
      case "delete":
        if (confirm("Are you sure you want to move this item to trash?")) {
          setFolders((prev: F[]) => 
            prev.map(f => f.id === id ? { ...f, isTrashed: true, trashedAt: new Date().toISOString() } : f)
          );
          setFiles((prev: G[]) => 
            prev.map(f => f.id === id ? { ...f, isTrashed: true, trashedAt: new Date().toISOString() } : f)
          );
        }
        break;
        
      case "permanent-delete":
        if (confirm("Are you sure you want to permanently delete this item? This action cannot be undone.")) {
          setFolders((prev: F[]) => prev.filter(f => f.id !== id));
          setFiles((prev: G[]) => prev.filter(f => f.id !== id));
        }
        break;
        
      case "restore":
        setFolders((prev: F[]) => 
          prev.map(f => f.id === id ? { ...f, isTrashed: false, trashedAt: undefined } : f)
        );
        setFiles((prev: G[]) => 
          prev.map(f => f.id === id ? { ...f, isTrashed: false, trashedAt: undefined } : f)
        );
        break;
        
      case "rename":
        const newName = prompt("Enter new name:");
        if (newName && newName.trim()) {
          setFolders((prev: F[]) => 
            prev.map(f => f.id === id ? { ...f, name: newName.trim(), lastModified: new Date().toISOString() } : f)
          );
          setFiles((prev: G[]) => 
            prev.map(f => f.id === id ? { ...f, name: newName.trim(), lastModified: new Date().toISOString() } : f)
          );
        }
        break;
        
      case "share":
        const shareWith = prompt("Enter email addresses to share with (comma separated):");
        if (shareWith) {
          const emails = shareWith.split(',').map(email => email.trim()).filter(email => email);
          console.log("Sharing item with:", emails);
          // In a real app, you would call an API here
          alert(`Shared with: ${emails.join(', ')}`);
        }
        break;
        
      case "download":
        console.log("Downloading item:", id);
        // In a real app, you would trigger a download here
        alert("Download started");
        break;
        
      case "move":
        const targetFolderId = prompt("Enter destination folder ID (or leave empty for root):");
        if (targetFolderId !== null) {
          const folderId = targetFolderId ? parseInt(targetFolderId) : null;
          setFolders((prev: F[]) => 
            prev.map(f => f.id === id ? { ...f, parentFolderId: folderId, lastModified: new Date().toISOString() } : f)
          );
          setFiles((prev: G[]) => 
            prev.map(f => f.id === id ? { ...f, folderId, lastModified: new Date().toISOString() } : f)
          );
        }
        break;
        
      case "copy":
        console.log("Copying item:", id);
        // In a real app, you would create a copy of the item
        alert("Item copied to clipboard");
        break;
        
      case "info":
        console.log("Showing info for item:", id);
        // Info is handled by the InfoSidebar component
        break;
        
      default:
        console.log(`Action ${action} on item ${id}`);
    }
  }, [setFolders, setFiles]);

  const handleBulkAction = useCallback((action: string, selectedItems: number[]) => {
    console.log(`Bulk ${action} on ${selectedItems.length} items`);
    
    switch (action) {
      case "delete":
        if (confirm(`Are you sure you want to move ${selectedItems.length} items to trash?`)) {
          setFolders((prev: F[]) => 
            prev.map(f => selectedItems.includes(f.id) ? { ...f, isTrashed: true, trashedAt: new Date().toISOString() } : f)
          );
          setFiles((prev: G[]) => 
            prev.map(f => selectedItems.includes(f.id) ? { ...f, isTrashed: true, trashedAt: new Date().toISOString() } : f)
          );
          clearSelection();
        }
        break;
        
      case "permanent-delete":
        if (confirm(`Are you sure you want to permanently delete ${selectedItems.length} items? This action cannot be undone.`)) {
          setFolders((prev: F[]) => prev.filter(f => !selectedItems.includes(f.id)));
          setFiles((prev: G[]) => prev.filter(f => !selectedItems.includes(f.id)));
          clearSelection();
        }
        break;
        
      case "download":
        console.log("Downloading selected items:", selectedItems);
        alert(`Downloading ${selectedItems.length} items...`);
        break;
        
      case "share":
        const shareWith = prompt("Enter email addresses to share with (comma separated):");
        if (shareWith) {
          const emails = shareWith.split(',').map(email => email.trim()).filter(email => email);
          console.log("Sharing items with:", emails);
          alert(`Shared ${selectedItems.length} items with: ${emails.join(', ')}`);
        }
        break;
        
      case "bulk-move":
        const targetFolderId = prompt("Enter destination folder ID (or leave empty for root):");
        if (targetFolderId !== null) {
          const folderId = targetFolderId ? parseInt(targetFolderId) : null;
          setFolders((prev: F[]) => 
            prev.map(f => selectedItems.includes(f.id) ? { ...f, parentFolderId: folderId, lastModified: new Date().toISOString() } : f)
          );
          setFiles((prev: G[]) => 
            prev.map(f => selectedItems.includes(f.id) ? { ...f, folderId, lastModified: new Date().toISOString() } : f)
          );
          clearSelection();
        }
        break;
        
      case "bulk-share":
        const emails = prompt("Enter email addresses to share with (comma separated):");
        if (emails) {
          console.log("Bulk sharing with:", emails);
          alert(`Shared ${selectedItems.length} items with: ${emails}`);
        }
        break;
        
      case "empty-trash":
        if (confirm("Are you sure you want to empty the trash? This will permanently delete all trashed items.")) {
          setFolders((prev: F[]) => prev.filter(f => !f.isTrashed));
          setFiles((prev: G[]) => prev.filter(f => !f.isTrashed));
        }
        break;
        
      default:
        console.log(`Bulk action ${action} on ${selectedItems.length} items`);
    }
  }, [setFolders, setFiles, clearSelection]);

  const handleAddNew = useCallback((workspaceId?: number | null) => {
    const folderName = prompt("Enter folder name:");
    if (!folderName || !folderName.trim()) {
      return;
    }

    const newFolder: EnhancedFolderItem = {
      id: Date.now(), // Temporary ID
      name: folderName.trim(),
      type: "folder",
      owner: "You",
      ownerId: 1,
      size: "0 MB",
      lastModified: new Date().toISOString(),
      lastOpened: new Date().toISOString(),
      dateAdded: new Date().toISOString(),
      sharedWith: 0,
      isTrashed: false,
      color: "#3B82F6", // Blue color
      workspaceId: workspaceId || undefined,
      tags: [],
      sharedWithIds: [],
      filesInside: 0,
      parentFolderId: undefined,
      fileIds: [],
      childFolderIds: [],
      sharingRecords: []
    };

    setFolders((prev: F[]) => [...prev, newFolder as unknown as F]);
    console.log("Created new folder:", newFolder);
    alert(`Folder "${folderName}" created successfully!`);
  }, [setFolders]);

  // Add file upload functionality
  const handleUpload = useCallback((files: FileList, workspaceId?: number | null, folderId?: number) => {
    const uploadedFiles: EnhancedFileItem[] = [];
    
    Array.from(files).forEach((file, index) => {
      const newFile: EnhancedFileItem = {
        id: Date.now() + index,
        name: file.name,
        type: "file",
        owner: "You",
        ownerId: 1,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        lastModified: new Date().toISOString(),
        lastOpened: new Date().toISOString(),
        dateAdded: new Date().toISOString(),
        sharedWith: 0,
        isTrashed: false,
        color: "#6B7280", // Gray color
        workspaceId: workspaceId || undefined,
        tags: [],
        sharedWithIds: [],
        fileType: file.type.split('/').pop()?.toUpperCase() || 'FILE',
        version: 1,
        folderId: folderId || undefined,
        sharingRecords: [],
        mimeType: file.type,
        location: `/uploads/${file.name}`
      };
      
      uploadedFiles.push(newFile);
    });

    setFiles((prev: G[]) => [...prev, ...uploadedFiles as unknown as G[]]);
    console.log("Uploaded files:", uploadedFiles);
    alert(`Uploaded ${uploadedFiles.length} file(s) successfully!`);
  }, [setFiles]);

  // Create folder with more options
  const createFolder = useCallback((options: {
    name: string;
    workspaceId?: number;
    parentFolderId?: number;
    color?: string;
    tags?: string[];
  }) => {
    const newFolder: EnhancedFolderItem = {
      id: Date.now(),
      name: options.name,
      type: "folder",
      owner: "You",
      ownerId: 1,
      size: "0 MB",
      lastModified: new Date().toISOString(),
      lastOpened: new Date().toISOString(),
      dateAdded: new Date().toISOString(),
      sharedWith: 0,
      isTrashed: false,
      color: options.color || "#3B82F6",
      workspaceId: options.workspaceId,
      tags: options.tags || [],
      sharedWithIds: [],
      filesInside: 0,
      parentFolderId: options.parentFolderId,
      fileIds: [],
      childFolderIds: [],
      sharingRecords: []
    };

    setFolders((prev: F[]) => [...prev, newFolder as unknown as F]);
    return newFolder;
  }, [setFolders]);

  // Upload file with more options
  const uploadFile = useCallback((file: File, options: {
    workspaceId?: number;
    folderId?: number;
    tags?: string[];
  }) => {
    const newFile: EnhancedFileItem = {
      id: Date.now(),
      name: file.name,
      type: "file",
      owner: "You",
      ownerId: 1,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      lastModified: new Date().toISOString(),
      lastOpened: new Date().toISOString(),
      dateAdded: new Date().toISOString(),
      sharedWith: 0,
      isTrashed: false,
      color: "#6B7280",
      workspaceId: options.workspaceId,
      tags: options.tags || [],
      sharedWithIds: [],
      fileType: file.type.split('/').pop()?.toUpperCase() || 'FILE',
      version: 1,
      folderId: options.folderId,
      sharingRecords: [],
      mimeType: file.type,
      location: `/uploads/${file.name}`,
      checksum: `checksum_${Date.now()}`,
      thumbnail: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
    };

    setFiles((prev: G[]) => [...prev, newFile as unknown as G]);
    return newFile;
  }, [setFiles]);

  // Get items by workspace
  const getItemsByWorkspace = useCallback((workspaceId: number) => {
    // This would typically come from state, but we can't access it here
    console.log("Getting items for workspace:", workspaceId);
    return { folders: [], files: [] };
  }, []);

  // Get items by folder
  const getItemsByFolder = useCallback((folderId: number) => {
    console.log("Getting items for folder:", folderId);
    return { folders: [], files: [] };
  }, []);

  // Calculate folder size recursively
  const calculateFolderSize = useCallback((folderId: number): number => {
    console.log("Calculating size for folder:", folderId);
    return 0; // Would calculate recursively in a real app
  }, []);

  return {
    // Core actions
    handleItemAction,
    handleBulkAction,
    handleAddNew,
    
    // File operations
    handleUpload,
    uploadFile,
    
    // Folder operations
    createFolder,
    
    // Query operations
    getItemsByWorkspace,
    getItemsByFolder,
    calculateFolderSize,
    
    // Helper functions
    isEmptyTrash: () => {
      if (confirm("Are you sure you want to empty the trash? This cannot be undone.")) {
        setFolders((prev: F[]) => prev.filter(f => !f.isTrashed));
        setFiles((prev: G[]) => prev.filter(f => !f.isTrashed));
        return true;
      }
      return false;
    },
    
    restoreAllFromTrash: () => {
      setFolders((prev: F[]) => 
        prev.map(f => f.isTrashed ? { ...f, isTrashed: false, trashedAt: undefined } : f)
      );
      setFiles((prev: G[]) => 
        prev.map(f => f.isTrashed ? { ...f, isTrashed: false, trashedAt: undefined } : f)
      );
      return true;
    }
  };
}