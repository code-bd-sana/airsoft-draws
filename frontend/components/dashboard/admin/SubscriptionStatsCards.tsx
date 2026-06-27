"use client";

import React from "react";

export default function SubscriptionStatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      
      {/* Free Plan Hosts */}
      <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col gap-2">
        <span className="font-sans text-[11px] font-medium text-[#5A752A] uppercase tracking-[1px]">
          Free Plan Hosts
        </span>
        <div className="flex flex-col gap-1 mt-1">
          <span className="font-heading font-bold text-[32px] text-[#E8EDD4] leading-none">680</span>
          <div className="flex items-center gap-1.5 mt-2">
            <div className="px-2 py-0.5 rounded-full bg-[#083b18] flex items-center justify-center">
              <span className="font-sans font-medium text-[10px] text-[#4ADE80]">55%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Subscribers */}
      <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col gap-2">
        <span className="font-sans text-[11px] font-medium text-[#5A752A] uppercase tracking-[1px]">
          Premium Subscribers
        </span>
        <div className="flex flex-col gap-1 mt-1">
          <span className="font-heading font-bold text-[32px] text-[#E8EDD4] leading-none">412</span>
          <div className="flex items-center gap-1.5 mt-2">
            <div className="px-2 py-0.5 rounded-full bg-[#083b18] flex items-center justify-center">
              <svg className="w-3 h-3 text-[#4ADE80]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
              </svg>
              <span className="font-sans font-medium text-[10px] text-[#4ADE80] ml-1">9%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pro Subscribers */}
      <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col gap-2">
        <span className="font-sans text-[11px] font-medium text-[#5A752A] uppercase tracking-[1px]">
          Pro Subscribers
        </span>
        <div className="flex flex-col gap-1 mt-1">
          <span className="font-heading font-bold text-[32px] text-[#E8EDD4] leading-none">148</span>
          <div className="flex items-center gap-1.5 mt-2">
            <div className="px-2 py-0.5 rounded-full bg-[#083b18] flex items-center justify-center">
              <svg className="w-3 h-3 text-[#4ADE80]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
              </svg>
              <span className="font-sans font-medium text-[10px] text-[#4ADE80] ml-1">15%</span>
            </div>
          </div>
        </div>
      </div>

      {/* MRR */}
      <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col gap-2">
        <span className="font-sans text-[11px] font-medium text-[#5A752A] uppercase tracking-[1px]">
          MRR
        </span>
        <div className="flex flex-col gap-1 mt-1">
          <span className="font-heading font-bold text-[32px] text-[#E8EDD4] leading-none">£14,280</span>
          <div className="flex items-center gap-1.5 mt-2">
            <div className="px-2 py-0.5 rounded-full bg-[#083b18] flex items-center justify-center">
              <svg className="w-3 h-3 text-[#4ADE80]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
              </svg>
              <span className="font-sans font-medium text-[10px] text-[#4ADE80] ml-1">11%</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
