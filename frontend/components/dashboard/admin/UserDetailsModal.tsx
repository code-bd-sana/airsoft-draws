"use client";

import React from "react";
import { format } from "date-fns";
import { User } from "../../../services/admin.service";

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export default function UserDetailsModal({ isOpen, onClose, user }: UserDetailsModalProps) {
  if (!isOpen || !user) return null;

  const getInitials = () => {
    if (user.firstName && user.lastName) return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    if (user.firstName) return user.firstName[0].toUpperCase();
    return user.email[0].toUpperCase();
  };

  return (
    <>
      {/* Backdrop blur overlay */}
      <div 
        className="fixed inset-0 z-50 bg-[#0D0D0B]/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      
      {/* Modal Container */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[560px] bg-[#161810] border border-[#2D3C13] rounded-[16px] shadow-2xl z-50 animate-fadeIn flex flex-col p-8 font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading font-medium text-[20px] text-[#E8EDD4]">
            User Information
          </h2>
          <button 
            onClick={onClose}
            className="text-[#72943A] hover:text-[#E8EDD4] hover:scale-110 active:scale-90 transition-all duration-150 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Profile Card Section */}
        <div className="flex items-center gap-4 p-4 bg-[#0D0D0B] border border-[#2D3C13] rounded-[12px] mb-6">
          <div className="w-16 h-16 rounded-full bg-[#1A230A] border-2 border-[#8CB34A] flex items-center justify-center shrink-0 shadow-lg">
            <span className="font-sans font-bold text-[22px] text-[#8CB34A] tracking-wider">
              {getInitials()}
            </span>
          </div>
          <div className="flex flex-col gap-1 overflow-hidden">
            <h3 className="font-sans font-bold text-[16px] text-[#E8EDD4] truncate">
              {user.firstName ? `${user.firstName} ${user.lastName || ""}` : "No Name Provided"}
            </h3>
            <span className="font-sans text-[12px] text-[#72943A] truncate">{user.email}</span>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="px-2 py-0.5 rounded-full border border-[#2D3C13] bg-[#161810] text-[#8CB34A] font-sans font-medium text-[9px] uppercase tracking-wider">
                {user.role}
              </span>
              {user.isEmailVerified ? (
                <span className="px-2 py-0.5 rounded-full border border-[#16A34A]/30 bg-[#14532D]/40 text-[#4ADE80] font-sans font-medium text-[9px] uppercase tracking-wider">
                  Verified
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full border border-[#D97706]/30 bg-[#78350F]/40 text-[#F59E0B] font-sans font-medium text-[9px] uppercase tracking-wider">
                  Unverified
                </span>
              )}
            </div>
          </div>
        </div>

        {/* User stats grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-[#1A230A]/20 border border-[#2D3C13]/60 rounded-[12px] p-4 flex flex-col gap-1">
            <span className="font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-wider">Tickets Purchased</span>
            <span className="font-heading font-bold text-[20px] text-[#E8EDD4]">{user.ticketsCount}</span>
          </div>
          <div className="bg-[#1A230A]/20 border border-[#2D3C13]/60 rounded-[12px] p-4 flex flex-col gap-1">
            <span className="font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-wider">Total Spent</span>
            <span className="font-heading font-bold text-[20px] text-[#E8EDD4]">£{user.totalSpent.toFixed(2)}</span>
          </div>
        </div>

        {/* Info list */}
        <div className="flex flex-col gap-4 font-sans text-[13px] border-t border-[#2D3C13] pt-6 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-[#72943A] font-medium">Joined Date</span>
            <span className="text-[#E8EDD4]">{format(new Date(user.createdAt), "dd MMMM yyyy HH:mm")}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#72943A] font-medium">Phone Number</span>
            <span className="text-[#E8EDD4]">{user.phone || "Not provided"}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#72943A] font-medium">Location</span>
            <span className="text-[#E8EDD4]">{user.location || "Not provided"}</span>
          </div>

          <div className="flex items-start justify-between">
            <span className="text-[#72943A] font-medium shrink-0">Address</span>
            <span className="text-[#E8EDD4] text-right max-w-[280px] line-clamp-3">{user.address || "Not provided"}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#72943A] font-medium">Status</span>
            <span>
              {user.isBlocked ? (
                <span className="px-2.5 py-0.5 rounded-full border border-[#EF4444]/30 bg-[#7F1D1D] text-[#f76b6b] font-medium text-[10px]">Blocked / Suspended</span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full border border-[#4ADE80]/30 bg-[#083b18] text-[#4ADE80] font-medium text-[10px]">Active / Operational</span>
              )}
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center mt-4">
          <button 
            onClick={onClose}
            className="w-full h-[48px] rounded-[8px] bg-[#1A230A] border border-[#2D3C13] hover:bg-[#2D3C13] text-[#E8EDD4] font-heading font-medium text-[15px] transition-all hover:scale-[1.01] active:scale-[0.99] duration-150 cursor-pointer"
          >
            Close Details
          </button>
        </div>

      </div>
    </>
  );
}
