import React from "react";
import Image from "next/image";
import { Winner } from "../../../types/winner.types";

interface WinnerCardProps {
  winner: Winner;
}

/**
 * Renders a completed raffle winner record card with ticket and avatar details.
 */
export default function WinnerCard({ winner }: WinnerCardProps) {
  const {
    name,
    location,
    avatar,
    competitionImage,
    initials,
    prizeTitle,
    drawDate,
    ticketNumber,
    winnerType,
    status,
  } = winner;

  const displayImage = competitionImage || avatar;
  const isInstant = winnerType === "instant";

  const statusLabel =
    status === "delivered"
      ? "Delivered"
      : status === "shipped"
      ? "Dispatched"
      : "Verified";

  return (
    <div
      className={`relative bg-[#161810] border rounded-[14px] p-5 transition-all duration-300 w-full min-h-[200px] flex flex-col justify-between ${
        isInstant
          ? "border-[#EAB308]/40 hover:border-[#EAB308] hover:shadow-[0_0_15px_rgba(234,179,8,0.15)]"
          : "border-border hover:border-border-medium hover:shadow-glow"
      }`}
    >
      <div>
        {/* Top Header Block: Initials & User Details */}
        <div className="flex items-center justify-between gap-3 pr-24">
          <div className="flex items-center gap-3">
            {/* Initials Placeholder Circle */}
            <div className="w-10 h-10 rounded-full bg-accent-bg border border-border-medium flex items-center justify-center font-sans font-bold text-xs text-text-brand select-none shrink-0">
              {initials}
            </div>

            {/* Name & Location Details */}
            <div className="flex flex-col min-w-0">
              <span className="font-sans font-medium text-sm text-text-primary truncate">
                {name}
              </span>
              <span className="font-sans text-xs text-text-secondary truncate mt-0.5">
                {location}
              </span>
            </div>
          </div>
        </div>

        {/* Category Pill: Instant Win vs Main Draw */}
        <div className="mt-3 flex items-center gap-2">
          {isInstant ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EAB308]/15 border border-[#EAB308]/40 text-[#EAB308] text-[10px] font-bold uppercase tracking-wider">
              ⚡ Instant Win
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#4ADE80]/15 border border-[#4ADE80]/40 text-[#4ADE80] text-[10px] font-bold uppercase tracking-wider">
              🏆 Main Draw Winner
            </span>
          )}
        </div>

        {/* Horizontal Divider Line */}
        <div className="h-px bg-divider w-full my-3" />

        {/* Body Section: Prize Name & Draw Date */}
        <div className="pr-24">
          <h3 className="font-heading font-medium text-sm text-text-primary line-clamp-1 leading-snug">
            {prizeTitle}
          </h3>
          <p className="font-sans text-[11px] text-text-muted mt-1 leading-normal">
            Won on {drawDate}
          </p>
        </div>
      </div>

      {/* Bottom Row: Verification status pill & ticket ref */}
      <div className="flex items-center justify-between mt-4">
        <div className="bg-[#0d2010] border border-[#16a34a] rounded-full px-3 py-1 flex items-center gap-1.5 w-fit">
          <span className="text-[10px] font-semibold text-[#4ade80] leading-none">
            ✓
          </span>
          <span className="text-[10px] font-semibold text-[#4ade80] leading-none uppercase tracking-wider">
            {statusLabel}
          </span>
        </div>

        {/* Ticket Reference Number */}
        <span className="font-sans text-[10px] text-text-muted/70 tracking-wider font-mono font-bold">
          {ticketNumber}
        </span>
      </div>

      {/* Competition/Prize photo */}
      {displayImage && (
        <div className="absolute right-5 top-5 w-20 h-20 rounded-[10px] border border-border overflow-hidden bg-surface shrink-0 shadow-sm select-none">
          <Image
            src={displayImage}
            alt={`${prizeTitle} prize image`}
            fill
            sizes="80px"
            className="object-cover opacity-85 hover:opacity-100 transition-opacity duration-200"
            unoptimized
          />
        </div>
      )}
    </div>
  );
}
