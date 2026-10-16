"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import IncompleteOrdersBanner from "@/components/dashboard/IncompleteOrdersBanner";
import { useMyTicketsQuery, useUserOrdersQuery } from "@/hooks/useTicketHooks";
import { useMyWinnersQuery } from "@/hooks/useUserHooks";

export default function UserDashboardPage() {
  const [timeRange, setTimeRange] = useState<"7D" | "1M" | "3M" | "1Y">("1M");

  const { data: ticketsData, isLoading: isLoadingTickets } = useMyTicketsQuery();
  const { data: ordersData, isLoading: isLoadingOrders } = useUserOrdersQuery();
  const { data: winnersData, isLoading: isLoadingWinners } = useMyWinnersQuery();

  const tickets = ticketsData || [];
  const orders = ordersData || [];
  const winners = winnersData || [];

  // 1. Total Tickets count
  const totalTicketsCount = tickets.length;

  // Tickets purchased this month
  const thisMonthTicketsCount = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return tickets.filter((t: any) => new Date(t.createdAt) >= startOfMonth).length;
  }, [tickets]);

  // 2. Active Entries: group active tickets by competition
  const activeEntries = useMemo(() => {
    const now = new Date();
    const activeTickets = tickets.filter((t: any) => {
      if (!t.raffle) return false;
      if (t.raffle.status === "ENDED") return false;
      if (t.raffle.endDate && new Date(t.raffle.endDate) < now) return false;
      return true;
    });

    const map = new Map<
      string,
      {
        raffle: any;
        ticketCount: number;
        latestPurchase: string;
      }
    >();

    for (const t of activeTickets) {
      const rId = t.raffle.id;
      if (!map.has(rId)) {
        map.set(rId, {
          raffle: t.raffle,
          ticketCount: 1,
          latestPurchase: t.createdAt,
        });
      } else {
        const item = map.get(rId)!;
        item.ticketCount += 1;
      }
    }

    return Array.from(map.values());
  }, [tickets]);

  const activeRafflesCount = activeEntries.length;
  const activeTicketsTotal = activeEntries.reduce((sum, item) => sum + item.ticketCount, 0);

  // 3. Won Competitions count
  const wonCount = winners.length;

  // 4. Completed Orders & Spend
  const completedOrders = useMemo(() => {
    return orders.filter((o) => o.status === "COMPLETED");
  }, [orders]);

  const totalSpent = useMemo(() => {
    return completedOrders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);
  }, [completedOrders]);

  // Spend filtered by selected time range
  const filteredSpent = useMemo(() => {
    const now = new Date();
    let cutoff = new Date();
    if (timeRange === "7D") {
      cutoff.setDate(now.getDate() - 7);
    } else if (timeRange === "1M") {
      cutoff.setMonth(now.getMonth() - 1);
    } else if (timeRange === "3M") {
      cutoff.setMonth(now.getMonth() - 3);
    } else if (timeRange === "1Y") {
      cutoff.setFullYear(now.getFullYear() - 1);
    }

    const filtered = completedOrders.filter(
      (o) => new Date(o.createdAt) >= cutoff
    );

    return filtered.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);
  }, [completedOrders, timeRange]);

  return (
    <div className="flex flex-col gap-5 p-4 sm:p-6 lg:p-8 max-w-[1660px] mx-auto w-full animate-fadeIn">
      {/* Alert banner for any incomplete or pending orders */}
      <IncompleteOrdersBanner />

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 w-full">
        {/* Total Tickets */}
        <Link
          href="/dashboard/user/tickets"
          className="bg-[#161810] border border-[#2D3C13] hover:border-[#8CB34A] rounded-[14px] p-5 flex flex-col gap-3 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <p className="font-sans text-[11px] font-normal uppercase tracking-[1.1px] text-[#5A752A] group-hover:text-[#72943A] transition-colors">
              Total Tickets
            </p>
            <svg
              className="w-4 h-4 text-[#5A752A] group-hover:text-[#8CB34A] transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </div>
          <p className="font-heading font-bold text-[28px] leading-tight text-[#E8EDD4]">
            {isLoadingTickets ? "..." : totalTicketsCount}
          </p>
          <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#083b18] w-fit">
            <span className="font-sans text-[10px] font-medium text-[#4ADE80]">
              ▲ {thisMonthTicketsCount} this month
            </span>
          </div>
        </Link>

        {/* Active Entries */}
        <Link
          href="/dashboard/user/tickets"
          className="bg-[#161810] border border-[#2D3C13] hover:border-[#8CB34A] rounded-[14px] p-5 flex flex-col gap-3 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <p className="font-sans text-[11px] font-normal uppercase tracking-[1.1px] text-[#5A752A] group-hover:text-[#72943A] transition-colors">
              Active Entries
            </p>
            <svg
              className="w-4 h-4 text-[#5A752A] group-hover:text-[#8CB34A] transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </div>
          <p className="font-heading font-bold text-[28px] leading-tight text-[#E8EDD4]">
            {isLoadingTickets ? "..." : activeRafflesCount}
          </p>
          <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#1A230A] w-fit">
            <span className="font-sans text-[10px] font-medium text-[#72943A]">
              {activeTicketsTotal > 0 ? `${activeTicketsTotal} tickets awaiting draw` : "Awaiting draw"}
            </span>
          </div>
        </Link>

        {/* Won Competitions */}
        <Link
          href="/dashboard/user/winners"
          className="bg-[#161810] border border-[#2D3C13] hover:border-[#8CB34A] rounded-[14px] p-5 flex flex-col gap-3 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <p className="font-sans text-[11px] font-normal uppercase tracking-[1.1px] text-[#5A752A] group-hover:text-[#72943A] transition-colors">
              Won Competitions
            </p>
            <svg
              className="w-4 h-4 text-[#5A752A] group-hover:text-[#8CB34A] transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </div>
          <p className="font-heading font-bold text-[28px] leading-tight text-[#E8EDD4]">
            {isLoadingWinners ? "..." : wonCount}
          </p>
          <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#083b18] w-fit">
            <span className="font-sans text-[10px] font-medium text-[#4ADE80]">
              {wonCount > 0 ? `▲ ${wonCount} prize${wonCount > 1 ? "s" : ""} won` : "No wins yet"}
            </span>
          </div>
        </Link>

        {/* Total Spent */}
        <Link
          href="/dashboard/user/transactions"
          className="bg-[#161810] border border-[#2D3C13] hover:border-[#8CB34A] rounded-[14px] p-5 flex flex-col gap-3 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <p className="font-sans text-[11px] font-normal uppercase tracking-[1.1px] text-[#5A752A] group-hover:text-[#72943A] transition-colors">
              Total Spent
            </p>
            <svg
              className="w-4 h-4 text-[#5A752A] group-hover:text-[#8CB34A] transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </div>
          <p className="font-heading font-bold text-[28px] leading-tight text-[#E8EDD4]">
            {isLoadingOrders ? "..." : `£${totalSpent.toFixed(2)}`}
          </p>
          <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-transparent w-fit">
            <span className="font-sans text-[10px] font-medium text-[#5A752A]">
              Lifetime purchases
            </span>
          </div>
        </Link>
      </div>

      {/* Row 2: Chart Overview */}
      <div className="w-full">
        {/* Ticket Spend Overview */}
        <div className="w-full bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col min-h-[346px]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-4 sm:gap-0">
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <span className="font-heading font-bold text-[32px] text-[#E8EDD4] leading-none">
                  £{(timeRange === "1M" && filteredSpent === 0 && totalSpent > 0 ? totalSpent : filteredSpent).toFixed(2)}
                </span>
                <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#083b18]">
                  <span className="font-sans text-[11px] text-[#4ADE80]">
                    {timeRange}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="font-sans text-[13px] text-[#72943A]">
                  Ticket Spend Overview
                </span>
                <span className="text-[#2D3C13]">•</span>
                <Link
                  href="/dashboard/user/transactions"
                  className="font-sans text-[12px] text-[#8CB34A] hover:text-[#A0D056] hover:underline transition-colors flex items-center gap-1"
                >
                  View Statement
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Time Filter Buttons */}
            <div className="flex items-center gap-1">
              {(["7D", "1M", "3M", "1Y"] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setTimeRange(period)}
                  className={`px-3 py-1 rounded-[10px] border font-sans font-medium text-[11px] transition-colors ${
                    timeRange === period
                      ? "border-[#8CB34A] bg-[#1A230A] text-[#8CB34A]"
                      : "border-[#2D3C13] text-[#72943A] hover:bg-[#1A230A] hover:text-[#E8EDD4]"
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex-1 w-full relative min-h-[200px]">
            {/* Chart Graphic Area */}
            <svg
              className="absolute inset-0 w-full h-full text-[#8CB34A] opacity-20"
              preserveAspectRatio="none"
              viewBox="0 0 100 100"
              fill="currentColor"
            >
              <path d="M0 100 V 50 Q 15 70 25 40 T 50 60 T 75 30 T 100 45 V 100 Z" />
            </svg>
            <svg
              className="absolute inset-0 w-full h-full"
              preserveAspectRatio="none"
              viewBox="0 0 100 100"
              fill="none"
              stroke="#8CB34A"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            >
              <path d="M0 50 Q 15 70 25 40 T 50 60 T 75 30 T 100 45" />
            </svg>

            {/* X-axis labels */}
            <div className="absolute bottom-0 w-full flex justify-between px-4">
              {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"].map(
                (month, i) => (
                  <span
                    key={i}
                    className="font-sans text-[10px] text-[#5A752A]"
                  >
                    {month}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Active Entries & Recent Wins */}
      <div className="flex flex-col xl:flex-row gap-5 w-full">
        {/* My Active Entries */}
        <div className="flex-[3] bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-heading font-medium text-[16px] text-[#E8EDD4]">
              My Active Entries
            </h3>
            {/* Working View All link */}
            <Link
              href="/dashboard/user/tickets"
              className="flex items-center gap-1 font-sans font-medium text-[13px] text-[#8CB34A] hover:text-[#A0D056] transition-colors"
            >
              View All
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          </div>

          <div className="flex flex-col">
            {/* List Header */}
            <div className="grid grid-cols-12 gap-4 pb-3 border-b border-[#1A230A] font-sans text-[11px] font-medium text-[#72943A] uppercase tracking-wider">
              <div className="col-span-6">Competition</div>
              <div className="col-span-3">Draw Date</div>
              <div className="col-span-3 text-right">Tickets</div>
            </div>

            {/* If user has real active entries, show them */}
            {activeEntries.length > 0 ? (
              activeEntries.slice(0, 4).map(({ raffle, ticketCount }, idx) => {
                const drawDateStr = raffle.endDate
                  ? format(new Date(raffle.endDate), "dd MMM yyyy")
                  : "Awaiting Draw";

                const hostName =
                  raffle.host?.businessName ||
                  (raffle.host?.user
                    ? `${raffle.host.user.firstName || ""} ${raffle.host.user.lastName || ""}`.trim()
                    : "Airsoft Host");

                return (
                  <Link
                    key={raffle.id || idx}
                    href={raffle.slug ? `/live-raffles/${raffle.slug}` : "/dashboard/user/tickets"}
                    className={`grid grid-cols-12 gap-4 py-4 items-center group hover:bg-[#1A230A]/40 -mx-2 px-2 rounded-lg transition-colors ${
                      idx !== Math.min(activeEntries.length, 4) - 1 ? "border-b border-[#1A230A]" : ""
                    }`}
                  >
                    <div className="col-span-6 flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-[#1A230A] border border-[#2D3C13] flex items-center justify-center shrink-0 overflow-hidden relative">
                        {raffle.mainImage ? (
                          <Image
                            src={raffle.mainImage}
                            alt={raffle.title}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <svg className="w-5 h-5 text-[#8CB34A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-sans text-[14px] font-medium text-[#E8EDD4] group-hover:text-[#8CB34A] transition-colors truncate">
                          {raffle.title}
                        </span>
                        <span className="font-sans text-[12px] text-[#72943A] truncate">
                          Hosted by {hostName}
                        </span>
                      </div>
                    </div>
                    <div className="col-span-3 flex items-center">
                      <span className="font-sans text-[13px] text-[#E8EDD4]">
                        {drawDateStr}
                      </span>
                    </div>
                    <div className="col-span-3 flex items-center justify-end">
                      <div className="px-2.5 py-1 bg-[#1A230A] border border-[#2D3C13] rounded-md group-hover:border-[#8CB34A] transition-colors">
                        <span className="font-sans text-[13px] font-medium text-[#E8EDD4]">
                          {ticketCount}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              /* Empty state if user has no active entries */
              <div className="flex flex-col items-center justify-center text-center py-10 px-4">
                <div className="w-12 h-12 bg-[#1A230A] rounded-full border border-[#2D3C13] flex items-center justify-center mb-3 text-[#72943A]">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
                  </svg>
                </div>
                <h4 className="font-sans font-medium text-[14px] text-[#E8EDD4] mb-1">
                  No active entries right now
                </h4>
                <p className="font-sans text-[12px] text-[#72943A] max-w-[260px] mb-4">
                  You haven&apos;t joined any live competitions yet. Grab tickets to enter the next official draw!
                </p>
                <Link
                  href="/dashboard/user/competitions"
                  className="px-4 py-2 rounded-[8px] bg-[#8CB34A] hover:bg-[#A0D056] text-[#0D0D0B] font-heading font-medium text-[12px] transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Browse Competitions</span>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Wins */}
        <div className="flex-[2] bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-heading font-medium text-[16px] text-[#E8EDD4]">
              Recent Wins
            </h3>
            {/* Working View All link */}
            <Link
              href="/dashboard/user/winners"
              className="flex items-center gap-1 font-sans font-medium text-[13px] text-[#8CB34A] hover:text-[#A0D056] transition-colors"
            >
              View All
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          </div>

          <div className="flex flex-col h-full justify-center min-h-[220px]">
            {winners.length > 0 ? (
              <div className="flex flex-col gap-3 py-1">
                {winners.slice(0, 3).map((win: any) => {
                  const isInstant = win.winType === "INSTANT_WIN";
                  const wonDate = win.createdAt
                    ? format(new Date(win.createdAt), "dd MMM yyyy")
                    : "Recently";

                  return (
                    <Link
                      key={win.id}
                      href="/dashboard/user/winners"
                      className="p-3 rounded-xl bg-[#1A230A]/60 border border-[#2D3C13] hover:border-[#8CB34A] transition-all flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 ${
                            isInstant
                              ? "bg-[#3B2800] border-[#EAB308]/40 text-[#EAB308]"
                              : "bg-[#083b18] border-[#4ADE80]/40 text-[#4ADE80]"
                          }`}
                        >
                          {isInstant ? "⚡" : "🏆"}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-sans font-medium text-[13px] text-[#E8EDD4] group-hover:text-[#8CB34A] transition-colors truncate">
                            {win.prizeName}
                          </span>
                          <span className="font-sans text-[11px] text-[#72943A] truncate">
                            {win.raffle?.title || "Competition"} • {wonDate}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            isInstant
                              ? "bg-[#EAB308]/20 text-[#EAB308]"
                              : "bg-[#4ADE80]/20 text-[#4ADE80]"
                          }`}
                        >
                          {isInstant ? "Instant" : "Main Draw"}
                        </span>
                        <svg className="w-3.5 h-3.5 text-[#5A752A] group-hover:text-[#8CB34A] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              /* Empty State for Wins */
              <div className="flex flex-col items-center justify-center text-center py-6">
                <div className="w-16 h-16 bg-[#1A230A] rounded-full border border-[#2D3C13] flex items-center justify-center mb-3">
                  <svg className="w-8 h-8 text-[#72943A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
                  </svg>
                </div>
                <h4 className="font-sans font-medium text-[14px] text-[#E8EDD4] mb-1">No wins just yet</h4>
                <p className="font-sans text-[13px] text-[#72943A] max-w-[220px] mb-4">
                  Enter competitions for a chance to win premium airsoft gear and instant rewards.
                </p>
                <Link
                  href="/dashboard/user/competitions"
                  className="px-4 py-2 rounded-[8px] bg-[#1A230A] border border-[#2D3C13] hover:border-[#8CB34A] text-[#8CB34A] hover:text-[#E8EDD4] font-sans font-medium text-[12px] transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Enter Competitions</span>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
