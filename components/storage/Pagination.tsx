"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 4; // We show up to 4 items: 3 numbers + last, or ellipsis + 3 numbers
    
    if (totalPages <= 5) {
      // If total pages is 5 or less, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }
    
    // Always show first page
    pages.push(1);
    
    if (currentPage <= 3) {
      // Show first three pages + ellipsis + last
      if (currentPage > 1) pages.push(2);
      if (currentPage > 2) pages.push(3);
      
      if (totalPages > 4) {
        pages.push('ellipsis');
        pages.push(totalPages);
      } else {
        // If total pages is 4, show 4 directly
        pages.push(4);
      }
    } else if (currentPage >= totalPages - 2) {
      // Show first + ellipsis + last three pages
      pages.push('ellipsis');
      pages.push(totalPages - 2);
      pages.push(totalPages - 1);
      pages.push(totalPages);
    } else {
      // Middle pages: first + ellipsis + current-1/current/current+1 + ellipsis + last
      pages.push('ellipsis');
      pages.push(currentPage - 1);
      pages.push(currentPage);
      pages.push(currentPage + 1);
      
      if (currentPage + 1 < totalPages - 1) {
        pages.push('ellipsis');
      }
      pages.push(totalPages);
    }
    
    return pages;
  };

  const handleEllipsisClick = (position: 'left' | 'right') => {
    if (position === 'left') {
      // Left ellipsis - jump to page between first and current
      const jumpPage = Math.floor((1 + currentPage) / 2);
      onPageChange(jumpPage);
    } else {
      // Right ellipsis - jump to page between current and last
      const jumpPage = Math.floor((currentPage + totalPages) / 2);
      onPageChange(jumpPage);
    }
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-between w-full">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="gap-1"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>
      
      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) => {
          if (page === 'ellipsis') {
            // Determine if this is left or right ellipsis
            const isLeftEllipsis = index === 1; // After first page
            const isRightEllipsis = index === pageNumbers.length - 2; // Before last page
            
            return (
              <Button
                key={`ellipsis-${index}`}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-sm"
                onClick={() => handleEllipsisClick(isLeftEllipsis ? 'left' : 'right')}
              >
                ...
              </Button>
            );
          }
          
          return (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0 text-sm"
              onClick={() => onPageChange(page as number)}
            >
              {page}
            </Button>
          );
        })}
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="gap-1"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}