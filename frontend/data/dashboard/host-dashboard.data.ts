import { HostDashboardStat, HostCompetitionSummary, HostChartDataPoint } from "../../types/host-dashboard.types";

export const hostKpiStats: HostDashboardStat[] = [
  {
    id: "total_earnings",
    label: "Total Earnings",
    value: "£12,480",
    change: "▲ 18%",
    trend: "up"
  },
  {
    id: "active_raffles",
    label: "Active Competitions",
    value: "6",
    change: "▲ 2",
    trend: "up"
  },
  {
    id: "tickets_sold",
    label: "Tickets Sold (30d)",
    value: "3,240",
    change: "▲ 24%",
    trend: "up"
  },
  {
    id: "total_entrants",
    label: "Total Entrants",
    value: "1,180",
    change: "▲ 9%",
    trend: "up"
  }
];

// Mock data representing a typical 7D/1M chart trend
export const hostRevenueChartData: HostChartDataPoint[] = [
  { date: "Day 1", revenue: 800 },
  { date: "Day 2", revenue: 1200 },
  { date: "Day 3", revenue: 900 },
  { date: "Day 4", revenue: 1600 },
  { date: "Day 5", revenue: 2100 },
  { date: "Day 6", revenue: 1800 },
  { date: "Day 7", revenue: 2400 },
];

export const hostRecentCompetitions: HostCompetitionSummary[] = [
  {
    id: "comp-1",
    title: "Tokyo Marui Next Gen HK416 Delta Custom",
    status: "live",
    image: "https://images.unsplash.com/photo-1595590424283-b8f1784cb2c6?w=400&q=80",
    totalTickets: 500,
    soldTickets: 320,
    revenue: 1600,
    drawDate: "2024-05-15"
  },
  {
    id: "comp-2",
    title: "VFC BCM MCMR 11.5 GBBR with Accessories",
    status: "live",
    image: "https://images.unsplash.com/photo-1616231012354-9a889db4957e?w=400&q=80",
    totalTickets: 300,
    soldTickets: 125,
    revenue: 625,
    drawDate: "2024-05-18"
  },
  {
    id: "comp-3",
    title: "GHK AKM V3 Gas Blowback Rifle",
    status: "drawn",
    image: "https://images.unsplash.com/photo-1584381838848-158652d3a39e?w=400&q=80",
    totalTickets: 250,
    soldTickets: 250,
    revenue: 1250,
    drawDate: "2024-05-01"
  }
];
