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
  status: "live" | "drawn" | "ended";
  image: string;
  totalTickets: number;
  soldTickets: number;
  revenue: number;
  drawDate?: string;
}

export interface HostChartDataPoint {
  date: string;
  revenue: number;
}
