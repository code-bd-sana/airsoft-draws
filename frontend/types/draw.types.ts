export type DrawStatus = "upcoming" | "live" | "ended" | "sold_out";

/**
 * Interface representing a competition or prize draw.
 * Built to easily consume API response values in the future.
 */
export interface Draw {
  id: string;
  title: string;
  description?: string;
  image: string;
  ticketPrice: number;
  totalTickets: number;
  soldTickets: number;
  endDate: string; // String format for display (e.g., "Ends in 3d 14h" or ISO Date string)
  status: DrawStatus;
  isFeatured?: boolean;
  category: string; // e.g. "rifles", "pistols", "accessories", "cash", "bundles", "gaming", "tech", "travel", "luxury"
  worthPrice?: number; // Valuation of the prize (e.g. 1200)
  instantWinsCount?: number; // For Instant Win draws (e.g. 3)
  isInstantWin?: boolean; // Flag to separate standard draws from instant win draws
}
