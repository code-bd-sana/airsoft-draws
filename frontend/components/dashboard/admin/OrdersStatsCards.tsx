"use client";

import React from "react";
import { useAdminOrdersStats } from "../../../hooks/useAdminHooks";

export default function OrdersStatsCards() {
  const { data: stats, isLoading } = useAdminOrdersStats();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      
      {/* Total Orders */}
      <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col gap-2">
        <span className="font-sans text-[11px] font-medium text-[#5A752A] uppercase tracking-[1px]">
          Total Orders
        </span>
        <div className="flex flex-col gap-1 mt-1">
          <span className="font-heading font-bold text-[32px] text-[#E8EDD4] leading-none">
            {isLoading ? "..." : stats?.totalOrders?.toLocaleString() || 0}
          </span>
          <div className="flex items-center gap-1.5 mt-2">
            <div className="px-2 py-0.5 rounded-full bg-[#083b18] flex items-center justify-center">
              <span className="font-sans font-medium text-[10px] text-[#4ADE80]">Transactions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Total Tickets Sold */}
      <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col gap-2">
        <span className="font-sans text-[11px] font-medium text-[#5A752A] uppercase tracking-[1px]">
          Total Tickets Sold
        </span>
        <div className="flex flex-col gap-1 mt-1">
          <span className="font-heading font-bold text-[32px] text-[#E8EDD4] leading-none">
            {isLoading ? "..." : stats?.totalTicketsSold?.toLocaleString() || 0}
          </span>
          <div className="flex items-center gap-1.5 mt-2">
            <div className="px-2 py-0.5 rounded-full bg-[#083b18] flex items-center justify-center">
              <span className="font-sans font-medium text-[10px] text-[#4ADE80]">Tickets</span>
            </div>
          </div>
        </div>
      </div>

      {/* Total Order Value */}
      <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col gap-2">
        <span className="font-sans text-[11px] font-medium text-[#5A752A] uppercase tracking-[1px]">
          Total Order Value
        </span>
        <div className="flex flex-col gap-1 mt-1">
          <span className="font-heading font-bold text-[32px] text-[#E8EDD4] leading-none">
            {isLoading ? "..." : `£${stats?.totalOrderValue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}`}
          </span>
          <div className="flex items-center gap-1.5 mt-2">
            <div className="px-2 py-0.5 rounded-full bg-[#083b18] flex items-center justify-center">
              <span className="font-sans font-medium text-[10px] text-[#4ADE80]">Revenue</span>
            </div>
          </div>
        </div>
      </div>

      {/* Refunded Orders */}
      <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col gap-2">
        <span className="font-sans text-[11px] font-medium text-[#5A752A] uppercase tracking-[1px]">
          Refunded Orders
        </span>
        <div className="flex flex-col gap-1 mt-1">
          <span className="font-heading font-bold text-[32px] text-[#E8EDD4] leading-none">
            {isLoading ? "..." : stats?.refundedOrders?.toLocaleString() || 0}
          </span>
          <div className="flex items-center gap-1.5 mt-2">
            <div className="px-2 py-0.5 rounded-full bg-[#7F1D1D] flex items-center justify-center">
              <span className="font-sans font-medium text-[10px] text-[#f76b6b]">Refunded</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
