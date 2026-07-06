"use client";

import { useAllSubscriptionsAdmin } from '@/hooks/useSubscriptionHooks';
import React from "react";


export default function SubscriptionTable() {
  const { data: subscriptions, isLoading } = useAllSubscriptionsAdmin();

  if (isLoading) {
    return <div className="p-6 text-white">Loading subscriptions...</div>;
  }

  const subs = subscriptions || [];

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
      <table className="w-full min-w-[1000px] text-left border-collapse">
        <thead>
          <tr className="border-b border-[#2D3C13] bg-[#111210]">
            <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[20%]">HOST</th>
            <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[10%]">PLAN</th>
            <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[15%]">PURCHASE DATE</th>
            <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[15%]">NEXT RENEWAL</th>
            <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[20%]">PAYMENT</th>
            <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[10%] text-center">STATUS</th>
            <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[10%] text-right">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {subs.map((sub: any, i: number) => {
            const hostName = sub.host?.businessName || sub.host?.user?.firstName + ' ' + sub.host?.user?.lastName || 'Unknown Host';
            const initials = hostName.substring(0, 2).toUpperCase();
            const endDate = new Date(sub.endDate);
            const startDate = new Date(sub.startDate || sub.createdAt);
            const formattedDate = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(endDate);
            const formattedStartDate = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(startDate);
            const displayStatus = sub.status === 'ACTIVE' ? 'Active' : sub.status === 'CANCELLED' ? 'Cancelled' : 'Past Due';
            const tx = sub.transaction;

            return (
              <tr key={sub.id} className={`${i !== subs.length - 1 ? 'border-b border-[#2D3C13]' : ''} hover:bg-[#1A230A] transition-colors`}>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#1A230A] border border-[#43581E] flex items-center justify-center shrink-0">
                      <span className="font-sans font-medium text-[11px] text-[#8CB34A]">{initials}</span>
                    </div>
                    <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">{hostName}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  {getPlanPill(sub.plan?.name || "Free")}
                </td>
                <td className="py-4 px-6">
                  <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">{formattedStartDate}</span>
                </td>
                <td className="py-4 px-6">
                  <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">{formattedDate}</span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex flex-col">
                    <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">£{sub.plan?.price} - {tx?.status || 'COMPLETED'}</span>
                    {tx?.gatewayTransactionId && <span className="font-sans text-[11px] text-[#5A752A] mt-1">{tx.gatewayTransactionId}</span>}
                  </div>
                </td>
                <td className="py-4 px-6 text-center">
                  {getStatusPill(displayStatus)}
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-end gap-3">
                    <button className="text-[#5A752A] hover:text-[#8CB34A] transition-colors" title="View details">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
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
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
