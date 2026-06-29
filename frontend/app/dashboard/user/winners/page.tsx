import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface Entry {
  id: string;
  competitionName: string;
  enteredOn: string;
  ticketsEntered: number;
  ticketNumbers: string[];
  status: "live" | "won" | "lost";
  liveText?: string;
}

const DUMMY_ENTRIES: Entry[] = [
  {
    id: "1",
    competitionName: "VFC HK416 Carbine Bundle",
    enteredOn: "12 June 2025",
    ticketsEntered: 5,
    ticketNumbers: ["#0231", "#0232", "#0233", "#0234", "#0235"],
    status: "live",
    liveText: "Draws in 2 days",
  },
  {
    id: "2",
    competitionName: "Tokyo Marui MWS GBBR",
    enteredOn: "10 June 2025",
    ticketsEntered: 3,
    ticketNumbers: ["#0118", "#0119", "#0120"],
    status: "won",
  },
  {
    id: "3",
    competitionName: "Sniper Precision Set",
    enteredOn: "05 June 2025",
    ticketsEntered: 8,
    ticketNumbers: ["#0401", "#0402", "#0403", "#0404", "#0405", "#0406", "#0407", "#0408"],
    status: "lost",
  },
  {
    id: "4",
    competitionName: "Full Tactical Loadout Kit",
    enteredOn: "01 June 2025",
    ticketsEntered: 2,
    ticketNumbers: ["#0210", "#0211"],
    status: "live",
    liveText: "Draws in 15 days",
  },
  {
    id: "5",
    competitionName: "G36 Competition Bundle",
    enteredOn: "30 May 2025",
    ticketsEntered: 10,
    ticketNumbers: ["#0050", "...", "#0059"], // Simplified for mock display
    status: "won",
  },
];

export default async function UserWinnersPage() {
  const cookieStore = await cookies();
  const role = cookieStore.get("demo_role")?.value;

  if (role !== "user") {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col gap-4 p-8 max-w-[1660px] mx-auto w-full animate-fadeIn">
      <div className="flex flex-col gap-4 w-full">
        {DUMMY_ENTRIES.map((entry) => (
          <div 
            key={entry.id} 
            className="w-full bg-[#161810] border border-[#2D3C13] rounded-[12px] p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors hover:bg-[#1A230A]/50"
          >
            {/* Left Column: Avatar & Competition Info */}
            <div className="flex items-center gap-4 min-w-[280px]">
              <div className="w-12 h-12 rounded-full bg-[#1A230A] border border-[#2D3C13] flex items-center justify-center shrink-0 overflow-hidden relative">
                {/* Abstract placeholder using concentric circles */}
                <svg className="w-6 h-6 text-[#5A752A] absolute" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4">
                  <circle cx="50" cy="50" r="30" />
                  <circle cx="50" cy="50" r="15" />
                </svg>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-heading font-medium text-[15px] text-[#E8EDD4] line-clamp-1">
                  {entry.competitionName}
                </h3>
                <span className="font-sans text-[12px] text-[#5A752A]">
                  Entered on {entry.enteredOn}
                </span>
              </div>
            </div>

            {/* Middle Column: Tickets Info */}
            <div className="flex-1 flex flex-col md:items-end justify-center gap-2 pr-0 md:pr-12">
              <div className="px-3 py-1 rounded-full border border-[#2D3C13] bg-[#1A230A]/50 w-fit">
                <span className="font-sans font-medium text-[11px] text-[#8CB34A]">
                  {entry.ticketsEntered} {entry.ticketsEntered === 1 ? 'ticket' : 'tickets'} entered
                </span>
              </div>
              <span className="font-sans text-[11px] text-[#5A752A] truncate max-w-[300px]">
                {entry.ticketNumbers.join(", ")}
              </span>
            </div>

            {/* Right Column: Status */}
            <div className="flex items-center md:justify-end shrink-0 md:w-[160px]">
              {entry.status === "live" && (
                <span className="font-sans font-medium text-[13px] text-[#72943A]">
                  {entry.liveText}
                </span>
              )}
              
              {entry.status === "won" && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-[8px] bg-[#083b18] border border-[#4ADE80]/20 text-[#4ADE80]">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
                  </svg>
                  <span className="font-sans font-medium text-[13px]">You Won!</span>
                </div>
              )}
              
              {entry.status === "lost" && (
                <div className="px-4 py-2 rounded-[8px] border border-[#2D3C13] bg-transparent">
                  <span className="font-sans font-medium text-[13px] text-[#72943A]">
                    Not this time
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
