"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PricingPlan, BillingCycle } from "../../../types/pricing.types";
import PrimaryButton from "../shared/PrimaryButton";
import SecondaryButton from "../shared/SecondaryButton";
import { cn } from "../../../lib/utils";
import { useAuthUser } from "../../../hooks/useAuthHooks";
import { useCreateCheckoutSessionMutation, useCreateSubscriptionRequestMutation } from "../../../hooks/useSubscriptionHooks";
import { SubscriptionPlan } from "../../../services/subscription.service";
import { toast } from "sonner";

interface PricingPlanCardProps {
  plan: PricingPlan;
  billingCycle: BillingCycle;
  dbPlan?: SubscriptionPlan; // Passed from backend if available
}

/**
 * Pricing plan card component matching the Figma layouts.
 * Highlights the Premium plan. Handles pricing calculations.
 */
export default function PricingPlanCard({ plan, billingCycle, dbPlan }: PricingPlanCardProps) {
  const isYearly = billingCycle === "yearly";
  const price = isYearly && plan.yearlyPrice !== undefined ? plan.yearlyPrice : plan.monthlyPrice;
  const router = useRouter();
  const { data: user } = useAuthUser();
  const createCheckout = useCreateCheckoutSessionMutation();
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestedDays, setRequestedDays] = useState<number>(30);
  const [requestNote, setRequestNote] = useState<string>('');
  const createRequestMutation = useCreateSubscriptionRequestMutation();

  const handleSubscribe = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (user.role !== 'HOST') {
      toast.error('Only Host accounts can purchase subscriptions. Please create a Host account.');
      return;
    }
    if (!dbPlan) {
      toast.error('Subscription plan not found in database.');
      return;
    }

    setLoading(true);
    createCheckout.mutate(dbPlan.id, {
      onSuccess: (data) => {
        setLoading(false);
        if (data.isManualMode) {
          // Open manual request modal
          setShowRequestModal(true);
        } else if (data.isFree || data.isTest) {
          setShowSuccessModal(true);
        } else if (data.url) {
          window.location.href = data.url;
        } else {
          toast.error('No checkout URL returned.');
        }
      },
      onError: () => {
        setLoading(false);
        // Fallback to manual request modal
        setShowRequestModal(true);
      }
    });
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dbPlan) return;
    setLoading(true);
    try {
      await createRequestMutation.mutateAsync({
        planId: dbPlan.id,
        requestedDays,
        note: requestNote,
      });
      toast.success('Subscription request submitted successfully! Pending admin approval.');
      setShowRequestModal(false);
      router.push('/dashboard/host/billing');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit subscription request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "relative flex flex-col bg-surface border rounded-[16px] p-8 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-glow w-full",
        plan.isFeatured
          ? "border-primary ring-1 ring-primary/30"
          : "border-border hover:border-border-medium"
      )}
    >
      {/* Featured Ribbon Badge */}
      {plan.isFeatured && plan.badgeLabel && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary rounded-full px-4 py-1 shadow-md">
          <span className="font-sans font-bold text-[10px] tracking-wider text-primary-text uppercase">
            {plan.badgeLabel}
          </span>
        </div>
      )}

      {/* Plan Header */}
      <div className="flex flex-col items-start mb-6">
        <h3 className="font-heading font-bold text-lg text-text-primary uppercase tracking-wide">
          {plan.name}
        </h3>
        
        {/* Price Tag */}
        <div className="flex items-baseline gap-1 mt-3">
          <span className="font-heading font-bold text-4xl text-text-brand select-none">
            {price === 0 ? "£0" : `£${isYearly ? price * 12 : price}`}
          </span>
          <span className="font-sans text-xs text-text-muted select-none">
            {price === 0 ? "/forever" : isYearly ? " billed yearly" : "/month"}
          </span>
        </div>
        
        {isYearly && plan.monthlyPrice > 0 && (
          <span className="font-sans text-[10px] text-text-secondary mt-1 select-none">
            Equivalent to £{price} per month
          </span>
        )}
      </div>

      {/* Commission Level Label */}
      <div className="inline-flex items-center bg-accent-bg border border-border px-3 py-1.5 rounded-full text-xs font-semibold text-text-brand select-none w-fit mb-6">
        {plan.commissionLabel}
      </div>

      {/* Divider */}
      <div className="h-px bg-divider w-full mb-6" />

      {/* Feature List */}
      <ul className="flex-1 flex flex-col gap-3.5 mb-8">
        {plan.features.map((feature) => (
          <li
            key={feature.id}
            className={cn(
              "flex items-center gap-3 font-sans text-xs md:text-sm transition-all duration-200",
              feature.included ? "text-text-primary" : "text-text-muted/40"
            )}
          >
            {/* Check or Dash SVG icon */}
            {feature.included ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={3}
                stroke="currentColor"
                className="w-4 h-4 text-primary shrink-0"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-4 h-4 text-text-muted/30 shrink-0"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
              </svg>
            )}
            <span>{feature.label}</span>
          </li>
        ))}
      </ul>

      {/* CTA Action Button */}
      <div className="mt-auto">
        {plan.isFeatured ? (
          <PrimaryButton 
            className="w-full py-3 text-sm tracking-wide flex justify-center items-center gap-2" 
            onClick={handleSubscribe} 
            disabled={loading}
          >
            {loading ? 'Processing...' : plan.ctaLabel}
          </PrimaryButton>
        ) : (
          <SecondaryButton 
            className="w-full py-3 text-sm tracking-wide flex justify-center items-center gap-2" 
            onClick={handleSubscribe} 
            disabled={loading}
          >
            {loading ? 'Processing...' : plan.ctaLabel}
          </SecondaryButton>
        )}
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-surface border border-border p-8 rounded-[24px] shadow-glow w-[90%] max-w-md flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8 text-primary">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>
            <h2 className="font-heading font-bold text-2xl text-text-primary mb-3">Payment Successful</h2>
            <p className="font-sans text-sm text-text-secondary mb-8">Your subscription has been activated successfully.</p>
            <PrimaryButton 
              className="w-full py-3" 
              onClick={() => {
                window.location.href = '/dashboard/host/billing?status=success';
              }}
            >
              Continue to Dashboard
            </PrimaryButton>
          </div>
        </div>
      )}

      {/* Manual Subscription Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#161810] border border-[#2D3C13] p-6 md:p-8 rounded-[24px] shadow-2xl w-full max-w-lg flex flex-col gap-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#2D3C13] pb-4">
              <div>
                <h3 className="font-heading font-bold text-xl text-[#E8EDD4]">Request Subscription</h3>
                <p className="font-sans text-xs text-[#8CB34A] mt-1">Plan: <strong>{plan.name}</strong></p>
              </div>
              <button
                type="button"
                onClick={() => setShowRequestModal(false)}
                className="text-[#E8EDD4]/60 hover:text-white text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRequestSubmit} className="flex flex-col gap-5">
              {/* User Auto Details */}
              <div className="bg-[#1A230A] border border-[#43581E] p-4 rounded-xl flex flex-col gap-1 text-xs text-[#E8EDD4]">
                <p><strong>Host Name:</strong> {user?.firstName || ''} {user?.lastName || ''} ({user?.email})</p>
                <p><strong>Selected Plan:</strong> {plan.name} (£{price}/mo)</p>
              </div>

              {/* Duration Select */}
              <div className="flex flex-col gap-2">
                <label className="font-sans text-xs font-semibold text-[#E8EDD4]">
                  Requested Duration <span className="text-red-400">*</span>
                </label>
                <select
                  value={requestedDays}
                  onChange={(e) => setRequestedDays(Number(e.target.value))}
                  className="w-full bg-[#111210] border border-[#2D3C13] rounded-lg px-4 py-2.5 text-sm text-[#E8EDD4] focus:outline-none focus:border-[#8CB34A]"
                >
                  <option value={30}>1 Month (30 Days)</option>
                  <option value={60}>2 Months (60 Days)</option>
                  <option value={90}>3 Months (90 Days)</option>
                  <option value={180}>6 Months (180 Days)</option>
                  <option value={365}>1 Year (365 Days)</option>
                  <option value={36500}>Lifetime Access</option>
                </select>
              </div>

              {/* Optional Note */}
              <div className="flex flex-col gap-2">
                <label className="font-sans text-xs font-semibold text-[#E8EDD4]">
                  Note / Request Details (Optional)
                </label>
                <textarea
                  value={requestNote}
                  onChange={(e) => setRequestNote(e.target.value)}
                  placeholder="e.g. Requesting plan upgrade for winter campaign, paid offline ref #1234"
                  rows={3}
                  className="w-full bg-[#111210] border border-[#2D3C13] rounded-lg p-3 text-sm text-[#E8EDD4] placeholder:text-[#5A752A] focus:outline-none focus:border-[#8CB34A] resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1 py-2.5 rounded-lg border border-[#2D3C13] text-xs font-semibold text-[#E8EDD4] hover:bg-[#1A230A] transition-colors"
                >
                  Cancel
                </button>
                <PrimaryButton
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 text-xs font-semibold justify-center"
                >
                  {loading ? 'Submitting...' : 'Submit Request to Admin'}
                </PrimaryButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
