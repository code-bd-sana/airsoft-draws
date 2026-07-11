"use client";

import React, { useState } from "react";
import { cn } from "../../../../lib/utils";
import DrawConfirmationModal from "./DrawConfirmationModal";
import { useHostRaffles, useDrawWinner } from "../../../../hooks/useRaffleHooks";
import WinnerDetailsModal from "./WinnerDetailsModal";

export default function WinnersTable() {
  const [activeTab, setActiveTab] = useState<"Awaiting Draw" | "Drawn">("Awaiting Draw");
  const [selectedDrawToRun, setSelectedDrawToRun] = useState<any | null>(null);
  const [selectedDrawToView, setSelectedDrawToView] = useState<any | null>(null);
  
  const { data: response, isLoading } = useHostRaffles();
  const raffles = response?.data || [];
  const drawWinnerMutation = useDrawWinner();

  // Filter based on status
  // Awaiting Draw = ACTIVE or PENDING_APPROVAL or DRAFT
  // Drawn = ENDED
  const filteredDraws = raffles.filter((r: any) => {
    if (activeTab === "Awaiting Draw") {
      return r.status !== 'ENDED' && r.status !== 'CANCELLED';
    } else {
      return r.status === 'ENDED';
    }
  });

  const handleConfirmDraw = async () => {
    if (!selectedDrawToRun) return;
    try {
      await drawWinnerMutation.mutateAsync(selectedDrawToRun.id);
      setSelectedDrawToRun(null);
      // Wait a bit or let React Query invalidate the UI
      setActiveTab("Drawn");
    } catch (e: any) {
      alert(e?.response?.data?.message || "Failed to draw winner");
    }
  };

  if (isLoading) {
    return <div className="p-8 text-[#5a752a]">Loading competitions...</div>;
  }

  return (
    <div className="w-full bg-[#161810] border border-[#2d3c13] rounded-[16px] overflow-hidden flex flex-col mt-[24px]">
      
      {/* Header & Tabs */}
      <div className="p-[24px] border-b border-[#2d3c13] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[16px]">
        <div>
          <h3 className="font-heading font-medium text-[18px] text-[#e8edd4]">
            Winners & Draws
          </h3>
          <p className="font-sans font-normal text-[14px] text-[#b3b8aa]">
            Manage upcoming draws and view past winners.
          </p>
        </div>
        
        <div className="flex items-center gap-[8px] bg-[#0d0d0b] p-[4px] rounded-[10px] border border-[#2d3c13]">
          <button
            onClick={() => setActiveTab("Awaiting Draw")}
            className={cn(
              "px-[16px] py-[6px] rounded-[6px] font-sans font-medium text-[13px] transition-colors",
              activeTab === "Awaiting Draw"
                ? "bg-[#2d3c13] text-[#e8edd4]"
                : "text-[#5a752a] hover:text-[#b3b8aa]"
            )}
          >
            Awaiting Draw
          </button>
          <button
            onClick={() => setActiveTab("Drawn")}
            className={cn(
              "px-[16px] py-[6px] rounded-[6px] font-sans font-medium text-[13px] transition-colors",
              activeTab === "Drawn"
                ? "bg-[#2d3c13] text-[#e8edd4]"
                : "text-[#5a752a] hover:text-[#b3b8aa]"
            )}
          >
            Drawn
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto min-h-[400px]">
        <table className="w-full min-w-[800px] text-left border-collapse">
          <thead>
            <tr className="border-b border-[#2d3c13] bg-[#0d0d0b]/50">
              <th className="py-[16px] px-[24px] font-sans font-medium text-[12px] text-[#5a752a] uppercase tracking-wider">
                Competition
              </th>
              <th className="py-[16px] px-[24px] font-sans font-medium text-[12px] text-[#5a752a] uppercase tracking-wider">
                Draw Date
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
                  No records found in this category.
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
                      <span className="font-sans text-[12px] text-[#5a752a]">
                        {draw.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-[20px] px-[24px]">
                    <span className="font-sans font-medium text-[14px] text-[#b3b8aa]">
                      {new Date(draw.endDate).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="py-[20px] px-[24px]">
                    <span className="font-sans font-medium text-[14px] text-[#b3b8aa]">
                      {draw.ticketsSold} / {draw.totalTickets}
                    </span>
                  </td>
                  <td className="py-[20px] px-[24px] text-right">
                    {activeTab === "Awaiting Draw" ? (
                      <button 
                        onClick={() => setSelectedDrawToRun(draw)}
                        disabled={draw.status !== 'ACTIVE' || drawWinnerMutation.isPending}
                        className="h-[36px] px-[16px] bg-[#8cb34a] hover:bg-[#72943a] transition-colors rounded-[6px] inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="font-heading font-medium text-[13px] text-[#0d0d0b]">
                          {drawWinnerMutation.isPending && selectedDrawToRun?.id === draw.id ? 'Running...' : 'Run Draw Now'}
                        </span>
                      </button>
                    ) : (
                      <button 
                        onClick={() => setSelectedDrawToView(draw)}
                        className="h-[36px] px-[16px] bg-[#2d3c13] hover:bg-[#3a4d19] transition-colors rounded-[6px] inline-flex items-center justify-center"
                      >
                        <span className="font-heading font-medium text-[13px] text-[#e8edd4]">
                          View Details & Winners
                        </span>
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedDrawToRun && (
        <DrawConfirmationModal 
          draw={{ name: selectedDrawToRun.title } as any}
          isOpen={true}
          onClose={() => setSelectedDrawToRun(null)}
          onConfirm={handleConfirmDraw}
        />
      )}

      {selectedDrawToView && (
        <WinnerDetailsModal
          isOpen={true}
          onClose={() => setSelectedDrawToView(null)}
          raffle={selectedDrawToView}
        />
      )}
    </div>
  );
}
