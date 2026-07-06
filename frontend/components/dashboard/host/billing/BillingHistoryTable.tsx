"use client";

import React from "react";
import { BillingHistoryItem } from "../../../../types/host-dashboard.types";

interface Props {
  history: BillingHistoryItem[];
}

export default function BillingHistoryTable({ history }: Props) {
  return (
    <div className="w-full bg-[#161810] border border-[#2d3c13] rounded-[16px] overflow-hidden flex flex-col">
      
      {/* Header */}
      <div className="p-[24px] lg:p-[32px] border-b border-[#2d3c13]">
        <h3 className="font-heading font-medium text-[16px] text-[#e8edd4]">
          Billing History
        </h3>
      </div>

      {/* Table Content */}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-[#2d3c13] bg-[#0d0d0b]">
              <th className="py-[16px] px-[24px] lg:px-[32px] text-left font-sans font-medium text-[11px] text-[#5a752a] uppercase tracking-wider">
                Date
              </th>
              <th className="py-[16px] px-[24px] lg:px-[32px] text-left font-sans font-medium text-[11px] text-[#5a752a] uppercase tracking-wider">
                Description
              </th>
              <th className="py-[16px] px-[24px] lg:px-[32px] text-left font-sans font-medium text-[11px] text-[#5a752a] uppercase tracking-wider">
                Amount
              </th>
              <th className="py-[16px] px-[24px] lg:px-[32px] text-left font-sans font-medium text-[11px] text-[#5a752a] uppercase tracking-wider">
                Invoice
              </th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, index) => (
              <tr 
                key={item.id} 
                className={`
                  hover:bg-[#1a230a] transition-colors
                  ${index !== history.length - 1 ? 'border-b border-[#2d3c13]/50' : ''}
                `}
              >
                <td className="py-[20px] px-[24px] lg:px-[32px] font-sans font-medium text-[13px] text-[#72943a]">
                  {item.date}
                </td>
                <td className="py-[20px] px-[24px] lg:px-[32px] font-sans font-normal text-[13px] text-[#b3b8aa]">
                  {item.description}
                </td>
                <td className="py-[20px] px-[24px] lg:px-[32px] font-sans font-medium text-[13px] text-[#8cb34a]">
                  £{item.amount.toFixed(2)}
                </td>
                <td className="py-[20px] px-[24px] lg:px-[32px] font-sans font-medium text-[12px] text-[#5a752a]">
                  {item.invoice || item.id}
                </td>
              </tr>
            ))}
            {history.length === 0 && (
              <tr>
                <td colSpan={4} className="py-[32px] text-center font-sans text-[14px] text-[#5a752a]">
                  No billing history available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
    </div>
  );
}
