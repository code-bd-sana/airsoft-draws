"use client";

import React, { useState } from "react";
import { VerifiedHost } from "../../../types/host.types";
import VerifiedHostCard from "./VerifiedHostCard";
import { cn } from "../../../lib/utils";

interface VerifiedHostsListProps {
  hosts: VerifiedHost[];
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function VerifiedHostsList({ hosts }: VerifiedHostsListProps) {
  const [activeLetter, setActiveLetter] = useState<string>("ALL");

  const filteredHosts = activeLetter === "ALL" 
    ? hosts 
    : hosts.filter(host => host.name.toUpperCase().startsWith(activeLetter));

  return (
    <div className="flex flex-col w-full">
      {/* A-Z Filter */}
      <div className="flex flex-wrap items-center gap-2 mb-10 pb-6 border-b border-[#2D3C13]">
        <button
          onClick={() => setActiveLetter("ALL")}
          className={cn(
            "h-[36px] px-4 rounded-[8px] font-sans text-[13px] font-medium transition-colors duration-200 cursor-pointer select-none",
            activeLetter === "ALL"
              ? "bg-[#8CB34A] text-[#0D0D0B] shadow-[0_0_15px_rgba(140,179,74,0.15)]"
              : "bg-transparent border border-[#2D3C13] text-[#72943A] hover:text-[#E8EDD4] hover:border-[#43581E]"
          )}
        >
          All
        </button>
        {ALPHABET.map((letter) => (
          <button
            key={letter}
            onClick={() => setActiveLetter(letter)}
            className={cn(
              "w-[36px] h-[36px] rounded-[8px] flex items-center justify-center font-sans text-[13px] font-medium transition-colors duration-200 cursor-pointer select-none",
              activeLetter === letter
                ? "bg-[#8CB34A] text-[#0D0D0B] shadow-[0_0_15px_rgba(140,179,74,0.15)]"
                : "bg-transparent border border-[#2D3C13] text-[#72943A] hover:text-[#E8EDD4] hover:border-[#43581E]"
            )}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filteredHosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredHosts.map((host) => (
            <VerifiedHostCard key={host.id} host={host} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3 bg-[#111210] border border-[#2D3C13] rounded-[16px] w-full max-w-[600px] mx-auto">
          <span className="text-[32px]">🔍</span>
          <h3 className="font-heading font-medium text-[18px] text-[#E8EDD4]">No Hosts Found</h3>
          <p className="font-sans text-[13px] text-[#72943A] max-w-[300px]">
            We couldn&apos;t find any verified hosts starting with the letter &quot;{activeLetter}&quot;. Try selecting &quot;All&quot; to see the full directory.
          </p>
        </div>
      )}
    </div>
  );
}
