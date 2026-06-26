import React from "react";
import { PRICING_PLANS } from "../../../data/pricing/pricing-plans.data";
import { BillingCycle } from "../../../types/pricing.types";
import PricingPlanCard from "./PricingPlanCard";

interface PricingPlanGridProps {
  billingCycle: BillingCycle;
}

/**
 * Grid layout to hold the three plan levels (Free, Premium, Pro).
 */
export default function PricingPlanGrid({ billingCycle }: PricingPlanGridProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6 xl:gap-8 w-full max-w-6xl mx-auto px-4 md:px-0">
      {PRICING_PLANS.map((plan) => (
        <PricingPlanCard key={plan.id} plan={plan} billingCycle={billingCycle} />
      ))}
    </div>
  );
}
