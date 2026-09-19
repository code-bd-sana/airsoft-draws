"use client";

import { useAllSubscriptionsAdmin } from '@/hooks/useSubscriptionHooks';
import React, { useState, useEffect } from "react";

export default function SubscriptionTable() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState<'ALL' | 'ACTIVE' | 'CANCELLED' | 'EXPIRED'>('ALL');
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);

  // Debounce search input for performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, isFetching, refetch } = useAllSubscriptionsAdmin({
    page,
    limit,
    search: search.trim() || undefined,
    status: status !== 'ALL' ? status : undefined,
  });

  const handleRefresh = async () => {
    setIsManualRefreshing(true);
    try {
      await refetch();
    } finally {
      // Small timeout ensures skeleton is properly visible for smooth visual feedback
      setTimeout(() => {
        setIsManualRefreshing(false);
      }, 450);
    }
  };

  const subs = Array.isArray(data) ? data : (data?.subscriptions || []);
  const total = Array.isArray(data) ? subs.length : (data?.total || 0);
  const totalPages = Array.isArray(data) ? 1 : Math.max(1, data?.totalPages || 1);

  const fromEntry = total === 0 ? 0 : (page - 1) * limit + 1;
  const toEntry = Math.min(page * limit, total);

  const getStatusPill = (statusStr: string) => {
    const upper = statusStr?.toUpperCase();
    switch (upper) {
      case "ACTIVE":
        return <span className="px-2.5 py-0.5 rounded-full border border-[#4ADE80]/30 bg-[#083b18] text-[#4ADE80] font-sans font-medium text-[10px]">Active</span>;
      case "PAST DUE":
      case "EXPIRED":
        return <span className="px-2.5 py-0.5 rounded-full border border-[#F59E0B]/30 bg-[#78350F]/40 text-[#F59E0B] font-sans font-medium text-[10px]">{statusStr}</span>;
      case "CANCELLED":
        return <span className="px-2.5 py-0.5 rounded-full border border-[#EF4444]/30 bg-[#7F1D1D] text-[#f76b6b] font-sans font-medium text-[10px]">Cancelled</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full border border-[#2D3C13] bg-[#1A230A] text-[#72943A] font-sans font-medium text-[10px]">{statusStr}</span>;
    }
  };

  const getPlanPill = (planName: string) => {
    return (
      <span className="px-2.5 py-0.5 rounded-full border border-[#8CB34A]/50 bg-[#1A230A] text-[#A0D056] font-sans font-medium text-[10px]">
        {planName}
      </span>
    );
  };

  return (
    <div className="w-full bg-[#161810] border border-[#2D3C13] rounded-[16px] overflow-hidden flex flex-col">
      {/* Top Filter & Action Bar */}
      <div className="p-4 sm:p-5 border-b border-[#2D3C13] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#111210]">
        
        {/* Title and Count */}
        <div className="flex items-center gap-3">
          <span className="font-sans font-semibold text-[14px] text-[#E8EDD4]">
            Active Subscriptions
          </span>
          <span className="font-sans text-[11px] font-medium text-[#8CB34A] bg-[#1A230A] border border-[#2D3C13] px-2 py-0.5 rounded-full">
            {total} Total
          </span>
        </div>

        {/* Controls: Search, Status Filter, Refresh */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 sm:w-60 min-w-[180px]">
            <input
              type="text"
              placeholder="Search host or plan..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full h-9 pl-8 pr-3 rounded-[8px] bg-[#161810] border border-[#2D3C13] text-[#E8EDD4] font-sans text-xs placeholder:text-[#5A752A] focus:outline-none focus:border-[#8CB34A] transition-colors"
            />
            <svg
              className="w-3.5 h-3.5 text-[#5A752A] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchInput && (
              <button
                onClick={() => setSearchInput("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5A752A] hover:text-[#E8EDD4] text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Status Filter */}
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as any);
              setPage(1);
            }}
            className="h-9 px-3 rounded-[8px] bg-[#161810] border border-[#2D3C13] text-[#E8EDD4] font-sans text-xs focus:outline-none focus:border-[#8CB34A] cursor-pointer transition-colors"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="EXPIRED">Expired</option>
          </select>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isFetching || isManualRefreshing}
            title="Refresh subscriptions"
            className="h-9 px-3 rounded-[8px] bg-[#161810] border border-[#2D3C13] hover:border-[#8CB34A] text-[#72943A] hover:text-[#E8EDD4] flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          >
            <svg
              className={`w-3.5 h-3.5 ${isFetching || isManualRefreshing ? 'animate-spin text-[#8CB34A]' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span className="font-sans text-[11px] font-medium hidden sm:inline">Refresh</span>
          </button>
        </div>

      </div>

      {/* Background Fetching Indicator Bar */}
      <div className="h-0.5 w-full bg-transparent overflow-hidden">
        {isFetching && !isLoading && !isManualRefreshing && (
          <div className="h-full bg-[#8CB34A] animate-pulse w-full" />
        )}
      </div>

      {/* Table Container */}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[900px] text-left border-collapse">
          <thead>
            <tr className="border-b border-[#2D3C13] bg-[#111210]/60">
              <th className="py-3.5 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[25%]">HOST</th>
              <th className="py-3.5 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[12%]">PLAN</th>
              <th className="py-3.5 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[18%]">PURCHASE DATE</th>
              <th className="py-3.5 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[18%]">NEXT RENEWAL</th>
              <th className="py-3.5 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[17%]">PAYMENT</th>
              <th className="py-3.5 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[10%] text-center">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {isLoading || isManualRefreshing ? (
              // Skeleton Loading Rows
              Array.from({ length: limit > 5 ? 5 : limit }).map((_, idx) => (
                <tr key={idx} className="border-b border-[#2D3C13]/40 animate-pulse">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#1A230A] border border-[#2D3C13]" />
                      <div className="flex flex-col gap-1.5">
                        <div className="h-3.5 w-32 bg-[#1A230A] rounded" />
                        <div className="h-2.5 w-20 bg-[#1A230A]/60 rounded" />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="h-5 w-16 bg-[#1A230A] border border-[#2D3C13] rounded-full" />
                  </td>
                  <td className="py-4 px-6">
                    <div className="h-3.5 w-24 bg-[#1A230A] rounded" />
                  </td>
                  <td className="py-4 px-6">
                    <div className="h-3.5 w-24 bg-[#1A230A] rounded" />
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col gap-1.5">
                      <div className="h-3.5 w-20 bg-[#1A230A] rounded" />
                      <div className="h-2.5 w-24 bg-[#1A230A]/60 rounded" />
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="h-5 w-16 bg-[#1A230A] border border-[#2D3C13] rounded-full mx-auto" />
                  </td>
                </tr>
              ))
            ) : subs.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-14 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-[#1A230A] border border-[#2D3C13] flex items-center justify-center text-[#5A752A]">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <span className="font-sans text-[13px] text-[#72943A]">No subscriptions found</span>
                    <span className="font-sans text-[11px] text-[#5A752A]">
                      {search || status !== 'ALL' ? 'Try adjusting your search or filter criteria' : 'Subscriptions will appear once hosts subscribe'}
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              subs.map((sub: any, i: number) => {
                const hostName = sub.host?.businessName || (sub.host?.user ? `${sub.host.user.firstName || ''} ${sub.host.user.lastName || ''}`.trim() : '') || 'Unknown Host';
                const initials = hostName.substring(0, 2).toUpperCase();
                const endDate = new Date(sub.endDate);
                const startDate = new Date(sub.startDate || sub.createdAt);
                const formattedDate = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(endDate);
                const formattedStartDate = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(startDate);
                const tx = sub.transaction;

                return (
                  <tr 
                    key={sub.id} 
                    className={`${i !== subs.length - 1 ? 'border-b border-[#2D3C13]' : ''} hover:bg-[#1A230A]/60 transition-colors`}
                  >
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#1A230A] border border-[#43581E] flex items-center justify-center shrink-0">
                          <span className="font-sans font-medium text-[11px] text-[#8CB34A]">{initials}</span>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-sans font-medium text-[13px] text-[#E8EDD4] truncate">{hostName}</span>
                          {sub.host?.user?.email && (
                            <span className="font-sans text-[10px] text-[#5A752A] truncate">{sub.host.user.email}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-6">
                      {getPlanPill(sub.plan?.name || "Free")}
                    </td>
                    <td className="py-3.5 px-6">
                      <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">{formattedStartDate}</span>
                    </td>
                    <td className="py-3.5 px-6">
                      <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">{formattedDate}</span>
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="flex flex-col">
                        <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">
                          £{sub.plan?.price ? Number(sub.plan.price).toFixed(2) : '0.00'}
                          {tx?.status && <span className="text-[11px] text-[#72943A] ml-1.5 font-normal">({tx.status})</span>}
                        </span>
                        {tx?.gatewayTransactionId && (
                          <span className="font-sans text-[10px] text-[#5A752A] mt-0.5 truncate max-w-[140px]">
                            {tx.gatewayTransactionId}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-6 text-center">
                      {getStatusPill(sub.status || 'Active')}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 sm:p-5 border-t border-[#2D3C13] bg-[#111210] flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Showing entries count and per-page selector */}
        <div className="flex items-center gap-4 text-xs font-sans text-[#72943A]">
          <span>
            Showing <strong className="text-[#E8EDD4] font-medium">{fromEntry}</strong> to{' '}
            <strong className="text-[#E8EDD4] font-medium">{toEntry}</strong> of{' '}
            <strong className="text-[#E8EDD4] font-medium">{total}</strong> entries
          </span>

          <div className="flex items-center gap-1.5 border-l border-[#2D3C13] pl-4">
            <span className="text-[#5A752A]">Per page:</span>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="bg-[#161810] border border-[#2D3C13] text-[#E8EDD4] rounded px-2 py-1 text-xs focus:outline-none focus:border-[#8CB34A] cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* Page navigation buttons */}
        <div className="flex items-center gap-1.5">
          {/* Previous Page Button */}
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1 || isLoading}
            className="px-3 py-1.5 rounded-[6px] bg-[#161810] border border-[#2D3C13] text-xs font-sans text-[#E8EDD4] hover:border-[#8CB34A] hover:bg-[#1A230A] transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer flex items-center gap-1"
          >
            ← Prev
          </button>

          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, idx) => idx + 1)
              .filter((p) => {
                // Show current page, edges, and nearby pages
                return p === 1 || p === totalPages || Math.abs(p - page) <= 1;
              })
              .map((p, idx, arr) => {
                const prev = arr[idx - 1];
                const showEllipsis = prev && p - prev > 1;

                return (
                  <React.Fragment key={p}>
                    {showEllipsis && (
                      <span className="px-1 text-xs text-[#5A752A]">...</span>
                    )}
                    <button
                      onClick={() => setPage(p)}
                      disabled={page === p || isLoading}
                      className={`min-w-[32px] h-8 rounded-[6px] text-xs font-sans font-medium transition-colors cursor-pointer ${
                        page === p
                          ? 'bg-[#1A230A] text-[#8CB34A] border border-[#8CB34A]'
                          : 'bg-[#161810] border border-[#2D3C13] text-[#72943A] hover:text-[#E8EDD4] hover:border-[#43581E]'
                      }`}
                    >
                      {p}
                    </button>
                  </React.Fragment>
                );
              })}
          </div>

          {/* Next Page Button */}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages || isLoading}
            className="px-3 py-1.5 rounded-[6px] bg-[#161810] border border-[#2D3C13] text-xs font-sans text-[#E8EDD4] hover:border-[#8CB34A] hover:bg-[#1A230A] transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer flex items-center gap-1"
          >
            Next →
          </button>
        </div>

      </div>
    </div>
  );
}
