"use client"
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Upload,
  FolderPlus,
  SearchIcon,
} from "lucide-react";

// Import data from mockStorageData
import {
  mockFolders,
  mockFiles,
  sharedFolders,
  sharedFiles,
} from "@/data/mockStorageData";
import { FilterType, EnhancedFolderItem } from "@/types/storage";
import { useSidebar } from "../ui/sidebar";
import { AppBreadcrumb } from "../dashboard/app-breadcrumb";
import { usePathname } from "next/navigation";
import StoragePieCard from "./PieChart";
import { FileCategoriesChart } from "./FileCategoriesChart";
import { ResizablePanel, ResizablePanelGroup } from "../ui/resizable";
import StorageAnalytics from "./StorageAnalytics";
import { FilesTable } from "./FilesTable";

//--------------------------------------------------
// HELPER FUNCTIONS
//--------------------------------------------------
function parseSize(sizeString: string): number {
  const size = parseFloat(sizeString.replace(/[^0-9.]/g, ''));
  if (sizeString.toLowerCase().includes('gb')) {
    return size * 1024; // Convert GB to MB
  } else if (sizeString.toLowerCase().includes('mb')) {
    return size;
  } else if (sizeString.toLowerCase().includes('kb')) {
    return size / 1024; // Convert KB to MB
  } else {
    return 0;
  }
}

function computeTotalSize(items: any[]): number {
  let totalMB = 0;
  items.forEach((item) => {
    const sizeMB = parseSize(item.size);
    totalMB += sizeMB;
  });
  return totalMB;
}

// Category mapping configuration
interface CategoryConfig {
  [key: string]: string;
}

const categoriesConfig: CategoryConfig = {
  image: "Images",
  document: "Documents",
  video: "Videos",
  zip: "ZIP Files",
  other: "Others",
  pdf: "PDF",
  spreadsheet: "Spreadsheets",
  presentation: "Presentations",
};

// Map file types to categories
function getFileCategory(fileType: string): string {
  const type = fileType.toLowerCase();
  
  // Image types
  if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp', 'tiff'].includes(type)) {
    return 'image';
  }
  // PDF
  else if (type === 'pdf') {
    return 'pdf';
  }
  // Document types
  else if (['doc', 'docx', 'txt', 'rtf', 'md', 'odt'].includes(type)) {
    return 'document';
  }
  // Spreadsheet types
  else if (['xls', 'xlsx', 'csv', 'ods'].includes(type)) {
    return 'spreadsheet';
  }
  // Video types
  else if (['mp4', 'mkv', 'avi', 'mov', 'wmv', 'flv', 'webm', 'm4v', 'mkv'].includes(type)) {
    return 'video';
  }
  // ZIP/Archive types
  else if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2'].includes(type)) {
    return 'zip';
  }
  // Presentation types
  else if (['ppt', 'pptx', 'key', 'odp'].includes(type)) {
    return 'presentation';
  }
  // Audio types
  else if (['mp3', 'wav', 'aac', 'flac', 'ogg', 'm4a'].includes(type)) {
    return 'other';
  }
  else {
    return 'other';
  }
}

// Prepare storage analytics data
function prepareStorageAnalyticsData() {
  const activeFiles = [...mockFiles, ...sharedFiles];
  
  // Calculate category-wise totals
  const categoryTotals: { [key: string]: { files: number, size: number } } = {};
  
  // Initialize all categories with 0
  Object.keys(categoriesConfig).forEach(key => {
    categoryTotals[key] = { files: 0, size: 0 };
  });

  // Sum up files and sizes by category
  activeFiles.forEach((file) => {
    const category = getFileCategory(file.fileType);
    const sizeMB = parseSize(file.size);
    
    if (categoryTotals[category]) {
      categoryTotals[category].files += 1;
      categoryTotals[category].size += sizeMB;
    } else {
      categoryTotals['other'].files += 1;
      categoryTotals['other'].size += sizeMB;
    }
  });

  // Convert to StorageAnalytics format
  return Object.keys(categoriesConfig)
    .map((key) => ({
      category: categoriesConfig[key],
      files: categoryTotals[key].files,
      size: `${(categoryTotals[key].size / 1024).toFixed(1)} GB`, // Convert MB to GB
    }))
    .filter(item => item.files > 0)
    .sort((a, b) => b.files - a.files);
}

// Default filter object
const defaultFilters: FilterType = {
  category: "",
  lastModified: "",
  dateAdded: "",
  people: "",
  search: "",
};

//--------------------------------------------------
// COMPONENT
//--------------------------------------------------
interface StorageStatusViewProps{
  showBreadcrumbs?: boolean;
  searchPlaceholder?: string;
  filters?: Partial<FilterType>; // Make filters optional and partial
  onSearch?: (query: string) => void;
  showAddNewButton?: boolean;
  onAddNew?: () => void;
  currentFolder?: EnhancedFolderItem | null;
}

