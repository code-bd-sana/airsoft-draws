import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";

interface Ticket {
  id: string;
  ticketId: string;
  competitionName: string;
  purchaseDate: string;
  pricePaid: string;
  status: "live" | "drawn-won" | "drawn-lost";
}

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

export default async function UserTicketsPage() {
  const cookieStore = await cookies();
  const role = cookieStore.get("demo_role")?.value;

  if (role !== "user") {
    redirect("/dashboard");
  }

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

      {/* Tickets Data Table Card */}
      <div className="w-full bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-heading font-medium text-[18px] text-[#E8EDD4]">
            All Tickets
          </h3>
          <button className="flex items-center gap-2 px-4 py-1.5 rounded-[8px] bg-transparent border border-[#2D3C13] hover:bg-[#1A230A] text-[#72943A] hover:text-[#E8EDD4] font-sans font-medium text-[12px] transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export
          </button>
        </div>

        {/* Table/Grid */}
        <div className="w-full overflow-x-auto">
          <div className="min-w-[900px] flex flex-col">
            {/* Table Header Row */}
            <div className="grid grid-cols-12 gap-4 pb-4 border-b border-[#2D3C13] font-sans text-[11px] font-medium text-[#5A752A] uppercase tracking-wider">
              <div className="col-span-2 pl-4">Ticket ID</div>
              <div className="col-span-4">Competition Name</div>
              <div className="col-span-2">Purchase Date</div>
              <div className="col-span-1">Price Paid</div>
              <div className="col-span-2 text-center">Status</div>
              <div className="col-span-1 text-right pr-4">Action</div>
            </div>

            {/* Table Body Rows */}
            <div className="flex flex-col">
              {DUMMY_TICKETS.map((ticket, index) => (
                <div 
                  key={ticket.id} 
                  className={`grid grid-cols-12 gap-4 py-5 items-center font-sans transition-colors hover:bg-[#1A230A]/50 ${index !== DUMMY_TICKETS.length - 1 ? 'border-b border-[#1A230A]' : ''}`}
                >
                  {/* Ticket ID */}
                  <div className="col-span-2 pl-4 font-medium text-[13px] text-[#72943A]">
                    {ticket.ticketId}
                  </div>

                  {/* Competition Name */}
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#1A230A] border border-[#2D3C13] flex items-center justify-center shrink-0 overflow-hidden relative">
                       {/* Abstract placeholder using concentric circles */}
                      <svg className="w-5 h-5 text-[#5A752A] absolute" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4">
                        <circle cx="50" cy="50" r="30" />
                        <circle cx="50" cy="50" r="15" />
                      </svg>
                    </div>
                    <span className="font-medium text-[13px] text-[#E8EDD4] truncate pr-4">
                      {ticket.competitionName}
                    </span>
                  </div>

                  {/* Purchase Date */}
                  <div className="col-span-2 font-normal text-[13px] text-[#72943A]">
                    {ticket.purchaseDate}
                  </div>

                  {/* Price Paid */}
                  <div className="col-span-1 font-medium text-[13px] text-[#E8EDD4]">
                    {ticket.pricePaid}
                  </div>

                  {/* Status */}
                  <div className="col-span-2 flex justify-center">
                    {ticket.status === "live" && (
                      <div className="px-3 py-1 rounded-full border border-[#72943A] bg-transparent">
                        <span className="text-[10px] font-medium text-[#8CB34A] uppercase tracking-wide">Live</span>
                      </div>
                    )}
                    {ticket.status === "drawn-won" && (
                      <div className="px-3 py-1 rounded-full border border-[#4ADE80] bg-[#4ADE80]/10">
                        <span className="text-[10px] font-medium text-[#4ADE80] uppercase tracking-wide">Drawn — Won</span>
                      </div>
                    )}
                    {ticket.status === "drawn-lost" && (
                      <div className="px-3 py-1 rounded-full border border-[#2D3C13] bg-[#1A230A]/50">
                        <span className="text-[10px] font-medium text-[#5A752A] uppercase tracking-wide">Drawn — Lost</span>
                      </div>
                    )}
                  </div>

                  {/* Action */}
                  <div className="col-span-1 text-right pr-4">
                    <button className="font-sans font-medium text-[12px] text-[#8CB34A] hover:text-[#A0D056] transition-colors whitespace-nowrap group flex items-center justify-end gap-1 w-full">
                      View <span className="hidden sm:inline">Competition</span>
                      <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
