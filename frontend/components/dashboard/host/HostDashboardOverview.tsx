import React from "react";
import HostStatCard from "./HostStatCard";
import HostRevenueChart from "./HostRevenueChart";
import HostCompetitionsTable from "./HostCompetitionsTable";
import { hostKpiStats } from "../../../data/dashboard/host-dashboard.data";

export default function HostDashboardOverview() {
  return (
    <div className="flex flex-col gap-[20px] w-full max-w-[1660px] mx-auto py-8">
      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[20px]">
        {hostKpiStats.map((stat) => (
          <HostStatCard key={stat.id} stat={stat} />
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-[20px]">
        {/* Revenue Chart (Spans 2 columns on extra large screens) */}
        <div className="xl:col-span-2 flex w-full">
          <HostRevenueChart />
        </div>
        
        {/* Competitions Table */}
        <div className="xl:col-span-1 flex w-full">
          <HostCompetitionsTable />
        </div>
      </div>
    </div>
  );
}
