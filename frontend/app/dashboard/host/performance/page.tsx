"use client";

import React, { useState } from "react";
import RevenueTrendChart from "../../../../components/dashboard/host/performance/RevenueTrendChart";
import CategorySalesChart from "../../../../components/dashboard/host/performance/CategorySalesChart";
import TopRafflesList from "../../../../components/dashboard/host/performance/TopRafflesList";
import DemographicsList from "../../../../components/dashboard/host/performance/DemographicsList";
import { useHostPerformanceAnalytics } from "../../../../hooks/useHostWalletHooks";
import { cn } from "../../../../lib/utils";

const TIMEFRAMES: ('7D' | '1M' | '3M' | '1Y')[] = ["7D", "1M", "3M", "1Y"];

export default function PerformanceStatsPage() {
  const [activeTimeframe, setActiveTimeframe] = useState<'7D' | '1M' | '3M' | '1Y'>("1M");
  const { data, isLoading, isFetching, isError, refetch } = useHostPerformanceAnalytics(activeTimeframe);

  const revenueData = data?.revenueTrend || [];
  const categoryData = data?.categorySales || [];
  const topRafflesData = data?.topRaffles || [];
  const demographicsData = data?.demographics || [];

  return (
    <div className="flex-1 w-full px-[20px] lg:px-[40px] py-[24px] lg:py-[32px] flex flex-col gap-[24px] animate-in fade-in zoom-in-95 duration-300">
      
      {/* Header Actions (Timeframes) */}
      <div className="flex items-center justify-between">
        <div>
          {isFetching && !isLoading && (
            <span className="inline-flex items-center gap-1.5 text-xs text-[#8CB34A]/70 animate-pulse font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8CB34A]" />
              Updating metrics...
            </span>
          )}
        </div>
        <div className="flex items-center gap-[12px]">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf}
              onClick={() => setActiveTimeframe(tf)}
              disabled={isLoading}
              className={cn(
                "w-[34px] h-[34px] rounded-full flex items-center justify-center border font-sans font-medium text-[12px] transition-all",
                activeTimeframe === tf
                  ? "border-[#8cb34a] bg-[#8cb34a]/10 text-[#8cb34a] shadow-[0_0_10px_rgba(140,179,74,0.15)]"
                  : "border-[#2d3c13] text-[#5a752a] hover:border-[#5a752a] hover:text-[#8cb34a]"
              )}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {isError && (
        <div className="bg-[#441111]/30 border border-[#AA2222]/40 rounded-xl p-4 flex items-center justify-between">
          <p className="text-[#FF8888] text-sm">Failed to load performance analytics.</p>
          <button
            onClick={() => refetch()}
            className="px-3 py-1 bg-[#2D3C13] hover:bg-[#3D4C1E] text-[#8CB34A] text-xs font-semibold rounded transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Top Row: Revenue Trend & Category Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[24px]">
        <div className="lg:col-span-2">
          <RevenueTrendChart data={revenueData} isLoading={isLoading} />
        </div>
        <div className="lg:col-span-1">
          <CategorySalesChart data={categoryData} isLoading={isLoading} />
        </div>
      </div>

      {/* Bottom Row: Top Raffles & Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px]">
        <TopRafflesList data={topRafflesData} isLoading={isLoading} />
        <DemographicsList data={demographicsData} isLoading={isLoading} />
      </div>

    </div>
  );
}
