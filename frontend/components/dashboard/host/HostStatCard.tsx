import React from "react";
import { HostDashboardStat } from "../../../types/host-dashboard.types";
import { cn } from "../../../lib/utils";

interface HostStatCardProps {
  stat: HostDashboardStat;
}

export default function HostStatCard({ stat }: HostStatCardProps) {
  return (
    <div className="bg-[#161810] border border-[#2d3c13] rounded-[16px] p-[21px] flex flex-col justify-between h-[110px] w-full">
      <div className="w-full">
        <p className="font-sans font-medium text-[11px] leading-[16.5px] tracking-[0.88px] uppercase text-[#5a752a]">
          {stat.label}
        </p>
      </div>
      <div className="w-full flex items-end justify-between mt-auto">
        <div className="h-[42px] flex items-center">
          <p className="font-heading font-bold text-[28px] leading-[42px] text-[#e8edd4]">
            {stat.value}
          </p>
        </div>
        {stat.change && (
          <div className={cn(
            "rounded-[99px] px-[8px] py-[3px] flex items-center gap-[2px]",
            stat.trend === "up" ? "bg-[#083b18]" : "bg-[#3b0808]" // basic down state example
          )}>
            <span className={cn(
              "font-sans font-medium text-[11px] leading-[16.5px]",
              stat.trend === "up" ? "text-[#4ade80]" : "text-[#f87171]"
            )}>
              {stat.change}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
