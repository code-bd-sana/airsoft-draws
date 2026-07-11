"use client";

import React from "react";
import { useHostRaffles } from "../../../hooks/useRaffleHooks";
import Link from "next/link";

export default function HostUpcomingDraws() {
  const { data: response, isLoading } = useHostRaffles({ limit: 10, status: "Live" });
  
  // Sort by endDate ascending to get the soonest draws, take top 5
  const upcomingDraws = (response?.data || [])
    .sort((a: any, b: any) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
    .slice(0, 5);

  return (
    <div className="bg-[#161810] border border-[#2d3c13] rounded-[16px] p-[25px] w-full flex flex-col min-h-[330px]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading font-normal text-[16px] leading-[normal] text-[#e8edd4]">
          Upcoming Draws
        </h2>
        <Link href="/dashboard/host/winners" className="text-[#8cb34a] font-sans font-medium text-[13px] hover:underline flex items-center">
          View All <span className="ml-1">→</span>
        </Link>
      </div>

      <div className="flex flex-col w-full gap-[16px]">
        {isLoading && (
          <div className="flex flex-col gap-[16px]">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-[12px] animate-pulse">
                <div className="w-[32px] h-[32px] rounded-[6px] bg-[#1a230a] shrink-0"></div>
                <div className="flex flex-col flex-1 gap-2">
                  <div className="h-[12px] bg-[#1a230a] rounded w-3/4"></div>
                  <div className="h-[10px] bg-[#1a230a] rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && upcomingDraws.length === 0 && (
          <div className="py-8 text-center text-[#5a752a] font-sans text-sm">
            No upcoming draws found.
          </div>
        )}

        {!isLoading && upcomingDraws.map((draw: any) => {
          const dateObj = new Date(draw.endDate);
          const dayNumber = dateObj.getDate();
          
          return (
            <Link 
              href="/dashboard/host/winners"
              key={draw.id} 
              className="flex items-center gap-[12px] hover:bg-[#1a230a]/30 p-2 -mx-2 rounded-md transition-colors cursor-pointer"
            >
              {/* Date Badge */}
              <div className="w-[32px] h-[32px] rounded-[6px] border border-[#2d3c13] bg-[#1a230a] flex items-center justify-center shrink-0">
                <span className="font-heading font-bold text-[13px] text-[#8cb34a]">
                  {dayNumber}
                </span>
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 min-w-0">
                <p className="font-heading font-medium text-[13px] text-[#e8edd4] truncate">
                  {draw.title}
                </p>
                <p className="font-sans font-normal text-[11px] text-[#5a752a] truncate">
                  {draw.ticketsSold} / {draw.totalTickets} tickets sold • Ends {dateObj.toLocaleDateString()}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
