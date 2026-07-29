"use client";

import React, { useState } from "react";
import FreePostalEntryModal from "./FreePostalEntryModal";
import { cn } from "../../../lib/utils";

interface FreePostalEntryButtonProps {
  raffleTitle?: string;
  variant?: "badge" | "button" | "card";
  className?: string;
}

export default function FreePostalEntryButton({
  raffleTitle,
  variant = "badge",
  className,
}: FreePostalEntryButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {variant === "badge" && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1A230A] border-2 border-[#8CB34A] text-[#A0D056] font-sans font-bold text-xs shadow-[0_0_15px_rgba(140,179,74,0.25)] hover:bg-[#2D3C13] hover:border-[#A0D056] transition-all cursor-pointer select-none",
            className
          )}
        >
          <span className="text-sm">✉️</span>
          <span>Free Postal Entry</span>
        </button>
      )}

      {variant === "button" && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={cn(
            "w-full py-2.5 px-4 rounded-xl bg-[#1A230A] border border-[#8CB34A]/60 text-[#A0D056] font-sans font-semibold text-xs hover:bg-[#2D3C13] hover:border-[#8CB34A] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm",
            className
          )}
        >
          <span className="text-sm">✉️</span>
          <span>Enter for Free by Post</span>
        </button>
      )}

      {variant === "card" && (
        <div
          onClick={() => setIsOpen(true)}
          className={cn(
            "w-full bg-[#1A230A] border-2 border-[#8CB34A] rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-[#2D3C13] transition-all shadow-[0_0_20px_rgba(140,179,74,0.2)] group",
            className
          )}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#111210] border border-[#43581E] flex items-center justify-center text-xl shrink-0">
              ✉️
            </div>
            <div>
              <h4 className="font-heading font-bold text-xs text-[#E8EDD4] group-hover:text-[#A0D056] transition-colors">
                Free Postal Entry Route (UK Law)
              </h4>
              <p className="font-sans text-[11px] text-[#72943A]">
                Equal free entry available on an unenclosed postcard.
              </p>
            </div>
          </div>
          <span className="font-sans font-bold text-xs text-[#A0D056] underline group-hover:translate-x-0.5 transition-transform shrink-0">
            View Rules &rarr;
          </span>
        </div>
      )}

      <FreePostalEntryModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        raffleTitle={raffleTitle}
      />
    </>
  );
}
