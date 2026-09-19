import React from "react";
import { HostDashboardStat } from "../../../../types/host-dashboard.types";
import { cn } from "../../../../lib/utils";

interface Props {
  metrics: HostDashboardStat[];
  isLoading?: boolean;
}

export default function SalesMetricsCards({ metrics, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[24px] animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div 
            key={i}
            className="flex flex-col p-[24px] bg-[#161810] border border-[#2d3c13] rounded-[16px] justify-between h-[126px]"
          >
            <div className="h-3 w-28 bg-[#1A230A] rounded mb-[12px]" />
            <div className="flex items-end justify-between mt-auto">
              <div className="h-8 w-24 bg-[#1A230A] rounded" />
              <div className="h-5 w-20 bg-[#1A230A]/60 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[24px]">
      {metrics.map((metric) => (
        <div 
          key={metric.id}
          className="flex flex-col p-[24px] bg-[#161810] border border-[#2d3c13] rounded-[16px] hover:border-[#8cb34a]/50 transition-colors"
        >
          <span className="font-sans font-medium text-[13px] text-[#b3b8aa] mb-[12px]">
            {metric.label}
          </span>
          <div className="flex items-end justify-between">
            <span className="font-heading font-medium text-[32px] text-[#e8edd4] leading-none">
              {metric.value}
            </span>
            <span 
              className={cn(
                "font-sans font-medium text-[12px] px-[8px] py-[4px] rounded-full",
                metric.trend === "up" 
                  ? "bg-[#4ade80]/10 text-[#4ade80]" 
                  : "bg-[#f76b6b]/10 text-[#f76b6b]"
              )}
            >
              {metric.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
