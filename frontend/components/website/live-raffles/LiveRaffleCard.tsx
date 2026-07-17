"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Draw } from "../../../types/draw.types";
import { formatCurrency } from "../../../lib/utils";
import { cn } from "../../../lib/utils";

interface LiveRaffleCardProps {
  raffle: Draw;
  viewMode?: "grid" | "list";
}

/**
 * Dedicated Card component for the Live Raffles page.
 * Replicates the Figma design layout, borders, font weights, and spacing.
 */
export default function LiveRaffleCard({ raffle, viewMode = "grid" }: LiveRaffleCardProps) {
  const {
    id,
    title,
    mainImage,
    pricePerTicket,
    totalTickets,
    ticketsSold,
    endDate,
    prizeName,
    slug,
  } = raffle as any;

  const image = mainImage || "https://placehold.co/800x600/1a230a/8cb34a?text=No+Image";
  const ticketPrice = Number(pricePerTicket);
  const soldTickets = ticketsSold || 0;
  const category = "rifles"; // Add category to schema later if needed
  const worthPrice = ticketPrice * totalTickets;
  const badgeText = soldTickets / totalTickets > 0.9 ? "ALMOST GONE" : "HOT";
  
  const soldPercent = totalTickets > 0 ? Math.min(Math.round((soldTickets / totalTickets) * 100), 100) : 0;
  
  const formattedEndDate = new Date(endDate).toLocaleDateString();
  const hostName = raffle.host?.businessName || raffle.host?.user?.firstName || "Unknown Host";

  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTime = () => {
      const diff = new Date(endDate).getTime() - new Date().getTime();
      if (diff <= 0) return "Ended";
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / 1000 / 60) % 60);
      const s = Math.floor((diff / 1000) % 60);
      
      if (d > 0) return `${d}d ${h}h ${m}m`;
      return `${h}h ${m}m ${s}s`;
    };
    
    setTimeLeft(calculateTime());
    const interval = setInterval(() => setTimeLeft(calculateTime()), 1000);
    return () => clearInterval(interval);
  }, [endDate]);

  // SVG Icons matching Figma design
  const fireIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 24 24"
      className="w-3.5 h-3.5 text-[#ef9f27]"
    >
      <path d="M19.43 12.98c.04-.32.07-.64.07-.98 0-3.66-2.61-6.72-6.07-7.39.37.76.57 1.62.57 2.53 0 1.95-1.07 3.65-2.67 4.54l-.06.03c.53-2.14-.17-4.47-1.78-6.1l-.32-.33c-.09.33-.14.67-.14 1.02 0 2.27 1.34 4.22 3.28 5.11l.08.04c-1.61-.31-3.23.36-4.13 1.73A7.514 7.514 0 0 0 7 17.5c0 4.14 3.36 7.5 7.5 7.5s7.5-3.36 7.5-7.5c0-1.65-.54-3.18-1.57-4.52z" />
    </svg>
  );

  const ticketIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="w-3.5 h-3.5 text-[#72943a]"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-12h12c.621 0 1.125.504 1.125 1.125v1.757a1.5 1.5 0 0 0 0 2.236v1.757a1.5 1.5 0 0 0 0 2.236v1.757a1.5 1.5 0 0 0-1.125 1.125H7.5a1.125 1.125 0 0 1-1.125-1.125v-1.757a1.5 1.5 0 0 0 0-2.236V11.23a1.5 1.5 0 0 0 0-2.236V7.125A1.125 1.125 0 0 1 7.5 6Z"
      />
    </svg>
  );

  const clockIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="w-3.5 h-3.5 text-text-muted"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  );

  // Status badge styling helper
  const getBadgeStyle = (text: string) => {
    switch (text.toUpperCase()) {
      case "ALMOST GONE":
        return "bg-[#4a2e00] border-[#ef9f27]/30 text-[#ef9f27]";
      case "HOT":
        return "bg-red-950 border-red-800 text-red-400";
      case "NEW":
        return "bg-[#1a230a] border-[#8cb34a]/30 text-[#8cb34a]";
      case "EXCLUSIVE":
        return "bg-purple-950 border-purple-800 text-purple-400";
      default:
        return "bg-[#161810] border-border text-text-muted";
    }
  };

  // Human readable category mapping
  const categoryLabels: Record<string, string> = {
    rifles: "Rifles",
    pistols: "Pistols",
    snipers: "Snipers",
    accessories: "Accessories",
    apparel: "Apparel",
    cash: "Cash Prizes",
    bundles: "Bundles",
    luxury: "Luxury",
  };

  const categoryLabel = categoryLabels[category] || category;

  if (viewMode === "list") {
    return (
      <div className="flex flex-col sm:flex-row bg-surface border border-border rounded-card overflow-hidden shadow-card transition-all duration-300 hover:border-border-medium hover:shadow-glow w-full">
        {/* Left Side: Image Block */}
        <div className="relative w-full sm:w-[240px] md:w-[280px] h-[180px] sm:h-auto bg-bg shrink-0">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, 280px"
            className="object-cover opacity-75"
            unoptimized
          />

          {/* Badges on Top of Image */}
          <div className="absolute inset-x-3 top-3 flex items-start justify-between pointer-events-none">
            <div className="bg-[#1a230a]/90 backdrop-blur-sm border border-[#2d3c13] px-2.5 py-1 rounded-badge text-[10px] font-semibold text-[#a0d056] shadow-md truncate max-w-[120px]">
              By {hostName}
            </div>

            <div className="bg-[#1a230a] border border-[#2d3c13] px-2.5 py-1 rounded-badge text-[10px] font-semibold text-[#72943a]">
              {categoryLabel}
            </div>
          </div>
          
          <div className="absolute inset-x-3 bottom-3 flex items-end justify-center pointer-events-none">
            <div className="bg-[#1a230a]/90 backdrop-blur-sm border border-[#43581e] px-3 py-1.5 rounded-[8px] flex items-center gap-1.5 shadow-md">
              {clockIcon}
              <span className="text-[11px] font-bold text-[#e8edd4] tracking-wide">{timeLeft}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Details Content */}
        <div className="flex-grow p-5 md:p-6 flex flex-col justify-between">
          <div className="flex flex-col gap-2">
            {/* Title & Price Row */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-heading font-bold text-lg md:text-xl text-text-primary group-hover:text-text-brand transition-colors duration-200">
                  {title}
                </h3>
                {badgeText && (
                  <div className={cn("inline-flex items-center gap-1 border px-2 py-0.5 rounded-badge text-[9px] font-semibold tracking-wider mt-1.5", getBadgeStyle(badgeText))}>
                    {badgeText.toUpperCase() === "ALMOST GONE" && fireIcon}
                    <span>{badgeText}</span>
                  </div>
                )}
                {worthPrice && (
                  <p className="font-sans text-[11px] text-[#72943a] mt-1.5">
                    Worth {formatCurrency(worthPrice, 0)}
                  </p>
                )}
              </div>
              <div className="bg-[#1a230a] border border-[#2d3c13] px-3.5 py-1.5 rounded-badge text-xs font-bold text-[#a0d056] shrink-0">
                {formatCurrency(ticketPrice)}
              </div>
            </div>
          </div>

          {/* Middle: Progress Bar & Countdown Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 pt-4 border-t border-divider/50">
            {/* Progress block */}
            <div className="flex flex-col justify-center">
              <div className="flex justify-between items-center text-[10px] text-text-muted mb-1.5 font-medium">
                <span className="flex items-center gap-1.5">
                  {ticketIcon}
                  <span>{soldTickets} / {totalTickets} sold</span>
                </span>
                <span className="text-[#a0d056] font-semibold">{soldPercent}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#1a230a] rounded-badge overflow-hidden">
                <div
                  className="h-full bg-primary rounded-badge transition-all duration-500 ease-out"
                  style={{ width: `${soldPercent}%` }}
                />
              </div>
            </div>

            {/* Countdown block */}
            <div className="flex items-center gap-2 bg-[#111210] border border-[#1a230a] px-3.5 py-2 rounded-button w-full">
              {clockIcon}
              <div className="flex gap-1 text-[11px]">
                <span className="text-text-muted">Closes on</span>
                <span className="font-semibold text-text-primary">{formattedEndDate}</span>
              </div>
            </div>
          </div>

          {/* Bottom: CTA */}
          <div className="pt-2">
            <Link
              href={`/live-raffles/${slug || id}`}
              className="block w-full border border-[#5a752a] text-[#b3b8aa] hover:bg-primary/10 hover:text-[#a0d056] hover:border-[#a0d056] text-center py-2.5 rounded-[10px] font-heading text-xs font-semibold uppercase tracking-wider transition-all duration-200 select-none"
            >
              Enter Draw →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Default Grid Layout Card
  return (
    <div className="flex flex-col bg-[#161810] border border-border rounded-card overflow-hidden shadow-card transition-all duration-300 hover:border-border-medium hover:shadow-glow w-full">
      {/* Card Image Block */}
      <div className="relative w-full h-[180px] bg-bg shrink-0">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 380px"
          className="object-cover opacity-75"
          unoptimized
        />

        {/* Floating Badges */}
        <div className="absolute inset-x-3 top-3 flex items-start justify-between pointer-events-none">
          <div className="bg-[#1a230a]/90 backdrop-blur-sm border border-[#2d3c13] px-2.5 py-1 rounded-badge text-[10px] font-semibold text-[#a0d056] shadow-md truncate max-w-[120px]">
            By {hostName}
          </div>

          <div className="bg-[#1a230a] border border-[#2d3c13] px-2.5 py-1 rounded-badge text-[10px] font-semibold text-[#72943a]">
            {categoryLabel}
          </div>
        </div>

        <div className="absolute inset-x-3 bottom-3 flex items-end justify-center pointer-events-none">
          <div className="bg-[#1a230a]/90 backdrop-blur-sm border border-[#43581e] px-3 py-1.5 rounded-[8px] flex items-center gap-1.5 shadow-md">
            {clockIcon}
            <span className="text-[11px] font-bold text-[#e8edd4] tracking-wide">{timeLeft}</span>
          </div>
        </div>
      </div>

      {/* Card Content details */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Header Row: Title & Price Tag */}
          <div className="flex items-start justify-between gap-3 mb-1">
            <h3 className="font-heading font-medium text-lg text-text-primary line-clamp-1">
              {title}
            </h3>
            <div className="bg-[#1a230a] border border-[#2d3c13] px-2 py-0.5 rounded-badge text-[11px] font-bold text-[#a0d056] shrink-0 mt-0.5">
              {formatCurrency(ticketPrice)}
            </div>
          </div>
          
          {badgeText && (
            <div className={cn("inline-flex items-center gap-1 border px-2 py-0.5 rounded-badge text-[9px] font-semibold tracking-wider mb-2", getBadgeStyle(badgeText))}>
              {badgeText.toUpperCase() === "ALMOST GONE" && fireIcon}
              <span>{badgeText}</span>
            </div>
          )}

          {/* Worth Subheading */}
          {worthPrice && (
            <p className="font-sans text-[11px] text-[#5a752a] font-normal mb-3">
              Worth {formatCurrency(worthPrice, 0)}
            </p>
          )}

          {/* Ticket Sold Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center text-[10px] text-text-muted mb-1.5 font-normal">
              <span className="flex items-center gap-1">
                {ticketIcon}
                <span>{soldTickets} / {totalTickets} sold</span>
              </span>
              <span className="text-[#8cb34a] font-medium">{soldPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#1a230a] rounded-badge overflow-hidden">
              <div
                className="h-full bg-primary rounded-badge transition-all duration-500 ease-out"
                style={{ width: `${soldPercent}%` }}
              />
            </div>
          </div>

          {/* Closes in Countdown Block */}
          <div className="flex items-center gap-1.5 bg-[#111210] border border-[#1a230a] px-3 py-2 rounded-[10px] mb-4 text-xs">
            {clockIcon}
            <span className="text-[#5a752a]">Closes on</span>
            <span className="font-semibold text-text-primary">{formattedEndDate}</span>
          </div>
        </div>

        {/* Enter Draw CTA Button */}
        <Link
          href={`/live-raffles/${slug || id}`}
          className="block w-full border border-[#5a752a] text-[#b3b8aa] hover:bg-primary/10 hover:text-[#a0d056] hover:border-[#a0d056] text-center py-2.5 rounded-[10px] font-heading text-xs font-semibold transition-all duration-200 select-none"
        >
          Enter Draw →
        </Link>
      </div>
    </div>
  );
}
