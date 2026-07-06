import React from "react";
import Image from "next/image";

interface Raffle {
  id: string;
  category: string;
  price: string;
  title: string;
  sold: number;
  max: number;
  drawsIn: string;
  isLive: boolean;
  status: "active" | "inactive";
  purchased?: boolean;
}

const DUMMY_RAFFLES: Raffle[] = [
  {
    id: "1",
    category: "Rifles",
    price: "£9.50",
    title: "VFC HK416 Carbine Bundle",
    sold: 68,
    max: 200,
    drawsIn: "3d 4h",
    isLive: true,
    status: "active",
    purchased: false,
  },
  {
    id: "2",
    category: "Gas Blowback",
    price: "£3.00",
    title: "Tokyo Marui MWS GBBR",
    sold: 120,
    max: 300,
    drawsIn: "3d 4h",
    isLive: true,
    status: "inactive",
    purchased: true,
  },
  {
    id: "3",
    category: "Snipers",
    price: "£2.00",
    title: "Sniper Rifle Precision Set",
    sold: 45,
    max: 150,
    drawsIn: "3d 4h",
    isLive: true,
    status: "inactive",
    purchased: true,
  },
  {
    id: "4",
    category: "Gear",
    price: "£1.50",
    title: "Full Tactical Loadout Kit",
    sold: 190,
    max: 250,
    drawsIn: "3d 4h",
    isLive: true,
    status: "inactive",
    purchased: true,
  },
  // Row 2 duplicates for UI mocking
  {
    id: "5",
    category: "Rifles",
    price: "£7.50",
    title: "VFC HK416 Carbine Bundle",
    sold: 68,
    max: 200,
    drawsIn: "3d 4h",
    isLive: true,
    status: "inactive",
    purchased: true,
  },
  {
    id: "6",
    category: "Gas Blowback",
    price: "£3.00",
    title: "Tokyo Marui MWS GBBR",
    sold: 120,
    max: 300,
    drawsIn: "3d 4h",
    isLive: true,
    status: "inactive",
    purchased: true,
  },
  {
    id: "7",
    category: "Snipers",
    price: "£2.00",
    title: "Sniper Rifle Precision Set",
    sold: 45,
    max: 150,
    drawsIn: "3d 4h",
    isLive: true,
    status: "inactive",
    purchased: true,
  },
  {
    id: "8",
    category: "Gear",
    price: "£1.50",
    title: "Full Tactical Loadout Kit",
    sold: 190,
    max: 250,
    drawsIn: "3d 4h",
    isLive: true,
    status: "inactive",
    purchased: true,
  },
];

