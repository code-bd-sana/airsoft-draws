export interface TrustBenefit {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export const trustBenefitsData: TrustBenefit[] = [
  {
    id: "benefit-1",
    title: "100% Secure Payments",
    description: "Every ticket purchase is protected by 256-bit bank-grade encryption, ensuring your payments are always safe.",
    iconName: "ShieldCheckIcon",
  },
  {
    id: "benefit-2",
    title: "Fast Host Payouts",
    description: "Hosts are paid next working day after the live draw.",
    iconName: "LockClosedIcon",
  },
  {
    id: "benefit-3",
    title: "Verified Random Draws",
    description: "All draws are conducted live on stream using our lottery ball machine. Verifiable and fully transparent.",
    iconName: "SparklesIcon",
  },
];
