export interface StorageItem {
  id: number;
  name: string;
  owner: string;
  ownerId: number;
  size: string;
  lastModified: string;
  lastOpened: string;
  dateAdded: string;
  sharedWith: number;
  isTrashed: boolean;
  trashedAt?: string;
  originalId?: number;
  color: string;
  workspaceId?: number;
  tags?: string[];
  sharedWithIds?: number[];
}

export interface FolderItem extends StorageItem {
  type: "folder";
  filesInside?: number;
}

export interface FileItem extends StorageItem {
  type: "file";
  fileType: string;
  version?: number;
}

export type TrashedFolderItem = FolderItem & { 
  trashedAt: string; 
  originalId?: number;
};

export type TrashedFileItem = FileItem & { 
  trashedAt: string; 
  originalId?: number;
};

export type ViewMode = "list" | "grid" | "table";

export interface FilterType {
  category: string;
  lastModified: string;
  dateAdded: string;
  people: string;
  search: string;
  fileType?: string;
  size?: string;
}

export type SortConfig = {
  key: string;
  direction: "ascending" | "descending";
} | null;

export type ActionType = "save-as" | "rename" | "share" | "copy" | "info" | "move" | "delete" | "open" | "download" | "preview" | "restore" | "permanent-delete" | "empty-trash" | "create-folder" | "upload" | "bulk-delete" | "bulk-move" | "bulk-share";

export interface EnhancedFolderItem extends FolderItem {
  parentFolderId?: number;
  fileIds?: string[];
  childFolderIds?: string[];
  sharingRecords?: SharingRecord[];
}

export interface EnhancedFileItem extends FileItem {
  folderId?: number;
  sharingRecords?: SharingRecord[];
  version: number;
  mimeType?: string;
  checksum?: string;
  location?: string;
  thumbnail?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'editor' | 'viewer';
  storageQuota?: number;
  storageUsed?: number;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  defaultView: ViewMode;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  showHiddenFiles: boolean;
  showFileExtensions: boolean;
  theme: 'light' | 'dark' | 'system';
}

export interface Workspace {
  id: number;
  name: string;
  description: string;
  ownerId: number;
  memberIds: number[];
  color: string;
  createdAt: string;
  storageQuota?: number;
  storageUsed?: number;
  settings?: WorkspaceSettings;
}

export interface WorkspaceSettings {
  allowExternalSharing: boolean;
  requireApprovalForSharing: boolean;
  maxFileSize: number;
  allowedFileTypes: string[];
  autoExpireLinks: boolean;
  linkExpiryDays: number;
}

export interface SharingRecord {
  id: number;
  itemId: number;
  itemType: 'file' | 'folder';
  sharedById: number;
  sharedWithId: number;
  permission: 'view' | 'edit' | 'admin';
  sharedAt: string;
  expiresAt?: string;
  workspaceId?: number;
}

export interface Permission {
  userId: number;
  itemId: number;
  itemType: 'file' | 'folder';
  permission: 'view' | 'edit' | 'admin';
  grantedAt: string;
  grantedBy: number;
}

export interface StorageAnalytics {
  total: number;
  used: number;
  available: number;
  usedPercentage: number;
  folders: number;
  files: number;
  shared: number;
  byCategory: StorageCategory[];
  recentActivity: RecentActivity[];
}

export interface StorageCategory {
  name: string;
  value: number;
  percentage: number;
  count: number;
  color: string;
}

export interface RecentActivity {
  id: number;
  type: 'upload' | 'download' | 'share' | 'delete' | 'rename' | 'move';
  itemId: number;
  itemName: string;
  itemType: 'file' | 'folder';
  userId: number;
  userName: string;
  timestamp: string;
  details?: Record<string, any>;
}

export interface BreadcrumbItem {
  id: number;
  name: string;
  type?: 'workspace' | 'folder' | 'root';
  workspaceId?: number;
}

export interface SelectionInfo {
  count: number;
  size: string;
  folders: number;
  files: number;
  items: (EnhancedFolderItem | EnhancedFileItem)[];
  totalSizeMB: number;
}

export interface StorageStats {
  personal: {
    total: number;
    used: number;
    folders: number;
    files: number;
  };
  shared: {
    total: number;
    used: number;
    folders: number;
    files: number;
  };
  workspaces: {
    [workspaceId: number]: {
      name: string;
      total: number;
      used: number;
      folders: number;
      files: number;
    };
  };
}

export interface FileUpload {
  id: string;
  file: File;
  name: string;
  size: number;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
  uploadedAt?: string;
  folderId?: number;
  workspaceId?: number;
}

export interface StorageConfig {
  maxFileSize: number;
  allowedFileTypes: string[];
  maxTotalStorage: number;
  chunkSize: number;
  concurrentUploads: number;
  enableEncryption: boolean;
  backupEnabled: boolean;
  versioningEnabled: boolean;
}

export interface LocalStorageUserData {
  id: number;
  name: string;
  email: string;
  role: string;
  workspaceIds: number[];
  preferences?: UserPreferences;
  token?: string;
  expiresAt?: string;
  lastLogin?: string;
}

export interface LocalStorageWorkspaceData {
  id: number;
  name: string;
  description: string;
  ownerId: number;
  memberIds: number[];
  color: string;
  createdAt: string;
  settings?: WorkspaceSettings;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface StorageApiResponse {
  items: (EnhancedFolderItem | EnhancedFileItem)[];
  breadcrumbs: BreadcrumbItem[];
  stats: StorageStats;
  currentFolder?: EnhancedFolderItem;
  workspace?: Workspace;
}

export interface SearchResult {
  folders: EnhancedFolderItem[];
  files: EnhancedFileItem[];
  total: number;
  query: string;
  took: number;
}

export interface FilePreview {
  id: number;
  name: string;
  type: string;
  mimeType: string;
  size: string;
  url: string;
  thumbnail?: string;
  canPreview: boolean;
  previewType: 'image' | 'pdf' | 'video' | 'audio' | 'text' | 'office' | 'other';
}

export interface BulkOperation {
  action: ActionType;
  items: number[];
  params?: Record<string, any>;
}

export interface DragItem {
  type: 'file' | 'folder';
  id: number;
  name: string;
  fromFolderId?: number;
  fromWorkspaceId?: number;
}

export interface ContextMenuItem {
  id: string;
  label: string;
  action: ActionType;
  icon?: string;
  shortcut?: string;
  divider?: boolean;
  disabled?: boolean;
  hidden?: boolean;
}

export interface StorageEvent {
  type: 'itemAdded' | 'itemDeleted' | 'itemUpdated' | 'itemMoved' | 'itemShared' | 'uploadProgress' | 'uploadComplete' | 'uploadError';
  data: any;
  timestamp: string;
  userId: number;
}

export type {
  StorageItem as BaseStorageItem,
  EnhancedFolderItem as Folder,
  EnhancedFileItem as File,
};