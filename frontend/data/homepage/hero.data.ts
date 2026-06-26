import { StatItem } from "../../types/homepage.types";
import { Draw } from "../../types/draw.types";

export interface HeroData {
  badgeText: string;
  headingText: string;
  paragraphText: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  stats: StatItem[];
  featuredDraw: Draw;
}

export const heroData: HeroData = {
  badgeText: "AIRSOFT GEAR COMPETITIONS",
  headingText: "Win Premium Airsoft Gear For Less",
  paragraphText: "Enter draws from just £1 per ticket. Fair, transparent, and escrow-protected. Over £180k+ in prizes already won by our community.",
  primaryCtaLabel: "Browse Live Draws",
  primaryCtaHref: "#live-draws",
  secondaryCtaLabel: "How It Works",
  secondaryCtaHref: "#how-it-works",
  stats: [
    {
      id: "hero-stat-1",
      value: "2,400+",
      label: "Draws Completed",
    },
    {
      id: "hero-stat-2",
      value: "£1",
      label: "Minimum Entry",
    },
    {
      id: "hero-stat-3",
      value: "Verified",
      label: "Fair Draws",
    },
  ],
  featuredDraw: {
    id: "hero-feat-1",
    title: "VFC HK416 GBBR Bundle",
    description: "Worth £1,200. Comes with 4 leak-free green gas magazines, tactical reflex sight, suppressor, and hard transport case.",
    image: "https://images.unsplash.com/photo-1595590424283-b8f17842773f?q=80&w=800&auto=format&fit=crop",
    ticketPrice: 2.50,
    totalTickets: 500,
    soldTickets: 342,
    endDate: "Ends in 2d 4h",
    status: "live",
    category: "bundles",
    worthPrice: 1200,
    isFeatured: true,
  },
};
