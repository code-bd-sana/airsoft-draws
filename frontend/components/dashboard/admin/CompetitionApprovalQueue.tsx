"use client";

import React, { useState } from "react";
import RejectCompetitionModal from "./RejectCompetitionModal";
import { useAdminPendingRaffles, useApproveRaffle } from "../../../hooks/useRaffleHooks";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

const MOCK_APPROVALS = [
  {
    id: "1",
    hostInitials: "TG",
    hostName: "Tactical Gear UK",
    submittedTime: "Submitted 2 hours ago",
    warning: "Draw date soon",
    title: "Sniper Rifle Set — L96A1",
    description: "High-precision L96A1 airsoft sniper rifle with custom stock and bipod included. RRP £340.",
    details: "Price: £2.50/ticket · Total: 500 tickets · Draw: 30 Jun 2025",
    checks: [
      { label: "Skill question included", passed: true },
      { label: "Terms attached", passed: true },
      { label: "Prize images uploaded", passed: true },
    ]
  },
  {
    id: "2",
    hostInitials: "AW",
    hostName: "Airsoft World",
    submittedTime: "Submitted 4 hours ago",
    warning: null,
    title: "VFC HK416 Bundle — Full Kit",
    description: "Gas blowback HK416 with two extra mags, sling, and 3000 BBs. Complete ready-to-play package.",
    details: "Price: £1.50/ticket · Total: 400 tickets · Draw: 15 Jul 2025",
    checks: [
      { label: "Skill question included", passed: true },
      { label: "Terms attached", passed: true },
      { label: "Prize images uploaded", passed: true },
    ]
  },
  {
    id: "3",
    hostInitials: "CZ",
    hostName: "Combat Zone Ltd",
    submittedTime: "Submitted 6 hours ago",
    warning: null,
    title: "Ghillie Suit Deluxe — Woodland Pattern",
    description: "Full ghillie suit set in woodland camo. Covers head, body, and rifle. One size fits all.",
    details: "Price: £1.00/ticket · Total: 250 tickets · Draw: 1 Aug 2025",
    checks: [
      { label: "Skill question included", passed: true },
      { label: "Terms attached", passed: true },
    ]
  }
];

export default function CompetitionApprovalQueue() {
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedCompetition, setSelectedCompetition] = useState<{ id: string, title: string } | null>(null);

  const { data: pendingRaffles, isLoading } = useAdminPendingRaffles();
  const approveMutation = useApproveRaffle();

  const handleReject = (id: string, title: string) => {
    setSelectedCompetition({ id, title });
    setIsRejectModalOpen(true);
  };

  const handleApprove = async (id: string) => {
    try {
      await approveMutation.mutateAsync(id);
      toast.success('Competition approved and is now live!');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to approve');
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <h1 className="font-heading font-bold text-[24px] text-[#E8EDD4]">
          Competition Approval Queue
        </h1>
        <div className="px-3 py-1 rounded-full bg-[#78350F] text-[#F59E0B] border border-[#D97706]/30 font-sans font-medium text-[12px]">
          {pendingRaffles?.length || 0} Pending
        </div>
      </div>

      {/* Queue List */}
      <div className="flex flex-col gap-6">
        {isLoading && <div className="text-[#E8EDD4] p-4">Loading pending competitions...</div>}
        
        {!isLoading && pendingRaffles?.map((item: any) => (
          <div key={item.id} className="w-full bg-[#111210] border border-[#2D3C13] rounded-[16px] flex flex-col overflow-hidden">
            
            {/* Top Bar (Host Info & Warning) */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#2D3C13]/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1A230A] border border-[#43581E] flex items-center justify-center shrink-0">
                  <span className="font-sans font-medium text-[11px] text-[#8CB34A]">
                    {item.host?.user?.firstName?.[0] || 'A'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-sans font-medium text-[13px] text-[#E8EDD4] leading-tight">
                    {item.host?.user?.firstName || 'Host'} {item.host?.user?.lastName || ''}
                  </span>
                  <span className="font-sans text-[11px] text-[#5A752A] leading-tight mt-0.5">
                    Submitted {formatDistanceToNow(new Date(item.createdAt))} ago
                  </span>
                </div>
              </div>
            </div>

            {/* Middle Bar (Content Details) */}
            <div className="flex flex-col sm:flex-row gap-6 p-6 pb-4">
              {/* Image Placeholder */}
              <div className="w-full sm:w-[140px] h-[100px] shrink-0 bg-[#1A230A] border border-[#2D3C13] rounded-[8px] flex items-center justify-center overflow-hidden">
                {item.mainImage ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={item.mainImage} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-8 h-8 text-[#43581E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                )}
              </div>

              {/* Text Info */}
              <div className="flex flex-col gap-2 flex-1 min-w-0">
                <h3 className="font-heading font-bold text-[18px] text-[#E8EDD4]">{item.title}</h3>
                <p className="font-sans text-[13px] text-[#A0D056] leading-relaxed max-w-[800px]">
                  {item.description || 'No description provided.'}
                </p>
                <span className="font-sans text-[12px] text-[#72943A] mt-1">
                  Price: £{item.pricePerTicket} / ticket · Total: {item.totalTickets} tickets · Draw: {new Date(item.endDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Bottom Bar (Actions) */}
            <div className="flex flex-col sm:flex-row items-center justify-end p-6 pt-4 gap-4 mt-2">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button 
                  onClick={() => handleReject(item.id, item.title)}
                  className="flex-1 sm:flex-none h-[40px] px-6 rounded-[8px] bg-transparent border border-[#7F1D1D] hover:bg-[#7F1D1D]/20 text-[#f76b6b] font-heading font-medium text-[13px] transition-colors"
                >
                  Reject
                </button>
                <button 
                  onClick={() => handleApprove(item.id)}
                  disabled={approveMutation.isPending}
                  className="flex-1 sm:flex-none h-[40px] px-6 rounded-[8px] bg-[#8CB34A] hover:bg-[#A0D056] text-[#0D0D0B] font-heading font-medium text-[13px] transition-colors disabled:opacity-50"
                >
                  {approveMutation.isPending ? 'Approving...' : 'Approve & Publish'}
                </button>
              </div>
            </div>

          </div>
        ))}
        {!isLoading && pendingRaffles?.length === 0 && (
          <div className="text-[#E8EDD4] p-4 text-center">No pending competitions.</div>
        )}
      </div>

      <RejectCompetitionModal 
        isOpen={isRejectModalOpen} 
        onClose={() => setIsRejectModalOpen(false)} 
        competitionData={selectedCompetition}
      />
    </div>
  );
}
