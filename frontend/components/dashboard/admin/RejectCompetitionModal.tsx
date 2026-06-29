"use client";

import React from "react";

interface RejectCompetitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  competitionData: { id: string; title: string } | null;
}

export default function RejectCompetitionModal({ isOpen, onClose, competitionData }: RejectCompetitionModalProps) {
  if (!isOpen || !competitionData) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-50 bg-[#0D0D0B]/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[560px] bg-[#161810] border border-[#2D3C13] rounded-[16px] shadow-2xl z-50 animate-fadeIn flex flex-col p-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-bold text-[20px] text-[#E8EDD4]">
            Reason for Rejection
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

        {/* Subtitle */}
        <div className="flex items-center gap-1.5 mb-6">
          <span className="font-sans text-[13px] text-[#72943A]">Rejecting:</span>
          <span className="font-sans text-[13px] text-[#E8EDD4]">{competitionData.title}</span>
        </div>

        {/* Textarea */}
        <div className="w-full mb-6">
          <textarea 
            rows={5}
            placeholder="Describe the issue and what the host should change before resubmitting..."
            className="w-full bg-[#0D0D0B] border border-[#2D3C13] rounded-[8px] p-4 text-[#E8EDD4] font-sans text-[13px] placeholder:text-[#5A752A] outline-none focus:border-[#43581E] resize-none transition-colors"
          />
        </div>

        {/* Button */}
        <button 
          onClick={onClose}
          className="w-full h-[48px] rounded-[8px] bg-[#8CB34A] hover:bg-[#A0D056] text-[#0D0D0B] font-heading font-medium text-[14px] transition-colors flex items-center justify-center"
        >
          Send Feedback & Request Changes
        </button>

      </div>
    </>
  );
}
