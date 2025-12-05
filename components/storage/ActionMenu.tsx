"use client";

import {
  MoreVertical,
  Save,
  Edit2,
  Share2,
  Copy,
  Info,
  FolderOpen,
  Trash2,
  Eye,
  Download,
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
  type: "folder" | "file";
  itemId: number;
  onAction: (action: ActionType) => void;
}

export function ActionMenu({ type, itemId, onAction }: ActionMenuProps) {
  const folderActions = [
    { icon: Save, label: "Save as", action: "save-as" as ActionType },
    { icon: Edit2, label: "Rename", action: "rename" as ActionType },
    { icon: Share2, label: "Share", action: "share" as ActionType },
    { icon: Copy, label: "Copy", action: "copy" as ActionType },
    { icon: Info, label: "Info", action: "info" as ActionType },
    { icon: FolderOpen, label: "Move", action: "move" as ActionType },
    { icon: Trash2, label: "Move to trash", action: "delete" as ActionType, destructive: true },
  ];

  const fileActions = [
    { icon: Eye, label: "Preview", action: "preview" as ActionType },
    { icon: Download, label: "Download", action: "download" as ActionType },
    { icon: Share2, label: "Share", action: "share" as ActionType },
    { icon: Copy, label: "Copy", action: "copy" as ActionType },
    { icon: Info, label: "Info", action: "info" as ActionType },
    { icon: FolderOpen, label: "Move", action: "move" as ActionType },
    { icon: Trash2, label: "Move to trash", action: "delete" as ActionType, destructive: true },
  ];

  const actions = type === "folder" ? folderActions : fileActions;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()} className="w-48">
        {actions.map((action, index) => (
          <div key={index}>
            {/* Add separator before "Move to trash" (index 6 for both arrays) */}
            {index === 6 && <DropdownMenuSeparator />}
            <DropdownMenuItem
              onClick={() => onAction(action.action)}
              className={`${action.destructive ? "text-red-600" : ""} ${index === 5 ? "border-b border-gray-200 pb-2 mb-2" : ""}`}
            >
              <action.icon className="mr-2 h-4 w-4" />
              {action.label}
            </DropdownMenuItem>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}