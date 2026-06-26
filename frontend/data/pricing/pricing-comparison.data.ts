import { ComparisonRow } from "../../types/pricing.types";

export const COMPARISON_ROWS: ComparisonRow[] = [
  {
    featureName: "Active draws",
    freeValue: "Up to 3",
    premiumValue: "Unlimited",
    proValue: "Unlimited",
  },
  {
    featureName: "Host dashboard",
    freeValue: true,
    premiumValue: true,
    proValue: true,
  },
  {
    featureName: "Email support",
    freeValue: true,
    premiumValue: "Priority",
    proValue: "24/7",
  },
  {
    featureName: "Featured listing slots",
    freeValue: false,
    premiumValue: "3/month",
    proValue: "Unlimited",
  },
  {
    featureName: "Priority payout",
    freeValue: false,
    premiumValue: true,
    proValue: true,
  },
  {
    featureName: "Custom branding",
    freeValue: false,
    premiumValue: false,
    proValue: true,
  },
  {
    featureName: "Advanced analytics",
    freeValue: false,
    premiumValue: false,
    proValue: true,
  },
  {
    featureName: "Dedicated account manager",
    freeValue: false,
    premiumValue: false,
    proValue: true,
  },
];
