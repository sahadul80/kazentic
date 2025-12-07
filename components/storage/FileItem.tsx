"use client";

import { FileText, Image, Film, FileAudio, FileSpreadsheet, Presentation } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ActionMenu } from "./ActionMenu";
import { FileItem as FileItemType } from "@/types/storage";
import { ActionType } from "@/types/storage";
import { useState } from "react";

// Import modal components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface FileItemProps {
  file: FileItemType;
  isSelected: boolean;
  onSelect: (id: number) => void;
  onAction: (id: number, action: ActionType) => void;
  viewMode: "list" | "grid";
}

export function FileItem({ file, isSelected, onSelect, onAction, viewMode }: FileItemProps) {
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [newName, setNewName] = useState(file.name);

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

  const handleAction = (action: ActionType) => {
    switch (action) {
      case "rename":
        setRenameModalOpen(true);
        break;
      case "share":
        setShareModalOpen(true);
        break;
      case "info":
        setInfoModalOpen(true);
        break;
      default:
        onAction(file.id, action);
        break;
    }
  };

  const handleRename = () => {
    onAction(file.id, "rename");
    setRenameModalOpen(false);
    setNewName(file.name); // Reset to current name
  };

  const handleShare = () => {
    onAction(file.id, "share");
    setShareModalOpen(false);
  };

  return (
    <>
      {viewMode === "grid" ? (
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
              onAction={handleAction}
            />
          </div>
        </div>
      ) : (
        // List View
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
              onAction={handleAction}
            />
          </td>
        </tr>
      )}

      {/* Rename Modal */}
      <Dialog open={renameModalOpen} onOpenChange={setRenameModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename File</DialogTitle>
            <DialogDescription>
              Enter a new name for the file.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">File Name</Label>
              <Input
                id="name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter new file name"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Current: {file.name}</span>
              <span className="mx-2">•</span>
              <span>Type: {file.fileType}</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRename} disabled={!newName.trim()}>
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Modal */}
      <Dialog open={shareModalOpen} onOpenChange={setShareModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share "{file.name}"</DialogTitle>
            <DialogDescription>
              Share this file with other users.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="share-users">Share with users</Label>
              <Input
                id="share-users"
                placeholder="Enter user emails, separated by commas"
              />
            </div>
            <div className="space-y-2">
              <Label>Permissions</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input type="radio" name="permission" value="view" defaultChecked />
                  <span>View only</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="permission" value="edit" />
                  <span>Can edit</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="permission" value="admin" />
                  <span>Full access</span>
                </label>
              </div>
            </div>
            {file.sharedWith > 0 && (
              <div>
                <Label>Currently shared with</Label>
                <div className="flex -space-x-2 mt-2">
                  {sharedUsers.map((user, index) => (
                    <Avatar key={index} className="border-2 border-background h-8 w-8">
                      <AvatarFallback className={`text-xs ${getAvatarColor(index)}`}>
                        {user.initials}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {file.sharedWith > 3 && (
                    <Avatar className="border-2 border-background h-8 w-8">
                      <AvatarFallback className="text-xs bg-gray-500">
                        +{file.sharedWith - 3}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShareModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleShare}>
              Share
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Info Modal */}
      <Dialog open={infoModalOpen} onOpenChange={setInfoModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>File Information</DialogTitle>
            <DialogDescription>
              Detailed information about this file.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-100 rounded-lg">
                {getFileIcon()}
              </div>
              <div>
                <h3 className="font-semibold">{file.name}</h3>
                <p className="text-sm text-muted-foreground">Type: {file.fileType}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Owner</p>
                <p className="font-medium">{file.owner}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Size</p>
                <p className="font-medium">{file.size}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Modified</p>
                <p className="font-medium">{file.lastModified}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Opened</p>
                <p className="font-medium">{file.lastOpened}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date Added</p>
                <p className="font-medium">{file.dateAdded}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Shared With</p>
                <p className="font-medium">{file.sharedWith} people</p>
              </div>
            </div>

            {file.sharedWith > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Shared Users</p>
                <div className="flex -space-x-2">
                  {sharedUsers.map((user, index) => (
                    <Avatar key={index} className="border-2 border-background h-8 w-8">
                      <AvatarFallback className={`text-xs ${getAvatarColor(index)}`}>
                        {user.initials}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {file.sharedWith > 3 && (
                    <Avatar className="border-2 border-background h-8 w-8">
                      <AvatarFallback className="text-xs bg-gray-500">
                        +{file.sharedWith - 3}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setInfoModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}