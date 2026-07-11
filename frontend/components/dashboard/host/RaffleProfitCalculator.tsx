"use client";

import React, { useState } from "react";
import { cn } from "../../../lib/utils";

export default function RaffleProfitCalculator() {
  const [ticketPrice, setTicketPrice] = useState("5");
  const [totalTickets, setTotalTickets] = useState("500");
  const [costOfPrize, setCostOfPrize] = useState("350");
  const [commissionRate, setCommissionRate] = useState("10");

  const [grossRevenue, setGrossRevenue] = useState<number | null>(null);
  const [netProfit, setNetProfit] = useState<number | null>(null);

  const handleCalculate = () => {
    const price = parseFloat(ticketPrice) || 0;
    const tickets = parseFloat(totalTickets) || 0;
    const prize = parseFloat(costOfPrize) || 0;
    const commission = parseFloat(commissionRate) || 0;

    const gross = price * tickets;
    const commissionAmount = gross * (commission / 100);
    const net = gross - prize - commissionAmount;

    setGrossRevenue(gross);
    setNetProfit(net);
  };

  return (
    <div className="bg-[#161810] border border-[#2d3c13] rounded-[16px] p-[25px] w-full flex flex-col gap-[16px] h-[362px] shrink-0 xl:w-[635px]">
      <div className="w-full">
        <h2 className="font-heading font-bold text-[16px] leading-[normal] text-[#e8edd4]">
          Raffle Profit Calculator
        </h2>
      </div>

      <div className="w-full flex flex-col gap-[12px]">
        {/* Row 1 */}
        <div className="flex gap-[12px] items-center">
          <div className="flex flex-col gap-[5px] flex-1">
            <label className="font-sans font-medium text-[11px] leading-[16.5px] tracking-[0.77px] uppercase text-[#5a752a]">
              Ticket Price (£)
            </label>
            <input
              type="text"
              value={ticketPrice}
              onChange={(e) => setTicketPrice(e.target.value)}
              className="bg-[#0d0d0b] border border-[#2d3c13] rounded-[8px] h-[40px] px-[13px] font-sans font-normal text-[14px] text-[#e8edd4] outline-none focus:border-[#8cb34a] transition-colors"
            />
          </div>
          <div className="flex flex-col gap-[5px] flex-1">
            <label className="font-sans font-medium text-[11px] leading-[16.5px] tracking-[0.77px] uppercase text-[#5a752a]">
              Total Tickets
            </label>
            <input
              type="text"
              value={totalTickets}
              onChange={(e) => setTotalTickets(e.target.value)}
              className="bg-[#0d0d0b] border border-[#2d3c13] rounded-[8px] h-[40px] px-[13px] font-sans font-normal text-[14px] text-[#e8edd4] outline-none focus:border-[#8cb34a] transition-colors"
            />
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex gap-[12px] items-center">
          <div className="flex flex-col gap-[5px] flex-1">
            <label className="font-sans font-medium text-[11px] leading-[16.5px] tracking-[0.77px] uppercase text-[#5a752a]">
              Cost of Prize (£)
            </label>
            <input
              type="text"
              value={costOfPrize}
              onChange={(e) => setCostOfPrize(e.target.value)}
              className="bg-[#0d0d0b] border border-[#2d3c13] rounded-[8px] h-[40px] px-[13px] font-sans font-normal text-[14px] text-[#e8edd4] outline-none focus:border-[#8cb34a] transition-colors"
            />
          </div>
          <div className="flex flex-col gap-[5px] flex-1">
            <label className="font-sans font-medium text-[11px] leading-[16.5px] tracking-[0.77px] uppercase text-[#5a752a]">
              Commission Rate (%)
            </label>
            <input
              type="text"
              value={commissionRate}
              onChange={(e) => setCommissionRate(e.target.value)}
              className="bg-[#0d0d0b] border border-[#2d3c13] rounded-[8px] h-[40px] px-[13px] font-sans font-normal text-[14px] text-[#e8edd4] outline-none focus:border-[#8cb34a] transition-colors"
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleCalculate}
        className="w-full bg-[#8cb34a] hover:bg-[#72943a] transition-colors h-[44px] rounded-[8px] flex items-center justify-center shrink-0 mt-2"
      >
        <span className="font-heading font-medium text-[14px] leading-[21px] text-[#0d0d0b]">
          Calculate
        </span>
      </button>

      <div className="border-t border-[#2d3c13] mt-auto pt-[8px] flex gap-[12px] h-[52.5px] items-center">
        <div className="flex flex-col flex-1 h-[44px] justify-between">
          <span className="font-sans font-normal text-[11px] leading-[16.5px] tracking-[0.77px] uppercase text-[#5a752a]">
            Gross Revenue
          </span>
          <span className="font-heading font-medium text-[18px] leading-[27px] text-[#a0d056]">
            {grossRevenue !== null ? `£${grossRevenue.toLocaleString()}` : "—"}
          </span>
        </div>
        <div className="flex flex-col flex-1 h-[44px] justify-between">
          <span className="font-sans font-normal text-[11px] leading-[16.5px] tracking-[0.77px] uppercase text-[#5a752a]">
            Net Profit
          </span>
          <span className="font-heading font-medium text-[18px] leading-[27px] text-[#8cb34a]">
            {netProfit !== null ? `£${netProfit.toLocaleString()}` : "—"}
          </span>
        </div>
      </div>
    </div>
  );
}