export default function StorageStatusView({
  showBreadcrumbs = true,
  searchPlaceholder = "Search files and folders...",
  filters = {},
  onSearch = () => {},
  showAddNewButton = false,
  onAddNew = () => {},
  currentFolder = null,
}: StorageStatusViewProps) {
  const pathname = usePathname()
  
  // Merge provided filters with defaults
  const mergedFilters = useMemo(() => ({
    ...defaultFilters,
    ...filters
  }), [filters]);
  
  // Calculate storage usage using mock data
  const allActiveItems = useMemo(() => {
    return [...mockFolders, ...mockFiles, ...sharedFolders, ...sharedFiles];
  }, []);

  const activeFilesOnly = useMemo(() => {
    return [...mockFiles, ...sharedFiles];
  }, []);

  const usedMB = useMemo(() => computeTotalSize(allActiveItems), [allActiveItems]);
  const totalMB = 100 * 1024; // 100 GB in MB
  const usedPercent = useMemo(() => Math.round((usedMB / totalMB) * 100), [usedMB]);

  // Prepare table data - convert to EnhancedFileItem format
  const enhancedFiles = useMemo(() => {
    return activeFilesOnly.map(file => ({
      ...file,
      owner: file.owner || "User",
      sharedUsers: [],
      lastOpened: file.lastOpened || file.lastModified,
      sizeInBytes: parseSize(file.size) * 1024 * 1024, // Convert MB to bytes
      color: file.color || "#3b82f6",
      ownerId: file.ownerId || 1,
      workspaceId: file.workspaceId || undefined,
      folderId: (file as any).folderId || null,
      parentFolderId: null,
      childFolderIds: [],
      fileIds: [],
      tags: file.tags || [],
      version: (file as any).version || 1,
    }));
  }, [activeFilesOnly]);

  const sidebar = useSidebar();
  const isSidebarCollapsed = sidebar.state === "collapsed";

  // Prepare storage analytics data
  const storageAnalyticsData = useMemo(() => prepareStorageAnalyticsData(), []);

  // Default upload handlers
  const handleUploadFile = () => {
    console.log('Upload file clicked');
  };

  // File action handler
  const handleFileAction = (fileId: number, action: string) => {
    console.log(`Action: ${action} on file ${fileId}`);
  };

  // Get the appropriate title based on storage type and current folder
  const getHeaderTitle = () => {
    if (pathname === "/storage/status") {
      return "Storage Status";
    }
    return "Storage";
  };

  return (
    <div
      className="flex flex-col w-full"
      style={{
        minWidth: isSidebarCollapsed ? 'calc(100vw - 96px)' : 'calc(100vw - 256px)',
        maxWidth: isSidebarCollapsed ? 'calc(100vw - 96px)' : 'calc(100vw - 256px)',
        animation: "ease-in-out"
      }}  
    >
      {/* Sticky Breadcrumb */}
      <div className="sticky top-0 h-[36px] bg-background border-bs flex items-center justify-between px-[24px]">
        <AppBreadcrumb />
      </div>

      {/* Content Area */}
      <div className="w-full max-h-[calc(100vh-96px)] overflow-auto">
        {showBreadcrumbs ? (
          <div className="flex items-center justify-between p-[12px]">
            <h1 className="text-2xl font-semibold tracking-tight">{getHeaderTitle()}</h1>
          </div>
        ) : (
          <div className="border-bs p-[12px]">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold tracking-tight">{getHeaderTitle()}</h1>
              
              <div className="flex items-center gap-4">
                {/* Search Input */}
                <div className="relative w-64">
                  <input
                    placeholder={searchPlaceholder}
                    className="pl-4 pr-10 w-full rounded-md border-fs bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={mergedFilters.search}
                    onChange={(e) => onSearch(e.target.value)}
                  />
                  <SearchIcon/>
                </div>
                
                {/* Action buttons */}
                {showAddNewButton && (
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleUploadFile}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload
                    </Button>
                    <Button
                      size="sm"
                      onClick={onAddNew}
                    >
                      <FolderPlus className="mr-2 h-4 w-4" />
                      New Folder
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Main Content Area */}
        <div className="p-[12px] flex overflow-auto">
          <ResizablePanelGroup direction="vertical" className="max-h-[calc(100vh-100px)] w-full gap-[8px]">
            <ResizablePanel defaultSize={50} minSize={30} className="min-h-[342px]">
              <ResizablePanelGroup direction="horizontal" className="gap-[8px] h-full">
                <ResizablePanel defaultSize={40} minSize={30} className="min-w-[474px]">
                  <StoragePieCard/>
                </ResizablePanel>
                <ResizablePanel defaultSize={60} minSize={40} className="min-w-[672px]">
                  <FileCategoriesChart/>
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
            
            <ResizablePanel defaultSize={50} minSize={40} className="min-h-[400px]">
              <ResizablePanelGroup direction="horizontal" className="gap-[8px] h-full">
                <ResizablePanel defaultSize={33} minSize={30} className="min-w-[375px]">
                  <StorageAnalytics
                    usedStorage={`${(usedMB / 1024).toFixed(1)} GB`}
                    totalStorage="100 GB"
                  />
                </ResizablePanel>
                <ResizablePanel defaultSize={67} minSize={50} className="min-w-[770px]">
                  <FilesTable/>
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </div>
  );
}