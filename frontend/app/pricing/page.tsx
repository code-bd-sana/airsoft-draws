import React from "react";
import type { Metadata } from "next";
import WebsiteNavbar from "../../components/website/layout/WebsiteNavbar";
import WebsiteFooter from "../../components/website/layout/WebsiteFooter";
import PricingHero from "../../components/website/pricing/PricingHero";
import PricingComparisonSection from "../../components/website/pricing/PricingComparisonSection";
import PricingFaqSection from "../../components/website/pricing/PricingFaqSection";

export const metadata: Metadata = {
  title: "Pricing & Plans | Airsoft Draws",
  description:
    "Choose the right hosting plan for your airsoft competitions. Start free or unlock advanced host dashboard access, custom branding, and priority payouts.",
};

/**
 * Public 'Pricing' page route at `/pricing`.
 * Composes layout for navbar header, plan cards, comparison matrix table, FAQs accordion, and footer.
 */
export default function PricingPage() {
  return (
    <>
      {/* Sticky top navbar */}
      <WebsiteNavbar />

      <main className="min-h-screen flex flex-col bg-bg pt-20 lg:pt-[66px]">
        {/* Hero Section & Plan Grid switcher */}
        <PricingHero />

        {/* Feature Comparison Grid table */}
        <PricingComparisonSection />

        {/* FAQ Accordion Section */}
        <PricingFaqSection />
      </main>

      {/* Global website footer */}
      <WebsiteFooter />
    </>
  );
}
