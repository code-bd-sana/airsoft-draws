"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";

export interface RaffleDeleteTarget {
  id: string;
  title: string;
  category?: string;
  ticketsSold?: number;
  totalTickets?: number;
  host?: {
    user?: {
      firstName?: string;
      lastName?: string;
      email?: string;
    };
  };
}

interface ConfirmDeleteRaffleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  isLoading?: boolean;
  raffle: RaffleDeleteTarget | null;
}

export default function ConfirmDeleteRaffleModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  raffle,
}: ConfirmDeleteRaffleModalProps) {

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isLoading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  // Lock scroll when open
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

  if (typeof window === "undefined" || !isOpen || !raffle) return null;

  const hostName = raffle.host?.user?.firstName
    ? `${raffle.host.user.firstName} ${raffle.host.user.lastName || ""}`.trim()
    : null;
  const hostEmail = raffle.host?.user?.email || null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0D0D0B]/80 backdrop-blur-sm transition-opacity animate-fadeIn"
        onClick={!isLoading ? onClose : undefined}
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-[460px] bg-[#161810] border border-[#2D3C13] rounded-[20px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] z-10 animate-scaleUp overflow-hidden flex flex-col p-6 sm:p-8">
        
        {/* Close Button */}
        <button
          onClick={!isLoading ? onClose : undefined}
          disabled={isLoading}
          className="absolute top-5 right-5 text-[#5A752A] hover:text-[#E8EDD4] transition-colors p-1.5 rounded-lg hover:bg-[#1A230A] disabled:opacity-50 cursor-pointer"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Warning Icon Badge */}
        <div className="w-14 h-14 rounded-2xl bg-[#EF4444]/10 border border-[#EF4444]/25 flex items-center justify-center text-[#EF4444] mb-5 shadow-[0_0_20px_rgba(239,68,68,0.15)] shrink-0">
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
        </div>

        {/* Title & Subtitle */}
        <h2 className="font-heading font-bold text-[22px] text-[#E8EDD4] leading-snug mb-2">
          Delete Competition?
        </h2>
        <p className="font-sans text-[13px] text-[#72943A] leading-relaxed">
          Are you sure you want to delete this competition? This action <span className="text-[#EF4444] font-semibold">cannot be undone</span>.
        </p>

        {/* Competition Details Preview Card */}
        <div className="bg-[#0D0D0B] border border-[#2D3C13] rounded-[14px] p-4 my-5 flex flex-col gap-2.5">
          <div className="flex items-center justify-between gap-2">
            <span className="font-sans text-[10px] font-medium uppercase tracking-[1px] text-[#5A752A]">
              Target Competition
            </span>
            {raffle.category && (
              <span className="px-2 py-0.5 rounded-full bg-[#1A230A] border border-[#2D3C13] text-[#8CB34A] text-[10px] font-sans font-medium">
                {raffle.category}
              </span>
            )}
          </div>

          <h3 className="font-sans font-semibold text-[14px] text-[#E8EDD4] line-clamp-2 leading-snug">
            {raffle.title}
          </h3>

          {(hostName || hostEmail) && (
            <div className="flex items-center gap-1.5 font-sans text-[12px] text-[#72943A] truncate pt-1 border-t border-[#2D3C13]/60">
              <svg className="w-3.5 h-3.5 text-[#5A752A] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
              <span className="truncate">
                {hostName ? `${hostName}${hostEmail ? ` (${hostEmail})` : ""}` : hostEmail}
              </span>
            </div>
          )}

          {typeof raffle.ticketsSold !== "undefined" && typeof raffle.totalTickets !== "undefined" && (
            <div className="flex items-center justify-between text-[11px] text-[#5A752A] pt-1.5 font-sans">
              <span>Tickets Sold:</span>
              <span className="font-semibold text-[#E8EDD4]">
                {raffle.ticketsSold} / {raffle.totalTickets}
              </span>
            </div>
          )}
        </div>

        {/* Warning Callout Box */}
        <div className="bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-[10px] p-3 mb-6 flex items-start gap-2.5">
          <svg className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.007v.008H12v-.008zM12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z" />
          </svg>
          <p className="font-sans text-[12px] text-[#f76b6b] leading-tight">
            Deleting this competition will permanently remove all associated tickets, instant wins, and historical records.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 h-[44px] rounded-[10px] bg-transparent border border-[#2D3C13] hover:border-[#5A752A] hover:bg-[#1A230A] text-[#E8EDD4] font-heading font-medium text-[14px] transition-all flex items-center justify-center disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 h-[44px] rounded-[10px] bg-[#EF4444] hover:bg-[#DC2626] text-white font-heading font-bold text-[14px] shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Deleting...</span>
              </>
            ) : (
              <span>Yes, Delete</span>
            )}
          </button>
        </div>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
