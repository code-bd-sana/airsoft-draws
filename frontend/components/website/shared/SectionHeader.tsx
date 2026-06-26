import React from "react";
import { cn } from "../../../lib/utils";

interface SectionHeaderProps {
  badgeText?: string;
  headingText: string;
  paragraphText?: string;
  centered?: boolean;
}

/**
 * Reusable section title component matching Figma design layout.
 */
export default function SectionHeader({
  badgeText,
  headingText,
  paragraphText,
  centered = true,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col mb-12 max-w-2xl",
        centered ? "mx-auto text-center items-center" : "text-left items-start"
      )}
    >
      {badgeText && (
        <div className="inline-flex items-center bg-accent-bg border border-border px-3 py-1.5 rounded-badge text-[10px] font-semibold uppercase tracking-wider text-text-brand mb-4">
          {badgeText}
        </div>
      )}
      
      <h2 className="font-heading font-bold text-3xl md:text-4xl text-text-primary leading-tight mb-4">
        {headingText}
      </h2>
      
      {paragraphText && (
        <p className="font-sans text-sm md:text-base text-text-muted leading-relaxed">
          {paragraphText}
        </p>
      )}
    </div>
  );
}
