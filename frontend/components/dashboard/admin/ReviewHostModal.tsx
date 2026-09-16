"use client";

import React from "react";
import Link from "next/link";
import { HostData } from "../../../services/admin.service";

interface ReviewHostModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: HostData | null;
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
  isRejectLoading,
}: ReviewHostModalProps) {
  if (!isOpen || !data) return null;

  const initials = data.businessName
    ? data.businessName.substring(0, 2).toUpperCase()
    : "HO";

  const hostLogo = data.logoUrl || data.avatarUrl;
  const hostBanner = data.bannerUrl;

  const ownerFullName = [data.firstName, data.lastName].filter(Boolean).join(" ");
  const formattedDate = data.createdAt
    ? new Date(data.createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "N/A";

  const publicProfileSlug = data.slug || data.id;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-[#0D0D0B]/85 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Container */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[720px] max-h-[92vh] bg-[#161810] border border-[#2D3C13] rounded-[20px] shadow-2xl z-50 animate-fadeIn flex flex-col overflow-hidden">
        
        {/* Banner Area */}
        <div className="relative w-full h-[150px] sm:h-[180px] bg-[#111210] border-b border-[#2D3C13] shrink-0 overflow-hidden select-none">
          {hostBanner ? (
            <img
              src={hostBanner}
              alt={`${data.businessName} Banner`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-[#141c08] via-[#1f2a0b] to-[#111210] flex items-center justify-center relative">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#8CB34A_1px,transparent_1px)] [background-size:16px_16px]" />
              <span className="text-[#5A752A] font-heading text-xs uppercase tracking-widest font-semibold">
                Airsoft Draws Verified Host
              </span>
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#161810] via-transparent to-black/40 pointer-events-none" />

          {/* Close Button Top Right */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/60 hover:bg-black text-[#E8EDD4] border border-[#2D3C13] flex items-center justify-center transition-all duration-200 z-10 cursor-pointer"
            aria-label="Close modal"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Profile Header (Overlapping Avatar & Titles) */}
        <div className="px-6 sm:px-8 pt-0 pb-4 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-12 sm:-mt-14 relative z-10">
          <div className="flex items-end gap-4">
            {/* Logo / Avatar */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#1A230A] border-4 border-[#161810] shadow-xl flex items-center justify-center shrink-0 overflow-hidden">
              {hostLogo ? (
                <img
                  src={hostLogo}
                  alt={`${data.businessName} Logo`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-heading font-bold text-2xl sm:text-3xl text-[#8CB34A]">
                  {initials}
                </span>
              )}
            </div>

            {/* Name and Contact Title */}
            <div className="flex flex-col pb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-heading font-bold text-xl sm:text-2xl text-[#E8EDD4] tracking-tight">
                  {data.businessName || "Unnamed Host"}
                </h2>
                {data.isVerified ? (
                  <span className="px-2 py-0.5 rounded-[4px] bg-[#8CB34A] text-[#0D0D0B] font-heading font-bold text-[10px] uppercase tracking-wide">
                    ✓ Verified
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-[4px] bg-[#D97706]/20 border border-[#D97706]/40 text-[#F59E0B] font-heading font-semibold text-[10px] uppercase tracking-wide">
                    ⏳ Pending Review
                  </span>
                )}
              </div>
              {ownerFullName && (
                <span className="font-sans text-xs text-[#72943A]">
                  Operator: <strong className="text-[#E8EDD4] font-medium">{ownerFullName}</strong>
                </span>
              )}
            </div>
          </div>

          {/* Public Profile Link */}
          <Link
            href={`/hosts/${publicProfileSlug}`}
            target="_blank"
            className="px-3.5 py-1.5 rounded-[8px] bg-[#1A230A] border border-[#2D3C13] hover:border-[#8CB34A] text-[#8CB34A] hover:text-[#A0D056] font-sans text-xs font-semibold flex items-center gap-1.5 transition-all self-stretch sm:self-auto justify-center"
          >
            <span>View Public Page</span>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </Link>
        </div>

        {/* Scrollable Body Content */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-4 flex flex-col gap-6 font-sans text-xs sm:text-sm custom-scrollbar">
          
          {/* Bio Box */}
          <div className="bg-[#111210] border border-[#2D3C13] rounded-[12px] p-4 flex flex-col gap-2">
            <span className="text-[11px] font-semibold text-[#5A752A] uppercase tracking-wider">
              Host Bio & Description
            </span>
            <p className="text-[#E8EDD4] leading-relaxed whitespace-pre-wrap">
              {data.bio || "No description provided by this host yet."}
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#111210] border border-[#2D3C13] rounded-[10px] p-3 flex flex-col">
              <span className="text-[10px] text-[#5A752A] uppercase tracking-wider">Active Plan</span>
              <span className="font-heading font-semibold text-sm text-[#A0D056] mt-0.5">{data.plan || "Free"}</span>
            </div>
            <div className="bg-[#111210] border border-[#2D3C13] rounded-[10px] p-3 flex flex-col">
              <span className="text-[10px] text-[#5A752A] uppercase tracking-wider">Total Raffles</span>
              <span className="font-heading font-semibold text-sm text-[#E8EDD4] mt-0.5">{data.raffles ?? 0} Draws</span>
            </div>
            <div className="bg-[#111210] border border-[#2D3C13] rounded-[10px] p-3 flex flex-col">
              <span className="text-[10px] text-[#5A752A] uppercase tracking-wider">Wallet Balance</span>
              <span className="font-heading font-semibold text-sm text-[#8CB34A] mt-0.5">£{(data.walletBalance ?? data.revenue ?? 0).toFixed(2)}</span>
            </div>
            <div className="bg-[#111210] border border-[#2D3C13] rounded-[10px] p-3 flex flex-col">
              <span className="text-[10px] text-[#5A752A] uppercase tracking-wider">Status</span>
              <span className={`font-heading font-semibold text-sm mt-0.5 ${data.isBlocked ? "text-[#EF4444]" : "text-[#4ADE80]"}`}>
                {data.isBlocked ? "Blocked" : "Active"}
              </span>
            </div>
          </div>

          {/* Detailed Info 2-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Column 1: Contact & Identity */}
            <div className="bg-[#111210] border border-[#2D3C13] rounded-[12px] p-4 flex flex-col gap-3">
              <h3 className="font-heading font-semibold text-xs text-[#8CB34A] uppercase tracking-wider border-b border-[#2D3C13] pb-2">
                Contact & Identity
              </h3>

              <div className="flex flex-col gap-1">
                <span className="text-[11px] text-[#5A752A]">Email Address</span>
                <div className="flex items-center gap-2">
                  <span className="text-[#E8EDD4] font-medium">{data.email}</span>
                  {data.isEmailVerified && (
                    <span className="text-[10px] text-[#4ADE80] font-semibold bg-[#4ADE80]/10 px-1.5 py-0.2 rounded">
                      Verified
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[11px] text-[#5A752A]">Phone Number</span>
                <span className="text-[#E8EDD4]">{data.phone || "Not provided"}</span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[11px] text-[#5A752A]">Address / Location</span>
                <span className="text-[#E8EDD4]">{data.address || "Not provided"}</span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[11px] text-[#5A752A]">VAT / Business Number</span>
                <span className="text-[#E8EDD4]">{data.vatNumber || "Not registered"}</span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[11px] text-[#5A752A]">Member Since</span>
                <span className="text-[#E8EDD4]">{formattedDate}</span>
              </div>
            </div>

            {/* Column 2: Banking & Payouts */}
            <div className="bg-[#111210] border border-[#2D3C13] rounded-[12px] p-4 flex flex-col gap-3">
              <h3 className="font-heading font-semibold text-xs text-[#8CB34A] uppercase tracking-wider border-b border-[#2D3C13] pb-2">
                Banking & Payout Details
              </h3>

              <div className="flex flex-col gap-1">
                <span className="text-[11px] text-[#5A752A]">Bank Account Name</span>
                <span className="text-[#E8EDD4] font-medium">{data.bankAccountName || "Not provided"}</span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[11px] text-[#5A752A]">Sort Code</span>
                <span className="text-[#E8EDD4] tracking-wider font-mono">{data.sortCode || "Not provided"}</span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[11px] text-[#5A752A]">Account Number</span>
                <span className="text-[#E8EDD4] tracking-wider font-mono">{data.accountNumber || "Not provided"}</span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[11px] text-[#5A752A]">Host Profile ID</span>
                <span className="text-[#72943A] font-mono text-[11px] truncate">{data.id}</span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[11px] text-[#5A752A]">User Account ID</span>
                <span className="text-[#72943A] font-mono text-[11px] truncate">{data.userId}</span>
              </div>
            </div>

          </div>

        </div>

        {/* Modal Action Footer */}
        <div className="p-4 sm:p-6 bg-[#111210] border-t border-[#2D3C13] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            {!data.isVerified && onApprove && (
              <button
                onClick={() => onApprove(data.id)}
                disabled={isApproveLoading || isRejectLoading}
                className="h-[42px] px-6 rounded-[8px] bg-[#8CB34A] hover:bg-[#a1cf52] text-[#111210] font-heading font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isApproveLoading ? (
                  <div className="w-4 h-4 border-2 border-[#111210] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span>Approve Host</span>
                  </>
                )}
              </button>
            )}

            {!data.isVerified && onReject && (
              <button
                onClick={() => onReject(data.id)}
                disabled={isApproveLoading || isRejectLoading}
                className="h-[42px] px-5 rounded-[8px] bg-[#EF4444]/15 border border-[#EF4444]/40 hover:bg-[#EF4444] text-[#EF4444] hover:text-[#111210] font-heading font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isRejectLoading ? (
                  <div className="w-4 h-4 border-2 border-[#EF4444] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Reject</span>
                  </>
                )}
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="h-[42px] px-6 rounded-[8px] bg-[#1A230A] border border-[#2D3C13] hover:bg-[#2D3C13] text-[#E8EDD4] font-heading font-medium text-sm transition-all duration-200 cursor-pointer ml-auto"
          >
            Close
          </button>
        </div>

      </div>
    </>
  );
}
