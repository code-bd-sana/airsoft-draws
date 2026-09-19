"use client";

import React from "react";
import { PerformanceTopRaffle } from "../../../../types/host-dashboard.types";

interface Props {
  data: PerformanceTopRaffle[];
  isLoading?: boolean;
}

function ListSkeleton() {
  return (
    <div className="flex flex-col gap-[20px] animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex flex-col gap-[8px]">
          <div className="flex items-center justify-between">
            <div className="h-3.5 bg-[#1A230A] rounded" style={{ width: `${120 + (i % 3) * 40}px` }} />
            <div className="h-3.5 w-10 bg-[#1A230A] rounded" />
          </div>
          <div className="w-full bg-[#1a230a] h-[6px] rounded-full overflow-hidden">
            <div className="bg-[#2D3C13] h-full rounded-full" style={{ width: `${60 - i * 10}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function TopRafflesList({ data = [], isLoading }: Props) {
  return (
    <div className="bg-[#161810] border border-[#2d3c13] rounded-[16px] p-[24px] flex flex-col flex-1">
      <div className="flex items-center justify-between mb-[24px]">
        <h3 className="font-heading font-medium text-[16px] text-[#e8edd4]">
          Top Performing Raffles
        </h3>
        <span className="font-sans text-[11px] text-[#5A752A]">Tickets Sold %</span>
      </div>
      
      {isLoading ? (
        <ListSkeleton />
      ) : data.length === 0 ? (
        <div className="flex-1 flex items-center justify-center py-8">
          <span className="text-xs font-sans text-[#5A752A]">No competitions available yet.</span>
        </div>
      ) : (
        <div className="flex flex-col gap-[20px]">
          {data.map((item) => (
            <div key={item.id} className="flex flex-col gap-[8px]">
              <div className="flex items-center justify-between text-[14px]">
                <span className="font-sans font-medium text-[#72943a] truncate max-w-[260px]" title={item.name}>
                  {item.name}
                </span>
                <span className="font-sans font-medium text-[#8cb34a] shrink-0">
                  {item.percentage}%
                </span>
              </div>
              
              {/* Progress Bar Container */}
              <div className="w-full bg-[#1a230a] h-[6px] rounded-full overflow-hidden">
                <div 
                  className="bg-[#8cb34a] h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(item.percentage, 3)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
