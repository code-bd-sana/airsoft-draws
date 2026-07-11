"use client";

import React from "react";
import { PerformanceTopRaffle } from "../../../../types/host-dashboard.types";

interface Props {
  data: PerformanceTopRaffle[];
}

export default function TopRafflesList({ data = [] }: Props) {
  return (
    <div className="bg-[#161810] border border-[#2d3c13] rounded-[16px] p-[24px] flex flex-col flex-1">
      <h3 className="font-heading font-medium text-[16px] text-[#e8edd4] mb-[24px]">
        Top Performing Raffles
      </h3>
      
      <div className="flex flex-col gap-[20px]">
        {data.map((item) => (
          <div key={item.id} className="flex flex-col gap-[8px]">
            <div className="flex items-center justify-between text-[14px]">
              <span className="font-sans font-medium text-[#72943a]">
                {item.name}
              </span>
              <span className="font-sans font-medium text-[#8cb34a]">
                {item.percentage}%
              </span>
            </div>
            
            {/* Progress Bar Container */}
            <div className="w-full bg-[#1a230a] h-[6px] rounded-full overflow-hidden">
              <div 
                className="bg-[#8cb34a] h-full rounded-full transition-all duration-500"
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
