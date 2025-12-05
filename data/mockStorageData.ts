import { FolderItem, FileItem } from "@/types/storage";

// Active items (not in trash)
export const mockFolders: FolderItem[] = [
  {
    id: 1,
    name: "Project Documents",
    owner: "Pat Cummins",
    size: "12 MB",
    lastModified: "Aug 12, 2025",
    lastOpened: "Aug 12, 2025",
    dateAdded: "Aug 12, 2025",
    filesInside: 12,
    type: "folder",
    sharedWith: 3,
    color: "blue",
    isTrashed: false,
  },
  {
    id: 2,
    name: "Design Assets",
    owner: "Pat Cummins",
    size: "45 MB",
    lastModified: "Aug 12, 2025",
    lastOpened: "Aug 12, 2025",
    dateAdded: "Aug 12, 2025",
    filesInside: 8,
    type: "folder",
    sharedWith: 5,
    color: "blue",
    isTrashed: false,
  },
  {
    id: 3,
    name: "Meeting Notes",
    owner: "Pat Cummins",
    size: "3 MB",
    lastModified: "Aug 12, 2025",
    lastOpened: "Aug 12, 2025",
    dateAdded: "Aug 12, 2025",
    filesInside: 3,
    type: "folder",
    sharedWith: 2,
    color: "blue",
    isTrashed: false,
  },
  {
    id: 4,
    name: "Archived Files",
    owner: "Pat Cummins",
    size: "156 MB",
    lastModified: "Aug 12, 2025",
    lastOpened: "Aug 12, 2025",
    dateAdded: "Aug 12, 2025",
    filesInside: 156,
    type: "folder",
    sharedWith: 1,
    color: "blue",
    isTrashed: false,
  },
  {
    id: 5,
    name: "Client Presentations",
    owner: "Pat Cummins",
    size: "28 MB",
    lastModified: "Aug 11, 2025",
    lastOpened: "Aug 11, 2025",
    dateAdded: "Aug 11, 2025",
    filesInside: 7,
    type: "folder",
    sharedWith: 4,
    color: "blue",
    isTrashed: false,
  },
];

export const mockFiles: FileItem[] = [
  {
    id: 101,
    name: "Quarterly Report",
    owner: "Pat Cummins",
    size: "2.5 MB",
    lastModified: "Aug 12, 2025",
    lastOpened: "Aug 12, 2025",
    dateAdded: "Aug 12, 2025",
    type: "file",
    fileType: "PDF",
    sharedWith: 3,
    color: "red",
    isTrashed: false,
  },
  {
    id: 102,
    name: "Product Screenshot",
    owner: "Pat Cummins",
    size: "1.2 MB",
    lastModified: "Aug 12, 2025",
    lastOpened: "Aug 12, 2025",
    dateAdded: "Aug 12, 2025",
    type: "file",
    fileType: "JPG",
    sharedWith: 2,
    color: "green",
    isTrashed: false,
  },
  {
    id: 103,
    name: "Team Meeting Recording",
    owner: "Pat Cummins",
    size: "45 MB",
    lastModified: "Aug 12, 2025",
    lastOpened: "Aug 12, 2025",
    dateAdded: "Aug 12, 2025",
    type: "file",
    fileType: "MKV",
    sharedWith: 8,
    color: "purple",
    isTrashed: false,
  },
  {
    id: 104,
    name: "Company Logo",
    owner: "Pat Cummins",
    size: "0.5 MB",
    lastModified: "Aug 12, 2025",
    lastOpened: "Aug 12, 2025",
    dateAdded: "Aug 12, 2025",
    type: "file",
    fileType: "PNG",
    sharedWith: 0,
    color: "blue",
    isTrashed: false,
  },
];

// Shared items
export const sharedFolders: FolderItem[] = [
  {
    id: 51,
    name: "Shared Project Docs",
    owner: "Pat Cummins",
    size: "45 MB",
    lastModified: "Aug 12, 2025",
    lastOpened: "Aug 12, 2025",
    dateAdded: "Aug 12, 2025",
    filesInside: 12,
    type: "folder",
    sharedWith: 5,
    color: "blue",
    isTrashed: false,
  },
  {
    id: 52,
    name: "Team Design Assets",
    owner: "Sarah Chen",
    size: "120 MB",
    lastModified: "Aug 11, 2025",
    lastOpened: "Aug 11, 2025",
    dateAdded: "Aug 11, 2025",
    filesInside: 8,
    type: "folder",
    sharedWith: 8,
    color: "blue",
    isTrashed: false,
  },
];

export const sharedFiles: FileItem[] = [
  {
    id: 151,
    name: "Q3 Team Report",
    owner: "Pat Cummins",
    size: "4.5 MB",
    lastModified: "Aug 12, 2025",
    lastOpened: "Aug 12, 2025",
    dateAdded: "Aug 12, 2025",
    type: "file",
    fileType: "PDF",
    sharedWith: 8,
    color: "red",
    isTrashed: false,
  },
  {
    id: 152,
    name: "Company All Hands Deck",
    owner: "CEO Office",
    size: "8.2 MB",
    lastModified: "Aug 11, 2025",
    lastOpened: "Aug 11, 2025",
    dateAdded: "Aug 11, 2025",
    type: "file",
    fileType: "PPTX",
    sharedWith: 50,
    color: "red",
    isTrashed: false,
  },
];

