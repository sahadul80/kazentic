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
    const maxPagesToShow = 5; 
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }
    pages.push(1);
    
    if (currentPage <= 3) {
      if (currentPage > 1) pages.push(2);
      if (currentPage > 2) pages.push(3);
      
      if (totalPages > 4) {
        pages.push('ellipsis');
        pages.push(totalPages);
      } else {
        pages.push(4);
      }
    } else if (currentPage >= totalPages - 2) {
      pages.push('ellipsis');
      pages.push(totalPages - 2);
      pages.push(totalPages - 1);
      pages.push(totalPages);
    } else {
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
      const jumpPage = Math.floor((1 + currentPage) / 2);
      onPageChange(jumpPage);
    } else {
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
        className="gap-[8px] border-fs"
      >
        <ChevronLeft />
        Previous
      </Button>
      
      <div className="flex items-center gap-[8px]">
        {pageNumbers.map((page, index) => {
          if (page === 'ellipsis') {
            const isLeftEllipsis = index === 1;
            const isRightEllipsis = index === pageNumbers.length - 2; // Before last page
            
            return (
              <Button
                key={`ellipsis-${index}`}
                variant="ghost"
                size="sm"
                onClick={() => handleEllipsisClick(isLeftEllipsis ? 'left' : 'right')}
              >
                ...
              </Button>
            );
          }
          
          return (
            <Button
              key={page}
              size="sm"
              className={`${page === currentPage ? "bg-[#F4F5F6] border-fs" : ""}`}
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
        className="gap-1 border-fs"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}