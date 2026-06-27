"use client";

import React, { useState } from "react";

const MOCK_USERS = [
  { id: "1", initials: "JT", name: "James Thornton", email: "j.thornton@email.com", joined: "12 Jan 2025", tickets: 48, spent: "£124.00", status: "Active" },
  { id: "2", initials: "SM", name: "Sarah Mitchell", email: "s.mitchell@email.com", joined: "3 Feb 2025", tickets: 12, spent: "£31.00", status: "Active" },
  { id: "3", initials: "OB", name: "Oliver Bennett", email: "o.bennett@email.com", joined: "15 Feb 2025", tickets: 0, spent: "£0.00", status: "Unverified" },
  { id: "4", initials: "EC", name: "Emma Clarke", email: "e.clarke@email.com", joined: "25 Feb 2025", tickets: 6, spent: "£15.00", status: "Blocked" },
  { id: "5", initials: "NW", name: "Noah Williams", email: "n.williams@email.com", joined: "5 Mar 2025", tickets: 94, spent: "£245.00", status: "Active" },
  { id: "6", initials: "AD", name: "Amelia Davis", email: "a.davis@email.com", joined: "14 Mar 2025", tickets: 33, spent: "£86.00", status: "Active" },
  { id: "7", initials: "LJ", name: "Liam Johnson", email: "l.johnson@email.com", joined: "22 Mar 2025", tickets: 0, spent: "£0.00", status: "Blocked" },
];

export default function UsersTable() {
  const [activeFilter, setActiveFilter] = useState("All");

  const getStatusPill = (status: string) => {
    switch (status) {
      case "Active":
        return <span className="px-3 py-1 rounded-full border border-[#4ADE80]/30 bg-[#083b18] text-[#4ADE80] font-sans font-medium text-[10px]">Active</span>;
      case "Unverified":
        return <span className="px-3 py-1 rounded-full border border-[#D97706]/30 bg-[#78350F] text-[#F59E0B] font-sans font-medium text-[10px]">Unverified</span>;
      case "Blocked":
        return <span className="px-3 py-1 rounded-full border border-[#EF4444]/30 bg-[#7F1D1D] text-[#f76b6b] font-sans font-medium text-[10px]">Blocked</span>;
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
          <div className="flex items-center h-[40px] w-full sm:w-[320px] bg-[#0D0D0B] border border-[#2D3C13] rounded-[8px] px-3">
            <svg className="w-4 h-4 text-[#72943A] shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input 
              type="text" 
              placeholder="Search users by name or email..." 
              className="bg-transparent border-none outline-none text-[#E8EDD4] text-[13px] placeholder:text-[#5A752A] w-full ml-2 font-sans"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {["All", "Active", "Blocked", "Unverified"].map((filter) => (
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

        {/* Right: Export CSV */}
        <button className="h-[40px] px-4 bg-transparent border border-[#2D3C13] hover:bg-[#1A230A] rounded-[8px] flex items-center justify-center gap-2 transition-colors shrink-0">
          <svg className="w-4 h-4 text-[#8CB34A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">Export CSV</span>
        </button>

      </div>

      {/* Table Container */}
      <div className="w-full bg-[#161810] border border-[#2D3C13] rounded-[16px] overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[900px] text-left border-collapse">
          <thead>
            <tr className="border-b border-[#2D3C13] bg-[#111210]">
              <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[30%]">NAME / EMAIL</th>
              <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[15%]">JOINED</th>
              <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[15%] text-center">TICKETS</th>
              <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[15%] text-center">SPENT</th>
              <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[15%]">STATUS</th>
              <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[10%] text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_USERS.map((user, i) => (
              <tr key={user.id} className={`${i !== MOCK_USERS.length - 1 ? 'border-b border-[#2D3C13]' : ''} hover:bg-[#1A230A] transition-colors`}>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#0D0D0B] border border-[#43581E] flex items-center justify-center shrink-0">
                      <span className="font-sans font-medium text-[11px] text-[#8CB34A]">{user.initials}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">{user.name}</span>
                      <span className="font-sans text-[11px] text-[#5A752A]">{user.email}</span>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="font-sans text-[13px] text-[#72943A]">{user.joined}</span>
                </td>
                <td className="py-4 px-6 text-center">
                  <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">{user.tickets}</span>
                </td>
                <td className="py-4 px-6 text-center">
                  <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">{user.spent}</span>
                </td>
                <td className="py-4 px-6">
                  {getStatusPill(user.status)}
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-end gap-3">
                    <button className="text-[#5A752A] hover:text-[#8CB34A] transition-colors" title="View details">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                    </button>
                    <button className="text-[#5A752A] hover:text-[#8CB34A] transition-colors" title="Edit">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                      </svg>
                    </button>
                    {user.status === "Blocked" ? (
                      <button className="text-[#4ADE80] hover:text-[#22c55e] transition-colors" title="Unblock user">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                        </svg>
                      </button>
                    ) : (
                      <button className="text-[#f76b6b] hover:text-[#ef4444] transition-colors" title="Block user">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
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

    </div>
  );
}