// Trash items (deleted items)
export const trashedFolders: (FolderItem & { trashedAt: string; originalId?: number })[] = [
  {
    id: 1001,
    originalId: 10,
    name: "Old Reports (deleted)",
    owner: "Pat Cummins",
    size: "85 MB",
    lastModified: "Jul 1, 2025",
    lastOpened: "Jul 1, 2025",
    dateAdded: "Jun 15, 2025",
    trashedAt: "Aug 10, 2025", // 5 days ago
    filesInside: 25,
    type: "folder",
    sharedWith: 0,
    color: "gray",
    isTrashed: true,
  },
  {
    id: 1002,
    originalId: 8,
    name: "Temporary Files (deleted)",
    owner: "Pat Cummins",
    size: "15 MB",
    lastModified: "Jul 20, 2025",
    lastOpened: "Jul 20, 2025",
    dateAdded: "Jul 10, 2025",
    trashedAt: "Jul 25, 2025", // 18 days ago
    filesInside: 7,
    type: "folder",
    sharedWith: 0,
    color: "gray",
    isTrashed: true,
  },
];

export const trashedFiles: (FileItem & { trashedAt: string; originalId?: number })[] = [
  {
    id: 2001,
    originalId: 110,
    name: "Old Proposal (deleted)",
    owner: "Pat Cummins",
    size: "3.2 MB",
    lastModified: "Jun 30, 2025",
    lastOpened: "Jun 30, 2025",
    dateAdded: "Jun 15, 2025",
    trashedAt: "Aug 5, 2025", // 10 days ago
    type: "file",
    fileType: "DOCX",
    sharedWith: 0,
    color: "gray",
    isTrashed: true,
  },
  {
    id: 2002,
    originalId: 115,
    name: "Draft Presentation (deleted)",
    owner: "Pat Cummins",
    size: "5.7 MB",
    lastModified: "Jul 5, 2025",
    lastOpened: "Jul 5, 2025",
    dateAdded: "Jul 1, 2025",
    trashedAt: "Jul 10, 2025", // 33 days ago (should be permanently deletable)
    type: "file",
    fileType: "PPTX",
    sharedWith: 0,
    color: "gray",
    isTrashed: true,
  },
  {
    id: 2003,
    originalId: 120,
    name: "Test Data (deleted)",
    owner: "Sarah Chen",
    size: "12.5 MB",
    lastModified: "Jun 1, 2025",
    lastOpened: "Jun 1, 2025",
    dateAdded: "May 20, 2025",
    trashedAt: "Jun 5, 2025", // 68 days ago (should be permanently deletable)
    type: "file",
    fileType: "CSV",
    sharedWith: 0,
    color: "gray",
    isTrashed: true,
  },
];

// Storage management functions
export const storageManager = {
  // Move item to trash
  moveToTrash: (
    itemId: number, 
    type: 'folder' | 'file', 
    source: 'personal' | 'shared' = 'personal'
  ): void => {
    const trashedAt = new Date().toISOString().split('T')[0];
    console.log(`Moving ${type} ${itemId} to trash on ${trashedAt}`);
  },

  // Restore item from trash
  restoreFromTrash: (
    trashId: number, 
    type: 'folder' | 'file'
  ): void => {
    console.log(`Restoring ${type} ${trashId} from trash`);
  },

  // Permanently delete item
  permanentlyDelete: (
    trashId: number, 
    type: 'folder' | 'file'
  ): void => {
    console.log(`Permanently deleting ${type} ${trashId}`);
  },

  // Empty trash
  emptyTrash: (): void => {
    console.log('Emptying entire trash');
  },

  // Get days until permanent deletion
  getDaysUntilPermanentDeletion: (trashedAt: string): number => {
    const trashedDate = new Date(trashedAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - trashedDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, 30 - diffDays);
  },

  // Check if item should be permanently deleted
  shouldPermanentlyDelete: (trashedAt: string): boolean => {
    const daysUntilDeletion = storageManager.getDaysUntilPermanentDeletion(trashedAt);
    return daysUntilDeletion <= 0;
  },

  // Get formatted deletion message
  getDeletionMessage: (trashedAt: string): string => {
    const daysLeft = storageManager.getDaysUntilPermanentDeletion(trashedAt);
    if (daysLeft <= 0) {
      return "This item will be permanently deleted soon";
    } else if (daysLeft === 1) {
      return "Will be permanently deleted in 1 day";
    } else {
      return `Will be permanently deleted in ${daysLeft} days`;
    }
  },

  // Get deletion status color
  getDeletionColor: (trashedAt: string): 'green' | 'yellow' | 'red' => {
    const daysLeft = storageManager.getDaysUntilPermanentDeletion(trashedAt);
    if (daysLeft > 7) return 'green';
    if (daysLeft > 3) return 'yellow';
    return 'red';
  },
};

// Export all data
export default {
  mockFolders,
  mockFiles,
  sharedFolders,
  sharedFiles,
  trashedFolders,
  trashedFiles,
  storageManager,
};