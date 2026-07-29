"use client";

import React, { useState } from "react";
import PayoutMetricsCards from "../../../../components/dashboard/host/payouts/PayoutMetricsCards";
import PayoutHistoryTable from "../../../../components/dashboard/host/payouts/PayoutHistoryTable";
import RequestWithdrawalModal from "../../../../components/dashboard/host/payouts/RequestWithdrawalModal";
import { useHostWalletStats, useHostWithdrawalHistory } from "../../../../hooks/useHostWalletHooks";
import { mockPayoutMetrics, mockPayoutHistory } from "../../../../data/dashboard/host-dashboard.data";

export default function PayoutsAndEarningsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: walletStats, isLoading: isLoadingStats } = useHostWalletStats();
  const { data: historyData, isLoading: isLoadingHistory } = useHostWithdrawalHistory();

  // Merge real data with fallback defaults
  const metrics = walletStats
    ? {
        availableBalance: walletStats.availableBalance,
        pendingClearance: walletStats.pendingClearance,
        totalLifetimeEarnings: walletStats.totalLifetimeEarnings,
        totalFeesPaid: walletStats.totalFeesPaid,
      }
    : mockPayoutMetrics;

  const history = historyData || mockPayoutHistory;

  return (
    <div className="flex-1 w-full px-[20px] lg:px-[40px] py-[24px] lg:py-[32px] flex flex-col gap-[24px] animate-in fade-in zoom-in-95 duration-300">
      
      {/* Top Banner & Request Withdrawal Header */}
      <div className="w-full bg-[#161f08] border border-[#2d3c13] rounded-[16px] p-[24px] flex flex-col sm:flex-row sm:items-center justify-between gap-[16px]">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-[8px]">
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#8cb34a" className="w-[18px] h-[18px]">
              <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
            </svg>
            <span className="font-sans font-medium text-[14px] text-[#e8edd4]">
              Platform Fee & Withdrawal Policy
            </span>
          </div>
          <p className="font-sans text-[12px] text-[#8cb34a] pl-[26px]">
            Every withdrawal deducts a standard <strong>10% platform fee</strong>. Net payouts are sent directly to your bank account or PayPal.
          </p>
        </div>

        <div className="flex items-center gap-4 sm:shrink-0">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 rounded-xl bg-[#8cb34a] hover:bg-[#a0d056] text-[#0d0d0b] font-sans font-bold text-xs shadow-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Request Withdrawal
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      {isLoadingStats ? (
        <div className="p-8 text-center text-[#8cb34a] font-sans text-sm bg-[#161810] border border-[#2d3c13] rounded-2xl">
          Loading wallet metrics...
        </div>
      ) : (
        <PayoutMetricsCards metrics={metrics} />
      )}

      {/* History Table */}
      {isLoadingHistory ? (
        <div className="p-8 text-center text-[#8cb34a] font-sans text-sm bg-[#161810] border border-[#2d3c13] rounded-2xl">
          Loading withdrawal transactions...
        </div>
      ) : (
        <PayoutHistoryTable history={history} />
      )}

      {/* Withdrawal Modal */}
      <RequestWithdrawalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        availableBalance={metrics.availableBalance}
      />

    </div>
  );
}
