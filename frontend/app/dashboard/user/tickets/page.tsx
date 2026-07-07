"use client";

import React from "react";
import TicketsTable, { Ticket } from "@/components/dashboard/TicketsTable";
import { useMyTicketsQuery } from "../../../../hooks/useTicketHooks";
import { format } from "date-fns";

export default function UserTicketsPage() {
  const { data: ticketsData, isLoading, isError } = useMyTicketsQuery();

  if (isLoading) {
    return <div className="p-8 text-center text-[#72943A]">Loading tickets...</div>;
  }
  if (isError) {
    return <div className="p-8 text-center text-red-500">Failed to load tickets.</div>;
  }

  const backendTickets = ticketsData || [];

  const formattedTickets: Ticket[] = backendTickets.map((t: any) => {
    let status: Ticket["status"] = "live";
    if (t.raffle.status === "ENDED") {
      // Check if user won
      const hasWon = t.winners && t.winners.length > 0;
      status = hasWon ? "drawn-won" : "drawn-lost";
    }
    return {
      id: t.id,
      ticketId: `#TKT-${t.ticketNumber}`,
      competitionName: t.raffle.title,
      purchaseDate: format(new Date(t.createdAt), "dd MMM yyyy"),
      pricePaid: "Paid", // Backend currently doesn't return exact price per ticket easily without transaction join
      status,
    };
  });

  const totalOwned = formattedTickets.length;
  const activeTickets = formattedTickets.filter((t) => t.status === "live").length;
  const wonTickets = formattedTickets.filter((t) => t.status === "drawn-won").length;

  return (
    <div className="flex flex-col gap-6 p-8 max-w-[1660px] mx-auto w-full animate-fadeIn">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
        {/* Total Tickets Owned */}
        <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col gap-3">
          <p className="font-sans text-[11px] font-medium uppercase tracking-[1.1px] text-[#5A752A]">
            Total Tickets Owned
          </p>
          <p className="font-heading font-bold text-[36px] leading-tight text-[#E8EDD4]">
            {totalOwned}
          </p>
          <span className="font-sans text-[11px] font-medium text-[#72943A]">
            All time
          </span>
        </div>

        {/* Active Tickets */}
        <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col gap-3">
          <p className="font-sans text-[11px] font-medium uppercase tracking-[1.1px] text-[#5A752A]">
            Active Tickets
          </p>
          <p className="font-heading font-bold text-[36px] leading-tight text-[#E8EDD4]">
            {activeTickets}
          </p>
          <span className="font-sans text-[11px] font-medium text-[#72943A]">
            Current
          </span>
        </div>

        {/* Tickets in Won Competitions */}
        <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col gap-3">
          <p className="font-sans text-[11px] font-medium uppercase tracking-[1.1px] text-[#5A752A]">
            Tickets in Won Competitions
          </p>
          <p className="font-heading font-bold text-[36px] leading-tight text-[#E8EDD4]">
            {wonTickets}
          </p>
          <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#1A230A] border border-[#2D3C13] w-fit">
            <span className="font-sans text-[10px] font-medium text-[#4ADE80]">
              {wonTickets} prizes won
            </span>
          </div>
        </div>
      </div>

      {/* Tickets Data Table Component */}
      <TicketsTable tickets={formattedTickets} />
    </div>
  );
}
