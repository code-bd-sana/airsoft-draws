"use client";

import React from "react";

export default function WinnersStatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* Total Winners */}
      <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col gap-2">
        <span className="font-sans text-[11px] font-medium text-[#5A752A] uppercase tracking-[1px]">
          Total Winners
        </span>
        <div className="flex flex-col gap-1 mt-1">
          <span className="font-heading font-bold text-[32px] text-[#E8EDD4] leading-none">842</span>
          <div className="flex items-center gap-1.5 mt-2">
            <div className="px-2 py-0.5 rounded-full border border-[#4ADE80]/30 bg-[#083b18] flex items-center justify-center">
              <span className="font-sans font-medium text-[10px] text-[#4ADE80]">All time</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Verification */}
      <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col gap-2">
        <span className="font-sans text-[11px] font-medium text-[#5A752A] uppercase tracking-[1px]">
          Pending Verification
        </span>
        <div className="flex flex-col gap-1 mt-1">
          <span className="font-heading font-bold text-[32px] text-[#E8EDD4] leading-none">4</span>
          <div className="flex items-center gap-1.5 mt-2">
            <div className="px-2 py-0.5 rounded-full border border-[#D97706]/30 bg-[#78350F] flex items-center justify-center">
              <span className="font-sans font-medium text-[10px] text-[#F59E0B]">Needs action</span>
            </div>
          </div>
        </div>
      </div>

      {/* Prizes Pending Delivery */}
      <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col gap-2">
        <span className="font-sans text-[11px] font-medium text-[#5A752A] uppercase tracking-[1px]">
          Prizes Pending Delivery
        </span>
        <div className="flex flex-col gap-1 mt-1">
          <span className="font-heading font-bold text-[32px] text-[#E8EDD4] leading-none">12</span>
          <div className="flex items-center gap-1.5 mt-2">
            <div className="px-2 py-0.5 rounded-full border border-[#4ADE80]/30 bg-[#083b18] flex items-center justify-center">
              <span className="font-sans font-medium text-[10px] text-[#4ADE80]">In transit</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
