import React from "react";

interface LiveRafflesEmptyStateProps {
  onReset: () => void;
}

/**
 * Visual feedback for search/filter results containing zero elements.
 */
export default function LiveRafflesEmptyState({ onReset }: LiveRafflesEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4 bg-surface border border-border border-dashed rounded-card max-w-lg mx-auto font-sans">
      <div className="w-14 h-14 rounded-full bg-accent-bg border border-border flex items-center justify-center mb-5 text-[#72943a]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-7 h-7"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
      </div>
      <h3 className="font-heading font-bold text-xl text-text-primary mb-2">
        No Competitions Found
      </h3>
      <p className="text-sm text-text-muted max-w-xs leading-relaxed mb-6">
        We couldn&apos;t find any active competition matching your search query or category selections.
      </p>
      <button
        onClick={onReset}
        className="font-heading font-semibold text-xs text-primary-text bg-primary hover:bg-primary-hover px-6 py-3 rounded-button transition-colors duration-200 cursor-pointer select-none"
      >
        Reset Filters
      </button>
    </div>
  );
}
