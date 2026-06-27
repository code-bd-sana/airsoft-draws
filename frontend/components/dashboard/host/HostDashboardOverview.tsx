import React from "react";
import HostStatCard from "./HostStatCard";
import HostRevenueChart from "./HostRevenueChart";
import HostActiveRaffles from "./HostActiveRaffles";
import RaffleProfitCalculator from "./RaffleProfitCalculator";
import HostUpcomingDraws from "./HostUpcomingDraws";
import HostRecentActivity from "./HostRecentActivity";
import { hostKpiStats } from "../../../data/dashboard/host-dashboard.data";

export default function HostDashboardOverview() {
  return (
    <div className="flex flex-col gap-[20px] w-full max-w-[1660px] mx-auto">
      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[20px] w-full">
        {hostKpiStats.map((stat) => (
          <HostStatCard key={stat.id} stat={stat} />
        ))}
      </div>

      {/* Main Content Area - Split into two logical columns on large screens */}
      <div className="flex flex-col xl:flex-row gap-[20px] w-full items-start">
        
        {/* Left Column (Earnings + Active Raffles) */}
        <div className="flex flex-col gap-[20px] w-full xl:w-[924px] shrink-0">
          <HostRevenueChart />
          <HostActiveRaffles />
        </div>
        
        {/* Right Column (Profit Calculator + Upcoming Draws) */}
        <div className="flex flex-col gap-[20px] w-full xl:w-[635px] shrink-0">
          <RaffleProfitCalculator />
          <HostUpcomingDraws />
        </div>
      </div>

      {/* Bottom Row (Recent Activity) */}
      <HostRecentActivity />
    </div>
  );
}
