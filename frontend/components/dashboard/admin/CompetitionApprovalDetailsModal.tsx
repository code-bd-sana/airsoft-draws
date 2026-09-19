"use client";

import React, { useState } from "react";
import { differenceInDays, differenceInHours } from "date-fns";
import { formatUkDate, formatUkTime } from "../../../lib/date-utils";
import { Raffle } from "../../../services/raffle.service";
import Link from "next/link";

interface CompetitionApprovalDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  competition: Raffle | null;
  onApprove: (id: string) => void;
  onReject: (id: string, title: string) => void;
  isApproving: boolean;
  onViewHostDetails?: (host: any) => void;
}

export default function CompetitionApprovalDetailsModal({
  isOpen,
  onClose,
  competition,
  onApprove,
  onReject,
  isApproving,
  onViewHostDetails,
}: CompetitionApprovalDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<"competition" | "host">("competition");

  if (!isOpen || !competition) return null;

  const startDate = competition.startDate ? new Date(competition.startDate) : null;
  const endDate = competition.endDate ? new Date(competition.endDate) : null;

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

  const host = competition.host;
  const hostUser = host?.user;
  const hostName = host?.businessName || (hostUser ? `${hostUser.firstName || ""} ${hostUser.lastName || ""}`.trim() : "Unknown Host");
  const hostAvatar = hostUser?.avatarUrl || host?.logoUrl;
  const publicSlug = host?.slug || host?.id;

  const ticketPrice = Number(competition.pricePerTicket) || 0;
  const totalTickets = Number(competition.totalTickets) || 0;
  const potentialRevenue = ticketPrice * totalTickets;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-[#0D0D0B]/85 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[96%] sm:w-[92%] max-w-[840px] max-h-[90dvh] sm:max-h-[90vh] bg-[#161810] border border-[#2D3C13] rounded-[16px] sm:rounded-[20px] shadow-2xl z-50 animate-fadeIn flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-4 py-3.5 sm:px-6 sm:py-4 border-b border-[#2D3C13] flex items-start justify-between gap-3 bg-[#111210] shrink-0">
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="px-2 sm:px-2.5 py-0.5 rounded-full bg-[#78350F]/70 text-[#F59E0B] border border-[#D97706]/40 font-sans font-medium text-[10px] sm:text-[11px] uppercase tracking-wider">
                Pending Approval
              </span>
              {competition.category && (
                <span className="px-2 sm:px-2.5 py-0.5 rounded-full bg-[#1A230A] text-[#8CB34A] border border-[#2D3C13] font-sans text-[10px] sm:text-[11px]">
                  {competition.category}
                </span>
              )}
              {competition.prizeClassification && (
                <span className="px-1.5 sm:px-2 py-0.5 rounded bg-[#2D3C13]/60 text-[#A0D056] font-sans text-[9px] sm:text-[10px] uppercase font-semibold">
                  {competition.prizeClassification.replace(/_/g, " ")}
                </span>
              )}
            </div>
            <h2 className="font-heading font-bold text-[16px] sm:text-[22px] text-[#E8EDD4] truncate leading-tight mt-0.5">
              {competition.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#1A230A] hover:bg-[#2D3C13] text-[#8CB34A] hover:text-[#E8EDD4] border border-[#2D3C13] flex items-center justify-center transition-colors shrink-0 cursor-pointer"
            aria-label="Close modal"
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-[#2D3C13] bg-[#111210]/60 px-4 sm:px-6 shrink-0">
          <button
            onClick={() => setActiveTab("competition")}
            className={`py-2.5 sm:py-3 px-3 sm:px-4 font-heading text-[12px] sm:text-[13px] font-semibold flex items-center gap-1.5 sm:gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === "competition"
                ? "border-[#8CB34A] text-[#8CB34A]"
                : "border-transparent text-[#72943A] hover:text-[#E8EDD4]"
            }`}
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
            </svg>
            <span>Competition Details</span>
          </button>

          <button
            onClick={() => setActiveTab("host")}
            className={`py-3 px-4 font-heading text-[13px] font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === "host"
                ? "border-[#8CB34A] text-[#8CB34A]"
                : "border-transparent text-[#72943A] hover:text-[#E8EDD4]"
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
            <span>Host Information</span>
            {host?.isVerified && (
              <span className="w-2 h-2 rounded-full bg-[#8CB34A]"></span>
            )}
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-6 flex flex-col gap-4 sm:gap-6 custom-scrollbar">
          {activeTab === "competition" ? (
            <>
              {/* SCHEDULE & TIMING (Requested feature: prominent Start and End Date & Time) */}
              <div className="bg-[#111210] border border-[#2D3C13] rounded-[12px] sm:rounded-[14px] p-3.5 sm:p-5 flex flex-col gap-2.5 sm:gap-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-semibold text-[12px] sm:text-[13px] text-[#8CB34A] uppercase tracking-wider flex items-center gap-1.5 sm:gap-2">
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.253 3.75m-18 0h18M4.5 7.5v12a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V7.5M4.5 7.5H19.5" />
                    </svg>
                    <span>Competition Schedule & Timings</span>
                  </h3>
                  <span className="font-sans text-[10px] sm:text-[11px] font-medium text-[#72943A] bg-[#1A230A] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-[6px] border border-[#2D3C13]">
                    Duration: <strong className="text-[#E8EDD4]">{durationText}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mt-0.5 sm:mt-1">
                  {/* Start Date & Time Box */}
                  <div className="p-3 sm:p-4 rounded-[10px] bg-[#161810] border border-[#2D3C13] flex flex-col gap-0.5 sm:gap-1">
                    <div className="flex items-center gap-1.5 sm:gap-2 text-[#8CB34A] text-[11px] sm:text-xs font-semibold uppercase tracking-wide">
                      <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#8CB34A] inline-block"></span>
                      <span>Starts On (Live Date & Time)</span>
                    </div>
                    <div className="font-heading font-bold text-[14px] sm:text-[16px] text-[#E8EDD4] mt-0.5 sm:mt-1">
                      {formatUkDate(startDate, "full")}
                    </div>
                    <div className="flex items-center gap-1.5 font-mono text-[13px] text-[#A0D056]">
                      <svg className="w-3.5 h-3.5 text-[#8CB34A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                      <span>
                        {formatUkTime(startDate, true)} (UK Time)
                      </span>
                    </div>
                  </div>

                  {/* End Date & Time (Draw Date) Box */}
                  <div className="p-4 rounded-[10px] bg-[#161810] border border-[#2D3C13] flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-[#F59E0B] text-xs font-semibold uppercase tracking-wide">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] inline-block"></span>
                      <span>Draw Ends On (Draw Date & Time)</span>
                    </div>
                    <div className="font-heading font-bold text-[16px] text-[#E8EDD4] mt-1">
                      {formatUkDate(endDate, "full")}
                    </div>
                    <div className="flex items-center gap-1.5 font-mono text-[13px] text-[#F59E0B]">
                      <svg className="w-3.5 h-3.5 text-[#F59E0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                      <span>
                        {formatUkTime(endDate, true)} (UK Time)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Draw Rules Row */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#2D3C13]/60 text-xs font-sans text-[#72943A]">
                  <span className="text-[#5A752A]">Draw Automation:</span>
                  <span className={`px-2 py-0.5 rounded text-[11px] ${competition.autoDrawDate ? "bg-[#8CB34A]/20 text-[#A0D056] border border-[#8CB34A]/30" : "bg-[#1A230A] text-[#72943A]"}`}>
                    Auto Draw on Date: {competition.autoDrawDate ? "Enabled" : "Disabled"}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[11px] ${competition.autoDrawSoldOut ? "bg-[#8CB34A]/20 text-[#A0D056] border border-[#8CB34A]/30" : "bg-[#1A230A] text-[#72943A]"}`}>
                    Auto Draw on Sold Out: {competition.autoDrawSoldOut ? "Enabled" : "Disabled"}
                  </span>
                  {competition.guaranteedDraw && (
                    <span className="px-2 py-0.5 rounded text-[11px] bg-[#D97706]/20 text-[#F59E0B] border border-[#D97706]/30">
                      ★ Guaranteed Draw
                    </span>
                  )}
                </div>
              </div>

              {/* IMAGE & QUICK STATS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Image */}
                <div className="md:col-span-1 rounded-[12px] bg-[#111210] border border-[#2D3C13] overflow-hidden flex items-center justify-center min-h-[170px] relative group">
                  {competition.mainImage ? (
                    <img
                      src={competition.mainImage}
                      alt={competition.title}
                      className="w-full h-full object-cover max-h-[220px]"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-6 text-center text-[#5A752A]">
                      <svg className="w-10 h-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                      </svg>
                      <span className="text-xs">No main image uploaded</span>
                    </div>
                  )}
                </div>

                {/* Key Metrics Grid */}
                <div className="md:col-span-2 grid grid-cols-2 gap-3">
                  <div className="bg-[#111210] border border-[#2D3C13] rounded-[10px] p-3.5 flex flex-col justify-between">
                    <span className="text-[11px] font-medium text-[#5A752A] uppercase tracking-wider">
                      Price Per Ticket
                    </span>
                    <span className="font-heading font-bold text-[20px] text-[#8CB34A] mt-1">
                      £{ticketPrice.toFixed(2)}
                    </span>
                  </div>

                  <div className="bg-[#111210] border border-[#2D3C13] rounded-[10px] p-3.5 flex flex-col justify-between">
                    <span className="text-[11px] font-medium text-[#5A752A] uppercase tracking-wider">
                      Total Tickets Available
                    </span>
                    <span className="font-heading font-bold text-[20px] text-[#E8EDD4] mt-1">
                      {totalTickets.toLocaleString()}
                    </span>
                  </div>

                  <div className="bg-[#111210] border border-[#2D3C13] rounded-[10px] p-3.5 flex flex-col justify-between">
                    <span className="text-[11px] font-medium text-[#5A752A] uppercase tracking-wider">
                      Max Potential Revenue
                    </span>
                    <span className="font-heading font-bold text-[20px] text-[#A0D056] mt-1">
                      £{potentialRevenue.toFixed(2)}
                    </span>
                  </div>

                  <div className="bg-[#111210] border border-[#2D3C13] rounded-[10px] p-3.5 flex flex-col justify-between">
                    <span className="text-[11px] font-medium text-[#5A752A] uppercase tracking-wider">
                      Tickets Per Entrant
                    </span>
                    <span className="font-heading font-medium text-[14px] text-[#E8EDD4] mt-1">
                      Min: <strong className="text-[#8CB34A]">{competition.minTickets || 1}</strong> · Max: <strong className="text-[#8CB34A]">{competition.maxTickets || "Unlimited"}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* FULL DESCRIPTION BOX */}
              <div className="bg-[#111210] border border-[#2D3C13] rounded-[14px] p-5 flex flex-col gap-2">
                <div className="flex items-center justify-between pb-2 border-b border-[#2D3C13]/60">
                  <h3 className="font-heading font-semibold text-[13px] text-[#8CB34A] uppercase tracking-wider">
                    Full Competition Description
                  </h3>
                  <span className="font-sans text-[11px] text-[#5A752A]">
                    {competition.description ? `${competition.description.length} characters` : "Empty"}
                  </span>
                </div>

                <div className="font-sans text-[13px] text-[#E8EDD4] leading-relaxed whitespace-pre-wrap max-h-[220px] overflow-y-auto pr-2 custom-scrollbar mt-1">
                  {competition.description || (
                    <span className="text-[#5A752A] italic">No description provided for this competition.</span>
                  )}
                </div>
              </div>

              {/* INSTANT WINS (if any) */}
              {competition.instantWins && competition.instantWins.length > 0 && (
                <div className="bg-[#111210] border border-[#2D3C13] rounded-[14px] p-5 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading font-semibold text-[13px] text-[#F59E0B] uppercase tracking-wider flex items-center gap-2">
                      <span>⚡ Instant Win Prizes</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#78350F]/70 text-[#F59E0B] text-[10px]">
                        {competition.instantWins.length} prizes
                      </span>
                    </h3>
                  </div>

                  <div className="max-h-[160px] overflow-y-auto custom-scrollbar border border-[#2D3C13] rounded-[8px]">
                    <table className="w-full text-left text-xs font-sans">
                      <thead className="bg-[#161810] text-[#5A752A] border-b border-[#2D3C13]">
                        <tr>
                          <th className="p-2.5">Ticket #</th>
                          <th className="p-2.5">Prize Name</th>
                          <th className="p-2.5 text-right">RRP Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#2D3C13]">
                        {competition.instantWins.map((iw) => (
                          <tr key={iw.id} className="hover:bg-[#1A230A]/50">
                            <td className="p-2.5 font-mono text-[#8CB34A]">#{iw.ticketNumber}</td>
                            <td className="p-2.5 text-[#E8EDD4] font-medium">{iw.prizeName}</td>
                            <td className="p-2.5 text-right text-[#A0D056]">
                              {iw.rrpValue ? `£${Number(iw.rrpValue).toFixed(2)}` : "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* HOST INFORMATION TAB */
            <div className="flex flex-col gap-5">
              {/* Host Quick Banner */}
              <div className="bg-[#111210] border border-[#2D3C13] rounded-[14px] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#1A230A] border-2 border-[#43581E] flex items-center justify-center shrink-0 overflow-hidden text-[#8CB34A] font-heading font-bold text-xl">
                    {hostAvatar ? (
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
                          ✓ Verified
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-[4px] bg-[#D97706]/20 border border-[#D97706]/40 text-[#F59E0B] font-heading font-semibold text-[10px] uppercase">
                          ⏳ Pending Review
                        </span>
                      )}
                    </div>
                    {hostUser && (
                      <span className="font-sans text-[12px] text-[#72943A] mt-0.5">
                        Operator: <strong className="text-[#E8EDD4] font-medium">{hostUser.firstName || ""} {hostUser.lastName || ""}</strong>
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-stretch sm:self-auto">
                  {onViewHostDetails && host && (
                    <button
                      onClick={() => onViewHostDetails(host)}
                      className="flex-1 sm:flex-none px-4 py-2 rounded-[8px] bg-[#1A230A] border border-[#2D3C13] hover:border-[#8CB34A] text-[#8CB34A] font-heading font-medium text-[12px] transition-colors cursor-pointer"
                    >
                      Audit Host Account
                    </button>
                  )}
                  {publicSlug && (
                    <Link
                      href={`/hosts/${publicSlug}`}
                      target="_blank"
                      className="flex-1 sm:flex-none px-4 py-2 rounded-[8px] bg-[#111210] border border-[#2D3C13] hover:bg-[#2D3C13] text-[#E8EDD4] font-heading font-medium text-[12px] flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>Public Profile</span>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>

              {/* Host Bio */}
              <div className="bg-[#111210] border border-[#2D3C13] rounded-[12px] p-4 flex flex-col gap-1.5">
                <span className="text-[11px] font-semibold text-[#5A752A] uppercase tracking-wider">
                  Host Bio / About
                </span>
                <p className="font-sans text-[13px] text-[#E8EDD4] leading-relaxed whitespace-pre-wrap">
                  {host?.bio || "No biography provided by this host yet."}
                </p>
              </div>

              {/* Host Quick Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[#111210] border border-[#2D3C13] rounded-[10px] p-3 flex flex-col">
                  <span className="text-[10px] text-[#5A752A] uppercase tracking-wider">Active Plan</span>
                  <span className="font-heading font-semibold text-sm text-[#A0D056] mt-0.5">
                    {host?.subscriptions?.[0]?.plan?.name || "Free"}
                  </span>
                </div>
                <div className="bg-[#111210] border border-[#2D3C13] rounded-[10px] p-3 flex flex-col">
                  <span className="text-[10px] text-[#5A752A] uppercase tracking-wider">Total Raffles</span>
                  <span className="font-heading font-semibold text-sm text-[#E8EDD4] mt-0.5">
                    {host?._count?.raffles ?? 0} Draws
                  </span>
                </div>
                <div className="bg-[#111210] border border-[#2D3C13] rounded-[10px] p-3 flex flex-col">
                  <span className="text-[10px] text-[#5A752A] uppercase tracking-wider">Wallet Balance</span>
                  <span className="font-heading font-semibold text-sm text-[#8CB34A] mt-0.5">
                    £{Number(host?.walletBalance || 0).toFixed(2)}
                  </span>
                </div>
                <div className="bg-[#111210] border border-[#2D3C13] rounded-[10px] p-3 flex flex-col">
                  <span className="text-[10px] text-[#5A752A] uppercase tracking-wider">Status</span>
                  <span className={`font-heading font-semibold text-sm mt-0.5 ${hostUser?.isBlocked ? "text-[#EF4444]" : "text-[#4ADE80]"}`}>
                    {hostUser?.isBlocked ? "Blocked" : "Active"}
                  </span>
                </div>
              </div>

              {/* Host Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#111210] border border-[#2D3C13] rounded-[12px] p-4 flex flex-col gap-3">
                  <h5 className="font-heading font-semibold text-xs text-[#8CB34A] uppercase tracking-wider border-b border-[#2D3C13] pb-2">
                    Contact & Address
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
                    <span className="text-[11px] text-[#5A752A]">Registered Address</span>
                    <span className="text-[#E8EDD4] font-sans text-xs">
                      {host?.address || "Not provided"}
                    </span>
                  </div>
                </div>

                <div className="bg-[#111210] border border-[#2D3C13] rounded-[12px] p-4 flex flex-col gap-3">
                  <h5 className="font-heading font-semibold text-xs text-[#8CB34A] uppercase tracking-wider border-b border-[#2D3C13] pb-2">
                    Business & Compliance
                  </h5>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] text-[#5A752A]">VAT / Business Reg Number</span>
                    <span className="text-[#E8EDD4] font-sans text-xs">
                      {host?.vatNumber || "Not registered"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] text-[#5A752A]">Host Profile ID</span>
                    <span className="text-[#72943A] font-mono text-[11px] truncate">
                      {host?.id || "N/A"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] text-[#5A752A]">Member Since</span>
                    <span className="text-[#E8EDD4] font-sans text-xs">
                      {host?.createdAt ? formatUkDate(host.createdAt) : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions - Always Sticky & Fully Visible on Mobile */}
        <div className="p-3 sm:p-4 bg-[#111210] border-t border-[#2D3C13] flex items-center justify-between gap-2 sm:gap-3 shrink-0 z-20 shadow-[0_-4px_16px_rgba(0,0,0,0.4)]">
          <button
            onClick={onClose}
            className="h-[38px] sm:h-[42px] px-3.5 sm:px-6 rounded-[8px] bg-[#1A230A] border border-[#2D3C13] hover:bg-[#2D3C13] text-[#E8EDD4] font-heading font-medium text-xs sm:text-sm transition-colors cursor-pointer shrink-0"
          >
            Close
          </button>

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={() => onReject(competition.id, competition.title)}
              disabled={isApproving}
              className="flex-1 sm:flex-none h-[38px] sm:h-[42px] px-3 sm:px-6 rounded-[8px] bg-transparent border border-[#7F1D1D] hover:bg-[#7F1D1D]/20 text-[#f76b6b] cursor-pointer font-heading font-medium text-xs sm:text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              Reject
            </button>
            <button
              onClick={() => onApprove(competition.id)}
              disabled={isApproving}
              className="flex-[2] sm:flex-none h-[38px] sm:h-[42px] px-3.5 sm:px-6 rounded-[8px] bg-[#8CB34A] hover:bg-[#A0D056] text-[#0D0D0B] font-heading font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_12px_rgba(140,179,74,0.25)] whitespace-nowrap"
            >
              {isApproving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-[#0D0D0B] border-t-transparent rounded-full animate-spin" />
                  <span>Approving...</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <span>Approve & Publish</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </>
  );
}
