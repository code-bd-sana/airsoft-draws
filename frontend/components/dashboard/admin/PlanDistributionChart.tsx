"use client";

import React, { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useAdminSubscriptionStats } from "../../../hooks/useSubscriptionHooks";

const COLORS = [
  "#8CB34A", // Bright Green
  "#4ADE80", // Light Green
  "#A0D056", // Lime Green
  "#C0E868", // Pale Lime
  "#5A752A", // Olive Green
  "#84CC16", // Lime Accent
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

  const totalActive = stats?.totalActive ?? 0;

  return (
    <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-5 sm:p-6 flex flex-col w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">Plan Distribution</span>
        <span className="font-sans text-[11px] text-[#8CB34A] bg-[#1A230A] border border-[#2D3C13] px-2 py-0.5 rounded-full">
          {totalActive} Active
        </span>
      </div>
      
      {isLoading ? (
        <div className="py-12 flex items-center justify-center">
          <span className="font-sans text-[13px] text-[#5A752A] animate-pulse">Loading chart data...</span>
        </div>
      ) : chartData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
          <div className="w-10 h-10 rounded-full bg-[#1A230A] border border-[#2D3C13] flex items-center justify-center text-[#5A752A]">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
          </div>
          <span className="font-sans text-[13px] text-[#72943A]">No active subscriptions</span>
          <span className="font-sans text-[11px] text-[#5A752A]">Active subscriber plans will appear here</span>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row xl:flex-col items-center justify-between gap-5">
          
          {/* Donut Chart with Center Total */}
          <div className="relative w-full sm:w-[200px] xl:w-full h-[190px] flex items-center justify-center shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0D0D0B',
                    borderColor: '#2D3C13',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  itemStyle={{ color: '#E8EDD4' }}
                  formatter={(value: any, name: any, item: any) => [
                    `${value} (${item.payload.percentage})`,
                    name,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="font-heading font-bold text-[22px] text-[#E8EDD4] leading-none">
                {totalActive}
              </span>
              <span className="font-sans text-[9px] text-[#5A752A] uppercase tracking-wider mt-1">
                Subscribers
              </span>
            </div>
          </div>

          {/* Breakdown List */}
          <div className="flex flex-col gap-2.5 w-full">
            {chartData.map((item, index) => (
              <div 
                key={index} 
                className="flex flex-col gap-1.5 p-2.5 rounded-[8px] bg-[#111210] border border-[#2D3C13]/40 hover:border-[#2D3C13] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <div 
                      className="w-2.5 h-2.5 rounded-full shrink-0" 
                      style={{ backgroundColor: item.color }} 
                    />
                    <span className="font-sans font-medium text-[12px] text-[#E8EDD4] truncate" title={item.name}>
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-sans font-bold text-[12px] text-[#E8EDD4]">
                      {item.value}
                    </span>
                    <span className="font-sans text-[10px] font-medium text-[#8CB34A] bg-[#1A230A] px-1.5 py-0.5 rounded border border-[#2D3C13]/60">
                      {item.percentage}
                    </span>
                  </div>
                </div>
                {/* Visual percentage track */}
                <div className="w-full h-1 bg-[#1A230A] rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500 ease-out" 
                    style={{ width: item.percentage, backgroundColor: item.color }} 
                  />
                </div>
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
}
