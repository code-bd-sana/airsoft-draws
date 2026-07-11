"use client";

import React, { useState } from "react";
import { cn } from "../../../../lib/utils";
import { useRaffleWinners } from "../../../../hooks/useRaffleHooks";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  raffle: any; // Using any for simplicity in this file for now
}

export default function WinnerDetailsModal({ isOpen, onClose, raffle }: Props) {
  const [activeTab, setActiveTab] = useState<"Main Draw" | "Instant Wins">("Main Draw");
  
  const { data: winnersData, isLoading } = useRaffleWinners(raffle?.id);

  if (!isOpen || !raffle) return null;

  const mainDrawWinner = winnersData?.mainDraw?.[0];
  const instantWins = winnersData?.instantWins || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      {/* Modal Container */}
      <div className="bg-[#0D0D0B] border border-[#2D3C13] rounded-[16px] w-full max-w-[800px] shadow-2xl flex flex-col relative animate-slideUp">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#2D3C13]">
          <div className="flex flex-col gap-1">
            <h2 className="font-heading font-medium text-[20px] text-[#E8EDD4]">
              Winners: {raffle.title}
            </h2>
            <span className="font-sans text-[13px] text-[#5A752A]">
              Review the outcomes for this competition.
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

        <div className="flex flex-col p-6 h-[400px]">
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
            <div className="text-[#5A752A] p-4 text-sm">Loading winners...</div>
          ) : (
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {activeTab === "Main Draw" && (
                <div className="flex flex-col gap-4">
                  {mainDrawWinner ? (
                    <div className="bg-[#1A230A] border border-[#2D3C13] rounded-[12px] p-6 flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#8cb34a]/20 flex items-center justify-center text-[24px]">
                        🏆
                      </div>
                      <div className="flex flex-col">
                        <span className="font-heading font-medium text-[18px] text-[#E8EDD4]">
                          {mainDrawWinner.user.firstName} {mainDrawWinner.user.lastName}
                        </span>
                        <span className="font-sans text-[13px] text-[#8CB34A]">
                          Winning Ticket: #{mainDrawWinner.ticket.ticketNumber}
                        </span>
                        <span className="font-sans text-[13px] text-[#5a752a] mt-1">
                          Email: {mainDrawWinner.user.email}
                        </span>
                        <span className="font-sans text-[13px] text-[#5a752a]">
                          Prize: {mainDrawWinner.prizeName}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-[#161810] border border-[#2D3C13] rounded-[12px] p-6 text-center text-[#5A752A] text-sm">
                      No main winner has been drawn yet, or the draw ended with no tickets sold.
                    </div>
                  )}
                </div>
              )}

              {activeTab === "Instant Wins" && (
                <div className="flex flex-col gap-3">
                  {instantWins.length === 0 ? (
                    <div className="bg-[#161810] border border-[#2D3C13] rounded-[12px] p-6 text-center text-[#5A752A] text-sm">
                      No instant win prizes were created for this competition.
                    </div>
                  ) : (
                    instantWins.map((iw: any) => (
                      <div key={iw.id} className="bg-[#161810] border border-[#2D3C13] rounded-[12px] p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded bg-[#1A230A] border border-[#2D3C13] flex items-center justify-center text-[16px]">
                            🎁
                          </div>
                          <div className="flex flex-col">
                            <span className="font-sans font-medium text-[14px] text-[#E8EDD4]">
                              {iw.prizeName}
                            </span>
                            <span className="font-sans text-[12px] text-[#72943A]">
                              Ticket #{iw.ticketNumber}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          {iw.winner ? (
                            <div className="flex flex-col items-end">
                              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-[#8cb34a]/10 border border-[#8cb34a]/20">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#8cb34a]" />
                                <span className="font-sans text-[11px] font-medium text-[#8cb34a] uppercase tracking-wide">
                                  Claimed
                                </span>
                              </span>
                              <span className="font-sans text-[12px] text-[#E8EDD4] mt-1">
                                {iw.winner.firstName} {iw.winner.lastName}
                              </span>
                              <span className="font-sans text-[11px] text-[#5A752A]">
                                {iw.winner.email}
                              </span>
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-[#1A230A] border border-[#2D3C13]">
                              <span className="font-sans text-[11px] font-medium text-[#72943A] uppercase tracking-wide">
                                Available
                              </span>
                            </span>
                          )}
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
