import { StatItem } from "../../types/homepage.types";

export interface TrustBenefit {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export const trustStatsData: StatItem[] = [
  {
    id: "trust-stat-1",
    value: "2,400+",
    label: "Draws Completed",
  },
  {
    id: "trust-stat-2",
    value: "£180,000+",
    label: "Prizes Won",
  },
  {
    id: "trust-stat-3",
    value: "12,000+",
    label: "Happy Winners",
  },
  {
    id: "trust-stat-4",
    value: "£1.00",
    label: "Minimum Entry",
  },
];

export const trustBenefitsData: TrustBenefit[] = [
  {
    id: "benefit-1",
    title: "100% Secure Payments",
    description: "Every ticket purchase is protected by 256-bit bank-grade encryption, ensuring your payments are always safe.",
    iconName: "ShieldCheckIcon",
  },
  {
    id: "benefit-2",
    title: "Escrow-Protected Payouts",
    description: "Ticket funds are held securely in escrow. Hosts only receive their payout once the prize delivery is verified by the winner.",
    iconName: "LockClosedIcon",
  },
  {
    id: "benefit-3",
    title: "Verified Random Draws",
    description: "All draws are conducted live on stream using public third-party random number generators. Verifiable and fully transparent.",
    iconName: "SparklesIcon",
  },
];
