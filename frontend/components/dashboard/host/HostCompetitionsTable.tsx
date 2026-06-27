import React from "react";
import { hostRecentCompetitions } from "../../../data/dashboard/host-dashboard.data";
import Image from "next/image";

export default function HostCompetitionsTable() {
  return (
    <div className="bg-[#161810] border border-[#2d3c13] rounded-[16px] p-[25px] w-full flex flex-col min-h-[362px]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading font-bold text-[16px] leading-[normal] text-[#e8edd4]">
          Recent Competitions
        </h2>
        <button className="text-[#8cb34a] font-sans font-medium text-[13px] hover:underline">
          View All
        </button>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr className="border-b border-[#2d3c13]">
              <th className="pb-3 font-sans font-medium text-[11px] uppercase tracking-wider text-[#5a752a]">Competition</th>
              <th className="pb-3 font-sans font-medium text-[11px] uppercase tracking-wider text-[#5a752a]">Status</th>
              <th className="pb-3 font-sans font-medium text-[11px] uppercase tracking-wider text-[#5a752a]">Sales</th>
              <th className="pb-3 font-sans font-medium text-[11px] uppercase tracking-wider text-[#5a752a] text-right">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {hostRecentCompetitions.map((comp) => {
              const progress = Math.round((comp.soldTickets / comp.totalTickets) * 100);
              return (
                <tr key={comp.id} className="border-b border-[#2d3c13] last:border-0 hover:bg-[#1a230a]/30 transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-[40px] h-[40px] rounded-[6px] overflow-hidden bg-[#1a230a] shrink-0">
                         {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={comp.image} alt={comp.title} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-sans font-medium text-[14px] text-[#e8edd4] line-clamp-1 max-w-[200px]">
                        {comp.title}
                      </span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={`inline-flex items-center px-[8px] py-[3px] rounded-full text-[10px] font-bold uppercase tracking-wide ${
                      comp.status === "live" 
                        ? "bg-[#1a230a] text-[#8cb34a] border border-[#8cb34a]/30" 
                        : "bg-[#161810] text-[#72943a] border border-[#2d3c13]"
                    }`}>
                      {comp.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex flex-col gap-1 w-[120px]">
                      <div className="flex items-center justify-between font-sans text-[12px]">
                        <span className="text-[#e8edd4] font-medium">{progress}%</span>
                        <span className="text-[#72943a]">{comp.soldTickets}/{comp.totalTickets}</span>
                      </div>
                      <div className="w-full h-[4px] bg-[#2d3c13] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#8cb34a] rounded-full" 
                          style={{ width: `${progress}%` }} 
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-right">
                    <span className="font-heading font-bold text-[14px] text-[#e8edd4]">
                      £{comp.revenue.toLocaleString()}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
