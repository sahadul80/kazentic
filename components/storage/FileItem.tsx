"use client";

import { FileText, Image, Film, FileAudio, FileSpreadsheet, Presentation } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ActionMenu } from "./ActionMenu";
import { FileItem as FileItemType } from "@/types/storage";
import { ActionType } from "@/types/storage";

interface FileItemProps {
  file: FileItemType;
  isSelected: boolean;
  onSelect: (id: number) => void;
  onAction: (id: number, action: ActionType) => void;
  viewMode: "list" | "grid";
}

export function FileItem({ file, isSelected, onSelect, onAction, viewMode }: FileItemProps) {
  const getFileIcon = () => {
    const iconClass = viewMode === "grid" ? "h-8 w-8" : "h-5 w-5";
    switch (file.fileType.toLowerCase()) {
      case "pdf":
        return <FileText className={`${iconClass} text-red-500`} />;
      case "jpg":
      case "png":
      case "jpeg":
        return <Image className={`${iconClass} text-green-500`} />;
      case "mp4":
      case "mkv":
      case "avi":
        return <Film className={`${iconClass} text-purple-500`} />;
      case "mp3":
      case "wav":
        return <FileAudio className={`${iconClass} text-yellow-500`} />;
      case "xlsx":
      case "csv":
        return <FileSpreadsheet className={`${iconClass} text-green-600`} />;
      case "pptx":
      case "ppt":
        return <Presentation className={`${iconClass} text-orange-500`} />;
      default:
        return <FileText className={`${iconClass} text-gray-500`} />;
    }
  };

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
    { length: Math.min(3, file.sharedWith) },
    (_, i) => ({ initials: `U${i + 1}` })
  );

  if (viewMode === "grid") {
    return (
      <div
        className={`relative border rounded-lg p-4 cursor-pointer transition-colors ${
          isSelected ? "border-primary bg-primary/5" : "hover:border-primary hover:bg-muted/50"
        }`}
        onClick={() => onSelect(file.id)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {getFileIcon()}
            <div>
              <h3 className="font-medium">{file.name}</h3>
              <p className="text-sm text-muted-foreground">Owner: {file.owner}</p>
            </div>
          </div>
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => {
              if (checked !== "indeterminate") {
                onSelect(file.id);
              }
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">Size</p>
            <p className="font-medium">{file.size}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Type</p>
            <p className="font-medium">{file.fileType}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Modified</p>
            <p className="font-medium">{file.lastModified}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Opened</p>
            <p className="font-medium">{file.lastOpened}</p>
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
            {file.sharedWith > 3 && (
              <Avatar className="border-2 border-background h-6 w-6">
                <AvatarFallback className="text-xs bg-gray-500">
                  +{file.sharedWith - 3}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>

        {/* Action Menu */}
        <div className="absolute top-4 right-4">
          <ActionMenu
            type="file"
            itemId={file.id}
            onAction={(action) => onAction(file.id, action)}
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
                onSelect(file.id);
              }
            }}
          />
          {getFileIcon()}
          <span className="font-medium">{file.name}</span>
        </div>
      </td>
      <td className="p-4 font-medium">{file.owner}</td>
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
      <td className="p-4">{file.size}</td>
      <td className="p-4">{file.lastModified}</td>
      <td className="p-4">{file.lastOpened}</td>
      <td className="p-4">
        <Badge variant="outline">{file.fileType}</Badge>
      </td>
      <td className="p-4">
        <ActionMenu
          type="file"
          itemId={file.id}
          onAction={(action) => onAction(file.id, action)}
        />
      </td>
    </tr>
  );
}