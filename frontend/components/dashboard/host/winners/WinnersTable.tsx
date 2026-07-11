"use client";

import React, { useState } from "react";
import { HostDrawItem } from "../../../../types/host-dashboard.types";
import { cn } from "../../../../lib/utils";
import DrawConfirmationModal from "./DrawConfirmationModal";

interface Props {
  draws: HostDrawItem[];
}

export default function WinnersTable({ draws }: Props) {
  const [activeTab, setActiveTab] = useState<"Awaiting Draw" | "Drawn">("Awaiting Draw");
  const [selectedDraw, setSelectedDraw] = useState<HostDrawItem | null>(null);
  
  const filteredDraws = draws.filter(d => d.status === activeTab);

  const handleConfirmDraw = () => {
    if (!selectedDraw) return;
    alert(`Success! 1 Winner drawn for ${selectedDraw.name}.`);
    setSelectedDraw(null);
  };

  return (
    <div className="w-full bg-[#161810] border border-[#2d3c13] rounded-[16px] overflow-hidden flex flex-col mt-[24px]">
      
      {/* Header & Tabs */}
      <div className="p-[24px] border-b border-[#2d3c13] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[16px]">
        <div>
          <h3 className="font-heading font-medium text-[18px] text-[#e8edd4]">
            Winners & Draws
          </h3>
          <p className="font-sans font-normal text-[14px] text-[#b3b8aa]">
            Manage upcoming draws and view past winners.
          </p>
        </div>
        
        <div className="flex items-center gap-[8px] bg-[#0d0d0b] p-[4px] rounded-[10px] border border-[#2d3c13]">
          <button
            onClick={() => setActiveTab("Awaiting Draw")}
            className={cn(
              "px-[16px] py-[6px] rounded-[6px] font-sans font-medium text-[13px] transition-colors",
              activeTab === "Awaiting Draw"
                ? "bg-[#2d3c13] text-[#e8edd4]"
                : "text-[#5a752a] hover:text-[#b3b8aa]"
            )}
          >
            Awaiting Draw
          </button>
          <button
            onClick={() => setActiveTab("Drawn")}
            className={cn(
              "px-[16px] py-[6px] rounded-[6px] font-sans font-medium text-[13px] transition-colors",
              activeTab === "Drawn"
                ? "bg-[#2d3c13] text-[#e8edd4]"
                : "text-[#5a752a] hover:text-[#b3b8aa]"
            )}
          >
            Drawn
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto min-h-[400px]">
        <table className="w-full min-w-[800px] text-left border-collapse">
          <thead>
            <tr className="border-b border-[#2d3c13] bg-[#0d0d0b]/50">
              <th className="py-[16px] px-[24px] font-sans font-medium text-[12px] text-[#5a752a] uppercase tracking-wider">
                Competition
              </th>
              <th className="py-[16px] px-[24px] font-sans font-medium text-[12px] text-[#5a752a] uppercase tracking-wider">
                Draw Date
              </th>
              <th className="py-[16px] px-[24px] font-sans font-medium text-[12px] text-[#5a752a] uppercase tracking-wider">
                Winner
              </th>
              <th className="py-[16px] px-[24px] text-right font-sans font-medium text-[12px] text-[#5a752a] uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredDraws.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-[48px] text-center text-[#5a752a] font-sans text-[14px]">
                  No records found in this category.
                </td>
              </tr>
            ) : (
              filteredDraws.map((draw, index) => (
                <tr 
                  key={draw.id}
                  className={cn(
                    "group transition-colors hover:bg-[#1a230a]",
                    index !== filteredDraws.length - 1 && "border-b border-[#2d3c13]/50"
                  )}
                >
                  <td className="py-[20px] px-[24px]">
                    <span className="font-sans font-medium text-[14px] text-[#e8edd4]">
                      {draw.name}
                    </span>
                  </td>
                  <td className="py-[20px] px-[24px]">
                    <span className="font-sans font-medium text-[14px] text-[#b3b8aa]">
                      {draw.drawDate}
                    </span>
                  </td>
                  <td className="py-[20px] px-[24px]">
                    {draw.winner ? (
                      <span className="inline-flex items-center gap-[8px] bg-[#8cb34a]/10 border border-[#8cb34a]/20 px-[12px] py-[4px] rounded-full">
                        <div className="w-[6px] h-[6px] rounded-full bg-[#8cb34a]" />
                        <span className="font-sans font-medium text-[13px] text-[#8cb34a]">
                          {draw.winner}
                        </span>
                      </span>
                    ) : (
                      <span className="font-sans font-medium text-[14px] text-[#5a752a] italic">
                        No winner yet
                      </span>
                    )}
                  </td>
                  <td className="py-[20px] px-[24px] text-right">
                    {draw.status === "Awaiting Draw" ? (
                      <button 
                        onClick={() => setSelectedDraw(draw)}
                        className="h-[36px] px-[16px] bg-[#8cb34a] hover:bg-[#72943a] transition-colors rounded-[6px] inline-flex items-center justify-center"
                      >
                        <span className="font-heading font-medium text-[13px] text-[#0d0d0b]">
                          Run Draw Now
                        </span>
                      </button>
                    ) : (
                      <button 
                        className="h-[36px] px-[16px] bg-[#2d3c13] hover:bg-[#3a4d19] transition-colors rounded-[6px] inline-flex items-center justify-center"
                      >
                        <span className="font-heading font-medium text-[13px] text-[#e8edd4]">
                          View Details
                        </span>
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedDraw && (
        <DrawConfirmationModal 
          draw={selectedDraw}
          isOpen={true}
          onClose={() => setSelectedDraw(null)}
          onConfirm={handleConfirmDraw}
        />
      )}
    </div>
  );
}
