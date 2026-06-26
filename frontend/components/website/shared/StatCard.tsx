import React from "react";
import { StatItem } from "../../../types/homepage.types";

interface StatCardProps {
  stat: StatItem;
}

/**
 * Reusable Statistic item matching the trust counters row.
 */
export default function StatCard({ stat }: StatCardProps) {
  const { value, label } = stat;

  return (
    <div className="flex flex-col items-center justify-center p-4 text-center">
      <div className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-text-brand tracking-tight mb-2">
        {value}
      </div>
      <div className="font-sans text-xs md:text-sm text-text-muted font-medium uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}
