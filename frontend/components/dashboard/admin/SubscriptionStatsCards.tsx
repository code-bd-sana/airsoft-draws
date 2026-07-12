"use client";

import React from "react";
import { useAdminSubscriptionStats } from "../../../hooks/useSubscriptionHooks";

export default function SubscriptionStatsCards() {
  const { data: stats, isLoading } = useAdminSubscriptionStats();

  const getPlanData = (planName: string) => {
    return stats?.planDistribution?.find(p => p.name.toLowerCase() === planName.toLowerCase()) || { value: 0, percentage: "0%" };
  };

  const freePlan = getPlanData("Free");
  const premiumPlan = getPlanData("Premium");
  const proPlan = getPlanData("Pro");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      
      {/* Free Plan Hosts */}
      <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col gap-2">
        <span className="font-sans text-[11px] font-medium text-[#5A752A] uppercase tracking-[1px]">
          Free Plan Hosts
        </span>
        <div className="flex flex-col gap-1 mt-1">
          <span className="font-heading font-bold text-[32px] text-[#E8EDD4] leading-none">
            {isLoading ? "..." : freePlan.value}
          </span>
          <div className="flex items-center gap-1.5 mt-2">
            <div className="px-2 py-0.5 rounded-full bg-[#083b18] flex items-center justify-center">
              <span className="font-sans font-medium text-[10px] text-[#4ADE80]">{freePlan.percentage}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Subscribers */}
      <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col gap-2">
        <span className="font-sans text-[11px] font-medium text-[#5A752A] uppercase tracking-[1px]">
          Premium Subscribers
        </span>
        <div className="flex flex-col gap-1 mt-1">
          <span className="font-heading font-bold text-[32px] text-[#E8EDD4] leading-none">
            {isLoading ? "..." : premiumPlan.value}
          </span>
          <div className="flex items-center gap-1.5 mt-2">
            <div className="px-2 py-0.5 rounded-full bg-[#083b18] flex items-center justify-center">
              <span className="font-sans font-medium text-[10px] text-[#4ADE80] ml-1">{premiumPlan.percentage}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pro Subscribers */}
      <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col gap-2">
        <span className="font-sans text-[11px] font-medium text-[#5A752A] uppercase tracking-[1px]">
          Pro Subscribers
        </span>
        <div className="flex flex-col gap-1 mt-1">
          <span className="font-heading font-bold text-[32px] text-[#E8EDD4] leading-none">
            {isLoading ? "..." : proPlan.value}
          </span>
          <div className="flex items-center gap-1.5 mt-2">
            <div className="px-2 py-0.5 rounded-full bg-[#083b18] flex items-center justify-center">
              <span className="font-sans font-medium text-[10px] text-[#4ADE80] ml-1">{proPlan.percentage}</span>
            </div>
          </div>
        </div>
      </div>

      {/* MRR */}
      <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col gap-2">
        <span className="font-sans text-[11px] font-medium text-[#5A752A] uppercase tracking-[1px]">
          MRR
        </span>
        <div className="flex flex-col gap-1 mt-1">
          <span className="font-heading font-bold text-[32px] text-[#E8EDD4] leading-none">
            {isLoading ? "..." : `£${stats?.mrr.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}`}
          </span>
          <div className="flex items-center gap-1.5 mt-2">
            <div className="px-2 py-0.5 rounded-full bg-[#083b18] flex items-center justify-center">
              <span className="font-sans font-medium text-[10px] text-[#4ADE80] ml-1">Active</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
