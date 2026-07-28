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
  paragraphText: "Enter draws from just £1 per ticket. Fair and transparent. Over £180k+ in prizes already won by our community.",
  primaryCtaLabel: "Browse Live Draws",
  primaryCtaHref: "/live-raffles",
  secondaryCtaLabel: "How It Works",
  secondaryCtaHref: "/how-it-works",
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
    title: "Tokyo Marui MWS GBBR Package",
    description: "Features ZET system for ultimate gas efficiency and realistic blowback action. Includes 3 spare magazines.",
    image: "https://images.unsplash.com/photo-1605557626697-2e87166d88f9?q=80&w=800&auto=format&fit=crop",
    ticketPrice: 3.50,
    totalTickets: 300,
    soldTickets: 45,
    endDate: "Ends in 3d 14h",
    status: "live",
    category: "rifles",
    worthPrice: 750,
    isFeatured: true,
  },
};
