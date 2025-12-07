import { FolderItem, FileItem } from "@/types/storage";

// ==================== USERS ====================
export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'editor' | 'viewer';
}

export const mockUsers: User[] = [
  { id: 1, name: "Pat Cummins", email: "pat@example.com", role: "admin" },
  { id: 2, name: "Sarah Chen", email: "sarah@example.com", role: "editor" },
  { id: 3, name: "Alex Morgan", email: "alex@example.com", role: "editor" },
  { id: 4, name: "CEO Office", email: "ceo@example.com", role: "admin" },
  { id: 5, name: "Marketing Team", email: "marketing@example.com", role: "editor" },
  { id: 6, name: "Design Team", email: "design@example.com", role: "editor" },
  { id: 7, name: "Finance Team", email: "finance@example.com", role: "viewer" },
  { id: 8, name: "Engineering", email: "eng@example.com", role: "editor" },
];

// ==================== WORKSPACES ====================
export interface Workspace {
  id: number;
  name: string;
  description: string;
  ownerId: number; // User who created the workspace
  memberIds: number[]; // User IDs who are members
  color: string;
  createdAt: string;
}

export const mockWorkspaces: Workspace[] = [
  {
    id: 1,
    name: "Project Alpha",
    description: "Main project workspace",
    ownerId: 1,
    memberIds: [1, 2, 3, 8],
    color: "blue",
    createdAt: "2025-01-15",
  },
  {
    id: 2,
    name: "Marketing Campaigns",
    description: "Marketing materials and campaigns",
    ownerId: 5,
    memberIds: [5, 2, 7, 1],
    color: "green",
    createdAt: "2025-03-20",
  },
  {
    id: 3,
    name: "Design System",
    description: "Design assets and guidelines",
    ownerId: 2,
    memberIds: [2, 3, 6, 1],
    color: "purple",
    createdAt: "2025-02-10",
  },
];

// ==================== SHARING RELATIONSHIPS ====================
export interface SharingRecord {
  id: number;
  itemId: number;
  itemType: 'file' | 'folder';
  sharedById: number; // User who shared the item
  sharedWithId: number; // User or Group who received the share
  permission: 'view' | 'edit' | 'admin';
  sharedAt: string;
  workspaceId?: number; // If shared via workspace
}

// ==================== ENHANCED INTERFACES ====================
export interface EnhancedFolderItem extends FolderItem {
  ownerId: number;
  sharedWithIds: number[]; // User IDs this is shared with
  workspaceId?: number; // If part of a workspace
  sharingRecords?: SharingRecord[]; // Detailed sharing history
  parentFolderId?: number; // For nested folders
  tags: string[];
  fileIds: string[]; // IDs of files inside this folder
  childFolderIds?: string[]; // IDs of subfolders inside this folder
}

export interface EnhancedFileItem extends FileItem {
  ownerId: number;
  sharedWithIds: number[];
  workspaceId?: number;
  sharingRecords?: SharingRecord[];
  folderId?: number; // Parent folder
  version: number;
  tags: string[];
}

