"use client";

import React from "react";

interface WinnerData {
  id: string;
  name: string;
  initials: string;
  competition: string;
  ticketNum: string;
  drawDate: string;
  prizeValue: string;
  status: string;
}

interface VerifyWinnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  winner: WinnerData | null;
}

export default function VerifyWinnerModal({ isOpen, onClose, winner }: VerifyWinnerModalProps) {
  if (!isOpen || !winner) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-50 bg-[#0D0D0B]/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[500px] bg-[#161810] border border-[#2D3C13] rounded-[16px] shadow-2xl z-50 animate-fadeIn flex flex-col p-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading font-medium text-[20px] text-[#E8EDD4]">
            Verify & Publish Result
          </h2>
          <button 
            onClick={onClose}
            className="text-[#5A752A] hover:text-[#E8EDD4] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Winner Info Box */}
        <div className="w-full bg-[#0D0D0B] border border-[#2D3C13] rounded-[8px] p-5 mb-8 flex flex-col gap-1">
          <span className="font-sans text-[12px] text-[#72943A]">Winner</span>
          <span className="font-sans font-medium text-[15px] text-[#E8EDD4]">
            {winner.name} — Ticket {winner.ticketNum}
          </span>
        </div>

        {/* Toggle */}
        <div className="flex items-center justify-between mb-8">
          <span className="font-sans text-[13px] text-[#E8EDD4]">Publish to Public Winners Page</span>
          {/* Custom Toggle Switch */}
          <div className="w-10 h-5 rounded-full bg-[#8CB34A] relative cursor-pointer transition-colors flex items-center px-0.5">
            <div className="w-4 h-4 rounded-full bg-[#0D0D0B] absolute right-0.5 shadow-sm transform transition-transform" />
          </div>
        </div>

        {/* Submit Button */}
        <button 
          onClick={onClose}
          className="w-full h-[48px] rounded-[8px] bg-[#8CB34A] hover:bg-[#A0D056] text-[#0D0D0B] font-heading font-medium text-[14px] transition-colors flex items-center justify-center"
        >
          Confirm & Publish
        </button>

      </div>
    </>
  );
}
