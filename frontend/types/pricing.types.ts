export type BillingCycle = "monthly" | "yearly";

export interface PricingFeature {
  id: string;
  label: string;
  included: boolean;
  tooltip?: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice?: number;
  commissionLabel: string;
  features: PricingFeature[];
  ctaLabel: string;
  isFeatured?: boolean;
  badgeLabel?: string;
}

export interface ComparisonRow {
  featureName: string;
  freeValue: string | boolean;
  premiumValue: string | boolean;
  proValue: string | boolean;
}
