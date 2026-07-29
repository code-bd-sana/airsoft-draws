"use client";

import React from "react";
import WithdrawalsStatsCards from "../../../../components/dashboard/admin/WithdrawalsStatsCards";
import WithdrawalsTable from "../../../../components/dashboard/admin/WithdrawalsTable";
import { useAdminWithdrawals } from "../../../../hooks/useAdminHooks";

export default function AdminWithdrawalsClient() {
  const { data: withdrawals, isLoading } = useAdminWithdrawals();

  return (
    <div className="flex flex-col gap-6 p-8 max-w-[1660px] mx-auto w-full animate-fadeIn">
      <div>
        <h1 className="font-heading font-bold text-2xl text-[#E8EDD4] mb-2">Withdraw Requests</h1>
        <p className="font-sans text-sm text-[#72943A]">
          Review and process payout requests from competition hosts. Every withdrawal deducts a <strong>10% platform commission fee</strong>.
        </p>
      </div>
      
      <WithdrawalsStatsCards withdrawals={withdrawals} isLoading={isLoading} />
      <WithdrawalsTable withdrawals={withdrawals} isLoading={isLoading} />
    </div>
  );
}
