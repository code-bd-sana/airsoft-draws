"use client";

import React, { useState } from "react";
import { cn } from "../../../../lib/utils";
import { useRaffleWinners } from "../../../../hooks/useRaffleHooks";
import { toast } from "sonner";
import { raffleService } from "../../../../services/raffle.service";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  raffle: any;
}

export default function WinnerDetailsModal({ isOpen, onClose, raffle }: Props) {
  const [activeTab, setActiveTab] = useState<"Main Draw" | "Instant Wins">("Main Draw");
  const [updatingWinnerId, setUpdatingWinnerId] = useState<string | null>(null);
  
  const { data: winnersData, isLoading, refetch } = useRaffleWinners(raffle?.id);

  if (!isOpen || !raffle) return null;

  const mainDrawWinner = (winnersData as any)?.mainDraw?.[0];
  const instantWins = (winnersData as any)?.instantWins || [];

  const handleUpdateDelivery = async (winnerId: string, newStatus: string) => {
    setUpdatingWinnerId(winnerId);
    try {
      await raffleService.updateDeliveryStatus(winnerId, newStatus);
      toast.success(`Delivery status updated to ${newStatus}`);
      refetch();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || e.message || "Failed to update delivery status");
    } finally {
      setUpdatingWinnerId(null);
    }
  };

  const renderDeliveryBadge = (winnerObj: any, fallbackId?: string) => {
    const status = winnerObj?.deliveryStatus || winnerObj?.status || "PENDING";
    const winnerRecordId = winnerObj?.winnerRecordId || winnerObj?.id || fallbackId;

    if (!winnerRecordId) return null;

    return (
      <div className="flex items-center gap-2">
        <select
          value={status.toUpperCase()}
          disabled={updatingWinnerId === winnerRecordId}
          onChange={(e) => handleUpdateDelivery(winnerRecordId, e.target.value)}
          className={cn(
            "px-2.5 py-1 rounded-[6px] font-sans font-semibold text-xs border outline-none cursor-pointer transition-colors bg-[#0D0D0B]",
            status.toUpperCase() === "DELIVERED"
              ? "border-[#4ADE80] text-[#4ADE80]"
              : status.toUpperCase() === "SHIPPED"
              ? "border-[#3B82F6] text-[#60A5FA]"
              : "border-[#EAB308] text-[#EAB308]"
          )}
        >
          <option value="PENDING" className="bg-[#111210] text-[#EAB308]">Pending Dispatch</option>
          <option value="SHIPPED" className="bg-[#111210] text-[#60A5FA]">Shipped</option>
          <option value="DELIVERED" className="bg-[#111210] text-[#4ADE80]">Delivered ✓</option>
        </select>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      {/* Modal Container */}
      <div className="bg-[#0D0D0B] border border-[#2D3C13] rounded-[16px] w-full max-w-[820px] shadow-2xl flex flex-col relative max-h-[85vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#2D3C13]">
          <div className="flex flex-col gap-1">
            <h2 className="font-heading font-medium text-[20px] text-[#E8EDD4]">
              Competition Winners: {raffle.title}
            </h2>
            <span className="font-sans text-[13px] text-[#72943A]">
              View main draw winner and instant win prize claims. Update dispatch & delivery status.
            </span>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#1A230A] border border-[#2D3C13] flex items-center justify-center text-[#72943A] hover:text-[#E8EDD4] transition-colors shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col p-6 overflow-y-auto custom-scrollbar flex-1">
          {/* Tabs */}
          <div className="flex items-center gap-[8px] bg-[#161810] p-[4px] rounded-[10px] border border-[#2d3c13] w-fit mb-6">
            <button
              onClick={() => setActiveTab("Main Draw")}
              className={cn(
                "px-[16px] py-[6px] rounded-[6px] font-sans font-medium text-[13px] transition-colors",
                activeTab === "Main Draw"
                  ? "bg-[#2d3c13] text-[#e8edd4]"
                  : "text-[#5a752a] hover:text-[#b3b8aa]"
              )}
            >
              Main Draw Winner
            </button>
            <button
              onClick={() => setActiveTab("Instant Wins")}
              className={cn(
                "px-[16px] py-[6px] rounded-[6px] font-sans font-medium text-[13px] transition-colors",
                activeTab === "Instant Wins"
                  ? "bg-[#2d3c13] text-[#e8edd4]"
                  : "text-[#5a752a] hover:text-[#b3b8aa]"
              )}
            >
              Instant Wins ({instantWins.length})
            </button>
          </div>

          {isLoading ? (
            <div className="text-[#72943A] p-8 text-center text-sm font-sans">Loading winners list...</div>
          ) : (
            <div className="flex-1">
              {activeTab === "Main Draw" && (
                <div className="flex flex-col gap-4">
                  {mainDrawWinner ? (
                    <div className="bg-[#1A230A] border border-[#2D3C13] rounded-[12px] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#8cb34a]/20 border border-[#8cb34a]/40 flex items-center justify-center text-[24px] shrink-0">
                          🏆
                        </div>
                        <div className="flex flex-col">
                          <span className="font-heading font-semibold text-[18px] text-[#E8EDD4]">
                            {mainDrawWinner.user?.firstName
                              ? `${mainDrawWinner.user.firstName} ${mainDrawWinner.user.lastName || ''}`.trim()
                              : "Winner"}
                          </span>
                          <span className="font-sans text-[13px] text-[#8CB34A] font-semibold mt-0.5">
                            Winning Ticket #{mainDrawWinner.ticket?.ticketNumber}
                          </span>
                          <span className="font-sans text-[12px] text-[#72943a] mt-1 font-mono">
                            Email: {mainDrawWinner.user?.email}
                          </span>
                          <span className="font-sans text-[12px] text-[#72943a]">
                            Prize: {mainDrawWinner.prizeName || raffle.title}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-start sm:items-end gap-1.5 shrink-0 border-t sm:border-t-0 border-[#2D3C13] pt-3 sm:pt-0 w-full sm:w-auto">
                        <span className="font-sans text-[10px] text-[#5A752A] uppercase">Delivery Status</span>
                        {renderDeliveryBadge(mainDrawWinner)}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-[#161810] border border-[#2D3C13] rounded-[12px] p-8 text-center text-[#72943A] text-sm">
                      No main draw winner has been selected yet by Admin.
                    </div>
                  )}
                </div>
              )}

              {activeTab === "Instant Wins" && (
                <div className="flex flex-col gap-3">
                  {instantWins.length === 0 ? (
                    <div className="bg-[#161810] border border-[#2D3C13] rounded-[12px] p-8 text-center text-[#72943A] text-sm">
                      No instant win prizes were created for this competition.
                    </div>
                  ) : (
                    instantWins.map((iw: any) => (
                      <div key={iw.id} className="bg-[#161810] border border-[#2D3C13] rounded-[12px] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-[#1A230A] border border-[#2D3C13] flex items-center justify-center text-[18px] shrink-0">
                            🎁
                          </div>
                          <div className="flex flex-col">
                            <span className="font-sans font-medium text-[14px] text-[#E8EDD4]">
                              {iw.prizeName}
                            </span>
                            <span className="font-sans text-[12px] font-semibold text-[#8CB34A]">
                              Ticket #{iw.ticketNumber}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between w-full sm:w-auto gap-4 border-t sm:border-t-0 border-[#2D3C13] pt-2 sm:pt-0">
                          {iw.winner ? (
                            <div className="flex flex-col items-start sm:items-end">
                              <span className="font-sans font-semibold text-[13px] text-[#E8EDD4]">
                                {iw.winner.firstName} {iw.winner.lastName}
                              </span>
                              <span className="font-sans text-[11px] text-[#72943A] font-mono">
                                {iw.winner.email}
                              </span>
                            </div>
                          ) : (
                            <span className="font-sans text-[11px] text-[#5A752A] uppercase tracking-wide">
                              Unclaimed
                            </span>
                          )}

                          {iw.winner && renderDeliveryBadge(iw.winner, iw.id)}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-[#2D3C13] flex justify-end">
          <button 
            onClick={onClose}
            className="px-[20px] py-[10px] bg-[#2d3c13] hover:bg-[#3a4d19] transition-colors rounded-[8px] font-heading font-medium text-[14px] text-[#e8edd4]"
          >
            Close Details
          </button>
        </div>

      </div>
    </div>
  );
}
