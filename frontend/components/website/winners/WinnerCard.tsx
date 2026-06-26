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
  const { name, location, avatar, initials, prizeTitle, drawDate, ticketNumber } = winner;

  return (
    <div className="relative bg-[#161810] border border-border rounded-[14px] p-5 hover:border-border-medium hover:shadow-glow transition-all duration-300 w-full min-h-[185px]">
      
      {/* Top Header Block: Initials & User Details */}
      <div className="flex items-center gap-3 pr-24">
        {/* Initials Placeholder Circle */}
        <div className="w-11 h-11 rounded-full bg-accent-bg border border-border-medium flex items-center justify-center font-sans font-bold text-sm text-text-brand select-none shrink-0">
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

      {/* Horizontal Divider Line */}
      <div className="h-px bg-divider w-full my-4" />

      {/* Body Section: Prize Name & Draw Date */}
      <div className="flex flex-col justify-between pr-24">
        <div>
          <h3 className="font-heading font-normal text-sm text-text-primary line-clamp-1 leading-snug">
            {prizeTitle}
          </h3>
          <p className="font-sans text-[11px] text-text-muted mt-1 leading-normal">
            {drawDate}
          </p>
        </div>
      </div>

      {/* Bottom Row: Delivered status pill & ticket ref */}
      <div className="flex items-center justify-between mt-4 pr-24 sm:pr-0">
        {/* Verification Status Badge */}
        <div className="bg-[#0d2010] border border-[#16a34a] rounded-full px-3 py-1 flex items-center gap-1.5 w-fit">
          <span className="text-[10px] font-semibold text-[#4ade80] leading-none">
            ✓
          </span>
          <span className="text-[10px] font-semibold text-[#4ade80] leading-none uppercase tracking-wider">
            Delivered
          </span>
        </div>

        {/* Masked Ticket Reference Number (For transparency) */}
        <span className="font-sans text-[9px] text-text-muted/50 tracking-wider font-semibold mr-1">
          {ticketNumber}
        </span>
      </div>

      {/* User verified photo (Absolute positioning on the top-right corner) */}
      {avatar && (
        <div className="absolute right-5 top-5 w-20 h-20 rounded-[10px] border border-border overflow-hidden bg-surface shrink-0 shadow-sm select-none">
          <Image
            src={avatar}
            alt={`${name} winning photo`}
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
