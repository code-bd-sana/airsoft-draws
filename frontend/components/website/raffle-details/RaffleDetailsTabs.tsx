"use client";

import React, { useState } from "react";
import Link from "next/link";
import { RaffleDetail, RaffleTabId, RaffleTab } from "../../../types/raffle-details.types";
import { formatCurrency } from "../../../lib/utils";
import { cn } from "../../../lib/utils";
import { useAuth } from "../../../features/auth/AuthContext";

interface RaffleDetailsTabsProps {
  raffle: RaffleDetail;
}

export default function RaffleDetailsTabs({ raffle }: RaffleDetailsTabsProps) {
  const [activeTab, setActiveTab] = useState<RaffleTabId>("details");
  const { user } = useAuth();

  const tabs: RaffleTab[] = [
    { id: "details", label: "Description" },
    { id: "how-to-enter", label: "How to Enter" },
    { id: "terms", label: "Terms" },
  ];

  const checkIcon = (
    <div className="w-5 h-5 rounded-full bg-[#1A230A] border border-[#43581E] flex items-center justify-center shrink-0">
      <svg className="w-3 h-3 text-[#8CB34A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
    </div>
  );

  return (
    <div className="w-full flex flex-col font-sans mt-2">
      {/* Tabs Header */}
      <div className="flex items-center gap-6 border-b border-[#2D3C13] mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "pb-3 text-[13px] font-medium transition-colors duration-200 border-b-2 -mb-[1px]",
              activeTab === tab.id
                ? "border-[#8CB34A] text-[#8CB34A]"
                : "border-transparent text-[#72943A] hover:text-[#E8EDD4]"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[160px]">
        {activeTab === "details" && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-200">
            <p className="text-[13px] text-[#72943A] leading-relaxed">
              {raffle.description}
            </p>
            {raffle.highlights.length > 0 && (
              <ul className="flex flex-col gap-2 mt-2">
                {raffle.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-[13px] text-[#E8EDD4]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8CB34A] mt-1.5 shrink-0" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {activeTab === "how-to-enter" && (
          <div className="flex flex-col gap-5 animate-in fade-in duration-200">
            <div className="flex gap-4 items-start">
              <div className="bg-[#1A230A] border border-[#43581E] w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-heading font-semibold text-[#8CB34A] text-[12px]">
                1
              </div>
              <div>
                <h4 className="font-heading font-medium text-[#E8EDD4] text-[13px]">Select your tickets</h4>
                <p className="text-[12px] text-[#72943A] mt-0.5">Choose how many tickets you&apos;d like to purchase. More tickets = more chances to win.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="bg-[#1A230A] border border-[#43581E] w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-heading font-semibold text-[#8CB34A] text-[12px]">
                2
              </div>
              <div>
                <h4 className="font-heading font-medium text-[#E8EDD4] text-[13px]">Complete checkout</h4>
                <p className="text-[12px] text-[#72943A] mt-0.5">Pay securely via card or PayPal. Free postal entry also available — see T&Cs.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="bg-[#1A230A] border border-[#43581E] w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-heading font-semibold text-[#8CB34A] text-[12px]">
                3
              </div>
              <div>
                <h4 className="font-heading font-medium text-[#E8EDD4] text-[13px]">Instant win check</h4>
                <p className="text-[12px] text-[#72943A] mt-0.5">Your ticket numbers are checked against instant win outcomes automatically. If you win, you&apos;ll know straight away.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="bg-[#1A230A] border border-[#43581E] w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-heading font-semibold text-[#8CB34A] text-[12px]">
                4
              </div>
              <div>
                <h4 className="font-heading font-medium text-[#E8EDD4] text-[13px]">Watch the live draw</h4>
                <p className="text-[12px] text-[#72943A] mt-0.5">The main draw goes live on 20 July. Watch it on our YouTube channel.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "terms" && (
          <div className="flex flex-col gap-3 animate-in fade-in duration-200">
            <p className="text-[13px] text-[#72943A] mb-2">Please read the terms carefully before entering.</p>
            <ul className="flex flex-col gap-2.5">
              {raffle.terms.map((term, i) => (
                <li key={i} className="flex items-start gap-2.5 text-[12px] text-[#E8EDD4] leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8CB34A] mt-1.5 shrink-0" />
                  <span>{term}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Instant Win Prizes */}
      {raffle.instantWinPrizes.length > 0 && (
        <div className="mt-8 bg-[#111210] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[16px]">🎁</span>
            <h3 className="font-heading font-semibold text-[14px] text-[#E8EDD4]">Instant Win Prizes</h3>
          </div>
          <div className="flex flex-col gap-3">
            {raffle.instantWinPrizes.map((prize) => (
              <div key={prize.id} className="flex items-center justify-between p-4 bg-[#161810] border border-[#2D3C13] rounded-[12px]">
                <div className="flex items-center gap-3">
                  {prize.image ? (
                    <div className="w-10 h-10 rounded overflow-hidden shrink-0 bg-[#0d0d0b]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={prize.image} alt={prize.title} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    checkIcon
                  )}
                  <div className="flex flex-col">
                    <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">{prize.title}</span>
                    <span className="font-sans text-[11px] text-[#72943A]">
                      {user?.role === 'ADMIN' || user?.role === 'HOST' ? `Ticket #${prize.ticketNumber}` : "Ticket #???"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <span className={cn("font-heading font-semibold text-[13px] px-2 py-1 rounded", prize.isClaimed ? "bg-[#2d3c13] text-[#72943a]" : "bg-[#1a230a] text-[#8CB34A]")}>
                    {prize.isClaimed ? "Claimed" : "Available"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Host Profile Banner */}
      {raffle.hostName && (
        <div className="mt-8 bg-[#111210] border border-[#2D3C13] rounded-[12px] p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1A230A] border border-[#43581E] flex items-center justify-center shrink-0">
              <span className="font-heading font-semibold text-[#8CB34A] text-[14px]">{raffle.hostLogo || raffle.hostName.charAt(0)}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-sans text-[10px] text-[#72943A] uppercase tracking-wide">Hosted by</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-heading font-semibold text-[14px] text-[#E8EDD4]">{raffle.hostName}</span>
                {raffle.hostVerified && (
                  <span className="bg-[#8CB34A] text-[#0D0D0B] px-1.5 py-0.5 rounded-[4px] text-[9px] font-bold uppercase tracking-wide">Verified</span>
                )}
              </div>
            </div>
          </div>
          <Link 
            href={`/hosts/${raffle.hostName.toLowerCase().replace(/\s+/g, '-')}`}
            className="text-[12px] font-sans font-medium text-[#8CB34A] hover:text-[#A0D056] transition-colors"
          >
            View Host Profile
          </Link>
        </div>
      )}
    </div>
  );
}
