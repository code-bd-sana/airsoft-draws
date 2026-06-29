"use client";

import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from "recharts";

const REVENUE_DATA = [
  { name: 'Feb', value: 15000 },
  { name: 'Mar', value: 18000 },
  { name: 'Apr', value: 14000 },
  { name: 'May', value: 22000 },
  { name: 'Jun', value: 28400 },
  { name: 'Jul', value: 31000 },
  { name: 'Aug', value: 29000 },
  { name: 'Sep', value: 34000 },
  { name: 'Oct', value: 32000 },
  { name: 'Nov', value: 25000 },
  { name: 'Dec', value: 20000 },
];

const USER_GROWTH_DATA = [
  { name: 'Feb', users: 1500 },
  { name: 'Mar', users: 2400 },
  { name: 'Apr', users: 2900 },
  { name: 'May', users: 3800 },
  { name: 'Jun', users: 5100 },
];

const CATEGORY_DATA = [
  { name: 'Rifles', value: 45, color: '#A0D056' },
  { name: 'Pistols', value: 25, color: '#72943A' },
  { name: 'Gear', value: 20, color: '#43581E' },
  { name: 'Optics', value: 10, color: '#2D3C13' },
];

const POPULAR_COMPETITIONS = [
  { name: 'Sniper Rifle Set', value: 420 },
  { name: 'VFC HK416 Bundle', value: 345 },
  { name: 'Tactical Pistol Set', value: 250 },
  { name: 'Night Vision', value: 200 },
  { name: 'Ghillie Suit', value: 150 },
];

const HOST_PERFORMANCE = [
  { name: 'Tactical UK', percent: 90 },
  { name: 'Airsoft World', percent: 75 },
  { name: 'Combat Zone', percent: 65 },
  { name: 'Elite', percent: 55 },
  { name: 'Strike', percent: 45 },
];

const GEOGRAPHIC_DATA = [
  { name: 'England', value: 55 },
  { name: 'Scotland', value: 18 },
  { name: 'Wales', value: 12 },
  { name: 'N. Ireland', value: 8 },
  { name: 'Other', value: 7 },
];

const CustomTooltip = ({ active, payload, label, prefix = "", suffix = "" }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#111210] border border-[#2D3C13] rounded-[8px] p-3 shadow-lg">
        <p className="font-sans text-[12px] text-[#72943A] mb-1">{label}</p>
        <p className="font-sans font-medium text-[14px] text-[#E8EDD4]">
          {prefix}{payload[0].value.toLocaleString()}{suffix}
        </p>
      </div>
    );
  }
  return null;
};

