import React from "react";
import type { Metadata } from "next";
import WebsiteNavbar from "../../components/website/layout/WebsiteNavbar";
import WebsiteFooter from "../../components/website/layout/WebsiteFooter";
import HowItWorksHero from "../../components/website/how-it-works/HowItWorksHero";
import HowItWorksStepsSection from "../../components/website/how-it-works/HowItWorksStepsSection";
import HowItWorksVideoSection from "../../components/website/how-it-works/HowItWorksVideoSection";
import HowItWorksFinalCta from "../../components/website/how-it-works/HowItWorksFinalCta";

export const metadata: Metadata = {
  title: "How It Works | Airsoft Draws",
  description:
    "Learn how to enter premium airsoft gear drawings or host your own competitions with transparent random draws and instant payouts.",
};

/**
 * Public 'How It Works' page route at `/how-it-works`.
 * Composes the Hero banner, toggleable Entrant/Host step guides, and final Call to Action sections.
 */
export default function HowItWorksPage() {
  return (
    <>
      {/* Sticky top navbar */}
      <WebsiteNavbar />

      <main className="min-h-screen flex flex-col bg-bg">
        {/* Hero Section */}
        <HowItWorksHero />

        {/* Tabbed Step Timeline Section */}
        <HowItWorksStepsSection />

        {/* Playable Video Section */}
        <HowItWorksVideoSection />

        {/* Bottom Call to Action Section */}
        <HowItWorksFinalCta />
      </main>

      {/* Website Footer */}
      <WebsiteFooter />
    </>
  );
}
