"use client";

import React, { useState, useEffect, useRef } from "react";
import { liveDrawsData } from "../../../data/homepage/featured-draws.data";
import SectionHeader from "../shared/SectionHeader";
import DrawCard from "../shared/DrawCard";
import SecondaryButton from "../shared/SecondaryButton";
import { cn } from "../../../lib/utils";
import { raffleService } from "../../../services/raffle.service";
import { categoryService, Category } from "../../../services/category.service";
import type { Draw } from "../../../types/draw.types";


/**
 * Featured Competitions grid section with client-side category filter tabs and horizontal scroll carousel.
 */
export default function FeaturedCompetitionsSection() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [draws, setDraws] = useState<Draw[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const fetchedCategories = await categoryService.getPublicCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    }

    async function fetchDraws() {
      try {
        const res = await raffleService.getPublicRaffles({ limit: 10 });
        if (res.data && res.data.length > 0) {
          const mappedDraws: Draw[] = res.data.map(r => ({
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
          }));
          setDraws(mappedDraws);
        }
      } catch (err) {
        console.error("Failed to fetch featured draws:", err);
      }
    }
    fetchCategories();
    fetchDraws();
  }, [activeCategory]);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -350, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 350, behavior: 'smooth' });
    }
  };

  // Filter the draws
  const filteredDraws = activeCategory === "all"
    ? draws
    : draws.filter((draw) => draw.category === activeCategory);

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
          headingText="Featured Competitions"
          paragraphText="Browse all active gear competitions. New competitions added daily by verified hosts with secure escrow delivery."
        />

        {/* Filter Tabs Row */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 max-w-3xl mx-auto">
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

        {/* Competitions Carousel Wrapper */}
        {filteredDraws.length > 0 ? (
          <div className="relative group">
            {/* Left Scroll Button */}
            <button 
              onClick={scrollLeft}
              className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-surface border border-border shadow-md text-text-secondary hover:text-text-primary hover:border-border-medium hover:scale-105 transition-all focus:outline-none opacity-0 group-hover:opacity-100"
              aria-label="Scroll left"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </button>

            {/* Carousel Container */}
            <div 
              ref={carouselRef}
              className="flex overflow-x-auto snap-x snap-mandatory gap-6 md:gap-8 mb-12 pb-6 -mx-4 px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth"
            >
              {filteredDraws.map((draw) => (
                <div key={draw.id} className="snap-center shrink-0 w-[85vw] sm:w-[350px] lg:w-[400px]">
                  <DrawCard draw={draw} />
                </div>
              ))}
            </div>

            {/* Right Scroll Button */}
            <button 
              onClick={scrollRight}
              className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-surface border border-border shadow-md text-text-secondary hover:text-text-primary hover:border-border-medium hover:scale-105 transition-all focus:outline-none opacity-0 group-hover:opacity-100"
              aria-label="Scroll right"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>
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
          <SecondaryButton href="/live-raffles" icon={arrowIcon} className="px-8 py-3.5">
            View All Competitions
          </SecondaryButton>
        </div>

      </div>
    </section>
  );
}
