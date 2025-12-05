import { useCallback } from "react";
import { FolderItem, FileItem, ActionType } from "@/types/storage";

interface UseStorageActionsProps {
  setFolders: (folders: FolderItem[] | ((prev: FolderItem[]) => FolderItem[])) => void;
  setFiles: (files: FileItem[] | ((prev: FileItem[]) => FileItem[])) => void;
  clearSelection: () => void;
}

export function useStorageActions({
  setFolders,
  setFiles,
  clearSelection,
}: UseStorageActionsProps) {
  const handleItemAction = useCallback((id: number, action: ActionType) => {
    console.log(`Action ${action} on item ${id}`);
    
    switch (action) {
      case "delete":
        if (confirm("Are you sure you want to move this item to trash?")) {
          setFolders((prev: FolderItem[]) => prev.filter(f => f.id !== id));
          setFiles((prev: FileItem[]) => prev.filter(f => f.id !== id));
        }
        break;
      case "rename":
        const newName = prompt("Enter new name:");
        if (newName) {
          setFolders((prev: FolderItem[]) => 
            prev.map(f => f.id === id ? { ...f, name: newName } : f)
          );
          setFiles((prev: FileItem[]) => 
            prev.map(f => f.id === id ? { ...f, name: newName } : f)
          );
        }
        break;
      case "share":
        console.log("Sharing item:", id);
        break;
      default:
        console.log(`Action ${action} on item ${id}`);
    }
  }, [setFolders, setFiles]);

  const handleBulkAction = useCallback((action: string, selectedItems: number[]) => {
    console.log(`Bulk ${action} on ${selectedItems.length} items`);
    
    switch (action) {
      case "delete":
        if (confirm(`Are you sure you want to delete ${selectedItems.length} items?`)) {
          setFolders((prev: FolderItem[]) => prev.filter(f => !selectedItems.includes(f.id)));
          setFiles((prev: FileItem[]) => prev.filter(f => !selectedItems.includes(f.id)));
          clearSelection();
        }
        break;
      case "download":
        console.log("Downloading selected items:", selectedItems);
        break;
      case "share":
        console.log("Sharing selected items:", selectedItems);
        break;
    }
  }, [setFolders, setFiles, clearSelection]);

  const handleAddNew = useCallback(() => {
    console.log("Add new item");
    // You would implement actual add new logic here
  }, []);

  return {
    handleItemAction,
    handleBulkAction,
    handleAddNew,
  };
}