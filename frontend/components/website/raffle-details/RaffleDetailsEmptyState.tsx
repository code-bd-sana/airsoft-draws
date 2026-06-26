import React from "react";
import Link from "next/link";

/**
 * Fallback screen for raffle details pages when a requested slug does not resolve to an active drawing.
 */
export default function RaffleDetailsEmptyState() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-20 bg-bg font-sans">
      <div className="w-16 h-16 rounded-full bg-accent-bg border border-border flex items-center justify-center mb-6 text-[#72943a]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
          />
        </svg>
      </div>
      
      <h2 className="font-heading font-bold text-2xl text-text-primary mb-3">
        Competition Not Found
      </h2>
      
      <p className="text-sm text-text-muted max-w-sm leading-relaxed mb-8">
        The drawing you are looking for does not exist, has expired, or was removed by the host.
      </p>

      <Link
        href="/live-raffles"
        className="font-heading font-semibold text-xs text-primary-text bg-primary hover:bg-primary-hover px-8 py-3.5 rounded-button transition-colors duration-200 uppercase tracking-wider"
      >
        Back to Live Draws
      </Link>
    </div>
  );
}
