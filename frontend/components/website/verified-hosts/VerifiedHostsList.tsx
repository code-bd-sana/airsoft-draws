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
    <div>
      {/* A-Z Filter */}
      <div className="flex flex-wrap items-center gap-2 mb-10">
        <button
          onClick={() => setActiveLetter("ALL")}
          className={cn(
            "w-9 h-9 rounded-button flex items-center justify-center font-sans text-xs font-semibold transition-all duration-200 cursor-pointer select-none",
            activeLetter === "ALL"
              ? "bg-primary text-primary-text"
              : "bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-border-medium"
          )}
        >
          All
        </button>
        {ALPHABET.map((letter) => (
          <button
            key={letter}
            onClick={() => setActiveLetter(letter)}
            className={cn(
              "w-9 h-9 rounded-button flex items-center justify-center font-sans text-xs font-semibold transition-all duration-200 cursor-pointer select-none",
              activeLetter === letter
                ? "bg-primary text-primary-text"
                : "bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-border-medium"
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
        <div className="text-center py-16 bg-surface border border-border border-dashed rounded-card max-w-md mx-auto">
          <h3 className="font-heading font-bold text-base text-text-primary mb-1">
            No Hosts Found
          </h3>
          <p className="font-sans text-xs text-text-muted">
            There are no verified hosts starting with the letter {activeLetter}.
          </p>
        </div>
      )}
    </div>
  );
}
