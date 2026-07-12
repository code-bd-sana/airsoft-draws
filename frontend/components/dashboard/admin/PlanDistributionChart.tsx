"use client";

import React, { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useAdminSubscriptionStats } from "../../../hooks/useSubscriptionHooks";

const COLORS = [
  "#2D3C13", // Dark Olive
  "#43581E", // Mid Olive
  "#8CB34A", // Bright Green
  "#5A752A", // Olive Green
  "#1A230A", // Very Dark Olive
];

export default function PlanDistributionChart() {
  const { data: stats, isLoading } = useAdminSubscriptionStats();

  const chartData = useMemo(() => {
    if (!stats || !stats.planDistribution) return [];
    
    return stats.planDistribution.map((item, index) => ({
      ...item,
      color: COLORS[index % COLORS.length]
    }));
  }, [stats]);

  return (
    <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col h-full min-h-[360px]">
      <span className="font-sans font-medium text-[13px] text-[#E8EDD4] mb-6">Plan Distribution</span>
      
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <span className="font-sans text-[13px] text-[#5A752A]">Loading chart data...</span>
        </div>
      ) : chartData.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <span className="font-sans text-[13px] text-[#5A752A]">No active subscriptions found.</span>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-between gap-6">
          
          {/* Chart */}
          <div className="flex-1 h-[200px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex flex-col gap-4 justify-center w-[160px]">
            {chartData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-2.5 h-2.5 rounded-full shrink-0" 
                  style={{ backgroundColor: item.color }} 
                />
                <div className="flex items-baseline gap-1.5 flex-1">
                  <span className="font-sans font-medium text-[12px] text-[#72943A] w-[50px] truncate" title={item.name}>{item.name}</span>
                  <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">{item.value}</span>
                  <span className="font-sans text-[11px] text-[#5A752A]">({item.percentage})</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
}
