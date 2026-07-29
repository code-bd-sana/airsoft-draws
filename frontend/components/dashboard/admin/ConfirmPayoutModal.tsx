"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useUpdateWithdrawalStatusMutation } from "../../../hooks/useAdminHooks";

export interface AdminPayoutData {
  id: string;
  hostId: string;
  hostBusinessName: string;
  hostUserEmail: string;
  hostUserName: string;
  amount: number; // Gross amount requested
  feeAmount: number; // 10% platform fee
  netAmount: number; // 90% net payout
  status: string;
  payoutMethod: string;
  payoutDetails: any;
  adminNotes?: string;
  createdAt: string;
}

interface ConfirmPayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  payout: AdminPayoutData | null;
  actionType: "APPROVE" | "REJECT" | "VIEW";
}

export default function ConfirmPayoutModal({
  isOpen,
  onClose,
  payout,
  actionType,
}: ConfirmPayoutModalProps) {
  const [mounted, setMounted] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const updateStatusMutation = useUpdateWithdrawalStatusMutation();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !payout || !mounted) return null;

  const grossAmount = payout.amount || 0;
  const feeAmount = payout.feeAmount !== undefined ? payout.feeAmount : grossAmount * 0.10;
  const netAmount = payout.netAmount !== undefined ? payout.netAmount : grossAmount * 0.90;

  const handleConfirm = (newStatus: "APPROVED" | "COMPLETED" | "REJECTED") => {
    updateStatusMutation.mutate(
      {
        id: payout.id,
        status: newStatus,
        adminNotes: adminNotes.trim() || undefined,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  const renderPayoutAccountInfo = () => {
    const details = payout.payoutDetails || {};
    if (payout.payoutMethod === "PAYPAL") {
      return (
        <div>
          <span className="font-sans text-[12px] text-[#72943A] block">PayPal Email:</span>
          <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">{details.paypalEmail || "Not provided"}</span>
        </div>
      );
    }
    return (
      <div className="space-y-1">
        <div className="flex justify-between">
          <span className="font-sans text-[12px] text-[#72943A]">Account Holder:</span>
          <span className="font-sans font-medium text-[12px] text-[#E8EDD4]">{details.accountHolderName || "N/A"}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-sans text-[12px] text-[#72943A]">Bank Name:</span>
          <span className="font-sans font-medium text-[12px] text-[#E8EDD4]">{details.bankName || "N/A"}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-sans text-[12px] text-[#72943A]">Account Number / IBAN:</span>
          <span className="font-sans font-medium text-[12px] text-[#E8EDD4]">{details.accountNumber || "N/A"}</span>
        </div>
        {details.sortCode && (
          <div className="flex justify-between">
            <span className="font-sans text-[12px] text-[#72943A]">Sort Code / Routing:</span>
            <span className="font-sans font-medium text-[12px] text-[#E8EDD4]">{details.sortCode}</span>
          </div>
        )}
      </div>
    );
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      
      <div className="relative w-[90%] max-w-[540px] bg-[#161810] border border-[#2D3C13] rounded-[20px] shadow-2xl z-[10000] animate-fadeIn flex flex-col p-7 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#2D3C13]">
          <div>
            <h2 className="font-heading font-bold text-[20px] text-[#E8EDD4]">
              {actionType === "APPROVE" ? "Confirm Payout Approval" : actionType === "REJECT" ? "Reject Withdrawal Request" : "Payout Details"}
            </h2>
            <p className="font-sans text-[12px] text-[#72943A]">
              Request ID: {payout.id.substring(0, 13)}...
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-[#5A752A] hover:text-[#E8EDD4] transition-colors p-1 rounded-lg hover:bg-[#1A230A]"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Host Info */}
        <div className="bg-[#111210] border border-[#2D3C13] rounded-xl p-4 mb-5 space-y-1">
          <span className="font-sans text-[11px] font-medium text-[#5A752A] uppercase tracking-wider block">Host Business</span>
          <div className="flex justify-between items-center">
            <span className="font-heading font-bold text-[15px] text-[#E8EDD4]">{payout.hostBusinessName}</span>
            <span className="font-sans text-[12px] text-[#8CB34A]">{payout.hostUserEmail}</span>
          </div>
        </div>

        {/* Financial Breakdown (10% Commission) */}
        <div className="bg-[#111210] border border-[#2D3C13] rounded-xl p-4 mb-5 space-y-2.5">
          <span className="font-sans text-[11px] font-medium text-[#5A752A] uppercase tracking-wider block">Financial & Commission Breakdown</span>
          
          <div className="flex justify-between text-xs font-sans">
            <span className="text-[#72943A]">Gross Requested Amount:</span>
            <span className="font-medium text-[#E8EDD4]">£{grossAmount.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-xs font-sans text-[#F76B6B]">
            <span>Platform Commission (10%):</span>
            <span className="font-semibold">-£{feeAmount.toFixed(2)}</span>
          </div>

          <div className="pt-2 border-t border-[#2D3C13] flex justify-between text-sm font-bold font-sans">
            <span className="text-[#8CB34A]">Net Payout Sent to Host:</span>
            <span className="text-[#A0D056]">£{netAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Account Details */}
        <div className="bg-[#111210] border border-[#2D3C13] rounded-xl p-4 mb-5">
          <span className="font-sans text-[11px] font-medium text-[#5A752A] uppercase tracking-wider block mb-2">
            Payment Method: {payout.payoutMethod || 'Bank Transfer'}
          </span>
          {renderPayoutAccountInfo()}
        </div>

        {/* Optional Admin Note */}
        {actionType !== "VIEW" && (
          <div className="mb-6">
            <label className="block font-sans text-xs text-[#72943A] mb-1">Admin Notes / Reference (Optional)</label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="e.g. Bank transfer transaction ref #12345 or reason for rejection"
              rows={2}
              className="w-full p-3 bg-[#0D0D0B] border border-[#2D3C13] rounded-xl text-xs text-[#E8EDD4] focus:outline-none focus:border-[#8CB34A]"
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-[#2D3C13] text-xs font-sans font-semibold text-[#72943A] hover:bg-[#1A230A] transition-colors"
          >
            Close
          </button>

          {actionType === "APPROVE" && (
            <button 
              onClick={() => handleConfirm("APPROVED")}
              disabled={updateStatusMutation.isPending}
              className="px-6 py-2.5 rounded-xl bg-[#8CB34A] hover:bg-[#A0D056] text-[#0D0D0B] font-sans font-bold text-xs shadow-lg transition-colors disabled:opacity-50"
            >
              {updateStatusMutation.isPending ? "Processing..." : `Approve & Pay £${netAmount.toFixed(2)}`}
            </button>
          )}

          {actionType === "REJECT" && (
            <button 
              onClick={() => handleConfirm("REJECTED")}
              disabled={updateStatusMutation.isPending}
              className="px-6 py-2.5 rounded-xl bg-[#DC2626] hover:bg-red-600 text-white font-sans font-bold text-xs shadow-lg transition-colors disabled:opacity-50"
            >
              {updateStatusMutation.isPending ? "Processing..." : "Reject & Refund Host Wallet"}
            </button>
          )}
        </div>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
