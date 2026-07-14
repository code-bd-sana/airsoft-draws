"use client";

import React, { useRef, useEffect, useState } from "react";
import SectionHeader from "../shared/SectionHeader";
import CategoryCard from "../shared/CategoryCard";
import { categoryService, Category } from "../../../services/category.service";

/**
 * Categories listing section displaying category cards in a scrollable carousel layout.
 */
export default function CategoriesSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const fetched = await categoryService.getPublicCategories();
        setCategories(fetched);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCategories();
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 bg-[#0A0B07] border-t border-[#161810] relative">
      <div className="container-custom">
        
        {/* Header & Controls Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <SectionHeader
            badgeText="CATEGORIES"
            headingText="Browse by Category"
            paragraphText="Find exactly what you are looking for by exploring our curated airsoft competition sections."
          />
          
          {/* Navigation Arrows (Desktop) */}
          <div className="hidden md:flex items-center gap-3 shrink-0 pb-2">
            <button 
              onClick={scrollLeft}
              className="w-12 h-12 rounded-full border border-[#2D3C13] flex items-center justify-center bg-[#111210] text-[#72943A] hover:border-[#8CB34A] hover:text-[#8CB34A] transition-all duration-300 shadow-sm"
              aria-label="Scroll left"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button 
              onClick={scrollRight}
              className="w-12 h-12 rounded-full border border-[#2D3C13] flex items-center justify-center bg-[#111210] text-[#72943A] hover:border-[#8CB34A] hover:text-[#8CB34A] transition-all duration-300 shadow-sm"
              aria-label="Scroll right"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>

        {/* Categories Carousel */}
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-4 md:gap-6 pb-6 snap-x snap-mandatory scrollbar-none hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0"
        >
          {categories.map((category) => (
            <div key={category.id} className="min-w-[160px] md:min-w-[220px] lg:min-w-[260px] snap-start shrink-0">
              <CategoryCard 
                category={{
                  id: category.id,
                  title: category.name,
                  slug: category.slug,
                  image: category.image,
                  drawCount: 0
                }} 
              />
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
