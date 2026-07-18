"use client";

import React, { useState } from "react";
import { BillingCycle } from "../../../types/pricing.types";
import PricingPlanGrid from "./PricingPlanGrid";
import { cn } from "../../../lib/utils";

/**
 * Pricing hero section with billing toggle (monthly/yearly) and pricing plan cards.
 */
export default function PricingHero() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");

  return (
    <section className="relative w-full bg-[#111210] pt-32 pb-20 md:pt-36 md:pb-28 border-b border-divider">
      {/* Decorative Top Radial Glow */}
      <div className="absolute inset-x-0 top-0 h-64 bg-radial-gradient from-primary/5 to-transparent pointer-events-none" />

      <div className="container-custom relative flex flex-col items-center z-10">
        
        {/* Host Badge Label */}
        <div className="inline-flex items-center bg-[#1a230a] border border-border px-3 py-1.5 rounded-badge text-[10px] font-bold uppercase tracking-wider text-text-brand mb-4">
          FOR HOSTS
        </div>

        {/* Hero Headers */}
        <h1 className="font-heading font-bold text-3xl md:text-5xl text-text-primary leading-tight text-center tracking-tight mb-4 max-w-3xl">
          Choose Your Hosting Plan
        </h1>
        
        <p className="font-sans text-sm md:text-lg text-text-secondary text-center mb-8 max-w-xl">
          Start free, upgrade as you grow. No hidden fees.
        </p>

        {/* Custom Toggle Billing Switcher */}
        <div className="bg-elevated border border-border rounded-full p-1.5 flex items-center gap-1.5 w-fit mb-16 select-none shadow-sm">
          <button
            type="button"
            onClick={() => setBillingCycle("monthly")}
            className={cn(
              "rounded-full px-5 py-2 text-xs md:text-sm font-semibold transition-all duration-300 cursor-pointer",
              billingCycle === "monthly"
                ? "bg-primary text-primary-text shadow-sm"
                : "text-text-secondary hover:text-text-brand"
            )}
          >
            Monthly
          </button>
          
          <button
            type="button"
            onClick={() => setBillingCycle("yearly")}
            className={cn(
              "rounded-full px-5 py-2 text-xs md:text-sm font-semibold transition-all duration-300 cursor-pointer flex items-center gap-1.5",
              billingCycle === "yearly"
                ? "bg-primary text-primary-text shadow-sm"
                : "text-text-secondary hover:text-text-brand"
            )}
          >
            Yearly
            <span className={cn(
              "text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wide",
              billingCycle === "yearly"
                ? "bg-[#1a230a] text-primary"
                : "bg-accent-bg text-text-brand"
            )}>
              save 20%
            </span>
          </button>
        </div>

        {/* Render Plans Grid */}
        <PricingPlanGrid billingCycle={billingCycle} />

      </div>
    </section>
  );
}
