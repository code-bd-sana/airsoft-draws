import React from "react";
import Image from "next/image";
import TicketsTable, { Ticket } from "@/components/dashboard/TicketsTable";


const DUMMY_TICKETS: Ticket[] = [
  {
    id: "1",
    ticketId: "#TKT-0231",
    competitionName: "VFC HK416 Carbine Bundle",
    purchaseDate: "15 Jun 2025",
    pricePaid: "£12.50",
    status: "live",
  },
  {
    id: "2",
    ticketId: "#TKT-0232",
    competitionName: "Tokyo Marui MWS GBBR",
    purchaseDate: "10 Jun 2025",
    pricePaid: "£9.00",
    status: "drawn-won",
  },
  {
    id: "3",
    ticketId: "#TKT-0233",
    competitionName: "Sniper Precision Set",
    purchaseDate: "05 Jun 2025",
    pricePaid: "£15.00",
    status: "drawn-lost",
  },
  {
    id: "4",
    ticketId: "#TKT-0234",
    competitionName: "Full Tactical Loadout",
    purchaseDate: "01 Jun 2025",
    pricePaid: "£3.00",
    status: "live",
  },
  {
    id: "5",
    ticketId: "#TKT-0235",
    competitionName: "Plate Carrier Bundle",
    purchaseDate: "28 May 2025",
    pricePaid: "£25.00",
    status: "drawn-lost",
  },
  {
    id: "6",
    ticketId: "#TKT-0236",
    competitionName: "G36 Competition Bundle",
    purchaseDate: "20 May 2025",
    pricePaid: "£7.50",
    status: "drawn-won",
  },
];

export default function UserTicketsPage() {
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
            142
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
            35
          </p>
          <span className="font-sans text-[11px] font-medium text-[#72943A]">
            in 8 competitions
          </span>
        </div>

        {/* Tickets in Won Competitions */}
        <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col gap-3">
          <p className="font-sans text-[11px] font-medium uppercase tracking-[1.1px] text-[#5A752A]">
            Tickets in Won Competitions
          </p>
          <p className="font-heading font-bold text-[36px] leading-tight text-[#E8EDD4]">
            12
          </p>
          <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#1A230A] border border-[#2D3C13] w-fit">
            <span className="font-sans text-[10px] font-medium text-[#4ADE80]">
              3 prizes won
            </span>
          </div>
        </div>
      </div>

      {/* Tickets Data Table Component */}
      <TicketsTable tickets={DUMMY_TICKETS} />
    </div>
  );
}
