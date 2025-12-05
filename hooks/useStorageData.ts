import { useMemo } from "react";
import { 
  FolderItem, 
  FileItem, 
  FilterType, 
  SortConfig,
  TrashedFolderItem,
  TrashedFileItem 
} from "@/types/storage";

// Use a union type that includes all possible item types
type AnyFolderItem = FolderItem | TrashedFolderItem;
type AnyFileItem = FileItem | TrashedFileItem;

interface UseStorageDataProps {
  folders: AnyFolderItem[];
  files: AnyFileItem[];
  filters: FilterType;
  sortConfig: SortConfig | null;
}

export function useStorageData({
  folders,
  files,
  filters,
  sortConfig,
}: UseStorageDataProps) {
  const filteredFolders = useMemo(() => {
    let result = [...folders];

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(folder => 
        folder.name.toLowerCase().includes(searchTerm) ||
        folder.owner.toLowerCase().includes(searchTerm)
      );
    }

    // Apply category filter
    if (filters.category && filters.category !== "all") {
      if (filters.category === "folders") {
        // Keep all folders
      } else {
        // For other file types, no folders should be shown
        result = [];
      }
    }

    // Apply last modified filter
    if (filters.lastModified && filters.lastModified !== "all") {
      result = applyLastModifiedFilter(result, filters.lastModified);
    }

    // Apply date added filter
    if (filters.dateAdded && filters.dateAdded !== "all") {
      result = applyDateAddedFilter(result, filters.dateAdded);
    }

    // Apply people filter
    if (filters.people && filters.people !== "all") {
      result = applyPeopleFilter(result, filters.people);
    }

    // Apply sorting
    if (sortConfig) {
      result = applySorting(result, sortConfig);
    }

    return result;
  }, [folders, filters, sortConfig]);

  const filteredFiles = useMemo(() => {
    let result = [...files];

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(file => 
        file.name.toLowerCase().includes(searchTerm) ||
        file.owner.toLowerCase().includes(searchTerm) ||
        file.fileType.toLowerCase().includes(searchTerm)
      );
    }

    // Apply category filter
    if (filters.category && filters.category !== "all") {
      result = applyCategoryFilter(result, filters.category);
    }

    // Apply last modified filter
    if (filters.lastModified && filters.lastModified !== "all") {
      result = applyLastModifiedFilter(result, filters.lastModified);
    }

    // Apply date added filter
    if (filters.dateAdded && filters.dateAdded !== "all") {
      result = applyDateAddedFilter(result, filters.dateAdded);
    }

    // Apply people filter
    if (filters.people && filters.people !== "all") {
      result = applyPeopleFilter(result, filters.people);
    }

    // Apply sorting
    if (sortConfig) {
      result = applySorting(result, sortConfig);
    }

    return result;
  }, [files, filters, sortConfig]);

  return {
    filteredFolders,
    filteredFiles,
  };
}

