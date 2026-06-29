import React from "react";
import SectionHeader from "../shared/SectionHeader";
import SecondaryButton from "../shared/SecondaryButton";

/**
 * How It Works section illustrating the user journey with steps and custom inline SVG icons.
 */
export default function HowItWorksSection() {
  const steps = [
    {
      stepNumber: 1,
      title: "Choose Your Draw",
      description: "Browse our active competitions. Select from premium rifles, pistols, tactical gear bundles, or cash prize draws.",
      renderIcon: () => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 text-text-brand"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.637 10.637Z"
          />
        </svg>
      ),
    },
    {
      stepNumber: 2,
      title: "Enter Your Tickets",
      description: "Answer a quick entry question and buy your tickets securely from £1. Buy multiple tickets to increase your odds.",
      renderIcon: () => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 text-text-brand"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z"
          />
        </svg>
      ),
    },
    {
      stepNumber: 3,
      title: "Win Your Gear",
      description: "When the timer ends or tickets sell out, a winner is selected live on stream using public third-party randomizers.",
      renderIcon: () => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 text-text-brand"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0V9.75m-5.007 0V9.75m5.007 0a3 3 0 0 1-5.007 0m5.007 0h3.75a3 3 0 0 0 3-3V5.25a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v1.5a3 3 0 0 0 3 3h3.75M9 15h6v1.125a1.125 1.125 0 0 1-1.125 1.125h-3.75A1.125 1.125 0 0 1 9 16.125V15Z"
          />
        </svg>
      ),
    },
  ];

  // Render info arrow icon
  const infoIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="w-4 h-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m11.25 11.25.041-.02a.75.75 0 1 1 1.054.955l-.448 1.002a.75.75 0 0 1-1.059.416l-.018-.01a.75.75 0 0 1-.416-1.059l.448-1.002Zm.75-3c.414 0 .75-.336.75-.75s-.336-.75-.75-.75-.75.336-.75.75.336.75.75.75Zm-.008 9a9 9 0 1 1 0-18 9 9 0 0 1 0 18Z"
      />
    </svg>
  );

  return (
    <section id="how-it-works" className="py-20 bg-surface border-t border-divider">
      <div className="container-custom">
        
        {/* Section Header */}
        <SectionHeader
          badgeText="SIMPLE PROCESS"
          headingText="How Airsoft Draws Works"
          paragraphText="Enter draws in three straightforward steps and win high-end gear. Transparent draws, secure payouts."
        />

        {/* Steps Grid */}
        <div className="relative mt-16 mb-16">
          {/* Horizontal Connector Line (Hidden on mobile) */}
          <div className="hidden lg:block absolute top-[32px] left-[15%] right-[15%] h-[1px] bg-divider z-0" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
            {steps.map((step) => (
              <div key={step.stepNumber} className="flex flex-col items-center text-center px-4">
                
                {/* Step Circle with Icon */}
                <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-accent-bg border border-primary shadow-glow mb-6">
                  {step.renderIcon()}
                  {/* Step Number Badge */}
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-text font-heading font-bold text-xs">
                    {step.stepNumber}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-lg text-text-primary mb-3">
                  {step.title}
                </h3>
                
                <p className="font-sans text-xs md:text-sm text-text-muted leading-relaxed max-w-sm">
                  {step.description}
                </p>

              </div>
            ))}
          </div>
        </div>

        {/* View Details Button */}
        <div className="flex justify-center mt-6">
          <SecondaryButton href="/host-rules" icon={infoIcon} className="px-8 py-3.5">
            Read Host Rules
          </SecondaryButton>
        </div>

      </div>
    </section>
  );
}
