import { FaqItem } from "../../types/faq.types";

export const PRICING_FAQ: FaqItem[] = [
  {
    id: "upgrade-downgrade",
    question: "Can I upgrade or downgrade my plan at any time?",
    answer: "Yes, you can upgrade from Premium to Pro or switch billing cycles anytime from your Host Dashboard. Upgrades take effect immediately, and any unused portion of your previous plan will be prorated automatically.",
  },
  {
    id: "plan-features",
    question: "What features are included in Premium and Pro plans?",
    answer: "Premium (£29/mo) provides 5 active competition slots, 3 featured listings per month, 10% host commission, priority payouts, and Instant Wins access. Pro (£79/mo) unlocks unlimited active draws, unlimited featured slots, custom branding, advanced analytics, and a dedicated account manager.",
  },
  {
    id: "commission-fee",
    question: "How is the 10% host commission handled?",
    answer: "Hosts receive 90% net payout on all completed competition ticket sales. The 10% platform commission is automatically calculated and deducted when requesting a withdrawal, covering escrow security, payment gateways, and draw auditing.",
  },
  {
    id: "payout-process",
    question: "How are host withdrawals processed?",
    answer: "Hosts can request a payout directly from the Host Dashboard once a draw completes. Withdrawals are processed to your registered UK bank account within 24-48 hours after winner confirmation.",
  },
  {
    id: "free-postal-entry",
    question: "Is there a free entry option for participants?",
    answer: "Yes! In strict compliance with UK Gambling Commission and ASA regulations, every competition provides an equal Free Postal Entry route. Participants can view instructions by clicking 'Free Postal Entry' on any competition page.",
  },
];