export default function ReportsAnalyticsDashboard() {
  const [timeFilter, setTimeFilter] = useState("3M");
  const filters = ["7D", "1M", "3M", "1Y"];

  return (
    <div className="flex flex-col w-full animate-fadeIn">
      
      {/* Header & Filters */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading font-bold text-2xl text-[#E8EDD4] mb-2">Reports & Analytics</h1>
          <p className="font-sans text-sm text-[#72943A]">
            Comprehensive overview of platform performance, sales, and user growth.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`w-[44px] h-[32px] rounded-full font-sans font-medium text-[12px] transition-colors ${
                timeFilter === filter
                  ? "bg-transparent border border-[#8CB34A] text-[#E8EDD4]"
                  : "bg-transparent border border-[#2D3C13] text-[#72943A] hover:bg-[#1A230A] hover:text-[#A0D056]"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        
        {/* Revenue Trend */}
        <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col h-[320px]">
          <h3 className="font-heading font-medium text-[15px] text-[#E8EDD4] mb-6">Revenue Trend</h3>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#A0D056" />
                    <stop offset="100%" stopColor="#8CB34A" />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#5A752A', fontSize: 11, fontFamily: 'inherit' }} 
                  dy={10}
                />
                <YAxis hide />
                <Tooltip content={<CustomTooltip prefix="£" />} cursor={{ stroke: '#2D3C13', strokeWidth: 1 }} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="url(#lineGradient)" 
                  strokeWidth={2.5} 
                  dot={false}
                  activeDot={{ r: 6, fill: '#111210', stroke: '#A0D056', strokeWidth: 2 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales by Category */}
        <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col h-[320px]">
          <h3 className="font-heading font-medium text-[15px] text-[#E8EDD4] mb-2">Sales by Category</h3>
          <div className="flex-1 w-full flex items-center justify-center relative min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CATEGORY_DATA}
                  cx="35%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  stroke="none"
                  dataKey="value"
                  paddingAngle={2}
                >
                  {CATEGORY_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip suffix="%" />} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Custom Legend */}
            <div className="absolute right-[10%] top-1/2 -translate-y-1/2 flex flex-col gap-4">
              {CATEGORY_DATA.map((cat, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }}></div>
                  <span className="font-sans text-[12px] text-[#72943A] w-[45px]">{cat.name}</span>
                  <span className="font-sans font-medium text-[12px] text-[#E8EDD4]">{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Most Popular Competitions */}
        <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col h-[320px]">
          <h3 className="font-heading font-medium text-[15px] text-[#E8EDD4] mb-6">Most Popular Competitions</h3>
          <div className="flex flex-col gap-5 flex-1 justify-center">
            {POPULAR_COMPETITIONS.map((comp, i) => {
              // Calculate width based on max value (420)
              const width = Math.max((comp.value / 420) * 100, 5);
              return (
                <div key={i} className="flex flex-col gap-1.5 w-full">
                  <div className="flex items-center justify-between w-full">
                    <span className="font-sans text-[11px] text-[#72943A]">{comp.name}</span>
                    <span className="font-sans font-medium text-[11px] text-[#E8EDD4]">{comp.value}</span>
                  </div>
                  <div className="w-full bg-[#111210] h-[3px] rounded-full overflow-hidden">
                    <div className="h-full bg-[#8CB34A] rounded-full" style={{ width: `${width}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* User Growth Over Time */}
        <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col h-[320px]">
          <h3 className="font-heading font-medium text-[15px] text-[#E8EDD4] mb-6">User Growth Over Time</h3>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={USER_GROWTH_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A0D056" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#A0D056" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#5A752A', fontSize: 11, fontFamily: 'inherit' }} 
                  dy={10}
                />
                <YAxis hide />
                <Tooltip content={<CustomTooltip prefix="users: " />} cursor={{ stroke: '#2D3C13', strokeWidth: 1 }} />
                <Area 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#A0D056" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#areaGradient)" 
                  activeDot={{ r: 6, fill: '#111210', stroke: '#A0D056', strokeWidth: 2 }} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Host Performance */}
        <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col h-[320px]">
          <h3 className="font-heading font-medium text-[15px] text-[#E8EDD4] mb-6">Host Performance</h3>
          <div className="flex flex-col flex-1 justify-center gap-[14px]">
            {HOST_PERFORMANCE.map((host, i) => (
              <div key={i} className="flex items-center gap-4 w-full">
                <span className="font-sans text-[11px] text-[#72943A] w-[70px] text-right truncate shrink-0">{host.name}</span>
                <div className="flex-1 h-[24px] bg-[#111210] rounded-[4px] overflow-hidden flex items-center group">
                  <div 
                    className="h-full bg-[#8CB34A] rounded-r-[4px] transition-all duration-500 ease-out flex items-center justify-end pr-2 group-hover:bg-[#A0D056]" 
                    style={{ width: `${host.percent}%` }}
                  >
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Geographic Entry Distribution */}
        <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col h-[320px]">
          <h3 className="font-heading font-medium text-[15px] text-[#E8EDD4] mb-6">Geographic Entry Distribution</h3>
          <div className="flex flex-col gap-5 flex-1 justify-center">
            {GEOGRAPHIC_DATA.map((geo, i) => {
              const width = Math.max(geo.value, 2);
              return (
                <div key={i} className="flex flex-col gap-1.5 w-full">
                  <div className="flex items-center justify-between w-full">
                    <span className="font-sans text-[11px] text-[#72943A]">{geo.name}</span>
                    <span className="font-sans font-medium text-[11px] text-[#E8EDD4]">{geo.value}%</span>
                  </div>
                  <div className="w-full bg-[#111210] h-[4px] rounded-full overflow-hidden">
                    <div className="h-full bg-[#5A752A] rounded-full" style={{ width: `${width}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Export Actions */}
      <div className="flex items-center justify-center gap-4">
        <button className="flex items-center justify-center gap-2 h-[44px] px-6 rounded-[8px] bg-transparent border border-[#2D3C13] hover:border-[#43581E] text-[#72943A] hover:text-[#E8EDD4] font-sans font-medium text-[13px] transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Export as PDF
        </button>
        <button className="flex items-center justify-center gap-2 h-[44px] px-6 rounded-[8px] bg-transparent border border-[#2D3C13] hover:border-[#43581E] text-[#72943A] hover:text-[#E8EDD4] font-sans font-medium text-[13px] transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Export as CSV
        </button>
      </div>

    </div>
  );
}
