"use client";

import React from "react";

export default function WithdrawalsStatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* Pending Requests */}
      <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col gap-2">
        <span className="font-sans text-[11px] font-medium text-[#5A752A] uppercase tracking-[1px]">
          Pending Requests
        </span>
        <div className="flex flex-col gap-1 mt-1">
          <span className="font-heading font-bold text-[32px] text-[#E8EDD4] leading-none">2</span>
          <div className="flex items-center gap-1.5 mt-2">
            <div className="px-2 py-0.5 rounded-full border border-[#D97706]/30 bg-[#78350F] flex items-center justify-center">
              <span className="font-sans font-medium text-[10px] text-[#F59E0B]">Needs action</span>
            </div>
          </div>
        </div>
      </div>

      {/* Total Pending Amount */}
      <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col gap-2">
        <span className="font-sans text-[11px] font-medium text-[#5A752A] uppercase tracking-[1px]">
          Total Pending Amount
        </span>
        <div className="flex flex-col gap-1 mt-1">
          <span className="font-heading font-bold text-[32px] text-[#E8EDD4] leading-none">£3,240.00</span>
        </div>
      </div>

      {/* Processed This Month */}
      <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col gap-2">
        <span className="font-sans text-[11px] font-medium text-[#5A752A] uppercase tracking-[1px]">
          Processed This Month
        </span>
        <div className="flex flex-col gap-1 mt-1">
          <span className="font-heading font-bold text-[32px] text-[#E8EDD4] leading-none">£18,640.00</span>
          <div className="flex items-center gap-1.5 mt-2">
            <div className="px-2 py-0.5 rounded-full border border-[#4ADE80]/30 bg-[#083b18] flex items-center justify-center">
              <svg className="w-2.5 h-2.5 text-[#4ADE80] mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
              </svg>
              <span className="font-sans font-medium text-[10px] text-[#4ADE80]">9%</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
