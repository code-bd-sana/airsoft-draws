import React from "react";
import PrimaryButton from "../shared/PrimaryButton";
import SecondaryButton from "../shared/SecondaryButton";

/**
 * Renders the bottom CTA block encouraging users to participate or host drawings.
 */
export default function HowItWorksFinalCta() {
  return (
    <section className="bg-accent-bg py-16 md:py-20 select-none border-b border-border">
      <div className="container-custom flex flex-col items-center gap-6 text-center">
        <h2 className="font-heading font-semibold text-2xl sm:text-3xl md:text-4xl text-text-primary">
          Ready to get started?
        </h2>
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
          <PrimaryButton href="/live-raffles" className="px-8 py-3.5 text-base w-full sm:w-auto">
            Browse Draws
          </PrimaryButton>
          <SecondaryButton href="/#host-info" className="px-8 py-3.5 text-base w-full sm:w-auto">
            Become a Host
          </SecondaryButton>
        </div>
      </div>
    </section>
  );
}
