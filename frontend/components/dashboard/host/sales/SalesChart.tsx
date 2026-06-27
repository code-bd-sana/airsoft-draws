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
  data: HostSalesChartDataPoint[];
}

export default function SalesChart({ data }: Props) {
  return (
    <div className="w-full bg-[#161810] border border-[#2d3c13] rounded-[16px] p-[24px]">
      <div className="flex items-center justify-between mb-[24px]">
        <div>
          <h3 className="font-heading font-medium text-[18px] text-[#e8edd4]">
            Revenue Overview
          </h3>
          <p className="font-sans font-normal text-[14px] text-[#b3b8aa]">
            Ticket sales across all active competitions over the last 7 days.
          </p>
        </div>
        <select className="bg-[#0d0d0b] border border-[#2d3c13] rounded-[8px] px-[12px] py-[8px] font-sans font-medium text-[12px] text-[#e8edd4] outline-none hover:border-[#8cb34a] transition-colors cursor-pointer">
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>This Year</option>
        </select>
      </div>

      <div className="w-full h-[300px]">
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
      </div>
    </div>
  );
}
