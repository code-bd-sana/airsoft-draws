"use client";

import React, { useState } from "react";
import ConfirmPayoutModal, { AdminPayoutData } from "./ConfirmPayoutModal";
import { useAdminWithdrawals } from "../../../hooks/useAdminHooks";

interface WithdrawalsTableProps {
  withdrawals?: AdminPayoutData[];
  isLoading?: boolean;
}

export default function WithdrawalsTable({ withdrawals: propWithdrawals, isLoading: propIsLoading }: WithdrawalsTableProps) {
  const { data: fetchedWithdrawals, isLoading: isQueryLoading } = useAdminWithdrawals();
  
  const withdrawals: AdminPayoutData[] = propWithdrawals || fetchedWithdrawals || [];
  const isLoading = propIsLoading !== undefined ? propIsLoading : isQueryLoading;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState<AdminPayoutData | null>(null);
  const [actionType, setActionType] = useState<"APPROVE" | "REJECT" | "VIEW">("APPROVE");

  const handleAction = (payout: AdminPayoutData, type: "APPROVE" | "REJECT" | "VIEW") => {
    setSelectedPayout(payout);
    setActionType(type);
    setIsModalOpen(true);
  };

  const getStatusStyle = (status: string) => {
    const s = status.toUpperCase();
    switch (s) {
      case "APPROVED":
      case "COMPLETED":
      case "PAID":
        return "border-[#4ADE80]/30 bg-[#083b18] text-[#4ADE80]";
      case "PENDING":
      case "PROCESSING":
        return "border-[#D97706]/30 bg-[#78350F] text-[#F59E0B]";
      case "REJECTED":
      case "FAILED":
        return "border-[#DC2626]/30 bg-[#7f1d1d] text-[#EF4444]";
      default:
        return "border-[#2D3C13] bg-[#111210] text-[#72943A]";
    }
  };

  if (isLoading) {
    return (
      <div className="w-full bg-[#161810] border border-[#2D3C13] rounded-[16px] p-8 text-center text-[#8CB34A] font-sans text-sm animate-pulse">
        Loading withdrawal requests...
      </div>
    );
  }

  return (
    <div className="w-full bg-[#161810] border border-[#2D3C13] rounded-[16px] overflow-hidden overflow-x-auto mt-2 animate-fadeIn">
      <table className="w-full min-w-[1100px] text-left border-collapse">
        <thead>
          <tr className="border-b border-[#2D3C13] bg-[#111210]">
            <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px]">HOST BUSINESS</th>
            <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] text-center">REQUESTED GROSS</th>
            <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] text-center">FEE (10%)</th>
            <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] text-center">NET PAYOUT</th>
            <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] text-center">PAYMENT METHOD</th>
            <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] text-center">REQUEST DATE</th>
            <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] text-center">STATUS</th>
            <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] text-right">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {withdrawals.length === 0 ? (
            <tr>
              <td colSpan={8} className="py-12 text-center text-[#72943A] font-sans text-sm">
                No withdrawal requests found.
              </td>
            </tr>
          ) : (
            withdrawals.map((payout, i) => {
              const grossAmount = payout.amount || 0;
              const feeAmount = payout.feeAmount !== undefined ? payout.feeAmount : grossAmount * 0.10;
              const netAmount = payout.netAmount !== undefined ? payout.netAmount : grossAmount * 0.90;
              const dateStr = payout.createdAt ? new Date(payout.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A';

              return (
                <tr key={payout.id} className={`${i !== withdrawals.length - 1 ? 'border-b border-[#2D3C13]' : ''} hover:bg-[#1A230A] transition-colors`}>
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="font-heading font-medium text-[14px] text-[#E8EDD4]">{payout.hostBusinessName || 'Unknown Host'}</span>
                      <span className="font-sans text-[11px] text-[#72943A]">{payout.hostUserEmail}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center font-heading font-semibold text-[14px] text-[#E8EDD4]">
                    £{grossAmount.toFixed(2)}
                  </td>
                  <td className="py-4 px-6 text-center font-heading font-medium text-[13px] text-[#F76B6B]">
                    -£{feeAmount.toFixed(2)}
                  </td>
                  <td className="py-4 px-6 text-center font-heading font-bold text-[14px] text-[#8CB34A]">
                    £{netAmount.toFixed(2)}
                  </td>
                  <td className="py-4 px-6 text-center font-sans text-[13px] text-[#72943A]">
                    {payout.payoutMethod || 'Bank Transfer'}
                  </td>
                  <td className="py-4 px-6 text-center font-sans text-[12px] text-[#72943A]">
                    {dateStr}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`px-3 py-1 rounded-full border font-sans font-medium text-[10px] uppercase tracking-wider ${getStatusStyle(payout.status)}`}>
                      {payout.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {payout.status.toUpperCase() === "PENDING" ? (
                        <>
                          <button 
                            onClick={() => handleAction(payout, "APPROVE")}
                            className="h-[28px] px-3 rounded-[6px] bg-[#8CB34A]/10 border border-[#8CB34A] text-[#8CB34A] hover:bg-[#8CB34A] hover:text-[#0D0D0B] font-heading font-medium text-[11px] transition-colors"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleAction(payout, "REJECT")}
                            className="h-[28px] px-3 rounded-[6px] bg-red-950/20 border border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444] hover:text-white font-heading font-medium text-[11px] transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      ) : null}
                      <button 
                        onClick={() => handleAction(payout, "VIEW")}
                        title="View Details"
                        className="p-1.5 rounded-lg text-[#5A752A] hover:text-[#E8EDD4] hover:bg-[#111210] transition-colors"
                      >
                        <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      <ConfirmPayoutModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        payout={selectedPayout}
        actionType={actionType}
      />
    </div>
  );
}
