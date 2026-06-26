"use client";

import React from "react";
import { cn } from "../../../lib/utils";

interface TicketQuantitySelectorProps {
  quantity: number;
  onQuantityChange: (qty: number) => void;
  maxTickets?: number;
  minTickets?: number;
}

/**
 * Quantity selector for raffle tickets.
 * Includes quick-selection buttons (1, 5, 10, 25) and plus/minus control buttons.
 */
export default function TicketQuantitySelector({
  quantity,
  onQuantityChange,
  maxTickets = 50,
  minTickets = 1,
}: TicketQuantitySelectorProps) {
  const quickPicks = [1, 5, 10, 25];

  const handleIncrement = () => {
    if (quantity < maxTickets) {
      onQuantityChange(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > minTickets) {
      onQuantityChange(quantity - 1);
    }
  };

  return (
    <div className="flex flex-col gap-3.5 w-full font-sans">
      <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
        Number of tickets
      </label>

      {/* Quick Pick Buttons Grid */}
      <div className="grid grid-cols-4 gap-2 w-full">
        {quickPicks.map((pick) => (
          <button
            key={pick}
            type="button"
            onClick={() => onQuantityChange(pick)}
            className={cn(
              "py-2 px-1 text-center font-heading text-xs font-semibold rounded-button border select-none transition-all duration-200 cursor-pointer",
              quantity === pick
                ? "bg-accent-bg border-border-medium text-[#8cb34a] shadow-glow"
                : "bg-transparent border-border text-[#5a752a] hover:border-border-medium hover:text-text-primary"
            )}
          >
            {pick}
          </button>
        ))}
      </div>

      {/* Plus/Minus Numeric Selector Container */}
      <div className="flex items-center border border-border rounded-button overflow-hidden bg-surface h-10 w-full">
        {/* Decrement Button */}
        <button
          type="button"
          onClick={handleDecrement}
          disabled={quantity <= minTickets}
          className={cn(
            "h-full w-10 flex items-center justify-center bg-accent-bg text-text-brand transition-colors cursor-pointer select-none",
            quantity <= minTickets ? "opacity-35 cursor-not-allowed" : "hover:bg-accent-bg/80"
          )}
          aria-label="Decrease ticket quantity"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={3}
            stroke="currentColor"
            className="w-3.5 h-3.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
          </svg>
        </button>

        {/* Quantity Display Box */}
        <div className="flex-grow h-full bg-[#0d0d0b] text-[#e8edd4] flex items-center justify-center font-heading font-semibold text-sm">
          {quantity}
        </div>

        {/* Increment Button */}
        <button
          type="button"
          onClick={handleIncrement}
          disabled={quantity >= maxTickets}
          className={cn(
            "h-full w-10 flex items-center justify-center bg-accent-bg text-text-brand transition-colors cursor-pointer select-none",
            quantity >= maxTickets ? "opacity-35 cursor-not-allowed" : "hover:bg-accent-bg/80"
          )}
          aria-label="Increase ticket quantity"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={3}
            stroke="currentColor"
            className="w-3.5 h-3.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      </div>
    </div>
  );
}
