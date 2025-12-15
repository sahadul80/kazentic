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
    <TableRow className="border-bs hover:bg-muted/50 h-[45px]">
      <TableCell role="checkbox" className="pl-[12px]">
        <div className="flex items-center gap-[8px]">
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => {
              if (checked !== "indeterminate") {
                onSelect(file.id);
              }
            }}
            onClick={(e) => e.stopPropagation()}
          />
          <div 
            className="rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${fileColor}20` }}
          >
            <File style={{ color: fileColor }} />
          </div>
          <span 
            className="font-medium text-sm cursor-pointer"
            onClick={() => onAction(file.id, "open")}
          >
            {file.name}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-[8px]">
          <Avatar className="h-[24px] w-[24px]">
            <AvatarFallback className="text-xs">
              {file.owner.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm">{file.owner}</span>
        </div>
      </TableCell>
      <TableCell>
        {(file.sharedWithIds?.length || 0) > 0 ? (
          <div className="flex -space-x-2.5">
            {sharedUsers.map((user, index) => (
              <Avatar key={index} className="border-fs h-[24px] w-[24px]">
                <AvatarFallback className={`text-xs ${getAvatarColor(index)}`}>
                  {user.initials}
                </AvatarFallback>
              </Avatar>
            ))}
            {(file.sharedWithIds?.length || 0) > 4 && (
              <div className="rounded-full border-fs flex items-center justify-center z-10 bg-[#DBE9FF] h-[24px] w-[24px]">
                <span className="text-xs">+{file.sharedWithIds?file.sharedWithIds.length - 3:null}</span>
              </div>
            )}
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">Personal</span>
        )}
      </TableCell>
      <TableCell>{file.size}</TableCell>
      <TableCell>{file.lastModified}</TableCell>
      <TableCell>{file.lastOpened}</TableCell>
      <TableCell>
        <span className="inline-flex items-center text-xs font-semibold transition-colors">
          {file.fileType.toUpperCase()}
        </span>
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-around rotate-90">
          <ActionMenu
            type="file"
            itemId={file.id}
            onAction={(action) => onAction(file.id, action)}
          />
        </div>
      </TableCell>
    </TableRow>
  );
}