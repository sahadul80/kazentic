// components/storage/FilesListRow.tsx
"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ActionMenu } from "./ActionMenu";
import { EnhancedFileItem, ActionType } from "@/types/storage";
import { File } from "lucide-react";
import { TableCell, TableRow } from "../ui/table";

interface FilesListRowProps {
  file: EnhancedFileItem;
  isSelected: boolean;
  onSelect: (id: number) => void;
  onAction: (id: number, action: ActionType) => void;
}

export function FilesListRow({ 
  file, 
  isSelected, 
  onSelect, 
  onAction 
}: FilesListRowProps) {
  const getAvatarColor = (index: number) => {
    const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500"];
    return colors[index % colors.length];
  };

  // Calculate shared users count and display first 3
  const sharedUsers = Array.from(
    { length: Math.min(3, file.sharedWithIds?.length || 0) },
    (_, i) => ({ 
      initials: `U${i + 1}`,
      id: file.sharedWithIds?.[i] || i + 1
    })
  );

  // Get file icon color based on file type
  const getFileColor = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case "pdf":
        return "#ef4444";
      case "doc":
      case "docx":
        return "#3b82f6";
      case "xls":
      case "xlsx":
      case "csv":
        return "#10b981";
      case "ppt":
      case "pptx":
        return "#f59e0b";
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return "#8b5cf6";
      default:
        return "#6b7280";
    }
  };

  const fileColor = getFileColor(file.fileType);
  
  return (
    <TableRow className="border-b hover:bg-muted/50 h-[60px]">
      <TableCell className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => {
              if (checked !== "indeterminate") {
                onSelect(file.id);
              }
            }}
            className="h-4 w-4"
            onClick={(e) => e.stopPropagation()}
          />
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${fileColor}20` }}
          >
            <File className="h-4 w-4" style={{ color: fileColor }} />
          </div>
          <span 
            className="font-medium text-sm cursor-pointer hover:text-blue-600 hover:underline"
            onClick={() => onAction(file.id, "open")}
          >
            {file.name}
          </span>
        </div>
      </TableCell>
      <TableCell className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs bg-blue-500">
              {file.owner.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm">{file.owner}</span>
        </div>
      </TableCell>
      <TableCell className="px-4 py-3">
        {(file.sharedWithIds?.length || 0) > 0 ? (
          <div className="flex -space-x-2">
            {sharedUsers.map((user, index) => (
              <Avatar key={index} className="border-2 border-background h-6 w-6">
                <AvatarFallback className={`text-xs ${getAvatarColor(index)}`}>
                  {user.initials}
                </AvatarFallback>
              </Avatar>
            ))}
            {(file.sharedWithIds?.length || 0) > 3 && (
              <div className="h-6 w-6 rounded-full bg-gray-200 border-2 border-background flex items-center justify-center">
                <span className="text-xs">+{file.sharedWithIds?file.sharedWithIds.length - 3:null}</span>
              </div>
            )}
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">—</span>
        )}
      </TableCell>
      <TableCell className="px-4 py-3 text-sm">{file.size}</TableCell>
      <TableCell className="px-4 py-3 text-sm">{file.lastModified}</TableCell>
      <TableCell className="px-4 py-3 text-sm">{file.lastOpened}</TableCell>
      <TableCell className="px-4 py-3 text-sm">
        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors">
          {file.fileType.toUpperCase()}
        </span>
      </TableCell>
      <TableCell className="px-4 py-3">
        <ActionMenu
          type="file"
          itemId={file.id}
          onAction={(action) => onAction(file.id, action)}
        />
      </TableCell>
    </TableRow>
  );
}