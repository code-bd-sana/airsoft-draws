"use client";

import React from "react";

interface ConfirmBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  isBlocked: boolean;
  userIdentifier: string; // email, name or ID to display
}

export default function ConfirmBlockModal({ 
  isOpen, 
  onClose, 
  onConfirm,
  isLoading = false,
  isBlocked,
  userIdentifier
}: ConfirmBlockModalProps) {
  if (!isOpen) return null;

  const actionText = isBlocked ? "Unblock" : "Block";
  const actionColor = isBlocked ? "text-[#4ADE80]" : "text-[#f76b6b]";
  const buttonBg = isBlocked ? "bg-[#083b18] hover:bg-[#0a4a1f] border-[#4ADE80]/30" : "bg-[#7F1D1D] hover:bg-[#991b1b] border-[#EF4444]/30";
  const buttonText = isBlocked ? "text-[#4ADE80]" : "text-[#f76b6b]";

  return (
    <>
      <div 
        className="fixed inset-0 z-50 bg-[#0D0D0B]/80 backdrop-blur-sm transition-opacity" 
        onClick={!isLoading ? onClose : undefined} 
      />
      
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[400px] bg-[#161810] border border-[#2D3C13] rounded-[16px] shadow-2xl z-50 animate-fadeIn flex flex-col p-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading font-bold text-[20px] text-[#E8EDD4]">
            Confirm Action
          </h2>
          <button 
            onClick={!isLoading ? onClose : undefined}
            className="text-[#5A752A] hover:text-[#E8EDD4] transition-colors"
            disabled={isLoading}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-4 mb-8">
          <p className="font-sans text-[14px] text-[#E8EDD4] leading-relaxed">
            Are you sure you want to <strong className={actionColor}>{actionText.toLowerCase()}</strong> this user?
          </p>
          <div className="bg-[#111210] border border-[#2D3C13] rounded-[8px] p-4">
            <span className="font-sans text-[13px] text-[#72943A] block mb-1">User / Host:</span>
            <span className="font-sans font-medium text-[14px] text-[#E8EDD4] break-all">{userIdentifier}</span>
          </div>
          {isBlocked ? (
            <p className="font-sans text-[12px] text-[#72943A]">
              Unblocking will restore their access to the platform immediately.
            </p>
          ) : (
            <p className="font-sans text-[12px] text-[#72943A]">
              Blocking will immediately prevent them from logging in and accessing the platform.
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 h-[44px] rounded-[8px] bg-transparent border border-[#2D3C13] hover:border-[#5A752A] text-[#E8EDD4] font-heading font-medium text-[14px] transition-colors flex items-center justify-center disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 h-[44px] rounded-[8px] border font-heading font-medium text-[14px] transition-colors flex items-center justify-center disabled:opacity-50 ${buttonBg} ${buttonText}`}
          >
            {isLoading ? "Processing..." : `Yes, ${actionText}`}
          </button>
        </div>

      </div>
    </>
  );
}
