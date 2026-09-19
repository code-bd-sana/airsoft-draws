"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { PerformanceCategorySales } from "../../../../types/host-dashboard.types";

interface Props {
  data: PerformanceCategorySales[];
  isLoading?: boolean;
}

function DonutSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-between px-2 animate-pulse">
      <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
        <div className="w-28 h-28 rounded-full border-[10px] border-[#1A230A] border-t-[#8CB34A]/40 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-[#111210] border border-[#2D3C13]/60" />
        </div>
      </div>
      <div className="flex flex-col gap-3 pr-2 flex-1 max-w-[130px] ml-4">
        {[70, 50, 80].map((w, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#2D3C13] shrink-0" />
            <div className="h-3 rounded bg-[#1A230A]" style={{ width: `${w}px` }} />
            <div className="h-3 w-6 rounded bg-[#1A230A] ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CategorySalesChart({ data = [], isLoading }: Props) {
  return (
    <div className="bg-[#161810] border border-[#2d3c13] rounded-[16px] p-[24px] flex flex-col h-[360px]">
      <div className="flex items-center justify-between mb-[24px]">
        <h3 className="font-heading font-medium text-[16px] text-[#e8edd4]">
          Ticket Sales by Category
        </h3>
        <span className="font-sans text-[11px] text-[#5A752A]">Distribution</span>
      </div>
      
      <div className="flex-1 w-full flex items-center justify-center min-h-0">
        {isLoading ? (
          <DonutSkeleton />
        ) : data.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-xs font-sans text-[#5A752A]">No category data available yet.</span>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-between">
            {/* Pie Chart */}
            <div className="relative w-1/2 h-[200px] flex items-center justify-center -ml-[20px]">
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
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "#0d0d0b", 
                      borderColor: "#2d3c13", 
                      borderRadius: "8px",
                      color: "#e8edd4" 
                    }}
                    itemStyle={{ color: "#8cb34a" }}
                    formatter={(value: any) => [`${value} entries`, "Count"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex flex-col gap-[14px] flex-1 pl-[16px] max-h-[220px] overflow-y-auto no-scrollbar">
              {data.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-[10px] truncate mr-2">
                    <div 
                      className="w-[8px] h-[8px] rounded-full shrink-0" 
                      style={{ backgroundColor: item.color }} 
                    />
                    <span className="font-sans font-normal text-[13px] text-[#b3b8aa] truncate" title={item.name}>
                      {item.name}
                    </span>
                  </div>
                  <span className="font-sans font-medium text-[13px] text-[#e8edd4] shrink-0">
                    {item.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
