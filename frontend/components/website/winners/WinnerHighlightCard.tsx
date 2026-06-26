import React from "react";
import Image from "next/image";

/**
 * Highlights a featured winner testimonial with quote text and a photo showcase.
 */
export default function WinnerHighlightCard() {
  const quoteIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 24 24"
      className="w-8 h-8 text-text-brand"
    >
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
    </svg>
  );

  return (
    <section className="bg-accent-bg border-t border-b border-border py-16 md:py-20 select-none">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12 items-center max-w-6xl mx-auto">
          
          {/* LEFT: Featured Winner Photo Card */}
          <div className="lg:col-span-6 w-full">
            <div className="relative w-full h-[320px] sm:h-[380px] md:h-[420px] rounded-card border border-border-medium overflow-hidden bg-surface shadow-card">
              <Image
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop"
                alt="Featured Winner Aisha R."
                fill
                sizes="(max-width: 1024px) 100vw, 500px"
                className="object-cover opacity-80 hover:opacity-90 transition-opacity duration-300"
                unoptimized
              />
              {/* Overlay Label Badge */}
              <div className="absolute bottom-4 left-4 bg-bg/85 backdrop-blur-sm border border-border px-3.5 py-1.5 rounded-badge text-[11px] font-semibold text-text-brand tracking-wider uppercase">
                Featured Winner Photo
              </div>
            </div>
          </div>

          {/* RIGHT: Testimonial Quotation */}
          <div className="lg:col-span-6 flex flex-col gap-6 text-left">
            <div className="shrink-0">{quoteIcon}</div>
            
            <p className="font-heading font-medium text-lg sm:text-xl md:text-2xl text-text-primary leading-relaxed">
              &quot;I honestly didn&apos;t think I&apos;d win — but I did! The whole process was so smooth. Airsoft Draws is the real deal. My VFC HK416 arrived perfectly packaged within 5 days of winning.&quot;
            </p>

            <div className="flex flex-col gap-1">
              <span className="font-sans font-semibold text-sm sm:text-base text-text-brand">
                Aisha R. · Leeds
              </span>
              <span className="font-sans text-xs sm:text-sm text-text-secondary">
                Won: VFC HK416 Bundle — June 2026
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
