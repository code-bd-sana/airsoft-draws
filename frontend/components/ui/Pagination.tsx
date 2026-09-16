import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  alwaysShow?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
  alwaysShow = false,
}) => {
  const safeTotal = Math.max(1, Math.floor(Number(totalPages) || 1));
  const safeCurrent = Math.min(safeTotal, Math.max(1, Math.floor(Number(currentPage) || 1)));

  if (safeTotal <= 1 && !alwaysShow) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (safeTotal <= maxVisiblePages) {
      for (let i = 1; i <= safeTotal; i++) {
        pages.push(i);
      }
    } else {
      if (safeCurrent <= 3) {
        pages.push(1, 2, 3, 4, '...', safeTotal);
      } else if (safeCurrent >= safeTotal - 2) {
        pages.push(1, '...', safeTotal - 3, safeTotal - 2, safeTotal - 1, safeTotal);
      } else {
        pages.push(1, '...', safeCurrent - 1, safeCurrent, safeCurrent + 1, '...', safeTotal);
      }
    }
    return pages;
  };

  return (
    <div className={`flex items-center justify-center gap-1.5 ${className}`}>
      <button
        onClick={() => onPageChange(safeCurrent - 1)}
        disabled={safeCurrent <= 1}
        className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#1A230A] border border-[#2D3C13] text-[#72943A] hover:bg-[#2D3C13] hover:text-[#E8EDD4] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        aria-label="Previous page"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {getPageNumbers().map((p, index) => (
        <button
          key={index}
          onClick={() => typeof p === 'number' && onPageChange(p)}
          disabled={p === '...'}
          aria-current={p === safeCurrent ? 'page' : undefined}
          className={`flex items-center justify-center min-w-[32px] h-8 px-2 rounded-lg font-sans font-medium text-[13px] transition-all ${
            p === safeCurrent
              ? 'bg-[#8CB34A] text-[#0D0D0B] shadow-sm font-semibold'
              : p === '...'
              ? 'bg-transparent text-[#72943A] cursor-default'
              : 'bg-[#1A230A] border border-[#2D3C13] text-[#72943A] hover:bg-[#2D3C13] hover:text-[#E8EDD4]'
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onPageChange(safeCurrent + 1)}
        disabled={safeCurrent >= safeTotal}
        className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#1A230A] border border-[#2D3C13] text-[#72943A] hover:bg-[#2D3C13] hover:text-[#E8EDD4] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        aria-label="Next page"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};
