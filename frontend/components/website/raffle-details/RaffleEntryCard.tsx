"use client";

import React, { useState } from "react";
import TicketQuantitySelector from "./TicketQuantitySelector";
import { RaffleDetail } from "../../../types/raffle-details.types";
import { formatCurrency } from "../../../lib/utils";
import PrimaryButton from "../shared/PrimaryButton";

interface RaffleEntryCardProps {
  raffle: RaffleDetail;
}

/**
 * Checkout / Entry Panel Sidebar Card for raffle details page.
 * Implements real-time price calculations, progress bars, and social sharing links.
 */
export default function RaffleEntryCard({ raffle }: RaffleEntryCardProps) {
  const {
    ticketPrice,
    totalPoolValue,
    drawEndDate,
    hostName,
    soldTickets,
    totalTickets,
    remainingTickets,
    minimumTickets = 1,
    maximumTicketsPerOrder = 50,
  } = raffle;

  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);

  const soldPercent = Math.min(Math.round((soldTickets / totalTickets) * 100), 100);
  const totalPrice = quantity * ticketPrice;

  // Icons matching Figma layout
  const trophyIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      stroke="currentColor"
      className="w-3 h-3 text-[#72943a]"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 18.75h-9m9 0a3 3 0 0 1 3-3h.75a3 3 0 0 0 3-3v-1.5a3 3 0 0 0-3-3H20.25a3 3 0 0 1-3-3m0 13.5v-13.5M6 18.75a3 3 0 0 1-3-3h-.75a3 3 0 0 0-3 3v1.5a3 3 0 0 0 3 3H3.75a3 3 0 0 1 3-3m0 0v-13.5m-3.75 0h1.5a3 3 0 0 1 3 3M9.75 3h4.5"
      />
    </svg>
  );

  const clockIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="w-3.5 h-3.5 text-[#5a752a]"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  );

  const ticketIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="w-3.5 h-3.5 text-[#5a752a]"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-12h12c.621 0 1.125.504 1.125 1.125v1.757a1.5 1.5 0 0 0 0 2.236v1.757a1.5 1.5 0 0 0 0 2.236v1.757a1.5 1.5 0 0 0-1.125 1.125H7.5a1.125 1.125 0 0 1-1.125-1.125v-1.757a1.5 1.5 0 0 0 0-2.236V11.23a1.5 1.5 0 0 0 0-2.236V7.125A1.125 1.125 0 0 1 7.5 6Z"
      />
    </svg>
  );

  const userIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="w-3.5 h-3.5 text-[#5a752a]"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
      />
    </svg>
  );

  const shareIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      stroke="currentColor"
      className="w-3.5 h-3.5 text-[#5a752a]"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
      />
    </svg>
  );

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleEnterNow = () => {
    alert(`Mock checkout triggered for ${quantity} tickets! Total cost: ${formatCurrency(totalPrice)}`);
  };

  return (
    <div className="bg-[#0d0d0b] border border-border p-6 rounded-card w-full lg:max-w-[420px] xl:max-w-[450px] shadow-card font-sans">
      {/* Combined Prize Pool stats */}
      <div className="mb-4">
        <span className="text-[10px] font-semibold text-text-muted/65 tracking-widest uppercase block mb-1">
          Combined Prize Pool
        </span>
        <h2 className="font-heading font-bold text-3xl md:text-4xl text-[#8cb34a] tracking-tight">
          {formatCurrency(totalPoolValue, 0)}
        </h2>
        <div className="flex items-center gap-1.5 mt-1.5 text-xs text-[#72943a] font-medium">
          {trophyIcon}
          <span>Main {formatCurrency(raffle.worthPrice || 0, 0)} + {formatCurrency(totalPoolValue - (raffle.worthPrice || 0), 0)} instant wins</span>
        </div>
      </div>

      {/* Details list column */}
      <div className="border-t border-divider pt-4 pb-1.5 flex flex-col gap-3">
        {/* Draw End Count */}
        <div className="flex items-center justify-between text-xs text-text-muted">
          <span className="flex items-center gap-1.5">
            {clockIcon}
            <span>Draw</span>
          </span>
          <span className="font-heading font-semibold text-[#a0d056]">{drawEndDate}</span>
        </div>

        {/* Tickets Price */}
        <div className="flex items-center justify-between text-xs text-text-muted">
          <span className="flex items-center gap-1.5">
            {ticketIcon}
            <span>Tickets from</span>
          </span>
          <span className="font-heading font-semibold text-[#e8edd4]">
            {formatCurrency(ticketPrice)}
          </span>
        </div>

        {/* Host Name */}
        {hostName && (
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span className="flex items-center gap-1.5">
              {userIcon}
              <span>Host</span>
            </span>
            <span className="font-medium text-[#e8edd4]">{hostName}</span>
          </div>
        )}
      </div>

      {/* Progress bar container */}
      <div className="mt-4 mb-5 pt-3 border-t border-divider">
        <div className="w-full h-1.5 bg-[#1a230a] rounded-badge overflow-hidden">
          <div
            className="h-full bg-primary rounded-badge transition-all duration-500 ease-out"
            style={{ width: `${soldPercent}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[10px] text-text-muted mt-2 font-medium">
          <span>{remainingTickets.toLocaleString()} tickets left</span>
          <span>{soldPercent}% sold</span>
        </div>
      </div>

      {/* Quantity selection row */}
      <div className="mt-5 pt-2 border-t border-divider">
        <TicketQuantitySelector
          quantity={quantity}
          onQuantityChange={setQuantity}
          minTickets={minimumTickets}
          maxTickets={maximumTicketsPerOrder}
        />
      </div>

      {/* Total Price Display Box */}
      <div className="mt-4 pt-1">
        <div className="bg-[#0a0b07] border border-border px-3.5 py-2.5 rounded-button flex items-center justify-between">
          <span className="text-xs text-[#72943a] font-medium">
            Total ({quantity} {quantity === 1 ? "ticket" : "tickets"})
          </span>
          <span className="font-heading font-bold text-base text-[#8cb34a]">
            {formatCurrency(totalPrice)}
          </span>
        </div>
      </div>

      {/* Primary CTA Checkout button */}
      <div className="mt-4">
        <PrimaryButton
          onClick={handleEnterNow}
          className="w-full py-3.5 text-sm uppercase tracking-wider shadow-glow hover:scale-[1.01]"
        >
          Enter Now — {formatCurrency(totalPrice)}
        </PrimaryButton>
      </div>

      {/* Security compliance indicators */}
      <div className="text-center mt-3 mb-4 select-none">
        <span className="text-[10px] font-medium text-text-muted/40 uppercase tracking-wide">
          Secure checkout · Free postal entry available · 18+
        </span>
      </div>

      {/* Share Button Row */}
      <div className="border-t border-divider pt-4">
        <button
          onClick={handleShare}
          className="w-full border border-border hover:border-border-medium bg-transparent hover:bg-[#161810] text-[#5a752a] hover:text-text-primary px-4 py-2.5 rounded-button flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer font-heading text-xs font-semibold"
        >
          {shareIcon}
          <span>{copied ? "Link Copied!" : "Share this competition"}</span>
        </button>
      </div>
    </div>
  );
}
