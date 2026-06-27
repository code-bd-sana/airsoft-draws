export interface HostDashboardStat {
  id: string;
  label: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
}

export interface HostCompetitionSummary {
  id: string;
  title: string;
  image: string;
  status: "live" | "draft" | "ended" | "ending-soon";
  totalTickets: number;
  soldTickets: number;
  revenue: number;
  drawDate?: string;
  ticketPrice?: number;
}

export interface HostChartDataPoint {
  date?: string;
  month?: string;
  revenue: number;
}

export interface HostSalesChartDataPoint {
  date: string;
  sales: number;
  revenue: number;
}

export interface HostDrawItem {
  id: string;
  name: string;
  drawDate: string;
  status: "Awaiting Draw" | "Drawn";
  winner?: string;
  verifiedEntries: number;
}

export interface PayoutMetrics {
  availableBalance: number;
  pendingClearance: number;
  totalLifetimeEarnings: number;
  totalFeesPaid: number;
}

export interface PayoutHistoryItem {
  id: string;
  date: string;
  grossAmount: number;
  feeDeducted: number;
  feePercent: number;
  netAmount: number;
  method: string;
  status: "Paid" | "Processing";
  referenceId: string;
}

export interface HostUpcomingDraw {
  id: string;
  dateStr: string;
  title: string;
  subtitle: string;
}

export interface HostRecentActivity {
  id: string;
  type: "purchase" | "approved" | "payout" | "joined" | "review";
  title: string;
  description: string;
  timeAgo: string;
}

export interface HostRaffleDetail {
  id: string;
  name: string;
  ticketsSold: number;
  totalTickets: number;
  raised: number;
  status: "Live" | "Completed" | "Draft" | "Pending Review" | "Ended";
  endsAt: string;
  grossRevenue: number;
  ticketPrice: number;
  platformFee: number;
  platformFeePercent: number;
  platformPlan: string;
  netEarnings: number;
}

export interface PerformanceRevenueDataPoint {
  month: string;
  revenue: number;
}

export interface PerformanceCategorySales {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

export interface PerformanceTopRaffle {
  id: string;
  name: string;
  percentage: number;
}

export interface PerformanceDemographic {
  region: string;
  percentage: number;
}

export interface BillingHistoryItem {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: "Paid" | "Pending" | "Failed";
}
