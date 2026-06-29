import React from "react";

const MOCK_ENTRIES = [
  { id: "#10243", buyer: "James Thornton", initials: "JT", qty: 4, purchased: "12 Jun 2025 10:15", status: "Verified" },
  { id: "#10244", buyer: "Sarah Mitchell", initials: "SM", qty: 2, purchased: "12 Jun 2025 11:20", status: "Verified" },
  { id: "#10245", buyer: "Oliver Bennett", initials: "OB", qty: 1, purchased: "12 Jun 2025 13:00", status: "Verified" },
  { id: "#10246", buyer: "Emma Clarke", initials: "EC", qty: 4, purchased: "12 Jun 2025 13:05", status: "Verified" },
  { id: "#10247", buyer: "Noah Williams", initials: "NW", qty: 3, purchased: "12 Jun 2025 14:10", status: "Verified" },
  { id: "#10248", buyer: "Amelia Davis", initials: "AD", qty: 6, purchased: "12 Jun 2025 15:30", status: "Verified" },
];

export default function DrawEntriesTab() {
  return (
    <div className="flex flex-col gap-4 animate-fadeIn">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-heading font-medium text-[14px] text-[#E8EDD4]">
          82 Entries (420)
        </h3>
        <div className="relative w-[260px]">
          <svg className="w-4 h-4 text-[#5A752A] absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input 
            type="text" 
            placeholder="Search entrant name..." 
            className="w-full h-[36px] bg-[#0D0D0B] border border-[#2D3C13] rounded-[8px] pl-9 pr-3 text-[13px] text-[#E8EDD4] placeholder:text-[#5A752A] outline-none focus:border-[#43581E] transition-colors"
          />
        </div>
      </div>

      {/* Table */}
      <div className="w-full bg-[#111210] border border-[#2D3C13] rounded-[12px] overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[700px] text-left border-collapse">
          <thead>
            <tr className="border-b border-[#2D3C13] bg-[#0D0D0B]">
              <th className="py-3 px-5 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[15%]">TICKET #</th>
              <th className="py-3 px-5 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[30%]">BUYER</th>
              <th className="py-3 px-5 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[15%] text-center">QTY</th>
              <th className="py-3 px-5 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[25%] text-center">PURCHASED</th>
              <th className="py-3 px-5 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[15%] text-right">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_ENTRIES.map((entry, i) => (
              <tr key={entry.id} className={`${i !== MOCK_ENTRIES.length - 1 ? 'border-b border-[#2D3C13]' : ''} hover:bg-[#1A230A] transition-colors`}>
                <td className="py-3 px-5">
                  <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">{entry.id}</span>
                </td>
                <td className="py-3 px-5">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#1A230A] border border-[#43581E] flex items-center justify-center shrink-0">
                      <span className="font-sans font-medium text-[9px] text-[#8CB34A]">{entry.initials}</span>
                    </div>
                    <span className="font-sans text-[13px] text-[#E8EDD4]">{entry.buyer}</span>
                  </div>
                </td>
                <td className="py-3 px-5 text-center">
                  <span className="font-sans text-[13px] text-[#E8EDD4]">{entry.qty}</span>
                </td>
                <td className="py-3 px-5 text-center">
                  <span className="font-sans text-[12px] text-[#72943A]">{entry.purchased}</span>
                </td>
                <td className="py-3 px-5 text-right">
                  <span className="font-sans font-medium text-[12px] text-[#4ADE80]">{entry.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Footer */}
      <div className="flex items-center justify-between px-2 pt-2">
        <span className="font-sans text-[12px] text-[#5A752A]">Showing 1-6 of 82 entries</span>
        <div className="flex items-center gap-2 font-sans text-[12px] font-medium text-[#72943A]">
          <button className="hover:text-[#E8EDD4] transition-colors disabled:opacity-50">Previous</button>
          <span className="text-[#2D3C13]">|</span>
          <button className="hover:text-[#E8EDD4] transition-colors">Next</button>
        </div>
      </div>
      
    </div>
  );
}
