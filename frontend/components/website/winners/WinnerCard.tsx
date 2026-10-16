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
  const { name, location, avatar, competitionImage, initials, prizeTitle, drawDate, ticketNumber } = winner;
  const displayImage = competitionImage || avatar;

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
          {location && location !== "Unknown Location" && location !== "Unknown" && (
            <span className="font-sans text-xs text-text-secondary truncate mt-0.5">
              {location}
            </span>
          )}
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

      {/* Bottom Row: Ticket Badge & Win Type */}
      {ticketNumber && (
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#2D3C13]/60">
          <div className="flex items-center gap-1.5 text-[11px] text-[#72943A] font-medium leading-none">
            <svg className="w-3.5 h-3.5 text-[#4ADE80] shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
            </svg>
            <span>{winner.winnerType === "instant" ? "Instant Win" : "Verified Draw"}</span>
          </div>

          <div className="inline-flex items-center gap-2 h-7 pl-1.5 pr-3 rounded-full bg-[#083B18] border border-[#4ADE80]/40 text-[#4ADE80] shadow-[0_0_12px_rgba(74,222,128,0.2)]">
            <div className="w-5 h-5 rounded-full bg-[#4ADE80]/15 flex items-center justify-center shrink-0">
              <svg className="w-3 h-3 text-[#4ADE80]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                <line x1="12" y1="5" x2="12" y2="7" />
                <line x1="12" y1="11" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12" y2="19" />
              </svg>
            </div>
            <span className="font-mono font-bold text-xs tracking-wider text-[#4ADE80] leading-none select-none">
              Ticket #{ticketNumber.replace(/^#/, "")}
            </span>
          </div>
        </div>
      )}

      {/* Competition/Prize photo (Absolute positioning on the top-right corner) */}
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
