"use client";

import React, { useState } from "react";
import { Winner, winnerService } from "../../../services/winner.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface VerifyWinnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  winner: Winner | null;
}

export default function VerifyWinnerModal({ isOpen, onClose, winner }: VerifyWinnerModalProps) {
  const queryClient = useQueryClient();
  const [isPublishing, setIsPublishing] = useState(true);

  const mutation = useMutation({
    mutationFn: () => winnerService.verifyWinner(winner!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminWinners'] });
      queryClient.invalidateQueries({ queryKey: ['adminWinnersStats'] });
      onClose();
    },
  });

  if (!isOpen || !winner) return null;

  const name = `${winner.user?.firstName || ''} ${winner.user?.lastName || ''}`.trim() || 'Unknown';

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
            disabled={mutation.isPending}
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
            {name} — Ticket #{winner.ticket?.ticketNumber || 'N/A'}
          </span>
        </div>

        {/* Toggle */}
        <div className="flex items-center justify-between mb-8">
          <span className="font-sans text-[13px] text-[#E8EDD4]">Publish to Public Winners Page</span>
          {/* Custom Toggle Switch */}
          <div 
            onClick={() => setIsPublishing(!isPublishing)}
            className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors flex items-center px-0.5 ${isPublishing ? 'bg-[#8CB34A]' : 'bg-[#2D3C13]'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-[#0D0D0B] absolute shadow-sm transform transition-transform ${isPublishing ? 'right-0.5' : 'left-0.5'}`} />
          </div>
        </div>

        {/* Submit Button */}
        <button 
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
          className="w-full h-[48px] rounded-[8px] bg-[#8CB34A] hover:bg-[#A0D056] text-[#0D0D0B] font-heading font-medium text-[14px] transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {mutation.isPending ? 'Verifying...' : 'Confirm & Publish'}
        </button>

      </div>
    </>
  );
}
