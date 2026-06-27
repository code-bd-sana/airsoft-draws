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
