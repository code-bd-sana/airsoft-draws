"use client";

import React from "react";

export interface OrderData {
  id: string;
  orderId: string;
  buyerName: string;
  buyerInitials: string;
  competition: string;
  tickets: number;
  amount: number;
  payment: string;
  status: string;
  date: string;
}

interface ProcessRefundModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderData | null;
}

export default function ProcessRefundModal({ isOpen, onClose, order }: ProcessRefundModalProps) {
  if (!isOpen || !order) return null;

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
            Process Refund
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

        {/* Order Info Box */}
        <div className="w-full bg-[#0D0D0B] border border-[#2D3C13] rounded-[8px] p-5 mb-6 flex flex-col gap-1">
          <span className="font-sans text-[12px] text-[#72943A]">Order #{order.orderId}</span>
          <span className="font-sans font-medium text-[15px] text-[#E8EDD4]">
            {order.buyerName} — £{order.amount.toFixed(2)}
          </span>
        </div>

        <div className="flex flex-col gap-5">
          {/* Refund Amount Input */}
          <div className="flex flex-col gap-2">
            <label className="font-sans text-[12px] font-medium text-[#72943A]">Refund Amount</label>
            <input 
              type="text" 
              defaultValue={order.amount.toFixed(2)}
              className="h-[44px] bg-[#0D0D0B] border border-[#2D3C13] rounded-[8px] px-4 text-[#E8EDD4] font-sans text-[13px] outline-none focus:border-[#43581E] transition-colors"
            />
          </div>

          {/* Reason Input */}
          <div className="flex flex-col gap-2 mb-2">
            <label className="font-sans text-[12px] font-medium text-[#72943A]">Reason</label>
            <input 
              type="text" 
              className="h-[44px] bg-[#0D0D0B] border border-[#2D3C13] rounded-[8px] px-4 text-[#E8EDD4] font-sans text-[13px] outline-none focus:border-[#43581E] transition-colors"
            />
          </div>

          {/* Submit Button */}
          <button 
            onClick={onClose}
            className="w-full h-[48px] rounded-[8px] bg-[#8CB34A] hover:bg-[#A0D056] text-[#0D0D0B] font-heading font-medium text-[14px] transition-colors flex items-center justify-center mt-2"
          >
            Process Refund
          </button>
        </div>

      </div>
    </>
  );
}
