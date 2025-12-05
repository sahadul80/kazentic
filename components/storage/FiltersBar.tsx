"use client";

import { Grid, List } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FilterType, ViewMode } from "@/types/storage";

interface FiltersBarProps {
  filters: FilterType;
  onFilterChange: (key: keyof FilterType, value: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  selectedCount?: number;
  selectedSize?: string;
  onAddNew: () => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function FiltersBar({
  filters,
  onFilterChange,
  onClearFilters,
  hasActiveFilters,
  selectedCount = 0,
  selectedSize = "0MB",
  onAddNew,
  viewMode,
  onViewModeChange,
}: FiltersBarProps) {
  return (
    <div>
      {/* Selection info and Add New button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          {selectedCount > 0 ? (
            <>
              <span className="font-medium">{selectedCount} Selected</span>
              <span>·</span>
              <span>{selectedSize}</span>
            </>
          ) : (
            <>
            {/* Filter dropdowns */}
            <div className="flex flex-wrap items-center gap-2">
                <Select
                value={filters.category || "all"}
                onValueChange={(value) => onFilterChange("category", value)}
                >
                <SelectTrigger className="w-32">
                    <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="folders">Folders</SelectItem>
                    <SelectItem value="images">Images</SelectItem>
                    <SelectItem value="documents">Documents</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="pdfs">PDFs</SelectItem>
                    <SelectItem value="presentations">Presentations</SelectItem>
                    <SelectItem value="spreadsheets">Spreadsheets</SelectItem>
                    <SelectItem value="others">Others</SelectItem>
                </SelectContent>
                </Select>

                <Select
                value={filters.lastModified || "all"}
                onValueChange={(value) => onFilterChange("lastModified", value)}
                >
                <SelectTrigger className="w-40">
                    <SelectValue placeholder="Last Modified" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Last Modified</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">Last 7 Days</SelectItem>
                    <SelectItem value="month">Last 30 Days</SelectItem>
                    <SelectItem value="year">This year</SelectItem>
                    <SelectItem value="last-year">Last year</SelectItem>
                    <SelectItem value="older">Older</SelectItem>
                </SelectContent>
                </Select>

                <Select
                value={filters.dateAdded || "all"}
                onValueChange={(value) => onFilterChange("dateAdded", value)}
                >
                <SelectTrigger className="w-32">
                    <SelectValue placeholder="Date Added" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Last Modified</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">Last 7 Days</SelectItem>
                    <SelectItem value="month">Last 30 Days</SelectItem>
                    <SelectItem value="year">This year</SelectItem>
                    <SelectItem value="last-year">Last year</SelectItem>
                    <SelectItem value="older">Older</SelectItem>
                </SelectContent>
                </Select>

                <Select
                value={filters.people || "all"}
                onValueChange={(value) => onFilterChange("people", value)}
                >
                <SelectTrigger className="w-32">
                    <SelectValue placeholder="People" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">People</SelectItem>
                    <SelectItem value="me">Me</SelectItem>
                    <SelectItem value="shared">Shared with me</SelectItem>
                    <SelectItem value="everyone">Everyone</SelectItem>
                </SelectContent>
                </Select>
            </div>
            </>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onAddNew}>
            + Add New
          </Button>
          
          {/* View Toggle Buttons */}
          <div className="flex items-center rounded-md border">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    className="rounded-none rounded-l-md px-3"
                    onClick={() => onViewModeChange("grid")}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Grid View</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    className="rounded-none rounded-r-md px-3"
                    onClick={() => onViewModeChange("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>List View</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  );
}