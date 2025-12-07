// components/storage/ActionMenu.tsx - Updated to match screenshot exactly
"use client";

import { 
  Save, 
  Edit2, 
  Share2, 
  Copy, 
  Info, 
  FolderOpen, 
  Trash2,
  MoreVertical 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ActionType } from "@/types/storage";

interface ActionMenuProps {
  type: 'folder' | 'file';
  itemId: number;
  onAction: (action: ActionType) => void;
  isTrashed?: boolean;
}

export function ActionMenu({ type, itemId, onAction, isTrashed = false }: ActionMenuProps) {
  const getActionItems = () => {
    if (isTrashed) {
      return [
        { icon: <Info className="h-4 w-4 mr-2" />, label: "Info", action: "info" as ActionType },
        { icon: <Copy className="h-4 w-4 mr-2" />, label: "Restore", action: "save-as" as ActionType },
        { icon: <Trash2 className="h-4 w-4 mr-2" />, label: "Delete permanently", action: "delete" as ActionType, destructive: true },
      ];
    }

    return [
      { icon: <Save className="h-4 w-4 mr-2" />, label: "Save as", action: "save-as" as ActionType },
      { icon: <Edit2 className="h-4 w-4 mr-2" />, label: "Rename", action: "rename" as ActionType },
      { icon: <Share2 className="h-4 w-4 mr-2" />, label: "Share", action: "share" as ActionType },
      { icon: <Copy className="h-4 w-4 mr-2" />, label: "Copy", action: "copy" as ActionType },
      { icon: <Info className="h-4 w-4 mr-2" />, label: "Info", action: "info" as ActionType },
      { icon: <FolderOpen className="h-4 w-4 mr-2" />, label: "Move", action: "move" as ActionType },
      { icon: <Trash2 className="h-4 w-4 mr-2" />, label: "Move to trash", action: "delete" as ActionType, destructive: true },
    ];
  };

  const actionItems = getActionItems();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 hover:bg-transparent"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {actionItems.slice(0, 5).map((item, index) => (
          <DropdownMenuItem
            key={`${item.action}-${index}`}
            onClick={(e) => {
              e.stopPropagation();
              onAction(item.action);
            }}
            className="cursor-pointer"
          >
            {item.icon}
            <span>{item.label}</span>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        {actionItems.slice(5).map((item, index) => (
          <DropdownMenuItem
            key={`${item.action}-${index + 5}`}
            onClick={(e) => {
              e.stopPropagation();
              onAction(item.action);
            }}
            className="cursor-pointer"
          >
            {item.icon}
            <span>{item.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}