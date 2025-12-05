import React, { useMemo } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Eye,
  ChevronLeft,
  ChevronRight,
  Folder,
  File,
  HardDrive,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
} from "lucide-react";

// Import data from mockStorageData
import {
  mockFolders,
  mockFiles,
  sharedFolders,
  sharedFiles,
  trashedFolders,
  trashedFiles,
} from "@/data/mockStorageData";
import { FolderItem, FileItem } from "@/types/storage";

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

function computeTotalSize(items: (FolderItem | FileItem)[]): number {
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

// Type for pie chart data
interface PieChartData {
  name: string;
  value: number;
  color: string;
}

// Type for bar chart data
interface BarChartData {
  name: string;
  value: number;
  percentage: number;
}

// Type for table file item
interface TableFileItem {
  id: number;
  name: string;
  size: string;
  fileType: string;
}

// Simple Pie Chart Component
const SimplePieChart = ({ data }: { data: PieChartData[] }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  let cumulativeAngle = 0;
  const segments = data.map((item, index) => {
    const angle = (item.value / total) * 360;
    const segment = {
      ...item,
      startAngle: cumulativeAngle,
      endAngle: cumulativeAngle + angle,
    };
    cumulativeAngle += angle;
    return segment;
  });

  const size = 200;
  const radius = size / 2;
  const innerRadius = radius * 0.6;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {segments.map((segment, index) => {
          const startAngleRad = (segment.startAngle * Math.PI) / 180;
          const endAngleRad = (segment.endAngle * Math.PI) / 180;
          
          const x1 = radius + radius * Math.cos(startAngleRad);
          const y1 = radius + radius * Math.sin(startAngleRad);
          const x2 = radius + radius * Math.cos(endAngleRad);
          const y2 = radius + radius * Math.sin(endAngleRad);
          
          const x1Inner = radius + innerRadius * Math.cos(startAngleRad);
          const y1Inner = radius + innerRadius * Math.sin(startAngleRad);
          const x2Inner = radius + innerRadius * Math.cos(endAngleRad);
          const y2Inner = radius + innerRadius * Math.sin(endAngleRad);
          
          const largeArcFlag = segment.endAngle - segment.startAngle > 180 ? 1 : 0;
          
          const path = `
            M ${x1Inner} ${y1Inner}
            L ${x1} ${y1}
            A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
            L ${x2Inner} ${y2Inner}
            A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x1Inner} ${y1Inner}
            Z
          `;
          
          return (
            <path
              key={index}
              d={path}
              fill={segment.color}
              stroke="white"
              strokeWidth="2"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <span className="text-3xl font-bold text-gray-800">{Math.round(data[0]?.value || 0)}%</span>
        <span className="text-sm text-gray-600">Used</span>
      </div>
    </div>
  );
};

// Simple Bar Chart Component
const SimpleBarChart = ({ data }: { data: BarChartData[] }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={index} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="font-medium">{item.name}</span>
            <span className="text-gray-600">{item.value.toFixed(1)} MB</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${item.percentage}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

//--------------------------------------------------
// COMPONENT
//--------------------------------------------------
export default function StoragePage() {
  // Calculate storage usage
  const allActiveItems = useMemo(() => {
    return [...mockFolders, ...mockFiles, ...sharedFolders, ...sharedFiles];
  }, []);

  const activeFilesOnly = useMemo(() => {
    return [...mockFiles, ...sharedFiles];
  }, []);

  const usedMB = useMemo(() => computeTotalSize(allActiveItems), [allActiveItems]);
  const totalMB = 100 * 1024; // 100 GB in MB
  const usedPercent = useMemo(() => Math.round((usedMB / totalMB) * 100), [usedMB]);
  const freePercent = 100 - usedPercent;

  const pieData: PieChartData[] = [
    { name: "Used", value: usedPercent, color: "#3B82F6" },
    { name: "Free", value: freePercent, color: "#FBBF24" },
  ];

  // Calculate category data
  const barData = useMemo(() => {
    const categoryTotals: { [key: string]: number } = {};
    
    // Initialize all categories with 0
    Object.keys(categoriesConfig).forEach(key => {
      categoryTotals[key] = 0;
    });

    // Sum up sizes by category
    activeFilesOnly.forEach((file) => {
      const category = getFileCategory(file.fileType);
      const sizeMB = parseSize(file.size);
      if (categoryTotals[category] !== undefined) {
        categoryTotals[category] += sizeMB;
      } else {
        categoryTotals['other'] += sizeMB;
      }
    });

    const totalCategorySize = Object.values(categoryTotals).reduce((a, b) => a + b, 0);
    
    // Convert to bar chart data format
    return Object.keys(categoriesConfig)
      .map((key) => ({
        name: categoriesConfig[key],
        value: Math.round(categoryTotals[key] * 100) / 100,
        percentage: totalCategorySize > 0 ? (categoryTotals[key] / totalCategorySize) * 100 : 0,
      }))
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [activeFilesOnly]);

  // Prepare table data
  const tableData = useMemo(() => {
    return activeFilesOnly.slice(0, 6).map(file => ({
      id: file.id,
      name: file.name,
      size: file.size,
      fileType: file.fileType,
    }));
  }, [activeFilesOnly]);

  return (
    <div className="w-full p-6 space-y-6 bg-[#f7f8fc] min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Storage Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor your storage usage and file categories</p>
        </div>
        <Button variant="outline">
          <HardDrive className="mr-2 h-4 w-4" />
          Storage Settings
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Storage</p>
                <p className="text-2xl font-bold">100 GB</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <HardDrive className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Storage Used</p>
                <p className="text-2xl font-bold">{(usedMB / 1024).toFixed(1)} GB</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <PieChartIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Files</p>
                <p className="text-2xl font-bold">{activeFilesOnly.length}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <File className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Folders</p>
                <p className="text-2xl font-bold">{mockFolders.length + sharedFolders.length}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Folder className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* STORAGE STATUS + FILE CATEGORIES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Storage Status */}
        <Card className="shadow-sm">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Storage Distribution</CardTitle>
            <Button variant="outline" size="sm">Upgrade</Button>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <p className="text-sm text-gray-600 mb-4">Total Size: 100 GB</p>
            
            <SimplePieChart data={pieData} />
            
            <div className="flex justify-center gap-6 mt-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full" /> Used: {usedPercent}%
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-400 rounded-full" /> Free: {freePercent}%
              </div>
            </div>
          </CardContent>
        </Card>

        {/* File Categories */}
        <Card className="shadow-sm">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>File Categories by Size</CardTitle>
            <BarChartIcon className="h-5 w-5 text-gray-500" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">Total Files: {activeFilesOnly.length}</p>
            
            <div className="h-[260px] overflow-y-auto">
              <SimpleBarChart data={barData} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* STORAGE ANALYTICS + FILE LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Storage Analytics */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Storage Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{(usedMB / 1024).toFixed(1)} GB</p>
            <p className="text-sm text-gray-500 mb-4">of 100 GB has been utilized</p>

            <div className="space-y-3">
              {barData.map((category, index) => (
                <div key={`category-${index}`} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <p className="flex-1 text-sm">{category.name}</p>
                  <p className="text-sm font-medium">{(category.value / 1024).toFixed(2)} GB</p>
                </div>
              ))}
              <div className="flex items-center gap-3 pt-2 border-t">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <p className="flex-1 text-sm">Folders</p>
                <p className="text-sm font-medium">
                  {((mockFolders.length + sharedFolders.length) > 0 
                    ? computeTotalSize([...mockFolders, ...sharedFolders]) / 1024 
                    : 0).toFixed(2)} GB
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Files */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Files</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-gray-600">
                    <th className="p-3 text-left">File Name</th>
                    <th className="p-3 text-left">Storage Used</th>
                    <th className="p-3 text-left">File Type</th>
                    <th className="p-3 text-left">Owner</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((file) => {
                    const originalFile = activeFilesOnly.find(f => f.id === file.id);
                    return (
                      <tr key={`file-${file.id}`} className="border-b hover:bg-gray-50">
                        <td className="p-3">{file.name}</td>
                        <td className="p-3">{file.size}</td>
                        <td className="p-3">
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                            {file.fileType}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center">
                            <div className="h-6 w-6 rounded-full bg-gray-300 mr-2" />
                            {originalFile?.owner || "Unknown"}
                          </div>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <Button variant="outline" size="sm">
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>

              <p className="text-sm text-gray-600">Page 1 of 1</p>

              <Button variant="outline" size="sm">
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ADDITIONAL STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Active Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Folders</span>
                <span className="font-semibold">{mockFolders.length + sharedFolders.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Files</span>
                <span className="font-semibold">{mockFiles.length + sharedFiles.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Shared Items</span>
                <span className="font-semibold">{sharedFolders.length + sharedFiles.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Storage Used</span>
                <span className="font-semibold">{(usedMB / 1024).toFixed(1)} GB</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Trash Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Trashed Folders</span>
                <span className="font-semibold">{trashedFolders.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Trashed Files</span>
                <span className="font-semibold">{trashedFiles.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total in Trash</span>
                <span className="font-semibold">{trashedFolders.length + trashedFiles.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Trash Size</span>
                <span className="font-semibold">
                  {(computeTotalSize([...trashedFolders, ...trashedFiles]) / 1024).toFixed(2)} GB
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Storage Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Storage Used</span>
                <span className="font-semibold">{(usedMB / 1024).toFixed(1)} GB</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Storage Free</span>
                <span className="font-semibold">{((totalMB - usedMB) / 1024).toFixed(1)} GB</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Usage Percentage</span>
                <span className="font-semibold">{usedPercent}%</span>
              </div>
              <div className="pt-2">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{usedPercent}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${usedPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}