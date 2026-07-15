"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { adminService } from "../../../services/admin.service";

export default function HostsStatsCards() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-hosts-stats'],
    queryFn: () => adminService.getHostStats(),
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* Total Hosts */}
      <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col gap-2">
        <span className="font-sans text-[11px] font-medium text-[#5A752A] uppercase tracking-[1px]">
          Total Hosts
        </span>
        <div className="flex flex-col gap-1 mt-1">
          <span className="font-heading font-bold text-[32px] text-[#E8EDD4] leading-none">
            {isLoading ? '...' : stats?.totalHosts || 0}
          </span>
        </div>
      </div>

      {/* Active Hosts */}
      <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col gap-2">
        <span className="font-sans text-[11px] font-medium text-[#5A752A] uppercase tracking-[1px]">
          Active Hosts
        </span>
        <div className="flex flex-col gap-1 mt-1">
          <span className="font-heading font-bold text-[32px] text-[#E8EDD4] leading-none">
            {isLoading ? '...' : stats?.activeHosts || 0}
          </span>
          <div className="flex items-center gap-1.5 mt-2">
            <div className="px-2 py-0.5 rounded-full bg-[#083b18] flex items-center justify-center">
              <span className="font-sans font-medium text-[10px] text-[#4ADE80]">Operational</span>
            </div>
          </div>
        </div>
      </div>

      {/* Blocked Hosts */}
      <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col gap-2">
        <span className="font-sans text-[11px] font-medium text-[#5A752A] uppercase tracking-[1px]">
          Blocked Hosts
        </span>
        <div className="flex flex-col gap-1 mt-1">
          <span className="font-heading font-bold text-[32px] text-[#E8EDD4] leading-none">
            {isLoading ? '...' : stats?.blockedHosts || 0}
          </span>
          <div className="flex items-center gap-1.5 mt-2">
            <div className="px-2 py-0.5 rounded-full bg-[#7F1D1D] flex items-center justify-center">
              <span className="font-sans font-medium text-[10px] text-[#f76b6b]">Suspended</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
