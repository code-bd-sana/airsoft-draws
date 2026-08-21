"use client";

import React, { useState } from "react";
import {
  useAllSubscriptionRequestsAdmin,
  useApproveSubscriptionRequestMutation,
  useRejectSubscriptionRequestMutation,
} from "../../../hooks/useSubscriptionHooks";
import { SubscriptionRequest } from "../../../services/subscription.service";
import { toast } from "sonner";

export default function SubscriptionRequestsTable() {
  const { data: requests, isLoading, refetch } = useAllSubscriptionRequestsAdmin();
  const approveMutation = useApproveSubscriptionRequestMutation();
  const rejectMutation = useRejectSubscriptionRequestMutation();

  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
  const [selectedRequest, setSelectedRequest] = useState<SubscriptionRequest | null>(null);

  // Approval Modal State
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [approvedDays, setApprovedDays] = useState<number>(30);
  const [customDays, setCustomDays] = useState<string>('');
  const [adminNotes, setAdminNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Rejection Modal State
  const [showRejectModal, setShowRejectModal] = useState(false);

  if (isLoading) {
    return <div className="p-6 text-white">Loading subscription requests...</div>;
  }

  const reqList = requests || [];
  const filteredList = reqList.filter((r) => {
    if (activeTab === 'ALL') return true;
    return r.status === activeTab;
  });

  const pendingCount = reqList.filter((r) => r.status === 'PENDING').length;

  const handleOpenApprove = (req: SubscriptionRequest) => {
    setSelectedRequest(req);
    setApprovedDays(req.requestedDays || 30);
    setCustomDays('');
    setAdminNotes('');
    setShowApproveModal(true);
  };

  const handleOpenReject = (req: SubscriptionRequest) => {
    setSelectedRequest(req);
    setAdminNotes('');
    setShowRejectModal(true);
  };

  const handleApproveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;

    const finalDays = customDays ? parseInt(customDays, 10) : approvedDays;
    if (isNaN(finalDays) || finalDays <= 0) {
      toast.error('Please enter a valid number of days.');
      return;
    }

    setIsSubmitting(true);
    try {
      await approveMutation.mutateAsync({
        requestId: selectedRequest.id,
        approvedDays: finalDays,
        adminNotes,
      });
      toast.success(`Subscription request approved for ${finalDays} days!`);
      setShowApproveModal(false);
      refetch();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to approve request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;

    setIsSubmitting(true);
    try {
      await rejectMutation.mutateAsync({
        requestId: selectedRequest.id,
        adminNotes,
      });
      toast.success('Subscription request rejected.');
      setShowRejectModal(false);
      refetch();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to reject request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#161810] border border-[#2D3C13] rounded-[16px] overflow-hidden flex flex-col">
      {/* Header & Tabs */}
      <div className="p-6 border-b border-[#2D3C13] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111210]">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="font-heading font-bold text-lg text-[#E8EDD4]">Subscription Requests</h2>
            {pendingCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#f59e0b]/20 border border-[#f59e0b]/40 text-[#f59e0b] font-sans font-bold text-xs">
                {pendingCount} Pending
              </span>
            )}
          </div>
          <p className="font-sans text-xs text-[#8CB34A] mt-1">Review and approve manual host subscription requests.</p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-[#1A230A] border border-[#2D3C13] p-1 rounded-lg">
          {(['PENDING', 'APPROVED', 'REJECTED', 'ALL'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-md font-sans text-xs font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-[#8CB34A] text-[#161810]'
                  : 'text-[#E8EDD4]/70 hover:text-[#E8EDD4]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Requests Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[950px] text-left border-collapse">
          <thead>
            <tr className="border-b border-[#2D3C13] bg-[#111210]">
              <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px]">HOST DETAILS</th>
              <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px]">REQUESTED PLAN</th>
              <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px]">DURATION</th>
              <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px]">NOTE / REASON</th>
              <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px]">DATE SUBMITTED</th>
              <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] text-center">STATUS</th>
              <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] text-right">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-xs text-[#5A752A]">
                  No subscription requests found for "{activeTab}".
                </td>
              </tr>
            ) : (
              filteredList.map((req, index) => {
                const hostName =
                  req.host?.businessName ||
                  `${req.host?.user?.firstName || ''} ${req.host?.user?.lastName || ''}`.trim() ||
                  'Unknown Host';
                const email = req.host?.user?.email || 'N/A';
                const createdDate = new Intl.DateTimeFormat('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                }).format(new Date(req.createdAt));

                return (
                  <tr
                    key={req.id}
                    className={`${
                      index !== filteredList.length - 1 ? 'border-b border-[#2D3C13]' : ''
                    } hover:bg-[#1A230A] transition-colors`}
                  >
                    {/* Host Info */}
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-sans font-medium text-xs text-[#E8EDD4]">{hostName}</span>
                        <span className="font-sans text-[11px] text-[#8CB34A]">{email}</span>
                      </div>
                    </td>

                    {/* Plan */}
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 rounded-full border border-[#8CB34A] bg-[#1A230A] text-[#A0D056] font-sans font-semibold text-[10px]">
                        {req.plan?.name || 'Plan'} (£{req.plan?.price}/mo)
                      </span>
                    </td>

                    {/* Duration */}
                    <td className="py-4 px-6 font-sans text-xs text-[#E8EDD4]">
                      {req.requestedDays ? `${req.requestedDays} Days` : '30 Days'}
                      {req.approvedDays && <span className="block text-[10px] text-[#8CB34A]">Approved: {req.approvedDays}d</span>}
                    </td>

                    {/* Note */}
                    <td className="py-4 px-6 font-sans text-xs text-[#E8EDD4]/80 max-w-[200px] truncate" title={req.note || ''}>
                      {req.note || <span className="text-[#5A752A] italic">No note</span>}
                    </td>

                    {/* Date */}
                    <td className="py-4 px-6 font-sans text-xs text-[#E8EDD4]">{createdDate}</td>

                    {/* Status Pill */}
                    <td className="py-4 px-6 text-center">
                      {req.status === 'PENDING' && (
                        <span className="px-3 py-1 rounded-full border border-[#f59e0b]/40 bg-[#241a08] text-[#f59e0b] font-sans font-medium text-[10px]">
                          Pending
                        </span>
                      )}
                      {req.status === 'APPROVED' && (
                        <span className="px-3 py-1 rounded-full border border-[#4ADE80]/30 bg-[#083b18] text-[#4ADE80] font-sans font-medium text-[10px]">
                          Approved
                        </span>
                      )}
                      {req.status === 'REJECTED' && (
                        <span className="px-3 py-1 rounded-full border border-[#EF4444]/30 bg-[#7F1D1D] text-[#f76b6b] font-sans font-medium text-[10px]">
                          Rejected
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-4 px-6 text-right">
                      {req.status === 'PENDING' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenApprove(req)}
                            className="px-3 py-1 bg-[#8CB34A] hover:bg-[#72943A] text-[#161810] font-sans font-semibold text-xs rounded transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleOpenReject(req)}
                            className="px-3 py-1 bg-[#7F1D1D] hover:bg-[#991B1B] text-[#f76b6b] font-sans font-semibold text-xs rounded transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="font-sans text-[11px] text-[#5A752A]">Completed</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Approve Request Modal */}
      {showApproveModal && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#161810] border border-[#2D3C13] p-6 md:p-8 rounded-[24px] shadow-2xl w-full max-w-lg flex flex-col gap-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#2D3C13] pb-4">
              <div>
                <h3 className="font-heading font-bold text-xl text-[#E8EDD4]">Approve Subscription</h3>
                <p className="font-sans text-xs text-[#8CB34A] mt-1">Host: <strong>{selectedRequest.host?.businessName || selectedRequest.host?.user?.email}</strong></p>
              </div>
              <button
                type="button"
                onClick={() => setShowApproveModal(false)}
                className="text-[#E8EDD4]/60 hover:text-white text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleApproveSubmit} className="flex flex-col gap-5">
              <div className="bg-[#1A230A] border border-[#43581E] p-4 rounded-xl flex flex-col gap-1 text-xs text-[#E8EDD4]">
                <p><strong>Plan Requested:</strong> {selectedRequest.plan?.name} (£{selectedRequest.plan?.price})</p>
                <p><strong>Host Requested Duration:</strong> {selectedRequest.requestedDays || 30} Days</p>
                {selectedRequest.note && <p><strong>Host Note:</strong> "{selectedRequest.note}"</p>}
              </div>

              {/* Duration Select */}
              <div className="flex flex-col gap-2">
                <label className="font-sans text-xs font-semibold text-[#E8EDD4]">
                  Set Approved Duration (Days/Months)
                </label>
                <select
                  value={approvedDays}
                  onChange={(e) => {
                    setApprovedDays(Number(e.target.value));
                    setCustomDays('');
                  }}
                  className="w-full bg-[#111210] border border-[#2D3C13] rounded-lg px-4 py-2.5 text-sm text-[#E8EDD4] focus:outline-none focus:border-[#8CB34A]"
                >
                  <option value={30}>1 Month (30 Days)</option>
                  <option value={60}>2 Months (60 Days)</option>
                  <option value={90}>3 Months (90 Days)</option>
                  <option value={180}>6 Months (180 Days)</option>
                  <option value={365}>1 Year (365 Days)</option>
                  <option value={36500}>Lifetime Access (36,500 Days)</option>
                </select>
              </div>

              {/* Custom Days Input */}
              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-xs text-[#8CB34A]">Or Enter Custom Days:</label>
                <input
                  type="number"
                  placeholder="e.g. 45 or 120"
                  value={customDays}
                  onChange={(e) => setCustomDays(e.target.value)}
                  className="w-full bg-[#111210] border border-[#2D3C13] rounded-lg px-4 py-2 text-sm text-[#E8EDD4] focus:outline-none focus:border-[#8CB34A]"
                />
              </div>

              {/* Admin Note */}
              <div className="flex flex-col gap-2">
                <label className="font-sans text-xs font-semibold text-[#E8EDD4]">
                  Admin Approval Notes (Optional)
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="e.g. Approved manual subscription per bank transfer confirmation."
                  rows={2}
                  className="w-full bg-[#111210] border border-[#2D3C13] rounded-lg p-3 text-sm text-[#E8EDD4] focus:outline-none focus:border-[#8CB34A] resize-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowApproveModal(false)}
                  className="flex-1 py-2.5 rounded-lg border border-[#2D3C13] text-xs font-semibold text-[#E8EDD4] hover:bg-[#1A230A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-[#8CB34A] hover:bg-[#72943A] text-[#161810] font-sans font-semibold text-xs rounded-lg transition-colors"
                >
                  {isSubmitting ? 'Approving...' : 'Confirm & Activate Subscription'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Request Modal */}
      {showRejectModal && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#161810] border border-[#2D3C13] p-6 md:p-8 rounded-[24px] shadow-2xl w-full max-w-md flex flex-col gap-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#2D3C13] pb-4">
              <h3 className="font-heading font-bold text-xl text-[#f76b6b]">Reject Subscription Request</h3>
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="text-[#E8EDD4]/60 hover:text-white text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRejectSubmit} className="flex flex-col gap-5">
              <p className="font-sans text-xs text-[#E8EDD4]">
                Are you sure you want to reject the subscription request for{' '}
                <strong>{selectedRequest.host?.businessName || selectedRequest.host?.user?.email}</strong>?
              </p>

              <div className="flex flex-col gap-2">
                <label className="font-sans text-xs font-semibold text-[#E8EDD4]">Rejection Reason / Note</label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="e.g. Payment ref not verified or invalid details."
                  rows={3}
                  className="w-full bg-[#111210] border border-[#2D3C13] rounded-lg p-3 text-sm text-[#E8EDD4] focus:outline-none focus:border-red-500 resize-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1 py-2.5 rounded-lg border border-[#2D3C13] text-xs font-semibold text-[#E8EDD4] hover:bg-[#1A230A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-[#7F1D1D] hover:bg-[#991B1B] text-[#f76b6b] font-sans font-semibold text-xs rounded-lg transition-colors"
                >
                  {isSubmitting ? 'Rejecting...' : 'Confirm Rejection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
