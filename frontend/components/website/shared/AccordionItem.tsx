"use client";

import React from "react";
import { cn } from "../../../lib/utils";

interface AccordionItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

/**
 * Reusable Accordion Item for FAQs with smooth CSS transitions.
 */
export default function AccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
}: AccordionItemProps) {
  return (
    <div className="border-b border-divider py-4 transition-all duration-200">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left font-heading font-bold text-sm md:text-base text-text-primary hover:text-text-brand transition-colors duration-200 cursor-pointer group py-2"
        aria-expanded={isOpen}
      >
        <span>{question}</span>
        
        {/* Toggle Icon */}
        <span className="ml-4 flex-shrink-0 text-text-secondary group-hover:text-text-brand transition-colors duration-200">
          {isOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-5 h-5 transition-transform duration-200 rotate-180"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-5 h-5 transition-transform duration-200"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          )}
        </span>
      </button>

      {/* Accordion Content with transition */}
      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out font-sans text-xs md:text-sm text-text-muted leading-relaxed overflow-hidden",
          isOpen ? "grid-rows-[1fr] opacity-100 mt-2 pb-2" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <p>{answer}</p>
        </div>
      </div>
    </div>
  );
}
