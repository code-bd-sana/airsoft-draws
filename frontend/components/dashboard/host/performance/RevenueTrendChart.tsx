"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { PerformanceRevenueDataPoint } from "../../../../types/host-dashboard.types";

interface Props {
  data: PerformanceRevenueDataPoint[];
  isLoading?: boolean;
}

function ChartSkeleton() {
  return (
    <div className="w-full h-full flex flex-col justify-end gap-3 pt-6 pb-2 animate-pulse">
      <div className="flex items-end justify-between gap-3 h-full px-4">
        {[25, 60, 35, 80, 50, 90, 65].map((h, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2.5 h-full justify-end">
            <div 
              className="w-full bg-gradient-to-t from-[#1A230A] to-[#2D3C13]/60 rounded-t-md transition-all duration-300 border-t border-[#8CB34A]/20"
              style={{ height: `${h}%` }}
            />
            <div className="h-2 w-8 bg-[#1A230A] rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RevenueTrendChart({ data = [], isLoading }: Props) {
  const maxVal = Math.max(...data.map(d => d.revenue), 0);

  return (
    <div className="bg-[#161810] border border-[#2d3c13] rounded-[16px] p-[24px] flex flex-col h-[360px]">
      <div className="flex items-center justify-between mb-[24px]">
        <h3 className="font-heading font-medium text-[16px] text-[#e8edd4]">
          Revenue Trend
        </h3>
        <span className="font-sans text-[11px] text-[#5A752A]">Gross Sales</span>
      </div>
      
      <div className="flex-1 w-full relative min-h-0">
        {isLoading ? (
          <ChartSkeleton />
        ) : data.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-xs font-sans text-[#5A752A]">No revenue records in this timeframe.</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8cb34a" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#8cb34a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#5a752a", fontSize: 11, fontFamily: "var(--font-sans)" }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#5a752a", fontSize: 11, fontFamily: "var(--font-sans)" }}
                tickFormatter={(val) => maxVal >= 1000 ? `£${(val / 1000).toFixed(val % 1000 === 0 ? 0 : 1)}k` : `£${val}`}
                dx={-5}
              />
              <Tooltip
                cursor={{ stroke: "#2d3c13", strokeWidth: 1, strokeDasharray: "4 4" }}
                contentStyle={{ 
                  backgroundColor: "#0d0d0b", 
                  borderColor: "#2d3c13", 
                  borderRadius: "8px",
                  color: "#e8edd4" 
                }}
                itemStyle={{ color: "#8cb34a" }}
                formatter={(value: any) => [`£${Number(value).toFixed(2)}`, "Revenue"]}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#8cb34a" 
                strokeWidth={2.5}
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
                activeDot={{ r: 5, fill: '#111210', stroke: '#8cb34a', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
