"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface StorageItem {
  category: string;
  files: number;
  size: string;
}

interface StorageAnalyticsProps {
  usedStorage?: string;
  totalStorage?: string;
  storageItems?: StorageItem[];
  className?: string;
}

export default function StorageAnalytics({
  usedStorage = "40.2 GB",
  totalStorage = "100 GB",
  storageItems = [
    { category: "Documents", files: 420, size: "10.5 GB" },
    { category: "ZIP Files", files: 100, size: "10.5 GB" },
    { category: "Images", files: 1111, size: "10.5 GB" },
    { category: "Videos", files: 130, size: "10.5 GB" },
    { category: "Others", files: 130, size: "10.5 GB" },
  ],
  className = "",
}: StorageAnalyticsProps) {
  const usedPercentage = parseFloat(usedStorage) / parseFloat(totalStorage) * 100;

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
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Storage Analytics</CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0 overflow-auto">
        {/* Storage Summary */}
        <div>
          <div className="text-center">
            <div className="text-2xl font-bold">{usedStorage}</div>
            <p className="text-sm text-gray-600">
              of {totalStorage} has been utilized
            </p>
          </div>
          
          {/* Progress Bar */}
            <div >
              <Progress 
                value={usedPercentage} 
                className="h-[24px] p-[12px]"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0%</span>
                <span>{usedPercentage.toFixed(1)}%</span>
                <span>100%</span>
              </div>
            </div>
        </div>

        {/* Storage Items List */}
        <div className="grid grid-cols-2 gap-[8px]">
          {storageItems.map((item, index) => (
            <div 
              key={index} 
              className="border-fs p-[8px] rounded-lg"
            >
              <div>
                <div className="font-medium">{item.category}</div>
                <div className="text-sm">
                  {formatNumber(item.files)} Files · {item.size}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}