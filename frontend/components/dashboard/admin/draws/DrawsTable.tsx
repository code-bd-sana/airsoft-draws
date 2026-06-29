"use client";

import React, { useState } from "react";

interface DrawData {
  id: string;
  name: string;
  host: string;
  hostInitials: string;
  type: string;
  scheduledTime: string;
  totalTickets: number;
  status: string;
}

const MOCK_DRAWS: DrawData[] = [
  { id: "1", name: "Sniper Rifle Set", host: "Tactical Gear UK", hostInitials: "TG", type: "Auto", scheduledTime: "30 Jun 2025 14:00", totalTickets: 420, status: "Scheduled" },
  { id: "2", name: "VFC HK416 Bundle", host: "Airsoft World", hostInitials: "AW", type: "Auto", scheduledTime: "15 Jul 2025 20:00", totalTickets: 185, status: "Scheduled" },
  { id: "3", name: "Tactical Pistol Set", host: "Elite Shooters", hostInitials: "ES", type: "Manual", scheduledTime: "24 May 2025 18:00", totalTickets: 250, status: "Completed" },
  { id: "4", name: "Night Vision Bundle", host: "Strike Force Co", hostInitials: "SF", type: "Auto", scheduledTime: "Now", totalTickets: 89, status: "In Progress" },
];

export default function DrawsTable({ onSelectDraw }: { onSelectDraw: (draw: DrawData) => void }) {
  const getStatusPill = (status: string) => {
    switch (status) {
      case "Scheduled":
        return <span className="px-3 py-1 rounded-full border border-[#D97706]/30 bg-[#78350F] text-[#F59E0B] font-sans font-medium text-[10px]">{status}</span>;
      case "Completed":
        return <span className="px-3 py-1 rounded-full border border-[#4ADE80]/30 bg-[#083b18] text-[#4ADE80] font-sans font-medium text-[10px]">{status}</span>;
      case "In Progress":
        return <span className="px-3 py-1 rounded-full border border-[#EAB308]/30 bg-[#854D0E] text-[#FDE047] font-sans font-medium text-[10px]">{status}</span>;
      default:
        return null;
    }
  };

  const getTypeStyle = (type: string) => {
    if (type === "Auto") return "text-[#4ADE80]";
    if (type === "Manual") return "text-[#F59E0B]";
    return "text-[#E8EDD4]";
  };

  return (
    <div className="w-full bg-[#161810] border border-[#2D3C13] rounded-[16px] overflow-hidden overflow-x-auto">
      <table className="w-full min-w-[900px] text-left border-collapse">
        <thead>
          <tr className="border-b border-[#2D3C13] bg-[#111210]">
            <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[20%]">COMPETITION NAME</th>
            <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[20%]">HOST</th>
            <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[10%] text-center">DRAW TYPE</th>
            <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[15%] text-center">SCHEDULED TIME</th>
            <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[10%] text-center">TOTAL TICKETS</th>
            <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[12%] text-center">STATUS</th>
            <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[13%] text-right">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {MOCK_DRAWS.map((draw, i) => (
            <tr key={draw.id} className={`${i !== MOCK_DRAWS.length - 1 ? 'border-b border-[#2D3C13]' : ''} hover:bg-[#1A230A] transition-colors`}>
              <td className="py-4 px-6">
                <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">{draw.name}</span>
              </td>
              <td className="py-4 px-6">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#1A230A] border border-[#43581E] flex items-center justify-center shrink-0">
                    <span className="font-sans font-medium text-[9px] text-[#8CB34A]">{draw.hostInitials}</span>
                  </div>
                  <span className="font-sans text-[13px] text-[#72943A]">{draw.host}</span>
                </div>
              </td>
              <td className="py-4 px-6 text-center">
                <span className={`font-sans font-medium text-[12px] ${getTypeStyle(draw.type)}`}>{draw.type}</span>
              </td>
              <td className="py-4 px-6 text-center">
                <span className={`font-sans font-medium text-[12px] ${draw.scheduledTime === 'Now' ? 'text-[#F59E0B]' : 'text-[#72943A]'}`}>{draw.scheduledTime}</span>
              </td>
              <td className="py-4 px-6 text-center">
                <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">{draw.totalTickets}</span>
              </td>
              <td className="py-4 px-6 text-center">
                {getStatusPill(draw.status)}
              </td>
              <td className="py-4 px-6">
                <div className="flex items-center justify-end gap-3">
                  <button 
                    onClick={() => onSelectDraw(draw)}
                    className="font-sans font-medium text-[12px] text-[#72943A] hover:text-[#E8EDD4] transition-colors"
                  >
                    View
                  </button>
                  {draw.status === "In Progress" && (
                    <button className="h-[28px] px-3 rounded-[6px] bg-transparent border border-[#8CB34A] text-[#8CB34A] hover:bg-[#8CB34A]/10 font-heading font-medium text-[11px] transition-colors">
                      Force Draw
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
