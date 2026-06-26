import React from "react";
import Image from "next/image";

/**
 * Hero header section for the Coming Soon landing page.
 * Displays the official graphic banner showing logo and coming soon tags.
 */
export default function ComingSoonHero() {
  return (
    <div className="relative w-full flex flex-col items-center pt-8 pb-4">
      {/* Official Metallic Logo & Coming Soon Graphic Banner */}
      <div className="relative w-full max-w-[450px] aspect-[0.95] rounded-[24px] overflow-hidden border border-border shadow-card hover:border-border-medium hover:shadow-glow transition-all duration-300 select-none bg-surface/50">
        <Image
          src="/coming-soon-hero.jpg"
          alt="Airsoft Draws Coming Soon Logo & Slogans"
          fill
          sizes="(max-w-768px) 100vw, 450px"
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}
