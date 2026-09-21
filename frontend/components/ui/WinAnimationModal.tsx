"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

export interface WinPrizeItem {
  id?: string;
  title: string;
  ticketNumber: number;
  image?: string | null;
  rrpValue?: number | null;
  raffleTitle?: string;
}

interface WinAnimationModalProps {
  isOpen: boolean;
  onClose: () => void;
  prizes: WinPrizeItem[];
  onClaim?: () => void | Promise<void>;
  isClaiming?: boolean;
}

function FastRollingNumbers() {
  const [numbers, setNumbers] = useState(["0", "0", "0", "0"]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNumbers([
        Math.floor(Math.random() * 10).toString(),
        Math.floor(Math.random() * 10).toString(),
        Math.floor(Math.random() * 10).toString(),
        Math.floor(Math.random() * 10).toString(),
      ]);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex gap-2 items-center justify-center font-heading text-[40px] text-[#8CB34A] blur-[0.5px] opacity-90">
      {numbers.map((num, i) => (
        <div
          key={i}
          className="w-[54px] text-center bg-[#1A230A] rounded-xl py-2.5 border border-[#8CB34A]/40 shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)]"
        >
          {num}
        </div>
      ))}
    </div>
  );
}

export default function WinAnimationModal({
  isOpen,
  onClose,
  prizes,
  onClaim,
  isClaiming = false,
}: WinAnimationModalProps) {
  const [mounted, setMounted] = useState(false);
  const [stage, setStage] = useState<"rolling" | "revealed">("rolling");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setStage("rolling");
      // Simulate slot machine / roller delay (2.4 seconds)
      const timer = setTimeout(() => {
        setStage("revealed");
      }, 2400);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen || !mounted || !prizes || prizes.length === 0) return null;

  const count = prizes.length;

  const handleClaimClick = async () => {
    if (stage === "rolling" || isClaiming) return;
    if (onClaim) {
      await onClaim();
    } else {
      onClose();
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-md animate-in fade-in duration-300 p-4">
      <div className="relative bg-[#111210] border border-[#72943A]/60 p-1 rounded-[24px] shadow-[0_0_60px_rgba(114,148,58,0.3)] max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-500 z-[10000]">
        
        {/* Animated Glowing Border Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#8CB34A] via-[#E8EDD4] to-[#5A752A] opacity-25 animate-[spin_5s_linear_infinite]" />
        
        <div className="relative bg-[#111210] p-6 sm:p-8 rounded-[22px] flex flex-col items-center text-center z-10 h-full w-full">
          
          {/* Header Icon */}
          <div className="w-16 h-16 rounded-full bg-[#1A230A] border border-[#43581E] flex items-center justify-center mb-5 shadow-[0_0_25px_rgba(140,179,74,0.4)]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-8 h-8 text-[#8CB34A] animate-pulse"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
              />
            </svg>
          </div>

          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#E8EDD4] mb-1.5 tracking-wide uppercase">
            {stage === "rolling"
              ? "Checking Tickets..."
              : count > 1
              ? `🎉 You Won ${count} Instant Wins!`
              : "🎉 Congratulations!"}
          </h2>
          
          <p className="font-sans text-[12px] sm:text-[13px] text-[#8CB34A] mb-6 uppercase tracking-[1.5px] font-semibold">
            {stage === "rolling"
              ? "Scanning prize database..."
              : count > 1
              ? "Multiple prizes matched your winning ticket numbers!"
              : "You hit an Instant Win Prize!"}
          </p>

          {/* Roller / Prize Display */}
          <div className="w-full bg-[#0D0D0B] border border-[#2D3C13] rounded-2xl p-4 mb-6 relative overflow-hidden min-h-[140px] flex items-center justify-center">
            
            {/* The Slot Machine "Spinning" Effect */}
            {stage === "rolling" ? (
              <div className="flex flex-col items-center justify-center py-4">
                <FastRollingNumbers />
                <span className="text-[11px] text-[#72943A] uppercase tracking-wider font-mono mt-3 animate-pulse">
                  Verifying Lucky Numbers...
                </span>
              </div>
            ) : (
              <div className="w-full flex flex-col gap-2.5 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar animate-in slide-in-from-bottom-4 duration-500 fade-in">
                {prizes.map((prize, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 bg-[#161A0E] border border-[#8CB34A]/40 p-3 rounded-xl shadow-sm text-left"
                  >
                    {prize.image ? (
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#0D0D0B] flex-shrink-0 border border-[#2D3C13]">
                        <Image
                          src={prize.image}
                          alt={prize.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-[#1A230A] border border-[#43581E] flex items-center justify-center flex-shrink-0 text-xl">
                        🎁
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-[#1A230A] border border-[#8CB34A]/40 text-[#8CB34A] rounded-md uppercase">
                          Ticket #{prize.ticketNumber}
                        </span>
                        {prize.rrpValue && (
                          <span className="text-[10px] font-semibold text-[#B3B8AA]">
                            £{prize.rrpValue.toFixed(2)} RRP
                          </span>
                        )}
                      </div>
                      <div className="font-heading font-bold text-sm sm:text-base text-[#E8EDD4] truncate">
                        {prize.title}
                      </div>
                      {prize.raffleTitle && (
                        <div className="text-[11px] text-[#72943A] truncate font-sans">
                          {prize.raffleTitle}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Inner shadow overlay for roller effect */}
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_15px_15px_-10px_rgba(0,0,0,0.8),inset_0_-15px_15px_-10px_rgba(0,0,0,0.8)]" />
          </div>

          <p className="font-sans text-xs text-[#888D82] mb-6 leading-relaxed">
            Click &ldquo;Claim Prize&rdquo; below to confirm your winnings. Our compliance team will
            verify your account and coordinate tracked dispatch.
          </p>

          <button
            onClick={handleClaimClick}
            disabled={stage === "rolling" || isClaiming}
            className={`w-full h-13 rounded-xl font-heading font-bold text-[15px] uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${
              stage === "rolling" || isClaiming
                ? "bg-[#1A230A] text-[#43581E] cursor-not-allowed border border-[#2D3C13]"
                : "bg-gradient-to-r from-[#72943A] to-[#8CB34A] hover:from-[#8CB34A] hover:to-[#A0D056] text-[#0D0D0B] shadow-[0_0_25px_rgba(140,179,74,0.4)] hover:shadow-[0_0_35px_rgba(140,179,74,0.6)] transform hover:-translate-y-0.5 cursor-pointer"
            }`}
          >
            {isClaiming ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-[#0D0D0B]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Claiming Prize...</span>
              </>
            ) : count > 1 ? (
              `Claim All ${count} Prizes`
            ) : (
              "Claim Prize"
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
