"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { useMyWinnersQuery } from "@/hooks/useUserHooks";
import { UserWinner } from "@/services/user.service";

export default function UserWinnersPage() {
  const { data: winners, isLoading, isError } = useMyWinnersQuery();
  const [filter, setFilter] = useState<"ALL" | "INSTANT_WIN" | "MAIN_DRAW">("ALL");
  const [search, setSearch] = useState("");

  const allWinners = winners || [];

  const instantWinsCount = allWinners.filter((w) => w.winType === "INSTANT_WIN").length;
  const mainDrawWinsCount = allWinners.filter((w) => w.winType === "MAIN_DRAW").length;
  const totalWins = allWinners.length;

  const filteredWinners = allWinners.filter((w) => {
    const matchesFilter =
      filter === "ALL" ? true : w.winType === filter;
    const matchesSearch =
      search.trim() === ""
        ? true
        : w.prizeName.toLowerCase().includes(search.toLowerCase()) ||
          w.raffle.title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6 p-8 max-w-[1660px] mx-auto w-full animate-fadeIn">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-[#E8EDD4]">
            My Winnings & Prizes
          </h1>
          <p className="font-sans text-sm text-[#72943A] mt-1">
            Track all your Instant Wins and Main Competition Draw victories.
          </p>
        </div>
        <Link
          href="/dashboard/user/competitions"
          className="px-5 py-2.5 rounded-[10px] bg-[#8CB34A] hover:bg-[#A0D056] text-[#0D0D0B] font-heading font-medium text-[13px] transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Enter More Competitions
        </Link>
      </div>

      {/* Stats KPI Summary Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
        {/* Total Wins */}
        <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col gap-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <p className="font-sans text-[11px] font-medium uppercase tracking-[1.1px] text-[#5A752A]">
              Total Won Prizes
            </p>
            <div className="w-9 h-9 rounded-full bg-[#1A230A] border border-[#2D3C13] flex items-center justify-center text-[#8CB34A]">
              🏆
            </div>
          </div>
          <p className="font-heading font-bold text-[36px] leading-tight text-[#E8EDD4]">
            {totalWins}
          </p>
          <span className="font-sans text-[11px] font-medium text-[#72943A]">
            Lifetime claims across all competitions
          </span>
        </div>

        {/* Instant Wins */}
        <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col gap-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <p className="font-sans text-[11px] font-medium uppercase tracking-[1.1px] text-[#5A752A]">
              Instant Wins
            </p>
            <div className="w-9 h-9 rounded-full bg-[#3B2800] border border-[#EAB308]/30 flex items-center justify-center text-[#EAB308]">
              ⚡
            </div>
          </div>
          <p className="font-heading font-bold text-[36px] leading-tight text-[#EAB308]">
            {instantWinsCount}
          </p>

          <span className="font-sans text-[11px] font-medium text-[#EAB308]/80">
            Instant prizes matched on ticket purchase
          </span>
        </div>

        {/* Main Draw Wins */}
        <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col gap-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <p className="font-sans text-[11px] font-medium uppercase tracking-[1.1px] text-[#5A752A]">
              Main Competition Wins
            </p>
            <div className="w-9 h-9 rounded-full bg-[#083b18] border border-[#4ADE80]/30 flex items-center justify-center text-[#4ADE80]">
              🎖️
            </div>
          </div>
          <p className="font-heading font-bold text-[36px] leading-tight text-[#4ADE80]">
            {mainDrawWinsCount}
          </p>
          <span className="font-sans text-[11px] font-medium text-[#4ADE80]/80">
            Grand prizes won in official draws
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-[#161810] border border-[#2D3C13] rounded-[14px] p-4">
        {/* Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-4 py-2 rounded-[8px] font-sans font-medium text-[13px] transition-colors whitespace-nowrap ${
              filter === "ALL"
                ? "bg-[#8CB34A] text-[#0D0D0B]"
                : "bg-[#1A230A] border border-[#2D3C13] text-[#72943A] hover:text-[#E8EDD4]"
            }`}
          >
            All Wins ({totalWins})
          </button>
          <button
            onClick={() => setFilter("INSTANT_WIN")}
            className={`px-4 py-2 rounded-[8px] font-sans font-medium text-[13px] transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              filter === "INSTANT_WIN"
                ? "bg-[#EAB308] text-[#0D0D0B]"
                : "bg-[#1A230A] border border-[#2D3C13] text-[#72943A] hover:text-[#EAB308]"
            }`}
          >
            <span>⚡</span> Instant Wins ({instantWinsCount})
          </button>
          <button
            onClick={() => setFilter("MAIN_DRAW")}
            className={`px-4 py-2 rounded-[8px] font-sans font-medium text-[13px] transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              filter === "MAIN_DRAW"
                ? "bg-[#4ADE80] text-[#0D0D0B]"
                : "bg-[#1A230A] border border-[#2D3C13] text-[#72943A] hover:text-[#4ADE80]"
            }`}
          >
            <span>🏆</span> Main Draw Wins ({mainDrawWinsCount})
          </button>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-[300px]">
          <input
            type="text"
            placeholder="Search prize or competition..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-[38px] bg-[#0D0D0B] border border-[#2D3C13] rounded-[8px] px-3 pr-8 text-[13px] text-[#E8EDD4] placeholder-[#5A752A] focus:outline-none focus:border-[#8CB34A]"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5A752A] hover:text-[#E8EDD4]"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-[#161810] border border-[#2D3C13] rounded-[16px]">
          <div className="w-10 h-10 border-2 border-[#8CB34A] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="font-sans text-sm text-[#72943A]">Loading your prize history...</p>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-16 bg-[#161810] border border-red-900/50 rounded-[16px]">
          <p className="font-sans text-sm text-red-400">Failed to load winning records. Please refresh the page.</p>
        </div>
      ) : filteredWinners.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-20 bg-[#161810] border border-[#2D3C13] rounded-[16px] p-8">
          <div className="w-20 h-20 bg-[#1A230A] rounded-full border border-[#2D3C13] flex items-center justify-center mb-5">
            <svg className="w-10 h-10 text-[#5A752A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0"
              />
            </svg>
          </div>
          <h3 className="font-heading font-medium text-lg text-[#E8EDD4] mb-2">
            {allWinners.length === 0 ? "No Prizes Won Yet" : "No Matching Prizes Found"}
          </h3>
          <p className="font-sans text-sm text-[#72943A] max-w-[420px] mb-6">
            {allWinners.length === 0
              ? "You haven't won any instant prizes or main draws yet. Buy tickets to test your luck and unlock instant wins!"
              : "No prizes match your current filter or search criteria."}
          </p>
          <Link
            href="/dashboard/user/competitions"
            className="px-6 py-3 rounded-[10px] bg-[#8CB34A] hover:bg-[#A0D056] text-[#0D0D0B] font-heading font-medium text-sm transition-colors"
          >
            Explore Live Competitions
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {filteredWinners.map((win: UserWinner) => {
            const isInstant = win.winType === "INSTANT_WIN";

            const displayImage =
              win.prizeImage ||
              win.raffle?.mainImage ||
              "/coming-soon-hero.jpg";

            const wonDateFormatted = win.createdAt
              ? format(new Date(win.createdAt), "dd MMM yyyy")
              : "N/A";

            return (
              <div
                key={win.id}
                className={`bg-[#161810] border rounded-[16px] overflow-hidden flex flex-col transition-all hover:-translate-y-1 hover:shadow-xl ${
                  isInstant
                    ? "border-[#EAB308]/40 hover:border-[#EAB308]"
                    : "border-[#4ADE80]/40 hover:border-[#4ADE80]"
                }`}
              >
                {/* Card Top Banner Image Header */}
                <div className="relative w-full aspect-[16/10] bg-[#0D0D0B] overflow-hidden">
                  <Image
                    src={displayImage}
                    alt={win.prizeName}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#161810] via-transparent to-black/60" />

                  {/* Badge Top Left */}
                  <div className="absolute top-3 left-3">
                    {isInstant ? (
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAB308]/90 text-[#0D0D0B] backdrop-blur-md shadow-lg">
                        <span className="text-xs">⚡</span>
                        <span className="font-sans font-bold text-[11px] uppercase tracking-wider">
                          Instant Win Prize
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4ADE80]/90 text-[#0D0D0B] backdrop-blur-md shadow-lg">
                        <span className="text-xs">🏆</span>
                        <span className="font-sans font-bold text-[11px] uppercase tracking-wider">
                          Main Draw Winner
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Ticket Number Top Right */}
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#0D0D0B]/80 backdrop-blur-md border border-[#2D3C13]">
                    <span className="font-mono text-[12px] font-bold text-[#E8EDD4]">
                      Ticket #{win.ticketNumber.toString().padStart(4, "0")}
                    </span>
                  </div>

                  {/* Prize Title overlay on image bottom */}
                  <div className="absolute bottom-3 left-4 right-4 flex flex-col">
                    <span className="font-sans text-[11px] uppercase tracking-widest font-semibold text-[#8CB34A]">
                      {isInstant ? "Instant Reward" : "Grand Prize Winner"}
                    </span>
                    <h3 className="font-heading font-bold text-lg text-[#E8EDD4] line-clamp-1">
                      {win.prizeName}
                    </h3>
                  </div>
                </div>

                {/* Card Body Details */}
                <div className="p-5 flex flex-col gap-4 flex-1 justify-between">
                  <div className="flex flex-col gap-3">
                    {/* Competition Name */}
                    <div className="flex flex-col gap-0.5">
                      <span className="font-sans text-[11px] text-[#5A752A] uppercase tracking-wider font-medium">
                        Competition
                      </span>
                      <Link
                        href={`/live-raffles/${win.raffle.slug}`}
                        className="font-heading font-medium text-[15px] text-[#E8EDD4] hover:text-[#8CB34A] transition-colors line-clamp-1"
                      >
                        {win.raffle.title}
                      </Link>
                    </div>

                    {/* Host & Date info */}
                    <div className="grid grid-cols-2 gap-3 py-3 border-y border-[#1A230A]">
                      <div className="flex flex-col">
                        <span className="font-sans text-[10px] text-[#5A752A] uppercase">
                          Hosted By
                        </span>
                        <span className="font-sans text-[12px] font-medium text-[#72943A] truncate">
                          {win.raffle.hostBusinessName}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-sans text-[10px] text-[#5A752A] uppercase">
                          Won On
                        </span>
                        <span className="font-sans text-[12px] font-medium text-[#E8EDD4]">
                          {wonDateFormatted}
                        </span>
                      </div>
                    </div>

                    {/* RRP / Value if available */}
                    {win.rrpValue !== null && (
                      <div className="flex justify-between items-center px-3 py-2 rounded-[8px] bg-[#1A230A]/60 border border-[#2D3C13]">
                        <span className="font-sans text-[12px] text-[#72943A]">Prize Value (RRP):</span>
                        <span className="font-heading font-bold text-[14px] text-[#8CB34A]">
                          £{Number(win.rrpValue).toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Delivery / Claim Status Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#1A230A] mt-2">
                    <span className="font-sans text-[12px] text-[#5A752A]">Fulfillment:</span>
                    <div
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-sans font-medium uppercase tracking-wide border ${
                        win.deliveryStatus === "DELIVERED"
                          ? "bg-[#083b18] text-[#4ADE80] border-[#4ADE80]/30"
                          : win.deliveryStatus === "SHIPPED"
                          ? "bg-blue-950/60 text-blue-400 border-blue-500/30"
                          : "bg-[#1A230A] text-[#EAB308] border-[#EAB308]/30"
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                      {win.deliveryStatus === "DELIVERED"
                        ? "Delivered"
                        : win.deliveryStatus === "SHIPPED"
                        ? "Dispatched"
                        : "Claim Processing"}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
