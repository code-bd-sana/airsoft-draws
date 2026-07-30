"use client";

import React, { useState } from "react";
import { cn } from "../../../../lib/utils";
import { useHostRaffles } from "../../../../hooks/useRaffleHooks";
import WinnerDetailsModal from "./WinnerDetailsModal";

export default function WinnersTable() {
  const [activeFilter, setActiveFilter] = useState<"All" | "ACTIVE" | "ENDED">("All");
  const [selectedDrawToView, setSelectedDrawToView] = useState<any | null>(null);
  
  const { data: response, isLoading } = useHostRaffles();
  const raffles = response?.data || [];

  const filteredDraws = raffles.filter((r: any) => {
    if (activeFilter === "All") return true;
    return r.status === activeFilter;
  });

  if (isLoading) {
    return (
      <div className="w-full bg-[#161810] border border-[#2d3c13] rounded-[16px] overflow-hidden flex flex-col mt-[24px] animate-in fade-in duration-300">
        <div className="p-[24px] border-b border-[#2d3c13] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[16px]">
          <div>
            <div className="h-[24px] w-[150px] bg-[#2d3c13]/60 rounded animate-pulse mb-[8px]"></div>
            <div className="h-[16px] w-[250px] bg-[#2d3c13]/40 rounded animate-pulse"></div>
          </div>
          <div className="h-[40px] w-[210px] bg-[#2d3c13]/50 rounded-[10px] animate-pulse"></div>
        </div>
        <div className="w-full overflow-x-auto min-h-[400px]">
          <table className="w-full min-w-[800px] text-left border-collapse">
            <thead>
              <tr className="border-b border-[#2d3c13] bg-[#0d0d0b]/50">
                <th className="py-[16px] px-[24px]"><div className="h-[14px] w-[80px] bg-[#2d3c13]/50 rounded animate-pulse"></div></th>
                <th className="py-[16px] px-[24px]"><div className="h-[14px] w-[80px] bg-[#2d3c13]/50 rounded animate-pulse"></div></th>
                <th className="py-[16px] px-[24px]"><div className="h-[14px] w-[80px] bg-[#2d3c13]/50 rounded animate-pulse"></div></th>
                <th className="py-[16px] px-[24px] flex justify-end"><div className="h-[14px] w-[80px] bg-[#2d3c13]/50 rounded animate-pulse"></div></th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-[#2d3c13]/50 last:border-0">
                  <td className="py-[20px] px-[24px]">
                    <div className="flex flex-col gap-2">
                      <div className="h-[18px] w-[180px] bg-[#2d3c13]/60 rounded animate-pulse"></div>
                      <div className="h-[14px] w-[100px] bg-[#2d3c13]/40 rounded animate-pulse"></div>
                    </div>
                  </td>
                  <td className="py-[20px] px-[24px]">
                    <div className="h-[16px] w-[90px] bg-[#2d3c13]/40 rounded animate-pulse"></div>
                  </td>
                  <td className="py-[20px] px-[24px]">
                    <div className="h-[16px] w-[70px] bg-[#2d3c13]/40 rounded animate-pulse"></div>
                  </td>
                  <td className="py-[20px] px-[24px] text-right">
                    <div className="h-[36px] w-[120px] bg-[#8cb34a]/20 rounded-[6px] animate-pulse ml-auto"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#161810] border border-[#2d3c13] rounded-[16px] overflow-hidden flex flex-col mt-[24px]">
      
      {/* Header & Filter Tabs */}
      <div className="p-[24px] border-b border-[#2d3c13] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[16px]">
        <div>
          <h3 className="font-heading font-medium text-[18px] text-[#e8edd4]">
            My Competition Winners & Deliveries
          </h3>
          <p className="font-sans font-normal text-[14px] text-[#b3b8aa]">
            View winners (Instant Wins & Main Draw) and update prize delivery status.
          </p>
        </div>
        
        <div className="flex items-center gap-[8px] bg-[#0d0d0b] p-[4px] rounded-[10px] border border-[#2d3c13]">
          {(["All", "ACTIVE", "ENDED"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "px-[16px] py-[6px] rounded-[6px] font-sans font-medium text-[13px] transition-colors",
                activeFilter === filter
                  ? "bg-[#2d3c13] text-[#e8edd4]"
                  : "text-[#5a752a] hover:text-[#b3b8aa]"
              )}
            >
              {filter === "All" ? "All Competitions" : filter === "ACTIVE" ? "Active" : "Completed"}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto min-h-[350px]">
        <table className="w-full min-w-[800px] text-left border-collapse">
          <thead>
            <tr className="border-b border-[#2d3c13] bg-[#0d0d0b]/50">
              <th className="py-[16px] px-[24px] font-sans font-medium text-[12px] text-[#5a752a] uppercase tracking-wider">
                Competition Name
              </th>
              <th className="py-[16px] px-[24px] font-sans font-medium text-[12px] text-[#5a752a] uppercase tracking-wider">
                End / Draw Date
              </th>
              <th className="py-[16px] px-[24px] font-sans font-medium text-[12px] text-[#5a752a] uppercase tracking-wider">
                Tickets Sold
              </th>
              <th className="py-[16px] px-[24px] text-right font-sans font-medium text-[12px] text-[#5a752a] uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredDraws.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-[48px] text-center text-[#5a752a] font-sans text-[14px]">
                  No competitions found.
                </td>
              </tr>
            ) : (
              filteredDraws.map((draw: any, index: number) => (
                <tr 
                  key={draw.id}
                  className={cn(
                    "group transition-colors hover:bg-[#1a230a]",
                    index !== filteredDraws.length - 1 && "border-b border-[#2d3c13]/50"
                  )}
                >
                  <td className="py-[20px] px-[24px]">
                    <div className="flex flex-col gap-1">
                      <span className="font-sans font-medium text-[14px] text-[#e8edd4]">
                        {draw.title}
                      </span>
                      <span className="font-sans text-[12px] text-[#72943A]">
                        Status: <strong className="text-[#8CB34A] font-semibold">{draw.status}</strong>
                      </span>
                    </div>
                  </td>
                  <td className="py-[20px] px-[24px]">
                    <span className="font-sans font-medium text-[14px] text-[#b3b8aa]">
                      {draw.endDate ? new Date(draw.endDate).toLocaleDateString() : 'N/A'}
                    </span>
                  </td>
                  <td className="py-[20px] px-[24px]">
                    <span className="font-sans font-medium text-[14px] text-[#b3b8aa]">
                      {draw.ticketsSold} / {draw.totalTickets}
                    </span>
                  </td>
                  <td className="py-[20px] px-[24px] text-right">
                    <button 
                      onClick={() => setSelectedDrawToView(draw)}
                      className="h-[36px] px-[16px] bg-[#1A230A] border border-[#8CB34A] text-[#8CB34A] hover:bg-[#8CB34A] hover:text-[#0D0D0B] transition-all rounded-[6px] inline-flex items-center justify-center font-sans font-semibold text-[12px]"
                    >
                      🏆 View Winners & Delivery
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedDrawToView && (
        <WinnerDetailsModal
          isOpen={!!selectedDrawToView}
          onClose={() => setSelectedDrawToView(null)}
          raffle={selectedDrawToView}
        />
      )}
    </div>
  );
}
