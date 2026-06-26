import React from "react";

/**
 * Hero Banner component for the stand-alone 'How It Works' page.
 * Features a dark elevated background matching Figma styling.
 */
export default function HowItWorksHero() {
  return (
    <section className="bg-surface border-b border-divider pt-32 pb-16 md:pt-36 md:pb-20 select-none">
      <div className="container-custom flex flex-col items-center text-center">
        <h1 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-text-primary tracking-tight max-w-4xl">
          How Airsoft Draws Works
        </h1>
        <p className="font-sans text-sm sm:text-base md:text-lg text-text-secondary max-w-2xl mt-4 leading-relaxed font-medium">
          Whether you&apos;re entering a draw or hosting one, here&apos;s everything you need to know.
        </p>
      </div>
    </section>
  );
}
