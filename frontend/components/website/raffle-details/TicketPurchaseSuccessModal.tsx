"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { cn } from "../../../lib/utils";

export interface InstantWinItem {
  id: string;
  ticketId: string;
  prizeName: string;
  ticketNumber?: number;
}

export interface TicketItem {
  id: string;
  ticketNumber: number;
}

export interface TicketPurchaseSuccessData {
  raffleTitle: string;
  tickets: TicketItem[];
  instantWins: InstantWinItem[];
  totalAmount?: number;
}

interface TicketPurchaseSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: TicketPurchaseSuccessData | null;
}

export default function TicketPurchaseSuccessModal({
  isOpen,
  onClose,
  data,
}: TicketPurchaseSuccessModalProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !data || !mounted) return null;

  const { raffleTitle, tickets, instantWins } = data;
  const instantWinTicketIds = new Set(instantWins.map((iw) => iw.ticketId));
  const instantWinTicketNumbers = new Set(
    instantWins.map((iw) => iw.ticketNumber).filter((num): num is number => num !== undefined)
  );

  const handleGoToDashboard = () => {
    onClose();
    router.push("/dashboard/user/tickets");
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative bg-[#111210] border border-[#8CB34A]/50 rounded-[24px] w-full max-w-[560px] overflow-hidden shadow-[0_0_50px_rgba(140,179,74,0.25)] animate-in zoom-in-95 duration-300 flex flex-col z-[10000]">
        
        {/* Glow Header Accent */}
        <div className="h-2 w-full bg-gradient-to-r from-[#8CB34A] via-[#A0D056] to-[#5A752A]" />

        {/* Modal Header */}
        <div className="p-6 sm:p-7 border-b border-[#2D3C13] bg-[#0D0D0B] flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#1A230A] border border-[#8CB34A] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(140,179,74,0.3)]">
              <svg className="w-6 h-6 text-[#8CB34A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <div>
              <h2 className="font-heading font-bold text-xl sm:text-2xl text-[#E8EDD4] leading-tight">
                Tickets Allocated!
              </h2>
              <p className="font-sans text-xs text-[#72943A] mt-0.5">
                {tickets.length} ticket(s) issued for <span className="text-[#E8EDD4] font-semibold">{raffleTitle}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#72943A] hover:text-[#E8EDD4] p-1.5 rounded-lg hover:bg-[#1A230A] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body Scroll Area */}
        <div className="p-6 sm:p-7 space-y-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
          
          {/* Instant Win Banner if user won any instant prize */}
          {instantWins.length > 0 && (
            <div className="bg-gradient-to-r from-[#1a230a] via-[#23310d] to-[#1a230a] border border-[#EAB308]/60 rounded-2xl p-4 sm:p-5 shadow-[0_0_25px_rgba(234,179,8,0.2)] animate-in slide-in-from-top duration-500">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🎉</span>
                <div>
                  <h3 className="font-heading font-bold text-base text-[#EAB308]">
                    INSTANT WIN PRIZE CLAIMED!
                  </h3>
                  <p className="font-sans text-xs text-[#E8EDD4] mt-0.5">
                    Congratulations! You instantly won {instantWins.length} prize(s) with your purchase!
                  </p>
                </div>
              </div>

              <div className="space-y-2 mt-3">
                {instantWins.map((iw, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-[#0D0D0B]/80 border border-[#EAB308]/40 p-3 rounded-xl"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-heading font-bold text-xs text-[#EAB308] bg-[#EAB308]/15 border border-[#EAB308]/30 px-2 py-0.5 rounded-md">
                        Ticket #{iw.ticketNumber || "WIN"}
                      </span>
                      <span className="font-sans font-semibold text-xs text-[#E8EDD4]">
                        {iw.prizeName}
                      </span>
                    </div>
                    <span className="text-[10px] font-sans font-bold text-[#4ADE80] bg-[#4ADE80]/10 border border-[#4ADE80]/30 px-2 py-0.5 rounded-full">
                      Instant Win Claimed
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-3.5 pt-3 border-t border-[#EAB308]/20 flex items-center gap-2 text-[11px] text-[#A0D056]">
                <span>ℹ️</span>
                <span>Note: Your ticket(s) also remain 100% entered for the Main Competition Draw when the timer closes!</span>
              </div>
            </div>
          )}

          {/* Ticket Numbers Grid Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-[#8CB34A]">
                Your Instant Ticket Numbers ({tickets.length})
              </h3>
              <span className="font-sans text-[11px] text-[#72943A]">
                Live in competition database
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-[180px] overflow-y-auto p-1 custom-scrollbar">
              {tickets.map((t) => {
                const isWinningTicket =
                  instantWinTicketIds.has(t.id) ||
                  (t.ticketNumber && instantWinTicketNumbers.has(t.ticketNumber));

                return (
                  <div
                    key={t.id}
                    className={cn(
                      "py-2.5 px-3 rounded-xl font-heading font-bold text-sm text-center border transition-all flex items-center justify-center gap-1",
                      isWinningTicket
                        ? "bg-[#EAB308]/15 border-[#EAB308] text-[#EAB308] shadow-[0_0_15px_rgba(234,179,8,0.3)] animate-bounce"
                        : "bg-[#1A230A] border-[#2D3C13] text-[#8CB34A] hover:border-[#43581E]"
                    )}
                  >
                    {isWinningTicket && <span>🏆</span>}
                    <span>#{t.ticketNumber}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dashboard Notice Box */}
          <div className="bg-[#0D0D0B] border border-[#2D3C13] rounded-xl p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#1A230A] border border-[#43581E] flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-[#8CB34A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
              </svg>
            </div>
            <p className="font-sans text-xs text-[#B3B8AA] leading-normal">
              Want to see all your active and past tickets anytime? Access your personal ticket ledger in your <strong className="text-[#E8EDD4]">Dashboard &gt; My Tickets</strong> page.
            </p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 sm:p-7 border-t border-[#2D3C13] bg-[#0D0D0B] flex flex-col sm:flex-row gap-3 items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-3 rounded-xl border border-[#2D3C13] hover:bg-[#1A230A] text-[#72943A] hover:text-[#E8EDD4] font-sans font-semibold text-xs transition-colors"
          >
            Keep Browsing Competitions
          </button>

          <button
            type="button"
            onClick={handleGoToDashboard}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#8CB34A] hover:bg-[#A0D056] text-[#0D0D0B] font-sans font-bold text-xs shadow-[0_0_20px_rgba(140,179,74,0.3)] transition-all flex items-center justify-center gap-2"
          >
            View Tickets in Dashboard
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
