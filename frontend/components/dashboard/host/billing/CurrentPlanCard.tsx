"use client";

import React from "react";

export default function CurrentPlanCard() {
  return (
    <div className="w-full bg-[#1a230a] border border-[#2d3c13] rounded-[16px] p-[24px] lg:p-[32px] flex flex-col sm:flex-row sm:items-center justify-between gap-[24px]">
      
      {/* Plan Details */}
      <div className="flex flex-col gap-[8px]">
        <h2 className="font-heading font-medium text-[20px] text-[#e8edd4]">
          Current Plan: Premium
        </h2>
        <p className="font-sans font-medium text-[14px] text-[#8cb34a]">
          £8/month · Renews 14 July 2025
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-[24px]">
        <button className="h-[40px] px-[24px] bg-transparent border border-[#2d3c13] hover:border-[#8cb34a] rounded-[8px] font-sans font-medium text-[13px] text-[#e8edd4] transition-colors">
          Upgrade to Pro
        </button>
        <button className="font-sans font-medium text-[13px] text-[#ff4d4f] hover:text-[#ff7875] transition-colors">
          Cancel Subscription
        </button>
      </div>
      
    </div>
  );
}
