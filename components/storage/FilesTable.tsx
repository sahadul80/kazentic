"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FilesSection } from "@/components/storage/FilesSection";
import { EnhancedFileItem, SortConfig, ActionType } from "@/types/storage";
import { useState } from "react";

export interface FilesTableProps {
  /** Title of the table */
  title?: string;
  /** Folder name for breadcrumb */
  folderName?: string;
  /** Array of files to display */
  files: EnhancedFileItem[];
  /** Callback when file action is performed */
  onFileAction?: (fileId: number, action: ActionType) => void;
  /** Custom width */
  width?: number;
  /** Custom height */
  height?: number;
}

export default function FilesTable({
  title = "Files",
  folderName = "Folder Name",
  files = [],
  onFileAction = () => {},
  width = 771,
  height = 400,
}: FilesTableProps) {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "name",
    direction: "ascending",
  });

  // Handle selection
  const handleSelectItem = (id: number) => {
    setSelectedItems(prev =>
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = (allIds: number[]) => {
    if (selectedItems.length === allIds.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(allIds);
    }
  };

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev.direction === "ascending" 
        ? "descending" 
        : "ascending",
    }));
  };

  return (
    <Card 
      className="shadow-sm border-fs overflow-hidden flex flex-col"
      style={{
        maxHeight: height,
        minWidth: width,
        borderRadius: "12px",
        borderWidth: "1px",
      }}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold">{title}</CardTitle>
            <div className="text-sm">
              <span>All Folder / </span>
              <span className="font-medium">{folderName}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 flex-1 overflow-auto">
        <div className="h-full overflow-auto">
          <FilesSection
            files={files}
            viewMode="list" // Force list view for table
            selectedItems={selectedItems}
            onSelectItem={handleSelectItem}
            onSelectAll={handleSelectAll}
            onAction={onFileAction}
            onSort={handleSort}
            sortConfig={sortConfig}
            itemsPerPage={6} // Show 6 files per page
          />
        </div>
      </CardContent>
    </Card>
  );
}