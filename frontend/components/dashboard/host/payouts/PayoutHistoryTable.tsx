"use client";

import React from "react";
import { PayoutHistoryItem } from "../../../../types/host-dashboard.types";
import { cn } from "../../../../lib/utils";

interface Props {
  history: PayoutHistoryItem[];
}

export default function PayoutHistoryTable({ history }: Props) {
  return (
    <div className="w-full bg-[#161810] border border-[#2d3c13] rounded-[16px] overflow-hidden flex flex-col mt-[8px]">
      
      {/* Header */}
      <div className="p-[24px] border-b border-[#2d3c13] flex flex-col gap-[8px]">
        <h3 className="font-heading font-medium text-[18px] text-[#e8edd4]">
          Recent Transactions
        </h3>
        <p className="font-sans font-normal text-[14px] text-[#b3b8aa]">
          A record of all your successful and processing payouts.
        </p>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto min-h-[300px]">
        <table className="w-full min-w-[900px] text-left border-collapse">
          <thead>
            <tr className="border-b border-[#2d3c13] bg-[#0d0d0b]/50">
              <th className="py-[16px] px-[24px] font-sans font-medium text-[12px] text-[#5a752a] uppercase tracking-wider">
                Date
              </th>
              <th className="py-[16px] px-[24px] font-sans font-medium text-[12px] text-[#5a752a] uppercase tracking-wider">
                Gross Amount
              </th>
              <th className="py-[16px] px-[24px] font-sans font-medium text-[12px] text-[#5a752a] uppercase tracking-wider">
                Fee Deducted
              </th>
              <th className="py-[16px] px-[24px] font-sans font-medium text-[12px] text-[#5a752a] uppercase tracking-wider">
                Net Amount
              </th>
              <th className="py-[16px] px-[24px] font-sans font-medium text-[12px] text-[#5a752a] uppercase tracking-wider">
                Method
              </th>
              <th className="py-[16px] px-[24px] font-sans font-medium text-[12px] text-[#5a752a] uppercase tracking-wider">
                Status
              </th>
              <th className="py-[16px] px-[24px] font-sans font-medium text-[12px] text-[#5a752a] uppercase tracking-wider">
                Reference ID
              </th>
            </tr>
          </thead>
          <tbody>
            {history.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-[48px] text-center text-[#5a752a] font-sans text-[14px]">
                  No payout transactions found.
                </td>
              </tr>
            ) : (
              history.map((item, index) => (
                <tr 
                  key={item.id}
                  className={cn(
                    "group transition-colors hover:bg-[#1a230a]",
                    index !== history.length - 1 && "border-b border-[#2d3c13]/50"
                  )}
                >
                  <td className="py-[20px] px-[24px]">
                    <span className="font-sans font-medium text-[13px] text-[#5a752a]">
                      {item.date}
                    </span>
                  </td>
                  <td className="py-[20px] px-[24px]">
                    <span className="font-heading font-medium text-[14px] text-[#e8edd4]">
                      £{item.grossAmount.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-[20px] px-[24px]">
                    <span className="font-heading font-medium text-[14px] text-[#f76b6b]">
                      £{item.feeDeducted.toFixed(2)} ({item.feePercent}%)
                    </span>
                  </td>
                  <td className="py-[20px] px-[24px]">
                    <span className="font-heading font-medium text-[14px] text-[#8cb34a]">
                      £{item.netAmount.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-[20px] px-[24px]">
                    <span className="font-sans font-medium text-[13px] text-[#b3b8aa]">
                      {item.method}
                    </span>
                  </td>
                  <td className="py-[20px] px-[24px]">
                    <div className="flex">
                      <div className={cn(
                        "inline-flex items-center px-[9px] py-[3px] rounded-full border bg-[#1a230a]",
                        item.status === "Paid" ? "border-[#2d3c13]" : "border-[#8cb34a]/30 bg-[#8cb34a]/10"
                      )}>
                        <span className={cn(
                          "font-sans font-medium text-[11px]",
                          item.status === "Paid" ? "text-[#a0d056]" : "text-[#8cb34a]"
                        )}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-[20px] px-[24px]">
                    <span className="font-sans font-medium text-[13px] text-[#5a752a]">
                      {item.referenceId}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
