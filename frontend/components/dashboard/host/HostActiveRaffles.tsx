"use client";

import React from "react";
import { useHostRaffles } from "../../../hooks/useRaffleHooks";
import Link from "next/link";

export default function HostActiveRaffles() {
  const { data: response, isLoading } = useHostRaffles({ limit: 5, status: "Live" });
  const activeRaffles = response?.data || [];

  return (
    <div className="bg-[#161810] border border-[#2d3c13] rounded-[16px] p-[25px] w-full flex flex-col min-h-[330px]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading font-normal text-[16px] leading-[normal] text-[#e8edd4]">
          Active Raffles
        </h2>
        <Link href="/dashboard/host/competitions" className="text-[#8cb34a] font-sans font-medium text-[13px] hover:underline flex items-center">
          View All <span className="ml-1">→</span>
        </Link>
      </div>

      <div className="flex flex-col w-full">
        {isLoading && (
          <div className="flex flex-col gap-[12px]">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-[12px] h-[48px] animate-pulse">
                <div className="w-[32px] h-[32px] rounded-[6px] bg-[#1a230a] shrink-0"></div>
                <div className="flex-1 h-[14px] bg-[#1a230a] rounded"></div>
                <div className="w-[50px] h-[14px] bg-[#1a230a] rounded shrink-0"></div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && activeRaffles.length === 0 && (
          <div className="py-8 text-center text-[#5a752a] font-sans text-sm">
            No active raffles found.
          </div>
        )}

        {!isLoading && activeRaffles.map((comp: any) => {
          const progress = Math.min(Math.round((comp.ticketsSold / comp.totalTickets) * 100), 100);
          const isEndingSoon = false; // Add logic if needed, e.g., less than 24h left
          const imageUrl = comp.images && comp.images.length > 0 ? comp.images[0] : "https://placehold.co/100x100/1a230a/8cb34a?text=Raffle";

          return (
            <Link 
              href={`/dashboard/host/competitions`}
              key={comp.id} 
              className="flex items-center gap-[12px] h-[48px] border-b border-[#1a230a] last:border-0 hover:bg-[#1a230a]/20 transition-colors px-2 -mx-2 rounded-md cursor-pointer"
            >
              {/* Thumbnail */}
              <div className="w-[32px] h-[32px] rounded-[6px] overflow-hidden bg-[#1a230a] shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt={comp.title} className="w-full h-full object-cover" />
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
                  £{Number(comp.pricePerTicket || 0).toFixed(2)}
                </p>
              </div>

              {/* Status Pill */}
              <div className={`h-[22.5px] px-[8px] rounded-full flex items-center justify-center shrink-0 ${
                isEndingSoon ? "bg-[#78350f]" : "bg-[#083b18]"
              }`}>
                <span className={`font-sans font-medium text-[11px] ${
                  isEndingSoon ? "text-[#fbbf24]" : "text-[#4ade80]"
                }`}>
                  {isEndingSoon ? "Ending Soon" : "Live"}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
