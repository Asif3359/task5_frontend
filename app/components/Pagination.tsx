"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  /** Page numbers to show (e.g. [4, 5, 6]) */
  pageNumbers: number[];
  /** Last available page (for >> button) */
  lastPage: number;
}

export function Pagination({
  currentPage,
  onPageChange,
  pageNumbers,
  lastPage,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-1 border-t bg-background py-3">
      <Button
        variant="outline"
        size="icon-sm"
        onClick={() => onPageChange(1)}
        disabled={currentPage <= 1}
        aria-label="First page"
      >
        <ChevronsLeft className="size-4" />
      </Button>
      <Button
        variant="outline"
        size="icon-sm"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage <= 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="size-4" />
      </Button>
      <div className="flex items-center gap-1">
        {pageNumbers.map((p) => (
          <Button
            key={p}
            variant={p === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(p)}
            aria-label={`Page ${p}`}
            aria-current={p === currentPage ? "page" : undefined}
          >
            {p}
          </Button>
        ))}
      </div>
      <Button
        variant="outline"
        size="icon-sm"
        onClick={() => onPageChange(Math.min(lastPage, currentPage + 1))}
        disabled={currentPage >= lastPage}
        aria-label="Next page"
      >
        <ChevronRight className="size-4" />
      </Button>
      <Button
        variant="outline"
        size="icon-sm"
        onClick={() => onPageChange(lastPage)}
        disabled={currentPage >= lastPage}
        aria-label="Last page"
      >
        <ChevronsRight className="size-4" />
      </Button>
    </div>
  );
}
