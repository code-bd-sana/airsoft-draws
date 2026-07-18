"use client";

import React, { useState, useEffect } from "react";
import { useAdminAllRaffles, useAdminDeleteRaffle } from "../../../hooks/useRaffleHooks";
import { toast } from "sonner";
import { format } from "date-fns";

export default function AdminCompetitionsTable() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // reset to page 1 on search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data, isLoading } = useAdminAllRaffles({
    page,
    limit: 20,
    status: activeFilter,
    search: debouncedSearch
  });

  const deleteMutation = useAdminDeleteRaffle();
  const raffles = data?.data || [];

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this competition? This action cannot be undone.")) {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success("Competition deleted successfully");
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Failed to delete competition");
      }
    }
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setPage(1);
  };

  const getStatusPill = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <span className="px-3 py-1 rounded-full border border-[#4ADE80]/30 bg-[#083b18] text-[#4ADE80] font-sans font-medium text-[10px]">Live</span>;
      case "PENDING_APPROVAL":
        return <span className="px-3 py-1 rounded-full border border-[#D97706]/30 bg-[#78350F] text-[#F59E0B] font-sans font-medium text-[10px]">Pending</span>;
      case "CANCELLED":
        return <span className="px-3 py-1 rounded-full border border-[#EF4444]/30 bg-[#7F1D1D] text-[#f76b6b] font-sans font-medium text-[10px]">Rejected</span>;
      case "ENDED":
        return <span className="px-3 py-1 rounded-full border border-[#A78BFA]/30 bg-[#312E81] text-[#C4B5FD] font-sans font-medium text-[10px]">Ended</span>;
      case "DRAFT":
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
              onClick={() => handleFilterChange(filter)}
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
            placeholder="Search by title, host name, or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
            {isLoading && (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={`skeleton-${i}`} className="border-b border-[#2D3C13]">
                  <td className="py-4 px-6">
                    <div className="flex flex-col gap-2">
                      <div className="w-3/4 h-[14px] bg-[#1a230a] rounded animate-pulse"></div>
                      <div className="w-1/2 h-[12px] bg-[#1a230a] rounded animate-pulse"></div>
                    </div>
                  </td>
                  <td className="py-4 px-6"><div className="w-16 h-[14px] bg-[#1a230a] rounded animate-pulse"></div></td>
                  <td className="py-4 px-6 text-center"><div className="w-12 h-[14px] bg-[#1a230a] rounded animate-pulse mx-auto"></div></td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col gap-2 w-full max-w-[180px]">
                      <div className="w-10 h-[12px] bg-[#1a230a] rounded animate-pulse"></div>
                      <div className="w-full h-1 bg-[#1a230a] rounded-full animate-pulse"></div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center"><div className="w-14 h-[22px] bg-[#1a230a] rounded-full animate-pulse mx-auto"></div></td>
                  <td className="py-4 px-6 text-center"><div className="w-20 h-[14px] bg-[#1a230a] rounded animate-pulse mx-auto"></div></td>
                  <td className="py-4 px-6 text-right"><div className="w-16 h-[20px] bg-[#1a230a] rounded animate-pulse ml-auto"></div></td>
                </tr>
              ))
            )}
            
            {!isLoading && raffles.length === 0 && (
              <tr>
                <td colSpan={7} className="py-12 px-6 text-center text-[#5A752A] font-sans text-sm">
                  No competitions found.
                </td>
              </tr>
            )}

            {!isLoading && raffles.map((comp: any, i: number) => {
              const progress = comp.totalTickets > 0 ? Math.min(Math.round((comp.ticketsSold / comp.totalTickets) * 100), 100) : 0;
              const hostName = comp.host?.user?.firstName ? `${comp.host.user.firstName} ${comp.host.user.lastName || ''}` : 'Unknown Host';
              const hostEmail = comp.host?.user?.email || '';

              return (
                <tr key={comp.id} className={`${i !== raffles.length - 1 ? 'border-b border-[#2D3C13]' : ''} hover:bg-[#1A230A] transition-colors`}>
                  <td className="py-4 px-6">
                    <div className="flex flex-col gap-1">
                      <span className="font-sans font-medium text-[13px] text-[#E8EDD4] truncate block max-w-[280px]">{comp.title}</span>
                      <span className="font-sans text-[11px] text-[#72943A] truncate block max-w-[280px]">{hostName} ({hostEmail})</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-sans text-[13px] text-[#72943A]">{comp.category || 'N/A'}</span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">£{Number(comp.pricePerTicket).toFixed(2)}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col gap-2 w-full max-w-[180px]">
                      <span className="font-sans font-medium text-[12px] text-[#E8EDD4]">{comp.ticketsSold}/{comp.totalTickets}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-full h-1 bg-[#0D0D0B] rounded-full overflow-hidden border border-[#2D3C13]">
                          <div 
                            className="h-full bg-[#8CB34A] rounded-full" 
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="font-sans text-[10px] text-[#5A752A] shrink-0 w-[24px] text-right">{progress}%</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    {getStatusPill(comp.status)}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="font-sans font-medium text-[12px] text-[#72943A]">
                      {comp.createdAt ? format(new Date(comp.createdAt), 'dd MMM yyyy') : 'N/A'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-3">
                      {/* Delete Action */}
                      <button 
                        onClick={() => handleDelete(comp.id)}
                        disabled={deleteMutation.isPending}
                        className="text-[#5A752A] hover:text-[#EF4444] transition-colors disabled:opacity-50" 
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
