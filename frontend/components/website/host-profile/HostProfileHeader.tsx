"use client";

import React from "react";

interface HostProfileHeaderProps {
  name: string;
  bio: string;
  logo: string;
  isVerified: boolean;
  drawsHosted: number;
  rating: number;
  memberSince: number;
}

export default function HostProfileHeader({
  name,
  bio,
  logo,
  isVerified,
  drawsHosted,
  rating,
  memberSince
}: HostProfileHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[#2D3C13]">
      <div className="flex items-center gap-5">
        <div className="w-[88px] h-[88px] rounded-full bg-[#1A230A] border border-[#43581E] flex items-center justify-center shrink-0">
          <span className="font-heading font-bold text-[#8CB34A] text-[32px]">{logo}</span>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h1 className="font-heading font-bold text-[28px] text-[#E8EDD4] tracking-tight">{name}</h1>
            {isVerified && (
              <span className="bg-[#8CB34A] text-[#0D0D0B] px-2 py-0.5 rounded-[4px] text-[11px] font-bold uppercase tracking-wide flex items-center gap-1">
                Verified
              </span>
            )}
          </div>
          <p className="font-sans text-[14px] text-[#72943A] max-w-[500px]">
            {bio}
          </p>
          <div className="flex items-center gap-4 mt-1">
            <span className="font-sans text-[12px] text-[#A0D056] font-medium tracking-wide flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-[#8CB34A] rounded-full" />
              {drawsHosted} Draws Hosted
            </span>
            <span className="font-sans text-[12px] text-[#A0D056] font-medium tracking-wide flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-[#8CB34A] rounded-full" />
              {rating} Host Rating
            </span>
            <span className="font-sans text-[12px] text-[#A0D056] font-medium tracking-wide flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-[#8CB34A] rounded-full" />
              Member since {memberSince}
            </span>
          </div>
        </div>
      </div>

      {/* <div className="flex items-center gap-3 w-full md:w-auto">
        <button className="flex-1 md:flex-none h-[40px] px-6 rounded-[8px] bg-transparent border border-[#2D3C13] hover:border-[#43581E] text-[#E8EDD4] font-sans font-medium text-[13px] transition-colors flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
          </svg>
          Follow Host
        </button>
        <button className="flex-1 md:flex-none h-[40px] px-6 rounded-[8px] bg-transparent border border-[#2D3C13] hover:border-[#43581E] text-[#E8EDD4] font-sans font-medium text-[13px] transition-colors flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.43 3 11.996c0 2.29.9 4.35 2.37 5.865a8.471 8.471 0 0 0 1.25.992l1.62.972.18 1.8a18.3 18.3 0 0 0 3.58 0l.18-1.8.21-.108a9.488 9.488 0 0 0 2.58-.936c.15-.09.3-.18.45-.288Z" />
          </svg>
          Contact
        </button>
      </div> */}
    </div>
  );
}
