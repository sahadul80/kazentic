"use client";

import { AppBreadcrumb } from "@/components/dashboard/app-breadcrumb";
import { Input } from "@/components/ui/input";

interface StorageHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function StorageHeader({
  searchQuery,
  onSearchChange,
}: StorageHeaderProps) {
  return (
    <>
      <div className="mb-4">
        <AppBreadcrumb />
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Storage</h1>
        
        <div className="relative w-64">
          <Input
            placeholder="Search Task"
            className="pl-4 pr-10"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <svg
            className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
    </>
  );
}