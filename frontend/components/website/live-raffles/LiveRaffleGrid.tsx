"use client";

import React, { useState, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { usePublicRaffles } from "../../../hooks/useRaffleHooks";
import LiveRaffleCard from "./LiveRaffleCard";
import LiveRafflesFilterBar from "./LiveRafflesFilterBar";
import LiveRafflesEmptyState from "./LiveRafflesEmptyState";
import LiveRafflesPagination from "./LiveRafflesPagination";

// Utility helper to convert mock duration strings (like "2h 15m", "3d 8h") into minutes for sorting
const parseDurationToMinutes = (durationStr: string): number => {
  const cleanStr = durationStr.toLowerCase().trim();
  let totalMinutes = 0;

  // Check for days (e.g., "5d")
  const dayMatch = cleanStr.match(/(\d+)\s*d/);
  if (dayMatch) {
    totalMinutes += parseInt(dayMatch[1], 10) * 24 * 60;
  }

  // Check for hours (e.g., "4h")
  const hourMatch = cleanStr.match(/(\d+)\s*h/);
  if (hourMatch) {
    totalMinutes += parseInt(hourMatch[1], 10) * 60;
  }

  // Check for minutes (e.g., "30m")
  const minuteMatch = cleanStr.match(/(\d+)\s*m/);
  if (minuteMatch) {
    totalMinutes += parseInt(minuteMatch[1], 10);
  }

  // Fallback if formatting doesn't match standard patterns
  if (totalMinutes === 0) {
    totalMinutes = 999999;
  }

  return totalMinutes;
};

export default function LiveRaffleGrid() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [, startTransition] = useTransition();

  // Filters State (activeCategory is derived from URL parameters)
  const activeCategory = searchParams.get("category") || "all";
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("ending-soon");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);

  // Handle Category Filter change & update URL query parameters optionally
  const handleCategoryChange = (category: string) => {
    setCurrentPage(1);
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (category === "all") {
        params.delete("category");
      } else {
        params.set("category", category);
      }
      router.push(`?${params.toString()}`, { scroll: false });
    });
  };

  // Handle Search Input Change
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // Handle Sort Change
  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  // Use the API hook
  const { data: rafflesResponse, isLoading } = usePublicRaffles({
    search: searchQuery,
    page: currentPage,
    limit: 6,
    // Add category/sort logic as query params later if needed, but for now we just use the backend default (active status)
  });

  const filteredRaffles = rafflesResponse?.data || [];
  const totalPages = rafflesResponse?.meta?.lastPage || 1;

  const resetFilters = () => {
    setSearchQuery("");
    setSortBy("ending-soon");
    setCurrentPage(1);
    router.push("?", { scroll: false });
  };

  return (
    <section className="py-12 bg-bg flex-grow">
      <div className="container-custom">
        {/* Filter controls bar */}
        <LiveRafflesFilterBar
          activeCategory={activeCategory}
          setActiveCategory={handleCategoryChange}
          searchQuery={searchQuery}
          setSearchQuery={handleSearchChange}
          sortBy={sortBy}
          setSortBy={handleSortChange}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        {/* Content Area */}
        <div className="mt-8 min-h-[400px]">
          {isLoading ? (
            <div className="flex justify-center items-center h-[400px] text-primary">Loading live competitions...</div>
          ) : filteredRaffles.length > 0 ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "flex flex-col gap-6"
              }
            >
              {filteredRaffles.map((raffle: any) => (
                <LiveRaffleCard key={raffle.id} raffle={raffle} viewMode={viewMode} />
              ))}
            </div>
          ) : (
            <LiveRafflesEmptyState onReset={resetFilters} />
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <LiveRafflesPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>
    </section>
  );
}
