import React from "react";
import SalesMetricsCards from "../../../../components/dashboard/host/sales/SalesMetricsCards";
import SalesChart from "../../../../components/dashboard/host/sales/SalesChart";
import SalesBreakdownTable from "../../../../components/dashboard/host/sales/SalesBreakdownTable";
import { 
  mockSalesMetrics, 
  mockSalesChartData, 
  mockHostRafflesList 
} from "../../../../data/dashboard/host-dashboard.data";

export const metadata = {
  title: "Competition Sales | Host Dashboard",
};

export default function CompetitionSalesPage() {
  return (
    <div className="flex flex-col gap-[24px] animate-in fade-in zoom-in-95 duration-300 w-full">
      {/* Header */}
      <div className="flex flex-col gap-[8px]">
        <h1 className="font-heading font-medium text-[32px] text-[#e8edd4]">
          Competition Sales
        </h1>
        <p className="font-sans font-normal text-[15px] text-[#b3b8aa]">
          Monitor your revenue, ticket sales, and overall performance.
        </p>
      </div>

      {/* Top Metrics Cards */}
      <SalesMetricsCards metrics={mockSalesMetrics} />

      {/* Sales Trend Chart */}
      <SalesChart data={mockSalesChartData} />

      {/* Competition Breakdown Table */}
      <SalesBreakdownTable raffles={mockHostRafflesList} />
    </div>
  );
}
