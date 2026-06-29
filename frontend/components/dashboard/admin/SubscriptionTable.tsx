"use client";

import React from "react";

const MOCK_SUBSCRIPTIONS = [
  { id: "1", initials: "TG", name: "Tactical Gear UK", plan: "Pro", billing: "Yearly", nextRenewal: "14 Dec 2025", amount: "£299/yr", status: "Active" },
  { id: "2", initials: "AW", name: "Airsoft World", plan: "Premium", billing: "Monthly", nextRenewal: "1 Jul 2025", amount: "£29/mo", status: "Active" },
  { id: "3", initials: "ES", name: "Elite Shooters", plan: "Free", billing: "N/A", nextRenewal: "—", amount: "£0", status: "Active" },
  { id: "4", initials: "CZ", name: "Combat Zone Ltd", plan: "Premium", billing: "Monthly", nextRenewal: "15 Jul 2025", amount: "£29/mo", status: "Past Due" },
  { id: "5", initials: "SF", name: "Strike Force Co", plan: "Pro", billing: "Yearly", nextRenewal: "3 Sep 2025", amount: "£299/yr", status: "Cancelled" },
];

export default function SubscriptionTable() {

  const getStatusPill = (status: string) => {
    switch (status) {
      case "Active":
        return <span className="px-3 py-1 rounded-full border border-[#4ADE80]/30 bg-[#083b18] text-[#4ADE80] font-sans font-medium text-[10px]">Active</span>;
      case "Past Due":
        return <span className="px-3 py-1 rounded-full border border-[#EF4444]/30 bg-[#7F1D1D] text-[#f76b6b] font-sans font-medium text-[10px]">Past Due</span>;
      case "Cancelled":
        return <span className="px-3 py-1 rounded-full border border-[#EF4444]/30 bg-[#7F1D1D] text-[#f76b6b] font-sans font-medium text-[10px]">Cancelled</span>;
      default:
        return null;
    }
  };

  const getPlanPill = (plan: string) => {
    switch (plan) {
      case "Pro":
      case "Premium":
      case "Free":
        return <span className="px-3 py-1 rounded-full border border-[#8CB34A] bg-[#1A230A] text-[#A0D056] font-sans font-medium text-[10px]">{plan}</span>;
      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-[#161810] border border-[#2D3C13] rounded-[16px] overflow-hidden overflow-x-auto h-full flex flex-col">
      <table className="w-full min-w-[800px] text-left border-collapse">
        <thead>
          <tr className="border-b border-[#2D3C13] bg-[#111210]">
            <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[25%]">HOST</th>
            <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[15%]">PLAN</th>
            <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[15%]">BILLING</th>
            <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[15%]">NEXT RENEWAL</th>
            <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[10%]">AMOUNT</th>
            <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[10%] text-center">STATUS</th>
            <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[10%] text-right">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {MOCK_SUBSCRIPTIONS.map((sub, i) => (
            <tr key={sub.id} className={`${i !== MOCK_SUBSCRIPTIONS.length - 1 ? 'border-b border-[#2D3C13]' : ''} hover:bg-[#1A230A] transition-colors`}>
              <td className="py-4 px-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#1A230A] border border-[#43581E] flex items-center justify-center shrink-0">
                    <span className="font-sans font-medium text-[11px] text-[#8CB34A]">{sub.initials}</span>
                  </div>
                  <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">{sub.name}</span>
                </div>
              </td>
              <td className="py-4 px-6">
                {getPlanPill(sub.plan)}
              </td>
              <td className="py-4 px-6">
                <span className="font-sans text-[13px] text-[#72943A]">{sub.billing}</span>
              </td>
              <td className="py-4 px-6">
                <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">{sub.nextRenewal}</span>
              </td>
              <td className="py-4 px-6">
                <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">{sub.amount}</span>
              </td>
              <td className="py-4 px-6 text-center">
                {getStatusPill(sub.status)}
              </td>
              <td className="py-4 px-6">
                <div className="flex items-center justify-end gap-3">
                  <button className="text-[#5A752A] hover:text-[#8CB34A] transition-colors" title="View details">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  </button>
                  <button className="text-[#5A752A] hover:text-[#8CB34A] transition-colors" title="Edit">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                    </svg>
                  </button>
                  <button className="text-[#f76b6b] hover:text-[#ef4444] transition-colors" title="Cancel/Delete">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
