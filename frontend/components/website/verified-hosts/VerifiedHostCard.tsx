import React from "react";
import Link from "next/link";
import { VerifiedHost } from "../../../types/host.types";

interface VerifiedHostCardProps {
  host: VerifiedHost;
}

export default function VerifiedHostCard({ host }: VerifiedHostCardProps) {
  return (
    <Link href={`/verified-hosts/${host.slug}`} className="block">
      <div className="bg-[#161810] border border-border rounded-[14px] p-5 hover:border-border-medium hover:shadow-glow transition-all duration-300 w-full min-h-[160px] flex flex-col justify-between">
        <div className="flex items-start gap-4">
          {/* Logo Placeholder */}
          <div className="w-12 h-12 rounded-full bg-accent-bg border border-border flex items-center justify-center font-heading font-bold text-xl text-text-brand shrink-0">
            {host.logo || host.name.charAt(0)}
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-semibold text-text-primary text-base">
                {host.name}
              </h3>
              {host.isVerified && (
                <span className="bg-primary text-primary-text px-1.5 py-0.5 rounded-badge text-[10px] font-semibold flex items-center select-none font-sans">
                  ✓ Verified
                </span>
              )}
            </div>
            
            <span className="font-sans text-xs text-text-muted mt-1 line-clamp-2">
              {host.description}
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4 border-t border-divider pt-4">
          <div className="flex items-center gap-4 text-xs font-sans text-text-secondary">
            <span>{host.competitionCount} Competitions</span>
            {host.averageRating && (
              <span className="flex items-center gap-1">
                <span className="text-[#eab308]">★</span> {host.averageRating}
              </span>
            )}
          </div>
          <span className="text-text-brand font-semibold text-xs group-hover:text-primary transition-colors">
            View Profile →
          </span>
        </div>
      </div>
    </Link>
  );
}
