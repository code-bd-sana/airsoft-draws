import React, { Suspense } from "react";
import type { Metadata } from "next";
import WebsiteNavbar from "../../components/website/layout/WebsiteNavbar";
import WebsiteFooter from "../../components/website/layout/WebsiteFooter";
import LiveRafflesHero from "../../components/website/live-raffles/LiveRafflesHero";
import LiveRaffleGrid from "../../components/website/live-raffles/LiveRaffleGrid";

export const metadata: Metadata = {
  title: "Live Competitions | Airsoft Draws",
  description:
    "Browse and enter active premium airsoft drawings, AEGs, GBBs, sidearms, tactical gear, and cash prize draws. Tickets from £1.",
};

/**
 * Public Live Raffles Page.
 * Renders all active gear draws with category, sorting, search, and layout controls.
 */
export default function LiveRafflesPage() {
  return (
    <>
      {/* Global Header Navigation */}
      <WebsiteNavbar />

      <main className="min-h-screen flex flex-col bg-bg">
        {/* Page Hero Section */}
        <LiveRafflesHero />

        {/* Suspense Boundary for Client Search Params Filtering Grid */}
        <Suspense
          fallback={
            <div className="container-custom py-20 text-center text-text-muted font-sans animate-pulse">
              Loading active competitions...
            </div>
          }
        >
          <LiveRaffleGrid />
        </Suspense>
      </main>

      {/* Global Footer */}
      <WebsiteFooter />
    </>
  );
}
