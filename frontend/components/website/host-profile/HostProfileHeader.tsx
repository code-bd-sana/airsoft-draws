"use client";

import React from "react";

interface HostProfileHeaderProps {
  name: string;
  bio?: string | null;
  logo?: string | null;
  banner?: string | null;
  phone?: string | null;
  address?: string | null;
  vatNumber?: string | null;
  isVerified: boolean;
  drawsHosted: number;
  rating: number;
  memberSince: number;
}

export default function HostProfileHeader({
  name,
  bio,
  logo,
  banner,
  phone,
  address,
  vatNumber,
  isVerified,
  drawsHosted,
  rating,
  memberSince,
}: HostProfileHeaderProps) {
  const isImage = (val?: string | null) =>
    Boolean(val && (val.startsWith("http") || val.startsWith("/") || val.startsWith("data:")));

  const initials = name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .join("")
    .substring(0, 2)
    .toUpperCase() || "H";

  return (
    <div className="flex flex-col w-full pb-8 border-b border-[#2D3C13]">
      {/* Banner */}
      <div className="w-full h-[180px] sm:h-[220px] md:h-[260px] rounded-[16px] overflow-hidden relative border border-[#2D3C13] bg-[#111210]">
        {isImage(banner) ? (
          <img
            src={banner!}
            alt={`${name} banner`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-[#111210] via-[#1A230A] to-[#111210] flex items-center justify-end pr-8">
            <div className="w-96 h-96 bg-[#8CB34A]/5 rounded-full blur-3xl pointer-events-none" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0B] via-transparent to-transparent opacity-80" />
      </div>

      {/* Main Profile Info Row */}
      <div className="relative px-4 sm:px-6 -mt-[45px] sm:-mt-[55px] flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
          {/* Logo / Avatar */}
          <div className="w-[90px] h-[90px] sm:w-[110px] sm:h-[110px] rounded-[18px] bg-[#141512] border-2 border-[#43581E] flex items-center justify-center shrink-0 overflow-hidden shadow-2xl relative z-10">
            {isImage(logo) ? (
              <img
                src={logo!}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="font-heading font-bold text-[#8CB34A] text-[32px] sm:text-[40px]">
                {initials}
              </span>
            )}
          </div>

          {/* Name & Basic Badges */}
          <div className="flex flex-col gap-1.5 z-10 pb-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-heading font-bold text-[26px] sm:text-[32px] text-[#E8EDD4] tracking-tight">
                {name}
              </h1>
              {isVerified && (
                <span className="bg-[#8CB34A] text-[#0D0D0B] px-2.5 py-1 rounded-[6px] text-[11px] font-bold uppercase tracking-wide flex items-center gap-1.5 shadow-[0_0_12px_rgba(140,179,74,0.25)]">
                  <span className="w-1.5 h-1.5 bg-[#0D0D0B] rounded-full" />
                  Verified Partner
                </span>
              )}
            </div>

            {/* Location & Contact under Name */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-[#72943A]">
              {address && (
                <span className="flex items-center gap-1 text-[#A0D056]">
                  <span>📍</span> {address}
                </span>
              )}
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="flex items-center gap-1 hover:text-[#E8EDD4] transition-colors"
                >
                  <span>📞</span> {phone}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Contact / Action buttons if phone is available */}
        {phone && (
          <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0 z-10">
            <a
              href={`tel:${phone}`}
              className="h-[38px] px-5 rounded-[8px] bg-[#8CB34A]/10 border border-[#8CB34A]/30 hover:bg-[#8CB34A]/20 hover:border-[#8CB34A] text-[#8CB34A] font-sans font-medium text-[13px] transition-colors flex items-center justify-center gap-2"
            >
              <span>📞</span> Contact Host
            </a>
          </div>
        )}
      </div>

      {/* Bio & Stats Row */}
      <div className="mt-6 px-4 sm:px-6 flex flex-col gap-4">
        {bio ? (
          <p className="font-sans text-[14px] sm:text-[15px] text-[#A6C47A] max-w-[750px] leading-relaxed whitespace-pre-line">
            {bio}
          </p>
        ) : (
          <p className="font-sans text-[14px] text-[#72943A] italic">
            Official verified host on Airsoft Draws.
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3 sm:gap-5 pt-2">
          <span className="font-sans text-[12px] text-[#A0D056] font-medium tracking-wide flex items-center gap-1.5 bg-[#141512] border border-[#2D3C13] px-3 py-1.5 rounded-[8px]">
            <span className="w-1.5 h-1.5 bg-[#8CB34A] rounded-full" />
            {drawsHosted} Draws Hosted
          </span>
          <span className="font-sans text-[12px] text-[#A0D056] font-medium tracking-wide flex items-center gap-1.5 bg-[#141512] border border-[#2D3C13] px-3 py-1.5 rounded-[8px]">
            <span className="text-[#8CB34A]">★</span>
            {rating ? Number(rating).toFixed(1) : "5.0"} Host Rating
          </span>
          <span className="font-sans text-[12px] text-[#A0D056] font-medium tracking-wide flex items-center gap-1.5 bg-[#141512] border border-[#2D3C13] px-3 py-1.5 rounded-[8px]">
            <span className="w-1.5 h-1.5 bg-[#8CB34A] rounded-full" />
            Member since {memberSince}
          </span>
          {vatNumber && (
            <span className="font-sans text-[12px] text-[#72943A] font-medium tracking-wide flex items-center gap-1.5 bg-[#141512] border border-[#2D3C13] px-3 py-1.5 rounded-[8px]">
              VAT: {vatNumber}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
