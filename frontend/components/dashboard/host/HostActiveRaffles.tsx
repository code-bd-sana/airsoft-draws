import React from "react";
import { hostRecentCompetitions } from "../../../data/dashboard/host-dashboard.data";

export default function HostActiveRaffles() {
  return (
    <div className="bg-[#161810] border border-[#2d3c13] rounded-[16px] p-[25px] w-full flex flex-col min-h-[330px]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading font-normal text-[16px] leading-[normal] text-[#e8edd4]">
          Active Raffles
        </h2>
        <button className="text-[#8cb34a] font-sans font-medium text-[13px] hover:underline flex items-center">
          View All <span className="ml-1">→</span>
        </button>
      </div>

      <div className="flex flex-col w-full">
        {hostRecentCompetitions.map((comp) => {
          const progress = Math.round((comp.soldTickets / comp.totalTickets) * 100);
          return (
            <div 
              key={comp.id} 
              className="flex items-center gap-[12px] h-[48px] border-b border-[#1a230a] last:border-0 hover:bg-[#1a230a]/20 transition-colors px-2 -mx-2 rounded-md cursor-pointer"
            >
              {/* Thumbnail */}
              <div className="w-[32px] h-[32px] rounded-[6px] overflow-hidden bg-[#1a230a] shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={comp.image} alt={comp.title} className="w-full h-full object-cover" />
              </div>

              {/* Title */}
              <div className="flex-1 min-w-0">
                <p className="font-heading font-medium text-[13px] text-[#e8edd4] truncate">
                  {comp.title}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-[60px] h-[4px] bg-[#1a230a] rounded-full overflow-hidden shrink-0 hidden sm:block">
                <div 
                  className="h-full bg-[#8cb34a] rounded-full" 
                  style={{ width: `${progress}%` }} 
                />
              </div>

              {/* Price */}
              <div className="w-[50px] shrink-0 text-right">
                <p className="font-sans font-normal text-[13px] text-[#a0d056]">
                  £{comp.ticketPrice?.toFixed(2) || "5.00"}
                </p>
              </div>

              {/* Status Pill */}
              <div className={`h-[22.5px] px-[8px] rounded-full flex items-center justify-center shrink-0 ${
                comp.status === "ending-soon" ? "bg-[#78350f]" : "bg-[#083b18]"
              }`}>
                <span className={`font-sans font-medium text-[11px] ${
                  comp.status === "ending-soon" ? "text-[#fbbf24]" : "text-[#4ade80]"
                }`}>
                  {comp.status === "ending-soon" ? "Ending Soon" : "Live"}
                </span>
              </div>

              {/* Ellipsis */}
              <div className="w-[16px] h-[16px] shrink-0 text-[#b3b8aa] hidden md:flex items-center justify-center cursor-pointer hover:text-[#e8edd4]">
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-[14px] h-[14px]">
                  <path d="M6 10.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM13.5 10.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM21 10.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                </svg>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
