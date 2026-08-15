'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { heroData } from '../../../data/homepage/hero.data';
import { raffleService } from '../../../services/raffle.service';

/**
 * Responsive Hero section:
 * - Mobile (< lg): Full-bleed background image with dark gradient overlays.
 * - PC (>= lg): Tactical operator image on the right with a seamless gradient blending into a matching dark background on the left.
 */
export default function HeroSection() {
  const [dynamicStats, setDynamicStats] = useState<{ id: number | string; value: string; label: string }[] | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const stats = await raffleService.getPublicStats();
        if (stats && stats.length > 0) {
          setDynamicStats(stats);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    }

    fetchStats();
  }, []);

  const {
    badgeText,
    paragraphText,
    stats: fallbackStats,
  } = heroData;

  const statsToShow = dynamicStats || fallbackStats;

  return (
    <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden bg-[#0a0b08]">
      {/* ============================================================ */}
      {/* MOBILE BACKGROUND LAYER (Visible on Mobile/Tablet < lg)      */}
      {/* ============================================================ */}
      <div className="absolute inset-0 z-0 select-none lg:hidden">
        <Image
          src="/hero-banner.jpg"
          alt="Airsoft Draws Operator Mobile"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_35%] opacity-85 contrast-[1.08] brightness-[0.92]"
        />
        {/* Dark vertical gradients on mobile */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0b08]/90 via-[#0a0b08]/65 to-[#0a0b08]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#0a0b08]/30 to-[#0a0b08]" />
      </div>

      {/* ============================================================ */}
      {/* PC DESKTOP BACKGROUND IMAGE (Visible on PC >= lg)            */}
      {/* ============================================================ */}
      <div className="absolute top-0 right-0 bottom-0 w-1/2 z-0 hidden lg:block select-none overflow-hidden">
        <Image
          src="/hero-banner.jpg"
          alt="Airsoft Draws Operator Desktop"
          fill
          priority
          sizes="50vw"
          className="object-cover object-[center_25%] opacity-95 contrast-[1.08] brightness-[0.95]"
        />
        {/* Left edge seamless gradient fade blending image into #0a0b08 background on the left */}
        <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[#0a0b08] via-[#0a0b08]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b08] via-transparent to-[#0a0b08]/80" />
      </div>

      {/* ============================================================ */}
      {/* CONTENT LAYER                                                */}
      {/* ============================================================ */}
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 xl:col-span-7 flex flex-col items-start text-left max-w-xl lg:max-w-2xl">
            {/* Pill Badge */}
            <div className="inline-flex items-center bg-[#131a07]/90 backdrop-blur-md border border-[#8CB34A]/60 px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider text-[#8CB34A] mb-6 shadow-lg select-none">
              <span className="w-2 h-2 rounded-full bg-[#8CB34A] animate-pulse mr-2.5" />
              {badgeText}
            </div>

            {/* 3-Line Headline matching reference photo */}
            <h1 className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl text-white leading-[1.1] tracking-tight mb-6 drop-shadow-xl select-none">
              <span className="block">Win Premium</span>
              <span className="text-[#8CB34A] block my-1">Airsoft Gear</span>
              <span className="block">For Less</span>
            </h1>

            {/* Subtitle Paragraph */}
            <p className="font-sans text-sm sm:text-base md:text-lg text-[#d0d6c5] leading-relaxed mb-8 max-w-lg drop-shadow-md">
              {paragraphText}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-12 w-full sm:w-auto">
              <Link
                href="/live-raffles"
                className="inline-flex items-center justify-center bg-[#8CB34A] hover:bg-[#9cc754] text-[#0D0D0B] font-heading font-bold text-sm sm:text-base px-8 py-3.5 rounded-[10px] transition-all duration-200 shadow-[0_0_25px_rgba(140,179,74,0.3)] hover:shadow-[0_0_35px_rgba(140,179,74,0.5)] active:scale-95 text-center select-none"
              >
                View All Competitions
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex items-center justify-center bg-[#0a0b08]/80 hover:bg-[#131a07] border border-[#2D3C13] hover:border-[#8CB34A] text-white font-heading font-semibold text-sm sm:text-base px-8 py-3.5 rounded-[10px] transition-all duration-200 active:scale-95 text-center backdrop-blur-md select-none"
              >
                How It Works
              </Link>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-6 sm:gap-10 pt-8 border-t border-[#2D3C13]/80 w-full max-w-lg">
              {statsToShow.map((stat) => (
                <div key={stat.id} className="flex flex-col">
                  <div className="font-heading font-bold text-2xl sm:text-3xl lg:text-4xl text-[#8CB34A] tracking-tight drop-shadow-md">
                    {stat.value}
                  </div>
                  <div className="font-sans text-[10px] sm:text-xs text-[#8cb34a]/80 font-semibold uppercase tracking-wider mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}



