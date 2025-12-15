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
    <div className="flex items-center">
      <Checkbox
        checked={isSelected}
        onCheckedChange={(checked) => {
          if (checked !== "indeterminate") {
            onSelect(folder.id);
          }
        }}
      />
      <div className="w-[24px] h-[24px] bg-blue-100 rounded-lg flex items-center justify-center">
        <Folder className="w-full h-full" />
      </div>
      <span className="font-medium text-sm">{folder.name}</span>
    </div>
  );
}