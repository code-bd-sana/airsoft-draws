"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Free", value: 680, percentage: "55%", color: "#2D3C13" },      // Dark Olive
  { name: "Premium", value: 412, percentage: "33%", color: "#43581E" },   // Mid Olive
  { name: "Pro", value: 148, percentage: "12%", color: "#8CB34A" },       // Bright Green
];

export default function PlanDistributionChart() {
  return (
    <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col h-full min-h-[360px]">
      <span className="font-sans font-medium text-[13px] text-[#E8EDD4] mb-6">Plan Distribution</span>
      
      <div className="flex-1 flex items-center justify-between gap-6">
        
        {/* Chart */}
        <div className="flex-1 h-[200px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={85}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-4 justify-center w-[160px]">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-2.5 h-2.5 rounded-full shrink-0" 
                style={{ backgroundColor: item.color }} 
              />
              <div className="flex items-baseline gap-1.5 flex-1">
                <span className="font-sans font-medium text-[12px] text-[#72943A] w-[50px]">{item.name}</span>
                <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">{item.value}</span>
                <span className="font-sans text-[11px] text-[#5A752A]">({item.percentage})</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
