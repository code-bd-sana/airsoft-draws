"use client";

import React, { useState } from "react";
import Link from "next/link";
import { RaffleDetail, RaffleTabId, RaffleTab } from "../../../types/raffle-details.types";
import { formatCurrency } from "../../../lib/utils";
import { cn } from "../../../lib/utils";

interface RaffleDetailsTabsProps {
  raffle: RaffleDetail;
}

/**
 * Tab component for Raffle Details Page.
 * Implements keyboard accessibility, active tab indicator lines, and responsive layouts.
 */
export default function RaffleDetailsTabs({ raffle }: RaffleDetailsTabsProps) {
  const [activeTab, setActiveTab] = useState<RaffleTabId>("details");

  const tabs: RaffleTab[] = [
    { id: "details", label: "Description" },
    { id: "how-to-enter", label: "How to Enter" },
    { id: "terms", label: "T&Cs" },
  ];

  // Present/Gift icon for instant win prizes list
  const presentIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="w-4 h-4 text-[#8cb34a]"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.75 7.5h.375c.69 0 1.25-.56 1.25-1.25v-.375Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.875A2.625 2.625 0 1 1 14.25 7.5h-.375a1.25 1.25 0 0 1-1.25-1.25v-.375Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.75 7.5h4.5m-4.5 0A2.625 2.625 0 0 0 7.5 9.75v.375c0 .69.56 1.25 1.25 1.25h.375m0-3V21m4.5-13.5v13.5m0-13.5h.375c.69 0 1.25.56 1.25 1.25v.375a1.25 1.25 0 0 1-1.25 1.25h-.375"
      />
    </svg>
  );

  return (
    <div className="w-full flex flex-col font-sans">
      {/* Tabs Header Navigation */}
      <div className="border-b border-[#2d3c13] flex items-center gap-1.5" role="tablist" aria-label="Raffle Information Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "pb-3.5 pt-2.5 px-4 text-xs font-semibold uppercase tracking-wider relative transition-all duration-200 cursor-pointer select-none border-b-2 -mb-0.5",
              activeTab === tab.id
                ? "border-primary text-text-primary"
                : "border-transparent text-[#5a752a] hover:text-text-primary"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="py-6 min-h-[180px]">
        {/* PANEL: Description/Details */}
        {activeTab === "details" && (
          <div
            id="panel-details"
            role="tabpanel"
            aria-labelledby="tab-details"
            className="flex flex-col gap-5 animate-in fade-in duration-200"
          >
            {/* Highlights List */}
            {raffle.highlights.length > 0 && (
              <ul className="flex flex-col gap-2.5">
                {raffle.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-text-primary font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8cb34a] mt-1.5 shrink-0" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Description Text */}
            <p className="text-xs text-[#72943a] leading-relaxed md:text-sm pt-2">
              {raffle.description}
            </p>
          </div>
        )}

        {/* PANEL: How To Enter */}
        {activeTab === "how-to-enter" && (
          <div
            id="panel-how-to-enter"
            role="tabpanel"
            aria-labelledby="tab-how-to-enter"
            className="flex flex-col gap-6 animate-in fade-in duration-200"
          >
            <div className="flex flex-col gap-5">
              {/* Step 1 */}
              <div className="flex gap-4 items-start">
                <div className="bg-[#1a230a] border border-[#43581e] w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-heading font-bold text-[#8cb34a] text-sm">
                  1
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-[#e8edd4] text-sm mb-1">
                    Select your tickets
                  </h4>
                  <p className="text-xs text-[#72943a] leading-relaxed">
                    Choose how many tickets you&apos;d like to purchase. More tickets = more chances to win.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4 items-start">
                <div className="bg-[#1a230a] border border-[#43581e] w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-heading font-bold text-[#8cb34a] text-sm">
                  2
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-[#e8edd4] text-sm mb-1">
                    Complete checkout
                  </h4>
                  <p className="text-xs text-[#72943a] leading-relaxed">
                    Pay securely via card or PayPal. <Link href={`/live-raffles/${raffle.slug}/free-entry`} className="text-primary hover:underline font-semibold">Free postal entry also available</Link> — see T&Cs.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4 items-start">
                <div className="bg-[#1a230a] border border-[#43581e] w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-heading font-bold text-[#8cb34a] text-sm">
                  3
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-[#e8edd4] text-sm mb-1">
                    Instant win check
                  </h4>
                  <p className="text-xs text-[#72943a] leading-relaxed">
                    Your ticket numbers are checked against instant win allocations automatically. If you win, you&apos;ll hear straight away.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4 items-start">
                <div className="bg-[#1a230a] border border-[#43581e] w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-heading font-bold text-[#8cb34a] text-sm">
                  4
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-[#e8edd4] text-sm mb-1">
                    Watch the live draw
                  </h4>
                  <p className="text-xs text-[#72943a] leading-relaxed">
                    The main draw goes live on 15 August 2026. Watch it live on our YouTube channel.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PANEL: Terms & Conditions */}
        {activeTab === "terms" && (
          <div
            id="panel-terms"
            role="tabpanel"
            aria-labelledby="tab-terms"
            className="flex flex-col gap-4 animate-in fade-in duration-200"
          >
            {raffle.terms.map((term, idx) => (
              <p key={idx} className="text-xs text-[#b3b8aa] leading-relaxed">
                {term}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Shared Bottom Section: Instant Win Prizes Table (if present) */}
      {raffle.instantWinPrizes.length > 0 && (
        <div className="mt-4 pt-4 border-t border-divider">
          <div className="bg-[#161810] border border-[#43581e] p-5 rounded-card flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[#e8edd4]">{presentIcon}</span>
              <h3 className="font-heading font-semibold text-text-primary text-sm tracking-wide">
                Instant Win Prizes
              </h3>
            </div>

            <div className="flex flex-col gap-2.5">
              <div className="bg-[#0d2010] border border-[#16a34a] rounded-md px-3 py-1.5 mb-2 w-fit">
                <span className="text-[10px] font-semibold text-[#4ade80] uppercase tracking-wider">
                  Instant Wins Included
                </span>
              </div>
              <p className="text-xs text-[#72943a] mb-2 leading-relaxed">
                Tickets are randomly allocated. If you get a matching ticket number, you win that prize instantly!
              </p>
              {raffle.instantWinPrizes.map((prize) => (
                <div
                  key={prize.id}
                  className="bg-[#0d0d0b] border border-border p-4 rounded-button flex flex-col gap-3 text-xs"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="bg-[#1a230a] rounded-[6px] w-8 h-8 flex items-center justify-center shrink-0">
                      {presentIcon}
                    </div>
                    
                    <span className="flex-grow font-medium text-text-primary">
                      {prize.title}
                    </span>

                    <span className="font-heading font-semibold text-[#a0d056] shrink-0 px-1">
                      {formatCurrency(prize.value, 0)}
                    </span>

                    <span className="text-[10px] text-[#5a752a] font-medium min-w-[70px] text-right shrink-0">
                      {prize.wonQuantity} of {prize.totalQuantity} won
                    </span>
                  </div>
                  
                  {prize.ticketNumbers && prize.ticketNumbers.length > 0 && (
                    <div className="pl-11 pr-2">
                      <div className="flex flex-wrap gap-1.5">
                        {prize.ticketNumbers.map(tnum => (
                          <span key={tnum} className="bg-surface border border-divider px-1.5 py-0.5 rounded text-[10px] font-mono text-text-muted">
                            {tnum}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Shared Bottom Section: Verified Host Card */}
      {raffle.hostName && (
        <div className="mt-6">
          <div className="bg-[#161810] border border-[#2d3c13] p-4 rounded-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              {/* Host Logo Placeholder Circle */}
              <div className="bg-[#1a230a] border border-[#43581e] rounded-full w-12 h-12 flex items-center justify-center text-[#8cb34a] font-heading font-bold text-lg select-none shrink-0">
                {raffle.hostLogo || raffle.hostName.charAt(0)}
              </div>
              
              <div className="flex flex-col">
                <span className="text-[10px] font-medium text-[#5a752a] uppercase tracking-wider">
                  Hosted by
                </span>
                
                <div className="flex flex-wrap items-center gap-2 mt-0.5">
                  <span className="font-heading font-semibold text-text-primary text-sm">
                    {raffle.hostName}
                  </span>
                  
                  {raffle.hostVerified && (
                    <span className="bg-primary text-primary-text px-1.5 py-0.5 rounded-badge text-[9px] font-semibold flex items-center select-none font-sans">
                      ✓ Verified
                    </span>
                  )}

                  {raffle.hostDrawsCount && (
                    <span className="text-[10px] text-[#5a752a] font-medium">
                      · {raffle.hostDrawsCount} draws
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* View Host Profile Link */}
            <Link
              href={`/hosts/${raffle.hostName.toLowerCase()}`}
              className="text-xs font-semibold text-text-brand hover:text-text-primary flex items-center gap-1 shrink-0 transition-colors py-1.5 self-end sm:self-auto"
            >
              <span>View Host Profile</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-3 h-3"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
