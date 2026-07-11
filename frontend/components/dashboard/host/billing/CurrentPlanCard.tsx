"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { useMySubscription, useCancelSubscriptionMutation } from "../../../../hooks/useSubscriptionHooks";

export default function CurrentPlanCard() {
  const { data: subscription, isLoading, refetch } = useMySubscription();
  const cancelMutation = useCancelSubscriptionMutation();
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancel = async () => {
    if (confirm("Are you sure you want to cancel your subscription?")) {
      setIsCancelling(true);
      try {
        await cancelMutation.mutateAsync();
        toast.success('Subscription cancelled successfully.');
        refetch();
      } catch (err) {
        toast.error('Failed to cancel subscription.');
      } finally {
        setIsCancelling(false);
      }
    }
  };

  if (isLoading) {
    return <div className="p-[24px] text-white">Loading subscription...</div>;
  }

  if (!subscription || subscription.status !== 'ACTIVE') {
    return (
      <div className="w-full bg-[#1a230a] border border-[#2d3c13] rounded-[16px] p-[24px] lg:p-[32px] flex flex-col sm:flex-row sm:items-center justify-between gap-[24px]">
        <div className="flex flex-col gap-[8px]">
          <h2 className="font-heading font-medium text-[20px] text-[#e8edd4]">
            No Active Subscription
          </h2>
          <p className="font-sans font-medium text-[14px] text-[#ff4d4f]">
            {subscription?.status === 'CANCELLED' ? 'Your subscription was cancelled.' : 'You do not have an active plan.'}
          </p>
        </div>
        <div className="flex items-center gap-[24px]">
          <a href="/pricing" className="h-[40px] flex items-center justify-center px-[24px] bg-[#8cb34a] hover:bg-[#72943A] rounded-[8px] font-sans font-semibold text-[13px] text-[#1a230a] transition-colors">
            Subscribe Now
          </a>
        </div>
      </div>
    );
  }

  const endDate = new Date(subscription.endDate);
  const startDate = new Date(subscription.startDate);
  const formattedEndDate = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(endDate);
  const formattedStartDate = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(startDate);
  const remainingDays = Math.max(0, Math.ceil((endDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24)));
  const tx = subscription.transaction;

  return (
    <div className="w-full bg-[#1a230a] border border-[#2d3c13] rounded-[16px] p-[24px] lg:p-[32px] flex flex-col sm:flex-row sm:items-center justify-between gap-[24px]">
      
      {/* Plan Details */}
      <div className="flex flex-col gap-[8px]">
        <h2 className="font-heading font-medium text-[20px] text-[#e8edd4]">
          Current Plan: {subscription.plan.name}
        </h2>
        <p className="font-sans font-medium text-[14px] text-[#8cb34a]">
          £{subscription.plan.price}/month · Renews {formattedEndDate} ({remainingDays} days left)
        </p>
        <div className="font-sans text-[12px] text-text-muted mt-2 space-y-1">
          <p><strong>Start Date:</strong> {formattedStartDate}</p>
          <p><strong>Payment Status:</strong> {tx?.status || 'COMPLETED'}</p>
          {tx?.gatewayTransactionId && <p><strong>Transaction ID:</strong> {tx.gatewayTransactionId}</p>}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-[24px]">
        <button 
          onClick={handleCancel} 
          disabled={isCancelling}
          className="font-sans font-medium text-[13px] text-[#ff4d4f] hover:text-[#ff7875] transition-colors disabled:opacity-50"
        >
          {isCancelling ? 'Cancelling...' : 'Cancel Subscription'}
        </button>
      </div>
      
    </div>
  );
}
