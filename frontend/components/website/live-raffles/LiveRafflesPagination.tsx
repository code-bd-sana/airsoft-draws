"use client";

import React from "react";
import { cn } from "../../../lib/utils";

interface LiveRafflesPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/**
 * Pagination component for live draws grid navigation.
 */
export default function LiveRafflesPagination({
  currentPage = 1,
  totalPages = 3,
  onPageChange,
}: LiveRafflesPaginationProps) {
  // Generate page array
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 py-8 mt-12 border-t border-divider/50 font-sans">
      {/* Prev Button */}
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          "px-4 py-2 text-xs font-semibold rounded-button border select-none transition-colors",
          currentPage === 1
            ? "border-border/30 text-text-muted/30 bg-surface/50 cursor-not-allowed"
            : "border-border text-text-muted hover:text-text-primary hover:border-border-medium bg-surface cursor-pointer"
        )}
      >
        Prev
      </button>

      {/* Pages list */}
      <div className="flex items-center gap-1.5 select-none">
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={cn(
              "w-9 h-9 text-xs font-semibold rounded-button border flex items-center justify-center transition-all duration-200 cursor-pointer select-none",
              currentPage === p
                ? "bg-[#1a230a] border-primary text-[#a0d056] font-bold shadow-glow"
                : "bg-surface border-border text-text-muted hover:text-text-primary hover:border-border-medium"
            )}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          "px-4 py-2 text-xs font-semibold rounded-button border select-none transition-colors",
          currentPage === totalPages
            ? "border-border/30 text-text-muted/30 bg-surface/50 cursor-not-allowed"
            : "border-border text-text-muted hover:text-text-primary hover:border-border-medium bg-surface cursor-pointer"
        )}
      >
        Next
      </button>
    </div>
  );
}
