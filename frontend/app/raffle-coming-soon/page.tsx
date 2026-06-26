import React from "react";
import type { Metadata } from "next";
import WebsiteNavbar from "../../components/website/layout/WebsiteNavbar";
import WebsiteFooter from "../../components/website/layout/WebsiteFooter";
import ComingSoonHero from "../../components/website/coming-soon/ComingSoonHero";
import EarlyAccessForm from "../../components/website/coming-soon/EarlyAccessForm";
import InterestBenefits from "../../components/website/coming-soon/InterestBenefits";

export const metadata: Metadata = {
  title: "Early Access | Airsoft Draws",
  description:
    "Join the waitlist for the premier airsoft raffle platform. Get launch giveaways, free tokens, and host perks before the public launch.",
};

/**
 * Public 'Coming Soon' lead registration landing page at `/raffle-coming-soon`.
 * Composes layout for header navbar, Waitlist Hero details, signup form, benefits grid, and footer.
 */
export default function RaffleComingSoonPage() {
  return (
    <>
      {/* Sticky top navbar */}
      <WebsiteNavbar />

      <main className="min-h-screen flex flex-col bg-bg pt-20 lg:pt-[66px] pb-12 relative overflow-hidden">
        {/* Decorative background grid/glow */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a230a_1px,transparent_1px),linear-gradient(to_bottom,#1a230a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

        <div className="container-custom flex flex-col items-center gap-4 relative z-10">
          {/* Welcome/Coming Soon Header */}
          <ComingSoonHero />

          {/* Early Registration Input Form */}
          <EarlyAccessForm />

          {/* Waitlist Perks Benefits Section */}
          <InterestBenefits />
        </div>
      </main>

      {/* Global website footer */}
      <WebsiteFooter />
    </>
  );
}
