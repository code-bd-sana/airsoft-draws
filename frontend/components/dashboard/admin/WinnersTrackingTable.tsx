"use client";

import React, { useState } from "react";
import VerifyWinnerModal from "./VerifyWinnerModal";

export interface WinnerData {
  id: string;
  name: string;
  initials: string;
  competition: string;
  ticketNum: string;
  drawDate: string;
  prizeValue: string;
  status: string;
}

const MOCK_WINNERS: WinnerData[] = [
  { id: "1", name: "James Thornton", initials: "JT", competition: "Tactical Pistol Set", ticketNum: "#002947", drawDate: "20 May 2025", prizeValue: "£125.00", status: "Prize Delivered" },
  { id: "2", name: "Emma Clarke", initials: "EC", competition: "Battle Ready Helmet", ticketNum: "#002242", drawDate: "12 Apr 2025", prizeValue: "£85.00", status: "Published" },
  { id: "3", name: "Sarah Mitchell", initials: "SM", competition: "VFC HK416 Bundle", ticketNum: "#001850", drawDate: "10 Mar 2025", prizeValue: "£340.00", status: "Verified" },
  { id: "4", name: "Noah Williams", initials: "NW", competition: "Ghillie Suit", ticketNum: "#000881", drawDate: "1 Mar 2025", prizeValue: "£200.00", status: "Pending Verification" },
];

export default function WinnersTrackingTable() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWinner, setSelectedWinner] = useState<WinnerData | null>(null);

  const filters = ["All", "Pending Verification", "Verified & Published", "Prize Delivered"];

  const handleVerify = (winner: WinnerData) => {
    setSelectedWinner(winner);
    setIsModalOpen(true);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Prize Delivered":
      case "Published":
      case "Verified":
        return "border-[#4ADE80]/30 bg-[#083b18] text-[#4ADE80]";
      case "Pending Verification":
        return "border-[#D97706]/30 bg-[#78350F] text-[#F59E0B]";
      default:
        return "border-[#2D3C13] bg-[#111210] text-[#72943A]";
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full mt-4">
      
      {/* Top Filter Pills */}
      <div className="flex items-center gap-2">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
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

      {/* Table Container */}
      <div className="w-full bg-[#161810] border border-[#2D3C13] rounded-[16px] overflow-hidden overflow-x-auto mt-2">
        <table className="w-full min-w-[1050px] text-left border-collapse">
          <thead>
            <tr className="border-b border-[#2D3C13] bg-[#111210]">
              <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[18%]">WINNER</th>
              <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[18%]">COMPETITION WON</th>
              <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[12%] text-center">TICKET #</th>
              <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[12%] text-center">DRAW DATE</th>
              <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[12%] text-center">PRIZE VALUE</th>
              <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[15%] text-center">STATUS</th>
              <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[13%] text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_WINNERS.map((winner, i) => (
              <tr key={winner.id} className={`${i !== MOCK_WINNERS.length - 1 ? 'border-b border-[#2D3C13]' : ''} hover:bg-[#1A230A] transition-colors`}>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#1A230A] border border-[#43581E] flex items-center justify-center shrink-0">
                      <span className="font-sans font-medium text-[10px] text-[#8CB34A]">{winner.initials}</span>
                    </div>
                    <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">{winner.name}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="font-sans text-[13px] text-[#72943A]">{winner.competition}</span>
                </td>
                <td className="py-4 px-6 text-center">
                  <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">{winner.ticketNum}</span>
                </td>
                <td className="py-4 px-6 text-center">
                  <span className="font-sans text-[13px] text-[#72943A]">{winner.drawDate}</span>
                </td>
                <td className="py-4 px-6 text-center">
                  <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">{winner.prizeValue}</span>
                </td>
                <td className="py-4 px-6 text-center">
                  <span className={`px-3 py-1 rounded-full border font-sans font-medium text-[10px] whitespace-nowrap ${getStatusStyle(winner.status)}`}>
                    {winner.status}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-end gap-3">
                    {winner.status === "Pending Verification" && (
                      <button 
                        onClick={() => handleVerify(winner)}
                        className="h-[32px] px-5 rounded-[8px] bg-[#8CB34A] hover:bg-[#A0D056] text-[#0D0D0B] font-heading font-medium text-[12px] transition-colors"
                      >
                        Verify
                      </button>
                    )}
                    {winner.status === "Published" && (
                      <button className="h-[32px] px-5 rounded-[8px] bg-transparent border border-[#2D3C13] text-[#72943A] font-heading font-medium text-[12px] cursor-not-allowed opacity-50">
                        Publish
                      </button>
                    )}
                    {winner.status === "Prize Delivered" && (
                      <button className="h-[32px] px-4 rounded-[8px] bg-transparent border border-[#2D3C13] text-[#72943A] font-heading font-medium text-[12px] cursor-not-allowed opacity-50">
                        Mark Delivered
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <VerifyWinnerModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        winner={selectedWinner} 
      />
    </div>
  );
}
