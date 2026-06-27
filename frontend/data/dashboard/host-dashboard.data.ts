import { HostDashboardStat, HostCompetitionSummary, HostChartDataPoint, HostUpcomingDraw, HostRecentActivity, HostRaffleDetail, HostSalesChartDataPoint, HostDrawItem, PayoutMetrics, PayoutHistoryItem, PerformanceRevenueDataPoint, PerformanceCategorySales, PerformanceTopRaffle, PerformanceDemographic } from "../../types/host-dashboard.types";

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

export const mockHostRafflesList: HostRaffleDetail[] = [
  {
    id: "r-1",
    name: "Summer Car Raffle 2024",
    ticketsSold: 342,
    totalTickets: 500,
    raised: 855.00,
    status: "Live",
    endsAt: "14 Jul 2024",
    grossRevenue: 1250.00,
    ticketPrice: 2.50,
    platformFee: 125.00,
    platformFeePercent: 10,
    platformPlan: "Premium Plan",
    netEarnings: 1125.00
  },
  {
    id: "r-2",
    name: "Charity Football Night",
    ticketsSold: 120,
    totalTickets: 200,
    raised: 300.00,
    status: "Live",
    endsAt: "20 Jul 2024",
    grossRevenue: 500.00,
    ticketPrice: 2.50,
    platformFee: 50.00,
    platformFeePercent: 10,
    platformPlan: "Premium Plan",
    netEarnings: 450.00
  },
  {
    id: "r-3",
    name: "Holiday Hamper Draw",
    ticketsSold: 500,
    totalTickets: 500,
    raised: 1250.00,
    status: "Completed",
    endsAt: "01 Jun 2024",
    grossRevenue: 1250.00,
    ticketPrice: 2.50,
    platformFee: 125.00,
    platformFeePercent: 10,
    platformPlan: "Premium Plan",
    netEarnings: 1125.00
  },
  {
    id: "r-4",
    name: "Tech Bundle Giveaway",
    ticketsSold: 80,
    totalTickets: 300,
    raised: 200.00,
    status: "Draft",
    endsAt: "—",
    grossRevenue: 200.00,
    ticketPrice: 2.50,
    platformFee: 20.00,
    platformFeePercent: 10,
    platformPlan: "Premium Plan",
    netEarnings: 180.00
  }
];

export const mockSalesMetrics: HostDashboardStat[] = [
  {
    id: "total_revenue",
    label: "Total Revenue",
    value: "£8,450",
    change: "▲ 12%",
    trend: "up"
  },
  {
    id: "total_tickets_sold",
    label: "Tickets Sold",
    value: "1,245",
    change: "▲ 8%",
    trend: "up"
  },
  {
    id: "avg_order_value",
    label: "Avg. Order Value",
    value: "£6.78",
    change: "▼ 0.4%",
    trend: "down"
  },
  {
    id: "conversion_rate",
    label: "Conversion Rate",
    value: "4.2%",
    change: "▲ 0.3%",
    trend: "up"
  }
];

export const mockSalesChartData: HostSalesChartDataPoint[] = [
  { date: "Mon", sales: 120, revenue: 600 },
  { date: "Tue", sales: 150, revenue: 750 },
  { date: "Wed", sales: 180, revenue: 900 },
  { date: "Thu", sales: 140, revenue: 700 },
  { date: "Fri", sales: 220, revenue: 1100 },
  { date: "Sat", sales: 280, revenue: 1400 },
  { date: "Sun", sales: 310, revenue: 1550 },
];

export const mockDrawsList: HostDrawItem[] = [
  {
    id: "draw-1",
    name: "Tokyo Marui Next Gen HK416 Delta Custom",
    drawDate: "Draws 22 Jun 2025",
    status: "Awaiting Draw",
    verifiedEntries: 500
  },
  {
    id: "draw-2",
    name: "Sniper Rifle Set",
    drawDate: "Drawn 15 May 2024",
    status: "Drawn",
    winner: "Alex B.",
    verifiedEntries: 350
  },
  {
    id: "draw-3",
    name: "Pistol & Holster Kit",
    drawDate: "Draws 10 Jul 2024",
    status: "Awaiting Draw",
    verifiedEntries: 120
  },
  {
    id: "draw-4",
    name: "VFC BCM MCMR 11.5 GBBR",
    drawDate: "Drawn 01 Jun 2024",
    status: "Drawn",
    winner: "Sarah T.",
    verifiedEntries: 420
  }
];

export const mockPayoutMetrics: PayoutMetrics = {
  availableBalance: 1125.00,
  pendingClearance: 512.50,
  totalLifetimeEarnings: 2808.00,
  totalFeesPaid: 347.00
};

export const mockPayoutHistory: PayoutHistoryItem[] = [
  { id: "p-1", date: "14 Jun 2026", grossAmount: 855.00, feeDeducted: 85.50, feePercent: 10, netAmount: 769.50, method: "Bank Transfer", status: "Paid", referenceId: "TXN-00421" },
  { id: "p-2", date: "6 Jun 2026", grossAmount: 630.00, feeDeducted: 94.50, feePercent: 15, netAmount: 535.50, method: "Bank Transfer", status: "Paid", referenceId: "TXN-00389" },
  { id: "p-3", date: "22 May 2026", grossAmount: 1250.00, feeDeducted: 125.00, feePercent: 10, netAmount: 1125.00, method: "Stripe", status: "Paid", referenceId: "TXN-00312" },
  { id: "p-4", date: "1 May 2026", grossAmount: 420.00, feeDeducted: 42.00, feePercent: 10, netAmount: 378.00, method: "Bank Transfer", status: "Paid", referenceId: "TXN-00278" },
];

export const mockPerformanceRevenue: PerformanceRevenueDataPoint[] = [
  { month: "Jan", revenue: 7000 },
  { month: "Feb", revenue: 14000 },
  { month: "Mar", revenue: 11000 },
  { month: "Apr", revenue: 20000 },
  { month: "May", revenue: 18000 },
  { month: "Jun", revenue: 28000 },
];

export const mockPerformanceCategories: PerformanceCategorySales[] = [
  { name: "Rifles", value: 42, percentage: 42, color: "#8cb34a" },
  { name: "Pistols", value: 28, percentage: 28, color: "#5a752a" },
  { name: "Accessories", value: 18, percentage: 18, color: "#2d3c13" },
  { name: "Bundles", value: 12, percentage: 12, color: "#e8edd4" },
];

export const mockPerformanceTopRaffles: PerformanceTopRaffle[] = [
  { id: "r1", name: "VFC HK416 Bundle", percentage: 94 },
  { id: "r2", name: "Tokyo Marui MWS", percentage: 81 },
  { id: "r3", name: "Sniper Rifle Set", percentage: 67 },
  { id: "r4", name: "Pistol & Holster", percentage: 53 },
  { id: "r5", name: "Accessories Pack", percentage: 39 },
];

export const mockPerformanceDemographics: PerformanceDemographic[] = [
  { region: "England", percentage: 58 },
  { region: "Scotland", percentage: 19 },
  { region: "Wales", percentage: 13 },
  { region: "N. Ireland", percentage: 7 },
  { region: "International", percentage: 3 },
];
