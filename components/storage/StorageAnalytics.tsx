"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { mockFiles } from "@/data/mockStorageData";
import { FileText, Archive, Image, Video, File } from "lucide-react";
import { useMemo } from "react";

interface StorageItem {
  category: string;
  files: number;
  size: string;
  color: string;
  icon: React.ReactNode;
}

interface StorageAnalyticsProps {
  usedStorage?: string;
  totalStorage?: string;
  storageItems?: StorageItem[];
  className?: string;
}

// Helper function to parse size string to MB
function parseSizeToMB(sizeString: string): number {
  if (!sizeString) return 0;
  
  const sizeMatch = sizeString.toLowerCase().match(/([\d.]+)\s*(mb|gb|kb)/i);
  if (!sizeMatch) return 0;
  
  const value = parseFloat(sizeMatch[1]);
  const unit = sizeMatch[2].toLowerCase();
  
  switch (unit) {
    case 'gb':
      return value * 1024;
    case 'mb':
      return value;
    case 'kb':
      return value / 1024;
    default:
      return value;
  }
}

// Helper function to format MB to GB with 1 decimal place
function formatMBtoGB(mb: number): string {
  return `${(mb / 1024).toFixed(1)} GB`;
}

export default function StorageAnalytics({
  usedStorage,
  totalStorage = "100 GB",
  storageItems,
  className = "",
}: StorageAnalyticsProps) {
  // Calculate storage analytics from mock data
  const analytics = useMemo(() => {
    // Define file type categories
    const documentTypes = ['PDF', 'DOCX', 'PPTX', 'XLSX', 'MD', 'TXT'];
    const imageTypes = ['JPG', 'PNG', 'SVG', 'GIF', 'BMP'];
    const videoTypes = ['MP4', 'MKV', 'MOV', 'AVI', 'WMV'];
    const archiveTypes = ['ZIP', 'RAR', '7Z'];
    const otherTypes = ['Figma', 'SQL', 'HTML', 'CSV', 'JSON', 'XML'];
    
    // Initialize categories
    const categories = {
      documents: { count: 0, sizeMB: 0, color: "#4299E1", icon: <FileText className="w-4 h-4" /> },
      images: { count: 0, sizeMB: 0, color: "#48BB78", icon: <Image className="w-4 h-4" /> },
      videos: { count: 0, sizeMB: 0, color: "#ED8936", icon: <Video className="w-4 h-4" /> },
      archives: { count: 0, sizeMB: 0, color: "#9F7AEA", icon: <Archive className="w-4 h-4" /> },
      others: { count: 0, sizeMB: 0, color: "#718096", icon: <File className="w-4 h-4" /> },
    };
    
    // Process all files
    let totalSizeMB = 0;
    
    mockFiles.forEach(file => {
      if (!file.isTrashed) {
        const fileSizeMB = parseSizeToMB(file.size);
        totalSizeMB += fileSizeMB;
        
        const fileType = file.fileType?.toUpperCase();
        
        if (documentTypes.includes(fileType)) {
          categories.documents.count++;
          categories.documents.sizeMB += fileSizeMB;
        } else if (imageTypes.includes(fileType)) {
          categories.images.count++;
          categories.images.sizeMB += fileSizeMB;
        } else if (videoTypes.includes(fileType)) {
          categories.videos.count++;
          categories.videos.sizeMB += fileSizeMB;
        } else if (archiveTypes.includes(fileType)) {
          categories.archives.count++;
          categories.archives.sizeMB += fileSizeMB;
        } else {
          categories.others.count++;
          categories.others.sizeMB += fileSizeMB;
        }
      }
    });
    
    // Calculate total used storage in GB
    const totalUsedGB = (totalSizeMB / 1024).toFixed(1);
    const totalGB = parseFloat(totalStorage);
    const usedPercentage = (parseFloat(totalUsedGB) / totalGB) * 100;
    
    // Format storage items for display
    const formattedStorageItems: StorageItem[] = [
      {
        category: "Documents",
        files: categories.documents.count,
        size: formatMBtoGB(categories.documents.sizeMB),
        color: categories.documents.color,
        icon: categories.documents.icon,
      },
      {
        category: "Images",
        files: categories.images.count,
        size: formatMBtoGB(categories.images.sizeMB),
        color: categories.images.color,
        icon: categories.images.icon,
      },
      {
        category: "Videos",
        files: categories.videos.count,
        size: formatMBtoGB(categories.videos.sizeMB),
        color: categories.videos.color,
        icon: categories.videos.icon,
      },
      {
        category: "ZIP Files",
        files: categories.archives.count,
        size: formatMBtoGB(categories.archives.sizeMB),
        color: categories.archives.color,
        icon: categories.archives.icon,
      },
      {
        category: "Others",
        files: categories.others.count,
        size: formatMBtoGB(categories.others.sizeMB),
        color: categories.others.color,
        icon: categories.others.icon,
      },
    ];
    
    return {
      usedStorage: `${totalUsedGB} GB`,
      usedPercentage,
      storageItems: formattedStorageItems,
      totalSizeMB,
      categories,
    };
  }, [totalStorage]);

  // Calculate gradient for progress bar based on category sizes
  const getProgressGradient = useMemo(() => {
    const totalSizeMB = analytics.totalSizeMB;
    const { categories } = analytics;
    
    if (totalSizeMB === 0) return "#4299E1"; // Default blue if no data
    
    // Calculate percentages for each category
    const categoryData = [
      { color: categories.documents.color, sizeMB: categories.documents.sizeMB },
      { color: categories.images.color, sizeMB: categories.images.sizeMB },
      { color: categories.videos.color, sizeMB: categories.videos.sizeMB },
      { color: categories.archives.color, sizeMB: categories.archives.sizeMB },
      { color: categories.others.color, sizeMB: categories.others.sizeMB },
    ];
    
    // Filter out categories with 0 size
    const activeCategories = categoryData.filter(cat => cat.sizeMB > 0);
    
    if (activeCategories.length === 0) return "#4299E1";
    if (activeCategories.length === 1) return activeCategories[0].color;
    
    // Create gradient stops
    let gradientStops: string[] = [];
    let accumulatedPercentage = 0;
    
    activeCategories.forEach((cat, index) => {
      const percentage = (cat.sizeMB / totalSizeMB) * 100;
      const start = accumulatedPercentage;
      const end = start + percentage;
      
      gradientStops.push(`${cat.color} ${start}% ${end}%`);
      accumulatedPercentage = end;
    });
    
    return `linear-gradient(90deg, ${gradientStops.join(', ')})`;
  }, [analytics]);

  // Custom Progress component with gradient
  const CustomProgress = ({ value }: { value: number }) => {
    return (
      <div className="relative h-[24px] w-full">
        <Progress 
          value={value} 
          className="h-[24px]"
          style={{
            background: getProgressGradient,
          }}
        />
      </div>
    );
  };

  // Format large numbers with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <Card 
      className={`shadow-sm border-fs ${className}`}
      style={{
        minWidth: "375px",
        height: "400px",
        borderRadius: "12px",
      }}
    >
      <CardHeader className="space-y-4">
        <CardTitle className="text-xl font-semibold">Storage Analytics</CardTitle>
        
        {/* Storage Summary */}
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{analytics.usedStorage}</div>
            <p className="text-sm">
              of {totalStorage} has been utilized
            </p>
          </div>
          
          {/* Progress Bar */}
          <div>
            <CustomProgress value={Math.min(analytics.usedPercentage, 100)} />
            <div className="flex justify-between text-xs text-gray-500 p-[12px]">
              <span>0%</span>
              <span>{analytics.usedPercentage.toFixed(1)}%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 overflow-auto">
        {/* Storage Items List */}
        <div className="grid grid-cols-2 gap-[12px]">
          {analytics.storageItems.map((item, index) => (
            <div 
              key={index} 
              className="border border-[#EBEBEB] p-[12px] rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start gap-[8px]">
                <div 
                  className="rounded flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${item.color}20` }}
                >
                  <div style={{ color: item.color }}>
                    {item.icon}
                  </div>
                </div>
                <div>
                  <div className="font-medium text-sm">{item.category}</div>
                  <div className="text-xs text-gray-600">
                    {formatNumber(item.files)} Files · {item.size}
                  </div>
                  <div 
                    className="h-1 w-full bg-gray-100 rounded-full overflow-hidden mt-1"
                  >
                    <div 
                      className="h-full rounded-full"
                      style={{
                        width: `${(parseSizeToMB(item.size) / analytics.totalSizeMB) * 100 || 0}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}