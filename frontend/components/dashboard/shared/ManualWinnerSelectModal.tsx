"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { raffleService } from "../../../services/raffle.service";

export interface SoldTicket {
  id: string;
  ticketNumber: number;
  userId: string;
  userName: string;
  userEmail: string;
  avatarUrl?: string;
  createdAt: string;
}

interface ManualWinnerSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  raffle: {
    id: string;
    title: string;
    totalTickets: number;
    ticketsSold?: number;
    isAutoDraw?: boolean;
    slug?: string;
  };
  onSuccess?: () => void;
  isAdmin?: boolean;
}

export default function ManualWinnerSelectModal({
  isOpen,
  onClose,
  raffle,
  onSuccess,
  isAdmin = true,
}: ManualWinnerSelectModalProps) {
  const [activeTab, setActiveTab] = useState<"manual" | "random">("manual");
  const [ticketInput, setTicketInput] = useState<string>("");
  const [selectedTicket, setSelectedTicket] = useState<SoldTicket | null>(null);

  const [soldTickets, setSoldTickets] = useState<SoldTicket[]>([]);
  const [isLoadingTickets, setIsLoadingTickets] = useState(false);
  const [ticketSearch, setTicketSearch] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [winnerResult, setWinnerResult] = useState<any | null>(null);

  useEffect(() => {
    if (isOpen && raffle.id) {
      fetchSoldTickets();
    }
  }, [isOpen, raffle.id]);

  const fetchSoldTickets = async () => {
    setIsLoadingTickets(true);
    try {
      const data = await raffleService.getSoldTickets(raffle.id);
      setSoldTickets(data || []);
    } catch (e) {
      console.error("Failed to load sold tickets:", e);
    } finally {
      setIsLoadingTickets(false);
    }
  };

  if (!isOpen) return null;

  const filteredTickets = soldTickets.filter((t) => {
    const query = ticketSearch.toLowerCase().trim();
    if (!query) return true;
    return (
      t.ticketNumber.toString().includes(query) ||
      t.userName.toLowerCase().includes(query) ||
      t.userEmail.toLowerCase().includes(query)
    );
  });

  const handleSelectTicketFromList = (t: SoldTicket) => {
    setSelectedTicket(t);
    setTicketInput(t.ticketNumber.toString());
    setErrorMessage(null);
  };

  const handleDrawWinner = async (winningTicketNum?: number) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setWinnerResult(null);

    try {
      const data = await raffleService.adminDrawWinner(raffle.id, winningTicketNum);
      setWinnerResult(data);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || err.message || "An error occurred while drawing winner.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(ticketInput.trim(), 10);
    if (isNaN(num) || num <= 0) {
      setErrorMessage("Please enter or select a valid ticket number.");
      return;
    }
    handleDrawWinner(num);
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Dark Overlay Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-[620px] bg-[#111210] border border-[#2D3C13] rounded-[20px] p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col gap-6 z-10 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header Row */}
        <div className="flex items-start justify-between border-b border-[#2D3C13] pb-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏆</span>
              <h3 className="font-heading font-bold text-[20px] text-[#E8EDD4]">
                Winner Selection
              </h3>
            </div>
            <p className="font-sans text-[12px] text-[#72943A]">
              {raffle.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-button text-[#72943A] hover:text-[#E8EDD4] hover:bg-[#1A230A] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Competition Info Badges */}
        <div className="grid grid-cols-2 gap-3 bg-[#161810] border border-[#2D3C13] p-3.5 rounded-[12px] text-xs">
          <div className="flex flex-col">
            <span className="text-[#5A752A] text-[10px] uppercase font-sans">Draw Mode</span>
            <span className="font-semibold text-[#8CB34A] mt-0.5">
              {raffle.isAutoDraw ? "Automatic Draw" : "Manual Winner Selection"}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[#5A752A] text-[10px] uppercase font-sans">Total Sold Tickets</span>
            <span className="font-semibold text-[#E8EDD4] mt-0.5">
              {soldTickets.length || raffle.ticketsSold || 0} / {raffle.totalTickets}
            </span>
          </div>
        </div>

        {/* Error Message Alert */}
        {errorMessage && (
          <div className="p-3.5 bg-red-950/80 border border-red-800 rounded-[10px] text-xs font-sans text-red-300 flex items-start gap-2">
            <span className="shrink-0 mt-0.5">⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Winner Result Success Screen */}
        {winnerResult ? (
          <div className="flex flex-col gap-4 bg-[#1A230A] border border-[#8CB34A]/40 rounded-[16px] p-6 text-center animate-in zoom-in-95 duration-300">
            <div className="w-14 h-14 rounded-full bg-[#8CB34A] text-[#0D0D0B] flex items-center justify-center text-3xl mx-auto font-bold shadow-[0_0_25px_rgba(140,179,74,0.4)]">
              🎉
            </div>
            <div className="flex flex-col">
              <h4 className="font-heading font-bold text-[20px] text-[#E8EDD4]">
                Main Winner Declared!
              </h4>
              <p className="font-sans text-[13px] text-[#8CB34A] mt-1 font-semibold">
                Winning Ticket #{winnerResult.ticket?.ticketNumber || ticketInput}
              </p>
            </div>

            <div className="bg-[#111210] border border-[#2D3C13] p-4 rounded-[12px] text-left flex flex-col gap-2 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-[#2D3C13]">
                <span className="text-[#72943A]">Winner Name:</span>
                <span className="font-bold text-[#E8EDD4] text-sm">
                  {winnerResult.user?.firstName
                    ? `${winnerResult.user.firstName} ${winnerResult.user.lastName || ''}`.trim()
                    : "Winner"}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-[#2D3C13]">
                <span className="text-[#72943A]">Winner Email:</span>
                <span className="font-mono text-[#A0D056]">
                  {winnerResult.user?.email || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#72943A]">Prize Title:</span>
                <span className="font-semibold text-[#E8EDD4]">
                  {winnerResult.prizeName || raffle.title}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full h-11 bg-[#8CB34A] hover:bg-[#A0D056] text-[#0D0D0B] font-heading font-semibold text-sm rounded-[10px] transition-colors mt-2"
            >
              Done & Close
            </button>
          </div>
        ) : (
          <>
            {/* Draw Mode Tabs */}
            <div className="flex items-center gap-2 p-1 bg-[#161810] border border-[#2D3C13] rounded-[10px]">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("manual");
                  setErrorMessage(null);
                }}
                className={`flex-1 py-2 text-xs font-semibold rounded-[8px] transition-colors ${
                  activeTab === "manual"
                    ? "bg-[#1A230A] border border-[#8CB34A] text-[#8CB34A]"
                    : "text-[#72943A] hover:text-[#E8EDD4]"
                }`}
              >
                🔍 Search Buyer & Ticket Number
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("random");
                  setErrorMessage(null);
                }}
                className={`flex-1 py-2 text-xs font-semibold rounded-[8px] transition-colors ${
                  activeTab === "random"
                    ? "bg-[#1A230A] border border-[#8CB34A] text-[#8CB34A]"
                    : "text-[#72943A] hover:text-[#E8EDD4]"
                }`}
              >
                🎲 Certified Random Draw
              </button>
            </div>

            {/* Tab 1: Manual Search & Input */}
            {activeTab === "manual" && (
              <form onSubmit={handleManualSubmit} className="flex flex-col gap-4">
                {/* Search Box */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-sans text-xs font-medium text-[#E8EDD4]">
                    Search Sold Tickets (by Ticket #, Name, or Email)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Type ticket number, buyer name, or email to search..."
                      value={ticketSearch}
                      onChange={(e) => setTicketSearch(e.target.value)}
                      className="w-full h-11 pl-10 pr-4 bg-[#0D0D0B] border border-[#2D3C13] rounded-[10px] font-sans text-xs text-[#E8EDD4] placeholder:text-[#5A752A] focus:border-[#8CB34A] outline-none transition-colors"
                    />
                    <svg className="w-4 h-4 text-[#5A752A] absolute left-3.5 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                  </div>
                </div>

                {/* Sold Tickets Search Results Dropdown List */}
                <div className="flex flex-col gap-1 bg-[#0D0D0B] border border-[#2D3C13] rounded-[12px] p-2 max-h-[190px] overflow-y-auto custom-scrollbar">
                  {isLoadingTickets ? (
                    <div className="py-6 text-center text-xs text-[#72943A]">Loading sold tickets list...</div>
                  ) : filteredTickets.length === 0 ? (
                    <div className="py-6 text-center text-xs text-[#5A752A]">
                      {soldTickets.length === 0 ? "No tickets sold yet in this competition." : "No matching tickets found for your search."}
                    </div>
                  ) : (
                    filteredTickets.map((t) => {
                      const isSelected = ticketInput === t.ticketNumber.toString();
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => handleSelectTicketFromList(t)}
                          className={`flex items-center justify-between p-2.5 rounded-[8px] text-left transition-all ${
                            isSelected
                              ? "bg-[#1A230A] border border-[#8CB34A] text-[#8CB34A]"
                              : "bg-[#161810] border border-transparent hover:border-[#2D3C13] text-[#E8EDD4]"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-heading font-bold text-xs bg-[#1A230A] border border-[#8CB34A]/40 text-[#8CB34A] px-2 py-1 rounded-[6px]">
                              Ticket #{t.ticketNumber}
                            </span>
                            <div className="flex flex-col">
                              <span className="font-sans font-medium text-xs text-[#E8EDD4]">{t.userName}</span>
                              <span className="font-sans text-[11px] text-[#72943A]">{t.userEmail}</span>
                            </div>
                          </div>

                          <span className={`text-[11px] font-semibold ${isSelected ? "text-[#8CB34A]" : "text-[#5A752A]"}`}>
                            {isSelected ? "Selected ✓" : "Select"}
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>

                {/* Direct Number Input */}
                <div className="flex flex-col gap-1.5 pt-2 border-t border-[#2D3C13]">
                  <label className="font-sans text-xs font-medium text-[#E8EDD4]">
                    Selected Winning Ticket Number
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={raffle.totalTickets}
                    placeholder="e.g. 42"
                    value={ticketInput}
                    onChange={(e) => {
                      setTicketInput(e.target.value);
                      setSelectedTicket(null);
                    }}
                    className="h-11 px-4 bg-[#0D0D0B] border border-[#2D3C13] rounded-[10px] font-mono text-sm text-[#E8EDD4] placeholder:text-[#5A752A] focus:border-[#8CB34A] outline-none transition-colors"
                    required
                  />
                  {selectedTicket && (
                    <span className="font-sans text-[11px] text-[#8CB34A] flex items-center gap-1 mt-0.5">
                      ✓ Selected ticket #{selectedTicket.ticketNumber} belongs to <strong>{selectedTicket.userName}</strong> ({selectedTicket.userEmail})
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !ticketInput}
                  className="w-full h-12 bg-[#8CB34A] hover:bg-[#A0D056] disabled:opacity-50 disabled:cursor-not-allowed text-[#0D0D0B] font-heading font-semibold text-sm rounded-[10px] transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(140,179,74,0.15)] mt-1"
                >
                  {isSubmitting ? (
                    <span className="animate-pulse font-bold">Validating & Setting Winner...</span>
                  ) : (
                    <span>Confirm & Declare Winner</span>
                  )}
                </button>
              </form>
            )}

            {/* Tab 2: Random Draw */}
            {activeTab === "random" && (
              <div className="flex flex-col gap-4 py-2">
                <p className="font-sans text-xs text-[#72943A] leading-relaxed bg-[#161810] border border-[#2D3C13] p-4 rounded-[12px]">
                  Clicking below will use the certified randomizer to instantly pick a winning ticket from all <strong>{soldTickets.length || raffle.ticketsSold || 0}</strong> sold tickets in this competition.
                </p>

                <button
                  type="button"
                  onClick={() => handleDrawWinner()}
                  disabled={isSubmitting}
                  className="w-full h-12 bg-[#8CB34A] hover:bg-[#A0D056] disabled:opacity-50 disabled:cursor-not-allowed text-[#0D0D0B] font-heading font-semibold text-sm rounded-[10px] transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(140,179,74,0.15)]"
                >
                  {isSubmitting ? (
                    <span className="animate-pulse font-bold">Running Certified Random Draw...</span>
                  ) : (
                    <span>🎲 Draw Random Winner Now</span>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  if (typeof window === "undefined") return null;
  return createPortal(modalContent, document.body);
}
