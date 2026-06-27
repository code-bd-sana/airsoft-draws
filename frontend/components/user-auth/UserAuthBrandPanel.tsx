"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "../../public/logo.png";

interface UserAuthBrandPanelProps {
  mode: "login" | "register" | "forgot" | "reset" | "verify";
}

export default function UserAuthBrandPanel({ mode }: UserAuthBrandPanelProps) {
  // Trust stats for Customer screens
  const trustStats = [
    {
      label: "100% Secure & Compliant Draws",
      icon: (
        <svg
          className="w-[18px] h-[18px] text-primary"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      ),
    },
    {
      label: "Instant Winner Notifications",
      icon: (
        <svg
          className="w-[18px] h-[18px] text-primary"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "Verified Hosts & Premium Prizes",
      icon: (
        <svg
          className="w-[18px] h-[18px] text-primary"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499c.172-.468.83-.468 1.002 0l1.968 5.378 5.674.526c.499.046.7.66.321 1.002l-4.27 3.863 1.34 5.578c.118.49-.413.876-.843.614L12 18.064l-4.832 2.923c-.43.262-.961-.124-.843-.614l1.34-5.578-4.27-3.863c-.379-.342-.178-.956.321-1.002l5.674-.526 1.968-5.378z" />
        </svg>
      ),
    },
  ];

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
            Win Premium Airsoft Gear
          </h1>
          <p className="font-sans font-normal text-sm md:text-xl text-text-secondary leading-relaxed">
            Create your free account to enter draws, track ticket purchases, and view winners.
          </p>
        </div>

        {/* Bottom Feature Details / Tracker */}
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
