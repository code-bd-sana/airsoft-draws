"use client";

import React, { useState } from "react";
import ConfirmPayoutModal from "./ConfirmPayoutModal";

export interface PayoutData {
  id: string;
  host: string;
  hostInitials: string;
  amount: string;
  method: string;
  account: string;
  date: string;
  status: string;
  earningsTotal: string;
  commission: string;
  netPayout: string;
}

const MOCK_PAYOUTS: PayoutData[] = [
  { 
    id: "1", host: "Tactical Gear UK", hostInitials: "TG", amount: "£2,400.00", 
    method: "Bank Transfer", account: "Barclays ****4821", date: "15 Jun 2025", 
    status: "Pending", earningsTotal: "£12,400.00", commission: "-£1,240.00", netPayout: "£2,400.00" 
  },
  { 
    id: "2", host: "Airsoft World", hostInitials: "AW", amount: "£1,900.00", 
    method: "Bank Transfer", account: "HSBC ****1192", date: "14 Jun 2025", 
    status: "Approved", earningsTotal: "£10,000.00", commission: "-£1,000.00", netPayout: "£1,900.00" 
  },
  { 
    id: "3", host: "Elite Shooters", hostInitials: "ES", amount: "£840.00", 
    method: "PayPal", account: "payments@eliteshooters.co.uk", date: "13 Jun 2025", 
    status: "Pending", earningsTotal: "£4,000.00", commission: "-£400.00", netPayout: "£840.00" 
  },
  { 
    id: "4", host: "Strike Force Co", hostInitials: "SF", amount: "£620.00", 
    method: "Bank Transfer", account: "Lloyds ****3344", date: "12 Jun 2025", 
    status: "Rejected", earningsTotal: "£3,000.00", commission: "-£300.00", netPayout: "£620.00" 
  },
];

export default function WithdrawalsTable() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState<PayoutData | null>(null);

  const handleApprove = (payout: PayoutData) => {
    setSelectedPayout(payout);
    setIsModalOpen(true);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Approved":
        return "border-[#4ADE80]/30 bg-[#083b18] text-[#4ADE80]";
      case "Pending":
        return "border-[#D97706]/30 bg-[#78350F] text-[#F59E0B]";
      case "Rejected":
        return "border-[#DC2626]/30 bg-[#7f1d1d] text-[#EF4444]";
      default:
        return "border-[#2D3C13] bg-[#111210] text-[#72943A]";
    }
  };

  return (
    <div className="w-full bg-[#161810] border border-[#2D3C13] rounded-[16px] overflow-hidden overflow-x-auto mt-2 animate-fadeIn">
      <table className="w-full min-w-[1000px] text-left border-collapse">
        <thead>
          <tr className="border-b border-[#2D3C13] bg-[#111210]">
            <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[22%]">HOST</th>
            <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[18%] text-center">REQUESTED AMOUNT</th>
            <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[18%] text-center">PAYMENT METHOD</th>
            <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[15%] text-center">REQUEST DATE</th>
            <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[12%] text-center">STATUS</th>
            <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[15%] text-right">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {MOCK_PAYOUTS.map((payout, i) => (
            <tr key={payout.id} className={`${i !== MOCK_PAYOUTS.length - 1 ? 'border-b border-[#2D3C13]' : ''} hover:bg-[#1A230A] transition-colors`}>
              <td className="py-4 px-6">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#1A230A] border border-[#43581E] flex items-center justify-center shrink-0">
                    <span className="font-sans font-medium text-[10px] text-[#8CB34A]">{payout.hostInitials}</span>
                  </div>
                  <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">{payout.host}</span>
                </div>
              </td>
              <td className="py-4 px-6 text-center">
                <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">{payout.amount}</span>
              </td>
              <td className="py-4 px-6 text-center">
                <span className="font-sans text-[13px] text-[#72943A]">{payout.method}</span>
              </td>
              <td className="py-4 px-6 text-center">
                <span className="font-sans text-[13px] text-[#72943A]">{payout.date}</span>
              </td>
              <td className="py-4 px-6 text-center">
                <span className={`px-3 py-1 rounded-full border font-sans font-medium text-[10px] whitespace-nowrap ${getStatusStyle(payout.status)}`}>
                  {payout.status}
                </span>
              </td>
              <td className="py-4 px-6">
                <div className="flex items-center justify-end gap-3">
                  {payout.status === "Pending" ? (
                    <>
                      <button 
                        onClick={() => handleApprove(payout)}
                        className="h-[28px] px-3 rounded-[6px] bg-transparent border border-[#8CB34A] text-[#8CB34A] hover:bg-[#8CB34A]/10 font-heading font-medium text-[11px] transition-colors"
                      >
                        Approve
                      </button>
                      <button 
                        className="h-[28px] px-3 rounded-[6px] bg-transparent border border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444]/10 font-heading font-medium text-[11px] transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  ) : null}
                  <button className="text-[#5A752A] hover:text-[#E8EDD4] transition-colors">
                    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ConfirmPayoutModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        payout={selectedPayout} 
      />
    </div>
  );
}
