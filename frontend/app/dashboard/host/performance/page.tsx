"use client";

import React, { useState } from "react";
import RevenueTrendChart from "../../../../components/dashboard/host/performance/RevenueTrendChart";
import CategorySalesChart from "../../../../components/dashboard/host/performance/CategorySalesChart";
import TopRafflesList from "../../../../components/dashboard/host/performance/TopRafflesList";
import DemographicsList from "../../../../components/dashboard/host/performance/DemographicsList";
import { 
  mockPerformanceRevenue, 
  mockPerformanceCategories, 
  mockPerformanceTopRaffles, 
  mockPerformanceDemographics 
} from "../../../../data/dashboard/host-dashboard.data";
import { cn } from "../../../../lib/utils";

const TIMEFRAMES = ["7D", "1M", "3M", "1Y"];

export default function PerformanceStatsPage() {
  const [activeTimeframe, setActiveTimeframe] = useState("1M");

  return (
    <div className="flex-1 w-full px-[20px] lg:px-[40px] py-[24px] lg:py-[32px] flex flex-col gap-[24px] animate-in fade-in zoom-in-95 duration-300">
      
      {/* Header Actions (Timeframes) */}
      <div className="flex justify-end">
        <div className="flex items-center gap-[12px]">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf}
              onClick={() => setActiveTimeframe(tf)}
              className={cn(
                "w-[32px] h-[32px] rounded-full flex items-center justify-center border font-sans font-medium text-[12px] transition-colors",
                activeTimeframe === tf
                  ? "border-[#8cb34a] text-[#8cb34a]"
                  : "border-[#2d3c13] text-[#5a752a] hover:border-[#5a752a]"
              )}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Top Row: Revenue Trend & Category Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[24px]">
        <div className="lg:col-span-2">
          <RevenueTrendChart data={mockPerformanceRevenue} />
        </div>
        <div className="lg:col-span-1">
          <CategorySalesChart data={mockPerformanceCategories} />
        </div>
      </div>

      {/* Bottom Row: Top Raffles & Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px]">
        <TopRafflesList data={mockPerformanceTopRaffles} />
        <DemographicsList data={mockPerformanceDemographics} />
      </div>

    </div>
  );
}
