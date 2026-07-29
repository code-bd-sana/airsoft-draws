"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { POSTAL_ENTRY_RULES } from "../../../config/postal-entry-rules.config";

interface FreePostalEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  raffleTitle?: string;
}

export default function FreePostalEntryModal({
  isOpen,
  onClose,
  raffleTitle,
}: FreePostalEntryModalProps) {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const {
    title,
    subtitle,
    promoterName,
    promoterAddress,
    postcardDetails,
    rulesList,
    noticeText,
  } = POSTAL_ENTRY_RULES;

  const fullAddressString = `${promoterName}, ${promoterAddress.line1}, ${promoterAddress.line2}, ${promoterAddress.city}, ${promoterAddress.postcode}, ${promoterAddress.country}`;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(fullAddressString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative bg-[#111210] border border-[#8CB34A]/50 rounded-[24px] w-full max-w-[620px] overflow-hidden shadow-[0_0_50px_rgba(140,179,74,0.25)] animate-in zoom-in-95 duration-300 flex flex-col z-[10000]">
        
        {/* Glow Header Accent */}
        <div className="h-2 w-full bg-gradient-to-r from-[#8CB34A] via-[#A0D056] to-[#5A752A]" />

        {/* Modal Header */}
        <div className="p-6 sm:p-7 border-b border-[#2D3C13] bg-[#0D0D0B] flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#1A230A] border border-[#8CB34A] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(140,179,74,0.3)] text-2xl">
              ✉️
            </div>
            <div>
              <h2 className="font-heading font-bold text-xl sm:text-2xl text-[#E8EDD4] leading-tight">
                {title}
              </h2>
              <p className="font-sans text-xs text-[#8CB34A] mt-0.5 font-semibold">
                {raffleTitle ? (
                  <>Entering: <span className="text-[#E8EDD4] underline">{raffleTitle}</span></>
                ) : (
                  "Free Postal Entry Route (UK Compliant)"
                )}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#72943A] hover:text-[#E8EDD4] p-1.5 rounded-lg hover:bg-[#1A230A] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body Scroll Area */}
        <div className="p-6 sm:p-7 space-y-6 overflow-y-auto max-h-[70vh] custom-scrollbar text-xs leading-relaxed text-[#B3B8AA]">
          
          {/* Legal Subtitle Banner */}
          <div className="bg-[#1A230A] border border-[#43581E] rounded-xl p-4 text-[#E8EDD4]">
            <p>{subtitle}</p>
          </div>

          {/* Postal Address Card */}
          <div className="bg-[#0D0D0B] border border-[#2D3C13] rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-[#8CB34A]">
                📬 Send Postal Entries To:
              </h3>
              <button
                type="button"
                onClick={handleCopyAddress}
                className="px-3 py-1 rounded-lg bg-[#1A230A] border border-[#43581E] text-[#A0D056] font-sans font-bold text-[11px] hover:bg-[#2D3C13] transition-colors flex items-center gap-1.5"
              >
                {copied ? "✓ Address Copied!" : "📋 Copy Address"}
              </button>
            </div>

            <div className="font-mono text-xs text-[#E8EDD4] bg-[#161810] p-4 rounded-xl border border-[#2D3C13] space-y-1">
              <p className="font-bold text-[#8CB34A]">{promoterName}</p>
              <p>{promoterAddress.line1}</p>
              <p>{promoterAddress.line2}</p>
              <p>{promoterAddress.city}</p>
              <p className="font-bold">{promoterAddress.postcode}</p>
              <p className="text-[#72943A]">{promoterAddress.country}</p>
            </div>
          </div>

          {/* Required Postcard Details */}
          <div className="space-y-2">
            <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-[#A0D056]">
              📝 Required Postcard Details:
            </h3>
            <p className="text-[#72943A]">
              Write the following details clearly on your postcard:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {postcardDetails.map((item, idx) => (
                <div key={idx} className="bg-[#161810] border border-[#2D3C13] p-2.5 rounded-xl flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8CB34A] shrink-0" />
                  <span className="font-sans font-medium text-[#E8EDD4]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Postal Rules & Regulations */}
          <div className="space-y-2.5">
            <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-[#A0D056]">
              📜 Terms & Rules:
            </h3>
            <ul className="space-y-2">
              {rulesList.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-[#B3B8AA]">
                  <span className="font-bold text-[#8CB34A]">{idx + 1}.</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Placeholder Notice Callout */}
          <div className="bg-[#161810] border border-[#2D3C13] rounded-xl p-4 text-[11px] text-[#72943A]">
            ℹ️ <strong>Notice:</strong> {noticeText}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-5 sm:p-6 border-t border-[#2D3C13] bg-[#0D0D0B] flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#8CB34A] hover:bg-[#A0D056] text-[#0D0D0B] font-sans font-bold text-xs shadow-[0_0_20px_rgba(140,179,74,0.3)] transition-all"
          >
            I Understand & Close
          </button>
        </div>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
