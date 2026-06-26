"use client";

import React, { useState } from "react";
import { liveDrawsData } from "../../../data/homepage/featured-draws.data";
import SectionHeader from "../shared/SectionHeader";
import DrawCard from "../shared/DrawCard";
import SecondaryButton from "../shared/SecondaryButton";
import { cn } from "../../../lib/utils";

/**
 * Featured Draws / Live Competitions grid section with client-side category filter tabs.
 */
export default function FeaturedDrawsSection() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filterTabs = [
    { label: "All", value: "all" },
    { label: "Rifles", value: "rifles" },
    { label: "Pistols", value: "pistols" },
    { label: "Accessories", value: "accessories" },
    { label: "Cash Prizes", value: "cash" },
    { label: "Bundles", value: "bundles" },
  ];

  // Filter the draws
  const filteredDraws = activeCategory === "all"
    ? liveDrawsData
    : liveDrawsData.filter((draw) => draw.category === activeCategory);

  // Render arrow SVG icon
  const arrowIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      stroke="currentColor"
      className="w-4 h-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
      />
    </svg>
  );

  return (
    <section id="live-draws" className="py-20 bg-bg border-t border-divider">
      <div className="container-custom">
        
        {/* Section Header */}
        <SectionHeader
          badgeText="LIVE NOW"
          headingText="Active Competitions"
          paragraphText="Browse all active gear draws. New competitions added daily by verified hosts with secure escrow delivery."
        />

        {/* Filter Tabs Row */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 max-w-3xl mx-auto">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveCategory(tab.value)}
              className={cn(
                "font-sans font-semibold text-xs px-5 py-2.5 rounded-button border transition-all duration-200 cursor-pointer select-none",
                activeCategory === tab.value
                  ? "bg-primary border-primary text-primary-text hover:bg-primary-hover"
                  : "bg-surface border-border text-text-muted hover:text-text-primary hover:border-border-medium"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Competitions Grid */}
        {filteredDraws.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
            {filteredDraws.map((draw) => (
              <DrawCard key={draw.id} draw={draw} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-surface border border-border border-dashed rounded-card max-w-md mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-12 h-12 text-text-muted mx-auto mb-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            <h3 className="font-heading font-bold text-base text-text-primary mb-1">
              No Competitions Found
            </h3>
            <p className="font-sans text-xs text-text-muted">
              There are no active competitions in this category right now. Check back soon!
            </p>
          </div>
        )}

        {/* View All Button */}
        <div className="flex justify-center mt-6">
          <SecondaryButton href="#live-draws" icon={arrowIcon} className="px-8 py-3.5">
            View All Draws
          </SecondaryButton>
        </div>

      </div>
    </section>
  );
}
