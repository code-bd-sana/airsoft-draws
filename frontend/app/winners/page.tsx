import React from "react";
import type { Metadata } from "next";
import WebsiteNavbar from "../../components/website/layout/WebsiteNavbar";
import WebsiteFooter from "../../components/website/layout/WebsiteFooter";
import WinnersHero from "../../components/website/winners/WinnersHero";
import WinnersGrid from "../../components/website/winners/WinnersGrid";
import WinnerHighlightCard from "../../components/website/winners/WinnerHighlightCard";

export const metadata: Metadata = {
  title: "Winners Gallery | Airsoft Draws",
  description:
    "See all the completed raffle winners. Check past draw dates, verified delivered prizes, and transparency records.",
};

/**
 * Public 'Winners' page route at `/winners`.
 * Composes layout for header navbar, hero stats, filtering grids, testimonial highlight, and footer.
 */
export default function WinnersPage() {
  return (
    <>
      {/* Sticky top navbar */}
      <WebsiteNavbar />

      <main className="min-h-screen flex flex-col bg-bg">
        {/* Page Hero with stats counters */}
        <WinnersHero />

        {/* Stateful timeline grid + pagination card list */}
        <WinnersGrid />

        {/* Featured winner testimonial row */}
        <WinnerHighlightCard />
      </main>

      {/* Global website footer */}
      <WebsiteFooter />
    </>
  );
}
