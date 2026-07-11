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
}

export default function RevenueTrendChart({ data = [] }: Props) {
  return (
    <div className="bg-[#161810] border border-[#2d3c13] rounded-[16px] p-[24px] flex flex-col h-[360px]">
      <h3 className="font-heading font-medium text-[16px] text-[#e8edd4] mb-[32px]">
        Revenue Trend
      </h3>
      
      <div className="flex-1 w-full relative -ml-[15px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8cb34a" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#8cb34a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#5a752a", fontSize: 12, fontFamily: "var(--font-sans)" }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#5a752a", fontSize: 12, fontFamily: "var(--font-sans)" }}
              tickFormatter={(val) => `£${val / 1000}k`}
              dx={-10}
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
              formatter={(value: any) => [`£${value}`, "Revenue"]}
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#8cb34a" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
