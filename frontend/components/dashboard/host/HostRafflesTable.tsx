"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useHostRaffles, useDeleteRaffle, useDrawWinner } from "../../../hooks/useRaffleHooks";
import { cn } from "../../../lib/utils";
import { Pagination } from "../../ui/Pagination";

const filters = ["All", "Live", "Pending Review", "Ended", "Drafts"];

export default function HostRafflesTable() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [drawingId, setDrawingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const { data: response, isLoading } = useHostRaffles({ page, limit: 10, status: activeFilter });
  const raffles = response?.data || [];
  const meta = response?.meta;
  const deleteMutation = useDeleteRaffle();
  const drawWinnerMutation = useDrawWinner();

  const toggleRow = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="w-full flex flex-col gap-[24px]">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[16px]">
        <div className="flex flex-wrap items-center gap-[12px]">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => {
                setActiveFilter(filter);
                setPage(1);
              }}
              className={cn(
                "h-[32px] px-[16px] rounded-full border transition-colors flex items-center justify-center font-sans font-medium text-[13px]",
                activeFilter === filter
                  ? "border-[#8cb34a] text-[#8cb34a] bg-[#1a230a]"
                  : "border-[#2d3c13] text-[#5a752a] hover:bg-[#1a230a]/50"
              )}
            >
              {filter}
            </button>
          ))}
        </div>
        <Link 
          href="/dashboard/host/create"
          className="h-[40px] px-[20px] bg-[#8cb34a] hover:bg-[#72943a] transition-colors rounded-[8px] flex items-center justify-center shrink-0"
        >
          <span className="font-heading font-medium text-[14px] text-[#0d0d0b]">
            + Create Raffle
          </span>
        </Link>
      </div>

      {/* Table Container */}
      <div className="w-full bg-[#161810] border border-[#2d3c13] rounded-[16px] overflow-hidden flex flex-col">
        {/* Table Header */}
        <div className="grid grid-cols-5 items-center px-[24px] h-[48px] border-b border-[#2d3c13] bg-[#161810]">
          <div className="col-span-2 sm:col-span-1">
            <span className="font-sans font-medium text-[11px] leading-[16.5px] tracking-[0.88px] uppercase text-[#5a752a]">
              Raffle Name
            </span>
          </div>
          <div className="hidden sm:block">
            <span className="font-sans font-medium text-[11px] leading-[16.5px] tracking-[0.88px] uppercase text-[#5a752a]">
              Tickets Sold
            </span>
          </div>
          <div className="hidden sm:block">
            <span className="font-sans font-medium text-[11px] leading-[16.5px] tracking-[0.88px] uppercase text-[#5a752a]">
              Raised
            </span>
          </div>
          <div>
            <span className="font-sans font-medium text-[11px] leading-[16.5px] tracking-[0.88px] uppercase text-[#5a752a]">
              Status
            </span>
          </div>
          <div className="hidden md:block text-right">
            <span className="font-sans font-medium text-[11px] leading-[16.5px] tracking-[0.88px] uppercase text-[#5a752a]">
              Ends
            </span>
          </div>
        </div>

        {/* Table Rows */}
        <div className="flex flex-col">
          {isLoading && (
            <div className="p-8 text-center text-[#5a752a]">Loading raffles...</div>
          )}
          
          {!isLoading && raffles.map((raffle: any) => {
            const isExpanded = expandedId === raffle.id;
            return (
              <div key={raffle.id} className="flex flex-col border-b border-[#2d3c13] last:border-b-0">
                {/* Main Row */}
                <div
                  onClick={() => toggleRow(raffle.id)}
                  className="grid grid-cols-5 items-center px-[24px] min-h-[72px] py-3 cursor-pointer hover:bg-[#1a230a]/50 transition-colors bg-[#161810]"
                >
                  <div className="col-span-2 sm:col-span-1 flex items-center gap-[12px] min-w-0 pr-4">
                    <svg
                      className={cn(
                        "w-[12px] h-[12px] shrink-0 text-[#72943a] transition-transform duration-200",
                        isExpanded ? "rotate-180" : "rotate-0"
                      )}
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                    <span className="font-heading font-medium text-[14px] text-[#e8edd4] truncate">
                      {raffle.title}
                    </span>
                  </div>
                  
                  <div className="hidden sm:block">
                    <span className="font-sans font-normal text-[13px] text-[#a0d056]">
                      {raffle.ticketsSold} / {raffle.totalTickets}
                    </span>
                  </div>
                  
                  <div className="hidden sm:block">
                    <span className="font-heading font-medium text-[14px] text-[#e8edd4]">
                      £{(Number(raffle.pricePerTicket) * raffle.ticketsSold).toFixed(2)}
                    </span>
                  </div>
                  
                  <div>
                    <div className={cn(
                      "inline-flex h-[22px] px-[10px] items-center justify-center rounded-full",
                      raffle.status === "ACTIVE" && "bg-[#083b18] text-[#4ade80]",
                      raffle.status === "ENDED" && "bg-[#3b0808] text-[#f87171]",
                      raffle.status === "DRAFT" && "bg-[#1a230a] text-[#5a752a] border border-[#2d3c13]",
                      raffle.status === "PENDING_APPROVAL" && "bg-[#422006] text-[#eab308]",
                      raffle.status === "CANCELLED" && "bg-[#3b0808] text-[#f87171]"
                    )}>
                      <span className="font-sans font-medium text-[11px]">
                        {raffle.status === "ACTIVE" ? "Live" : raffle.status === "PENDING_APPROVAL" ? "Pending Review" : raffle.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="hidden md:flex justify-end min-w-0">
                    <span className="font-sans font-normal text-[13px] text-[#b3b8aa] truncate">
                      {new Date(raffle.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Expanded Details Panel */}
                {isExpanded && (
                  <div className="w-full bg-[#0d0d0b] border-t border-[#1a230a] px-[24px] py-[32px] flex flex-col md:flex-row gap-[40px] md:gap-[80px]">
                    {/* Gross Revenue */}
                    <div className="flex flex-col gap-[8px]">
                      <span className="font-sans font-medium text-[11px] leading-[16.5px] tracking-[0.88px] uppercase text-[#5a752a]">
                        Gross Revenue
                      </span>
                      <div className="flex flex-col">
                        <span className="font-heading font-bold text-[24px] text-[#e8edd4]">
                          £{(Number(raffle.pricePerTicket) * raffle.ticketsSold).toFixed(2)}
                        </span>
                        <span className="font-sans font-normal text-[11px] text-[#5a752a]">
                          {raffle.ticketsSold} tickets × £{Number(raffle.pricePerTicket).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Platform Fee */}
                    <div className="flex flex-col gap-[8px]">
                      <span className="font-sans font-medium text-[11px] leading-[16.5px] tracking-[0.88px] uppercase text-[#5a752a]">
                        Platform Fee
                      </span>
                      <div className="flex items-center gap-[12px]">
                        <span className="font-heading font-bold text-[24px] text-[#f76b6b]">
                          - £{((Number(raffle.pricePerTicket) * raffle.ticketsSold) * 0.05).toFixed(2)}
                        </span>
                        <div className="h-[22px] px-[8px] bg-[#1a230a] border border-[#2d3c13] rounded-full flex items-center justify-center">
                          <span className="font-sans font-medium text-[10px] text-[#a0d056]">
                            5% (Standard)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="hidden md:block w-px bg-[#1a230a] shrink-0 self-stretch" />

                    {/* Your Earnings */}
                    <div className="flex flex-col gap-[8px] flex-1">
                      <span className="font-sans font-medium text-[11px] leading-[16.5px] tracking-[0.88px] uppercase text-[#5a752a]">
                        Your Earnings
                      </span>
                      <div className="flex flex-col relative w-full">
                        <span className="font-heading font-bold text-[24px] text-[#8cb34a]">
                          £{((Number(raffle.pricePerTicket) * raffle.ticketsSold) * 0.95).toFixed(2)}
                        </span>
                        <span className="font-sans font-normal text-[11px] text-[#5a752a]">
                          Paid out on completion
                        </span>
                        
                        {/* Action buttons */}
                        <div className="mt-4 md:absolute md:bottom-0 md:right-0 md:mt-0 flex gap-4 items-center">
                          {raffle.status === "ACTIVE" && (
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                if (confirm("Are you sure you want to run the draw now?")) {
                                  setDrawingId(raffle.id);
                                  try {
                                    await new Promise(res => setTimeout(res, 3000));
                                    await drawWinnerMutation.mutateAsync(raffle.id);
                                    alert("Draw completed successfully!");
                                  } catch (err: any) {
                                    alert(err?.response?.data?.message || "Failed to run draw");
                                  } finally {
                                    setDrawingId(null);
                                  }
                                }
                              }}
                              disabled={drawingId === raffle.id}
                              className="font-sans font-medium text-[12px] px-[16px] py-[6px] bg-[#8cb34a] disabled:opacity-50 text-[#0d0d0b] rounded-[6px] hover:bg-[#72943a] transition-colors flex items-center"
                            >
                              {drawingId === raffle.id ? "Drawing..." : "Run Draw Now"}
                            </button>
                          )}
                          {raffle.status === "ENDED" && (
                            <Link
                              href="/dashboard/host/winners"
                              onClick={(e) => e.stopPropagation()}
                              className="font-sans font-medium text-[12px] px-[16px] py-[6px] bg-[#1a230a] text-[#8cb34a] border border-[#2d3c13] rounded-[6px] hover:bg-[#2d3c13] transition-colors flex items-center"
                            >
                              View Winners
                            </Link>
                          )}
                          <Link
                            href={`/dashboard/host/competitions/${raffle.id}/edit`}
                            onClick={(e) => e.stopPropagation()}
                            className="font-sans font-medium text-[12px] text-[#5a752a] hover:text-[#e8edd4] transition-colors flex items-center gap-1 group ml-[8px]"
                          >
                            Edit
                          </Link>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm('Are you sure you want to delete this competition?')) {
                                deleteMutation.mutate(raffle.id);
                              }
                            }}
                            className="font-sans font-medium text-[12px] text-red-500 hover:text-red-400 transition-colors flex items-center gap-1 group ml-[8px]"
                          >
                            Delete Competition
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          
          {!isLoading && raffles?.length === 0 && (
            <div className="p-8 text-center text-[#5a752a]">No competitions found.</div>
          )}
        </div>
      </div>

      {/* Pagination component */}
      {/* Pagination component */}
      {!isLoading && meta && meta.total > 0 && (
        <Pagination 
          currentPage={meta.page}
          totalPages={meta.lastPage}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
