import { HostDashboardStat, HostCompetitionSummary, HostChartDataPoint, HostUpcomingDraw, HostRecentActivity } from "../../types/host-dashboard.types";

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
  { month: "May", revenue: 29000 },
  { month: "Jun", revenue: 38000 },
];

export const hostUpcomingDraws: HostUpcomingDraw[] = [
  { id: "ud-1", dateStr: "22", title: "VFC HK416 Bundle", subtitle: "Draws in 2 days" },
  { id: "ud-2", dateStr: "25", title: "Sniper Rifle Set", subtitle: "Draws in 5 days" },
  { id: "ud-3", dateStr: "30", title: "Tokyo Marui MWS", subtitle: "Draws in 10 days" },
  { id: "ud-4", dateStr: "07", title: "Pistol & Holster Kit", subtitle: "Draws in 17 days" },
  { id: "ud-5", dateStr: "07", title: "Pistol & Holster Kit", subtitle: "Draws in 17 days" },
];

export const hostRecentActivities: HostRecentActivity[] = [
  { id: "ra-1", type: "purchase", title: "New ticket purchase", description: "VFC HK416 Bundle", timeAgo: "2 min ago" },
  { id: "ra-2", type: "approved", title: "Raffle approved by admin", description: "Sniper Rifle Set", timeAgo: "1h ago" },
  { id: "ra-3", type: "payout", title: "Payout processed", description: "£840.00", timeAgo: "3h ago" },
  { id: "ra-4", type: "joined", title: "New entrant joined", description: "Tokyo Marui MWS", timeAgo: "5h ago" },
  { id: "ra-5", type: "review", title: "Host review received", description: "5 stars", timeAgo: "1d ago" }
];

export const hostRecentCompetitions: HostCompetitionSummary[] = [
  {
    id: "comp-1",
    title: "Tokyo Marui Next Gen HK416 Delta Custom",
    status: "live",
    image: "https://placehold.co/400x400/1a230a/8cb34a?text=HK416",
    totalTickets: 500,
    soldTickets: 320,
    revenue: 1600,
    ticketPrice: 5.00,
    drawDate: "2024-05-15"
  },
  {
    id: "comp-2",
    title: "VFC BCM MCMR 11.5 GBBR with Accessories",
    status: "live",
    image: "https://placehold.co/400x400/1a230a/8cb34a?text=VFC",
    totalTickets: 300,
    soldTickets: 125,
    revenue: 625,
    ticketPrice: 5.00,
    drawDate: "2024-05-18"
  },
  {
    id: "comp-3",
    title: "Sniper Rifle Set",
    image: "https://placehold.co/400x400/1a230a/8cb34a?text=Sniper",
    status: "ending-soon",
    soldTickets: 450,
    totalTickets: 500,
    revenue: 1350,
    ticketPrice: 3.00
  },
  {
    id: "comp-4",
    title: "Pistol & Holster Kit",
    image: "https://placehold.co/400x400/1a230a/8cb34a?text=Pistol",
    status: "live",
    soldTickets: 120,
    totalTickets: 300,
    revenue: 300,
    ticketPrice: 2.50
  },
  {
    id: "comp-5",
    title: "Accessories Bundle",
    image: "https://placehold.co/400x400/1a230a/8cb34a?text=Bundle",
    status: "live",
    soldTickets: 250,
    totalTickets: 1000,
    revenue: 375,
    ticketPrice: 1.50
  }
];
