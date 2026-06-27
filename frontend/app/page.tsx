import React from "react";
import WebsiteNavbar from "../components/website/layout/WebsiteNavbar";
import WebsiteFooter from "../components/website/layout/WebsiteFooter";
import HeroSection from "../components/website/home/HeroSection";
import FeaturedCompetitionsSection from "../components/website/home/FeaturedCompetitionsSection";
import CategoriesSection from "../components/website/home/CategoriesSection";
import HowItWorksSection from "../components/website/home/HowItWorksSection";
import TrustBenefitsSection from "../components/website/home/TrustBenefitsSection";
import WinnersSection from "../components/website/home/WinnersSection";
import InstantWinsSection from "../components/website/home/InstantWinsSection";
import FinalCtaSection from "../components/website/home/FinalCtaSection";
import TestimonialsSection from "../components/website/home/TestimonialsSection";
import FaqSection from "../components/website/home/FaqSection";
import NewsletterSection from "../components/website/home/NewsletterSection";

/**
 * Public Homepage for the Airsoft Draw application.
 * Composes layout and modular sections for future scalability.
 */
export default function Home() {
  return (
    <>
      {/* Sticky Top Navigation */}
      <WebsiteNavbar />

      {/* Main Page Content */}
      <main className="flex-grow">
        <HeroSection />
        
        <FeaturedCompetitionsSection />
        
        <CategoriesSection />
        
        <HowItWorksSection />
        
        <TrustBenefitsSection />
        
        <WinnersSection />
        
        <InstantWinsSection />
        
        <FinalCtaSection />
        
        <TestimonialsSection />
        
        <FaqSection />
        
        <NewsletterSection />
      </main>

      {/* Footer Details */}
      <WebsiteFooter />
    </>
  );
}
