"use client";

import React, { useState } from "react";
import AccordionItem from "../shared/AccordionItem";
import { faqData } from "../../../data/homepage/faq.data";
import SecondaryButton from "../shared/SecondaryButton";

/**
 * FAQ section with left panel details and right panel interactive accordion list.
 */
export default function FaqSection() {
  const [openFaqId, setOpenFaqId] = useState<string | null>("faq-1");

  const handleToggle = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  // Render mail SVG icon
  const envelopeIcon = (
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
        d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
      />
    </svg>
  );

  return (
    <section id="faq" className="py-20 bg-bg border-t border-divider">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Panel: Context & Contact */}
          <div className="lg:col-span-5 flex flex-col items-start text-left">
            <div className="inline-flex items-center bg-accent-bg border border-border px-3 py-1.5 rounded-badge text-[10px] font-semibold uppercase tracking-wider text-text-brand mb-6">
              FAQ
            </div>
            
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-text-primary leading-tight mb-6">
              Common Questions
            </h2>
            
            <p className="font-sans text-sm md:text-base text-text-muted leading-relaxed mb-8">
              Everything you need to know about entering prize draws, list creation guidelines, ticket escrow hold limits, and reward deliveries on Airsoft Draws.
            </p>

            <SecondaryButton href="#" icon={envelopeIcon} className="px-6 py-3">
              Contact Support
            </SecondaryButton>
          </div>

          {/* Right Panel: Accordion List */}
          <div className="lg:col-span-7 w-full border-t border-divider lg:border-t-0">
            {faqData.map((faq) => (
              <AccordionItem
                key={faq.id}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFaqId === faq.id}
                onToggle={() => handleToggle(faq.id)}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
