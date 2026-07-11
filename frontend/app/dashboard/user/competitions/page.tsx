"use client";

import React, { useState } from "react";
import Image from "next/image";
import { usePublicRaffles } from "@/hooks/useRaffleHooks";
import { Pagination } from "@/components/ui/Pagination";
import Link from "next/link";

export default function UserRafflesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Competitions");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("Latest");

  const { data, isLoading, isError } = usePublicRaffles({
    page,
    limit: 12,
    search,
    statusFilter: statusFilter === "All Competitions" ? undefined : statusFilter,
    category,
    sort,
  });

  const raffles = data?.data || [];
  const meta = data?.meta;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-6 p-8 max-w-[1660px] mx-auto w-full animate-fadeIn">
      {/* Search & Filters Section */}
      <div className="flex flex-col gap-4 w-full">
        <form onSubmit={handleSearch} className="w-full max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Search competitions..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full h-[42px] bg-[#1A230A] border border-[#2D3C13] rounded-[8px] px-4 text-[#E8EDD4] placeholder-[#72943A] focus:outline-none focus:border-[#8CB34A]"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#72943A] hover:text-[#8CB34A]">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </button>
          </div>
        </form>

        <div className="flex flex-wrap items-center gap-2">
          {["All Competitions", "Live", "Upcoming", "Past"].map((status) => (
            <button
              key={status}
              onClick={() => { setStatusFilter(status); setPage(1); }}
              className={`px-5 py-2 rounded-[20px] font-sans font-medium text-[13px] transition-colors ${
                statusFilter === status
                  ? "bg-[#8CB34A] text-[#0D0D0B]"
                  : "bg-[#1A230A] border border-[#2D3C13] text-[#72943A] hover:text-[#E8EDD4]"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full">
          <div className="flex flex-wrap items-center gap-2">
            {["All", "Rifles", "Pistols", "Snipers", "Gas Blowback", "Gear", "Accessories"].map((cat) => (
              <button
                key={cat}
                onClick={() => { setCategory(cat); setPage(1); }}
                className={`px-4 py-1.5 rounded-[20px] font-sans font-medium text-[12px] transition-colors border ${
                  category === cat
                    ? "bg-[#0D0D0B] border-[#8CB34A] text-[#8CB34A]"
                    : "bg-[#0D0D0B] border-[#2D3C13] text-[#5A752A] hover:border-[#43581E] hover:text-[#72943A]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-1.5 rounded-[8px] bg-[#0D0D0B] border border-[#2D3C13] text-[#72943A] font-sans font-medium text-[12px] hover:text-[#E8EDD4] transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" />
              </svg>
              Sort by: {sort}
              <svg className="w-3.5 h-3.5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            <div className="absolute right-0 top-full mt-1 hidden group-hover:flex flex-col bg-[#1A230A] border border-[#2D3C13] rounded-[8px] overflow-hidden z-10 w-[160px]">
              {["Latest", "Ending Soon", "Price: Low to High", "Price: High to Low"].map((s) => (
                <button
                  key={s}
                  onClick={() => { setSort(s); setPage(1); }}
                  className="px-4 py-2 text-left text-[12px] font-sans font-medium text-[#72943A] hover:bg-[#2D3C13] hover:text-[#E8EDD4] transition-colors w-full"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <p className="text-[#72943A]">Loading competitions...</p>
        </div>
      ) : isError ? (
        <div className="flex justify-center py-20">
          <p className="text-red-500">Failed to load competitions. Please try again.</p>
        </div>
      ) : raffles.length === 0 ? (
        <div className="flex justify-center py-20">
          <p className="text-[#72943A]">No competitions found matching your filters.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 w-full mt-2">
            {raffles.map((raffle: any) => {
              const progressPercentage = Math.min((raffle.ticketsSold / raffle.totalTickets) * 100, 100);
              
              const now = new Date();
              const startDate = new Date(raffle.startDate);
              const endDate = new Date(raffle.endDate);
              const isLive = startDate <= now && endDate >= now;
              
              const timeDiff = endDate.getTime() - now.getTime();
              const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
              const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
              const drawsIn = timeDiff > 0 ? `${days}d ${hours}h` : 'Ended';

              return (
                <div
                  key={raffle.id}
                  className="bg-[#161810] border border-[#2D3C13] rounded-[16px] overflow-hidden flex flex-col transition-transform hover:-translate-y-1 hover:shadow-lg hover:shadow-black/20"
                >
                  <div className="relative w-full aspect-square bg-[#0D0D0B] flex items-center justify-center p-0 overflow-hidden">
                    <Image
                      src={raffle.mainImage || "/coming-soon-hero.jpg"}
                      alt={raffle.title}
                      fill
                      className="object-cover opacity-60 transition-opacity hover:opacity-80"
                      unoptimized
                    />

                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                      <div className="px-3 py-1 rounded-[14px] bg-[#161810]/80 backdrop-blur-sm border border-[#2D3C13] shadow-sm">
                        <span className="font-sans text-[10px] font-medium text-[#72943A] uppercase tracking-wider">
                          {raffle.category || 'General'}
                        </span>
                      </div>
                      <div className="px-3 py-1 rounded-[14px] bg-[#161810] border border-[#2D3C13] shadow-sm">
                        <span className="font-sans text-[11px] font-medium text-[#A0D056]">
                          £{Number(raffle.pricePerTicket).toFixed(2)}/ticket
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col gap-4 flex-1">
                    <h3 className="font-heading font-medium text-[15px] text-[#E8EDD4] line-clamp-2 min-h-[44px]">
                      {raffle.title}
                    </h3>

                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center w-full">
                        <span className="font-sans text-[11px] text-[#72943A]">{raffle.ticketsSold} sold</span>
                        <span className="font-sans text-[11px] text-[#72943A]">{raffle.totalTickets} max</span>
                      </div>
                      <div className="w-full h-[4px] bg-[#1A230A] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#8CB34A] rounded-full"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center w-full mt-1">
                      <div className="flex items-center gap-1.5 text-[#5A752A]">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        <span className="font-sans text-[11px] font-medium">Draws in {drawsIn}</span>
                      </div>
                      
                      {isLive && (
                        <div className="px-2 py-0.5 rounded-[4px] border border-[#2D3C13]">
                          <span className="font-sans font-medium text-[10px] text-[#72943A] uppercase tracking-wide">Live</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-2 w-full">
                      {isLive ? (
                        <Link href={`/live-raffles/${raffle.slug}`} className="w-full">
                          <button className="w-full h-[38px] rounded-[8px] bg-[#8CB34A] hover:bg-[#A0D056] text-[#0D0D0B] font-heading font-medium text-[13px] transition-colors flex items-center justify-center">
                            Buy Tickets
                          </button>
                        </Link>
                      ) : (
                        <button disabled className="w-full h-[38px] rounded-[8px] bg-transparent border border-[#2D3C13] text-[#72943A] font-heading font-medium text-[13px] opacity-70 cursor-not-allowed flex items-center justify-center gap-2">
                          Not Live
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {meta && meta.lastPage > 1 && (
            <Pagination
              currentPage={page}
              totalPages={meta.lastPage}
              onPageChange={(newPage) => setPage(newPage)}
            />
          )}
        </>
      )}
    </div>
  );
}
