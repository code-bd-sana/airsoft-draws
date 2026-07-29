"use client";
import React from "react";
import { PRICING_PLANS } from "../../../data/pricing/pricing-plans.data";
import { BillingCycle } from "../../../types/pricing.types";
import PricingPlanCard from "./PricingPlanCard";
import { useSubscriptionPlans } from "../../../hooks/useSubscriptionHooks";

interface PricingPlanGridProps {
  billingCycle: BillingCycle;
}

/**
 * Centered layout holding the two paid subscription plans (Premium and Pro).
 */
export default function PricingPlanGrid({ billingCycle }: PricingPlanGridProps) {
  const { data: dbPlans } = useSubscriptionPlans();

  return (
    <div className="flex flex-col md:flex-row items-stretch justify-center gap-8 lg:gap-10 w-full max-w-4xl mx-auto px-4 md:px-0">
      {PRICING_PLANS.map((plan) => {
        const dbPlan = dbPlans?.find(p => p.name === plan.name);
        return (
          <div key={plan.id} className="flex-1 w-full max-w-[440px] mx-auto flex">
            <PricingPlanCard plan={plan} billingCycle={billingCycle} dbPlan={dbPlan} />
          </div>
        );
      })}
    </div>
  );
}
