"use client";

import React from "react";
import { PerformanceDemographic } from "../../../../types/host-dashboard.types";

interface Props {
  data: PerformanceDemographic[];
}

export default function DemographicsList({ data = [] }: Props) {
  return (
    <div className="bg-[#161810] border border-[#2d3c13] rounded-[16px] p-[24px] flex flex-col flex-1">
      <h3 className="font-heading font-medium text-[16px] text-[#e8edd4] mb-[24px]">
        Entrant Demographics
      </h3>
      
      <div className="flex flex-col gap-[20px]">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col gap-[8px]">
            <div className="flex items-center justify-between text-[14px]">
              <span className="font-sans font-medium text-[#72943a]">
                {item.region}
              </span>
              <span className="font-sans font-medium text-[#e8edd4]">
                {item.percentage}%
              </span>
            </div>
            
            {/* Progress Bar Container */}
            <div className="w-full bg-[#1a230a] h-[6px] rounded-full overflow-hidden">
              <div 
                className="bg-[#5a752a] h-full rounded-full transition-all duration-500"
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
