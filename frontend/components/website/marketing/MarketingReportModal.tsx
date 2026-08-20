"use client";

import React, { useState } from "react";
import { api } from "../../../services/api";

interface MarketingReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  raffleId?: string;
  raffleTitle?: string;
}

export default function MarketingReportModal({
  isOpen,
  onClose,
  raffleId,
  raffleTitle,
}: MarketingReportModalProps) {
  const [reason, setReason] = useState("Weapons Presentation / Glamourisation");
  const [description, setDescription] = useState("");
  const [reporterEmail, setReporterEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await api.post("/marketing-reports", {
        raffleId,
        reason,
        description,
        reporterEmail: reporterEmail.trim() || undefined,
      });

      setSuccessMessage("Thank you. Your marketing concern report has been submitted to our compliance team for review.");
      setDescription("");
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 2500);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Failed to submit marketing report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#161810] border border-[#2D3C13] rounded-2xl w-full max-w-lg p-6 sm:p-8 flex flex-col gap-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#2D3C13] pb-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#1A230A] border border-[#43581E] text-[#8CB34A] w-fit">
              🛡️ ASA / CAP Advertising Safeguards
            </span>
            <h3 className="font-heading font-bold text-xl text-[#E8EDD4] mt-1">
              Report Marketing Concern
            </h3>
            {raffleTitle && (
              <p className="font-sans text-xs text-[#B3B8AA]">
                Reporting content for: {raffleTitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-[#72943A] hover:text-[#E8EDD4] transition-colors p-1"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* Reason */}
          <div className="flex flex-col gap-2">
            <label className="font-sans font-medium text-xs text-[#E8EDD4]">
              Reason for Report <span className="text-[#F76B6B]">*</span>
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="h-12 px-4 bg-[#0D0D0B] border border-[#2D3C13] rounded-lg font-sans text-sm text-[#E8EDD4] focus:border-[#8CB34A] outline-none transition-colors cursor-pointer"
            >
              <option value="Weapons Presentation / Glamourisation">Weapons Presentation / Glamourisation</option>
              <option value="Encouragement of Violence or Irresponsible Use">Encouragement of Violence or Irresponsible Use</option>
              <option value="Content Likely to Appeal Particularly to Minors">Content Likely to Appeal Particularly to Minors</option>
              <option value="Misleading Legal or UKARA Statements">Misleading Legal or UKARA Statements</option>
              <option value="Inappropriate Imagery or Promotion">Inappropriate Imagery or Promotion</option>
              <option value="Other Policy Concern">Other Policy Concern</option>
            </select>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label className="font-sans font-medium text-xs text-[#E8EDD4]">
              Detailed Explanation <span className="text-[#F76B6B]">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              placeholder="Describe the specific marketing material, image, or text concern..."
              className="p-3 bg-[#0D0D0B] border border-[#2D3C13] rounded-lg font-sans text-sm text-[#E8EDD4] placeholder:text-[#5A752A] focus:border-[#8CB34A] outline-none transition-colors resize-none"
            />
          </div>

          {/* Reporter Email */}
          <div className="flex flex-col gap-2">
            <label className="font-sans font-medium text-xs text-[#E8EDD4]">
              Your Email Address (Optional for follow-up)
            </label>
            <input
              type="email"
              value={reporterEmail}
              onChange={(e) => setReporterEmail(e.target.value)}
              placeholder="name@example.com"
              className="h-11 px-4 bg-[#0D0D0B] border border-[#2D3C13] rounded-lg font-sans text-sm text-[#E8EDD4] placeholder:text-[#5A752A] focus:border-[#8CB34A] outline-none transition-colors"
            />
          </div>

          {successMessage && (
            <div className="p-3 bg-[#1A230A] border border-[#8CB34A] rounded-lg text-xs text-[#8CB34A] text-center">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-red-950 border border-red-800 rounded-lg text-xs text-red-400 text-center">
              {errorMessage}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-[#2D3C13] pt-4 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="h-11 px-5 bg-transparent border border-[#2D3C13] hover:bg-[#1A230A] text-[#72943A] hover:text-[#E8EDD4] font-sans font-medium text-xs rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!description.trim() || isSubmitting}
              className="h-11 px-6 bg-[#8CB34A] hover:bg-[#A0D056] disabled:bg-[#8CB34A]/50 disabled:cursor-not-allowed text-[#0D0D0B] font-heading font-semibold text-sm rounded-lg transition-colors shadow-[0_0_15px_rgba(140,179,74,0.2)] flex items-center gap-2"
            >
              {isSubmitting ? "Submitting..." : "Submit Concern Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
