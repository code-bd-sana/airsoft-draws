"use client";

import React, { useState, useEffect } from "react";
import { RaffleDetail } from "../../../types/raffle-details.types";
import { usePurchaseTicketsMutation } from "../../../hooks/useTicketHooks";
import { useAuth } from "../../../features/auth/AuthContext";
import { useRouter } from "next/navigation";
import WinAnimationModal from "../../ui/WinAnimationModal";

interface RaffleEntryCardProps {
  raffle: RaffleDetail;
}

export default function RaffleEntryCard({ raffle }: RaffleEntryCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [statusMessage, setStatusMessage] = useState<{type: 'success'|'error'|'info', text: string} | null>(null);
  const [instantWinData, setInstantWinData] = useState<Array<{title: string, ticketNumber: number}> | null>(null);
  const [timeLeft, setTimeLeft] = useState("");

  const { isAuthenticated } = useAuth();
  const router = useRouter();
  
  const purchaseMutation = usePurchaseTicketsMutation(raffle.id);

  const {
    ticketPrice,
    totalPoolValue,
    worthPrice,
    totalTickets,
    soldTickets,
    endDate,
  } = raffle;

  useEffect(() => {
    if (!endDate) {
      setTimeLeft("Ended");
      return;
    }
    const calc = () => {
      const diff = new Date(endDate).getTime() - Date.now();
      if (diff <= 0) return "Ended";
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / 1000 / 60) % 60);
      const s = Math.floor((diff / 1000) % 60);
      
      const pad = (n: number) => n.toString().padStart(2, '0');
      
      if (d > 0) return `${d}d ${pad(h)}h ${pad(m)}m ${pad(s)}s`;
      return `${pad(h)}h ${pad(m)}m ${pad(s)}s`;
    };
    setTimeLeft(calc());
    const interval = setInterval(() => setTimeLeft(calc()), 1000);
    return () => clearInterval(interval);
  }, [endDate]);

  const soldPercent = Math.min(Math.round((soldTickets / totalTickets) * 100), 100);
  const remainingTickets = Math.max(totalTickets - soldTickets, 0);
  const totalPrice = quantity * ticketPrice;

  const handleQuickPick = (val: number) => setQuantity(val);
  const handleDecrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  const handleIncrement = () => setQuantity(prev => prev + 1);

  const handlePurchase = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    if (quantity > remainingTickets) {
      setStatusMessage({ type: 'error', text: `Only ${remainingTickets} tickets left.` });
      return;
    }
    
    setStatusMessage(null);
    purchaseMutation.mutate(quantity, {
      onSuccess: (data) => {
        let msg = `Successfully purchased ${data.tickets.length} tickets!`;
        if (data.instantWins && data.instantWins.length > 0) {
          msg += ` 🎉 YOU GOT ${data.instantWins.length} INSTANT WIN(S)! 🎉`;
          
          // Map backend winner records to modal expected format
          const formattedWins = data.instantWins.map((iw: any) => {
             // Find matching ticket for number
             const tk = data.tickets.find((t: any) => t.id === iw.ticketId);
             return {
                title: iw.prizeName,
                ticketNumber: tk ? tk.ticketNumber : 0
             };
          });
          setInstantWinData(formattedWins);
        }
        setStatusMessage({ type: 'success', text: msg });
        setQuantity(1);
      },
      onError: (error: any) => {
        setStatusMessage({ 
          type: 'error', 
          text: error.response?.data?.message || 'Failed to purchase tickets' 
        });
      }
    });
  };

  return (
    <div className="bg-[#111210] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col w-full max-w-[400px]">
      
      {/* Top Value Section */}
      <div className="flex flex-col gap-1 mb-6">
        <span className="font-sans text-[10px] text-[#5A752A] uppercase tracking-wide">Combined Prize Pool</span>
        <span className="font-heading font-bold text-[32px] text-[#8CB34A] leading-tight">£{totalPoolValue.toLocaleString()}</span>
        <span className="font-sans text-[11px] text-[#72943A]">
          Worth: £{(worthPrice || totalPoolValue).toLocaleString()}. Est. Valuation: £{((worthPrice || totalPoolValue) * 0.9).toLocaleString()}
        </span>
      </div>

      {/* Stats Rows */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#2D3C13]/50">
          <span className="font-sans text-[12px] text-[#72943A]">End Date</span>
          <span className="font-heading font-semibold text-[13px] text-[#8cb34a] tabular-nums tracking-wider animate-pulse">
            {timeLeft || "Ended"}
          </span>
        </div>
        <div className="flex items-center justify-between pb-3 border-b border-[#2D3C13]/50">
          <span className="font-sans text-[12px] text-[#72943A]">Ticket Price</span>
          <span className="font-heading font-semibold text-[13px] text-[#E8EDD4]">£{ticketPrice.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between pb-3 border-b border-[#2D3C13]/50">
          <span className="font-sans text-[12px] text-[#72943A]">Tickets</span>
          <span className="font-heading font-semibold text-[13px] text-[#E8EDD4]">{soldTickets.toLocaleString()} / {totalTickets.toLocaleString()}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex flex-col gap-2 mb-6">
        <div className="w-full h-[4px] bg-[#1A230A] rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#8CB34A] rounded-full" 
            style={{ width: `${soldPercent}%` }}
          />
        </div>
        <div className="flex justify-end">
          <span className="font-sans text-[10px] text-[#72943A]">{remainingTickets.toLocaleString()} tickets left</span>
        </div>
      </div>

      {/* Ticket Selection */}
      <div className="flex flex-col gap-3 mb-6">
        <span className="font-sans text-[12px] text-[#A0D056]">Number of tickets</span>
        
        <div className="grid grid-cols-4 gap-2">
          {[1, 5, 10, 20].map((num) => (
            <button
              key={num}
              onClick={() => handleQuickPick(num)}
              className={`h-[36px] rounded-[6px] font-sans font-medium text-[13px] transition-colors ${
                quantity === num 
                  ? "bg-[#1A230A] border border-[#8CB34A] text-[#8CB34A]" 
                  : "bg-transparent border border-[#2D3C13] text-[#72943A] hover:border-[#43581E] hover:text-[#E8EDD4]"
              }`}
            >
              {num}
            </button>
          ))}
        </div>

        <div className="flex items-center h-[44px] bg-[#111210] border border-[#2D3C13] rounded-[8px] overflow-hidden mt-1">
          <button 
            onClick={handleDecrement}
            className="w-[44px] h-full flex items-center justify-center bg-[#1A230A] text-[#8CB34A] hover:bg-[#2D3C13] transition-colors"
          >
            -
          </button>
          <div className="flex-1 h-full flex items-center justify-center font-sans font-medium text-[14px] text-[#E8EDD4] border-x border-[#2D3C13]">
            {quantity}
          </div>
          <button 
            onClick={handleIncrement}
            className="w-[44px] h-full flex items-center justify-center bg-[#1A230A] text-[#8CB34A] hover:bg-[#2D3C13] transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* Total & Enter CTA */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="font-sans text-[12px] text-[#72943A]">Total ({quantity} tickets)</span>
          <span className="font-heading font-semibold text-[16px] text-[#8CB34A]">£{totalPrice.toFixed(2)}</span>
        </div>

        <button 
          onClick={handlePurchase}
          disabled={purchaseMutation.isPending || remainingTickets === 0}
          className={`w-full h-[48px] rounded-[8px] font-heading font-medium text-[14px] transition-colors flex items-center justify-center ${
            purchaseMutation.isPending || remainingTickets === 0
              ? 'bg-[#2D3C13] text-[#72943A] cursor-not-allowed'
              : 'bg-[#8CB34A] hover:bg-[#A0D056] text-[#0D0D0B] shadow-[0_0_15px_rgba(140,179,74,0.15)]'
          }`}
        >
          {purchaseMutation.isPending ? 'Processing...' : `Enter Draw — £${totalPrice.toFixed(2)}`}
        </button>

        {statusMessage && (
          <div className={`p-3 rounded-lg text-sm font-sans text-center ${
            statusMessage.type === 'success' ? 'bg-[#1A230A] text-[#A0D056] border border-[#8CB34A]' : 'bg-red-950 text-red-400 border border-red-800'
          }`}>
            {statusMessage.text}
          </div>
        )}

        <p className="font-sans text-[10px] text-[#5A752A] text-center">
          Secure checkout. Competitions fully audited. 18+
        </p>
      </div>

      {/* Share Button */}
      <button className="w-full h-[40px] mt-6 flex items-center justify-center gap-2 rounded-[8px] bg-transparent border border-[#2D3C13] hover:border-[#43581E] text-[#72943A] hover:text-[#E8EDD4] font-sans font-medium text-[12px] transition-colors">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
        </svg>
        Share this competition
      </button>

      <WinAnimationModal 
        isOpen={!!instantWinData} 
        onClose={() => setInstantWinData(null)} 
        prizes={instantWinData || []} 
      />
    </div>
  );
}