export default function UserRafflesPage() {
  return (
    <div className="flex flex-col gap-6 p-8 max-w-[1660px] mx-auto w-full animate-fadeIn">
      {/* Filters Section */}
      <div className="flex flex-col gap-4 w-full">
        {/* Row 1: Status Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <button className="px-5 py-2 rounded-[20px] bg-[#8CB34A] text-[#0D0D0B] font-sans font-medium text-[13px] transition-colors">
            All Competitions
          </button>
          <button className="px-5 py-2 rounded-[20px] bg-[#1A230A] border border-[#2D3C13] text-[#72943A] hover:text-[#E8EDD4] font-sans font-medium text-[13px] transition-colors">
            Live
          </button>
          <button className="px-5 py-2 rounded-[20px] bg-[#1A230A] border border-[#2D3C13] text-[#72943A] hover:text-[#E8EDD4] font-sans font-medium text-[13px] transition-colors">
            Upcoming
          </button>
          <button className="px-5 py-2 rounded-[20px] bg-[#1A230A] border border-[#2D3C13] text-[#72943A] hover:text-[#E8EDD4] font-sans font-medium text-[13px] transition-colors">
            Past
          </button>
        </div>

        {/* Row 2: Category Filters & Sort */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full">
          <div className="flex flex-wrap items-center gap-2">
            <button className="px-4 py-1.5 rounded-[20px] bg-[#0D0D0B] border border-[#8CB34A] text-[#8CB34A] font-sans font-medium text-[12px] transition-colors">
              All
            </button>
            {["Rifles", "Pistols", "Snipers", "Gas Blowback", "Gear", "Accessories"].map((cat) => (
              <button
                key={cat}
                className="px-4 py-1.5 rounded-[20px] bg-[#0D0D0B] border border-[#2D3C13] text-[#5A752A] hover:border-[#43581E] hover:text-[#72943A] font-sans font-medium text-[12px] transition-colors"
              >
                {cat}
              </button>
            ))}
          </div>

          <button className="flex items-center gap-2 px-4 py-1.5 rounded-[8px] bg-[#0D0D0B] border border-[#2D3C13] text-[#72943A] font-sans font-medium text-[12px] hover:text-[#E8EDD4] transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" />
            </svg>
            Sort by: Latest
            <svg className="w-3.5 h-3.5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 w-full mt-2">
        {DUMMY_RAFFLES.map((raffle) => {
          const progressPercentage = Math.min((raffle.sold / raffle.max) * 100, 100);
          
          return (
            <div
              key={raffle.id}
              className="bg-[#161810] border border-[#2D3C13] rounded-[16px] overflow-hidden flex flex-col transition-transform hover:-translate-y-1 hover:shadow-lg hover:shadow-black/20"
            >
              {/* Image Header Area */}
              <div className="relative w-full aspect-square bg-[#0D0D0B] flex items-center justify-center p-0 overflow-hidden">
                {/* Background Pattern/Icon */}
                <Image
                  src="/coming-soon-hero.jpg"
                  alt={raffle.title}
                  fill
                  className="object-cover opacity-60 transition-opacity hover:opacity-80"
                />

                {/* Badges Overlay */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                  <div className="px-3 py-1 rounded-[14px] bg-[#161810]/80 backdrop-blur-sm border border-[#2D3C13] shadow-sm">
                    <span className="font-sans text-[10px] font-medium text-[#72943A] uppercase tracking-wider">
                      {raffle.category}
                    </span>
                  </div>
                  <div className="px-3 py-1 rounded-[14px] bg-[#161810] border border-[#2D3C13] shadow-sm">
                    <span className="font-sans text-[11px] font-medium text-[#A0D056]">
                      {raffle.price}/ticket
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex flex-col gap-4 flex-1">
                <h3 className="font-heading font-medium text-[15px] text-[#E8EDD4] line-clamp-2 min-h-[44px]">
                  {raffle.title}
                </h3>

                {/* Progress Bar */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center w-full">
                    <span className="font-sans text-[11px] text-[#72943A]">{raffle.sold} sold</span>
                    <span className="font-sans text-[11px] text-[#72943A]">{raffle.max} max</span>
                  </div>
                  <div className="w-full h-[4px] bg-[#1A230A] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#8CB34A] rounded-full"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Footer Info Row */}
                <div className="flex justify-between items-center w-full mt-1">
                  <div className="flex items-center gap-1.5 text-[#5A752A]">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    <span className="font-sans text-[11px] font-medium">Draws in {raffle.drawsIn}</span>
                  </div>
                  
                  {raffle.isLive && (
                    <div className="px-2 py-0.5 rounded-[4px] border border-[#2D3C13]">
                      <span className="font-sans font-medium text-[10px] text-[#72943A] uppercase tracking-wide">Live</span>
                    </div>
                  )}
                </div>

                {/* Call To Action Button */}
                <div className="mt-2 w-full">
                  {raffle.status === "active" ? (
                    <button className="w-full h-[38px] rounded-[8px] bg-[#8CB34A] hover:bg-[#A0D056] text-[#0D0D0B] font-heading font-medium text-[13px] transition-colors">
                      Buy Tickets
                    </button>
                  ) : (
                    <button className="w-full h-[38px] rounded-[8px] bg-transparent border border-[#2D3C13] hover:bg-[#1A230A] text-[#E8EDD4] font-heading font-medium text-[13px] transition-colors flex items-center justify-center gap-2">
                      Enter Draw
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
