'use client';

import React, { useEffect, useState } from 'react';
import { heroData } from '../../../data/homepage/hero.data';
import PrimaryButton from '../shared/PrimaryButton';
import SecondaryButton from '../shared/SecondaryButton';
import DrawCard from '../shared/DrawCard';
import { raffleService } from '../../../services/raffle.service';
import type { Draw } from '../../../types/draw.types';

/**
 * Brand Hero section with title statements, stats counters, and featured draw card.
 */
export default function HeroSection() {
  const [dynamicFeaturedDraw, setDynamicFeaturedDraw] = useState<Draw | null>(null);
  const [dynamicStats, setDynamicStats] = useState<{ id: number; value: string; label: string }[] | null>(null);

  useEffect(() => {
    async function fetchFeaturedRaffle() {
      try {
        const res = await raffleService.getPublicRaffles({
          limit: 1,
          sort: 'Most Popular',
        });
        if (res.data && res.data.length > 0) {
          const r = res.data[0];
          setDynamicFeaturedDraw({
            id: r.id,
            title: r.title,
            description: r.description,
            image: r.mainImage || '',
            ticketPrice: Number(r.pricePerTicket),
            totalTickets: r.totalTickets,
            soldTickets: r.ticketsSold,
            endDate: new Date(r.endDate).toLocaleDateString(),
            status: (r.status === 'ACTIVE' ? 'live' : 'ended') as "live" | "ended",
            category: 'general', // Fallback as category isn't in Raffle by default here
            slug: r.slug,
          });
        }
      } catch (error) {
        console.error('Failed to fetch featured raffle:', error);
      }
    }
    
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

    fetchFeaturedRaffle();
    fetchStats();
  }, []);

  const {
    badgeText,
    paragraphText,
    stats: fallbackStats,
    featuredDraw, // fallback
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

          {/* Right Column: Featured Card */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end w-full min-h-[400px]">
            {dynamicFeaturedDraw ? (
              <DrawCard draw={dynamicFeaturedDraw} variant="featured" />
            ) : (
              <div className="w-full max-w-[750px] h-full flex flex-col items-center justify-center bg-surface border border-border border-dashed rounded-card text-center p-8">
                <h3 className="font-heading font-bold text-xl text-text-primary mb-2">More Competitions Coming Soon</h3>
                <p className="font-sans text-sm text-text-muted">We're preparing the next big drop. Check back soon!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
