import React from "react";

const BENEFITS = [
  {
    title: "Launch Competitions",
    description: "Be the first to know about our launch competitions with some of the biggest Airsoft companies in the UK.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-text-brand">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.75 7.5h4.5A2.625 2.625 0 1 0 12 4.875Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 7.5H12m-2.25 0H5.25A1.5 1.5 0 0 0 3.75 9v1.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V9a1.5 1.5 0 0 0-1.5-1.5h-4.5" />
      </svg>
    ),
  },

  },
  {
    title: "Premium Verified Gear",
    description: "Get access to 100% legal, compliance-verified raffles featuring top-tier airsoft rifles, pistols, and accessories.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-text-brand">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
      </svg>
    ),
  },
];

/**
 * Grid component showcasing waitlist rewards and value-adding points.
 */
export default function InterestBenefits() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-0 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {BENEFITS.map((benefit, idx) => (
          <div
            key={idx}
            className="bg-elevated border border-border rounded-[14px] p-6 flex flex-col items-start hover:border-border-medium transition-all duration-200"
          >
            {/* Rounded Icon Ring */}
            <div className="w-12 h-12 rounded-full bg-accent-bg border border-border-medium flex items-center justify-center mb-4 shrink-0">
              {benefit.icon}
            </div>

            {/* Title */}
            <h4 className="font-heading font-bold text-sm md:text-base text-text-primary uppercase tracking-wide mb-2">
              {benefit.title}
            </h4>

            {/* Description */}
            <p className="font-sans text-xs md:text-sm text-text-muted leading-relaxed">
              {benefit.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
