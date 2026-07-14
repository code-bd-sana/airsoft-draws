"use client";

import React, { useState } from "react";
import DrawOverviewTab from "./DrawOverviewTab";
import DrawEntriesTab from "./DrawEntriesTab";
import DrawAuditLogTab from "./DrawAuditLogTab";
import { format } from "date-fns";

interface DrawDetailsPanelProps {
  draw: any;
  onClose: () => void;
}

export default function DrawDetailsPanel({ draw, onClose }: DrawDetailsPanelProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "entries" | "audit">("overview");

  const getStatusString = (status: string) => {
    switch (status) {
      case "PENDING_APPROVAL": return "Pending Approval";
      case "DRAFT": return "Draft";
      case "ENDED": return "Completed";
      case "ACTIVE": return "In Progress";
      case "CANCELLED": return "Cancelled";
      default: return status;
    }
  };

  const getDrawType = (d: any) => {
    if (!d.isAutoDraw) return "Manual (Host)";
    if (d.isAutoDraw && d.autoDrawSoldOut) return "Auto (Sold Out)";
    return "Auto (Date)";
  };

  const hostName = draw.host?.businessName || "Unknown Host";
  const statusString = getStatusString(draw.status);
  const drawType = getDrawType(draw);
  const scheduledTime = draw.endDate ? format(new Date(draw.endDate), "dd MMM yyyy HH:mm") : "N/A";

  return (
    <div className="w-full bg-[#161810] border border-[#2D3C13] rounded-[16px] flex flex-col mt-6 animate-fadeIn overflow-hidden">
      
      {/* Header Area */}
      <div className="flex flex-col p-6 pb-0 border-b border-[#2D3C13]">
        
        {/* Title & Close */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-3">
            <h2 className="font-heading font-bold text-[20px] text-[#E8EDD4]">{draw.title}</h2>
            {/* Status Pills */}
            <div className="flex gap-2">
              <span className="px-3 py-1 rounded-full border border-[#D97706]/30 bg-[#78350F] text-[#F59E0B] font-sans font-medium text-[10px]">
                {statusString}
              </span>
              <span className="px-3 py-1 rounded-full border border-[#4ADE80]/30 bg-[#083b18] text-[#4ADE80] font-sans font-medium text-[10px]">
                {drawType}
              </span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-[#5A752A] hover:text-[#E8EDD4] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Subtitle */}
        <div className="font-sans text-[12px] text-[#72943A] mb-8">
          Host: {hostName} | End Date: {scheduledTime}
        </div>

        {/* 4 Stat Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#111210] border border-[#2D3C13] rounded-[8px] p-4 flex flex-col gap-1">
            <span className="font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px]">Total Tickets</span>
            <span className="font-heading font-bold text-[20px] text-[#E8EDD4]">{draw.totalTickets}</span>
          </div>
          <div className="bg-[#111210] border border-[#2D3C13] rounded-[8px] p-4 flex flex-col gap-1">
            <span className="font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px]">Sold Tickets</span>
            <span className="font-heading font-bold text-[20px] text-[#4ADE80]">{draw.ticketsSold || 0}</span>
          </div>
          <div className="bg-[#111210] border border-[#2D3C13] rounded-[8px] p-4 flex flex-col gap-1">
            <span className="font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px]">Price Per Ticket</span>
            <span className="font-heading font-bold text-[20px] text-[#E8EDD4]">£{Number(draw.pricePerTicket).toFixed(2)}</span>
          </div>
          <div className="bg-[#111210] border border-[#2D3C13] rounded-[8px] p-4 flex flex-col gap-1">
            <span className="font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px]">Draw Type</span>
            <span className="font-heading font-bold text-[20px] text-[#A0D056]">{drawType}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex-1 h-[40px] rounded-[8px] font-sans font-medium text-[13px] transition-colors ${
              activeTab === "overview"
                ? "border border-[#8CB34A] text-[#E8EDD4]"
                : "text-[#72943A] hover:text-[#A0D056]"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("entries")}
            className={`flex-1 h-[40px] rounded-[8px] font-sans font-medium text-[13px] transition-colors ${
              activeTab === "entries"
                ? "border border-[#8CB34A] text-[#E8EDD4]"
                : "text-[#72943A] hover:text-[#A0D056]"
            }`}
          >
            Entries
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`flex-1 h-[40px] rounded-[8px] font-sans font-medium text-[13px] transition-colors ${
              activeTab === "audit"
                ? "border border-[#8CB34A] text-[#E8EDD4]"
                : "text-[#72943A] hover:text-[#A0D056]"
            }`}
          >
            Audit Log
          </button>
        </div>

      </div>

      {/* Tab Content Area */}
      <div className="p-6">
        {activeTab === "overview" && <DrawOverviewTab />}
        {activeTab === "entries" && <DrawEntriesTab />}
        {activeTab === "audit" && <DrawAuditLogTab />}
      </div>

    </div>
  );
}
