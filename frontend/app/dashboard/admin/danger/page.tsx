"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "../../../../services/admin.service";

export default function AdminDangerZonePage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Fetch live stats
  const { data: stats, isLoading, refetch } = useQuery({
    queryKey: ["admin-danger-stats"],
    queryFn: () => adminService.getDangerStats(),
  });

  // Delete all mutation
  const deleteMutation = useMutation({
    mutationFn: () => adminService.deleteAllCompetitions(),
    onSuccess: (data) => {
      setFeedback({
        type: "success",
        message: data?.message || "All competitions, tickets, instant wins, and winners deleted successfully!",
      });
      setIsModalOpen(false);
      setConfirmText("");
      refetch();
      // Invalidate related admin queries
      queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
      queryClient.invalidateQueries({ queryKey: ["admin-raffles"] });
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-winners"] });
    },
    onError: (error: any) => {
      setFeedback({
        type: "error",
        message: error?.response?.data?.message || "Failed to delete competitions. Please try again.",
      });
    },
  });

  const handleDeleteClick = () => {
    setFeedback(null);
    setConfirmText("");
    setIsModalOpen(true);
  };

  const handleConfirmDelete = (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmText.toUpperCase() !== "DELETE") {
      return;
    }
    deleteMutation.mutate();
  };

  return (
    <div className="flex flex-col gap-8 p-6 md:p-8 max-w-[1660px] mx-auto w-full animate-fadeIn">
      
      {/* Top Header */}
      <div className="flex flex-col gap-2 pb-6 border-b border-[#2D3C13]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[10px] bg-[#EF4444]/10 border border-[#EF4444]/30 flex items-center justify-center text-[#EF4444]">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          </div>
          <div>
            <h1 className="font-heading font-bold text-[24px] md:text-[28px] text-[#E8EDD4] tracking-tight">
              Danger Zone
            </h1>
            <p className="font-sans text-[13px] md:text-[14px] text-[#72943A]">
              Administrative tools for irreversible bulk deletions and resetting system competition catalogs.
            </p>
          </div>
        </div>
      </div>

      {/* Feedback Toast Banner */}
      {feedback && (
        <div className={`p-4 rounded-[12px] border flex items-center justify-between gap-4 animate-fadeIn ${
          feedback.type === "success" 
            ? "bg-[#083b18] border-[#4ADE80]/40 text-[#4ADE80]" 
            : "bg-[#7F1D1D]/40 border-[#EF4444]/40 text-[#f76b6b]"
        }`}>
          <div className="flex items-center gap-3 text-[14px] font-medium font-sans">
            <span>{feedback.type === "success" ? "✓" : "⚠"}</span>
            <span>{feedback.message}</span>
          </div>
          <button 
            onClick={() => setFeedback(null)}
            className="text-[12px] underline opacity-80 hover:opacity-100 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Critical Warning Callout */}
      <div className="bg-[#1a1210] border border-[#7F1D1D]/60 rounded-[16px] p-6 flex flex-col md:flex-row items-start md:items-center gap-5">
        <div className="w-12 h-12 rounded-full bg-[#EF4444]/20 border border-[#EF4444]/40 flex items-center justify-center shrink-0 text-[#EF4444]">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="font-heading font-bold text-[16px] text-[#f76b6b]">
            Caution: Permanent Database Operations
          </h3>
          <p className="font-sans text-[13px] text-[#e8edd4]/80 leading-relaxed max-w-4xl">
            Deleting competitions will erase all raffle listings, sold tickets, instant win records, and winner claims. This action cannot be undone. Make sure you understand the consequences before proceeding.
          </p>
        </div>
      </div>

      {/* Current Data Overview Statistics */}
      <div className="flex flex-col gap-4">
        <h2 className="font-heading font-bold text-[18px] text-[#E8EDD4]">
          Current Competition Data in Database
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          
          <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col gap-2">
            <span className="font-sans text-[11px] font-medium text-[#5A752A] uppercase tracking-[1px]">
              Total Competitions
            </span>
            <span className="font-heading font-bold text-[32px] text-[#E8EDD4]">
              {isLoading ? "..." : stats?.rafflesCount ?? 0}
            </span>
            <span className="font-sans text-[12px] text-[#72943A]">Live, Ended, & Drafts</span>
          </div>

          <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col gap-2">
            <span className="font-sans text-[11px] font-medium text-[#5A752A] uppercase tracking-[1px]">
              Total Tickets Purchased
            </span>
            <span className="font-heading font-bold text-[32px] text-[#E8EDD4]">
              {isLoading ? "..." : stats?.ticketsCount ?? 0}
            </span>
            <span className="font-sans text-[12px] text-[#72943A]">All buyer tickets</span>
          </div>

          <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col gap-2">
            <span className="font-sans text-[11px] font-medium text-[#5A752A] uppercase tracking-[1px]">
              Instant Win Prizes
            </span>
            <span className="font-heading font-bold text-[32px] text-[#E8EDD4]">
              {isLoading ? "..." : stats?.instantWinsCount ?? 0}
            </span>
            <span className="font-sans text-[12px] text-[#72943A]">Configured instant wins</span>
          </div>

          <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col gap-2">
            <span className="font-sans text-[11px] font-medium text-[#5A752A] uppercase tracking-[1px]">
              Winner Records
            </span>
            <span className="font-heading font-bold text-[32px] text-[#E8EDD4]">
              {isLoading ? "..." : stats?.winnersCount ?? 0}
            </span>
            <span className="font-sans text-[12px] text-[#72943A]">Drawn winners history</span>
          </div>

        </div>
      </div>

      {/* Danger Zone Actions Container */}
      <div className="flex flex-col gap-4 mt-4">
        <h2 className="font-heading font-bold text-[18px] text-[#E8EDD4]">
          Destructive Actions
        </h2>

        <div className="bg-[#161810] border border-[#EF4444]/30 rounded-[16px] p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col gap-1.5 max-w-2xl">
            <h3 className="font-heading font-bold text-[18px] text-[#E8EDD4] flex items-center gap-2">
              <span>Delete All Competitions & Sold Tickets</span>
              <span className="px-2 py-0.5 rounded-full bg-[#7F1D1D] text-[#f76b6b] text-[10px] font-bold uppercase">
                Irreversible
              </span>
            </h3>
            <p className="font-sans text-[13px] text-[#72943A] leading-relaxed">
              Purges all raffle competitions, all purchased tickets, instant win tables, and winner claim records from the system. Host profiles, user accounts, and billing subscriptions will remain intact.
            </p>
          </div>

          <button
            onClick={handleDeleteClick}
            disabled={deleteMutation.isPending || (stats?.rafflesCount === 0 && stats?.ticketsCount === 0)}
            className="h-[46px] px-6 rounded-[8px] bg-[#EF4444] hover:bg-[#dc2626] text-white font-heading font-semibold text-[14px] transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2.5 shrink-0 shadow-lg shadow-[#EF4444]/20 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
            Delete All Competitions
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <>
          <div 
            className="fixed inset-0 z-50 bg-[#0D0D0B]/80 backdrop-blur-sm transition-opacity" 
            onClick={() => !deleteMutation.isPending && setIsModalOpen(false)} 
          />
          
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[520px] bg-[#161810] border border-[#7F1D1D] rounded-[16px] shadow-2xl z-50 animate-fadeIn flex flex-col p-6 md:p-8">
            
            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#EF4444]/20 border border-[#EF4444]/40 flex items-center justify-center text-[#EF4444] shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
              </div>
              <h2 className="font-heading font-bold text-[20px] text-[#E8EDD4]">
                Confirm Bulk Deletion
              </h2>
            </div>

            <p className="font-sans text-[13px] text-[#e8edd4]/90 leading-relaxed mb-4">
              You are about to permanently delete <strong className="text-[#EF4444]">{stats?.rafflesCount ?? 0} competitions</strong>, <strong className="text-[#EF4444]">{stats?.ticketsCount ?? 0} tickets</strong>, and all associated prizes and winner entries.
            </p>

            <form onSubmit={handleConfirmDelete} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-[12px] text-[#72943A]">
                  Type <span className="font-bold text-[#f76b6b] select-all">DELETE</span> to confirm:
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="DELETE"
                  disabled={deleteMutation.isPending}
                  className="w-full h-[44px] px-4 bg-[#0D0D0B] border border-[#2D3C13] focus:border-[#EF4444] rounded-[8px] font-sans text-[14px] text-[#E8EDD4] placeholder:text-[#5A752A] outline-none transition-colors"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-[#2D3C13]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={deleteMutation.isPending}
                  className="h-[42px] px-5 rounded-[8px] bg-[#1A230A] border border-[#2D3C13] text-[#E8EDD4] font-sans font-medium text-[13px] hover:bg-[#2D3C13] transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={confirmText.toUpperCase() !== "DELETE" || deleteMutation.isPending}
                  className="h-[42px] px-5 rounded-[8px] bg-[#EF4444] hover:bg-[#dc2626] text-white font-sans font-semibold text-[13px] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-[#EF4444]/20"
                >
                  {deleteMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    "I understand, delete everything"
                  )}
                </button>
              </div>
            </form>

          </div>
        </>
      )}

    </div>
  );
}
