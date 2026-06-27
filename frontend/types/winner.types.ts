export type WinnerStatus = "delivered" | "shipped" | "pending";
export type WinnerType = "instant" | "main_draw";

/**
 * Interface representing a completed competition winner record.
 * Designed to easily bind to API responses in the future.
 */
export interface Winner {
  id: string;
  name: string;
  location: string;
  avatar?: string; // deprecated, use competitionImage
  competitionImage?: string;
  winnerType?: WinnerType; // Optional initially to avoid breaking changes if data is slow to update
  initials: string;
  prizeTitle: string;
  drawDate: string; // Formatting for UI (e.g., "12 Jun 2024")
  dateString: string; // ISO date string for filtering logic (e.g. "2024-06-12")
  ticketNumber: string;
  status: WinnerStatus;
  category: string;
}
