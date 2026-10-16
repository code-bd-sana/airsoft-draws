"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  useAdminAssignmentCompetitions,
  useAdminCompetitionTicketDetails,
  useAdminSearchUsers,
  useAdminAssignTicketsMutation,
  useAdminAssignmentHistory,
} from "@/hooks/useAdminHooks";
import {
  AssignmentCompetition,
  UserSearchResult,
} from "@/services/admin.service";

export default function AdminTicketAssignmentPage() {
  const [activeTab, setActiveTab] = useState<"assign" | "history">("assign");

  // Selection states
  const [selectedRaffleId, setSelectedRaffleId] = useState<string>("");
  const [competitionSearch, setCompetitionSearch] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<UserSearchResult | null>(null);
  const [userSearchQuery, setUserSearchQuery] = useState<string>("");
  const [showUserDropdown, setShowUserDropdown] = useState<boolean>(false);

  // Ticket selection mode
  const [selectionMode, setSelectionMode] = useState<"specific" | "random">("specific");
  const [selectedTicketNumbers, setSelectedTicketNumbers] = useState<number[]>([]);
  const [randomQuantity, setRandomQuantity] = useState<number>(1);
  const [manualNumberInput, setManualNumberInput] = useState<string>("");
  const [ticketFilter, setTicketFilter] = useState<"all" | "available" | "instant_wins" | "sold">("all");
  const [ticketSearchNumber, setTicketSearchNumber] = useState<string>("");
  const [adminNotes, setAdminNotes] = useState<string>("");

  // Confirmation modal
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [assignmentSuccessResult, setAssignmentSuccessResult] = useState<any | null>(null);

  // History page
  const [historyPage, setHistoryPage] = useState<number>(1);

  // Queries
  const { data: competitions = [], isLoading: isLoadingComps } = useAdminAssignmentCompetitions({
    search: competitionSearch,
  });

  const { data: ticketDetails, isLoading: isLoadingDetails } = useAdminCompetitionTicketDetails(selectedRaffleId);

  const { data: searchedUsers = [], isLoading: isSearchingUsers } = useAdminSearchUsers(userSearchQuery);

  const { data: historyData, isLoading: isLoadingHistory, refetch: refetchHistory } = useAdminAssignmentHistory({
    page: historyPage,
    limit: 15,
  });

  const assignMutation = useAdminAssignTicketsMutation();

  // Selected competition data
  const selectedCompetition = useMemo(() => {
    return competitions.find((c) => c.id === selectedRaffleId) || null;
  }, [competitions, selectedRaffleId]);

  // Set of sold ticket numbers for quick lookup
  const soldTicketsMap = useMemo(() => {
    if (!ticketDetails?.soldTickets) return new Map<number, any>();
    const map = new Map<number, any>();
    for (const t of ticketDetails.soldTickets) {
      map.set(t.ticketNumber, t);
    }
    return map;
  }, [ticketDetails]);

  // Instant wins map: ticketNumber -> instantWin details
  const instantWinsMap = useMemo(() => {
    if (!ticketDetails?.instantWins) return new Map<number, any>();
    const map = new Map<number, any>();
    for (const iw of ticketDetails.instantWins) {
      map.set(iw.ticketNumber, iw);
    }
    return map;
  }, [ticketDetails]);

  // Handle toggling ticket number
  const handleToggleTicketNumber = (num: number) => {
    if (soldTicketsMap.has(num)) {
      toast.error(`Ticket #${num} is already sold to ${soldTicketsMap.get(num)?.userName || "another user"}`);
      return;
    }

    setSelectedTicketNumbers((prev) => {
      if (prev.includes(num)) {
        return prev.filter((n) => n !== num);
      } else {
        return [...prev, num].sort((a, b) => a - b);
      }
    });
  };

  // Add numbers from manual input (e.g. "5, 12, 19")
  const handleAddManualNumbers = () => {
    if (!manualNumberInput.trim() || !ticketDetails) return;

    const parts = manualNumberInput.split(/[,\s]+/).map((s) => parseInt(s.trim(), 10)).filter((n) => !isNaN(n));
    const validToAdd: number[] = [];
    const alreadySold: number[] = [];
    const outOfBounds: number[] = [];

    for (const num of parts) {
      if (num < 1 || num > ticketDetails.stats.totalTickets) {
        outOfBounds.push(num);
      } else if (soldTicketsMap.has(num)) {
        alreadySold.push(num);
      } else {
        validToAdd.push(num);
      }
    }

    if (outOfBounds.length > 0) {
      toast.error(`Numbers out of range (1-${ticketDetails.stats.totalTickets}): ${outOfBounds.join(", ")}`);
    }
    if (alreadySold.length > 0) {
      toast.error(`Numbers already taken: ${alreadySold.join(", ")}`);
    }

    if (validToAdd.length > 0) {
      setSelectedTicketNumbers((prev) => Array.from(new Set([...prev, ...validToAdd])).sort((a, b) => a - b));
      setManualNumberInput("");
      toast.success(`Added ${validToAdd.length} ticket number(s) to selection`);
    }
  };

  // Quick select an instant win ticket
  const handleSelectInstantWinTicket = (ticketNumber: number) => {
    if (soldTicketsMap.has(ticketNumber)) {
      toast.error(`Instant Win ticket #${ticketNumber} has already been claimed!`);
      return;
    }
    if (!selectedTicketNumbers.includes(ticketNumber)) {
      setSelectedTicketNumbers((prev) => [...prev, ticketNumber].sort((a, b) => a - b));
      toast.success(`Selected Instant Win Ticket #${ticketNumber}`);
    } else {
      toast.info(`Ticket #${ticketNumber} is already selected.`);
    }
  };

  // Calculate pricing
  const totalCount = selectionMode === "specific" ? selectedTicketNumbers.length : randomQuantity;
  const unitPrice = ticketDetails?.stats.ticketPrice || selectedCompetition?.pricePerTicket || 0;
  const totalFinancialValue = totalCount * unitPrice;

  // Selected instant wins
  const selectedInstantWins = useMemo(() => {
    if (selectionMode !== "specific") return [];
    return selectedTicketNumbers.filter((n) => instantWinsMap.has(n)).map((n) => instantWinsMap.get(n));
  }, [selectionMode, selectedTicketNumbers, instantWinsMap]);

  // Execute assignment
  const handleExecuteAssignment = async () => {
    if (!selectedRaffleId) {
      toast.error("Please select a competition");
      return;
    }
    if (!selectedUser) {
      toast.error("Please select a recipient user");
      return;
    }
    if (selectionMode === "specific" && selectedTicketNumbers.length === 0) {
      toast.error("Please select at least one ticket number");
      return;
    }
    if (selectionMode === "random" && randomQuantity < 1) {
      toast.error("Quantity must be at least 1");
      return;
    }

    try {
      const payload = {
        raffleId: selectedRaffleId,
        userId: selectedUser.id,
        ticketNumbers: selectionMode === "specific" ? selectedTicketNumbers : undefined,
        quantity: selectionMode === "random" ? randomQuantity : undefined,
        adminNotes: adminNotes.trim() || undefined,
      };

      const res = await assignMutation.mutateAsync(payload);
      setIsConfirmModalOpen(false);
      setAssignmentSuccessResult(res);

      // Reset selection
      setSelectedTicketNumbers([]);
      setAdminNotes("");
      toast.success(res.message || "Tickets assigned successfully!");
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to assign tickets.";
      toast.error(msg);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-[1660px] mx-auto w-full animate-fadeIn text-[#E8EDD4]">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#1A230A] border border-[#8CB34A]/40 flex items-center justify-center text-[#8CB34A]">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
              </svg>
            </div>
            <div>
              <h1 className="font-heading font-extrabold text-2xl text-[#E8EDD4]">
                Manual Ticket Assignment
              </h1>
              <p className="font-sans text-xs text-[#72943A] mt-0.5">
                Issue competition tickets directly to users without payment gateway. Revenue credits to host wallet automatically.
              </p>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-[#111210] p-1 rounded-xl border border-[#2D3C13]">
          <button
            onClick={() => setActiveTab("assign")}
            className={`px-4 py-2 rounded-lg font-sans font-medium text-xs transition-colors ${
              activeTab === "assign"
                ? "bg-[#8CB34A] text-[#0D0D0B] font-bold"
                : "text-[#72943A] hover:text-[#E8EDD4]"
            }`}
          >
            Assign Tickets
          </button>
          <button
            onClick={() => {
              setActiveTab("history");
              refetchHistory();
            }}
            className={`px-4 py-2 rounded-lg font-sans font-medium text-xs transition-colors ${
              activeTab === "history"
                ? "bg-[#8CB34A] text-[#0D0D0B] font-bold"
                : "text-[#72943A] hover:text-[#E8EDD4]"
            }`}
          >
            Assignment History
          </button>
        </div>
      </div>

      {activeTab === "assign" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Competition Selection & Ticket Visualizer */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Step 1: Competition Selector Card */}
            <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#1A230A] border border-[#2D3C13] flex items-center justify-center text-xs font-bold text-[#8CB34A]">
                    1
                  </span>
                  <h2 className="font-heading font-bold text-base text-[#E8EDD4]">
                    Select Active Competition
                  </h2>
                </div>
                {selectedCompetition && (
                  <span className="text-xs font-mono text-[#8CB34A] bg-[#1A230A] px-2.5 py-1 rounded-full border border-[#2D3C13]">
                    {selectedCompetition.ticketsSold} / {selectedCompetition.totalTickets} Tickets Sold
                  </span>
                )}
              </div>

              {/* Competition Search / Selector dropdown */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search competition by title or prize..."
                    value={competitionSearch}
                    onChange={(e) => setCompetitionSearch(e.target.value)}
                    className="w-full h-10 bg-[#111210] border border-[#2D3C13] rounded-xl px-4 text-xs text-[#E8EDD4] placeholder-[#5A752A] focus:outline-none focus:border-[#8CB34A]"
                  />
                  {competitionSearch && (
                    <button
                      onClick={() => setCompetitionSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#5A752A] hover:text-[#E8EDD4]"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <select
                  value={selectedRaffleId}
                  onChange={(e) => {
                    setSelectedRaffleId(e.target.value);
                    setSelectedTicketNumbers([]);
                  }}
                  className="h-10 bg-[#111210] border border-[#2D3C13] rounded-xl px-4 text-xs text-[#E8EDD4] focus:outline-none focus:border-[#8CB34A] min-w-[240px]"
                >
                  <option value="">-- Choose a Competition ({competitions.length}) --</option>
                  {competitions.map((comp) => (
                    <option key={comp.id} value={comp.id}>
                      {comp.title} (£{comp.pricePerTicket.toFixed(2)}/tkt • {comp.remainingTickets} left)
                    </option>
                  ))}
                </select>
              </div>

              {/* Selected Competition Hero Banner */}
              {selectedCompetition && (
                <div className="mt-2 p-4 rounded-xl bg-[#111210] border border-[#2D3C13] flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-xl bg-[#1A230A] border border-[#2D3C13] overflow-hidden relative shrink-0">
                      {selectedCompetition.mainImage ? (
                        <Image
                          src={selectedCompetition.mainImage}
                          alt={selectedCompetition.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#5A752A]">
                          🎯
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-sm text-[#E8EDD4]">
                        {selectedCompetition.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-[#72943A]">
                        <span>Hosted by: <strong className="text-[#A0D056]">{selectedCompetition.hostName}</strong></span>
                        <span>•</span>
                        <span>Price: <strong className="text-[#E8EDD4]">£{selectedCompetition.pricePerTicket.toFixed(2)}</strong></span>
                        <span>•</span>
                        <span>Category: {selectedCompetition.category || "General"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-[#5A752A] block">Available</span>
                      <span className="font-heading font-extrabold text-lg text-[#8CB34A]">
                        {selectedCompetition.remainingTickets}
                      </span>
                    </div>
                    <Link
                      href={`/live-raffles/${selectedCompetition.slug}`}
                      target="_blank"
                      className="p-2 rounded-lg bg-[#1A230A] border border-[#2D3C13] text-[#72943A] hover:text-[#8CB34A] transition-colors"
                      title="View Public Competition Page"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Step 2: Instant Wins Bar (if competition has instant wins) */}
            {selectedRaffleId && ticketDetails && ticketDetails.instantWins.length > 0 && (
              <div className="bg-[#1A180E] border border-[#EAB308]/40 rounded-[16px] p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">⚡</span>
                    <h3 className="font-heading font-bold text-sm text-[#FDE68A]">
                      Instant Win Numbers in this Draw ({ticketDetails.instantWins.length})
                    </h3>
                  </div>
                  <span className="text-xs text-[#EAB308]">
                    Click any ticket number to select it directly
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-[180px] overflow-y-auto pr-1">
                  {ticketDetails.instantWins.map((iw) => {
                    const isSold = soldTicketsMap.has(iw.ticketNumber);
                    const isSelected = selectedTicketNumbers.includes(iw.ticketNumber);

                    return (
                      <button
                        key={iw.id}
                        type="button"
                        disabled={isSold}
                        onClick={() => handleSelectInstantWinTicket(iw.ticketNumber)}
                        className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 text-left transition-all ${
                          isSold
                            ? "bg-[#111210]/60 border-[#2D3C13] opacity-60 cursor-not-allowed"
                            : isSelected
                            ? "bg-[#EAB308]/20 border-[#EAB308] shadow-[0_0_12px_rgba(234,179,8,0.25)]"
                            : "bg-[#161810] border-[#EAB308]/30 hover:border-[#EAB308]"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-mono text-xs font-black text-[#EAB308] px-2 py-0.5 rounded bg-[#3B2800] border border-[#EAB308]/40">
                            #{iw.ticketNumber}
                          </span>
                          <span className="font-sans text-xs text-[#E8EDD4] truncate block">
                            {iw.prizeName}
                          </span>
                        </div>
                        <span className={`text-[10px] font-bold uppercase shrink-0 ${isSold ? "text-[#5A752A]" : "text-[#4ADE80]"}`}>
                          {isSold ? "Claimed" : isSelected ? "Selected" : "Available"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 3: Ticket Number Selector & Grid */}
            {selectedRaffleId && (
              <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col gap-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#1A230A] border border-[#2D3C13] flex items-center justify-center text-xs font-bold text-[#8CB34A]">
                      2
                    </span>
                    <h2 className="font-heading font-bold text-base text-[#E8EDD4]">
                      Choose Ticket Numbers
                    </h2>
                  </div>

                  {/* Mode switcher: Specific Numbers vs Random Quantity */}
                  <div className="flex items-center gap-1 bg-[#111210] p-1 rounded-xl border border-[#2D3C13]">
                    <button
                      type="button"
                      onClick={() => setSelectionMode("specific")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        selectionMode === "specific"
                          ? "bg-[#8CB34A] text-[#0D0D0B] font-bold"
                          : "text-[#72943A] hover:text-[#E8EDD4]"
                      }`}
                    >
                      Specific Numbers
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectionMode("random")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        selectionMode === "random"
                          ? "bg-[#8CB34A] text-[#0D0D0B] font-bold"
                          : "text-[#72943A] hover:text-[#E8EDD4]"
                      }`}
                    >
                      Random Quantity
                    </button>
                  </div>
                </div>

                {selectionMode === "specific" ? (
                  <div className="flex flex-col gap-4">
                    {/* Manual Input Bar */}
                    <div className="p-3.5 rounded-xl bg-[#111210] border border-[#2D3C13] flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Type numbers separated by comma (e.g. 7, 14, 42)..."
                          value={manualNumberInput}
                          onChange={(e) => setManualNumberInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddManualNumbers();
                            }
                          }}
                          className="w-full h-9 bg-[#161810] border border-[#2D3C13] rounded-lg px-3 text-xs text-[#E8EDD4] placeholder-[#5A752A] focus:outline-none focus:border-[#8CB34A]"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleAddManualNumbers}
                        className="px-4 py-2 rounded-lg bg-[#1A230A] border border-[#8CB34A]/50 hover:bg-[#2D3C13] text-[#8CB34A] font-sans font-bold text-xs transition-colors shrink-0"
                      >
                        + Add Numbers
                      </button>
                    </div>

                    {/* Filter & Search visualizer controls */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-2">
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                        {(["all", "available", "instant_wins", "sold"] as const).map((f) => (
                          <button
                            key={f}
                            type="button"
                            onClick={() => setTicketFilter(f)}
                            className={`px-3 py-1 rounded-lg text-xs font-sans transition-colors capitalize ${
                              ticketFilter === f
                                ? "bg-[#8CB34A] text-[#0D0D0B] font-bold"
                                : "bg-[#111210] border border-[#2D3C13] text-[#72943A] hover:text-[#E8EDD4]"
                            }`}
                          >
                            {f.replace("_", " ")}
                          </button>
                        ))}
                      </div>

                      <div className="relative w-full sm:w-44">
                        <input
                          type="number"
                          placeholder="Jump to #..."
                          value={ticketSearchNumber}
                          onChange={(e) => setTicketSearchNumber(e.target.value)}
                          className="w-full h-8 bg-[#111210] border border-[#2D3C13] rounded-lg px-3 text-xs text-[#E8EDD4] placeholder-[#5A752A] focus:outline-none focus:border-[#8CB34A]"
                        />
                      </div>
                    </div>

                    {/* Interactive Ticket Grid */}
                    {isLoadingDetails ? (
                      <div className="py-16 text-center text-xs text-[#72943A]">Loading ticket grid...</div>
                    ) : ticketDetails ? (
                      <div className="border border-[#2D3C13] rounded-xl bg-[#111210] p-4 max-h-[340px] overflow-y-auto">
                        <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-12 gap-2">
                          {Array.from({ length: ticketDetails.stats.totalTickets }, (_, i) => i + 1)
                            .filter((num) => {
                              if (ticketSearchNumber && !num.toString().includes(ticketSearchNumber)) return false;
                              const isSold = soldTicketsMap.has(num);
                              const isInstant = instantWinsMap.has(num);
                              if (ticketFilter === "available") return !isSold;
                              if (ticketFilter === "sold") return isSold;
                              if (ticketFilter === "instant_wins") return isInstant;
                              return true;
                            })
                            .slice(0, 300) // render up to first 300 in grid for smooth performance
                            .map((num) => {
                              const isSold = soldTicketsMap.has(num);
                              const isInstant = instantWinsMap.has(num);
                              const isSelected = selectedTicketNumbers.includes(num);
                              const soldInfo = soldTicketsMap.get(num);

                              return (
                                <button
                                  key={num}
                                  type="button"
                                  disabled={isSold}
                                  onClick={() => handleToggleTicketNumber(num)}
                                  title={
                                    isSold
                                      ? `Sold to ${soldInfo?.userName || "User"} (${soldInfo?.paymentGateway})`
                                      : isInstant
                                      ? `⚡ Instant Win: ${instantWinsMap.get(num)?.prizeName}`
                                      : `Ticket #${num}`
                                  }
                                  className={`relative h-10 rounded-lg flex flex-col items-center justify-center font-mono text-xs font-bold transition-all ${
                                    isSold
                                      ? "bg-[#181915] border border-[#252820] text-[#454A3B] cursor-not-allowed line-through"
                                      : isSelected
                                      ? "bg-[#8CB34A] text-[#0D0D0B] border-2 border-[#A0D056] shadow-[0_0_10px_rgba(140,179,74,0.4)] scale-105 z-10"
                                      : isInstant
                                      ? "bg-[#2A200B] border border-[#EAB308] text-[#FDE68A] hover:bg-[#3B2C10]"
                                      : "bg-[#161810] border border-[#2D3C13] text-[#E8EDD4] hover:border-[#8CB34A]"
                                  }`}
                                >
                                  <span>{num}</span>
                                  {isInstant && !isSold && !isSelected && (
                                    <span className="text-[9px] absolute -top-1 -right-1">⚡</span>
                                  )}
                                </button>
                              );
                            })}
                        </div>
                        {ticketDetails.stats.totalTickets > 300 && (
                          <p className="text-[11px] text-[#5A752A] text-center mt-3">
                            Showing first 300 tickets in visual grid. Use the manual input bar above to add any number up to #{ticketDetails.stats.totalTickets}.
                          </p>
                        )}
                      </div>
                    ) : null}

                    {/* Selected Numbers Summary Bar */}
                    <div className="p-3.5 rounded-xl bg-[#111210] border border-[#2D3C13] flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs text-[#72943A]">
                          Selected ({selectedTicketNumbers.length}):
                        </span>
                        {selectedTicketNumbers.length > 0 ? (
                          selectedTicketNumbers.map((num) => (
                            <span
                              key={num}
                              className={`inline-flex items-center gap-1 font-mono text-xs font-bold px-2 py-0.5 rounded ${
                                instantWinsMap.has(num)
                                  ? "bg-[#EAB308]/20 border border-[#EAB308] text-[#FDE68A]"
                                  : "bg-[#1A230A] border border-[#2D3C13] text-[#8CB34A]"
                              }`}
                            >
                              #{num}
                              {instantWinsMap.has(num) && "⚡"}
                              <button
                                type="button"
                                onClick={() => handleToggleTicketNumber(num)}
                                className="text-[#5A752A] hover:text-[#f76b6b] ml-0.5"
                              >
                                ×
                              </button>
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-[#5A752A] italic">No tickets selected yet</span>
                        )}
                      </div>

                      {selectedTicketNumbers.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setSelectedTicketNumbers([])}
                          className="text-xs text-[#f76b6b] hover:underline"
                        >
                          Clear Selection
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Random Quantity Mode */
                  <div className="flex flex-col gap-4 p-4 rounded-xl bg-[#111210] border border-[#2D3C13]">
                    <p className="text-xs text-[#72943A]">
                      Select how many random available tickets to allocate. The system will randomly assign ticket numbers upon submission.
                    </p>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setRandomQuantity((q) => Math.max(q - 1, 1))}
                        className="w-10 h-10 rounded-xl bg-[#161810] border border-[#2D3C13] text-[#E8EDD4] font-bold text-lg hover:border-[#8CB34A]"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min={1}
                        max={ticketDetails?.stats.availableTickets || 100}
                        value={randomQuantity}
                        onChange={(e) => setRandomQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                        className="w-24 h-10 bg-[#161810] border border-[#2D3C13] rounded-xl text-center font-heading font-extrabold text-lg text-[#E8EDD4] focus:outline-none focus:border-[#8CB34A]"
                      />
                      <button
                        type="button"
                        onClick={() => setRandomQuantity((q) => q + 1)}
                        className="w-10 h-10 rounded-xl bg-[#161810] border border-[#2D3C13] text-[#E8EDD4] font-bold text-lg hover:border-[#8CB34A]"
                      >
                        +
                      </button>

                      <div className="flex items-center gap-1.5 ml-2">
                        {[1, 5, 10, 25, 50].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => setRandomQuantity(preset)}
                            className="px-3 py-1.5 rounded-lg bg-[#161810] border border-[#2D3C13] hover:border-[#8CB34A] text-xs font-mono font-bold text-[#72943A] hover:text-[#E8EDD4] transition-colors"
                          >
                            +{preset}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: User Selection, Summary & Action Box */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Step 4: Recipient User Card */}
            <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#1A230A] border border-[#2D3C13] flex items-center justify-center text-xs font-bold text-[#8CB34A]">
                  3
                </span>
                <h2 className="font-heading font-bold text-base text-[#E8EDD4]">
                  Recipient User
                </h2>
              </div>

              {/* User search bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search user by email, name or ID..."
                  value={userSearchQuery}
                  onFocus={() => setShowUserDropdown(true)}
                  onChange={(e) => {
                    setUserSearchQuery(e.target.value);
                    setShowUserDropdown(true);
                  }}
                  className="w-full h-10 bg-[#111210] border border-[#2D3C13] rounded-xl px-4 text-xs text-[#E8EDD4] placeholder-[#5A752A] focus:outline-none focus:border-[#8CB34A]"
                />

                {/* Autocomplete Dropdown */}
                {showUserDropdown && searchedUsers.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-[#161810] border border-[#2D3C13] rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto">
                    {searchedUsers.map((u) => (
                      <div
                        key={u.id}
                        onClick={() => {
                          setSelectedUser(u);
                          setShowUserDropdown(false);
                          setUserSearchQuery("");
                        }}
                        className="p-3 hover:bg-[#1A230A] cursor-pointer border-b border-[#2D3C13]/40 flex items-center justify-between gap-3 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-[#1A230A] border border-[#2D3C13] flex items-center justify-center text-xs font-bold text-[#8CB34A] shrink-0">
                            {u.firstName?.[0] || u.email[0].toUpperCase()}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-sans font-medium text-xs text-[#E8EDD4] truncate">
                              {u.firstName || u.lastName ? `${u.firstName || ""} ${u.lastName || ""}`.trim() : u.email}
                            </span>
                            <span className="font-sans text-[11px] text-[#72943A] truncate">
                              {u.email}
                            </span>
                          </div>
                        </div>

                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#1A230A] border border-[#2D3C13] text-[#72943A]">
                          {u.role}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected User Display */}
              {selectedUser ? (
                <div className="p-4 rounded-xl bg-[#111210] border border-[#8CB34A]/50 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-[#1A230A] border border-[#8CB34A] flex items-center justify-center text-sm font-bold text-[#8CB34A] shrink-0">
                      {selectedUser.firstName?.[0] || selectedUser.email[0].toUpperCase()}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-heading font-bold text-sm text-[#E8EDD4] truncate">
                        {selectedUser.firstName || selectedUser.lastName
                          ? `${selectedUser.firstName || ""} ${selectedUser.lastName || ""}`.trim()
                          : selectedUser.email}
                      </span>
                      <span className="font-sans text-xs text-[#72943A] truncate">
                        {selectedUser.email}
                      </span>
                      <span className="font-mono text-[10px] text-[#5A752A] mt-0.5 truncate">
                        ID: {selectedUser.id}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedUser(null)}
                    className="text-xs text-[#f76b6b] hover:underline shrink-0"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <p className="text-xs text-[#5A752A] italic">
                  Search and select a user account to assign these tickets to.
                </p>
              )}
            </div>

            {/* Step 5: Admin Notes & Financial Summary Box */}
            <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col gap-5">
              <h2 className="font-heading font-bold text-base text-[#E8EDD4]">
                Assignment Summary
              </h2>

              {/* Administrative Note */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#72943A]">
                  Admin Note / Reason (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Promotional prize, Loyalty gift..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full h-9 bg-[#111210] border border-[#2D3C13] rounded-lg px-3 text-xs text-[#E8EDD4] placeholder-[#5A752A] focus:outline-none focus:border-[#8CB34A]"
                />
              </div>

              {/* Financial Breakdown Table */}
              <div className="p-4 rounded-xl bg-[#111210] border border-[#2D3C13] flex flex-col gap-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#72943A]">Selected Competition:</span>
                  <span className="font-medium text-[#E8EDD4] truncate max-w-[160px]">
                    {selectedCompetition?.title || "None"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#72943A]">Tickets to Issue:</span>
                  <span className="font-heading font-bold text-[#E8EDD4]">
                    {totalCount} ticket{totalCount > 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#72943A]">Unit Price:</span>
                  <span className="text-[#E8EDD4]">£{unitPrice.toFixed(2)}</span>
                </div>
                <div className="h-px bg-[#2D3C13] my-0.5" />
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[#72943A]">Total Accounting Value:</span>
                  <span className="font-heading font-extrabold text-lg text-[#8CB34A]">
                    £{totalFinancialValue.toFixed(2)}
                  </span>
                </div>

                <div className="mt-1 p-2.5 rounded-lg bg-[#1A230A]/60 border border-[#2D3C13] text-[11px] text-[#72943A]">
                  💡 <strong>Accounting Guarantee:</strong> This £{totalFinancialValue.toFixed(2)} is recorded as a completed transaction (<code className="text-[#8CB34A]">ADMIN_MANUAL</code>) and automatically credited to the host wallet balance without discrepancy.
                </div>
              </div>

              {/* Instant win warning if any selected */}
              {selectedInstantWins.length > 0 && (
                <div className="p-3.5 rounded-xl bg-[#2A200B] border border-[#EAB308]/60 flex items-start gap-2.5">
                  <span className="text-lg">⚡</span>
                  <div>
                    <h4 className="font-heading font-bold text-xs text-[#FDE68A]">
                      Instant Win Triggered!
                    </h4>
                    <p className="font-sans text-[11px] text-[#FEF08A] mt-0.5">
                      {selectedInstantWins.length} of the selected ticket(s) match instant win prizes:{" "}
                      {selectedInstantWins.map((iw) => `Ticket #${iw.ticketNumber} (${iw.prizeName})`).join(", ")}.
                      The recipient user will automatically win these prizes!
                    </p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="button"
                disabled={!selectedRaffleId || !selectedUser || totalCount === 0 || assignMutation.isPending}
                onClick={() => setIsConfirmModalOpen(true)}
                className="w-full h-12 rounded-xl bg-[#8CB34A] hover:bg-[#A0D056] disabled:opacity-50 disabled:cursor-not-allowed text-[#0D0D0B] font-heading font-extrabold text-sm transition-all shadow-md flex items-center justify-center gap-2"
              >
                {assignMutation.isPending ? "Assigning Tickets..." : `Assign ${totalCount} Ticket${totalCount > 1 ? "s" : ""} to User`}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* History Tab: Historical Manual Assignments */
        <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="font-heading font-bold text-lg text-[#E8EDD4]">
              Manual Assignment Audit Trail
            </h2>
            <button
              onClick={() => refetchHistory()}
              className="text-xs text-[#8CB34A] hover:underline"
            >
              Refresh Table
            </button>
          </div>

          {isLoadingHistory ? (
            <div className="py-16 text-center text-xs text-[#72943A]">Loading assignment history...</div>
          ) : historyData && historyData.data.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans text-xs">
                <thead>
                  <tr className="border-b border-[#2D3C13] text-[#5A752A] uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Order / TX ID</th>
                    <th className="py-3 px-4">Recipient</th>
                    <th className="py-3 px-4">Competition</th>
                    <th className="py-3 px-4 text-center">Tickets</th>
                    <th className="py-3 px-4">Ticket Numbers</th>
                    <th className="py-3 px-4 text-right">Value (£)</th>
                    <th className="py-3 px-4 text-center">Channel</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A230A]">
                  {historyData.data.map((item) => (
                    <tr key={item.id} className="hover:bg-[#1A230A]/50 transition-colors">
                      <td className="py-3.5 px-4 text-[#72943A] whitespace-nowrap">
                        {format(new Date(item.date), "dd MMM yyyy, HH:mm")}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-[#E8EDD4] whitespace-nowrap">
                        {item.gatewayTransactionId}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-[#E8EDD4]">{item.recipient.name}</span>
                          <span className="text-[11px] text-[#72943A]">{item.recipient.email}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[#E8EDD4]">
                        {item.raffle?.title || "Competition"}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-[#8CB34A]">
                        {item.ticketsCount}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {item.ticketNumbers.slice(0, 5).map((num) => (
                            <span key={num} className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#1A230A] border border-[#2D3C13] text-[#E8EDD4]">
                              #{num}
                            </span>
                          ))}
                          {item.ticketNumbers.length > 5 && (
                            <span className="text-[10px] text-[#5A752A]">
                              +{item.ticketNumbers.length - 5} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-heading font-bold text-[#E8EDD4]">
                        £{item.amount.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1E3A8A]/40 text-[#60A5FA] border border-[#3B82F6]/40 uppercase tracking-wide">
                          ADMIN MANUAL
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {historyData.meta.totalPages > 1 && (
                <div className="flex justify-between items-center mt-4 pt-3 border-t border-[#2D3C13]">
                  <span className="text-xs text-[#72943A]">
                    Page {historyData.meta.page} of {historyData.meta.totalPages} ({historyData.meta.total} total)
                  </span>
                  <div className="flex gap-2">
                    <button
                      disabled={historyPage <= 1}
                      onClick={() => setHistoryPage((p) => p - 1)}
                      className="px-3 py-1 bg-[#1A230A] border border-[#2D3C13] rounded-lg text-xs disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      disabled={historyPage >= historyData.meta.totalPages}
                      onClick={() => setHistoryPage((p) => p + 1)}
                      className="px-3 py-1 bg-[#1A230A] border border-[#2D3C13] rounded-lg text-xs disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-16 text-center text-xs text-[#72943A]">
              No manual ticket assignments have been recorded yet.
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#141512] border border-[#2D3C13] rounded-[20px] max-w-[520px] w-full p-6 sm:p-7 flex flex-col gap-5 shadow-2xl relative">
            <h3 className="font-heading font-extrabold text-xl text-[#E8EDD4]">
              Confirm Manual Ticket Assignment
            </h3>

            <p className="text-xs text-[#72943A]">
              You are about to assign competition tickets without gateway payment. Please review the details below:
            </p>

            <div className="p-4 rounded-xl bg-[#111210] border border-[#2D3C13] flex flex-col gap-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-[#72943A]">Recipient:</span>
                <span className="font-bold text-[#E8EDD4]">{selectedUser?.firstName} {selectedUser?.lastName} ({selectedUser?.email})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#72943A]">Competition:</span>
                <span className="font-medium text-[#E8EDD4]">{selectedCompetition?.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#72943A]">Tickets:</span>
                <span className="font-bold text-[#8CB34A]">{totalCount} ticket(s)</span>
              </div>
              {selectionMode === "specific" && (
                <div className="flex justify-between">
                  <span className="text-[#72943A]">Numbers:</span>
                  <span className="font-mono text-[#E8EDD4] max-w-[260px] truncate">
                    #{selectedTicketNumbers.join(", #")}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[#72943A]">Host Credited:</span>
                <span className="font-bold text-[#E8EDD4]">£{totalFinancialValue.toFixed(2)}</span>
              </div>
              {adminNotes && (
                <div className="flex justify-between">
                  <span className="text-[#72943A]">Note:</span>
                  <span className="text-[#B3B8AA] italic">{adminNotes}</span>
                </div>
              )}
            </div>

            {selectedInstantWins.length > 0 && (
              <div className="p-3 rounded-xl bg-[#2A200B] border border-[#EAB308]/60 text-xs text-[#FEF08A]">
                ⚡ <strong>Instant Win Trigger Notice:</strong> Ticket #{selectedInstantWins.map((iw) => iw.ticketNumber).join(", #")} will unlock an instant prize for this user!
              </div>
            )}

            <div className="flex gap-3 justify-end mt-2">
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-[#2D3C13] text-[#72943A] hover:bg-[#1A230A] text-xs font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteAssignment}
                className="px-5 py-2.5 rounded-xl bg-[#8CB34A] hover:bg-[#A0D056] text-[#0D0D0B] font-heading font-extrabold text-xs transition-colors shadow-md"
              >
                Confirm & Allocate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assignment Success Dialog */}
      {assignmentSuccessResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#141512] border border-[#8CB34A]/50 rounded-[20px] max-w-[500px] w-full p-6 sm:p-7 flex flex-col gap-4 shadow-2xl relative text-center">
            <div className="w-14 h-14 rounded-full bg-[#083b18] border border-[#4ADE80] flex items-center justify-center text-2xl mx-auto">
              ✓
            </div>

            <h3 className="font-heading font-extrabold text-xl text-[#E8EDD4]">
              Tickets Successfully Assigned!
            </h3>

            <p className="text-xs text-[#72943A]">
              {assignmentSuccessResult.message}
            </p>

            <div className="p-3.5 rounded-xl bg-[#111210] border border-[#2D3C13] flex flex-col gap-2 text-xs text-left">
              <div className="flex justify-between">
                <span className="text-[#72943A]">Assigned Numbers:</span>
                <span className="font-mono text-[#8CB34A] font-bold">
                  #{assignmentSuccessResult.assignedNumbers.join(", #")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#72943A]">Host Balance Credited:</span>
                <span className="font-bold text-[#E8EDD4]">
                  £{assignmentSuccessResult.totalAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#72943A]">Transaction Channel:</span>
                <span className="font-mono text-[#60A5FA]">
                  {assignmentSuccessResult.paymentGateway}
                </span>
              </div>
            </div>

            {/* Instant Wins Celebration Banner */}
            {assignmentSuccessResult.instantWinsWon && assignmentSuccessResult.instantWinsWon.length > 0 && (
              <div className="p-4 rounded-xl bg-[#3B2800] border border-[#EAB308] text-left flex flex-col gap-1.5 animate-bounce">
                <div className="flex items-center gap-1.5 text-sm font-bold text-[#FDE68A]">
                  <span>🎉</span> Instant Win Unlocked!
                </div>
                {assignmentSuccessResult.instantWinsWon.map((w: any, idx: number) => (
                  <p key={idx} className="text-xs text-[#FEF08A]">
                    Ticket #{w.ticketNumber} won: <strong>{w.prizeName}</strong>
                  </p>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => setAssignmentSuccessResult(null)}
              className="mt-2 w-full h-10 rounded-xl bg-[#8CB34A] hover:bg-[#A0D056] text-[#0D0D0B] font-heading font-extrabold text-xs transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
