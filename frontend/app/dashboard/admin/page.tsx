"use client";

import React from "react";
import Link from "next/link";
import { AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { useAdminOverviewStats } from "../../../hooks/useAdminHooks";

const REVENUE_DATA = [
  { name: 'Jan', value: 30000 },
  { name: 'Feb', value: 45000 },
  { name: 'Mar', value: 42000 },
  { name: 'Apr', value: 65000 },
  { name: 'May', value: 60000 },
  { name: 'Jun', value: 75000 },
  { name: 'Jul', value: 85000 },
  { name: 'Aug', value: 82000 },
  { name: 'Sep', value: 95000 },
  { name: 'Oct', value: 90000 },
  { name: 'Nov', value: 105000 },
  { name: 'Dec', value: 98000 },
];

const GROWTH_DATA = [
  { name: 'Jan', Users: 120, Hosts: 40 },
  { name: 'Feb', Users: 150, Hosts: 50 },
  { name: 'Mar', Users: 180, Hosts: 60 },
  { name: 'Apr', Users: 240, Hosts: 75 },
  { name: 'May', Users: 280, Hosts: 90 },
  { name: 'Jun', Users: 350, Hosts: 120 },
];

export default function AdminDashboardPage() {
  const { data: overview, isLoading } = useAdminOverviewStats();

  return (
    <div className="flex flex-col gap-6 p-8 max-w-[1660px] mx-auto w-full animate-fadeIn">
      
      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        
        {/* Total Users */}
        <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col gap-2">
          <span className="font-sans text-[11px] font-medium text-[#5A752A] uppercase tracking-[1px]">
            Total Users
          </span>
          <div className="flex flex-col gap-1 mt-1">
            <span className="font-heading font-bold text-[32px] text-[#E8EDD4] leading-none">
              {isLoading ? "..." : overview?.stats.totalUsers ?? 0}
            </span>
            <div className="flex items-center gap-1.5 mt-2">
              <div className="px-2 py-0.5 rounded-full bg-[#083b18] flex items-center justify-center">
                <span className="font-sans font-medium text-[10px] text-[#4ADE80]">Registered Members</span>
              </div>
            </div>
          </div>
        </div>

        {/* Active Hosts */}
        <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col gap-2">
          <span className="font-sans text-[11px] font-medium text-[#5A752A] uppercase tracking-[1px]">
            Active Hosts
          </span>
          <div className="flex flex-col gap-1 mt-1">
            <span className="font-heading font-bold text-[32px] text-[#E8EDD4] leading-none">
              {isLoading ? "..." : overview?.stats.activeHosts ?? 0}
            </span>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="font-sans text-[11px] text-[#8CB34A]">Verified Operators</span>
            </div>
          </div>
        </div>

        {/* Live Raffles */}
        <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col gap-2">
          <span className="font-sans text-[11px] font-medium text-[#5A752A] uppercase tracking-[1px]">
            Live Raffles
          </span>
          <div className="flex flex-col gap-1 mt-1">
            <span className="font-heading font-bold text-[32px] text-[#E8EDD4] leading-none">
              {isLoading ? "..." : overview?.stats.liveRaffles ?? 0}
            </span>
            <div className="flex items-center gap-1.5 mt-2">
              <div className="px-2 py-0.5 rounded-full bg-[#083b18] flex items-center justify-center">
                <span className="font-sans font-medium text-[10px] text-[#4ADE80]">Active Draws</span>
              </div>
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col gap-2">
          <span className="font-sans text-[11px] font-medium text-[#5A752A] uppercase tracking-[1px]">
            Total Revenue
          </span>
          <div className="flex flex-col gap-1 mt-1">
            <span className="font-heading font-bold text-[32px] text-[#E8EDD4] leading-none">
              {isLoading ? "..." : `£${(overview?.stats.totalRevenue ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </span>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="font-sans text-[11px] text-[#5A752A]">Ticket Sales</span>
            </div>
          </div>
        </div>

      </div>

      {/* Middle Grid (Revenue Chart & Awaiting Review) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Platform Revenue Chart */}
        <div className="lg:col-span-2 bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col">
          <div className="flex items-start justify-between mb-8">
            <div className="flex flex-col gap-2">
              <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">Platform Revenue</span>
              <div className="flex items-center gap-3">
                <span className="font-heading font-bold text-[28px] text-[#E8EDD4]">
                  {isLoading ? "..." : `£${(overview?.stats.totalRevenue ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </span>
                <div className="px-2 py-0.5 rounded-full bg-[#083b18] flex items-center justify-center">
                  <svg className="w-3 h-3 text-[#4ADE80]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                  </svg>
                  <span className="font-sans font-medium text-[10px] text-[#4ADE80] ml-1">Live</span>
                </div>
              </div>
            </div>
            
            {/* Chart Filters */}
            <div className="flex items-center gap-1 bg-[#0D0D0B] border border-[#2D3C13] rounded-[8px] p-1">
              {['7D', '1M', '6M', '1Y'].map((filter, i) => (
                <button 
                  key={filter} 
                  className={`px-3 py-1 rounded-[6px] font-sans font-medium text-[11px] transition-colors ${
                    i === 3 ? 'bg-[#1A230A] text-[#8CB34A]' : 'text-[#72943A] hover:text-[#E8EDD4]'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
          
          <div className="w-full h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8CB34A" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8CB34A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#5A752A', fontSize: 10, fontFamily: 'sans-serif' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#5A752A', fontSize: 10, fontFamily: 'sans-serif' }}
                  tickFormatter={(val) => `£${val / 1000}k`}
                />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#0D0D0B', borderColor: '#2D3C13', borderRadius: '8px' }}
                  itemStyle={{ color: '#E8EDD4' }}
                />
                <Area type="monotone" dataKey="value" stroke="#8CB34A" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Awaiting Your Review */}
        <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">Awaiting Your Review</span>
            <div className="w-[18px] h-[18px] rounded-full bg-[#f76b6b] flex items-center justify-center shrink-0">
              <span className="font-sans font-bold text-[10px] text-[#0D0D0B]">
                {isLoading ? "..." : overview?.awaitingReview.count ?? 0}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col gap-4 flex-1">
            {isLoading ? (
              <div className="py-8 text-center text-[#5A752A] font-sans text-sm animate-pulse">Loading review items...</div>
            ) : overview?.awaitingReview.list.length === 0 ? (
              <div className="py-8 text-center text-[#5A752A] font-sans text-sm">No items pending review.</div>
            ) : (
              overview?.awaitingReview.list.map((item) => (
                <div key={item.id} className="flex items-center justify-between pb-4 border-b border-[#2D3C13] last:border-b-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#1A230A] border border-[#2D3C13] flex items-center justify-center shrink-0">
                      <span className="font-sans font-medium text-[10px] text-[#8CB34A]">{item.icon}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">{item.title}</span>
                      <span className="font-sans text-[11px] text-[#5A752A]">{item.sub}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <Link href="/dashboard/admin/raffles" className="w-full mt-4 h-[40px] rounded-[8px] bg-transparent border border-[#2D3C13] hover:bg-[#1A230A] text-[#E8EDD4] font-sans font-medium text-[13px] transition-colors flex items-center justify-center cursor-pointer">
            Review All →
          </Link>
        </div>

      </div>

      {/* Lower Grid (Growth Chart & Top Hosts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* User & Host Growth Chart */}
        <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">User & Host Growth</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#8CB34A]" />
                <span className="font-sans text-[11px] text-[#5A752A]">Users</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#A0D056]" />
                <span className="font-sans text-[11px] text-[#5A752A]">Hosts</span>
              </div>
            </div>
          </div>
          
          <div className="w-full h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={GROWTH_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#5A752A', fontSize: 10, fontFamily: 'sans-serif' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#5A752A', fontSize: 10, fontFamily: 'sans-serif' }}
                />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#0D0D0B', borderColor: '#2D3C13', borderRadius: '8px' }}
                  itemStyle={{ color: '#E8EDD4' }}
                  cursor={{ fill: '#1A230A' }}
                />
                <Bar dataKey="Users" fill="#8CB34A" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Hosts This Month */}
        <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">Top Hosts This Month</span>
            <button className="font-sans font-medium text-[11px] text-[#72943A] hover:text-[#E8EDD4] transition-colors">
              View All →
            </button>
          </div>
          
          <div className="flex flex-col gap-4">
            {[
              { rank: 1, name: "Tactical Gear UK", revenue: "£12,400", initials: "TG" },
              { rank: 2, name: "Airsoft World", revenue: "£10,800", initials: "AW" },
              { rank: 3, name: "Combat Zone Ltd", revenue: "£9,200", initials: "CZ" },
              { rank: 4, name: "Elite Shooters", revenue: "£7,800", initials: "ES" },
              { rank: 5, name: "Strike Force Co", revenue: "£5,400", initials: "SF" },
            ].map((host) => (
              <div key={host.rank} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="font-sans font-medium text-[12px] text-[#5A752A] w-4 text-right">
                    {host.rank}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-[#1A230A] border border-[#2D3C13] flex items-center justify-center shrink-0">
                    <span className="font-sans font-medium text-[9px] text-[#8CB34A]">{host.initials}</span>
                  </div>
                  <span className="font-sans text-[13px] text-[#E8EDD4]">{host.name}</span>
                </div>
                <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">
                  {host.revenue}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recent Activity Footer */}
      <div className="w-full bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col gap-5 overflow-hidden">
        <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">Recent Activity</span>
        
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar pb-2">
          {isLoading ? (
            <div className="py-4 text-center text-[#5A752A] font-sans text-sm animate-pulse">Loading recent activity...</div>
          ) : overview?.recentActivity.length === 0 ? (
            <div className="py-4 text-center text-[#5A752A] font-sans text-sm">No recent activity.</div>
          ) : (
            overview?.recentActivity.map((activity, i) => (
              <div key={i} className="flex items-start gap-3 shrink-0 min-w-[280px]">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border ${
                  activity.highlight ? 'bg-[#78350F] border-[#D97706]/30 text-[#F59E0B]' :
                  activity.alert ? 'bg-[#7F1D1D] border-[#EF4444]/30 text-[#f76b6b]' :
                  'bg-[#083b18] border-[#4ADE80]/30 text-[#4ADE80]'
                }`}>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className={`font-sans text-[12px] truncate ${
                    activity.highlight ? 'text-[#F59E0B]' :
                    activity.alert ? 'text-[#f76b6b]' :
                    'text-[#72943A]'
                  }`}>
                    {activity.text}
                  </span>
                  <span className="font-sans text-[10px] text-[#5A752A] mt-0.5">{activity.time}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
