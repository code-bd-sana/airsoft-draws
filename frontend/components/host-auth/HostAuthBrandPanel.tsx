"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "../../public/logo.png";
import { cn } from "../../lib/utils";

interface HostAuthBrandPanelProps {
  mode: "login" | "register";
  currentStep?: number;
}

export default function HostAuthBrandPanel({
  mode,
  currentStep = 1,
}: HostAuthBrandPanelProps) {
  // Trust stats for Login screen
  const trustStats = [
    {
      label: "2,400+ Draws Completed",
      icon: (
        <svg
          className="w-[18px] h-[18px] text-primary"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      ),
    },
    {
      label: "£284,600+ Paid to Hosts",
      icon: (
        <svg
          className="w-[18px] h-[18px] text-primary"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v12m-3-2.818l.268-.118a5.5 5.5 0 007.702-6.183L16.2 6.642m-7.2 9.358a5.5 5.5 0 01-3.66-4.996l.006-.05a5.5 5.5 0 018.66-4.332"
          />
        </svg>
      ),
    },
    {
      label: "Real-Time Sales Dashboard",
      icon: (
        <svg
          className="w-[18px] h-[18px] text-primary"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z"
          />
        </svg>
      ),
    },
  ];

  // Stepper tracker steps for Registration flow
  const registrationSteps = [
    { number: 1, label: "Account Details", stepIds: [1, 2] },
    { number: 2, label: "Business Information", stepIds: [3] },
    { number: 3, label: "Logo & Branding", stepIds: [4] },
    { number: 4, label: "Payout Details", stepIds: [8] },
  ];

  const getStepStatus = (stepIds: number[]) => {
    // If the active step matches any of the step's component parts
    const isActive = stepIds.includes(currentStep);
    // Find the highest step ID represented in this group
    const maxStepId = Math.max(...stepIds);
    const isCompleted = currentStep > maxStepId;

    if (isActive) return "active";
    if (isCompleted) return "completed";
    return "inactive";
  };

  return (
    <div className="bg-surface flex flex-col h-full min-h-[500px] lg:min-h-screen justify-between px-6 py-10 md:px-[80px] md:py-[64px] border-b lg:border-b-0 lg:border-r border-divider">
      {/* Top Branding Logo */}
      <div>
        <Link href="/" className="inline-block transition-transform duration-200 hover:scale-105 select-none">
          <Image
            alt="Airsoft Draws Logo"
            src={logo}
            height={85}
            width={85}
            priority
            className="object-contain"
          />
        </Link>
      </div>

      {/* Center Body Panel */}
      <div className="my-10 lg:my-auto flex flex-col gap-8 w-full max-w-lg">
        {/* Community Pill Badge */}
        <div className="self-start bg-accent-bg border border-border px-3 py-1.5 rounded-badge">
          <p className="font-sans font-medium text-[10px] md:text-xs text-text-brand tracking-wider uppercase">
            JOIN THE COMMUNITY
          </p>
        </div>

        {/* Hero Headlines */}
        <div className="flex flex-col gap-4">
          <h1 className="font-heading font-bold text-3xl md:text-[48px] text-text-primary leading-[1.1] md:leading-[1.2] tracking-wide select-none">
            {mode === "login"
              ? "Run Your Own Airsoft Competitions"
              : "Become a Verified Host"}
          </h1>
          <p className="font-sans font-normal text-sm md:text-xl text-text-secondary leading-relaxed">
            {mode === "login"
              ? "Log in to manage your raffles, track sales, and view your earnings."
              : "Apply in minutes. Our team typically reviews applications within 24 hours."}
          </p>
        </div>

        {/* Bottom Feature Details / Tracker */}
        <div>
          {mode === "login" ? (
            /* Login Trust Stats list */
            <div className="flex flex-col gap-4">
              {trustStats.map((stat, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent-bg border border-divider">
                    {stat.icon}
                  </div>
                  <span className="font-sans font-normal text-sm md:text-base text-text-primary">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            /* Registration stepper */
            <div className="flex flex-col gap-0 select-none">
              {registrationSteps.map((step, index) => {
                const status = getStepStatus(step.stepIds);
                const isLast = index === registrationSteps.length - 1;

                return (
                  <div key={step.number} className="flex gap-4">
                    {/* Visual Connector Column */}
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          "flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-300 font-heading font-semibold text-xs md:text-sm",
                          status === "active" && "bg-primary border-primary text-primary-text",
                          status === "completed" && "bg-accent-bg border-primary text-primary",
                          status === "inactive" && "bg-elevated border-border text-border-medium"
                        )}
                      >
                        {status === "completed" ? (
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        ) : (
                          step.number
                        )}
                      </div>
                      {!isLast && (
                        <div
                          className={cn(
                            "w-px h-10 transition-colors duration-300",
                            status === "completed" ? "bg-primary" : "bg-border"
                          )}
                        />
                      )}
                    </div>

                    {/* Step Label Column */}
                    <div className="pt-1.5">
                      <p
                        className={cn(
                          "font-sans text-xs md:text-sm font-medium transition-colors duration-300",
                          status === "active" && "text-text-primary font-semibold",
                          status === "completed" && "text-text-primary/70",
                          status === "inactive" && "text-border-medium"
                        )}
                      >
                        {step.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Footer Copy */}
      <div className="mt-8 lg:mt-0 pt-6 border-t border-divider/40 lg:border-t-0">
        <p className="font-sans font-normal text-[10px] md:text-[11px] text-border-medium">
          © {new Date().getFullYear()} Airsoft Draws · Privacy Policy · Terms
        </p>
      </div>
    </div>
  );
}