// ==================== ACTIVE FOLDERS (NOT IN TRASH) ====================
export const mockFolders: EnhancedFolderItem[] = [
  {
    id: 1,
    name: "Project Documents",
    owner: "Pat Cummins",
    ownerId: 1,
    size: "12 MB",
    lastModified: "Aug 12, 2025",
    lastOpened: "Aug 12, 2025",
    dateAdded: "2025-08-01",
    type: "folder",
    sharedWith: 3, // Count of users shared with
    sharedWithIds: [2, 3, 8], // Sarah, Alex, Engineering
    workspaceId: 1, // Part of Project Alpha
    color: "blue",
    isTrashed: false,
    tags: ["project", "docs", "important"],
    parentFolderId: undefined, // Root folder
    fileIds: ["101", "110", "111", "112", "113", "114", "115", "116", "117", "118", "119", "120"],
    childFolderIds: ["3"] // Contains Meeting Notes folder
  },
  {
    id: 2,
    name: "Design Assets",
    owner: "Sarah Chen",
    ownerId: 2,
    size: "45 MB",
    lastModified: "Aug 12, 2025",
    lastOpened: "Aug 12, 2025",
    dateAdded: "2025-07-15",
    type: "folder",
    sharedWith: 5,
    sharedWithIds: [1, 3, 5, 6, 8], // Pat, Alex, Marketing, Design, Engineering
    workspaceId: 3, // Part of Design System
    color: "blue",
    isTrashed: false,
    tags: ["design", "assets", "branding"],
    parentFolderId: undefined, // Root folder
    fileIds: ["102", "104", "121", "122", "123", "124", "125", "126"],
    childFolderIds: ["6"] // Contains UI Components folder
  },
  {
    id: 3,
    name: "Meeting Notes",
    owner: "Pat Cummins",
    ownerId: 1,
    size: "3 MB",
    lastModified: "Aug 12, 2025",
    lastOpened: "Aug 12, 2025",
    dateAdded: "2025-08-10",
    type: "folder",
    sharedWith: 2,
    sharedWithIds: [2, 8], // Sarah, Engineering
    workspaceId: 1,
    color: "blue",
    isTrashed: false,
    tags: ["meetings", "notes", "internal"],
    parentFolderId: 1, // Inside Project Documents
    fileIds: ["103", "127", "128"],
    childFolderIds: [] // No subfolders
  },
  {
    id: 4,
    name: "Archived Files",
    owner: "Pat Cummins",
    ownerId: 1,
    size: "156 MB",
    lastModified: "Aug 12, 2025",
    lastOpened: "Aug 12, 2025",
    dateAdded: "2025-06-01",
    type: "folder",
    sharedWith: 1,
    sharedWithIds: [7], // Finance Team only
    color: "blue",
    isTrashed: false,
    tags: ["archive", "old", "backup"],
    parentFolderId: undefined, // Root folder
    fileIds: ["106", "129", "130", "131", "132", "133"],
    childFolderIds: [] // No subfolders
  },
  {
    id: 5,
    name: "Client Presentations",
    owner: "Marketing Team",
    ownerId: 5,
    size: "28 MB",
    lastModified: "Aug 11, 2025",
    lastOpened: "Aug 11, 2025",
    dateAdded: "2025-07-20",
    type: "folder",
    sharedWith: 4,
    sharedWithIds: [1, 2, 3, 7], // Pat, Sarah, Alex, Finance
    workspaceId: 2, // Part of Marketing Campaigns
    color: "blue",
    isTrashed: false,
    tags: ["clients", "presentations", "external"],
    parentFolderId: undefined, // Root folder
    fileIds: ["105", "134", "135", "136", "137", "138", "139"],
    childFolderIds: [] // No subfolders
  },
  {
    id: 6,
    name: "UI Components",
    owner: "Sarah Chen",
    ownerId: 2,
    size: "18 MB",
    lastModified: "Aug 10, 2025",
    lastOpened: "Aug 10, 2025",
    dateAdded: "2025-08-05",
    type: "folder",
    sharedWith: 3,
    sharedWithIds: [3, 6, 8], // Alex, Design Team, Engineering
    workspaceId: 3,
    color: "blue",
    isTrashed: false,
    tags: ["ui", "components", "design"],
    parentFolderId: 2, // Inside Design Assets
    fileIds: ["140", "141", "142", "143", "144", "145", "146", "147"],
    childFolderIds: [] // No subfolders
  },
];

