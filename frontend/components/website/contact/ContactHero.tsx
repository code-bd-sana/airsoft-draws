import React from "react";

/**
 * Standard Contact Page Hero component matching the Figma layouts.
 */
export default function ContactHero() {
  return (
    <section className="relative w-full bg-surface py-16 border-b border-divider">
      <div className="container-custom flex flex-col items-center text-center">
        
        {/* Title */}
        <h1 className="font-heading font-bold text-3xl md:text-5xl text-text-primary leading-tight tracking-tight mb-3">
          Get in Touch
        </h1>
        
        {/* Subtitle */}
        <p className="font-sans text-sm md:text-xl text-text-secondary leading-relaxed max-w-2xl">
          Questions about a draw, payment, or hosting? We&apos;re here to help.
        </p>

      </div>
    </section>
  );
}
