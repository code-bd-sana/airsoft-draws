"use client";

import React, { useEffect, useState } from "react";
import { raffleService } from "../../../services/raffle.service";

/**
 * Renders the hero block for the Winners page, including transparency key statistics.
 */
export default function WinnersHero() {
  const [stats, setStats] = useState({
    prizesAwarded: "£0",
    totalWinners: 0,
    mainDrawWinners: 0,
    instantWinners: 0,
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await raffleService.getPublicWinnerStats();
        if (data) setStats(data);
      } catch (error) {
        console.error("Failed to load winner stats", error);
      }
    }
    loadStats();
  }, []);

  return (
    <section className="bg-surface border-b border-divider pt-32 pb-16 md:pt-36 md:pb-20 select-none">
      <div className="container-custom flex flex-col items-center text-center">
        {/* Page Heading */}
        <h1 className="font-heading font-bold text-4xl sm:text-5xl text-text-primary tracking-tight">
          Our Winners
        </h1>
        <p className="font-sans text-sm sm:text-base md:text-lg text-text-secondary max-w-2xl mt-4 leading-relaxed font-medium">
          Real entrants. Real prizes. Every draw is fair and verifiable.
        </p>

        {/* Transparency Stat Rows - Exactly 4 boxes in a single row on desktop */}
        <div className="mt-12 w-full max-w-5xl bg-bg/50 border border-border rounded-card p-6 md:p-8 flex flex-col sm:grid sm:grid-cols-2 lg:flex lg:flex-row justify-around items-center gap-8 lg:gap-4">

          {/* Stat 1: Prizes Awarded */}
          <div className="flex flex-col items-center text-center flex-1 w-full">
            <span className="font-heading font-bold text-3xl md:text-4xl text-text-brand">
              {stats.prizesAwarded}
            </span>
            <span className="font-sans text-xs text-text-muted mt-2 font-medium">
              Prizes Awarded
            </span>
          </div>

          {/* Divider 1 */}
          <div className="hidden lg:block h-12 w-px bg-border shrink-0" />

          {/* Stat 2: Total Winners */}
          <div className="flex flex-col items-center text-center flex-1 w-full">
            <span className="font-heading font-bold text-3xl md:text-4xl text-text-brand">
              {stats.totalWinners.toLocaleString()}
            </span>
            <span className="font-sans text-xs text-text-muted mt-2 font-medium">
              Total Winners
            </span>
          </div>

          {/* Divider 2 */}
          <div className="hidden lg:block h-12 w-px bg-border shrink-0" />

          {/* Stat 3: Main Draw Winners */}
          <div className="flex flex-col items-center text-center flex-1 w-full">
            <span className="font-heading font-bold text-3xl md:text-4xl text-text-brand">
              {stats.mainDrawWinners.toLocaleString()}
            </span>
            <span className="font-sans text-xs text-text-muted mt-2 font-medium">
              Main Draw Winners
            </span>
          </div>

          {/* Divider 3 */}
          <div className="hidden lg:block h-12 w-px bg-border shrink-0" />

          {/* Stat 4: Instant Winners */}
          <div className="flex flex-col items-center text-center flex-1 w-full">
            <span className="font-heading font-bold text-3xl md:text-4xl text-text-brand">
              {stats.instantWinners.toLocaleString()}
            </span>
            <span className="font-sans text-xs text-text-muted mt-2 font-medium">
              Instant Winners
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}
