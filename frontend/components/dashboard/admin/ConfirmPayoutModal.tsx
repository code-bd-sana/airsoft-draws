"use client";

import React from "react";

interface PayoutData {
  id: string;
  host: string;
  hostInitials: string;
  amount: string;
  method: string;
  account: string;
  date: string;
  status: string;
  earningsTotal: string;
  commission: string;
  netPayout: string;
}

interface ConfirmPayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  payout: PayoutData | null;
}

export default function ConfirmPayoutModal({ isOpen, onClose, payout }: ConfirmPayoutModalProps) {
  if (!isOpen || !payout) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-50 bg-[#0D0D0B]/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[500px] bg-[#161810] border border-[#2D3C13] rounded-[16px] shadow-2xl z-50 animate-fadeIn flex flex-col p-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading font-bold text-[20px] text-[#E8EDD4]">
            Confirm Payout
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

        {/* Details Grid */}
        <div className="flex flex-col gap-5 mb-8">
          <div className="flex items-center justify-between">
            <span className="font-sans text-[13px] text-[#72943A]">Host</span>
            <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">{payout.host}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-sans text-[13px] text-[#72943A]">Amount</span>
            <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">{payout.amount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-sans text-[13px] text-[#72943A]">Method</span>
            <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">{payout.method}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-sans text-[13px] text-[#72943A]">Account</span>
            <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">{payout.account}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-sans text-[13px] text-[#72943A]">Earnings Total</span>
            <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">{payout.earningsTotal}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-sans text-[13px] text-[#72943A]">Commission (10%)</span>
            <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">{payout.commission}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-sans text-[13px] text-[#72943A]">Net Payout</span>
            <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">{payout.netPayout}</span>
          </div>
        </div>

        {/* Submit Button */}
        <button 
          onClick={onClose}
          className="w-full h-[48px] rounded-[8px] bg-[#8CB34A] hover:bg-[#A0D056] text-[#0D0D0B] font-heading font-medium text-[14px] transition-colors flex items-center justify-center"
        >
          Confirm Payout
        </button>

      </div>
    </>
  );
}
