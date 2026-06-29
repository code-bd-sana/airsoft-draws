import React from "react";
import Link from "next/link";
import { VerifiedHost } from "../../../types/host.types";

interface VerifiedHostCardProps {
  host: VerifiedHost;
}

export default function VerifiedHostCard({ host }: VerifiedHostCardProps) {
  return (
    <Link href={`/hosts/${host.slug}`} className="block h-full">
      <div className="bg-[#111210] border border-[#2D3C13] rounded-[16px] p-6 hover:border-[#43581E] hover:bg-[#161810] transition-all duration-300 w-full min-h-[200px] flex flex-col justify-between group cursor-pointer relative overflow-hidden">
        
        {/* Subtle hover gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#8CB34A]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="flex flex-col gap-4 relative z-10">
          <div className="flex items-center justify-between">
            <div className="w-[56px] h-[56px] rounded-full bg-[#1A230A] border border-[#43581E] flex items-center justify-center shrink-0 shadow-sm">
              <span className="font-heading font-bold text-[#8CB34A] text-[20px]">{host.logo || host.name.charAt(0)}</span>
            </div>
            {host.isVerified && (
              <span className="bg-[#8CB34A]/10 border border-[#8CB34A]/20 text-[#8CB34A] px-2.5 py-1 rounded-[6px] text-[10px] font-bold uppercase tracking-wide flex items-center gap-1.5 shadow-[0_0_10px_rgba(140,179,74,0.1)]">
                <span className="w-1.5 h-1.5 bg-[#8CB34A] rounded-full" /> Verified
              </span>
            )}
          </div>
          
          <div className="flex flex-col gap-1.5">
            <h3 className="font-heading font-bold text-[#E8EDD4] text-[18px] group-hover:text-[#8CB34A] transition-colors">
              {host.name}
            </h3>
            <span className="font-sans text-[13px] text-[#72943A] line-clamp-2 leading-relaxed">
              {host.description}
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-6 pt-5 border-t border-[#2D3C13]/60 relative z-10">
          <div className="flex items-center gap-4 text-[12px] font-sans text-[#A0D056] font-medium">
            <span>{host.competitionCount} Competitions</span>
            {host.averageRating && (
              <span className="flex items-center gap-1.5">
                <span className="text-[#8CB34A]">★</span> {host.averageRating}
              </span>
            )}
          </div>
          <span className="text-[#8CB34A] font-semibold text-[13px] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 flex items-center gap-1">
            View Profile 
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
