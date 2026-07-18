export type RaffleStatus = "live" | "ending_soon" | "sold_out" | "ended";

export type RaffleTabId = "details" | "how-to-enter" | "terms";

export interface InstantWinPrize {
  id: string;
  title: string;
  image: string | null;
  ticketNumber: number;
  isClaimed: boolean;
}

export interface RaffleDetail {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: RaffleStatus;
  images: string[];
  ticketPrice: number;
  worthPrice?: number;
  totalPoolValue: number; // Value of main prize + instant wins
  minimumTickets?: number;
  maximumTicketsPerOrder?: number;
  totalTickets: number;
  soldTickets: number;
  remainingTickets: number;
  drawEndDate: string;
  endDate?: string;
  description: string;
  highlights: string[];
  terms: string[];
  instantWinPrizes: InstantWinPrize[];
  isFeatured: boolean;
  hostName?: string;
  hostLogo?: string;
  hostDrawsCount?: number;
  hostVerified?: boolean;
  isAutoDraw?: boolean;
}

export interface RaffleTab {
  id: RaffleTabId;
  label: string;
}
