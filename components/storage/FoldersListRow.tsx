"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ActionMenu } from "./ActionMenu";
import { EnhancedFolderItem, ActionType } from "@/types/storage";
import { TableCell, TableRow } from "../ui/table";
import { FolderIcon } from "../dashboard/SVGs";

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
    <TableRow className="border-bs hover:bg-muted/50 h-[45px]">
      <TableCell role="checkbox" className="pl-[12px]">
        <div className="flex items-center gap-[8px]">
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => {
              if (checked !== "indeterminate") {
                onSelect(folder.id);
              }
            }}
            onClick={(e) => e.stopPropagation()}
          />
          <div 
            className="rounded-lg flex items-center justify-start gap-[20px]"
            onClick={() => onFolderClick(folder.id)}
          >
            <FolderIcon/>
          </div>
          <span 
            className="font-medium text-sm cursor-pointer"
            onClick={() => onFolderClick(folder.id)}
          >
            {folder.name}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-[8px]">
          <Avatar className="h-[24px] w-[24px]">
            <AvatarFallback className="text-xs">
              {folder.owner.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm">{folder.owner}</span>
        </div>
      </TableCell>
      <TableCell>
        {(folder.sharedWithIds?.length || 0) > 0 ? (
          <div className="flex -space-x-2.5">
            {sharedUsers.map((user, index) => (
              <Avatar key={index} className="border-fs h-[24px] w-[24px]">
                <AvatarFallback className={`text-xs ${getAvatarColor(index)}`}>
                  {user.initials}
                </AvatarFallback>
              </Avatar>
            ))}
            {(folder.sharedWithIds?.length || 0) > 4 && (
              <div className="rounded-full border-fs flex items-center justify-center z-10 bg-[#DBE9FF] h-[24px] w-[24px]">
                <span className="text-xs">+{folder.sharedWithIds?folder.sharedWithIds.length - 3 : null}</span>
              </div>
            )}
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">Personal</span>
        )}
      </TableCell>
      <TableCell className="text-sm">{folder.size}</TableCell>
      <TableCell className="text-sm">{folder.lastModified}</TableCell>
      <TableCell className="text-sm">{folder.lastOpened}</TableCell>
      <TableCell className="text-sm">
        {totalItems > 0 ? (
          <div className="flex flex-col">
            <span className="font-medium text-sm">{totalItems} total</span>
            <span className="text-xs text-muted-foreground">
              {totalFiles} file{totalFiles !== 1 ? 's' : ''}, {totalChildFolders} folder{totalChildFolders !== 1 ? 's' : ''}
            </span>
          </div>
        ) : (
          <span className="text-muted-foreground">Empty</span>
        )}
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-around rotate-90">  
          <ActionMenu
            type="folder"
            itemId={folder.id}
            onAction={(action) => onAction(folder.id, action)}
          />
        </div>
      </TableCell>
    </TableRow>
  );
}