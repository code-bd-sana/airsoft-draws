import React from "react";
import LiveRaffleCard from "../live-raffles/LiveRaffleCard";

interface RelatedRafflesSectionProps {
  currentRaffleId: string;
  category: string;
  currentSlug?: string;
}

/**
 * Related Raffles recommendations section ("You Might Also Like").
 * Reuses the listing page LiveRaffleCard component for code reuse and consistency.
 * Fetches real active competitions from the backend API, prioritizing those in
 * the same category, excluding the active raffle, and backfilling with other active draws.
 */
export default async function RelatedRafflesSection({
  currentRaffleId,
  category,
  currentSlug,
}: RelatedRafflesSectionProps) {
  const apiUrl =
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://127.0.0.1:5000/api/v1";

  let related: any[] = [];

  try {
    // 1. Fetch active raffles in the same category
    if (category && category.trim() !== "") {
      const catRes = await fetch(
        `${apiUrl}/raffles?category=${encodeURIComponent(category.trim())}&limit=6`,
        { cache: "no-store" }
      );
      if (catRes.ok) {
        const json = await catRes.json();
        const items: any[] = Array.isArray(json.data)
          ? json.data
          : Array.isArray(json)
          ? json
          : [];
        related = items
          .filter(
            (draw: any) =>
              draw.id !== currentRaffleId &&
              draw.slug !== currentRaffleId &&
              (!currentSlug || draw.slug !== currentSlug)
          )
          .slice(0, 3);
      }
    }

    // 2. If fewer than 3 items found in this category, fill up with other active draws
    if (related.length < 3) {
      const generalRes = await fetch(`${apiUrl}/raffles?limit=8`, {
        cache: "no-store",
      });
      if (generalRes.ok) {
        const json = await generalRes.json();
        const items: any[] = Array.isArray(json.data)
          ? json.data
          : Array.isArray(json)
          ? json
          : [];
        const filler = items
          .filter(
            (draw: any) =>
              draw.id !== currentRaffleId &&
              draw.slug !== currentRaffleId &&
              (!currentSlug || draw.slug !== currentSlug) &&
              !related.some((r: any) => r.id === draw.id)
          )
          .slice(0, 3 - related.length);
        related = [...related, ...filler];
      }
    }
  } catch (error) {
    console.error("Failed to load related raffles:", error);
  }

  // If no related raffles are available, don't show an empty section
  if (related.length === 0) return null;

  return (
    <section className="py-20 bg-surface border-t border-divider">
      <div className="container-custom">
        {/* Section Title */}
        <div className="text-center mb-10 md:mb-12">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-text-primary">
            You Might Also Like
          </h2>
          <p className="font-sans text-sm text-text-muted mt-2">
            Explore similar competitions from verified hosts
          </p>
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