// Helper functions
function applyLastModifiedFilter<T extends { lastModified: string }>(
  items: T[], 
  lastModified: string
): T[] {
  const now = new Date();
  return items.filter(item => {
    const modifiedDate = new Date(item.lastModified);
    const diffTime = Math.abs(now.getTime() - modifiedDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    switch (lastModified) {
      case "today": return diffDays <= 1;
      case "week": return diffDays <= 7;
      case "month": return diffDays <= 30;
      case "year": return diffDays <= 365;
      case "last-year": return diffDays > 365 && diffDays <= 730;
      case "older": return diffDays > 730;
      default: return true;
    }
  });
}

function applyDateAddedFilter<T extends { dateAdded: string }>(
  items: T[], 
  dateAdded: string
): T[] {
  const now = new Date();
  return items.filter(item => {
    const addedDate = new Date(item.dateAdded);
    const diffTime = Math.abs(now.getTime() - addedDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    switch (dateAdded) {
      case "today": return diffDays <= 1;
      case "week": return diffDays <= 7;
      case "month": return diffDays <= 30;
      default: return true;
    }
  });
}

function applyPeopleFilter<T extends { owner: string; sharedWith: number }>(
  items: T[], 
  people: string
): T[] {
  switch (people) {
    case "me":
      return items.filter(item => item.owner === "Pat Cummins");
    case "shared":
      return items.filter(item => item.sharedWith > 0);
    case "everyone":
      return items;
    default:
      return items;
  }
}

function applyCategoryFilter(
  files: AnyFileItem[], 
  category: string
): AnyFileItem[] {
  switch (category) {
    case "folders":
      return [];
    case "images":
      return files.filter(file => 
        ["jpg", "png", "jpeg", "gif", "svg", "webp", "bmp", "jpeg"].includes(file.fileType.toLowerCase())
      );
    case "documents":
      return files.filter(file => 
        ["doc", "docx", "txt", "rtf", "md"].includes(file.fileType.toLowerCase())
      );
    case "pdfs":
      return files.filter(file => file.fileType.toLowerCase() === "pdf");
    case "presentations":
      return files.filter(file => 
        ["ppt", "pptx", "key", "odp"].includes(file.fileType.toLowerCase())
      );
    case "spreadsheets":
      return files.filter(file => 
        ["xls", "xlsx", "csv", "ods"].includes(file.fileType.toLowerCase())
      );
    case "video":
      return files.filter(file => 
        ["mp4", "mkv", "avi", "mov", "wmv", "flv", "webm"].includes(file.fileType.toLowerCase())
      );
    case "audio":
      return files.filter(file => 
        ["mp3", "wav", "aac", "flac", "ogg", "m4a"].includes(file.fileType.toLowerCase())
      );
    case "others":
      const commonTypes = [
        "jpg", "png", "jpeg", "gif", "svg", "webp", "bmp",
        "pdf", "doc", "docx", "txt", "rtf", "md",
        "ppt", "pptx", "key", "odp",
        "xls", "xlsx", "csv", "ods",
        "mp4", "mkv", "avi", "mov", "wmv", "flv", "webm",
        "mp3", "wav", "aac", "flac", "ogg", "m4a"
      ];
      return files.filter(file => 
        !commonTypes.includes(file.fileType.toLowerCase())
      );
    default:
      return files;
  }
}

function applySorting<T extends AnyFolderItem | AnyFileItem>(
  items: T[], 
  sortConfig: SortConfig
): T[] {
  if (!sortConfig) return items;
  
  return [...items].sort((a, b) => {
    const aValue = a[sortConfig.key as keyof T];
    const bValue = b[sortConfig.key as keyof T];
    
    // Handle null/undefined values - treat them as equal at the end
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return 1;
    if (bValue == null) return -1;
    
    // Both values are non-null now, so we can safely compare them
    // Handle string comparison
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      // For size comparison, extract numbers
      if (sortConfig.key === 'size') {
        const aNum = parseFloat(aValue.replace(/[^0-9.]/g, ''));
        const bNum = parseFloat(bValue.replace(/[^0-9.]/g, ''));
        
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return sortConfig.direction === "ascending" 
            ? aNum - bNum 
            : bNum - aNum;
        }
      }
      
      // Regular string comparison
      return sortConfig.direction === "ascending" 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }
    
    // Handle date comparison
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const aDate = new Date(aValue);
      const bDate = new Date(bValue);
      
      if (!isNaN(aDate.getTime()) && !isNaN(bDate.getTime())) {
        return sortConfig.direction === "ascending" 
          ? aDate.getTime() - bDate.getTime() 
          : bDate.getTime() - aDate.getTime();
      }
    }
    
    // Handle number comparison
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortConfig.direction === "ascending" 
        ? aValue - bValue 
        : bValue - aValue;
    }
    
    // Fallback to basic comparison
    // We need to ensure both values are comparable
    if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
    return 0;
  });
}