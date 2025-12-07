// components/storage/FoldersListRow.tsx
"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ActionMenu } from "./ActionMenu";
import { EnhancedFolderItem, ActionType } from "@/types/storage";
import { Folder } from "lucide-react";
import { TableCell, TableRow } from "../ui/table";

interface FoldersListRowProps {
  folder: EnhancedFolderItem;
  isSelected: boolean;
  onSelect: (id: number) => void;
  onAction: (id: number, action: ActionType) => void;
  onFolderClick: (folderId: number) => void;
}

export function FoldersListRow({ 
  folder, 
  isSelected, 
  onSelect, 
  onAction,
  onFolderClick 
}: FoldersListRowProps) {
  const getAvatarColor = (index: number) => {
    const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500"];
    return colors[index % colors.length];
  };

  // Calculate shared users count and display first 3
  const sharedUsers = Array.from(
    { length: Math.min(3, folder.sharedWithIds?.length || 0) },
    (_, i) => ({ 
      initials: `U${i + 1}`,
      id: folder.sharedWithIds?.[i] || i + 1
    })
  );

  // Calculate total items in folder (files + child folders)
  const totalFiles = folder.fileIds?.length || 0;
  const totalChildFolders = folder.childFolderIds?.length || 0;
  const totalItems = totalFiles + totalChildFolders;
  
  return (
    <TableRow className="border-b hover:bg-muted/50 h-[60px]">
      <TableCell className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => {
              if (checked !== "indeterminate") {
                onSelect(folder.id);
              }
            }}
            className="h-4 w-4"
            onClick={(e) => e.stopPropagation()}
          />
          <div 
            className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-blue-200"
            onClick={() => onFolderClick(folder.id)}
          >
            <Folder className="h-4 w-4 text-blue-600" />
          </div>
          <span 
            className="font-medium text-sm cursor-pointer hover:text-blue-600 hover:underline"
            onClick={() => onFolderClick(folder.id)}
          >
            {folder.name}
          </span>
        </div>
      </TableCell>
      <TableCell className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs bg-blue-500">
              {folder.owner.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm">{folder.owner}</span>
        </div>
      </TableCell>
      <TableCell className="px-4 py-3">
        {(folder.sharedWithIds?.length || 0) > 0 ? (
          <div className="flex -space-x-2">
            {sharedUsers.map((user, index) => (
              <Avatar key={index} className="border-2 border-background h-6 w-6">
                <AvatarFallback className={`text-xs ${getAvatarColor(index)}`}>
                  {user.initials}
                </AvatarFallback>
              </Avatar>
            ))}
            {(folder.sharedWithIds?.length || 0) > 3 && (
              <div className="h-6 w-6 rounded-full bg-gray-200 border-2 border-background flex items-center justify-center">
                <span className="text-xs">+{folder.sharedWithIds?folder.sharedWithIds.length - 3:null}</span>
              </div>
            )}
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">—</span>
        )}
      </TableCell>
      <TableCell className="px-4 py-3 text-sm">{folder.size}</TableCell>
      <TableCell className="px-4 py-3 text-sm">{folder.lastModified}</TableCell>
      <TableCell className="px-4 py-3 text-sm">{folder.lastOpened}</TableCell>
      <TableCell className="px-4 py-3 text-sm">
        {totalItems > 0 ? (
          <div className="flex flex-col">
            <span className="font-medium">{totalItems} total</span>
            <span className="text-xs text-muted-foreground">
              {totalFiles} file{totalFiles !== 1 ? 's' : ''}, {totalChildFolders} folder{totalChildFolders !== 1 ? 's' : ''}
            </span>
          </div>
        ) : (
          <span className="text-muted-foreground">Empty</span>
        )}
      </TableCell>
      <TableCell className="px-4 py-3">
        <ActionMenu
          type="folder"
          itemId={folder.id}
          onAction={(action) => onAction(folder.id, action)}
        />
      </TableCell>
    </TableRow>
  );
}