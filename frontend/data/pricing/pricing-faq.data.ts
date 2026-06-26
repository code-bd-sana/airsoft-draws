import { FaqItem } from "../../types/faq.types";

export const PRICING_FAQ: FaqItem[] = [
  {
    id: "upgrade-downgrade",
    question: "Can I upgrade or downgrade my plan at any time?",
    answer: "Yes, you can change your subscription plan directly from your host dashboard. Upgrades take effect immediately, and any unused portion of your previous plan will be prorated. Downgrades take effect at the start of your next billing cycle.",
  },
  {
    id: "commission-fee",
    question: "What does the commission percentage cover?",
    answer: "Platform commissions cover the cost of escrow protection, payment processing gateways, drawing verification, customer support, and administrative verification, ensuring all draws remain fully compliant and secure.",
  },
  {
    id: "free-trial",
    question: "Is there a free trial for Premium or Pro?",
    answer: "Yes! New hosts receive a 14-day trial period of our Premium plan features. You can set up your dashboard, plan draws, and test our tools before any subscription billing begins.",
  },
  {
    id: "payout-process",
    question: "How are payouts processed?",
    answer: "Once a draw is completed and the winner is drawn, funds are held in secure escrow. After the winner confirms delivery or 7 days pass with no dispute, the host's payouts are processed and sent to their registered bank account.",
  },
];
