"use client";
import { AppBreadcrumb } from "@/components/dashboard/app-breadcrumb";

interface StorageHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onUploadFile?: () => void;
  onUploadFolder?: () => void;
  onCreateFolder?: () => void;
}

export function StorageHeader({
  searchQuery,
  onSearchChange,
  onUploadFile,
  onUploadFolder,
  onCreateFolder,
}: StorageHeaderProps) {
  return (
    <>
      <div className="mb-4">
        <AppBreadcrumb />
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Storage</h1>        
     </div>
    </>
  );
}