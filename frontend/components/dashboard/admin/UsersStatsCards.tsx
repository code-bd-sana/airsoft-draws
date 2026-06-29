"use client";

import React from "react";

export default function UsersStatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      
      {/* Total Users */}
      <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col gap-2">
        <span className="font-sans text-[11px] font-medium text-[#5A752A] uppercase tracking-[1px]">
          Total Users
        </span>
        <div className="flex flex-col gap-1 mt-1">
          <span className="font-heading font-bold text-[32px] text-[#E8EDD4] leading-none">18,420</span>
          <div className="flex items-center gap-1.5 mt-2">
            <div className="px-2 py-0.5 rounded-full bg-[#083b18] flex items-center justify-center">
              <svg className="w-3 h-3 text-[#4ADE80]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
              </svg>
              <span className="font-sans font-medium text-[10px] text-[#4ADE80] ml-1">6%</span>
            </div>
          </div>
        </div>
      </div>

      {/* New This Month */}
      <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col gap-2">
        <span className="font-sans text-[11px] font-medium text-[#5A752A] uppercase tracking-[1px]">
          New This Month
        </span>
        <div className="flex flex-col gap-1 mt-1">
          <span className="font-heading font-bold text-[32px] text-[#E8EDD4] leading-none">1,240</span>
          <div className="flex items-center gap-1.5 mt-2">
            <div className="px-2 py-0.5 rounded-full bg-[#083b18] flex items-center justify-center">
              <svg className="w-3 h-3 text-[#4ADE80]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
              </svg>
              <span className="font-sans font-medium text-[10px] text-[#4ADE80] ml-1">12%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Users */}
      <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col gap-2">
        <span className="font-sans text-[11px] font-medium text-[#5A752A] uppercase tracking-[1px]">
          Active Users
        </span>
        <div className="flex flex-col gap-1 mt-1">
          <span className="font-heading font-bold text-[32px] text-[#E8EDD4] leading-none">16,800</span>
          <div className="flex items-center gap-1.5 mt-2">
            <div className="px-2 py-0.5 rounded-full bg-[#083b18] flex items-center justify-center">
              <svg className="w-3 h-3 text-[#4ADE80]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
              </svg>
              <span className="font-sans font-medium text-[10px] text-[#4ADE80] ml-1">91.2%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Blocked Users */}
      <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col gap-2">
        <span className="font-sans text-[11px] font-medium text-[#5A752A] uppercase tracking-[1px]">
          Blocked Users
        </span>
        <div className="flex flex-col gap-1 mt-1">
          <span className="font-heading font-bold text-[32px] text-[#E8EDD4] leading-none">320</span>
          <div className="flex items-center gap-1.5 mt-2">
            <div className="px-2 py-0.5 rounded-full bg-[#7F1D1D] flex items-center justify-center">
              <svg className="w-3 h-3 text-[#f76b6b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
              </svg>
              <span className="font-sans font-medium text-[10px] text-[#f76b6b] ml-1">2%</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
