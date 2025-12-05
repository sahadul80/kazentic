export interface StorageItem {
  id: number;
  name: string;
  owner: string;
  size: string;
  lastModified: string;
  lastOpened: string;
  dateAdded: string;
  sharedWith: number;
  isTrashed: boolean;
  trashedAt?: string; // Add this for trashed items
  originalId?: number; // Add this for trashed items
  color: string;
}

export interface FolderItem extends StorageItem {
  type: "folder";
  filesInside: number;
}

export interface FileItem extends StorageItem {
  type: "file";
  fileType: string;
}

// Trashed item types (optional, you can use union types instead)
export type TrashedFolderItem = FolderItem & { 
  trashedAt: string; 
  originalId?: number;
};

export type TrashedFileItem = FileItem & { 
  trashedAt: string; 
  originalId?: number;
};

export type ViewMode = "list" | "grid";

export type FilterType = {
  category: string;
  lastModified: string;
  dateAdded: string;
  people: string;
  search: string;
};

export type SortConfig = {
  key: string;
  direction: "ascending" | "descending";
} | null;

export type ActionType = "save-as" | "rename" | "share" | "copy" | "info" | "move" | "delete";