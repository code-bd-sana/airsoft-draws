import React from "react";
import { cn } from "../../../lib/utils";

interface WinnersFilterBarProps {
  activeTab: "all" | "month" | "week";
  setActiveTab: (tab: "all" | "month" | "week") => void;
  sortBy: "newest" | "oldest";
  setSortBy: (sort: "newest" | "oldest") => void;
}

/**
 * Filter bar for Winners page.
 * Manages timeline capsule selections (All Time, This Month, This Week) and sort order.
 */
export default function WinnersFilterBar({
  activeTab,
  setActiveTab,
  sortBy,
  setSortBy,
}: WinnersFilterBarProps) {
  return (
    <div className="bg-bg border-b border-border py-4 select-none">
      <div className="container-custom flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        
        {/* Timeline Toggles */}
        <div className="flex gap-2 items-center">
          <button
            onClick={() => setActiveTab("all")}
            className={cn(
              "px-4 py-2 rounded-full border font-sans text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer",
              activeTab === "all"
                ? "bg-primary border-primary text-primary-text"
                : "bg-surface border-border text-text-secondary hover:text-text-primary"
            )}
          >
            All Time
          </button>
          <button
            onClick={() => setActiveTab("month")}
            className={cn(
              "px-4 py-2 rounded-full border font-sans text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer",
              activeTab === "month"
                ? "bg-primary border-primary text-primary-text"
                : "bg-surface border-border text-text-secondary hover:text-text-primary"
            )}
          >
            This Month
          </button>
          <button
            onClick={() => setActiveTab("week")}
            className={cn(
              "px-4 py-2 rounded-full border font-sans text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer",
              activeTab === "week"
                ? "bg-primary border-primary text-primary-text"
                : "bg-surface border-border text-text-secondary hover:text-text-primary"
            )}
          >
            This Week
          </button>
        </div>

        {/* Sort Dropdown Selector */}
        <div className="relative w-full sm:w-48">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "newest" | "oldest")}
            className="w-full bg-surface border border-border text-text-primary rounded-button px-4 py-2.5 font-sans text-xs font-semibold hover:border-border-medium transition-colors duration-200 cursor-pointer outline-none appearance-none"
            aria-label="Sort Winner Records"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
          
          {/* Custom Select Chevron Icon */}
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-text-brand">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-3.5 h-3.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </div>

      </div>
    </div>
  );
}
