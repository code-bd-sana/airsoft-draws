"use client";

import React, { useState } from "react";
import ReviewHostModal, { HostApplicationData } from "./ReviewHostModal";

const MOCK_HOSTS = [
  { id: "1", initials: "TG", name: "Tactical Gear UK", email: "contact@tacticaluk.com", plan: "Pro", raffles: 24, revenue: "£12,400", status: "Active" },
  { id: "2", initials: "AW", name: "Airsoft World", email: "info@airsoftworld.co", plan: "Premium", raffles: 18, revenue: "£10,800", status: "Active" },
  { id: "3", initials: "CZ", name: "Combat Zone Ltd", email: "admin@combatzone.io", plan: "Pending Approval", raffles: 0, revenue: "£0", status: "Pending Approval" },
  { id: "4", initials: "ES", name: "Elite Shooters", email: "elite@shooters.co.uk", plan: "Free", raffles: 5, revenue: "£3,200", status: "Active" },
  { id: "5", initials: "SF", name: "Strike Force Co", email: "ops@strikeforce.co", plan: "Premium", raffles: 11, revenue: "£7,800", status: "Suspended" },
  { id: "6", initials: "AT", name: "Alpha Tactical", email: "team@alphatactical.com", plan: "Pending Approval", raffles: 0, revenue: "£0", status: "Pending Approval" },
];

export default function HostsTable() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHost, setSelectedHost] = useState<HostApplicationData | null>(null);

  const handleReview = (host: any) => {
    // Constructing mock detailed data for the modal based on the selected row
    setSelectedHost({
      id: host.id,
      brandName: host.name,
      email: host.email,
      bio: "Specialist airsoft retailer with 8 years experience",
      contact: "+44 7700 900123",
      payoutMethod: "Bank Transfer — Barclays ****4921",
      social: "@tacticaluk on Instagram",
    });
    setIsModalOpen(true);
  };

  const getStatusPill = (status: string) => {
    switch (status) {
      case "Active":
        return <span className="px-3 py-1 rounded-full border border-[#4ADE80]/30 bg-[#083b18] text-[#4ADE80] font-sans font-medium text-[10px]">Active</span>;
      case "Pending Approval":
        return <span className="px-3 py-1 rounded-full border border-[#D97706]/30 bg-[#78350F] text-[#F59E0B] font-sans font-medium text-[10px]">Pending Approval</span>;
      case "Suspended":
        return <span className="px-3 py-1 rounded-full border border-[#EF4444]/30 bg-[#7F1D1D] text-[#f76b6b] font-sans font-medium text-[10px]">Suspended</span>;
      default:
        return null;
    }
  };

  const getPlanPill = (plan: string) => {
    switch (plan) {
      case "Pro":
      case "Premium":
      case "Free":
        return <span className="px-3 py-1 rounded-full border border-[#8CB34A] bg-[#1A230A] text-[#A0D056] font-sans font-medium text-[10px]">{plan}</span>;
      case "Pending Approval":
        return <span className="px-3 py-1 rounded-full border border-[#D97706]/30 bg-[#78350F] text-[#F59E0B] font-sans font-medium text-[10px]">{plan}</span>;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Controls Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Left: Search & Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
          {/* Search Input */}
          <div className="flex items-center h-[40px] w-full sm:w-[360px] bg-[#0D0D0B] border border-[#2D3C13] rounded-[8px] px-3">
            <svg className="w-4 h-4 text-[#72943A] shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input 
              type="text" 
              placeholder="Search hosts..." 
              className="bg-transparent border-none outline-none text-[#E8EDD4] text-[13px] placeholder:text-[#5A752A] w-full ml-2 font-sans"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {["All", "Pending", "Active", "Suspended"].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-1.5 rounded-full text-[12px] font-sans font-medium transition-colors whitespace-nowrap ${
                  activeFilter === filter 
                    ? 'border border-[#8CB34A] text-[#8CB34A]' 
                    : 'border border-[#2D3C13] text-[#72943A] hover:border-[#43581E] hover:text-[#E8EDD4]'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="w-full bg-[#161810] border border-[#2D3C13] rounded-[16px] overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[1000px] text-left border-collapse">
          <thead>
            <tr className="border-b border-[#2D3C13] bg-[#111210]">
              <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[25%]">HOST</th>
              <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[20%]">EMAIL</th>
              <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[15%] text-center">PLAN</th>
              <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[10%] text-center">ACTIVE RAFFLES</th>
              <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[10%] text-center">REVENUE</th>
              <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[10%] text-center">STATUS</th>
              <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[10%] text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_HOSTS.map((host, i) => (
              <tr key={host.id} className={`${i !== MOCK_HOSTS.length - 1 ? 'border-b border-[#2D3C13]' : ''} hover:bg-[#1A230A] transition-colors`}>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#1A230A] border border-[#43581E] flex items-center justify-center shrink-0">
                      <span className="font-sans font-medium text-[11px] text-[#8CB34A]">{host.initials}</span>
                    </div>
                    <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">{host.name}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="font-sans text-[13px] text-[#72943A]">{host.email}</span>
                </td>
                <td className="py-4 px-6 text-center">
                  {getPlanPill(host.plan)}
                </td>
                <td className="py-4 px-6 text-center">
                  <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">{host.raffles}</span>
                </td>
                <td className="py-4 px-6 text-center">
                  <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">{host.revenue}</span>
                </td>
                <td className="py-4 px-6 text-center">
                  {getStatusPill(host.status)}
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-end gap-3">
                    <button 
                      onClick={() => handleReview(host)}
                      className="text-[#5A752A] hover:text-[#8CB34A] transition-colors" 
                      title="View details"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                    </button>
                    
                    {host.status === "Pending Approval" ? (
                      <>
                        <button 
                          onClick={() => handleReview(host)}
                          className="px-3 py-1 rounded-[6px] bg-[#8CB34A] hover:bg-[#A0D056] text-[#0D0D0B] font-sans font-medium text-[11px] transition-colors"
                        >
                          Approve
                        </button>
                        <button className="text-[#f76b6b] hover:text-[#ef4444] transition-colors" title="Reject">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                        </button>
                      </>
                    ) : (
                      <button className="text-[#5A752A] hover:text-[#f76b6b] transition-colors" title="Suspend/Pause">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                        </svg>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ReviewHostModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        data={selectedHost} 
      />
    </div>
  );
}
