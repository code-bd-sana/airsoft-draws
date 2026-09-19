"use client";

import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from "recharts";
import { useAdminReportsAnalytics } from "../../../hooks/useAdminHooks";

const CATEGORY_COLORS = ["#A0D056", "#72943A", "#445922", "#8CB34A", "#5A752A", "#384719"];

const CustomTooltip = ({ active, payload, label, prefix = "", suffix = "" }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#111210] border border-[#2D3C13] rounded-[8px] p-3 shadow-lg">
        <p className="font-sans text-[12px] text-[#72943A] mb-1">{label}</p>
        <p className="font-sans font-medium text-[14px] text-[#E8EDD4]">
          {prefix}{typeof payload[0].value === 'number' ? payload[0].value.toLocaleString() : payload[0].value}{suffix}
        </p>
      </div>
    );
  }
  return null;
};

// Interactive Skeletons for Analytics Cards
function ChartSkeleton() {
  return (
    <div className="w-full h-full flex flex-col justify-end gap-3 pt-6 pb-2 animate-pulse">
      <div className="flex items-end justify-between gap-3 h-full px-3">
        {[35, 60, 25, 80, 45, 90, 65].map((h, i) => (
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

function DonutSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-between px-4 animate-pulse">
      <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
        <div className="w-32 h-32 rounded-full border-[12px] border-[#1A230A] border-t-[#8CB34A]/40 border-r-[#5A752A]/30 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-[#111210] border border-[#2D3C13]/60" />
        </div>
      </div>
      <div className="flex flex-col gap-3.5 pr-2 flex-1 max-w-[140px] ml-4">
        {[80, 60, 90].map((w, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#2D3C13] shrink-0" />
            <div className="h-3 rounded bg-[#1A230A]" style={{ width: `${w}px` }} />
            <div className="h-3 w-6 rounded bg-[#1A230A] ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ListSkeleton({ rows = 4 }: { rows?: number }) {
  const widths = [65, 45, 80, 55, 70];
  return (
    <div className="flex flex-col gap-4 w-full h-full justify-center animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex flex-col gap-2 w-full">
          <div className="flex items-center justify-between w-full">
            <div className="h-3 bg-[#1A230A] rounded" style={{ width: `${110 + (i % 3) * 35}px` }} />
            <div className="h-3 w-14 bg-[#1A230A] rounded" />
          </div>
          <div className="w-full bg-[#111210] h-[5px] rounded-full overflow-hidden border border-[#2D3C13]/30">
            <div 
              className="h-full bg-gradient-to-r from-[#1A230A] to-[#2D3C13] rounded-full" 
              style={{ width: `${widths[i % widths.length]}%` }} 
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function HostSkeleton({ rows = 4 }: { rows?: number }) {
  const widths = [70, 40, 85, 55];
  return (
    <div className="flex flex-col gap-3.5 w-full h-full justify-center animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3.5 w-full">
          <div className="h-3 w-24 bg-[#1A230A] rounded shrink-0" />
          <div className="flex-1 h-[24px] bg-[#111210] rounded-[6px] border border-[#2D3C13]/50 overflow-hidden flex items-center p-1">
            <div 
              className="h-full bg-gradient-to-r from-[#1A230A] to-[#2D3C13] rounded-[4px]" 
              style={{ width: `${widths[i % widths.length]}%` }} 
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ReportsAnalyticsDashboard() {
  const [timeFilter, setTimeFilter] = useState("3M");

  const { data, isLoading, isFetching } = useAdminReportsAnalytics(timeFilter);

  const revenueData = data?.revenueTrend || [];
  const categoryData = (data?.salesByCategory || []).map((cat, idx) => ({
    name: cat.name,
    value: cat.value,
    color: cat.color || CATEGORY_COLORS[idx % CATEGORY_COLORS.length]
  }));
  const popularCompetitions = data?.popularCompetitions || [];
  const userGrowthData = data?.userGrowth || [];
  const hostPerformance = data?.hostPerformance || [];
  const geographicData = data?.geographicData || [];

  return (
    <div className="flex flex-col w-full animate-fadeIn">
      
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-heading font-semibold text-[18px] text-[#E8EDD4]">Analytics & Reports</h2>
          <p className="font-sans text-[13px] text-[#72943A]">Live business metrics and platform performance</p>
        </div>

        {/* Dynamic Time Filter */}
        <div className="flex items-center gap-1 bg-[#161810] border border-[#2D3C13] rounded-full p-1 self-start sm:self-auto">
          {(['7D', '1M', '3M', '1Y'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`px-3 py-1 rounded-full font-sans font-medium text-[12px] transition-all cursor-pointer ${
                timeFilter === filter
                  ? "bg-[#1A230A] border border-[#8CB34A] text-[#8CB34A] shadow-[0_0_10px_rgba(140,179,74,0.2)]"
                  : "text-[#72943A] hover:text-[#E8EDD4] border border-transparent"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Background loading indicator bar */}
      <div className="h-0.5 w-full bg-transparent overflow-hidden -mt-4 mb-6">
        {isFetching && (
          <div className="h-full bg-gradient-to-r from-transparent via-[#8CB34A] to-transparent animate-pulse w-full shadow-[0_0_8px_#8CB34A]" />
        )}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        
        {/* 1. Revenue Trend */}
        <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col h-[320px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-medium text-[15px] text-[#E8EDD4]">Revenue Trend</h3>
            <span className="font-sans text-[11px] text-[#8CB34A] bg-[#1A230A] border border-[#2D3C13] px-2 py-0.5 rounded-full">
              Ticket Sales
            </span>
          </div>
          <div className="flex-1 w-full min-h-0">
            {isLoading ? (
              <ChartSkeleton />
            ) : revenueData.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-xs font-sans text-[#5A752A]">No revenue recorded in this period.</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
            )}
          </div>
        </div>

        {/* 2. Sales by Category */}
        <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col h-[320px]">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-heading font-medium text-[15px] text-[#E8EDD4]">Category Distribution</h3>
            <span className="font-sans text-[11px] text-[#5A752A]">By Raffles / Sales</span>
          </div>
          <div className="flex-1 w-full flex items-center justify-center relative min-h-0">
            {isLoading ? (
              <DonutSkeleton />
            ) : categoryData.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-xs font-sans text-[#5A752A]">No categories available.</span>
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="35%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      stroke="none"
                      dataKey="value"
                      paddingAngle={2}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip suffix="%" />} />
                  </PieChart>
                </ResponsiveContainer>
                
                {/* Custom Legend */}
                <div className="absolute right-[5%] top-1/2 -translate-y-1/2 flex flex-col gap-3 max-h-[220px] overflow-y-auto no-scrollbar">
                  {categoryData.map((cat, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }}></div>
                      <span className="font-sans text-[11px] text-[#72943A] w-[70px] truncate" title={cat.name}>{cat.name}</span>
                      <span className="font-sans font-medium text-[11px] text-[#E8EDD4]">{cat.value}%</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* 3. Most Popular Competitions */}
        <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col h-[320px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-medium text-[15px] text-[#E8EDD4]">Popular Competitions</h3>
            <span className="font-sans text-[11px] text-[#5A752A]">Tickets Sold</span>
          </div>
          <div className="flex flex-col gap-4 flex-1 justify-center">
            {isLoading ? (
              <ListSkeleton rows={4} />
            ) : popularCompetitions.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-xs font-sans text-[#5A752A]">No competitions found.</span>
              </div>
            ) : (
              popularCompetitions.map((comp, i) => {
                const maxVal = comp.maxValue || 10;
                const width = Math.max((comp.value / maxVal) * 100, comp.value > 0 ? 8 : 2);
                return (
                  <div key={i} className="flex flex-col gap-1.5 w-full">
                    <div className="flex items-center justify-between w-full">
                      <span className="font-sans text-[11px] text-[#72943A] truncate max-w-[200px]" title={comp.name}>
                        {comp.name}
                      </span>
                      <span className="font-sans font-medium text-[11px] text-[#E8EDD4] shrink-0">
                        {comp.value} {comp.totalTickets ? `/ ${comp.totalTickets}` : 'tickets'}
                      </span>
                    </div>
                    <div className="w-full bg-[#111210] h-[4px] rounded-full overflow-hidden">
                      <div className="h-full bg-[#8CB34A] rounded-full" style={{ width: `${width}%` }}></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* 4. User Growth Over Time */}
        <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col h-[320px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-medium text-[15px] text-[#E8EDD4]">User Growth</h3>
            <span className="font-sans text-[11px] text-[#5A752A]">New Members</span>
          </div>
          <div className="flex-1 w-full min-h-0">
            {isLoading ? (
              <ChartSkeleton />
            ) : userGrowthData.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-xs font-sans text-[#5A752A]">No user signups in this period.</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={userGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
            )}
          </div>
        </div>

        {/* 5. Host Performance */}
        <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col h-[320px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-medium text-[15px] text-[#E8EDD4]">Host Performance</h3>
            <span className="font-sans text-[11px] text-[#5A752A]">Verified Operators</span>
          </div>
          <div className="flex flex-col flex-1 justify-center gap-[14px]">
            {isLoading ? (
              <HostSkeleton rows={4} />
            ) : hostPerformance.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-xs font-sans text-[#5A752A]">No verified hosts found.</span>
              </div>
            ) : (
              hostPerformance.map((host, i) => (
                <div key={i} className="flex items-center gap-4 w-full">
                  <span className="font-sans text-[11px] text-[#72943A] w-[90px] text-right truncate shrink-0" title={host.name}>
                    {host.name}
                  </span>
                  <div className="flex-1 h-[24px] bg-[#111210] rounded-[6px] overflow-hidden flex items-center group relative border border-[#2D3C13]/40">
                    <div 
                      className="h-full bg-[#8CB34A] rounded-r-[4px] transition-all duration-500 ease-out flex items-center justify-end pr-2 group-hover:bg-[#A0D056]" 
                      style={{ width: `${Math.max(host.percent, 8)}%` }}
                    >
                    </div>
                    <span className="absolute right-2 text-[10px] font-sans text-[#E8EDD4] font-medium">
                      {host.percent}% ({host.rafflesCount} draws)
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 6. Geographic Entry Distribution */}
        <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col h-[320px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-medium text-[15px] text-[#E8EDD4]">Geographic Distribution</h3>
            <span className="font-sans text-[11px] text-[#5A752A]">User Locations</span>
          </div>
          <div className="flex flex-col gap-4 flex-1 justify-center">
            {isLoading ? (
              <ListSkeleton rows={4} />
            ) : geographicData.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-xs font-sans text-[#5A752A]">No geographic records found.</span>
              </div>
            ) : (
              geographicData.map((geo, i) => {
                const width = Math.max(geo.value, 4);
                return (
                  <div key={i} className="flex flex-col gap-1.5 w-full">
                    <div className="flex items-center justify-between w-full">
                      <span className="font-sans text-[11px] text-[#72943A]">{geo.name}</span>
                      <span className="font-sans font-medium text-[11px] text-[#E8EDD4]">
                        {geo.value}% ({geo.count} users)
                      </span>
                    </div>
                    <div className="w-full bg-[#111210] h-[4px] rounded-full overflow-hidden">
                      <div className="h-full bg-[#5A752A] rounded-full" style={{ width: `${width}%` }}></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
