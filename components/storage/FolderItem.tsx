"use client";

import { Folder } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ActionMenu } from "./ActionMenu";
import { FolderItem as FolderItemType } from "@/types/storage";
import { ActionType } from "@/types/storage";

interface FolderItemProps {
  folder: FolderItemType;
  isSelected: boolean;
  onSelect: (id: number) => void;
  onAction: (id: number, action: ActionType) => void;
  viewMode: "list" | "grid";
}

export function FolderItem({ folder, isSelected, onSelect, onAction, viewMode }: FolderItemProps) {
  const getAvatarColor = (index: number) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-yellow-500",
      "bg-pink-500",
    ];
    return colors[index % colors.length];
  };

  const sharedUsers = Array.from(
    { length: Math.min(3, folder.sharedWith) },
    (_, i) => ({ initials: `U${i + 1}` })
  );

  if (viewMode === "grid") {
    return (
      <div
        className={`relative border rounded-lg p-4 cursor-pointer transition-colors ${
          isSelected ? "border-primary bg-primary/5" : "hover:border-primary hover:bg-muted/50"
        }`}
        onClick={() => onSelect(folder.id)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Folder className="h-10 w-10 text-blue-500" />
            <div>
              <h3 className="font-medium">{folder.name}</h3>
              <p className="text-sm text-muted-foreground">Owner: {folder.owner}</p>
            </div>
          </div>
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => {
              if (checked !== "indeterminate") {
                onSelect(folder.id);
              }
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">Size</p>
            <p className="font-medium">{folder.size}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Files</p>
            <p className="font-medium">{folder.filesInside}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Modified</p>
            <p className="font-medium">{folder.lastModified}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Opened</p>
            <p className="font-medium">{folder.lastOpened}</p>
          </div>
        </div>

        {/* Shared Users */}
        <div className="mt-4">
          <p className="text-sm text-muted-foreground mb-1">Shared Users</p>
          <div className="flex -space-x-2">
            {sharedUsers.map((user, index) => (
              <Avatar key={index} className="border-2 border-background h-6 w-6">
                <AvatarFallback className={`text-xs ${getAvatarColor(index)}`}>
                  {user.initials}
                </AvatarFallback>
              </Avatar>
            ))}
            {folder.sharedWith > 3 && (
              <Avatar className="border-2 border-background h-6 w-6">
                <AvatarFallback className="text-xs bg-gray-500">
                  +{folder.sharedWith - 3}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>

        {/* Action Menu */}
        <div className="absolute top-4 right-4">
          <ActionMenu
            type="folder"
            itemId={folder.id}
            onAction={(action) => onAction(folder.id, action)}
          />
        </div>
      </div>
    );
  }

  // List View
  return (
    <tr className={`hover:bg-muted/50 ${isSelected ? "bg-primary/5" : ""}`}>
      <td className="p-4">
        <div className="flex items-center gap-3">
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => {
              if (checked !== "indeterminate") {
                onSelect(folder.id);
              }
            }}
          />
          <Folder className="h-5 w-5 text-blue-500" />
          <span className="font-medium">{folder.name}</span>
        </div>
      </td>
      <td className="p-4 font-medium">{folder.owner}</td>
      <td className="p-4">
        <div className="flex -space-x-2">
          {sharedUsers.map((user, index) => (
            <Avatar key={index} className="border-2 border-background h-6 w-6">
              <AvatarFallback className={`text-xs ${getAvatarColor(index)}`}>
                {user.initials}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
      </td>
      <td className="p-4">{folder.size}</td>
      <td className="p-4">{folder.lastModified}</td>
      <td className="p-4">{folder.lastOpened}</td>
      <td className="p-4">{folder.filesInside}</td>
      <td className="p-4">
        <ActionMenu
          type="folder"
          itemId={folder.id}
          onAction={(action) => onAction(folder.id, action)}
        />
      </td>
    </tr>
  );
}