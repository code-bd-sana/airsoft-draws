"use client";

import React from "react";

interface WithdrawalsStatsCardsProps {
  withdrawals?: any[];
  isLoading?: boolean;
}

export default function WithdrawalsStatsCards({ withdrawals = [], isLoading }: WithdrawalsStatsCardsProps) {
  const pendingRequests = withdrawals.filter(w => w.status === 'PENDING' || w.status === 'Pending');
  const pendingCount = pendingRequests.length;
  
  const totalPendingAmount = pendingRequests.reduce((acc, w) => acc + (w.amount || 0), 0);
  
  const totalCommissionEarned = withdrawals.reduce((acc, w) => {
    const fee = w.feeAmount !== undefined ? w.feeAmount : (w.amount || 0) * 0.10;
    return acc + fee;
  }, 0);

  const totalProcessedNet = withdrawals
    .filter(w => w.status === 'COMPLETED' || w.status === 'APPROVED' || w.status === 'Paid')
    .reduce((acc, w) => acc + (w.netAmount !== undefined ? w.netAmount : (w.amount || 0) * 0.90), 0);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 h-28 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      
      {/* Pending Requests */}
      <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col justify-between">
        <span className="font-sans text-[11px] font-medium text-[#5A752A] uppercase tracking-[1px]">
          Pending Requests
        </span>
        <div className="flex flex-col gap-1 mt-2">
          <span className="font-heading font-bold text-[32px] text-[#E8EDD4] leading-none">{pendingCount}</span>
          <div className="flex items-center gap-1.5 mt-2">
            <div className="px-2 py-0.5 rounded-full border border-[#D97706]/30 bg-[#78350F] flex items-center justify-center">
              <span className="font-sans font-medium text-[10px] text-[#F59E0B]">
                {pendingCount > 0 ? `${pendingCount} Needs Action` : "All Processed"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Total Pending Amount */}
      <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col justify-between">
        <span className="font-sans text-[11px] font-medium text-[#5A752A] uppercase tracking-[1px]">
          Total Pending Amount
        </span>
        <div className="flex flex-col gap-1 mt-2">
          <span className="font-heading font-bold text-[32px] text-[#E8EDD4] leading-none">
            £{totalPendingAmount.toFixed(2)}
          </span>
          <span className="font-sans text-[11px] text-[#72943A] mt-1">Gross requested payouts</span>
        </div>
      </div>

      {/* Platform Commission Earned (10%) */}
      <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col justify-between">
        <span className="font-sans text-[11px] font-medium text-[#5A752A] uppercase tracking-[1px]">
          Platform Commission (10%)
        </span>
        <div className="flex flex-col gap-1 mt-2">
          <span className="font-heading font-bold text-[32px] text-[#8CB34A] leading-none">
            £{totalCommissionEarned.toFixed(2)}
          </span>
          <span className="font-sans text-[11px] text-[#72943A] mt-1">Platform revenue from withdrawals</span>
        </div>
      </div>

      {/* Total Processed Payouts */}
      <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col justify-between">
        <span className="font-sans text-[11px] font-medium text-[#5A752A] uppercase tracking-[1px]">
          Processed Net Payouts
        </span>
        <div className="flex flex-col gap-1 mt-2">
          <span className="font-heading font-bold text-[32px] text-[#E8EDD4] leading-none">
            £{totalProcessedNet.toFixed(2)}
          </span>
          <span className="font-sans text-[11px] text-[#72943A] mt-1">Total transferred to hosts</span>
        </div>
      </div>

    </div>
  );
}
