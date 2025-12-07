// components/storage/FolderItem.tsx - Updated for list view only to match screenshot
"use client";

import { Folder } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { EnhancedFolderItem } from "@/types/storage";

interface FolderItemProps {
  folder: EnhancedFolderItem;
  isSelected: boolean;
  onSelect: (id: number) => void;
}

export function FolderItem({ folder, isSelected, onSelect }: FolderItemProps) {
  // For list view only - matches the screenshot layout
  return (
    <div className="flex items-center gap-3">
      <Checkbox
        checked={isSelected}
        onCheckedChange={(checked) => {
          if (checked !== "indeterminate") {
            onSelect(folder.id);
          }
        }}
        className="h-4 w-4"
      />
      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
        <Folder className="h-4 w-4 text-blue-600" />
      </div>
      <span className="font-medium text-sm">{folder.name}</span>
    </div>
  );
}