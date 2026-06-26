/**
 * Interface representing a statistic count card (e.g. 2,400+ Draws Completed).
 */
export interface StatItem {
  id: string;
  value: string;
  label: string;
}

/**
 * Interface representing a step in the 'How It Works' workflow.
 */
export interface HowItWorksStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  iconName: string;
}

/**
 * Interface representing data for the Host dashboard preview card.
 */
export interface HostDashboardPreviewData {
  activeDrawsCount: number;
  ticketsSoldThisMonth: number;
  totalEarnedAmount: number;
  monthlyTargetPercent: number;
}

/**
 * Interface representing a recent winner card.
 */
export interface WinnerItem {
  id: string;
  name: string;
  initials: string;
  location: string;
  prizeWon: string;
  whenWon: string;
  statusText: string; // e.g., "Prize Delivered"
}