// ==================== ACTIVE FILES ====================
export const mockFiles: EnhancedFileItem[] = [
  {
    id: 101,
    name: "Quarterly Report Q3 2025",
    owner: "Pat Cummins",
    ownerId: 1,
    size: "2.5 MB",
    lastModified: "Aug 12, 2025",
    lastOpened: "Aug 12, 2025",
    dateAdded: "2025-08-12",
    type: "file",
    fileType: "PDF",
    sharedWith: 3,
    sharedWithIds: [2, 3, 7], // Sarah, Alex, Finance
    workspaceId: 1,
    folderId: 1, // In Project Documents
    version: 2,
    color: "red",
    isTrashed: false,
    tags: ["report", "quarterly", "finance"],
  },
  {
    id: 102,
    name: "Product Screenshot - Dashboard",
    owner: "Sarah Chen",
    ownerId: 2,
    size: "1.2 MB",
    lastModified: "Aug 12, 2025",
    lastOpened: "Aug 12, 2025",
    dateAdded: "2025-08-12",
    type: "file",
    fileType: "JPG",
    sharedWith: 2,
    sharedWithIds: [1, 3], // Pat, Alex
    workspaceId: 3,
    folderId: 2, // In Design Assets
    version: 1,
    color: "green",
    isTrashed: false,
    tags: ["screenshot", "product", "dashboard"],
  },
  {
    id: 103,
    name: "Team Meeting Recording - August",
    owner: "Pat Cummins",
    ownerId: 1,
    size: "45 MB",
    lastModified: "Aug 12, 2025",
    lastOpened: "Aug 12, 2025",
    dateAdded: "2025-08-12",
    type: "file",
    fileType: "MKV",
    sharedWith: 8,
    sharedWithIds: [2, 3, 4, 5, 6, 7, 8], // Shared with entire company
    workspaceId: 1,
    folderId: 3, // In Meeting Notes
    version: 1,
    color: "purple",
    isTrashed: false,
    tags: ["recording", "meeting", "team"],
  },
  {
    id: 104,
    name: "Company Logo - Vector",
    owner: "CEO Office",
    ownerId: 4,
    size: "0.5 MB",
    lastModified: "Aug 12, 2025",
    lastOpened: "Aug 12, 2025",
    dateAdded: "2025-08-12",
    type: "file",
    fileType: "SVG",
    sharedWith: 0, // Not individually shared but accessible via workspace
    sharedWithIds: [],
    workspaceId: 3, // Available to Design System workspace
    folderId: 2, // In Design Assets
    version: 3,
    color: "blue",
    isTrashed: false,
    tags: ["logo", "brand", "vector"],
  },
  {
    id: 105,
    name: "Project Proposal",
    owner: "Alex Morgan",
    ownerId: 3,
    size: "3.8 MB",
    lastModified: "Aug 11, 2025",
    lastOpened: "Aug 11, 2025",
    dateAdded: "2025-08-11",
    type: "file",
    fileType: "DOCX",
    sharedWith: 4,
    sharedWithIds: [1, 2, 5, 8], // Pat, Sarah, Marketing, Engineering
    workspaceId: 1,
    folderId: 5, // In Client Presentations
    version: 4,
    color: "orange",
    isTrashed: false,
    tags: ["proposal", "project", "client"],
  },
  {
    id: 106,
    name: "Budget Spreadsheet",
    owner: "Finance Team",
    ownerId: 7,
    size: "0.8 MB",
    lastModified: "Aug 10, 2025",
    lastOpened: "Aug 10, 2025",
    dateAdded: "2025-08-10",
    type: "file",
    fileType: "XLSX",
    sharedWith: 2,
    sharedWithIds: [1, 4], // Pat, CEO Office
    workspaceId: undefined, // Not in a workspace
    folderId: 4, // In Archived Files
    version: 1,
    color: "green",
    isTrashed: false,
    tags: ["budget", "finance", "spreadsheet"],
  },
];

