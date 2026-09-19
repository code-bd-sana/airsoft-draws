"use client";

import React, { useState } from "react";
import { HostRaffleDetail } from "../../../../types/host-dashboard.types";
import { cn } from "../../../../lib/utils";

export interface HostRaffleSalesItem {
  id: string;
  name: string;
  slug?: string;
  image?: string | null;
  status: string;
  ticketsSold: number;
  totalTickets: number;
  ticketPrice: number;
  grossRevenue: number;
  netRevenue?: number;
}

interface Props {
  raffles: HostRaffleSalesItem[];
  isLoading?: boolean;
}

export default function SalesBreakdownTable({ raffles, isLoading }: Props) {
  const [activeTab, setActiveTab] = useState("All");
  
  const tabs = ["All", "Active", "Completed"];
  
  const filteredRaffles = raffles.filter(r => {
    if (activeTab === "All") return true;
    if (activeTab === "Active") return r.status === "Live";
    if (activeTab === "Completed") return r.status === "Completed";
    return true;
  });

  return (
    <div className="w-full bg-[#161810] border border-[#2d3c13] rounded-[16px] overflow-hidden flex flex-col mt-[24px]">
      
      {/* Header & Tabs */}
      <div className="p-[24px] border-b border-[#2d3c13] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[16px]">
        <div>
          <h3 className="font-heading font-medium text-[18px] text-[#e8edd4]">
            Competition Breakdown
          </h3>
          <p className="font-sans font-normal text-[14px] text-[#b3b8aa]">
            Individual performance metrics for your raffles.
          </p>
        </div>
        
        <div className="flex items-center gap-[8px] bg-[#0d0d0b] p-[4px] rounded-[10px] border border-[#2d3c13]">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-[16px] py-[6px] rounded-[6px] font-sans font-medium text-[13px] transition-colors",
                activeTab === tab
                  ? "bg-[#2d3c13] text-[#e8edd4]"
                  : "text-[#5a752a] hover:text-[#b3b8aa]"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[800px] text-left border-collapse">
          <thead>
            <tr className="border-b border-[#2d3c13] bg-[#0d0d0b]/50">
              <th className="py-[16px] px-[24px] font-sans font-medium text-[12px] text-[#5a752a] uppercase tracking-wider">
                Item
              </th>
              <th className="py-[16px] px-[24px] font-sans font-medium text-[12px] text-[#5a752a] uppercase tracking-wider">
                Status
              </th>
              <th className="py-[16px] px-[24px] font-sans font-medium text-[12px] text-[#5a752a] uppercase tracking-wider">
                Tickets Sold
              </th>
              <th className="py-[16px] px-[24px] font-sans font-medium text-[12px] text-[#5a752a] uppercase tracking-wider">
                Price
              </th>
              <th className="py-[16px] px-[24px] font-sans font-medium text-[12px] text-[#5a752a] uppercase tracking-wider">
                Gross Revenue
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <tr key={idx} className="border-b border-[#2d3c13]/40 animate-pulse">
                  <td className="py-[20px] px-[24px]">
                    <div className="h-4 w-48 bg-[#1A230A] rounded" />
                  </td>
                  <td className="py-[20px] px-[24px]">
                    <div className="h-5 w-16 bg-[#1A230A] rounded-full" />
                  </td>
                  <td className="py-[20px] px-[24px]">
                    <div className="flex flex-col gap-1.5">
                      <div className="h-4 w-20 bg-[#1A230A] rounded" />
                      <div className="w-[100px] h-[4px] bg-[#1A230A]/60 rounded-full" />
                    </div>
                  </td>
                  <td className="py-[20px] px-[24px]">
                    <div className="h-4 w-14 bg-[#1A230A] rounded" />
                  </td>
                  <td className="py-[20px] px-[24px]">
                    <div className="h-4 w-16 bg-[#1A230A] rounded" />
                  </td>
                </tr>
              ))
            ) : filteredRaffles.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-[48px] text-center text-[#72943A] font-sans text-sm">
                  No {activeTab !== "All" ? activeTab.toLowerCase() : ""} competitions found.
                </td>
              </tr>
            ) : (
              filteredRaffles.map((raffle, index) => (
                <tr 
                  key={raffle.id}
                  className={cn(
                    "group transition-colors hover:bg-[#1a230a]",
                    index !== filteredRaffles.length - 1 && "border-b border-[#2d3c13]/50"
                  )}
                >
                  <td className="py-[20px] px-[24px]">
                    <span className="font-sans font-medium text-[14px] text-[#e8edd4]">
                      {raffle.name}
                    </span>
                  </td>
                  <td className="py-[20px] px-[24px]">
                    <span className={cn(
                      "inline-flex px-[10px] py-[4px] rounded-full font-sans font-medium text-[11px]",
                      raffle.status === "Live" && "bg-[#8cb34a]/10 text-[#8cb34a] border border-[#8cb34a]/20",
                      raffle.status === "Completed" && "bg-[#5a752a]/10 text-[#5a752a] border border-[#5a752a]/20",
                      (raffle.status === "Draft" || raffle.status === "Pending Review") && "bg-[#f76b6b]/10 text-[#f76b6b] border border-[#f76b6b]/20"
                    )}>
                      {raffle.status}
                    </span>
                  </td>
                  <td className="py-[20px] px-[24px]">
                    <div className="flex flex-col gap-[4px]">
                      <span className="font-sans font-medium text-[14px] text-[#e8edd4]">
                        {raffle.ticketsSold} <span className="text-[#5a752a]">/ {raffle.totalTickets}</span>
                      </span>
                      {/* Tiny Progress bar */}
                      <div className="w-full max-w-[100px] h-[4px] bg-[#0d0d0b] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#8cb34a]"
                          style={{ width: `${raffle.totalTickets > 0 ? (raffle.ticketsSold / raffle.totalTickets) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-[20px] px-[24px]">
                    <span className="font-sans font-medium text-[14px] text-[#b3b8aa]">
                      £{raffle.ticketPrice.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-[20px] px-[24px]">
                    <span className="font-heading font-medium text-[15px] text-[#8cb34a]">
                      £{raffle.grossRevenue.toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
