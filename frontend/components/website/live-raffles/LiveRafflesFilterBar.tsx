"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "../../../lib/utils";

interface LiveRafflesFilterBarProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
}

/**
 * Interactive filter, search, sort, and layout control bar for live raffles.
 * Fully responsive: stacks options and scrolls categories horizontally on small viewports.
 */
export default function LiveRafflesFilterBar({
  activeCategory,
  setActiveCategory,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
}: LiveRafflesFilterBarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const categories = [
    { label: "All", value: "all" },
    { label: "Rifles", value: "rifles" },
    { label: "Pistols", value: "pistols" },
    { label: "Snipers", value: "sniper-rifles" },
    { label: "Accessories", value: "accessories" },
    { label: "Apparel", value: "gear-and-apparel" },
    { label: "Cash Prizes", value: "cash-prizes" },
  ];

  const sortOptions = [
    { label: "Featured", value: "featured" },
    { label: "Ending Soon", value: "ending-soon" },
    { label: "Price: Low to High", value: "price-asc" },
    { label: "Price: High to Low", value: "price-desc" },
    { label: "Most Popular", value: "popular" },
  ];

  const activeSortOption = sortOptions.find((opt) => opt.value === sortBy) || sortOptions[0];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-[#0d0d0b] border-b border-[#2d3c13] py-4 sticky top-[60px] md:top-[68px] z-30">
      <div className="container-custom flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Category Pills (Horizontal scrolling list on small screens) */}
        <div className="overflow-x-auto -mx-5 px-5 lg:mx-0 lg:px-0 scrollbar-none flex items-center gap-2 select-none shrink-0 py-1">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={cn(
                "font-sans font-medium text-xs px-4 py-2 rounded-badge border shrink-0 transition-all duration-200 cursor-pointer select-none",
                activeCategory === cat.value
                  ? "bg-primary border-primary text-primary-text font-semibold hover:bg-primary-hover shadow-glow"
                  : "bg-surface border-border text-text-secondary hover:text-text-primary hover:border-border-medium"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search, Sort & Layout Controls Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          {/* Custom Sort Dropdown */}
          <div className="relative shrink-0 font-sans" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full sm:w-[170px] bg-surface border border-border px-4 py-2.5 rounded-button text-xs font-semibold text-text-primary hover:border-border-medium flex items-center justify-between gap-2 cursor-pointer transition-all duration-200"
            >
              <span>Sort: {activeSortOption.label}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className={cn("w-3.5 h-3.5 text-text-muted transition-transform duration-200", dropdownOpen && "rotate-180")}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 left-0 sm:left-auto sm:w-[170px] mt-1.5 bg-[#161810] border border-border rounded-button overflow-hidden shadow-lg z-40 transition-all duration-150 animate-in fade-in slide-in-from-top-1.5">
                {sortOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setSortBy(opt.value);
                      setDropdownOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-4 py-2.5 text-xs font-medium transition-colors cursor-pointer select-none",
                      sortBy === opt.value
                        ? "bg-accent-bg text-text-brand"
                        : "text-text-muted hover:bg-surface hover:text-text-primary"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Input Box */}
          <div className="relative flex-grow sm:flex-grow-0 sm:w-[220px] font-sans">
            <input
              type="text"
              placeholder="Search draws..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface border border-border pl-9 pr-4 py-2.5 rounded-button text-xs text-text-primary placeholder:text-text-muted/40 focus:outline-none focus:border-border-medium transition-colors"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/60 pointer-events-none"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </div>

          {/* Layout Toggle Buttons (Grid / List) */}
          <div className="flex items-center border border-border rounded-button overflow-hidden divide-x divide-border shrink-0 select-none bg-surface">
            {/* Grid Layout Toggle */}
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-2.5 cursor-pointer transition-all duration-200 select-none",
                viewMode === "grid"
                  ? "bg-accent-bg text-[#a0d056]"
                  : "text-text-muted hover:text-text-primary"
              )}
              title="Grid View"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
                />
              </svg>
            </button>

            {/* List Layout Toggle */}
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-2.5 cursor-pointer transition-all duration-200 select-none",
                viewMode === "list"
                  ? "bg-accent-bg text-[#a0d056]"
                  : "text-text-muted hover:text-text-primary"
              )}
              title="List View"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 12h16.5m-16.5 5.25h16.5m-16.5-10.5h16.5"
                />
              </svg>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
