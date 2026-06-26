import React from "react";
import { liveRafflesData } from "../../../data/live-raffles.data";
import LiveRaffleCard from "../live-raffles/LiveRaffleCard";

interface RelatedRafflesSectionProps {
  currentRaffleId: string;
  category: string;
}

/**
 * Related Raffles recommendations section ("You Might Also Like").
 * Reuses the listing page LiveRaffleCard component for code reuse and consistency.
 */
export default function RelatedRafflesSection({
  currentRaffleId,
  category,
}: RelatedRafflesSectionProps) {
  // Find up to 3 draws in the same category, excluding the active raffle
  let related = liveRafflesData
    .filter(
      (draw) =>
        draw.id !== currentRaffleId &&
        draw.slug !== currentRaffleId &&
        draw.category.toLowerCase() === category.toLowerCase()
    )
    .slice(0, 3);

  // If not enough items in the same category, fill up with other active draws
  if (related.length < 3) {
    const filler = liveRafflesData
      .filter(
        (draw) =>
          draw.id !== currentRaffleId &&
          draw.slug !== currentRaffleId &&
          !related.some((r) => r.id === draw.id)
      )
      .slice(0, 3 - related.length);
    related = [...related, ...filler];
  }

  if (related.length === 0) return null;

  return (
    <section className="py-20 bg-surface border-t border-divider">
      <div className="container-custom">
        {/* Section Title */}
        <div className="text-center mb-10 md:mb-12">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-text-primary">
            You Might Also Like
          </h2>
        </div>

        {/* Drawings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {related.map((draw) => (
            <LiveRaffleCard key={draw.id} raffle={draw} viewMode="grid" />
          ))}
        </div>
      </div>
    </section>
  );
}
