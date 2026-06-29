"use client";

import React, { useState } from "react";
import ProcessRefundModal, { OrderData } from "./ProcessRefundModal";

const MOCK_ORDERS: OrderData[] = [
  { id: "1", orderId: "ORD-9921", buyerName: "James Thornton", buyerInitials: "JT", competition: "Sniper Rifle Set", tickets: 4, amount: 10.00, payment: "Card", status: "Paid", date: "15 Jun 2025" },
  { id: "2", orderId: "ORD-9920", buyerName: "Sarah Mitchell", buyerInitials: "SM", competition: "VFC HK416 Bundle", tickets: 2, amount: 3.00, payment: "PayPal", status: "Paid", date: "14 Jun 2025" },
  { id: "3", orderId: "ORD-9919", buyerName: "Oliver Bennett", buyerInitials: "OB", competition: "Sniper Rifle Set", tickets: 6, amount: 15.00, payment: "Card", status: "Refunded", date: "13 Jun 2025" },
  { id: "4", orderId: "ORD-9918", buyerName: "Emma Clarke", buyerInitials: "EC", competition: "Tactical Pistol Set", tickets: 10, amount: 7.50, payment: "Card", status: "Failed", date: "12 Jun 2025" },
  { id: "5", orderId: "ORD-9917", buyerName: "Noah Williams", buyerInitials: "NW", competition: "Night Vision Bundle", tickets: 1, amount: 3.00, payment: "Card", status: "Paid", date: "11 Jun 2025" },
];

export default function AdminOrdersTable() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);

  const handleRefund = (order: OrderData) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const getStatusPill = (status: string) => {
    switch (status) {
      case "Paid":
        return <span className="px-3 py-1 rounded-full border border-[#4ADE80]/30 bg-[#083b18] text-[#4ADE80] font-sans font-medium text-[10px]">{status}</span>;
      case "Refunded":
        return <span className="px-3 py-1 rounded-full border border-[#EF4444]/30 bg-[#7F1D1D] text-[#f76b6b] font-sans font-medium text-[10px]">{status}</span>;
      case "Failed":
        return <span className="px-3 py-1 rounded-full border border-[#EF4444]/30 bg-[#7F1D1D] text-[#f76b6b] font-sans font-medium text-[10px]">{status}</span>;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Table Container */}
      <div className="w-full bg-[#161810] border border-[#2D3C13] rounded-[16px] overflow-hidden overflow-x-auto mt-2">
        <table className="w-full min-w-[1050px] text-left border-collapse">
          <thead>
            <tr className="border-b border-[#2D3C13] bg-[#111210]">
              <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[12%]">ORDER ID</th>
              <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[18%]">BUYER</th>
              <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[18%]">COMPETITION</th>
              <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[8%] text-center">TICKETS</th>
              <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[10%] text-center">AMOUNT</th>
              <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[10%] text-center">PAYMENT</th>
              <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[10%] text-center">STATUS</th>
              <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[12%] text-center">DATE</th>
              <th className="py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[10%] text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_ORDERS.map((order, i) => (
              <tr key={order.id} className={`${i !== MOCK_ORDERS.length - 1 ? 'border-b border-[#2D3C13]' : ''} hover:bg-[#1A230A] transition-colors`}>
                <td className="py-4 px-6">
                  <span className="font-sans font-medium text-[13px] text-[#72943A]">#{order.orderId}</span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#1A230A] border border-[#43581E] flex items-center justify-center shrink-0">
                      <span className="font-sans font-medium text-[10px] text-[#8CB34A]">{order.buyerInitials}</span>
                    </div>
                    <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">{order.buyerName}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="font-sans text-[13px] text-[#72943A]">{order.competition}</span>
                </td>
                <td className="py-4 px-6 text-center">
                  <span className="font-sans text-[13px] text-[#E8EDD4]">{order.tickets}</span>
                </td>
                <td className="py-4 px-6 text-center">
                  <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">£{order.amount.toFixed(2)}</span>
                </td>
                <td className="py-4 px-6 text-center">
                  <span className="font-sans text-[13px] text-[#72943A]">{order.payment}</span>
                </td>
                <td className="py-4 px-6 text-center">
                  {getStatusPill(order.status)}
                </td>
                <td className="py-4 px-6 text-center">
                  <span className="font-sans text-[13px] text-[#72943A]">{order.date}</span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-end gap-4">
                    <button className="text-[#5A752A] hover:text-[#8CB34A] transition-colors" title="View Details">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                    </button>
                    
                    <button 
                      onClick={() => handleRefund(order)}
                      className="font-sans font-medium text-[12px] text-[#72943A] hover:text-[#f76b6b] transition-colors"
                    >
                      Refund
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ProcessRefundModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        order={selectedOrder} 
      />
    </div>
  );
}
