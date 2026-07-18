"use client";

import React, { useEffect, useState } from "react";
import { Ticket } from "./TicketsTable";

interface CompetitionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket | null;
  allTickets?: Ticket[];
}

export default function CompetitionDetailsModal({
  isOpen,
  onClose,
  ticket,
  allTickets = [],
}: CompetitionDetailsModalProps) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number }>({ d: 0, h: 0, m: 0, s: 0 });

  // Update countdown timer
  useEffect(() => {
    if (!isOpen || !ticket || !ticket.raw?.raffle?.endDate) return;

    const calculateTimeLeft = () => {
      const difference = new Date(ticket.raw.raffle.endDate).getTime() - new Date().getTime();
      if (difference > 0) {
        setTimeLeft({
          d: Math.floor(difference / (1000 * 60 * 60 * 24)),
          h: Math.floor((difference / (1000 * 60 * 60)) % 24),
          m: Math.floor((difference / 1000 / 60) % 60),
          s: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [isOpen, ticket]);

  if (!isOpen || !ticket || !ticket.raw) return null;

  const raffle = ticket.raw.raffle;
  
  // Aggregate data for this specific raffle
  const myRaffleTickets = allTickets.filter(t => t.raw?.raffle?.id === raffle.id);
  const ticketNumbers = myRaffleTickets.map(t => t.ticketId);
  const ticketsEntered = myRaffleTickets.length;
  const amountPaid = (Number(raffle.pricePerTicket) || 0) * ticketsEntered;
  const purchaseDate = myRaffleTickets[0]?.purchaseDate || ticket.purchaseDate;
  
  const soldPercent = raffle.totalTickets > 0 ? Math.min(Math.round((raffle.ticketsSold / raffle.totalTickets) * 100), 100) : 0;
  const remainingTickets = Math.max(raffle.totalTickets - raffle.ticketsSold, 0);
  const winChance = raffle.totalTickets > 0 ? ((ticketsEntered / raffle.totalTickets) * 100).toFixed(1) : "0";

  const hostName = raffle.host?.user ? `${raffle.host.user.firstName} ${raffle.host.user.lastName}` : "Host";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      {/* Modal Container */}
      <div className="bg-[#0D0D0B] border border-[#2D3C13] rounded-[16px] w-full max-w-[900px] max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col relative animate-slideUp custom-scrollbar">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between p-5 border-b border-[#2D3C13] sticky top-0 bg-[#0D0D0B] z-10">
          <div className="flex items-center gap-3">
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#1A230A] border border-[#2D3C13] flex items-center justify-center text-[#72943A] hover:text-[#E8EDD4] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <h2 className="font-heading font-medium text-[15px] text-[#E8EDD4] line-clamp-1 max-w-[200px] sm:max-w-xs">
                {raffle.title}
              </h2>
              <span className="font-sans text-[13px] text-[#5A752A] hidden sm:block">
                {ticket.ticketId} • Hosted by {hostName}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-[8px] bg-transparent border border-[#2D3C13] hover:bg-[#1A230A] text-[#72943A] hover:text-[#E8EDD4] font-sans font-medium text-[12px] transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
              </svg>
              Share
            </button>
            <div className={`px-3 py-1 rounded-[14px] border ${raffle.status === 'ACTIVE' ? 'border-[#72943A]' : 'border-red-900'} bg-transparent`}>
              <span className={`font-sans font-medium text-[10px] ${raffle.status === 'ACTIVE' ? 'text-[#8CB34A]' : 'text-red-500'} uppercase tracking-wide`}>
                {raffle.status === 'ACTIVE' ? 'Live' : raffle.status}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="flex flex-col md:flex-row p-6 gap-6">
          
          {/* Left Column (Competition Info) */}
          <div className="flex-1 flex flex-col gap-4">
            
            {/* Prize Card */}
            <div className="bg-[#161810] border border-[#2D3C13] rounded-[12px] p-5 flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-[#1A230A] border border-[#2D3C13] flex items-center justify-center shrink-0 overflow-hidden relative">
                 {/* Try to show the image if possible, else fallback */}
                 {raffle.mainImage ? (
                   // Using img directly here for simplicity instead of next/image to avoid unoptimized issues in this modal if not needed
                   <img src={raffle.mainImage} alt={raffle.title} className="w-full h-full object-cover" />
                 ) : (
                  <svg className="w-6 h-6 text-[#8CB34A]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4">
                    <circle cx="50" cy="50" r="30" />
                    <circle cx="50" cy="50" r="15" />
                  </svg>
                 )}
              </div>
              <div className="flex flex-col">
                <span className="font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-wider mb-1">Prize</span>
                <h3 className="font-heading font-medium text-[16px] text-[#E8EDD4] mb-2">
                  {raffle.prizeName || raffle.title}
                </h3>
                <p className="font-sans text-[12px] text-[#72943A] leading-relaxed line-clamp-2">
                  {raffle.description || `Win this amazing ${raffle.title}.`}
                </p>
              </div>
            </div>

            {/* Draw Countdown */}
            <div className="bg-[#161810] border border-[#2D3C13] rounded-[12px] p-5">
              <div className="flex justify-between items-center mb-4">
                <span className="font-heading font-medium text-[14px] text-[#E8EDD4]">Draw Countdown</span>
                <span className="font-sans text-[12px] text-[#72943A]">Drawn {new Date(raffle.endDate).toLocaleDateString()}</span>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { value: timeLeft.d, label: "DAYS" },
                  { value: timeLeft.h, label: "HOURS" },
                  { value: timeLeft.m, label: "MINUTES" },
                  { value: timeLeft.s, label: "SECONDS" }
                ].map((time) => (
                  <div key={time.label} className="bg-[#1A230A] border border-[#2D3C13] rounded-[8px] py-3 flex flex-col items-center justify-center gap-1">
                    <span className="font-heading font-bold text-[24px] text-[#E8EDD4] leading-none">{time.value.toString().padStart(2, '0')}</span>
                    <span className="font-sans text-[9px] font-medium text-[#5A752A] uppercase tracking-[1px]">{time.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ticket Sales Progress */}
            <div className="bg-[#161810] border border-[#2D3C13] rounded-[12px] p-5">
              <div className="flex justify-between items-center mb-3">
                <span className="font-heading font-medium text-[14px] text-[#E8EDD4]">Ticket Sales Progress</span>
                <span className="font-sans text-[12px] text-[#8CB34A]">{soldPercent}% sold</span>
              </div>
              <div className="w-full h-[6px] bg-[#1A230A] rounded-full overflow-hidden mb-3">
                <div className="h-full bg-[#8CB34A] rounded-full transition-all duration-500" style={{ width: `${soldPercent}%` }} />
              </div>
              <div className="flex justify-between items-center">
                <span className="font-sans text-[12px] text-[#72943A]">{raffle.ticketsSold} sold</span>
                <span className="font-sans text-[12px] text-[#5A752A]">{remainingTickets} remaining of {raffle.totalTickets}</span>
              </div>
            </div>

            {/* Features Grid (Dynamic from Highlights if we had them, defaulting to basic terms) */}
            <div className="grid grid-cols-2 gap-3">
              {[
                "Certified Random Draw", 
                "Fully Insured Shipping", 
                "Premium Airsoft Gear", 
                `Price per Ticket: £${Number(raffle.pricePerTicket).toFixed(2)}`
              ].map((feature) => (
                <div key={feature} className="bg-[#161810] border border-[#2D3C13] rounded-[8px] p-3 flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-[#5A752A] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-sans text-[12px] text-[#72943A] truncate">{feature}</span>
                </div>
              ))}
            </div>

            {/* Draw Rules */}
            <div className="bg-[#161810] border border-[#2D3C13] rounded-[12px] p-5 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#5A752A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-heading font-medium text-[14px] text-[#E8EDD4]">Draw Rules</span>
              </div>
              <p className="font-sans text-[12px] text-[#5A752A] leading-relaxed pl-6">
                Winner selected via certified random draw. All ticket holders notified within 24h of draw. Prize shipped to UK addresses only. Winner has 72h to respond before re-draw.
              </p>
            </div>
          </div>

          {/* Right Column (My Entry Details) */}
          <div className="w-full md:w-[320px] shrink-0 flex flex-col gap-4 border-t md:border-t-0 md:border-l border-[#2D3C13] pt-6 md:pt-0 md:pl-6">
            <h3 className="font-heading font-medium text-[15px] text-[#E8EDD4] px-1">My Entry</h3>
            
            {/* Entry Summary */}
            <div className="border border-[#2D3C13] rounded-[12px] p-5 flex flex-col gap-4 relative">
              <div className="absolute top-5 right-5 w-4 h-4 text-[#5A752A]">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
                </svg>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px]">Tickets Entered</span>
                <span className="font-heading font-bold text-[20px] text-[#E8EDD4]">{ticketsEntered}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px]">Amount Paid</span>
                <span className="font-heading font-bold text-[16px] text-[#E8EDD4]">£{amountPaid.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px]">Purchased</span>
                <span className="font-sans text-[13px] text-[#E8EDD4]">{purchaseDate}</span>
              </div>
              
              <div className="pt-2 border-t border-[#1A230A]">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px]">Win Chance</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-[4px] bg-[#1A230A] rounded-full overflow-hidden">
                    <div className="h-full bg-[#8CB34A] rounded-full" style={{ width: `${Math.min(Number(winChance), 100)}%` }} />
                  </div>
                  <span className="font-sans font-medium text-[12px] text-[#8CB34A]">{winChance}%</span>
                </div>
              </div>
            </div>

            {/* Ticket Numbers */}
            <div className="flex flex-col gap-2">
              <span className="font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] px-1">Your Ticket Numbers</span>
              <div className="flex flex-wrap gap-2 max-h-[150px] overflow-y-auto custom-scrollbar pr-2">
                {ticketNumbers.map((num) => (
                  <div key={num} className="bg-[#1A230A] border border-[#2D3C13] rounded-[6px] px-3 py-1.5 flex items-center justify-center">
                    <span className="font-sans text-[12px] text-[#72943A]">{num}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Good Luck Box */}
            <div className="bg-[#161810] border border-[#2D3C13] rounded-[12px] p-5 flex flex-col items-center justify-center text-center gap-2 mt-2">
              {ticket.status === 'drawn-won' || ticket.status === 'instant-win' ? (
                <>
                  <span className="text-2xl mb-1">🎉</span>
                  <span className="font-heading font-medium text-[14px] text-[#A0D056]">Winner!</span>
                  <p className="font-sans text-[11px] text-[#5A752A]">
                    Congratulations! You won a prize from this draw!
                  </p>
                </>
              ) : ticket.status === 'drawn-lost' ? (
                <>
                  <span className="text-2xl mb-1">🤝</span>
                  <span className="font-heading font-medium text-[14px] text-[#E8EDD4]">Better luck next time</span>
                  <p className="font-sans text-[11px] text-[#5A752A]">
                    This draw has ended. Thanks for participating!
                  </p>
                </>
              ) : (
                <>
                  <span className="text-2xl mb-1">🍀</span>
                  <span className="font-heading font-medium text-[14px] text-[#E8EDD4]">Good luck!</span>
                  <p className="font-sans text-[11px] text-[#5A752A]">
                    We'll notify you the moment results are announced.
                  </p>
                </>
              )}
            </div>

            {/* Action Button */}
            <button 
              onClick={onClose}
              className="w-full mt-auto h-[40px] rounded-[8px] bg-transparent border border-[#2D3C13] hover:bg-[#1A230A] text-[#72943A] hover:text-[#E8EDD4] font-heading font-medium text-[13px] transition-colors"
            >
              Close Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
