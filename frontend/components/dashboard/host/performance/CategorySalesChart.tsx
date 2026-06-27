"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { PerformanceCategorySales } from "../../../../types/host-dashboard.types";

interface Props {
  data: PerformanceCategorySales[];
}

export default function CategorySalesChart({ data = [] }: Props) {
  return (
    <div className="bg-[#161810] border border-[#2d3c13] rounded-[16px] p-[24px] flex flex-col h-[360px]">
      <h3 className="font-heading font-medium text-[16px] text-[#e8edd4] mb-[24px]">
        Ticket Sales by Category
      </h3>
      
      <div className="flex-1 w-full flex items-center justify-between">
        
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
                paddingAngle={0}
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
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-[16px] flex-1 pl-[24px]">
          {data.map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-[12px]">
                <div 
                  className="w-[8px] h-[8px] rounded-sm shrink-0" 
                  style={{ backgroundColor: item.color }} 
                />
                <span className="font-sans font-normal text-[14px] text-[#b3b8aa]">
                  {item.name}
                </span>
              </div>
              <span className="font-sans font-medium text-[14px] text-[#e8edd4]">
                {item.percentage}%
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
