"use client";

import React, { useEffect, useState } from "react";
import { formatUkDate, formatUkTime } from "../../../lib/date-utils";
import { Raffle, raffleService } from "../../../services/raffle.service";
import Link from "next/link";
import { differenceInDays, differenceInHours } from "date-fns";
import { useQuery } from "@tanstack/react-query";

interface AdminRaffleDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  raffle: Raffle | null;
  onViewTickets?: (raffle: Raffle) => void;
  onSelectWinner?: (raffle: Raffle) => void;
  onExportCSV?: (raffle: Raffle) => void;
}

export default function AdminRaffleDetailsModal({
  isOpen,
  onClose,
  raffle: initialRaffle,
  onViewTickets,
  onSelectWinner,
  onExportCSV,
}: AdminRaffleDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "host" | "instantWins" | "winner">("overview");

  // Fetch freshest raffle details using TanStack Query
  const { data: fetchedRaffle, isFetching: isRefreshing } = useQuery({
    queryKey: ["adminRaffleDetails", initialRaffle?.id],
    queryFn: () => raffleService.getAdminRaffleById(initialRaffle!.id),
    enabled: isOpen && Boolean(initialRaffle?.id),
    staleTime: 1000 * 30, // 30 seconds
  });

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const raffle = fetchedRaffle || initialRaffle;

  if (!isOpen || !raffle) return null;

  const startDate = raffle.startDate ? new Date(raffle.startDate) : null;
  const endDate = raffle.endDate ? new Date(raffle.endDate) : null;
  const now = new Date();

  // Duration calculation
  let durationText = "N/A";
  if (startDate && endDate && !isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
    const days = differenceInDays(endDate, startDate);
    const hours = differenceInHours(endDate, startDate) % 24;
    if (days > 0) {
      durationText = `${days} day${days > 1 ? "s" : ""}${hours > 0 ? ` ${hours} hr${hours > 1 ? "s" : ""}` : ""}`;
    } else {
      durationText = `${differenceInHours(endDate, startDate)} hours`;
    }
  }

  // Time relative status
  const isStarted = startDate ? startDate <= now : false;
  const isEnded = endDate ? endDate <= now : false;

  const host = raffle.host;
  const hostUser = host?.user;
  const hostName = host?.businessName || (hostUser ? `${hostUser.firstName || ""} ${hostUser.lastName || ""}`.trim() : "Unknown Host");
  const hostEmail = hostUser?.email || "";
  const hostAvatar = hostUser?.avatarUrl || host?.logoUrl;
  const publicSlug = raffle.slug || raffle.id;

  const ticketPrice = Number(raffle.pricePerTicket) || 0;
  const totalTickets = Number(raffle.totalTickets) || 0;
  const ticketsSold = Number(raffle.ticketsSold) || 0;
  const remainingTickets = Math.max(totalTickets - ticketsSold, 0);
  const progressPercent = totalTickets > 0 ? Math.min(Math.round((ticketsSold / totalTickets) * 100), 100) : 0;
  const grossRevenue = ticketPrice * ticketsSold;
  const potentialRevenue = ticketPrice * totalTickets;

  // Winners check
  interface RaffleWithExtras extends Raffle {
    winners?: Array<{
      id: string;
      ticketId?: string;
      ticketNumber?: number;
      userName?: string;
      userEmail?: string;
      winType?: string;
      wonAt?: string;
      createdAt?: string;
      prizeName?: string;
      deliveryStatus?: string;
      user?: {
        firstName?: string | null;
        lastName?: string | null;
        email?: string;
      };
      ticket?: {
        ticketNumber?: number;
      };
    }>;
  }
  const raffleData = raffle as RaffleWithExtras;
  const winners = raffleData.winners || [];
  const mainWinner = winners.find((w) => w.winType === "MAIN_DRAW") || winners[0];
  const instantWins = raffle.instantWins || [];
  const instantWinsCount = instantWins.length || raffle._count?.instantWins || 0;

  const hasWinner = Boolean(mainWinner);
  const isSoldOut = totalTickets > 0 && ticketsSold >= totalTickets;
  const canDraw = !hasWinner && (isSoldOut || isEnded);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <span className="px-2.5 py-1 rounded-full border border-[#4ADE80]/30 bg-[#083b18] text-[#4ADE80] font-sans font-medium text-[11px]">Live</span>;
      case "PENDING_APPROVAL":
        return <span className="px-2.5 py-1 rounded-full border border-[#D97706]/30 bg-[#78350F] text-[#F59E0B] font-sans font-medium text-[11px]">Pending Approval</span>;
      case "CANCELLED":
        return <span className="px-2.5 py-1 rounded-full border border-[#EF4444]/30 bg-[#7F1D1D] text-[#f76b6b] font-sans font-medium text-[11px]">Cancelled / Rejected</span>;
      case "ENDED":
        return <span className="px-2.5 py-1 rounded-full border border-[#A78BFA]/30 bg-[#312E81] text-[#C4B5FD] font-sans font-medium text-[11px]">Ended</span>;
      case "DRAFT":
        return <span className="px-2.5 py-1 rounded-full border border-[#D97706]/30 bg-[#78350F] text-[#F59E0B] font-sans font-medium text-[11px]">Draft</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full border border-[#2D3C13] bg-[#1A230A] text-[#72943A] font-sans font-medium text-[11px]">{status}</span>;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-[#0D0D0B]/85 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[96%] sm:w-[94%] max-w-[900px] max-h-[92vh] bg-[#161810] border border-[#2D3C13] rounded-[16px] sm:rounded-[20px] shadow-2xl z-50 flex flex-col overflow-hidden animate-fadeIn">
        
        {/* Modal Header */}
        <div className="px-5 py-4 sm:px-6 sm:py-4 border-b border-[#2D3C13] flex items-start justify-between gap-3 bg-[#111210] shrink-0">
          <div className="flex flex-col gap-1.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              {getStatusBadge(raffle.status)}
              {raffle.category && (
                <span className="px-2.5 py-0.5 rounded-full bg-[#1A230A] text-[#8CB34A] border border-[#2D3C13] font-sans text-[11px]">
                  {raffle.category}
                </span>
              )}
              {raffle.prizeClassification && (
                <span className="px-2 py-0.5 rounded bg-[#2D3C13]/60 text-[#A0D056] font-sans text-[10px] uppercase font-semibold">
                  {raffle.prizeClassification.replace(/_/g, " ")}
                </span>
              )}
              {raffle.guaranteedDraw && (
                <span className="px-2 py-0.5 rounded bg-[#D97706]/20 border border-[#D97706]/40 text-[#F59E0B] font-sans text-[10px] font-semibold">
                  ★ Guaranteed Draw
                </span>
              )}
              {isRefreshing && (
                <span className="text-[10px] text-[#72943A] animate-pulse">Syncing fresh data...</span>
              )}
            </div>
            
            <h2 className="font-heading font-bold text-[18px] sm:text-[22px] text-[#E8EDD4] truncate leading-tight">
              {raffle.title}
            </h2>

            <div className="flex items-center gap-2 text-xs font-sans text-[#72943A]">
              <span>Host: <strong className="text-[#E8EDD4]">{hostName}</strong></span>
              {hostEmail && <span>({hostEmail})</span>}
              <span className="text-[#5A752A]">•</span>
              <span className="font-mono text-[#5A752A]">ID: {raffle.id.slice(0, 8)}...</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#1A230A] hover:bg-[#2D3C13] text-[#8CB34A] hover:text-[#E8EDD4] border border-[#2D3C13] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-[#2D3C13] bg-[#111210]/60 px-4 sm:px-6 shrink-0 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-3 px-3 sm:px-4 font-heading text-[12px] sm:text-[13px] font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "overview"
                ? "border-[#8CB34A] text-[#8CB34A]"
                : "border-transparent text-[#72943A] hover:text-[#E8EDD4]"
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
            </svg>
            <span>Overview & Timings</span>
          </button>

          <button
            onClick={() => setActiveTab("host")}
            className={`py-3 px-3 sm:px-4 font-heading text-[12px] sm:text-[13px] font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "host"
                ? "border-[#8CB34A] text-[#8CB34A]"
                : "border-transparent text-[#72943A] hover:text-[#E8EDD4]"
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
            <span>Host Profile</span>
          </button>

          <button
            onClick={() => setActiveTab("instantWins")}
            className={`py-3 px-3 sm:px-4 font-heading text-[12px] sm:text-[13px] font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "instantWins"
                ? "border-[#8CB34A] text-[#8CB34A]"
                : "border-transparent text-[#72943A] hover:text-[#E8EDD4]"
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
            </svg>
            <span>Instant Wins ({instantWinsCount})</span>
          </button>

          <button
            onClick={() => setActiveTab("winner")}
            className={`py-3 px-3 sm:px-4 font-heading text-[12px] sm:text-[13px] font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "winner"
                ? "border-[#8CB34A] text-[#8CB34A]"
                : "border-transparent text-[#72943A] hover:text-[#E8EDD4]"
            }`}
          >
            <span>🏆</span>
            <span>Winners & Result {hasWinner ? "(1)" : "(0)"}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-5 custom-scrollbar">
          
          {activeTab === "overview" && (
            <>
              {/* SCHEDULE & TIMINGS - PROMINENT SECTION */}
              <div className="bg-[#111210] border border-[#2D3C13] rounded-[14px] p-4 sm:p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-semibold text-[13px] text-[#8CB34A] uppercase tracking-wider flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.253 3.75m-18 0h18M4.5 7.5v12a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V7.5M4.5 7.5H19.5" />
                    </svg>
                    <span>Competition Schedule & Timings</span>
                  </h3>
                  <span className="font-sans text-[11px] font-medium text-[#72943A] bg-[#1A230A] px-2.5 py-1 rounded-[6px] border border-[#2D3C13]">
                    Duration: <strong className="text-[#E8EDD4]">{durationText}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                  {/* Start Date & Time */}
                  <div className="p-4 rounded-[10px] bg-[#161810] border border-[#2D3C13] flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[#8CB34A] text-xs font-semibold uppercase tracking-wide">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#8CB34A] inline-block animate-pulse"></span>
                        <span>Start Date & Time</span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-sans font-medium ${isStarted ? "bg-[#4ADE80]/10 text-[#4ADE80] border border-[#4ADE80]/30" : "bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30"}`}>
                        {isStarted ? "Started" : "Upcoming"}
                      </span>
                    </div>
                    
                    <div className="font-heading font-bold text-[16px] text-[#E8EDD4] mt-1">
                      {startDate ? formatUkDate(startDate, "full") : "Not Set"}
                    </div>
                    
                    <div className="flex items-center gap-1.5 font-mono text-[13px] text-[#A0D056]">
                      <svg className="w-3.5 h-3.5 text-[#8CB34A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                      <span>
                        {startDate ? `${formatUkTime(startDate, true)} (UK London Time)` : "—"}
                      </span>
                    </div>
                  </div>

                  {/* End Date & Time */}
                  <div className="p-4 rounded-[10px] bg-[#161810] border border-[#2D3C13] flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[#F59E0B] text-xs font-semibold uppercase tracking-wide">
                        <span className={`w-2.5 h-2.5 rounded-full ${isEnded ? "bg-[#EF4444]" : "bg-[#F59E0B]"} inline-block`}></span>
                        <span>End / Draw Date & Time</span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-sans font-medium ${isEnded ? "bg-[#EF4444]/10 text-[#f76b6b] border border-[#EF4444]/30" : "bg-[#8CB34A]/10 text-[#8CB34A] border border-[#8CB34A]/30"}`}>
                        {isEnded ? "Draw Closed" : "Open for Entries"}
                      </span>
                    </div>

                    <div className="font-heading font-bold text-[16px] text-[#E8EDD4] mt-1">
                      {endDate ? formatUkDate(endDate, "full") : "Not Set"}
                    </div>

                    <div className="flex items-center gap-1.5 font-mono text-[13px] text-[#F59E0B]">
                      <svg className="w-3.5 h-3.5 text-[#F59E0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                      <span>
                        {endDate ? `${formatUkTime(endDate, true)} (UK London Time)` : "—"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Draw Automation Flags */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#2D3C13]/60 text-xs font-sans text-[#72943A]">
                  <span className="text-[#5A752A]">Automation Settings:</span>
                  <span className={`px-2 py-0.5 rounded text-[11px] ${raffle.isAutoDraw ? "bg-[#8CB34A]/20 text-[#A0D056] border border-[#8CB34A]/30" : "bg-[#1A230A] text-[#72943A]"}`}>
                    Auto Draw Master: {raffle.isAutoDraw ? "ON" : "OFF"}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[11px] ${raffle.autoDrawDate ? "bg-[#8CB34A]/20 text-[#A0D056] border border-[#8CB34A]/30" : "bg-[#1A230A] text-[#72943A]"}`}>
                    Draw on End Date: {raffle.autoDrawDate ? "Enabled" : "Disabled"}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[11px] ${raffle.autoDrawSoldOut ? "bg-[#8CB34A]/20 text-[#A0D056] border border-[#8CB34A]/30" : "bg-[#1A230A] text-[#72943A]"}`}>
                    Draw on Sold Out: {raffle.autoDrawSoldOut ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </div>

              {/* TICKET SALES & REVENUE PROGRESS */}
              <div className="bg-[#111210] border border-[#2D3C13] rounded-[14px] p-4 sm:p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-semibold text-[13px] text-[#8CB34A] uppercase tracking-wider flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-12v.75m0 3v.75m0 3v.75m0 3V18M3 7.5A2.25 2.25 0 0 1 5.25 5h13.5A2.25 2.25 0 0 1 21 7.5v9a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 16.5v-9z" />
                    </svg>
                    <span>Ticket Sales & Financial Performance</span>
                  </h3>
                  <span className="font-sans font-bold text-[13px] text-[#8CB34A]">
                    {progressPercent}% Sold ({ticketsSold} / {totalTickets})
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2.5 bg-[#0D0D0B] rounded-full overflow-hidden border border-[#2D3C13]">
                  <div
                    className="h-full bg-gradient-to-r from-[#72943A] to-[#8CB34A] rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {/* Financial Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-1">
                  <div className="bg-[#161810] border border-[#2D3C13] rounded-[10px] p-3 flex flex-col">
                    <span className="text-[10px] font-medium text-[#5A752A] uppercase tracking-wider">Price / Ticket</span>
                    <span className="font-heading font-bold text-[18px] text-[#8CB34A] mt-0.5">
                      £{ticketPrice.toFixed(2)}
                    </span>
                  </div>

                  <div className="bg-[#161810] border border-[#2D3C13] rounded-[10px] p-3 flex flex-col">
                    <span className="text-[10px] font-medium text-[#5A752A] uppercase tracking-wider">Gross Sold</span>
                    <span className="font-heading font-bold text-[18px] text-[#A0D056] mt-0.5">
                      £{grossRevenue.toFixed(2)}
                    </span>
                  </div>

                  <div className="bg-[#161810] border border-[#2D3C13] rounded-[10px] p-3 flex flex-col">
                    <span className="text-[10px] font-medium text-[#5A752A] uppercase tracking-wider">Max Potential</span>
                    <span className="font-heading font-bold text-[18px] text-[#E8EDD4] mt-0.5">
                      £{potentialRevenue.toFixed(2)}
                    </span>
                  </div>

                  <div className="bg-[#161810] border border-[#2D3C13] rounded-[10px] p-3 flex flex-col">
                    <span className="text-[10px] font-medium text-[#5A752A] uppercase tracking-wider">Remaining</span>
                    <span className="font-heading font-bold text-[18px] text-[#F59E0B] mt-0.5">
                      {remainingTickets} tickets
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#2D3C13]/60 text-xs font-sans text-[#72943A]">
                  <div>
                    Tickets Per Entrant: Min <strong className="text-[#E8EDD4]">{raffle.minTickets || 1}</strong> · Max <strong className="text-[#E8EDD4]">{raffle.maxTickets || "Unlimited"}</strong>
                  </div>
                  {onViewTickets && (
                    <button
                      onClick={() => onViewTickets(raffle)}
                      className="text-[11px] font-sans font-medium text-[#8CB34A] hover:text-[#A0D056] hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <span>🎟️ View All {ticketsSold} Sold Tickets</span>
                    </button>
                  )}
                </div>
              </div>

              {/* PRIZE & MEDIA */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Main Image */}
                <div className="md:col-span-1 rounded-[12px] bg-[#111210] border border-[#2D3C13] overflow-hidden flex items-center justify-center min-h-[180px] max-h-[240px] relative">
                  {raffle.mainImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={raffle.mainImage}
                      alt={raffle.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-6 text-center text-[#5A752A]">
                      <svg className="w-10 h-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                      </svg>
                      <span className="text-xs">No image provided</span>
                    </div>
                  )}
                </div>

                {/* Prize Details & Description */}
                <div className="md:col-span-2 flex flex-col gap-3">
                  <div className="bg-[#111210] border border-[#2D3C13] rounded-[12px] p-4 flex flex-col gap-1.5">
                    <span className="text-[10px] font-semibold text-[#5A752A] uppercase tracking-wider">
                      Prize Name & RRP Value
                    </span>
                    <h4 className="font-heading font-bold text-[16px] text-[#E8EDD4]">
                      {raffle.prizeName || raffle.title}
                    </h4>
                    {raffle.mainPrizeValue && (
                      <span className="text-xs font-sans text-[#A0D056]">
                        RRP Est: <strong>£{Number(raffle.mainPrizeValue).toFixed(2)}</strong>
                      </span>
                    )}
                  </div>

                  <div className="bg-[#111210] border border-[#2D3C13] rounded-[12px] p-4 flex flex-col gap-1.5 flex-1">
                    <span className="text-[10px] font-semibold text-[#5A752A] uppercase tracking-wider">
                      Description
                    </span>
                    <div className="font-sans text-[12px] text-[#E8EDD4] leading-relaxed whitespace-pre-wrap max-h-[140px] overflow-y-auto custom-scrollbar">
                      {raffle.description || <span className="text-[#5A752A] italic">No description provided.</span>}
                    </div>
                  </div>
                </div>
              </div>

              {/* TIMESTAMPS ROW */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans bg-[#111210] border border-[#2D3C13] rounded-[10px] p-3">
                <div className="text-[#72943A]">
                  Created: <strong className="text-[#E8EDD4]">{raffle.createdAt ? `${formatUkDate(raffle.createdAt)} ${formatUkTime(raffle.createdAt)}` : "N/A"}</strong>
                </div>
                <div className="text-[#72943A] sm:text-right">
                  Last Updated: <strong className="text-[#E8EDD4]">{raffle.updatedAt ? `${formatUkDate(raffle.updatedAt)} ${formatUkTime(raffle.updatedAt)}` : "N/A"}</strong>
                </div>
              </div>
            </>
          )}

          {activeTab === "host" && (
            <div className="flex flex-col gap-4">
              <div className="bg-[#111210] border border-[#2D3C13] rounded-[14px] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#1A230A] border-2 border-[#43581E] flex items-center justify-center shrink-0 overflow-hidden text-[#8CB34A] font-heading font-bold text-xl">
                    {hostAvatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={hostAvatar} alt={hostName} className="w-full h-full object-cover" />
                    ) : (
                      hostName.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <h4 className="font-heading font-bold text-[18px] text-[#E8EDD4] leading-tight">
                        {hostName}
                      </h4>
                      {host?.isVerified ? (
                        <span className="px-2 py-0.5 rounded-[4px] bg-[#8CB34A] text-[#0D0D0B] font-heading font-bold text-[10px] uppercase">
                          ✓ Verified Host
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-[4px] bg-[#D97706]/20 border border-[#D97706]/40 text-[#F59E0B] font-heading font-semibold text-[10px] uppercase">
                          Unverified
                        </span>
                      )}
                    </div>
                    {hostUser && (
                      <span className="font-sans text-[12px] text-[#72943A] mt-0.5">
                        Account Owner: <strong className="text-[#E8EDD4]">{hostUser.firstName || ""} {hostUser.lastName || ""}</strong>
                      </span>
                    )}
                  </div>
                </div>

                {host?.slug && (
                  <Link
                    href={`/hosts/${host.slug}`}
                    target="_blank"
                    className="px-4 py-2 rounded-[8px] bg-[#1A230A] border border-[#2D3C13] hover:border-[#8CB34A] text-[#8CB34A] font-heading font-medium text-[12px] flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>View Public Profile</span>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                  </Link>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#111210] border border-[#2D3C13] rounded-[12px] p-4 flex flex-col gap-3">
                  <h5 className="font-heading font-semibold text-xs text-[#8CB34A] uppercase tracking-wider border-b border-[#2D3C13] pb-2">
                    Contact & Identification
                  </h5>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] text-[#5A752A]">Email Address</span>
                    <span className="text-[#E8EDD4] font-medium font-sans text-xs">
                      {hostUser?.email || "N/A"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] text-[#5A752A]">Phone Number</span>
                    <span className="text-[#E8EDD4] font-sans text-xs">
                      {host?.phone || hostUser?.phone || "Not provided"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] text-[#5A752A]">Host ID</span>
                    <span className="text-[#72943A] font-mono text-xs">
                      {host?.id || raffle.hostId || "N/A"}
                    </span>
                  </div>
                </div>

                <div className="bg-[#111210] border border-[#2D3C13] rounded-[12px] p-4 flex flex-col gap-3">
                  <h5 className="font-heading font-semibold text-xs text-[#8CB34A] uppercase tracking-wider border-b border-[#2D3C13] pb-2">
                    Business Address & Details
                  </h5>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] text-[#5A752A]">Registered Address</span>
                    <span className="text-[#E8EDD4] font-sans text-xs">
                      {host?.address || "Not provided"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] text-[#5A752A]">VAT / Business Reg</span>
                    <span className="text-[#E8EDD4] font-sans text-xs">
                      {host?.vatNumber || "Not registered"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] text-[#5A752A]">User Account Status</span>
                    <span className={`text-xs font-semibold ${hostUser?.isBlocked ? "text-[#EF4444]" : "text-[#4ADE80]"}`}>
                      {hostUser?.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "instantWins" && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h4 className="font-heading font-semibold text-sm text-[#E8EDD4]">
                  Instant Win Allocations ({instantWins.length})
                </h4>
                <span className="text-xs text-[#72943A]">
                  Prizes unlocked immediately when corresponding ticket is purchased
                </span>
              </div>

              {instantWins.length === 0 ? (
                <div className="bg-[#111210] border border-[#2D3C13] rounded-[12px] p-8 text-center text-[#5A752A] font-sans text-sm">
                  No instant win prizes have been configured for this competition.
                </div>
              ) : (
                <div className="border border-[#2D3C13] rounded-[12px] overflow-hidden">
                  <table className="w-full text-left text-xs font-sans">
                    <thead className="bg-[#111210] text-[#5A752A] border-b border-[#2D3C13]">
                      <tr>
                        <th className="p-3">Ticket #</th>
                        <th className="p-3">Prize Name</th>
                        <th className="p-3 text-right">RRP (£)</th>
                        <th className="p-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2D3C13] bg-[#161810]">
                      {instantWins.map((iw) => (
                        <tr key={iw.id} className="hover:bg-[#1A230A]/50">
                          <td className="p-3 font-mono font-bold text-[#8CB34A]">#{iw.ticketNumber}</td>
                          <td className="p-3 text-[#E8EDD4] font-medium">{iw.prizeName}</td>
                          <td className="p-3 text-right text-[#A0D056]">
                            {iw.rrpValue ? `£${Number(iw.rrpValue).toFixed(2)}` : "—"}
                          </td>
                          <td className="p-3 text-center">
                            {iw.isClaimed ? (
                              <span className="px-2 py-0.5 rounded bg-[#4ADE80]/20 text-[#4ADE80] border border-[#4ADE80]/30 text-[10px]">
                                Claimed
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-[#2D3C13] text-[#72943A] text-[10px]">
                                Unclaimed
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "winner" && (
            <div className="flex flex-col gap-4">
              {winners.length === 0 ? (
                <div className="bg-[#111210] border border-[#2D3C13] rounded-[14px] p-8 flex flex-col items-center justify-center text-center gap-3">
                  <span className="text-3xl">🎯</span>
                  <h4 className="font-heading font-bold text-base text-[#E8EDD4]">
                    No Winner Selected Yet
                  </h4>
                  <p className="font-sans text-xs text-[#72943A] max-w-md">
                    {canDraw
                      ? "This competition has reached its end date or sold out and is ready for draw selection!"
                      : "A winner can be selected once the competition ends or sells out all tickets."}
                  </p>
                  {canDraw && onSelectWinner && (
                    <button
                      onClick={() => onSelectWinner(raffle)}
                      className="mt-2 px-4 py-2 rounded-[8px] bg-[#8CB34A] hover:bg-[#A0D056] text-[#0D0D0B] font-heading font-bold text-xs shadow-[0_0_10px_rgba(140,179,74,0.3)] transition-all cursor-pointer"
                    >
                      🏆 Select Winner Now
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {winners.map((winner, idx) => {
                    const winnerUser = winner.user;
                    const wName = winnerUser ? `${winnerUser.firstName || ""} ${winnerUser.lastName || ""}`.trim() : (winner.userName || "Winner");
                    return (
                      <div key={winner.id || idx} className="bg-[#111210] border border-[#2D3C13] rounded-[14px] p-5 flex flex-col gap-4">
                        <div className="flex items-center justify-between pb-3 border-b border-[#2D3C13]">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">🏆</span>
                            <div>
                              <h4 className="font-heading font-bold text-base text-[#8CB34A]">
                                Winning Ticket: #{winner.ticket?.ticketNumber || winner.ticketNumber || winner.ticketId || "N/A"}
                              </h4>
                              <span className="text-xs text-[#72943A]">
                                Win Type: {winner.winType || "MAIN_DRAW"}
                              </span>
                            </div>
                          </div>
                          {winner.deliveryStatus && (
                            <span className="px-2.5 py-1 rounded bg-[#1A230A] border border-[#2D3C13] text-[#A0D056] text-xs font-mono">
                              Delivery: {winner.deliveryStatus}
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="bg-[#161810] border border-[#2D3C13] rounded-[10px] p-3 flex flex-col">
                            <span className="text-[10px] text-[#5A752A] uppercase">Winner Name</span>
                            <span className="font-heading font-bold text-sm text-[#E8EDD4] mt-0.5">
                              {wName}
                            </span>
                          </div>

                          <div className="bg-[#161810] border border-[#2D3C13] rounded-[10px] p-3 flex flex-col">
                            <span className="text-[10px] text-[#5A752A] uppercase">Email</span>
                            <span className="font-sans text-xs text-[#8CB34A] mt-0.5 truncate">
                              {winnerUser?.email || winner.userEmail || "N/A"}
                            </span>
                          </div>

                          <div className="bg-[#161810] border border-[#2D3C13] rounded-[10px] p-3 flex flex-col">
                            <span className="text-[10px] text-[#5A752A] uppercase">Won At</span>
                            <span className="font-sans text-xs text-[#E8EDD4] mt-0.5">
                              {winner.wonAt || winner.createdAt ? formatUkDate(winner.wonAt || winner.createdAt) : "N/A"}
                            </span>
                          </div>
                        </div>

                        {winner.prizeName && (
                          <div className="bg-[#161810] border border-[#2D3C13] rounded-[10px] p-3">
                            <span className="text-[10px] text-[#5A752A] uppercase">Prize Awarded</span>
                            <div className="text-sm font-heading font-medium text-[#E8EDD4] mt-0.5">
                              {winner.prizeName}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#111210] border-t border-[#2D3C13] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="h-[38px] px-5 rounded-[8px] bg-[#1A230A] border border-[#2D3C13] hover:bg-[#2D3C13] text-[#E8EDD4] font-heading font-medium text-xs transition-colors cursor-pointer"
            >
              Close
            </button>

            {publicSlug && raffle.status === "ACTIVE" && (
              <Link
                href={`/live-raffles/${publicSlug}`}
                target="_blank"
                className="h-[38px] px-4 rounded-[8px] bg-transparent border border-[#2D3C13] hover:bg-[#1A230A] text-[#72943A] hover:text-[#E8EDD4] font-heading font-medium text-xs flex items-center gap-1.5 transition-colors"
              >
                <span>Live Public Page</span>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </Link>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onExportCSV && ticketsSold > 0 && (
              <button
                onClick={() => onExportCSV(raffle)}
                className="h-[38px] px-4 rounded-[8px] bg-transparent border border-[#2D3C13] hover:bg-[#1A230A] text-[#72943A] hover:text-[#8CB34A] font-heading font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>📥</span>
                <span>Export CSV</span>
              </button>
            )}

            {onViewTickets && ticketsSold > 0 && (
              <button
                onClick={() => onViewTickets(raffle)}
                className="h-[38px] px-4 rounded-[8px] bg-transparent border border-[#2D3C13] hover:bg-[#1A230A] text-[#8CB34A] font-heading font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>🎟️</span>
                <span>View Tickets</span>
              </button>
            )}

            {canDraw && onSelectWinner && (
              <button
                onClick={() => onSelectWinner(raffle)}
                className="h-[38px] px-4 rounded-[8px] bg-[#8CB34A] hover:bg-[#A0D056] text-[#0D0D0B] font-heading font-bold text-xs transition-colors flex items-center gap-1.5 shadow-[0_0_10px_rgba(140,179,74,0.3)] cursor-pointer"
              >
                <span>🏆</span>
                <span>Select Winner</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </>
  );
}
