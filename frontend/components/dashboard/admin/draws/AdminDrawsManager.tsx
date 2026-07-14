"use client";

import React, { useState } from "react";
import DrawsInfoCards from "./DrawsInfoCards";
import DrawsTable from "./DrawsTable";
import LiveDrawMonitor from "./LiveDrawMonitor";
import DrawDetailsPanel from "./DrawDetailsPanel";
import { useQuery } from "@tanstack/react-query";
import { raffleService, Raffle } from "../../../../services/raffle.service";

export default function AdminDrawsManager() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedDraw, setSelectedDraw] = useState<Raffle | null>(null);

  const filters = ["All", "Upcoming Draws", "In Progress", "Completed"];

  const getStatusQuery = (filter: string) => {
    switch (filter) {
      case "Upcoming Draws": return "Pending";
      case "In Progress": return "Live";
      case "Completed": return "Ended";
      default: return "All";
    }
  };

  const { data: drawsResponse, isLoading } = useQuery({
    queryKey: ["adminRaffles", activeFilter],
    queryFn: () => raffleService.getAdminAllRaffles({ status: getStatusQuery(activeFilter) }),
  });

  const draws = drawsResponse?.data || [];

  return (
    <div className="flex flex-col gap-6 w-full animate-fadeIn">
      
      {/* Top Filter Pills */}
      <div className="flex items-center gap-2 mb-2">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => {
              setActiveFilter(filter);
              setSelectedDraw(null); // Reset selection on filter change
            }}
            className={`px-4 py-2 rounded-[8px] font-sans font-medium text-[12px] transition-colors ${
              activeFilter === filter
                ? "bg-transparent border border-[#8CB34A] text-[#E8EDD4]"
                : "bg-transparent border border-[#2D3C13] text-[#72943A] hover:bg-[#1A230A] hover:text-[#A0D056]"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Info Cards */}
      <DrawsInfoCards />

      {/* Main Table */}
      {isLoading ? (
        <div className="text-[#E8EDD4] py-8 text-center">Loading...</div>
      ) : (
        <DrawsTable draws={draws} onSelectDraw={setSelectedDraw} />
      )}

      {/* Expanded Details Panel (conditional) */}
      {selectedDraw && (
        <DrawDetailsPanel 
          draw={selectedDraw} 
          onClose={() => setSelectedDraw(null)} 
        />
      )}

    </div>
  );
}
