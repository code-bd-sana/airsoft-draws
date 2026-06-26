"use client";

import React, { useState } from "react";
import { LeadItem } from "../../types/lead.types";

interface LeadsTableProps {
  initialLeads: LeadItem[];
}

/**
 * Leads viewer layout showing registered emails, search functionality,
 * and a secure session Logout mechanism.
 */
export default function LeadsTable({ initialLeads }: LeadsTableProps) {
  const [leads] = useState<LeadItem[]>(initialLeads);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch("/api/admin/auth", {
        method: "DELETE",
      });

      if (response.ok) {
        window.location.reload();
      }
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Filter leads by name or email
  const filteredLeads = leads.filter(
    (lead) =>
      lead.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-0 py-8">
      {/* Table Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="font-heading font-bold text-xl md:text-2xl text-text-primary uppercase tracking-wide">
            Registered Leads ({leads.length})
          </h2>
          <p className="font-sans text-xs text-text-muted mt-0.5">
            Manage early-access registrations and campaign contacts.
          </p>
        </div>

        {/* Action controls: Search & Logout */}
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-surface border border-border rounded-button px-4 py-2 font-sans text-xs md:text-sm text-text-primary placeholder:text-text-muted/40 outline-none focus:border-primary transition-colors w-full sm:w-64"
          />

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="bg-accent-bg border border-red-500/50 hover:bg-red-950/20 text-red-400 font-sans font-semibold text-xs px-4 py-2 rounded-button transition-colors select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isLoggingOut ? "Signing Out..." : "Sign Out"}
          </button>
        </div>
      </div>

      {/* Leads Table Matrix */}
      <div className="w-full border border-border rounded-[14px] overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse text-left">
            <thead>
              <tr className="bg-surface border-b border-border h-11">
                <th className="font-heading font-bold text-xs text-text-secondary px-6 uppercase tracking-wider">
                  Full Name
                </th>
                <th className="font-heading font-bold text-xs text-text-secondary px-6 uppercase tracking-wider">
                  Email Address
                </th>
                <th className="font-heading font-bold text-xs text-text-secondary px-6 uppercase tracking-wider text-right">
                  Registered Date
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.length > 0 ? (
                filteredLeads.map((lead, index) => (
                  <tr
                    key={lead.id}
                    className={index % 2 === 0 ? "bg-bg" : "bg-surface/50"}
                  >
                    <td className="font-sans font-medium text-xs md:text-sm text-text-primary px-6 py-4.5">
                      {lead.fullName}
                    </td>
                    <td className="font-sans text-xs md:text-sm text-text-brand px-6 py-4.5">
                      {lead.email}
                    </td>
                    <td className="font-sans text-xs text-text-muted px-6 py-4.5 text-right">
                      {new Date(lead.createdAt).toLocaleString("en-GB", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-12 bg-bg font-sans text-xs md:text-sm text-text-muted/40">
                    No leads found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
