import React from "react";
import { hostUpcomingDraws } from "../../../data/dashboard/host-dashboard.data";

export default function HostUpcomingDraws() {
  return (
    <div className="bg-[#161810] border border-[#2d3c13] rounded-[16px] p-[25px] w-full flex flex-col min-h-[330px]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading font-normal text-[16px] leading-[normal] text-[#e8edd4]">
          Upcoming Draws
        </h2>
      </div>

      <div className="flex flex-col w-full gap-[16px]">
        {hostUpcomingDraws.map((draw) => (
          <div key={draw.id} className="flex items-center gap-[12px]">
            {/* Date Badge */}
            <div className="w-[32px] h-[32px] rounded-[6px] border border-[#2d3c13] bg-[#1a230a] flex items-center justify-center shrink-0">
              <span className="font-heading font-bold text-[13px] text-[#8cb34a]">
                {draw.dateStr}
              </span>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 min-w-0">
              <p className="font-heading font-medium text-[13px] text-[#e8edd4] truncate">
                {draw.title}
              </p>
              <p className="font-sans font-normal text-[11px] text-[#5a752a] truncate">
                {draw.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
