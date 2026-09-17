"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { RaffleDetail } from "../../../types/raffle-details.types";
import { usePurchaseTicketsMutation } from "../../../hooks/useTicketHooks";
import { useAuth } from "../../../features/auth/AuthContext";
import { useBasket } from "../../../features/basket/BasketContext";
import { useRouter } from "next/navigation";
import TicketPurchaseSuccessModal, { TicketPurchaseSuccessData } from "./TicketPurchaseSuccessModal";
import FreePostalEntryButton from "../legal/FreePostalEntryButton";
import CheckoutComplianceModal from "../checkout/CheckoutComplianceModal";

interface RaffleEntryCardProps {
  raffle: RaffleDetail;
}

export default function RaffleEntryCard({ raffle }: RaffleEntryCardProps) {
  const {
    ticketPrice,
    totalPoolValue,
    worthPrice,
    totalTickets,
    soldTickets,
    endDate,
  } = raffle;

  const soldPercent = Math.min(Math.round((soldTickets / totalTickets) * 100), 100);
  const remainingTickets = Math.max(totalTickets - soldTickets, 0);

  const minTickets: number = raffle.minTickets || raffle.minimumTickets || 1;
  const maxTickets: number | undefined = raffle.maxTickets || raffle.maximumTicketsPerOrder;
  const effectiveMax: number = maxTickets ? Math.min(remainingTickets, maxTickets) : remainingTickets;

  const [quantity, setQuantity] = useState<number>(minTickets);
  const [statusMessage, setStatusMessage] = useState<{type: 'success'|'error'|'info', text: string} | null>(null);
  const [purchaseSuccessData, setPurchaseSuccessData] = useState<TicketPurchaseSuccessData | null>(null);
  const [timeLeft, setTimeLeft] = useState("");
  const [isComplianceModalOpen, setIsComplianceModalOpen] = useState(false);
  const [complianceError, setComplianceError] = useState<string | null>(null);

  const { isAuthenticated, user } = useAuth();
  const { addToBasket } = useBasket();
  const [basketFeedback, setBasketFeedback] = useState<string | null>(null);
  const router = useRouter();
  
  const purchaseMutation = usePurchaseTicketsMutation(raffle.id);

  const totalPrice = quantity * ticketPrice;

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

  const quickPicks = React.useMemo(() => {
    const candidates = minTickets === 1 ? [1, 5, 10, 20] : [minTickets, minTickets + 4, minTickets + 9, minTickets + 19];
    const filtered = Array.from(new Set(candidates))
      .filter((n) => n >= minTickets && n <= effectiveMax);
    if (filtered.length === 0) return [minTickets];
    return filtered.slice(0, 4);
  }, [minTickets, effectiveMax]);

  const [quantityInput, setQuantityInput] = useState<string>(quantity.toString());

  useEffect(() => {
    setQuantityInput(quantity.toString());
  }, [quantity]);

  const commitQuantityInput = (valStr: string) => {
    const parsed = parseInt(valStr, 10);
    if (isNaN(parsed) || parsed < minTickets) {
      setQuantity(minTickets);
      setQuantityInput(minTickets.toString());
    } else if (parsed > effectiveMax) {
      setQuantity(effectiveMax);
      setQuantityInput(effectiveMax.toString());
    } else {
      setQuantity(parsed);
      setQuantityInput(parsed.toString());
    }
  };

  const handleQuantityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    setQuantityInput(raw);
    if (raw !== "") {
      const parsed = parseInt(raw, 10);
      if (parsed >= minTickets && parsed <= effectiveMax) {
        setQuantity(parsed);
      }
    }
  };

  const handleQuickPick = (val: number) => setQuantity(Math.max(minTickets, Math.min(val, effectiveMax)));
  const handleDecrement = () => setQuantity((prev: number) => (prev > minTickets ? prev - 1 : minTickets));
  const handleIncrement = () => setQuantity((prev: number) => (prev < effectiveMax ? prev + 1 : prev));

  const handleAddToBasket = () => {
    if (quantity < minTickets) {
      setStatusMessage({ type: 'error', text: `Minimum ${minTickets} tickets required for this competition.` });
      return;
    }

    if (maxTickets && quantity > maxTickets) {
      setStatusMessage({ type: 'error', text: `Maximum ${maxTickets} tickets allowed per entrant.` });
      return;
    }

    if (quantity > remainingTickets) {
      setStatusMessage({ type: 'error', text: `Only ${remainingTickets} tickets left.` });
      return;
    }

    const success = addToBasket({
      raffleId: raffle.id,
      title: raffle.title,
      slug: raffle.slug,
      mainImage: raffle.images?.[0] || '',
      ticketPrice: raffle.ticketPrice,
      quantity,
      totalTickets: raffle.totalTickets,
      soldTickets: raffle.soldTickets,
      remainingTickets,
      prizeClassification: (raffle as any).prizeClassification || 'RIF',
      endDate: raffle.endDate,
      hostName: raffle.hostName,
      minTickets,
      maxTickets,
    });

    if (success) {
      setStatusMessage(null);
      setBasketFeedback(`Added ${quantity} ticket${quantity > 1 ? 's' : ''} to basket!`);
      setTimeout(() => setBasketFeedback(null), 4000);
    }
  };

  const handleOpenCheckoutModal = () => {
    if (quantity < minTickets) {
      setStatusMessage({ type: 'error', text: `Minimum ${minTickets} tickets required for this competition.` });
      return;
    }

    if (maxTickets && quantity > maxTickets) {
      setStatusMessage({ type: 'error', text: `Maximum ${maxTickets} tickets allowed per entrant.` });
      return;
    }

    if (quantity > remainingTickets) {
      setStatusMessage({ type: 'error', text: `Only ${remainingTickets} tickets left.` });
      return;
    }

    if (!isAuthenticated) {
      // Save direct checkout item and redirect to login
      const directItem = {
        raffleId: raffle.id,
        title: raffle.title,
        slug: raffle.slug,
        mainImage: raffle.images?.[0] || '',
        ticketPrice: raffle.ticketPrice,
        quantity,
        totalTickets: raffle.totalTickets,
        soldTickets: raffle.soldTickets,
        remainingTickets,
        prizeClassification: (raffle as any).prizeClassification || 'RIF',
        endDate: raffle.endDate,
        hostName: raffle.hostName,
        minTickets,
        maxTickets,
      };
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("direct_checkout_item", JSON.stringify(directItem));
        } catch {}
      }
      router.push(`/login?redirect=${encodeURIComponent('/checkout?direct=true')}`);
      return;
    }

    setStatusMessage(null);
    setComplianceError(null);
    setIsComplianceModalOpen(true);
  };

  const handleConfirmCompliance = (complianceData: { dateOfBirth: string; ukaraNumber?: string; acceptedTerms: boolean }) => {
    setComplianceError(null);

    // Save verified compliance inputs for checkout page prefill
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("checkout_dob", complianceData.dateOfBirth);
        if (complianceData.ukaraNumber) {
          localStorage.setItem("checkout_ukara", complianceData.ukaraNumber);
        }
        localStorage.setItem("checkout_accepted_terms", "true");
      } catch {}
    }

    // Save direct checkout item (do not pollute shopping basket)
    const directItem = {
      raffleId: raffle.id,
      title: raffle.title,
      slug: raffle.slug,
      mainImage: raffle.images?.[0] || '',
      ticketPrice: raffle.ticketPrice,
      quantity,
      totalTickets: raffle.totalTickets,
      soldTickets: raffle.soldTickets,
      remainingTickets,
      prizeClassification: (raffle as any).prizeClassification || 'RIF',
      endDate: raffle.endDate,
      hostName: raffle.hostName,
      minTickets,
      maxTickets,
    };

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("direct_checkout_item", JSON.stringify(directItem));
      } catch {}
    }

    setIsComplianceModalOpen(false);
    // Bring user to /checkout?direct=true to complete direct purchase
    router.push('/checkout?direct=true');
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
        <div className="flex items-center justify-between">
          <span className="font-sans text-[12px] text-[#A0D056]">Number of tickets</span>
          <div className="flex items-center gap-1.5">
            {minTickets > 1 && (
              <span className="font-sans text-[11px] text-[#8CB34A] bg-[#1A230A] px-2 py-0.5 rounded border border-[#2D3C13]">
                Min {minTickets}
              </span>
            )}
            {maxTickets && (
              <span className="font-sans text-[11px] text-[#8CB34A] bg-[#1A230A] px-2 py-0.5 rounded border border-[#2D3C13]">
                Max {maxTickets} per entrant
              </span>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-2">
          {quickPicks.map((num) => (
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

        <div className="flex items-center h-[44px] bg-[#111210] border border-[#2D3C13] rounded-[8px] overflow-hidden mt-1 focus-within:border-[#8CB34A] transition-colors">
          <button 
            type="button"
            onClick={handleDecrement}
            disabled={quantity <= minTickets}
            className={`w-[44px] h-full flex items-center justify-center bg-[#1A230A] text-[#8CB34A] hover:bg-[#2D3C13] transition-colors shrink-0 ${
              quantity <= minTickets ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
            }`}
            aria-label="Decrease ticket quantity"
          >
            -
          </button>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={quantityInput}
            onChange={handleQuantityInputChange}
            onBlur={() => commitQuantityInput(quantityInput)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.currentTarget.blur();
              }
            }}
            className="flex-1 h-full text-center bg-transparent font-sans font-medium text-[14px] text-[#E8EDD4] border-x border-[#2D3C13] focus:outline-none focus:bg-[#1A230A] select-all cursor-text [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none transition-colors"
            aria-label="Ticket quantity"
          />
          <button 
            type="button"
            onClick={handleIncrement}
            disabled={quantity >= effectiveMax}
            className={`w-[44px] h-full flex items-center justify-center bg-[#1A230A] text-[#8CB34A] hover:bg-[#2D3C13] transition-colors shrink-0 ${
              quantity >= effectiveMax ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
            }`}
            aria-label="Increase ticket quantity"
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

        {/* Basket Notification Toast */}
        {basketFeedback && (
          <div className="p-3 bg-[#1A230A] border border-[#8CB34A] rounded-lg text-xs font-sans text-[#A0D056] flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold">✓</span>
              <span>{basketFeedback}</span>
            </div>
            <Link
              href="/basket"
              className="underline font-semibold hover:text-[#E8EDD4] ml-2 text-xs whitespace-nowrap"
            >
              View Basket →
            </Link>
          </div>
        )}

        {/* Action Buttons: Add to Basket + Instant Direct Entry */}
        <div className="flex flex-col gap-2.5">
          <button 
            onClick={handleAddToBasket}
            disabled={remainingTickets === 0}
            className={`w-full h-[48px] rounded-[8px] font-heading font-semibold text-[14px] transition-all flex items-center justify-center gap-2 ${
              remainingTickets === 0
                ? 'bg-[#2D3C13] text-[#72943A] cursor-not-allowed'
                : 'bg-[#1A230A] border border-[#8CB34A] text-[#8CB34A] hover:bg-[#8CB34A] hover:text-[#0D0D0B] shadow-[0_0_15px_rgba(140,179,74,0.15)] cursor-pointer'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            Add to Basket — £{totalPrice.toFixed(2)}
          </button>

          <button 
            onClick={handleOpenCheckoutModal}
            disabled={purchaseMutation.isPending || remainingTickets === 0}
            className={`w-full h-[42px] rounded-[8px] font-heading font-medium text-[13px] transition-colors flex items-center justify-center cursor-pointer ${
              purchaseMutation.isPending || remainingTickets === 0
                ? 'bg-[#2D3C13] text-[#72943A] cursor-not-allowed'
                : 'bg-[#8CB34A] hover:bg-[#A0D056] text-[#0D0D0B]'
            }`}
          >
            {purchaseMutation.isPending ? 'Processing...' : 'Instant Entry (Direct Pay)'}
          </button>
        </div>

        {/* UK-Compliant Free Postal Entry Route Button */}
        <FreePostalEntryButton raffleTitle={raffle.title} variant="button" />

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

      {/* 18+ Age & UKARA Compliance Checkout Modal */}
      <CheckoutComplianceModal
        isOpen={isComplianceModalOpen}
        onClose={() => setIsComplianceModalOpen(false)}
        raffleTitle={raffle.title}
        prizeClassification={(raffle as any).prizeClassification || "RIF"}
        quantity={quantity}
        ticketPrice={ticketPrice}
        onConfirm={handleConfirmCompliance}
        isPending={purchaseMutation.isPending}
        errorMessage={complianceError}
        userDob={(user as any)?.dateOfBirth || null}
        userUkara={(user as any)?.ukaraNumber || null}
        submitButtonText={`Confirm & Proceed to Checkout — £${totalPrice.toFixed(2)}`}
      />

      {/* Instant Ticket Numbers & Instant Win Purchase Confirmation Modal */}
      <TicketPurchaseSuccessModal
        isOpen={!!purchaseSuccessData}
        onClose={() => setPurchaseSuccessData(null)}
        data={purchaseSuccessData}
      />
    </div>
  );
}
