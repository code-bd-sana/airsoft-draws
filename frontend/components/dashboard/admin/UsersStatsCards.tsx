"use client";

import React from "react";
import { useAdminUsersStats } from "../../../hooks/useAdminHooks";

export default function UsersStatsCards() {
  const { data: stats, isLoading, isError } = useAdminUsersStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-[#161810] border border-[#2D3C13] rounded-[16px] h-[120px]" />
        ))}
      </div>
    );
  }

  if (isError || !stats) {
    return <div className="text-red-500">Failed to load statistics.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      
      {/* Total Users */}
      <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col gap-2">
        <span className="font-sans text-[11px] font-medium text-[#5A752A] uppercase tracking-[1px]">
          Total Users
        </span>
        <div className="flex flex-col gap-1 mt-1">
          <span className="font-heading font-bold text-[32px] text-[#E8EDD4] leading-none">
            {stats.totalUsers.toLocaleString()}
          </span>
          <div className="flex items-center gap-1.5 mt-2">
            <div className="px-2 py-0.5 rounded-full bg-[#083b18] flex items-center justify-center">
              <span className="font-sans font-medium text-[10px] text-[#4ADE80]">All time</span>
            </div>
          </div>
        </div>
      </div>

      {/* New This Month */}
      <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col gap-2">
        <span className="font-sans text-[11px] font-medium text-[#5A752A] uppercase tracking-[1px]">
          New This Month
        </span>
        <div className="flex flex-col gap-1 mt-1">
          <span className="font-heading font-bold text-[32px] text-[#E8EDD4] leading-none">
            {stats.newThisMonth.toLocaleString()}
          </span>
          <div className="flex items-center gap-1.5 mt-2">
            <div className="px-2 py-0.5 rounded-full bg-[#083b18] flex items-center justify-center">
              <span className="font-sans font-medium text-[10px] text-[#4ADE80]">This month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Users */}
      <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col gap-2">
        <span className="font-sans text-[11px] font-medium text-[#5A752A] uppercase tracking-[1px]">
          Active Users
        </span>
        <div className="flex flex-col gap-1 mt-1">
          <span className="font-heading font-bold text-[32px] text-[#E8EDD4] leading-none">
            {stats.activeUsers.toLocaleString()}
          </span>
          <div className="flex items-center gap-1.5 mt-2">
            <div className="px-2 py-0.5 rounded-full bg-[#083b18] flex items-center justify-center">
              <span className="font-sans font-medium text-[10px] text-[#4ADE80]">{stats.activePercentage}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Blocked Users */}
      <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col gap-2">
        <span className="font-sans text-[11px] font-medium text-[#5A752A] uppercase tracking-[1px]">
          Blocked Users
        </span>
        <div className="flex flex-col gap-1 mt-1">
          <span className="font-heading font-bold text-[32px] text-[#E8EDD4] leading-none">
            {stats.blockedUsers.toLocaleString()}
          </span>
          <div className="flex items-center gap-1.5 mt-2">
            <div className="px-2 py-0.5 rounded-full bg-[#7F1D1D] flex items-center justify-center">
              <span className="font-sans font-medium text-[10px] text-[#f76b6b]">{stats.blockedPercentage}%</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
