"use client";

import React, { useState } from "react";

interface LogData {
  id: string;
  timestamp: string;
  actor: {
    name: string;
    initials: string;
    type: "admin" | "system" | "user";
  };
  description: string;
  ip: string;
  status: "Success" | "Failed";
}

const MOCK_LOGS: LogData[] = [
  {
    id: "1",
    timestamp: "2025-06-15 18:24:11",
    actor: { name: "Admin Sarah K.", initials: "SK", type: "admin" },
    description: "Approved competition 'Sniper Rifle Set'",
    ip: "185.12.44.201",
    status: "Success"
  },
  {
    id: "2",
    timestamp: "2025-06-15 17:51:30",
    actor: { name: "System", initials: "SY", type: "system" },
    description: "Auto-draw winner for 'VFC HK416 Bundle'",
    ip: "—",
    status: "Success"
  },
  {
    id: "3",
    timestamp: "2025-06-15 16:40:08",
    actor: { name: "User john@example.com", initials: "JD", type: "user" },
    description: "Failed login attempt — incorrect password",
    ip: "92.28.11.4",
    status: "Failed"
  },
  {
    id: "4",
    timestamp: "2025-06-15 15:22:44",
    actor: { name: "Admin Sarah K.", initials: "SK", type: "admin" },
    description: "Updated commission settings — Pro plan 8% -> 7%",
    ip: "185.12.44.201",
    status: "Success"
  },
  {
    id: "5",
    timestamp: "2025-06-15 14:09:17",
    actor: { name: "System", initials: "SY", type: "system" },
    description: "Automatic backup completed",
    ip: "—",
    status: "Success"
  },
  {
    id: "6",
    timestamp: "2025-06-15 13:44:52",
    actor: { name: "User emma@example.com", initials: "EC", type: "user" },
    description: "Purchased 6 tickets for 'Night Vision Bundle'",
    ip: "78.14.22.9",
    status: "Success"
  },
  {
    id: "7",
    timestamp: "2025-06-15 12:30:00",
    actor: { name: "Admin Sarah K.", initials: "SK", type: "admin" },
    description: "Rejected host application — Strike Force Co",
    ip: "185.12.44.201",
    status: "Success"
  }
];

export default function LogsActivityTable() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = ["All", "User Actions", "Admin Actions", "System Events", "Errors"];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Success":
        return "border-[#4ADE80]/30 bg-[#083b18] text-[#4ADE80]";
      case "Failed":
        return "border-[#DC2626]/30 bg-[#7f1d1d] text-[#EF4444]";
      default:
        return "border-[#2D3C13] bg-[#111210] text-[#72943A]";
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full mt-2 animate-fadeIn">
      
      {/* Top Controls Area */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 shrink-0">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full font-sans font-medium text-[12px] whitespace-nowrap transition-colors ${
                activeFilter === filter
                  ? "bg-transparent border border-[#8CB34A] text-[#E8EDD4]"
                  : "bg-transparent border border-[#2D3C13] text-[#72943A] hover:bg-[#1A230A] hover:text-[#A0D056]"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Inputs */}
        <div className="flex flex-1 items-center gap-3 w-full max-w-[400px]">
          <input 
            type="text" 
            placeholder="Search logs..." 
            className="flex-1 h-[36px] bg-[#111210] border border-[#2D3C13] rounded-[8px] px-4 text-[13px] text-[#E8EDD4] placeholder:text-[#5A752A] outline-none focus:border-[#43581E] transition-colors"
          />
          <input 
            type="text" 
            placeholder="Filter by date..." 
            className="flex-1 h-[36px] bg-[#111210] border border-[#2D3C13] rounded-[8px] px-4 text-[13px] text-[#E8EDD4] placeholder:text-[#5A752A] outline-none focus:border-[#43581E] transition-colors"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="w-full bg-[#161810] border border-[#2D3C13] rounded-[16px] overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[1050px] text-left border-collapse">
          <thead>
            <tr className="border-b border-[#2D3C13] bg-[#111210]">
              <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[18%]">TIMESTAMP</th>
              <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[20%]">ACTOR</th>
              <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[35%]">ACTION DESCRIPTION</th>
              <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[15%]">IP ADDRESS</th>
              <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[12%] text-right">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_LOGS.map((log, i) => (
              <tr key={log.id} className={`${i !== MOCK_LOGS.length - 1 ? 'border-b border-[#2D3C13]' : ''} hover:bg-[#1A230A] transition-colors`}>
                <td className="py-5 px-6">
                  <span className="font-sans text-[13px] text-[#72943A]">{log.timestamp}</span>
                </td>
                <td className="py-5 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#1A230A] border border-[#43581E] flex items-center justify-center shrink-0">
                      <span className="font-sans font-medium text-[10px] text-[#8CB34A]">{log.actor.initials}</span>
                    </div>
                    <span className="font-sans font-medium text-[13px] text-[#E8EDD4] truncate max-w-[150px]">{log.actor.name}</span>
                  </div>
                </td>
                <td className="py-5 px-6">
                  <span className="font-sans text-[13px] text-[#72943A] leading-relaxed">{log.description}</span>
                </td>
                <td className="py-5 px-6">
                  <span className="font-sans text-[13px] text-[#72943A]">{log.ip}</span>
                </td>
                <td className="py-5 px-6 text-right">
                  <span className={`px-3 py-1 rounded-full border font-sans font-medium text-[10px] whitespace-nowrap ${getStatusStyle(log.status)}`}>
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Footer actions */}
        <div className="flex items-center justify-between p-6 bg-[#161810]">
          <button className="flex items-center justify-center gap-2 h-[36px] px-4 rounded-[8px] bg-transparent border border-[#2D3C13] hover:border-[#43581E] text-[#72943A] hover:text-[#E8EDD4] font-sans font-medium text-[12px] transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export Logs
          </button>
          
          {/* Pagination */}
          <div className="flex items-center gap-1.5">
            <button className="w-8 h-8 rounded-[6px] border border-[#8CB34A] bg-[#1A230A] text-[#E8EDD4] font-sans font-medium text-[12px] flex items-center justify-center transition-colors">1</button>
            <button className="w-8 h-8 rounded-[6px] border border-[#2D3C13] hover:border-[#43581E] bg-transparent text-[#72943A] hover:text-[#E8EDD4] font-sans font-medium text-[12px] flex items-center justify-center transition-colors">2</button>
            <button className="w-8 h-8 rounded-[6px] border border-[#2D3C13] hover:border-[#43581E] bg-transparent text-[#72943A] hover:text-[#E8EDD4] font-sans font-medium text-[12px] flex items-center justify-center transition-colors">3</button>
            <span className="text-[#5A752A] px-1 font-sans">...</span>
            <button className="w-8 h-8 rounded-[6px] border border-[#2D3C13] hover:border-[#43581E] bg-transparent text-[#72943A] hover:text-[#E8EDD4] font-sans font-medium text-[12px] flex items-center justify-center transition-colors">12</button>
          </div>
        </div>
      </div>
    </div>
  );
}
