"use client";

import React, { useEffect, useState } from "react";

interface WinAnimationModalProps {
  isOpen: boolean;
  onClose: () => void;
  prizes: Array<{ title: string; ticketNumber: number }>;
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
    <div className="flex gap-2 items-center justify-center font-heading text-[40px] text-[#8CB34A] blur-[0.5px] opacity-80">
      {numbers.map((num, i) => (
        <div key={i} className="w-[50px] text-center bg-[#1A230A] rounded-lg py-2 border border-[#8CB34A]/30 shadow-inner">
          {num}
        </div>
      ))}
    </div>
  );
}

export default function WinAnimationModal({ isOpen, onClose, prizes }: WinAnimationModalProps) {
  const [stage, setStage] = useState<"rolling" | "revealed">("rolling");

  useEffect(() => {
    if (isOpen) {
      setStage("rolling");
      // Simulate the slot machine / roller delay (e.g., 2.5 seconds)
      const timer = setTimeout(() => {
        setStage("revealed");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative bg-[#111210] border border-[#72943A]/50 p-1 rounded-[24px] shadow-[0_0_40px_rgba(114,148,58,0.2)] max-w-md w-[90%] overflow-hidden animate-in zoom-in-95 duration-500">
        
        {/* Animated Glowing Border Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#8CB34A] via-[#E8EDD4] to-[#5A752A] opacity-20 animate-[spin_4s_linear_infinite]" />
        
        <div className="relative bg-[#111210] p-8 rounded-[22px] flex flex-col items-center text-center z-10 h-full w-full">
          
          {/* Header Icon */}
          <div className="w-16 h-16 rounded-full bg-[#1A230A] border border-[#2D3C13] flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(140,179,74,0.3)]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-[#8CB34A]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
            </svg>
          </div>

          <h2 className="font-heading font-bold text-3xl text-[#E8EDD4] mb-2 tracking-wide uppercase">
            {stage === "rolling" ? "Checking Tickets..." : "Congratulations!"}
          </h2>
          
          <p className="font-sans text-[13px] text-[#72943A] mb-8 uppercase tracking-[1.5px] font-medium">
            {stage === "rolling" ? "Locating Instant Wins" : "You won an Instant Prize!"}
          </p>

          {/* Roller / Prize Display */}
          <div className="w-full bg-[#0D0D0B] border border-[#2D3C13] rounded-xl p-6 mb-8 relative overflow-hidden h-[120px] flex items-center justify-center">
            
            {/* The Slot Machine "Spinning" Effect */}
            {stage === "rolling" ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <FastRollingNumbers />
              </div>
            ) : (
              <div className="w-full flex flex-col gap-3 max-h-[100px] overflow-y-auto custom-scrollbar animate-in slide-in-from-bottom-4 duration-500 fade-in">
                {prizes.map((prize, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-[#1A230A] border border-[#8CB34A]/30 p-3 rounded-lg shadow-sm">
                    <span className="font-sans text-[#72943A] text-[11px] uppercase font-bold tracking-wide">
                      Ticket #{prize.ticketNumber}
                    </span>
                    <span className="font-heading font-semibold text-[#8CB34A] text-lg">
                      {prize.title}
                    </span>
                  </div>
                ))}
              </div>
            )}
            
            {/* Inner shadow overlay for roller effect */}
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_20px_20px_-10px_rgba(0,0,0,0.8),inset_0_-20px_20px_-10px_rgba(0,0,0,0.8)]" />
          </div>

          <button 
            onClick={onClose}
            disabled={stage === "rolling"}
            className={`w-full h-12 rounded-[10px] font-heading font-medium text-[15px] uppercase tracking-wider transition-all duration-300 ${
              stage === "rolling" 
                ? "bg-[#1A230A] text-[#2D3C13] cursor-not-allowed border border-[#2D3C13]"
                : "bg-[#8CB34A] hover:bg-[#A0D056] text-[#0D0D0B] shadow-[0_0_20px_rgba(140,179,74,0.3)] hover:shadow-[0_0_30px_rgba(140,179,74,0.5)] transform hover:-translate-y-0.5"
            }`}
          >
            Claim Prize
          </button>
        </div>
      </div>
    </div>
  );
}
