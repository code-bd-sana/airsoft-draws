import React from "react";

/**
 * Renders the hero block for the Winners page, including transparency key statistics.
 */
export default function WinnersHero() {
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

        {/* Transparency Stat Rows */}
        <div className="mt-12 w-full max-w-4xl bg-bg/50 border border-border rounded-card p-6 md:p-8 flex flex-col md:flex-row justify-around items-center gap-8 md:gap-4">
          
          {/* Stat 1: Prizes Awarded */}
          <div className="flex flex-col items-center text-center flex-1">
            <span className="font-heading font-bold text-3xl md:text-4xl text-text-brand">
              £180,000+
            </span>
            <span className="font-sans text-xs text-text-muted mt-2 font-medium">
              Prizes Awarded
            </span>
          </div>

          {/* Divider */}
          <div className="hidden md:block h-12 w-px bg-border" />

          {/* Stat 2: Total Winners */}
          <div className="flex flex-col items-center text-center flex-1">
            <span className="font-heading font-bold text-3xl md:text-4xl text-text-brand">
              12,400+
            </span>
            <span className="font-sans text-xs text-text-muted mt-2 font-medium">
              Total Winners
            </span>
          </div>

          {/* Divider */}
          <div className="hidden md:block h-12 w-px bg-border" />

          {/* Stat 3: Verified Draws */}
          <div className="flex flex-col items-center text-center flex-1">
            <span className="font-heading font-bold text-3xl md:text-4xl text-text-brand">
              100%
            </span>
            <span className="font-sans text-xs text-text-muted mt-2 font-medium">
              Verified Draws
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}
