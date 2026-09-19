"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { HostSalesChartDataPoint } from "../../../../types/host-dashboard.types";

interface Props {
  data: Array<{ date: string; revenue: number; sales?: number }>;
  timeRange?: '7D' | '30D' | '1Y';
  onTimeRangeChange?: (range: '7D' | '30D' | '1Y') => void;
  isLoading?: boolean;
}

function ChartSkeleton() {
  return (
    <div className="w-full h-full flex flex-col justify-end gap-3 pt-6 pb-2 animate-pulse">
      <div className="flex items-end justify-between gap-3 h-full px-3">
        {[20, 45, 30, 65, 40, 85, 55].map((h, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2.5 h-full justify-end">
            <div 
              className="w-full bg-gradient-to-t from-[#1A230A] to-[#2D3C13]/60 rounded-t-md transition-all duration-300 border-t border-[#8CB34A]/20"
              style={{ height: `${h}%` }}
            />
            <div className="h-2 w-7 bg-[#1A230A] rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SalesChart({ data, timeRange = '7D', onTimeRangeChange, isLoading }: Props) {
  const periodLabel = timeRange === '7D' ? 'the last 7 days' : timeRange === '30D' ? 'the last 30 days' : 'this year';

  return (
    <div className="w-full bg-[#161810] border border-[#2d3c13] rounded-[16px] p-[24px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-[24px]">
        <div>
          <h3 className="font-heading font-medium text-[18px] text-[#e8edd4]">
            Revenue Overview
          </h3>
          <p className="font-sans font-normal text-[14px] text-[#b3b8aa]">
            Ticket sales and gross revenue across all competitions over {periodLabel}.
          </p>
        </div>

        {/* Time Period Filter */}
        <div className="flex items-center gap-1 bg-[#0d0d0b] border border-[#2d3c13] rounded-full p-1 self-start sm:self-auto">
          {(['7D', '30D', '1Y'] as const).map((range) => (
            <button
              key={range}
              onClick={() => onTimeRangeChange?.(range)}
              className={`px-3 py-1 rounded-full font-sans font-medium text-[12px] transition-all cursor-pointer ${
                timeRange === range
                  ? "bg-[#1A230A] border border-[#8CB34A] text-[#8CB34A] shadow-[0_0_10px_rgba(140,179,74,0.2)]"
                  : "text-[#72943A] hover:text-[#E8EDD4] border border-transparent"
              }`}
            >
              {range === '7D' ? '7 Days' : range === '30D' ? '30 Days' : '1 Year'}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full h-[300px]">
        {isLoading ? (
          <ChartSkeleton />
        ) : (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8cb34a" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8cb34a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2d3c13" />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#5a752a", fontSize: 12, fontFamily: "Inter" }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#5a752a", fontSize: 12, fontFamily: "Inter" }}
              tickFormatter={(val) => `£${val}`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "#1a230a", 
                border: "1px solid #8cb34a",
                borderRadius: "8px",
                fontFamily: "Inter"
              }}
              itemStyle={{ color: "#e8edd4" }}
              labelStyle={{ color: "#8cb34a", marginBottom: "4px" }}
              formatter={(value: any) => [`£${value}`, "Revenue"]}
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#8cb34a" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