// ==================== SHARED ITEMS (VIEW FROM CURRENT USER'S PERSPECTIVE) ====================
// These are items shared with the current user (Pat Cummins, id: 1)
export const sharedFolders: EnhancedFolderItem[] = [
  {
    id: 51,
    name: "Shared Project Docs",
    owner: "Sarah Chen",
    ownerId: 2,
    size: "45 MB",
    lastModified: "Aug 12, 2025",
    lastOpened: "Aug 12, 2025",
    dateAdded: "2025-08-12",
    type: "folder",
    sharedWith: 5,
    sharedWithIds: [1, 3, 5, 6, 8], // Includes Pat (id:1)
    workspaceId: undefined,
    color: "blue",
    isTrashed: false,
    tags: ["shared", "project", "collaboration"],
    parentFolderId: undefined,
    fileIds: ["151", "152", "153", "154", "155", "156", "157", "158", "159", "160", "161", "162"],
    childFolderIds: []
  },
  {
    id: 52,
    name: "Team Design Assets",
    owner: "Sarah Chen",
    ownerId: 2,
    size: "120 MB",
    lastModified: "Aug 11, 2025",
    lastOpened: "Aug 11, 2025",
    dateAdded: "2025-08-11",
    type: "folder",
    sharedWith: 8,
    sharedWithIds: [1, 3, 4, 5, 6, 7, 8], // Company-wide share
    workspaceId: 3,
    color: "blue",
    isTrashed: false,
    tags: ["design", "team", "assets"],
    parentFolderId: undefined,
    fileIds: ["163", "164", "165", "166", "167", "168", "169", "170"],
    childFolderIds: []
  },
  {
    id: 53,
    name: "Marketing Materials",
    owner: "Marketing Team",
    ownerId: 5,
    size: "65 MB",
    lastModified: "Aug 09, 2025",
    lastOpened: "Aug 09, 2025",
    dateAdded: "2025-08-09",
    type: "folder",
    sharedWith: 6,
    sharedWithIds: [1, 2, 3, 4, 6, 7], // Pat and others
    workspaceId: 2,
    color: "green",
    isTrashed: false,
    tags: ["marketing", "materials", "campaign"],
    parentFolderId: undefined,
    fileIds: ["171", "172", "173", "174", "175", "176", "177", "178", "179", "180", "181", "182", "183", "184", "185"],
    childFolderIds: []
  },
];

export const sharedFiles: EnhancedFileItem[] = [
  {
    id: 151,
    name: "Q3 Team Report",
    owner: "Sarah Chen",
    ownerId: 2,
    size: "4.5 MB",
    lastModified: "Aug 12, 2025",
    lastOpened: "Aug 12, 2025",
    dateAdded: "2025-08-12",
    type: "file",
    fileType: "PDF",
    sharedWith: 8,
    sharedWithIds: [1, 3, 4, 5, 6, 7, 8], // Company-wide
    workspaceId: 1,
    folderId: 51,
    version: 1,
    color: "red",
    isTrashed: false,
    tags: ["report", "team", "quarterly"],
  },
  {
    id: 152,
    name: "Company All Hands Deck",
    owner: "CEO Office",
    ownerId: 4,
    size: "8.2 MB",
    lastModified: "Aug 11, 2025",
    lastOpened: "Aug 11, 2025",
    dateAdded: "2025-08-11",
    type: "file",
    fileType: "PPTX",
    sharedWith: 50, // Large share count
    sharedWithIds: [1, 2, 3, 5, 6, 7, 8], // All teams
    workspaceId: undefined,
    folderId: undefined,
    version: 2,
    color: "red",
    isTrashed: false,
    tags: ["presentation", "all-hands", "company"],
  },
  {
    id: 153,
    name: "Brand Guidelines",
    owner: "Design Team",
    ownerId: 6,
    size: "12.3 MB",
    lastModified: "Aug 08, 2025",
    lastOpened: "Aug 08, 2025",
    dateAdded: "2025-08-08",
    type: "file",
    fileType: "PDF",
    sharedWith: 12,
    sharedWithIds: [1, 2, 3, 4, 5, 7, 8], // All departments
    workspaceId: 3,
    folderId: 52,
    version: 3,
    color: "purple",
    isTrashed: false,
    tags: ["brand", "guidelines", "design"],
  },
];

