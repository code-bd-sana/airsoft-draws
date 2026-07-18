"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService, HostData } from "../../../services/admin.service";
import ReviewHostModal, { HostApplicationData } from "./ReviewHostModal";
import ConfirmBlockModal from "./ConfirmBlockModal";

export default function HostsTable() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHost, setSelectedHost] = useState<HostApplicationData | null>(null);
  
  const [blockModalHost, setBlockModalHost] = useState<HostData | null>(null);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-hosts', page, activeFilter, search],
    queryFn: () => adminService.getHosts({
      page,
      limit: 10,
      search,
      status: activeFilter
    }),
  });

  const toggleBlockMutation = useMutation({
    mutationFn: (userId: string) => adminService.toggleBlockStatus(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-hosts'] });
      queryClient.invalidateQueries({ queryKey: ['admin-hosts-stats'] });
      setBlockModalHost(null);
    },
  });

  const approveHostMutation = useMutation({
    mutationFn: (hostId: string) => adminService.approveHost(hostId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-hosts'] });
      queryClient.invalidateQueries({ queryKey: ['admin-hosts-stats'] });
      setIsModalOpen(false);
      setSelectedHost(null);
    },
  });

  const handleReview = (host: HostData) => {
    // Construct detailed data for the modal based on the selected row
    setSelectedHost({
      id: host.id,
      brandName: host.businessName || "N/A",
      email: host.email,
      bio: "N/A", // This could be fetched from host profile if available
      contact: "N/A", // This could be fetched from host profile if available
      payoutMethod: "N/A",
      social: "N/A",
      isVerified: host.isVerified,
    });
    setIsModalOpen(true);
  };

  const getStatusPill = (isBlocked: boolean) => {
    if (isBlocked) {
      return <span className="px-3 py-1 rounded-full border border-[#EF4444]/30 bg-[#7F1D1D] text-[#f76b6b] font-sans font-medium text-[10px]">Blocked</span>;
    }
    return <span className="px-3 py-1 rounded-full border border-[#4ADE80]/30 bg-[#083b18] text-[#4ADE80] font-sans font-medium text-[10px]">Active</span>;
  };

  const getPlanPill = (plan: string) => {
    if (plan === "Pending Approval") {
      return <span className="px-3 py-1 rounded-full border border-[#D97706]/30 bg-[#78350F] text-[#F59E0B] font-sans font-medium text-[10px]">{plan}</span>;
    }
    return <span className="px-3 py-1 rounded-full border border-[#8CB34A] bg-[#1A230A] text-[#A0D056] font-sans font-medium text-[10px]">{plan || 'Free'}</span>;
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-[#E8EDD4] text-[13px] placeholder:text-[#5A752A] w-full ml-2 font-sans"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {["All", "Active", "Blocked", "Pending"].map((filter) => (
              <button
                key={filter}
                onClick={() => { setActiveFilter(filter); setPage(1); }}
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
            {isLoading ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-[#5A752A] font-sans text-sm">
                  Loading hosts...
                </td>
              </tr>
            ) : data?.hosts?.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-[#5A752A] font-sans text-sm">
                  No hosts found.
                </td>
              </tr>
            ) : (
              data?.hosts?.map((host: HostData, i: number) => (
                <tr key={host.id} className={`${i !== data.hosts.length - 1 ? 'border-b border-[#2D3C13]' : ''} hover:bg-[#1A230A] transition-colors`}>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#1A230A] border border-[#43581E] flex items-center justify-center shrink-0">
                        <span className="font-sans font-medium text-[11px] text-[#8CB34A]">
                          {host.businessName?.substring(0, 2).toUpperCase() || 'NA'}
                        </span>
                      </div>
                      <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">{host.businessName || 'N/A'}</span>
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
                    <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">£{host.revenue?.toFixed(2) || '0.00'}</span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    {getStatusPill(host.isBlocked)}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-3 font-sans">
                      {!host.isVerified && (
                        <button 
                          onClick={() => approveHostMutation.mutate(host.id)}
                          disabled={approveHostMutation.isPending}
                          className="text-[#4ADE80] hover:text-[#32b25e] transition-colors mr-1" 
                          title="Approve Host"
                        >
                          <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                          </svg>
                        </button>
                      )}

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
                      
                      <button 
                        onClick={() => setBlockModalHost(host)}
                        disabled={toggleBlockMutation.isPending}
                        className={`transition-colors ${host.isBlocked ? 'text-[#f76b6b] hover:text-[#4ADE80]' : 'text-[#5A752A] hover:text-[#f76b6b]'}`} 
                        title={host.isBlocked ? "Unblock Host" : "Block Host"}
                      >
                        {host.isBlocked ? (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ReviewHostModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        data={selectedHost} 
        onApprove={(hostId) => approveHostMutation.mutate(hostId)}
        isApproveLoading={approveHostMutation.isPending}
      />

      <ConfirmBlockModal 
        isOpen={!!blockModalHost}
        onClose={() => setBlockModalHost(null)}
        onConfirm={() => blockModalHost && toggleBlockMutation.mutate(blockModalHost.userId)}
        isLoading={toggleBlockMutation.isPending}
        isBlocked={blockModalHost?.isBlocked ?? false}
        userIdentifier={blockModalHost?.businessName || blockModalHost?.email || ""}
      />
    </div>
  );
}
