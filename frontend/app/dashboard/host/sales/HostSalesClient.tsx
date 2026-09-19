"use client";

import React, { useState } from "react";
import SalesMetricsCards from "../../../../components/dashboard/host/sales/SalesMetricsCards";
import SalesChart from "../../../../components/dashboard/host/sales/SalesChart";
import SalesBreakdownTable from "../../../../components/dashboard/host/sales/SalesBreakdownTable";
import { useHostSalesAnalytics } from "../../../../hooks/useHostWalletHooks";

export default function HostSalesClient() {
  const [timeRange, setTimeRange] = useState<'7D' | '30D' | '1Y'>('7D');
  const { data, isLoading, isFetching } = useHostSalesAnalytics(timeRange);

  const metrics = data?.metrics || [
    { id: "total_revenue", label: "Total Revenue", value: "£0.00", change: "15% Platform Fee", trend: "up" as const },
    { id: "total_tickets_sold", label: "Tickets Sold", value: "0", change: "0 Entrants", trend: "up" as const },
    { id: "net_earnings", label: "Net Earnings", value: "£0.00", change: "85% Net Share", trend: "up" as const },
    { id: "active_competitions", label: "Active Competitions", value: "0", change: "0 Total Draws", trend: "up" as const },
  ];

  const chartData = data?.chartData || [];
  const raffles = data?.raffles || [];

  return (
    <div className="flex-1 w-full px-[20px] lg:px-[40px] py-[24px] lg:py-[32px] flex flex-col gap-[24px] animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col gap-[8px]">
        <h1 className="font-heading font-medium text-[32px] text-[#e8edd4]">
          Competition Sales
        </h1>
        <p className="font-sans font-normal text-[15px] text-[#b3b8aa]">
          Live revenue overview, ticket sales tracking, and individual competition performance.
        </p>
      </div>

      {/* Background loading indicator bar */}
      <div className="h-0.5 w-full bg-transparent overflow-hidden -mt-2">
        {isFetching && !isLoading && (
          <div className="h-full bg-gradient-to-r from-transparent via-[#8CB34A] to-transparent animate-pulse w-full shadow-[0_0_8px_#8CB34A]" />
        )}
      </div>

      {/* Top Metrics Cards */}
      <SalesMetricsCards metrics={metrics} isLoading={isLoading} />

      {/* Sales Trend Chart */}
      <SalesChart 
        data={chartData} 
        timeRange={timeRange} 
        onTimeRangeChange={setTimeRange} 
        isLoading={isLoading} 
      />

      {/* Competition Breakdown Table */}
      <SalesBreakdownTable raffles={raffles} isLoading={isLoading} />
    </div>
  );
}
