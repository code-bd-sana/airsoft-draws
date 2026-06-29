import React, { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import WebsiteNavbar from "../../../components/website/layout/WebsiteNavbar";
import WebsiteFooter from "../../../components/website/layout/WebsiteFooter";
import RaffleImageGallery from "../../../components/website/raffle-details/RaffleImageGallery";
import RaffleEntryCard from "../../../components/website/raffle-details/RaffleEntryCard";
import RaffleDetailsTabs from "../../../components/website/raffle-details/RaffleDetailsTabs";
import RelatedRafflesSection from "../../../components/website/raffle-details/RelatedRafflesSection";
import RaffleDetailsEmptyState from "../../../components/website/raffle-details/RaffleDetailsEmptyState";
import { raffleDetailsData } from "../../../data/raffles/raffle-details.data";
import { liveRafflesData } from "../../../data/live-raffles.data";
import { RaffleDetail } from "../../../types/raffle-details.types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Retrieves a raffle by its slug or ID, falling back to liveRafflesData to construct
 * a detailed object if not explicitly defined in the detailed static dataset.
 */
function getRaffle(slug: string): RaffleDetail | undefined {
  // 1. Search in the explicit details dataset first
  const raffle = raffleDetailsData.find(
    (item) => item.slug === slug || item.id === slug
  );
  if (raffle) {
    return raffle;
  }

  // 2. If not found, look up standard draw info and generate detail dynamically
  const draw = liveRafflesData.find(
    (item) => item.slug === slug || item.id === slug
  );
  if (draw) {
    const categoryLabels: Record<string, string> = {
      rifles: "Rifles",
      pistols: "Pistols",
      snipers: "Snipers",
      accessories: "Accessories",
      apparel: "Apparel",
      cash: "Cash Prizes",
      bundles: "Bundles",
      luxury: "Luxury",
    };
    const displayCategory = categoryLabels[draw.category] || draw.category;
    const worth = draw.worthPrice || draw.ticketPrice * draw.totalTickets;

    return {
      id: draw.id,
      title: draw.title,
      slug: draw.slug || draw.id,
      category: displayCategory,
      status: draw.status === "live" ? "live" : "ending_soon",
      images: [draw.image],
      ticketPrice: draw.ticketPrice,
      worthPrice: worth,
      totalPoolValue: worth,
      minimumTickets: 1,
      maximumTicketsPerOrder: 50,
      totalTickets: draw.totalTickets,
      soldTickets: draw.soldTickets,
      remainingTickets: Math.max(draw.totalTickets - draw.soldTickets, 0),
      drawEndDate: draw.endDate,
      description: draw.description || `Enter this premium draw for a chance to win the ${draw.title}! Premium gear, fast shipping, and guaranteed live draw.`,
      highlights: [
        `Main Prize: ${draw.title}`,
        `Ticket Price: £${draw.ticketPrice.toFixed(2)}`,
        `Estimated Valuation: £${worth.toLocaleString()}`,
        `Total Tickets: ${draw.totalTickets.toLocaleString()}`,
        `Fast Track Delivery: Fully tracked and insured shipping included.`,
      ],
      terms: [
        "This competition is open to UK residents aged 18 and over.",
        "One entry per ticket purchased.",
        "The promoter reserves the right to substitute any prize of equal or greater value.",
        "All winners will be contacted by email within 48 hours of the draw.",
        "Prizes are non-transferable and no cash alternative is offered.",
        "By entering you agree to be bound by these terms and conditions.",
        "Free postal entry: send your name and address on a postcard to: Airsoft Draws, PO Box 99, Manchester, M1 1AA."
      ],
      instantWinPrizes: [],
      isFeatured: draw.isFeatured || false,
      hostName: "Airsoft Draws Host",
      hostLogo: "AD",
      hostDrawsCount: 15,
      hostVerified: true,
    };
  }

  return undefined;
}

/**
 * Generate SEO metadata dynamically based on the active raffle detail object.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const raffle = getRaffle(slug);
  return {
    title: raffle ? `${raffle.title} | Airsoft Draws` : "Competition Not Found | Airsoft Draws",
    description: raffle?.description || "Browse and enter active premium airsoft drawings.",
  };
}

/**
 * Dynamic Live Raffle Details page route: `/live-raffles/[slug]`
 * Coordinates SSR details fetching, two-column responsive desktop layout, and recommended collections.
 */
export default async function LiveRaffleDetailPage({ params }: PageProps) {
  const { slug } = await params;

  // Search details by active slug or ID
  const raffle = getRaffle(slug);

  // Fallback screen if drawing does not exist
  if (!raffle) {
    return (
      <>
        <WebsiteNavbar />
        <RaffleDetailsEmptyState />
        <WebsiteFooter />
      </>
    );
  }

  // Left arrow SVG for the back link
  const backArrowIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      stroke="currentColor"
      className="w-4 h-4 text-[#72943a]"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
  );

  return (
    <>
      {/* Sticky top navbar */}
      <WebsiteNavbar />

      <main className="min-h-screen flex flex-col bg-bg pt-20 md:pt-[68px]">
        {/* Back Link Sub-header */}
        <div className="bg-[#0d0d0b] border-b border-[#2d3c13] h-14 flex items-center shrink-0">
          <div className="container-custom flex items-center">
            <Link
              href="/live-raffles"
              className="flex items-center gap-2 group text-xs font-semibold text-[#72943a] hover:text-text-brand select-none transition-colors duration-200"
            >
              {backArrowIcon}
              <span>Back to Live Draws</span>
            </Link>
          </div>
        </div>

        {/* Main Details Section */}
        <section className="py-12 md:py-16 flex-grow">
          <div className="container-custom">
            
            {/* Grid Layout: two-column desktop, single-column stacked mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
              
              {/* LEFT COLUMN: Image, Title, Tabs, Instant Wins, Host Info */}
              <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6 w-full">
                
                {/* Main product Image Gallery */}
                <RaffleImageGallery
                  images={raffle.images}
                  title={raffle.title}
                  instantWinCount={raffle.instantWinPrizes.length}
                />

                {/* Title & Badges */}
                <div className="flex flex-col gap-3 mt-2">
                  <h1 className="font-heading font-bold text-3xl md:text-4xl text-text-primary tracking-tight">
                    {raffle.title}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="bg-[#1A230A] border border-[#8CB34A] px-2.5 py-1 rounded-[6px] text-[11px] font-semibold text-[#8CB34A] tracking-wide select-none font-sans uppercase">
                      {raffle.status === 'live' ? 'LIVE' : 'ENDING SOON'}
                    </span>
                    <span className="text-[12px] font-sans text-[#72943A] select-none">
                      Hosted by <strong className="text-[#E8EDD4] font-medium">{raffle.hostName}</strong>
                    </span>
                    {raffle.instantWinPrizes.length > 0 && (
                      <span className="text-[12px] font-sans text-[#72943A] select-none">
                        • {raffle.instantWinPrizes.length} instant wins
                      </span>
                    )}
                  </div>
                </div>

                {/* Interactive Details, How-to, and T&Cs Tabs */}
                <RaffleDetailsTabs raffle={raffle} />
                
                {/* New Host Profile Banner */}
                {/* Host banner goes here later */}
                <div id="host-banner-placeholder" className="mt-6" />
                
              </div>

              {/* RIGHT COLUMN: Entry Card (Sticky on desktop viewports) */}
              <div className="lg:col-span-5 xl:col-span-4 w-full lg:sticky lg:top-24 mt-4 lg:mt-0 flex justify-center lg:justify-end">
                <RaffleEntryCard raffle={raffle} />
              </div>

            </div>

          </div>
        </section>

        {/* You Might Also Like Section */}
        <Suspense fallback={<div className="py-20 text-center text-text-muted font-sans">Loading related competitions...</div>}>
          <RelatedRafflesSection currentRaffleId={raffle.id} category={raffle.category} />
        </Suspense>
      </main>

      {/* Global website footer */}
      <WebsiteFooter />
    </>
  );
}