// ==================== TRASHED ITEMS ====================
export const trashedFolders: (EnhancedFolderItem & { trashedAt: string; originalId?: number })[] = [
  {
    id: 1001,
    originalId: 10,
    name: "Old Reports (deleted)",
    owner: "Pat Cummins",
    ownerId: 1,
    size: "85 MB",
    lastModified: "Jul 1, 2025",
    lastOpened: "Jul 1, 2025",
    dateAdded: "2025-06-15",
    trashedAt: "2025-08-10",
    type: "folder",
    sharedWith: 0,
    sharedWithIds: [],
    workspaceId: undefined,
    color: "gray",
    isTrashed: true,
    tags: ["old", "reports", "deleted"],
    parentFolderId: undefined,
    fileIds: ["2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010"],
    childFolderIds: []
  },
  {
    id: 1002,
    originalId: 8,
    name: "Temporary Files (deleted)",
    owner: "Pat Cummins",
    ownerId: 1,
    size: "15 MB",
    lastModified: "Jul 20, 2025",
    lastOpened: "Jul 20, 2025",
    dateAdded: "2025-07-10",
    trashedAt: "2025-07-25",
    type: "folder",
    sharedWith: 0,
    sharedWithIds: [],
    workspaceId: undefined,
    color: "gray",
    isTrashed: true,
    tags: ["temporary", "deleted"],
    parentFolderId: undefined,
    fileIds: ["2011", "2012", "2013", "2014", "2015", "2016", "2017"],
    childFolderIds: []
  },
];

export const trashedFiles: (EnhancedFileItem & { trashedAt: string; originalId?: number })[] = [
  {
    id: 2001,
    originalId: 110,
    name: "Old Proposal (deleted)",
    owner: "Pat Cummins",
    ownerId: 1,
    size: "3.2 MB",
    lastModified: "Jun 30, 2025",
    lastOpened: "Jun 30, 2025",
    dateAdded: "2025-06-15",
    trashedAt: "2025-08-05",
    type: "file",
    fileType: "DOCX",
    sharedWith: 0,
    sharedWithIds: [],
    workspaceId: 1,
    folderId: 1001,
    version: 1,
    color: "gray",
    isTrashed: true,
    tags: ["proposal", "old", "deleted"],
  },
  {
    id: 2002,
    originalId: 115,
    name: "Draft Presentation (deleted)",
    owner: "Pat Cummins",
    ownerId: 1,
    size: "5.7 MB",
    lastModified: "Jul 5, 2025",
    lastOpened: "Jul 5, 2025",
    dateAdded: "2025-07-01",
    trashedAt: "2025-07-10",
    type: "file",
    fileType: "PPTX",
    sharedWith: 0,
    sharedWithIds: [],
    workspaceId: 1,
    folderId: 1001,
    version: 3,
    color: "gray",
    isTrashed: true,
    tags: ["draft", "presentation", "deleted"],
  },
  {
    id: 2003,
    originalId: 120,
    name: "Test Data (deleted)",
    owner: "Sarah Chen",
    ownerId: 2,
    size: "12.5 MB",
    lastModified: "Jun 1, 2025",
    lastOpened: "Jun 1, 2025",
    dateAdded: "2025-05-20",
    trashedAt: "2025-06-05",
    type: "file",
    fileType: "CSV",
    sharedWith: 0,
    sharedWithIds: [],
    workspaceId: 3,
    folderId: undefined,
    version: 1,
    color: "gray",
    isTrashed: true,
    tags: ["test", "data", "deleted"],
  },
];

// ==================== HELPER FUNCTIONS ====================
export const getWorkspaceById = (id: number) => 
  mockWorkspaces.find(ws => ws.id === id);

export const getUserById = (id: number) => 
  mockUsers.find(user => user.id === id);

export const getItemsInWorkspace = (workspaceId: number) => {
  const folders = mockFolders.filter(f => f.workspaceId === workspaceId);
  const files = mockFiles.filter(f => f.workspaceId === workspaceId);
  return { folders, files };
};

