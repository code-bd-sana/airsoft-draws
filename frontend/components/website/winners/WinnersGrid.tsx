"use client";

import React, { useState } from "react";
import { usePublicWinnersList } from "../../../hooks/useRaffleHooks";
import WinnersFilterBar from "./WinnersFilterBar";
import WinnerCard from "./WinnerCard";
import { cn } from "../../../lib/utils";

/**
 * Grid layout and controller managing state for pagination, sorting, and time range filters.
 */
export default function WinnersGrid() {
  const [activeTab, setActiveTab] = useState<"all" | "month" | "week">("all");
  const [winnerTypeFilter, setWinnerTypeFilter] = useState<"all" | "instant" | "main_draw">("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 8;

  // Use the API hook
  const { data: winnersResponse, isLoading } = usePublicWinnersList({
    activeTab,
    winnerType: winnerTypeFilter,
    sortBy,
    page: currentPage,
    limit: itemsPerPage,
  });

  const visibleWinners = winnersResponse?.data || [];
  const totalPages = winnersResponse?.meta?.lastPage || 1;
  const activePage = currentPage > totalPages ? totalPages : currentPage;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Smooth scroll back to grid top on pagination action
      const gridElement = document.getElementById("winners-listing-grid");
      if (gridElement) {
        gridElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const handleTabChange = (tab: "all" | "month" | "week") => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  return (
    <section id="winners-listing-grid" className="py-12 md:py-16 bg-bg flex-grow scroll-mt-20">
      
      {/* Dynamic Filters Header bar */}
      <WinnersFilterBar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      <div className="container-custom mt-8 md:mt-12">
        {/* Winner Type Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 max-w-3xl mx-auto">
          {[
            { label: "All Winners", value: "all" },
            { label: "Main Draw", value: "main_draw" },
            { label: "Instant Wins", value: "instant" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => { setWinnerTypeFilter(tab.value as any); setCurrentPage(1); }}
              className={cn(
                "font-sans font-semibold text-xs px-5 py-2.5 rounded-button border transition-all duration-200 cursor-pointer select-none",
                winnerTypeFilter === tab.value
                  ? "bg-primary border-primary text-primary-text hover:bg-primary-hover"
                  : "bg-surface border-border text-text-muted hover:text-text-primary hover:border-border-medium"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-[400px] text-primary">Loading winners...</div>
        ) : visibleWinners.length > 0 ? (
          <>
            {/* Grid of Winner Cards: 4 columns desktop, 2 cols tablet, 1 col mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {visibleWinners.map((winner) => (
                <WinnerCard key={winner.id} winner={winner} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12 pt-8 border-t border-divider select-none">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(activePage - 1)}
                  disabled={activePage === 1}
                  className="px-4 py-2 border border-[#43581e] text-[#43581e] disabled:opacity-30 disabled:hover:text-[#43581e] disabled:hover:border-[#43581e] hover:text-text-primary hover:border-primary rounded-button text-xs font-semibold uppercase tracking-wider transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed"
                >
                  ← Previous
                </button>

                {/* Page Index Numbers */}
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNumber = idx + 1;
                  const isActive = pageNumber === activePage;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={cn(
                        "w-9 h-9 rounded-button flex items-center justify-center font-sans text-xs font-semibold transition-all duration-200 cursor-pointer select-none",
                        isActive
                          ? "bg-primary text-primary-text font-bold"
                          : "bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-border-medium"
                      )}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(activePage + 1)}
                  disabled={activePage === totalPages}
                  className="px-4 py-2 border border-[#43581e] text-[#e8edd4] disabled:opacity-30 disabled:hover:text-[#e8edd4] disabled:hover:border-[#43581e] hover:text-[#a0d056] hover:border-[#a0d056] rounded-button text-xs font-semibold uppercase tracking-wider transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        ) : (
          /* Empty State if filter yields 0 items */
          <div className="py-24 text-center select-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-12 h-12 text-text-secondary mx-auto mb-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
              />
            </svg>
            <h3 className="font-heading font-semibold text-lg text-text-primary">
              No Winners Found
            </h3>
            <p className="font-sans text-xs text-text-muted mt-2">
              We couldn&apos;t find any winner records matching this filter selection.
            </p>
          </div>
        )}
      </div>

    </section>
  );
}
