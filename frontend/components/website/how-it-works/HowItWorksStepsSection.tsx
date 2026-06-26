"use client";

import React, { useState } from "react";
import { entrantSteps, hostSteps } from "../../../data/how-it-works/how-it-works-steps.data";
import { cn } from "../../../lib/utils";

/**
 * Interactive steps section allowing toggling between Entrant and Host guides.
 * Renders a responsive vertical timeline with circles and connecting vertical lines.
 */
export default function HowItWorksStepsSection() {
  const [activeTab, setActiveTab] = useState<"entrants" | "hosts">("entrants");

  const steps = activeTab === "entrants" ? entrantSteps : hostSteps;

  return (
    <section className="py-16 md:py-24 bg-bg">
      <div className="container-custom">
        {/* Tab Swapper Segment Capsule */}
        <div className="flex justify-center mb-16">
          <div className="bg-[#161810] border border-border p-1.5 rounded-full flex gap-1.5 items-center select-none shadow-md">
            <button
              onClick={() => setActiveTab("entrants")}
              className={cn(
                "px-6 py-2.5 rounded-full font-heading text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer",
                activeTab === "entrants"
                  ? "bg-primary text-primary-text shadow-md"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              I Want to Enter Draws
            </button>
            <button
              onClick={() => setActiveTab("hosts")}
              className={cn(
                "px-6 py-2.5 rounded-full font-heading text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer",
                activeTab === "hosts"
                  ? "bg-primary text-primary-text shadow-md"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              I Want to Host Draws
            </button>
          </div>
        </div>

        {/* Timeline Layout */}
        <div className="max-w-5xl mx-auto px-4">
          <div className="relative pl-14 sm:pl-20">
            {/* Connecting Vertical Green Line */}
            <div className="absolute left-[27px] sm:left-[27px] top-[28px] bottom-[28px] w-px bg-border" />

            {/* List of Timeline Steps */}
            <div className="flex flex-col gap-8 sm:gap-10">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className="relative flex flex-col sm:flex-row gap-4 sm:gap-6 items-start group"
                >
                  {/* Circular Number Indicator */}
                  <div className="absolute left-[-56px] sm:left-[-80px] z-10 flex-shrink-0 w-14 h-14 rounded-full bg-accent-bg border border-border-medium flex items-center justify-center font-heading text-lg font-medium text-text-brand select-none group-hover:border-primary transition-colors duration-300">
                    {String(step.stepNumber).padStart(2, "0")}
                  </div>

                  {/* Step Description Card */}
                  <div className="w-full bg-[#161810] border border-border rounded-card p-6 sm:p-8 hover:border-border-medium transition-all duration-300 shadow-card hover:shadow-glow">
                    <h3 className="font-heading font-semibold text-lg md:text-xl text-text-primary mb-2">
                      {step.title}
                    </h3>
                    <p className="font-sans text-xs md:text-sm text-text-muted leading-relaxed max-w-[933px]">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
