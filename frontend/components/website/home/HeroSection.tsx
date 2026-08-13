'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { heroData } from '../../../data/homepage/hero.data';
import PrimaryButton from '../shared/PrimaryButton';
import SecondaryButton from '../shared/SecondaryButton';
import { raffleService } from '../../../services/raffle.service';

/**
 * Brand Hero section with title statements, stats counters, and fixed hero banner image with CTA button.
 */
export default function HeroSection() {
  const [dynamicStats, setDynamicStats] = useState<{ id: number; value: string; label: string }[] | null>(null);

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

  const titleParts = {
    start: "Win Premium",
    highlight: "Airsoft Gear",
    end: "For Less",
  };

  return (
    <section className='relative pt-32 pb-20 md:py-36 overflow-hidden'>
      {/* Background radial glow */}
      <div className='absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full filter blur-[120px] pointer-events-none' />
      <div className='absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/3 rounded-full filter blur-[100px] pointer-events-none' />

      <div className='container-custom relative z-10'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-12 items-center'>
          {/* Left Column: Copy & Stats */}
          <div className='lg:col-span-6 flex flex-col items-start text-left'>
            {/* Pill Badge */}
            <div className='inline-flex items-center bg-accent-bg border border-border px-3 py-1.5 rounded-badge text-[10px] font-semibold uppercase tracking-wider text-text-brand mb-6'>
              <span className='w-1.5 h-1.5 rounded-full bg-primary mr-2' />
              {badgeText}
            </div>

            {/* Heading 1 */}
            <h1 className='font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-text-primary leading-[1.1] tracking-tight mb-6'>
              {titleParts.start}{' '}
              <span className='text-text-brand block sm:inline'>{titleParts.highlight}</span>{' '}
              {titleParts.end}
            </h1>

            {/* Paragraph Description */}
            <p className='font-sans text-sm md:text-base text-text-muted leading-relaxed mb-8 max-w-xl'>
              {paragraphText}
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-12 w-full sm:w-auto">
              <PrimaryButton href="/live-raffles" className="w-full sm:w-auto px-8 py-3.5">
                View All Competitions
              </PrimaryButton>
              <SecondaryButton href="/how-it-works" className="w-full sm:w-auto px-8 py-3.5">
                How It Works
              </SecondaryButton>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-6 sm:gap-8 pt-8 border-t border-divider w-full">
              {statsToShow.map((stat) => (
                <div key={stat.id} className="flex flex-col">
                  <div className="font-heading font-bold text-xl md:text-2xl lg:text-3xl text-text-brand">
                    {stat.value}
                  </div>
                  <div className="font-sans text-[10px] md:text-xs text-text-muted font-medium uppercase tracking-wider mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Fixed Hero Image Banner with CTA Button */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end w-full">
            <Link 
              href="/live-raffles" 
              className="group relative w-full max-w-[440px] h-[520px] md:h-[580px] rounded-card overflow-hidden border border-border shadow-card hover:border-primary/50 hover:shadow-glow transition-all duration-300 select-none bg-surface/50 block"
            >
              {/* Fixed Hero Image */}
              <Image
                src="/hero-banner.jpg"
                alt="Airsoft Draws Operator Banner"
                fill
                sizes="(max-width: 768px) 100vw, 440px"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                priority
              />

              {/* Gradient Overlay for Text & Button Visibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-bg/95 via-bg/40 to-transparent pointer-events-none" />

              {/* Top Pill Badge */}
              <div className="absolute top-4 left-4 pointer-events-none">
                <div className="inline-flex items-center bg-[#1A230A]/90 backdrop-blur-sm border border-[#8CB34A]/40 px-3 py-1.5 rounded-badge text-[11px] font-bold uppercase tracking-wider text-[#8CB34A]">
                  <span className="w-2 h-2 rounded-full bg-[#8CB34A] animate-pulse mr-2" />
                  Live Competitions
                </div>
              </div>

              {/* Bottom Card Content & Action Button */}
              <div className="absolute bottom-0 inset-x-0 p-6 flex flex-col items-start gap-4">
                <div>
                  <h3 className="font-heading font-bold text-xl md:text-2xl text-text-primary group-hover:text-text-brand transition-colors duration-200">
                    Win Premium Tactical Gear
                  </h3>
                  <p className="font-sans text-xs md:text-sm text-text-muted mt-1">
                    Enter transparent draws from just £1 per ticket.
                  </p>
                </div>

                <div className="w-full inline-flex items-center justify-center bg-primary group-hover:bg-primary-hover text-primary-text font-sans font-semibold text-sm px-6 py-3.5 rounded-button transition-all duration-200 cursor-pointer shadow-md group-hover:shadow-glow gap-2">
                  <span>Enter Competition Page</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}


