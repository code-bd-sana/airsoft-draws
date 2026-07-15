"use client";

import React, { useState, useEffect } from "react";
import SectionHeader from "../shared/SectionHeader";
import DrawCard from "../shared/DrawCard";
import { cn } from "../../../lib/utils";
import { raffleService } from "../../../services/raffle.service";
import { categoryService, Category } from "../../../services/category.service";
import type { Draw } from "../../../types/draw.types";

/**
 * Instant Wins draws section with interactive client category filtering.
 */
export default function InstantWinsSection() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [draws, setDraws] = useState<Draw[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [fetchedCategories, fetchedDraws] = await Promise.all([
          categoryService.getPublicCategories(),
          raffleService.getInstantWinRaffles(12)
        ]);
        
        setCategories(fetchedCategories);

        if (fetchedDraws.data && fetchedDraws.data.length > 0) {
          const mappedDraws: Draw[] = fetchedDraws.data.map((r: any) => ({
            id: r.id,
            title: r.title,
            description: r.description,
            image: r.mainImage || '',
            ticketPrice: Number(r.pricePerTicket),
            totalTickets: r.totalTickets,
            soldTickets: r.ticketsSold,
            endDate: new Date(r.endDate).toLocaleDateString(),
            status: (r.status === 'ACTIVE' ? 'live' : 'ended') as "live" | "ended",
            category: r.category || 'general',
            slug: r.slug,
            instantWinsCount: r._count?.instantWins || 0,
            isInstantWin: (r._count?.instantWins || 0) > 0,
          }));
          setDraws(mappedDraws);
        }
      } catch (error) {
        console.error("Failed to fetch instant win draws:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Filter draws
  const filteredDraws = activeCategory === "all"
    ? draws
    : draws.filter((draw) => draw.category === activeCategory);

  return (
    <section id="instant-wins" className="py-20 bg-bg border-t border-divider">
      <div className="container-custom">
        
        {/* Section Header */}
        <SectionHeader
          badgeText="INSTANT WIN PRIZES NOW LIVE"
          headingText="Win Big. Every Day."
          paragraphText="Buy a ticket, and if your randomly allocated ticket number matches any pre-determined winning numbers, you win instantly!"
        />

        {/* Filter Tabs Row */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 max-w-xl mx-auto">
          <button
            onClick={() => setActiveCategory("all")}
            className={cn(
              "font-sans font-semibold text-xs px-5 py-2.5 rounded-button border transition-all duration-200 cursor-pointer select-none",
              activeCategory === "all"
                ? "bg-primary border-primary text-primary-text hover:bg-primary-hover"
                : "bg-surface border-border text-text-muted hover:text-text-primary hover:border-border-medium"
            )}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.slug)}
              className={cn(
                "font-sans font-semibold text-xs px-5 py-2.5 rounded-button border transition-all duration-200 cursor-pointer select-none capitalize",
                activeCategory === category.slug
                  ? "bg-primary border-primary text-primary-text hover:bg-primary-hover"
                  : "bg-surface border-border text-text-muted hover:text-text-primary hover:border-border-medium"
              )}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Competitions Grid */}
        {loading ? (
          <div className="text-center text-text-muted py-10">Loading Instant Wins...</div>
        ) : filteredDraws.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredDraws.map((draw) => (
              <DrawCard key={draw.id} draw={draw} variant="instant" />
            ))}
          </div>
        ) : (
          <div className="text-center text-text-muted py-10">
            No instant win competitions found.
          </div>
        )}

        {/* View All Button */}
        <div className="mt-12 text-center">
          <a
            href="/competitions"
            className="inline-flex items-center justify-center font-sans font-bold text-sm px-8 py-3.5 rounded-button bg-surface border border-border text-text-primary transition-all duration-300 hover:border-border-medium hover:text-text-brand hover:shadow-glow focus:outline-none focus:ring-2 focus:ring-brand/50"
          >
            View All Competitions
          </a>
        </div>
      </div>
    </section>
  );
}
