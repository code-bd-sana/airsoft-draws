"use client";

import React, { useState } from "react";
import ProcessRefundModal, { OrderData } from "./ProcessRefundModal";
import { useAdminOrders } from "../../../hooks/useAdminHooks";

export default function AdminOrdersTable() {
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);

  const { data: response, isLoading } = useAdminOrders({ page, limit: 10 });

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

  const orders = response?.orders || [];
  const totalPages = response?.totalPages || 1;

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
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
            {isLoading ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-[#5A752A] font-sans">
                  Loading orders...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-[#5A752A] font-sans">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order: OrderData, i: number) => (
                <tr key={order.id} className={`${i !== orders.length - 1 ? 'border-b border-[#2D3C13]' : ''} hover:bg-[#1A230A] transition-colors`}>
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
                    <span className="font-sans text-[13px] text-[#72943A] truncate block w-[160px]">{order.competition}</span>
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
                    <span className="font-sans text-[13px] text-[#72943A]">{formatDate(order.date)}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-4">
                      <button className="text-[#5A752A] hover:text-[#8CB34A] transition-colors" title="View Details">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                      </button>
                      
                      {order.status === "Paid" && (
                        <button 
                          onClick={() => handleRefund(order)}
                          className="font-sans font-medium text-[12px] text-[#72943A] hover:text-[#f76b6b] transition-colors"
                        >
                          Refund
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center px-4">
          <span className="font-sans text-[13px] text-[#72943A]">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 bg-[#161810] border border-[#2D3C13] rounded-[8px] text-[#E8EDD4] text-[13px] hover:bg-[#1A230A] transition-colors disabled:opacity-50"
            >
              Previous
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 bg-[#161810] border border-[#2D3C13] rounded-[8px] text-[#E8EDD4] text-[13px] hover:bg-[#1A230A] transition-colors disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <ProcessRefundModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        order={selectedOrder} 
      />
    </div>
  );
}
