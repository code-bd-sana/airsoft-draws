"use client";

import React from "react";
import PayoutMetricsCards from "../../../../components/dashboard/host/payouts/PayoutMetricsCards";
import PayoutHistoryTable from "../../../../components/dashboard/host/payouts/PayoutHistoryTable";
import { mockPayoutMetrics, mockPayoutHistory } from "../../../../data/dashboard/host-dashboard.data";

export default function PayoutsAndEarningsPage() {
  const handleWithdraw = () => {
    alert("Withdrawal request initiated. Processing will take 3-5 business days.");
  };

  return (
    <div className="flex-1 w-full px-[20px] lg:px-[40px] py-[24px] lg:py-[32px] flex flex-col gap-[24px] animate-in fade-in zoom-in-95 duration-300">
      
      {/* Commission Rate Banner */}
      <div className="w-full bg-[#161f08] border border-[#2d3c13] rounded-[16px] p-[24px] flex flex-col sm:flex-row sm:items-center justify-between gap-[16px]">
        <div className="flex items-center gap-[8px]">
          <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#8cb34a" className="w-[18px] h-[18px]">
            <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
          </svg>
          <span className="font-sans font-medium text-[14px] text-[#e8edd4]">
            Your Current Commission Rate
          </span>
        </div>
        <div className="flex flex-col items-end text-right">
          <span className="font-heading font-bold text-[24px] text-[#8cb34a] leading-none mb-[2px]">
            10%
          </span>
          <span className="font-sans font-medium text-[12px] text-[#5a752a] mb-[4px]">
            Premium Plan
          </span>
          <button className="font-sans font-medium text-[12px] text-[#a0d056] hover:text-[#8cb34a] transition-colors inline-flex items-center gap-[4px]">
            Compare Plans 
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-[12px] h-[12px]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <PayoutMetricsCards metrics={mockPayoutMetrics} />

      {/* History Table */}
      <PayoutHistoryTable history={mockPayoutHistory} />

    </div>
  );
}