export const getItemsSharedWithUser = (userId: number) => {
  const sharedFolders = mockFolders.filter(f => 
    f.sharedWithIds.includes(userId) || 
    (f.workspaceId && getWorkspaceById(f.workspaceId)?.memberIds.includes(userId))
  );
  
  const sharedFiles = mockFiles.filter(f => 
    f.sharedWithIds.includes(userId) || 
    (f.workspaceId && getWorkspaceById(f.workspaceId)?.memberIds.includes(userId))
  );
  
  return { sharedFolders, sharedFiles };
};

export const getItemsByOwner = (ownerId: number) => {
  const folders = mockFolders.filter(f => f.ownerId === ownerId);
  const files = mockFiles.filter(f => f.ownerId === ownerId);
  return { folders, files };
};

// Helper function to get files in a folder
export const getFilesInFolder = (folderId: number): EnhancedFileItem[] => {
  const folder = mockFolders.find(f => f.id === folderId);
  if (!folder) return [];
  
  return mockFiles.filter(file => folder.fileIds.includes(file.id.toString()));
};

// Helper function to get folder by file ID
export const getFolderForFile = (fileId: number): EnhancedFolderItem | undefined => {
  return mockFolders.find(folder => folder.fileIds.includes(fileId.toString()));
};

// Helper function to get child folders of a folder
export const getChildFolders = (folderId: number): EnhancedFolderItem[] => {
  const folder = mockFolders.find(f => f.id === folderId);
  if (!folder?.childFolderIds || folder.childFolderIds.length === 0) return [];
  
  return mockFolders.filter(f => 
    folder.childFolderIds!.includes(f.id.toString())
  );
};

// Helper function to get all items in a folder (files + child folders count)
export const getItemsCountInFolder = (folderId: number): number => {
  const folder = mockFolders.find(f => f.id === folderId);
  if (!folder) return 0;
  
  const fileCount = folder.fileIds.length;
  const childFolderCount = folder.childFolderIds?.length || 0;
  
  return fileCount + childFolderCount;
};

// Helper function to get total files in a folder (including subfolders recursively)
export const getTotalFilesInFolder = (folderId: number): number => {
  const folder = mockFolders.find(f => f.id === folderId);
  if (!folder) return 0;
  
  let totalFiles = folder.fileIds.length;
  
  // Recursively count files in child folders
  const childFolders = getChildFolders(folderId);
  for (const childFolder of childFolders) {
    totalFiles += getTotalFilesInFolder(childFolder.id);
  }
  
  return totalFiles;
};

