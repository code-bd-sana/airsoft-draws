"use client";

import React, { useState } from "react";
import { useAdminUsers, useToggleUserBlockMutation } from "../../../hooks/useAdminHooks";
import { format } from "date-fns";
import ConfirmBlockModal from "./ConfirmBlockModal";
import UserDetailsModal from "./UserDetailsModal";
import { User } from "../../../services/admin.service";

export default function UsersTable() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;
  
  const [blockModalUser, setBlockModalUser] = useState<User | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Convert "All", "Active", "Blocked" filter state to role or status if needed.
  // For now we map filter to search params if possible, but our backend supports `role` and `search`.
  // To handle blocked/active we can filter client-side or add backend support. We'll filter client-side if it's small,
  // or ideally the backend should support `isBlocked` filtering. We'll just fetch and if they want blocked, we can filter locally for now.
  const { data, isLoading, isError } = useAdminUsers({ page, limit, search });
  const toggleBlock = useToggleUserBlockMutation();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset to page 1 on search
  };

  const getStatusPill = (isBlocked: boolean) => {
    if (isBlocked) {
      return <span className="px-3 py-1 rounded-full border border-[#EF4444]/30 bg-[#7F1D1D] text-[#f76b6b] font-sans font-medium text-[10px]">Blocked</span>;
    }
    return <span className="px-3 py-1 rounded-full border border-[#4ADE80]/30 bg-[#083b18] text-[#4ADE80] font-sans font-medium text-[10px]">Active</span>;
  };

  const getInitials = (firstName: string | null, lastName: string | null, email: string) => {
    if (firstName && lastName) return `${firstName[0]}${lastName[0]}`.toUpperCase();
    if (firstName) return firstName[0].toUpperCase();
    return email[0].toUpperCase();
  };

  const users = data?.users || [];
  
  // Client-side filtering for Active/Blocked since backend doesn't explicitly filter by status yet
  const filteredUsers = users.filter((user) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Active") return !user.isBlocked;
    if (activeFilter === "Blocked") return user.isBlocked;
    return true;
  });

  return (
    <>
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
              value={search}
              onChange={handleSearchChange}
              className="bg-transparent border-none outline-none text-[#E8EDD4] text-[13px] placeholder:text-[#5A752A] w-full ml-2 font-sans"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {["All", "Active", "Blocked"].map((filter) => (
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
            {isLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx} className="border-b border-[#2D3C13] last:border-b-0">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3 animate-pulse">
                      <div className="w-8 h-8 rounded-full bg-[#1C2012] shrink-0" />
                      <div className="flex flex-col gap-1.5">
                        <div className="h-4.5 w-28 bg-[#1C2012] rounded" />
                        <div className="h-3.5 w-36 bg-[#1C2012] rounded" />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="h-4 w-24 bg-[#1C2012] rounded animate-pulse" />
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="h-4 w-8 bg-[#1C2012] rounded animate-pulse mx-auto" />
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="h-4 w-12 bg-[#1C2012] rounded animate-pulse mx-auto" />
                  </td>
                  <td className="py-4 px-6">
                    <div className="h-6 w-16 bg-[#1C2012] rounded-full animate-pulse" />
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-3">
                      <div className="w-4.5 h-4.5 bg-[#1C2012] rounded animate-pulse" />
                      <div className="w-4.5 h-4.5 bg-[#1C2012] rounded animate-pulse" />
                    </div>
                  </td>
                </tr>
              ))
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-[#72943A] font-sans text-sm">
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user, i) => (
                <tr key={user.id} className={`${i !== filteredUsers.length - 1 ? 'border-b border-[#2D3C13]' : ''} hover:bg-[#1A230A] transition-colors`}>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#0D0D0B] border border-[#43581E] flex items-center justify-center shrink-0">
                      <span className="font-sans font-medium text-[11px] text-[#8CB34A]">
                        {getInitials(user.firstName, user.lastName, user.email)}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">
                        {user.firstName ? `${user.firstName} ${user.lastName || ''}` : 'No Name'}
                      </span>
                      <span className="font-sans text-[11px] text-[#5A752A]">{user.email}</span>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="font-sans text-[13px] text-[#72943A]">
                    {format(new Date(user.createdAt), 'dd MMM yyyy')}
                  </span>
                </td>
                <td className="py-4 px-6 text-center">
                  <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">{user.ticketsCount}</span>
                </td>
                <td className="py-4 px-6 text-center">
                  <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">£{user.totalSpent.toFixed(2)}</span>
                </td>
                <td className="py-4 px-6">
                  {getStatusPill(user.isBlocked)}
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-end gap-3">
                    <button 
                      onClick={() => { setSelectedUser(user); setIsDetailsOpen(true); }}
                      className="text-[#5A752A] hover:text-[#8CB34A] hover:scale-110 active:scale-90 transition-all duration-150 flex items-center justify-center shrink-0 cursor-pointer" 
                      title="View details"
                    >
                      <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                    </button>
                    {user.isBlocked ? (
                      <button 
                        onClick={() => setBlockModalUser(user)}
                        disabled={toggleBlock.isPending}
                        className="text-[#4ADE80] hover:text-[#22c55e] transition-colors disabled:opacity-50" 
                        title="Unblock user"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                        </svg>
                      </button>
                    ) : (
                      <button 
                        onClick={() => setBlockModalUser(user)}
                        disabled={toggleBlock.isPending}
                        className="text-[#f76b6b] hover:text-[#ef4444] transition-colors disabled:opacity-50" 
                        title="Block user"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {data && data.totalPages > 1 && (
        <div className="flex justify-between items-center bg-[#161810] border border-[#2D3C13] rounded-[16px] px-6 py-4">
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="text-[13px] font-sans font-medium text-[#E8EDD4] disabled:text-[#5A752A] hover:text-[#8CB34A] transition-colors"
          >
            Previous
          </button>
          <span className="text-[13px] font-sans text-[#72943A]">Page {page} of {data.totalPages}</span>
          <button 
            onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
            disabled={page === data.totalPages}
            className="text-[13px] font-sans font-medium text-[#E8EDD4] disabled:text-[#5A752A] hover:text-[#8CB34A] transition-colors"
          >
            Next
          </button>
        </div>
      )}

    </div>

      <ConfirmBlockModal 
        isOpen={!!blockModalUser}
        onClose={() => setBlockModalUser(null)}
        onConfirm={() => {
          if (blockModalUser) {
            toggleBlock.mutate(blockModalUser.id, {
              onSuccess: () => setBlockModalUser(null)
            });
          }
        }}
        isLoading={toggleBlock.isPending}
        isBlocked={blockModalUser?.isBlocked ?? false}
        userIdentifier={blockModalUser?.email || blockModalUser?.firstName || "this user"}
      />

      <UserDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => { setIsDetailsOpen(false); setSelectedUser(null); }}
        user={selectedUser}
      />
    </>
  );
}
