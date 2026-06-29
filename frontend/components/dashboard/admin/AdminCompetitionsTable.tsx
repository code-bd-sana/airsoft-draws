"use client";

import React, { useState } from "react";

const MOCK_COMPETITIONS = [
  { id: "1", title: "Sniper Rifle Set — L96A1", host: "Tactical Gear UK", category: "Rifles", price: 2.50, sold: 420, total: 500, percent: 84, status: "Live", created: "1 Jun 2025" },
  { id: "2", title: "VFC HK416 Bundle", host: "Airsoft World", category: "Rifles", price: 1.50, sold: 180, total: 400, percent: 45, status: "Live", created: "5 Jun 2025" },
  { id: "3", title: "Ghillie Suit Deluxe", host: "Combat Zone Ltd", category: "Gear", price: 1.00, sold: 0, total: 250, percent: 0, status: "Pending", created: "10 Jun 2025" },
  { id: "4", title: "Tactical Pistol Set", host: "Elite Shooters", category: "Pistols", price: 0.75, sold: 250, total: 250, percent: 100, status: "ended", created: "20 May 2025" },
  { id: "5", title: "Night Vision Bundle", host: "Strike Force Co", category: "Optics", price: 3.00, sold: 80, total: 200, percent: 40, status: "Draft", created: "12 Jun 2025" },
  { id: "6", title: "Battle Ready Helmet", host: "Alpha Tactical", category: "Gear", price: 0.50, sold: 0, total: 300, percent: 0, status: "Rejected", created: "8 Jun 2025" },
];

export default function AdminCompetitionsTable() {
  const [activeFilter, setActiveFilter] = useState("All");

  const getStatusPill = (status: string) => {
    switch (status) {
      case "Live":
        return <span className="px-3 py-1 rounded-full border border-[#4ADE80]/30 bg-[#083b18] text-[#4ADE80] font-sans font-medium text-[10px]">Live</span>;
      case "Pending":
        return <span className="px-3 py-1 rounded-full border border-[#D97706]/30 bg-[#78350F] text-[#F59E0B] font-sans font-medium text-[10px]">Pending</span>;
      case "Rejected":
        return <span className="px-3 py-1 rounded-full border border-[#EF4444]/30 bg-[#7F1D1D] text-[#f76b6b] font-sans font-medium text-[10px]">Rejected</span>;
      case "ended":
        return <span className="px-3 py-1 rounded-full border border-[#A78BFA]/30 bg-[#312E81] text-[#C4B5FD] font-sans font-medium text-[10px]">ended</span>;
      case "Draft":
        return <span className="px-3 py-1 rounded-full border border-[#D97706]/30 bg-[#78350F] text-[#F59E0B] font-sans font-medium text-[10px]">Draft</span>;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Controls Row */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 bg-[#111210] p-4 rounded-[16px] border border-[#2D3C13]">
        
        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-r border-[#2D3C13] pr-4 mr-2">
          {["All", "Live", "Pending", "Ended", "Rejected", "Draft"].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 rounded-full text-[12px] font-sans font-medium transition-colors whitespace-nowrap ${
                activeFilter === filter 
                  ? 'border border-[#8CB34A] text-[#8CB34A] bg-[#1A230A]' 
                  : 'border border-[#2D3C13] text-[#72943A] hover:border-[#43581E] hover:text-[#E8EDD4]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="flex items-center h-[40px] w-full lg:w-[360px] bg-[#0D0D0B] border border-[#2D3C13] rounded-[8px] px-3">
          <svg className="w-4 h-4 text-[#72943A] shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input 
            type="text" 
            placeholder="Search competitions..." 
            className="bg-transparent border-none outline-none text-[#E8EDD4] text-[13px] placeholder:text-[#5A752A] w-full ml-2 font-sans"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="w-full bg-[#161810] border border-[#2D3C13] rounded-[16px] overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[1000px] text-left border-collapse">
          <thead>
            <tr className="border-b border-[#2D3C13] bg-[#111210]">
              <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[25%]">TITLE / HOST</th>
              <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[12%]">CATEGORY</th>
              <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[12%] text-center">PRICE/TICKET</th>
              <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[18%]">TICKETS SOLD</th>
              <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[10%] text-center">STATUS</th>
              <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[13%] text-center">CREATED</th>
              <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[10%] text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_COMPETITIONS.map((comp, i) => (
              <tr key={comp.id} className={`${i !== MOCK_COMPETITIONS.length - 1 ? 'border-b border-[#2D3C13]' : ''} hover:bg-[#1A230A] transition-colors`}>
                <td className="py-4 px-6">
                  <div className="flex flex-col gap-1">
                    <span className="font-sans font-medium text-[13px] text-[#E8EDD4] truncate block max-w-[280px]">{comp.title}</span>
                    <span className="font-sans text-[11px] text-[#72943A] truncate block max-w-[280px]">{comp.host}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="font-sans text-[13px] text-[#72943A]">{comp.category}</span>
                </td>
                <td className="py-4 px-6 text-center">
                  <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">£{comp.price.toFixed(2)}</span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex flex-col gap-2 w-full max-w-[180px]">
                    <span className="font-sans font-medium text-[12px] text-[#E8EDD4]">{comp.sold}/{comp.total}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-full h-1 bg-[#0D0D0B] rounded-full overflow-hidden border border-[#2D3C13]">
                        <div 
                          className="h-full bg-[#8CB34A] rounded-full" 
                          style={{ width: `${comp.percent}%` }}
                        />
                      </div>
                      <span className="font-sans text-[10px] text-[#5A752A] shrink-0 w-[24px] text-right">{comp.percent}%</span>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-center">
                  {getStatusPill(comp.status)}
                </td>
                <td className="py-4 px-6 text-center">
                  <span className="font-sans font-medium text-[12px] text-[#72943A]">{comp.created}</span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-end gap-3">
                    <button className="text-[#5A752A] hover:text-[#8CB34A] transition-colors" title="View details">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                    </button>
                    
                    <button className="text-[#5A752A] hover:text-[#E8EDD4] transition-colors" title="Edit">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                      </svg>
                    </button>

                    <button className="text-[#5A752A] hover:text-[#F59E0B] transition-colors" title="Pause">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                      </svg>
                    </button>

                    <button className="text-[#5A752A] hover:text-[#EF4444] transition-colors" title="Delete">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
