"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { raffleService } from "../../../services/raffle.service";
import { toast } from "sonner";
import { format } from "date-fns";

export interface TicketDetail {
  id: string;
  ticketNumber: number;
  raffleId?: string;
  raffleTitle?: string;
  raffleCategory?: string;
  pricePerTicket?: number;
  buyerName?: string;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  userLocation?: string;
  transactionId?: string;
  gatewayTransactionId?: string;
  paymentGateway?: string;
  paymentStatus?: string;
  winStatus?: string;
  createdAt: string;
}

interface ViewSoldTicketsModalProps {
  isOpen: boolean;
  onClose: () => void;
  raffle: {
    id: string;
    title: string;
    totalTickets: number;
    ticketsSold?: number;
    pricePerTicket?: number;
    category?: string;
    host?: any;
  } | null;
}

export default function ViewSoldTicketsModal({
  isOpen,
  onClose,
  raffle,
}: ViewSoldTicketsModalProps) {
  const [tickets, setTickets] = useState<TicketDetail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  useEffect(() => {
    if (isOpen && raffle?.id) {
      loadTickets();
    }
  }, [isOpen, raffle?.id]);

  const loadTickets = async () => {
    if (!raffle?.id) return;
    setIsLoading(true);
    try {
      const data = await raffleService.getSoldTickets(raffle.id);
      setTickets(data || []);
    } catch (err: any) {
      console.error("Failed to load sold tickets:", err);
      toast.error(err?.response?.data?.message || "Failed to load sold tickets list");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !raffle) return null;

  const filteredTickets = tickets.filter((t) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    const ticketNumStr = `#${t.ticketNumber}`.toLowerCase();
    const name = (t.buyerName || t.userName || "").toLowerCase();
    const email = (t.userEmail || "").toLowerCase();
    const tx = (t.transactionId || "").toLowerCase();
    return (
      ticketNumStr.includes(q) ||
      t.ticketNumber.toString().includes(q) ||
      name.includes(q) ||
      email.includes(q) ||
      tx.includes(q)
    );
  });

  const handleExportCSV = () => {
    if (tickets.length === 0) {
      toast.info("No tickets to export.");
      return;
    }

    const headers = [
      "Ticket Number",
      "Competition Title",
      "Category",
      "Buyer / Client Name",
      "Buyer Email",
      "Buyer Phone",
      "Buyer Location",
      "Ticket Price (£)",
      "Win Status",
      "Transaction ID",
      "Gateway Transaction ID",
      "Payment Gateway",
      "Payment Status",
      "Purchase Date & Time"
    ];

    const rows = tickets.map((t) => {
      const ticketNum = `#${t.ticketNumber}`;
      const raffleTitle = t.raffleTitle || raffle.title || "N/A";
      const category = t.raffleCategory || raffle.category || "N/A";
      const buyerName = t.buyerName || t.userName || "N/A";
      const buyerEmail = t.userEmail || "N/A";
      const phone = t.userPhone || "N/A";
      const location = t.userLocation || "N/A";
      const price = Number(t.pricePerTicket || raffle.pricePerTicket || 0).toFixed(2);
      const winStatus = t.winStatus || "Regular Entry";
      const txId = t.transactionId || "N/A";
      const gatewayTxId = t.gatewayTransactionId || "N/A";
      const gateway = t.paymentGateway || "N/A";
      const payStatus = t.paymentStatus || "COMPLETED";
      const purchaseDate = t.createdAt ? format(new Date(t.createdAt), "dd MMM yyyy HH:mm:ss") : "N/A";

      return [
        ticketNum,
        raffleTitle,
        category,
        buyerName,
        buyerEmail,
        phone,
        location,
        price,
        winStatus,
        txId,
        gatewayTxId,
        gateway,
        payStatus,
        purchaseDate
      ];
    });

    const csvContent = [
      headers.map((h) => `"${String(h).replace(/"/g, '""')}"`).join(","),
      ...rows.map((row) => row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);

    const safeTitle = String(raffle.title).toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 30);
    link.setAttribute("download", `tickets_${safeTitle}_${new Date().toISOString().slice(0, 10)}.csv`);

    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Exported ${tickets.length} tickets successfully!`);
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#161810] border border-[#2D3C13] rounded-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden text-[#E8EDD4]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#2D3C13] bg-[#111210]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-sans font-bold bg-[#1A230A] border border-[#8CB34A] text-[#8CB34A]">
                🎟️ Ticket Details
              </span>
              <h2 className="font-heading font-bold text-lg text-[#E8EDD4] truncate max-w-[450px]">
                {raffle.title}
              </h2>
            </div>
            <p className="font-sans text-xs text-[#72943A]">
              Total Sold: <strong className="text-[#E8EDD4]">{tickets.length}</strong> / {raffle.totalTickets} tickets
              {raffle.pricePerTicket && ` • £${Number(raffle.pricePerTicket).toFixed(2)} per ticket`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              disabled={tickets.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-[#1A230A] border border-[#2D3C13] hover:border-[#8CB34A] text-[#8CB34A] font-sans font-medium text-[12px] transition-colors disabled:opacity-50 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Export CSV
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-[#0D0D0B] border border-[#2D3C13] text-[#72943A] hover:text-[#E8EDD4] hover:border-[#43581E] transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Toolbar (Search & View Toggle) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-3 border-b border-[#2D3C13] bg-[#161810]">
          <div className="flex items-center h-[36px] w-full sm:w-[320px] bg-[#0D0D0B] border border-[#2D3C13] rounded-[8px] px-3">
            <svg className="w-4 h-4 text-[#72943A] shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              type="text"
              placeholder="Search by ticket #, buyer name, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-[#E8EDD4] text-[12px] placeholder:text-[#5A752A] w-full ml-2 font-sans"
            />
          </div>

          <div className="flex items-center gap-1 bg-[#0D0D0B] p-1 rounded-[8px] border border-[#2D3C13]">
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-1 rounded-[6px] text-[11px] font-sans font-medium transition-colors cursor-pointer ${
                viewMode === "table"
                  ? "bg-[#8CB34A] text-[#0D0D0B]"
                  : "text-[#72943A] hover:text-[#E8EDD4]"
              }`}
            >
              📋 Table View
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1 rounded-[6px] text-[11px] font-sans font-medium transition-colors cursor-pointer ${
                viewMode === "grid"
                  ? "bg-[#8CB34A] text-[#0D0D0B]"
                  : "text-[#72943A] hover:text-[#E8EDD4]"
              }`}
            >
              🔢 Ticket Badges
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 max-h-[60vh]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-8 h-8 border-2 border-[#8CB34A] border-t-transparent rounded-full animate-spin"></div>
              <p className="font-sans text-xs text-[#72943A]">Loading competition tickets...</p>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <span className="text-3xl mb-2">🎟️</span>
              <p className="font-heading font-medium text-sm text-[#E8EDD4] mb-1">
                {tickets.length === 0 ? "No tickets have been sold yet" : "No matching tickets found"}
              </p>
              <p className="font-sans text-xs text-[#5A752A]">
                {tickets.length === 0 ? "Tickets will appear here as soon as buyers enter this raffle." : "Try adjusting your search criteria."}
              </p>
            </div>
          ) : viewMode === "grid" ? (
            /* Badges Grid View */
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2.5">
              {filteredTickets.map((t) => {
                const isMainWin = t.winStatus?.includes("Main");
                const isInstantWin = t.winStatus?.includes("Instant");

                let badgeColor = "bg-[#0D0D0B] border-[#2D3C13] text-[#E8EDD4]";
                if (isMainWin) {
                  badgeColor = "bg-[#4ADE80]/20 border-[#4ADE80] text-[#4ADE80] font-bold shadow-[0_0_10px_rgba(74,222,128,0.2)]";
                } else if (isInstantWin) {
                  badgeColor = "bg-[#F59E0B]/20 border-[#F59E0B] text-[#F59E0B] font-bold";
                }

                return (
                  <div
                    key={t.id}
                    title={`${t.buyerName || t.userName} (${t.userEmail})\nStatus: ${t.winStatus}`}
                    className={`flex flex-col items-center justify-center p-2 rounded-[10px] border transition-all hover:scale-105 cursor-pointer ${badgeColor}`}
                  >
                    <span className="font-sans font-bold text-xs">#{t.ticketNumber}</span>
                    <span className="font-sans text-[10px] text-[#72943A] truncate max-w-full">
                      {t.buyerName?.split(" ")[0] || "User"}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Full Table View */
            <div className="w-full border border-[#2D3C13] rounded-[12px] overflow-hidden">
              <table className="w-full text-left border-collapse text-[12px]">
                <thead>
                  <tr className="border-b border-[#2D3C13] bg-[#111210] text-[#5A752A] font-sans font-medium text-[10px] uppercase">
                    <th className="py-3 px-4">TICKET #</th>
                    <th className="py-3 px-4">BUYER / CLIENT NAME</th>
                    <th className="py-3 px-4">BUYER EMAIL</th>
                    <th className="py-3 px-4">PHONE</th>
                    <th className="py-3 px-4 text-center">WIN STATUS</th>
                    <th className="py-3 px-4 text-right">PURCHASE DATE</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.map((t, idx) => {
                    const isMainWin = t.winStatus?.includes("Main");
                    const isInstantWin = t.winStatus?.includes("Instant");

                    return (
                      <tr
                        key={t.id}
                        className={`${idx !== filteredTickets.length - 1 ? "border-b border-[#2D3C13]" : ""} hover:bg-[#1A230A] transition-colors`}
                      >
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-[4px] bg-[#1A230A] border border-[#8CB34A] text-[#8CB34A] font-sans font-bold text-[11px]">
                            #{t.ticketNumber}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium text-[#E8EDD4]">
                          {t.buyerName || t.userName || "N/A"}
                        </td>
                        <td className="py-3 px-4 text-[#72943A]">
                          {t.userEmail || "N/A"}
                        </td>
                        <td className="py-3 px-4 text-[#72943A]">
                          {t.userPhone || "N/A"}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {isMainWin ? (
                            <span className="px-2 py-0.5 rounded-full bg-[#4ADE80]/15 border border-[#4ADE80]/40 text-[#4ADE80] text-[10px] font-bold">
                              🏆 Main Winner
                            </span>
                          ) : isInstantWin ? (
                            <span className="px-2 py-0.5 rounded-full bg-[#F59E0B]/15 border border-[#F59E0B]/40 text-[#F59E0B] text-[10px] font-bold">
                              ⚡ Instant Winner
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-[#0D0D0B] border border-[#2D3C13] text-[#5A752A] text-[10px]">
                              Regular Entry
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right text-[#72943A]">
                          {t.createdAt ? format(new Date(t.createdAt), "dd MMM yyyy HH:mm") : "N/A"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#2D3C13] bg-[#111210]">
          <p className="font-sans text-xs text-[#5A752A]">
            Showing <span className="text-[#E8EDD4] font-medium">{filteredTickets.length}</span> of {tickets.length} total sold tickets
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-[8px] bg-[#1A230A] border border-[#2D3C13] hover:border-[#8CB34A] text-[#8CB34A] hover:text-[#E8EDD4] font-sans font-medium text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );

  if (typeof window === "undefined") return null;
  return createPortal(modalContent, document.body);
}
