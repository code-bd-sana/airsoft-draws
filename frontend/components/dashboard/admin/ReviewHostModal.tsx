"use client";

import React from "react";

export interface HostApplicationData {
  id: string;
  brandName: string;
  email: string;
  bio: string;
  contact: string;
  payoutMethod: string;
  social: string;
}

interface ReviewHostModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: HostApplicationData | null;
}

export default function ReviewHostModal({ isOpen, onClose, data }: ReviewHostModalProps) {
  if (!isOpen || !data) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-50 bg-[#0D0D0B]/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[560px] bg-[#161810] border border-[#2D3C13] rounded-[16px] shadow-2xl z-50 animate-fadeIn flex flex-col p-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading font-medium text-[20px] text-[#E8EDD4]">
            Host Details
          </h2>
          <button 
            onClick={onClose}
            className="text-[#72943A] hover:text-[#E8EDD4] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Details */}
        <div className="flex flex-col gap-6 font-sans">
          
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-medium text-[#72943A]">Brand Name</span>
            <span className="text-[14px] text-[#E8EDD4]">{data.brandName}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[14px] font-medium text-[#72943A]">Email</span>
            <span className="text-[14px] text-[#E8EDD4]">{data.email}</span>
          </div>

          <div className="flex items-start justify-between">
            <span className="text-[14px] font-medium text-[#72943A]">Bio</span>
            <span className="text-[14px] text-[#E8EDD4] text-right max-w-[300px]">{data.bio}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[14px] font-medium text-[#72943A]">Contact</span>
            <span className="text-[14px] text-[#E8EDD4]">{data.contact}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[14px] font-medium text-[#72943A]">Payout Method</span>
            <span className="text-[14px] text-[#E8EDD4]">{data.payoutMethod}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[14px] font-medium text-[#72943A]">Social</span>
            <span className="text-[14px] text-[#E8EDD4]">{data.social}</span>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-4 mt-10">
          <button 
            onClick={onClose}
            className="w-full h-[48px] rounded-[8px] bg-[#1A230A] border border-[#2D3C13] hover:bg-[#2D3C13] text-[#E8EDD4] font-heading font-medium text-[15px] transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </>
  );
}