// ==================== UPDATED STORAGE MANAGER ====================
export const storageManager = {
  // Move item to trash
  moveToTrash: (
    itemId: number, 
    type: 'folder' | 'file', 
    userId: number,
    source: 'personal' | 'shared' = 'personal'
  ): void => {
    const trashedAt = new Date().toISOString().split('T')[0];
    console.log(`User ${userId} moving ${type} ${itemId} to trash on ${trashedAt}`);
  },

  // Restore item from trash
  restoreFromTrash: (
    trashId: number, 
    type: 'folder' | 'file',
    userId: number
  ): void => {
    console.log(`User ${userId} restoring ${type} ${trashId} from trash`);
  },

  // Permanently delete item
  permanentlyDelete: (
    trashId: number, 
    type: 'folder' | 'file',
    userId: number
  ): void => {
    console.log(`User ${userId} permanently deleting ${type} ${trashId}`);
  },

  // Empty trash for a user
  emptyTrash: (userId: number): void => {
    console.log(`User ${userId} emptying entire trash`);
  },

  // Share item with users
  shareItem: (
    itemId: number,
    itemType: 'folder' | 'file',
    sharedById: number,
    sharedWithIds: number[],
    permission: 'view' | 'edit' | 'admin' = 'view'
  ): void => {
    console.log(`User ${sharedById} sharing ${itemType} ${itemId} with users: ${sharedWithIds.join(', ')}`);
  },

  // Remove sharing access
  unshareItem: (
    itemId: number,
    itemType: 'folder' | 'file',
    userId: number,
    removeUserIds: number[]
  ): void => {
    console.log(`User ${userId} removing access to ${itemType} ${itemId} for users: ${removeUserIds.join(', ')}`);
  },

  // Add item to workspace
  addToWorkspace: (
    itemId: number,
    itemType: 'folder' | 'file',
    workspaceId: number,
    userId: number
  ): void => {
    console.log(`User ${userId} adding ${itemType} ${itemId} to workspace ${workspaceId}`);
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

  // Get files in a folder
  getFilesInFolder: (folderId: number): EnhancedFileItem[] => {
    return getFilesInFolder(folderId);
  },

  // Get folder for a file
  getFolderForFile: (fileId: number): EnhancedFolderItem | undefined => {
    return getFolderForFile(fileId);
  },

  // Add file to folder
  addFileToFolder: (fileId: number, folderId: number): void => {
    const folder = mockFolders.find(f => f.id === folderId);
    if (folder && !folder.fileIds.includes(fileId.toString())) {
      folder.fileIds.push(fileId.toString());
      console.log(`Added file ${fileId} to folder ${folderId}`);
    }
  },

  // Remove file from folder
  removeFileFromFolder: (fileId: number, folderId: number): void => {
    const folder = mockFolders.find(f => f.id === folderId);
    if (folder) {
      const index = folder.fileIds.indexOf(fileId.toString());
      if (index > -1) {
        folder.fileIds.splice(index, 1);
        console.log(`Removed file ${fileId} from folder ${folderId}`);
      }
    }
  },

  // Get child folders of a folder
  getChildFolders: (folderId: number): EnhancedFolderItem[] => {
    return getChildFolders(folderId);
  },

  // Get items count in folder (files + child folders)
  getItemsCountInFolder: (folderId: number): number => {
    return getItemsCountInFolder(folderId);
  },

  // Get total files count in folder (including subfolders recursively)
  getTotalFilesInFolder: (folderId: number): number => {
    return getTotalFilesInFolder(folderId);
  },

  // Add child folder to parent folder
  addChildFolder: (childFolderId: number, parentFolderId: number): void => {
    const parentFolder = mockFolders.find(f => f.id === parentFolderId);
    const childFolder = mockFolders.find(f => f.id === childFolderId);
    
    if (parentFolder && childFolder) {
      if (!parentFolder.childFolderIds) {
        parentFolder.childFolderIds = [];
      }
      
      if (!parentFolder.childFolderIds.includes(childFolderId.toString())) {
        parentFolder.childFolderIds.push(childFolderId.toString());
        childFolder.parentFolderId = parentFolderId;
        console.log(`Added folder ${childFolderId} as child of folder ${parentFolderId}`);
      }
    }
  },

  // Remove child folder from parent folder
  removeChildFolder: (childFolderId: number, parentFolderId: number): void => {
    const parentFolder = mockFolders.find(f => f.id === parentFolderId);
    if (parentFolder?.childFolderIds) {
      const index = parentFolder.childFolderIds.indexOf(childFolderId.toString());
      if (index > -1) {
        parentFolder.childFolderIds.splice(index, 1);
        console.log(`Removed folder ${childFolderId} from parent folder ${parentFolderId}`);
      }
    }
  },
};

// ==================== EXPORT ALL ====================
export default {
  mockUsers,
  mockWorkspaces,
  mockFolders,
  mockFiles,
  sharedFolders,
  sharedFiles,
  trashedFolders,
  trashedFiles,
  storageManager,
  getWorkspaceById,
  getUserById,
  getItemsInWorkspace,
  getItemsSharedWithUser,
  getItemsByOwner,
  getFilesInFolder,
  getFolderForFile,
  getChildFolders,
  getItemsCountInFolder,
  getTotalFilesInFolder,
};