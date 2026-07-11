import React from "react";
import { PricingPlan, BillingCycle } from "../../../types/pricing.types";
import PrimaryButton from "../shared/PrimaryButton";
import SecondaryButton from "../shared/SecondaryButton";
import { cn } from "../../../lib/utils";

interface PricingPlanCardProps {
  plan: PricingPlan;
  billingCycle: BillingCycle;
}

/**
 * Pricing plan card component matching the Figma layouts.
 * Highlights the Premium plan. Handles pricing calculations.
 */
export default function PricingPlanCard({ plan, billingCycle }: PricingPlanCardProps) {
  const isYearly = billingCycle === "yearly";
  const price = isYearly && plan.yearlyPrice !== undefined ? plan.yearlyPrice : plan.monthlyPrice;

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
            £{isYearly ? price * 12 : price}
          </span>
          <span className="font-sans text-xs text-text-muted select-none">
            {isYearly ? " billed yearly" : "/month"}
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
          <PrimaryButton className="w-full py-3 text-sm tracking-wide">
            {plan.ctaLabel}
          </PrimaryButton>
        ) : (
          <SecondaryButton className="w-full py-3 text-sm tracking-wide">
            {plan.ctaLabel}
          </SecondaryButton>
        )}
      </div>
    </div>
  );
}
