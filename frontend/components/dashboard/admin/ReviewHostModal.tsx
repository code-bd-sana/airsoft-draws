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
  isVerified?: boolean;
}

interface ReviewHostModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: HostApplicationData | null;
  onApprove?: (hostId: string) => void;
  isApproveLoading?: boolean;
  onReject?: (hostId: string) => void;
  isRejectLoading?: boolean;
}

export default function ReviewHostModal({ 
  isOpen, 
  onClose, 
  data, 
  onApprove, 
  isApproveLoading,
  onReject,
  isRejectLoading
}: ReviewHostModalProps) {
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
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-10">
          {!data.isVerified && onApprove && (
            <button 
              onClick={() => onApprove(data.id)}
              disabled={isApproveLoading || isRejectLoading}
              className="w-full h-[48px] rounded-[8px] bg-[#8CB34A] hover:bg-[#a1cf52] text-[#111210] font-heading font-medium text-[15px] transition-all hover:scale-[1.02] active:scale-[0.98] duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isApproveLoading ? (
                <div className="w-5 h-5 border-2 border-[#111210] border-t-transparent rounded-full animate-spin" />
              ) : (
                "Approve Host"
              )}
            </button>
          )}
          {!data.isVerified && onReject && (
            <button 
              onClick={() => onReject(data.id)}
              disabled={isApproveLoading || isRejectLoading}
              className="w-full h-[48px] rounded-[8px] bg-[#EF4444]/10 border border-[#EF4444]/30 hover:bg-[#EF4444] text-[#EF4444] hover:text-[#111210] font-heading font-medium text-[15px] transition-all hover:scale-[1.02] active:scale-[0.98] duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isRejectLoading ? (
                <div className="w-5 h-5 border-2 border-[#EF4444] border-t-transparent rounded-full animate-spin" />
              ) : (
                "Reject Host"
              )}
            </button>
          )}
          <button 
            onClick={onClose}
            className="w-full h-[48px] rounded-[8px] bg-[#1A230A] border border-[#2D3C13] hover:bg-[#2D3C13] text-[#E8EDD4] font-heading font-medium text-[15px] transition-all duration-200 cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </>
  );
}
