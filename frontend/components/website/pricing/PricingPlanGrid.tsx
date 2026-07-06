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
 * Grid layout to hold the three plan levels (Free, Premium, Pro).
 */
export default function PricingPlanGrid({ billingCycle }: PricingPlanGridProps) {
  const { data: dbPlans } = useSubscriptionPlans();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6 xl:gap-8 w-full max-w-6xl mx-auto px-4 md:px-0">
      {PRICING_PLANS.map((plan) => {
        const dbPlan = dbPlans?.find(p => p.name === plan.name);
        return (
          <PricingPlanCard key={plan.id} plan={plan} billingCycle={billingCycle} dbPlan={dbPlan} />
        );
      })}
    </div>
  );
}
