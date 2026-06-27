import React from "react";
import { PayoutMetrics } from "../../../../types/host-dashboard.types";

interface Props {
  metrics: PayoutMetrics;
}

export default function PayoutMetricsCards({ metrics }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[24px]">
      
      {/* Available Balance */}
      <div className="bg-[#161810] border border-[#2d3c13] rounded-[16px] p-[24px] flex flex-col gap-[8px]">
        <h4 className="font-sans font-medium text-[11px] text-[#5a752a] uppercase tracking-[0.275px]">
          Available Balance
        </h4>
        <div className="font-heading font-bold text-[28px] text-[#e8edd4]">
          £{metrics.availableBalance.toFixed(2)}
        </div>
        <p className="font-sans font-normal text-[11px] text-[#5a752a]">
          Ready to withdraw
        </p>
      </div>

      {/* Pending Clearance */}
      <div className="bg-[#161810] border border-[#2d3c13] rounded-[16px] p-[24px] flex flex-col gap-[8px]">
        <h4 className="font-sans font-medium text-[11px] text-[#5a752a] uppercase tracking-[0.275px]">
          Pending Clearance
        </h4>
        <div className="font-heading font-bold text-[28px] text-[#e8edd4]">
          £{metrics.pendingClearance.toFixed(2)}
        </div>
        <p className="font-sans font-normal text-[11px] text-[#5a752a]">
          Processing 3–5 days
        </p>
      </div>

      {/* Total Lifetime Earnings */}
      <div className="bg-[#161810] border border-[#2d3c13] rounded-[16px] p-[24px] flex flex-col gap-[8px]">
        <h4 className="font-sans font-medium text-[11px] text-[#5a752a] uppercase tracking-[0.275px]">
          Total Lifetime Earnings
        </h4>
        <div className="font-heading font-bold text-[28px] text-[#e8edd4]">
          £{metrics.totalLifetimeEarnings.toFixed(2)}
        </div>
        <p className="font-sans font-normal text-[11px] text-[#5a752a]">
          Across all completed raffles
        </p>
      </div>

      {/* Total Fees Paid */}
      <div className="bg-[#161810] border border-[#2d3c13] rounded-[16px] p-[24px] flex flex-col gap-[8px]">
        <h4 className="font-sans font-medium text-[11px] text-[#5a752a] uppercase tracking-[0.275px]">
          Total Fees Paid
        </h4>
        <div className="font-heading font-bold text-[28px] text-[#72943a]">
          £{metrics.totalFeesPaid.toFixed(2)}
        </div>
        <p className="font-sans font-normal text-[11px] text-[#5a752a]">
          Across all completed raffles
        </p>
      </div>

    </div>
  );
}
