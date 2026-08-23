"use client";

import React from "react";
import Link from "next/link";
import { useLiveHeroStats } from "../../../hooks/useRaffleHooks";

interface LiveRafflesHeroProps {
  liveCount?: number;
  closingTodayCount?: number;
  totalPrizesValue?: string;
}

/**
 * Hero/Header section of the Live Raffles page.
 * Displays breadcrumbs, main title, description, and real-time statistics pills fetched from backend.
 */
export default function LiveRafflesHero({
  liveCount: propLiveCount,
  closingTodayCount: propClosingTodayCount,
  totalPrizesValue: propTotalPrizesValue,
}: LiveRafflesHeroProps) {
  const { data: heroStats, isLoading } = useLiveHeroStats();

  const liveCount = propLiveCount ?? (heroStats ? heroStats.liveCount : null);
  const closingTodayCount = propClosingTodayCount ?? (heroStats ? heroStats.closingTodayCount : null);
  const totalPrizesValue = propTotalPrizesValue ?? (heroStats ? heroStats.totalPrizesValue : null);

  return (
    <section className="bg-surface border-b border-divider pt-28 pb-12">
      <div className="container-custom">
        {/* Breadcrumb Navigation */}
        <nav className="mb-4" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-xs font-sans font-medium text-text-muted">
            <li>
              <Link href="/" className="hover:text-text-brand transition-colors duration-200">
                Home
              </Link>
            </li>
            <li className="text-border-medium" aria-hidden="true">
              /
            </li>
            <li className="text-text-secondary select-none font-semibold">Live Draws</li>
          </ol>
        </nav>

        {/* Hero Content Grid (Responsive layout) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="font-heading font-bold text-4xl md:text-5xl text-text-primary tracking-tight mb-3">
              Live Competitions
            </h1>
            <p className="font-sans text-sm md:text-base text-text-muted leading-relaxed">
              Browse every active draw. Filter by category, price, or closing time.
            </p>
          </div>

          {/* Statistics Pills (Floating right) */}
          <div className="flex flex-wrap gap-2.5">
            <div className="flex items-center gap-1.5 bg-accent-bg border border-border px-4 py-2 rounded-badge text-xs font-semibold text-text-brand shadow-sm select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              <span>{isLoading && liveCount === null ? "..." : `${liveCount ?? 0} Live Draws`}</span>
            </div>
            
            <div className="flex items-center gap-1.5 bg-accent-bg border border-border px-4 py-2 rounded-badge text-xs font-semibold text-text-brand shadow-sm select-none">
              <span>⏱</span>
              <span>{isLoading && closingTodayCount === null ? "..." : `${closingTodayCount ?? 0} Closing Today`}</span>
            </div>

            <div className="flex items-center gap-1.5 bg-accent-bg border border-border px-4 py-2 rounded-badge text-xs font-semibold text-text-brand shadow-sm select-none">
              <span>🎯</span>
              <span>{isLoading && totalPrizesValue === null ? "..." : `${totalPrizesValue ?? "£0"} in Prizes`}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
