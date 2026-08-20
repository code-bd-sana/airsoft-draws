"use client";

import React, { useState, useEffect } from "react";

interface CheckoutComplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
  raffleTitle: string;
  prizeClassification?: string;
  quantity: number;
  ticketPrice: number;
  onConfirm: (data: { dateOfBirth: string; ukaraNumber?: string; acceptedTerms: boolean }) => void;
  isPending?: boolean;
  errorMessage?: string | null;
  userDob?: string | null;
  userUkara?: string | null;
}

export function calculateAgeFromDobString(dobStr: string): number | null {
  if (!dobStr) return null;
  const dob = new Date(dobStr);
  if (isNaN(dob.getTime())) return null;
  
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

export default function CheckoutComplianceModal({
  isOpen,
  onClose,
  raffleTitle,
  prizeClassification = "RIF",
  quantity,
  ticketPrice,
  onConfirm,
  isPending = false,
  errorMessage = null,
  userDob = null,
  userUkara = null,
}: CheckoutComplianceModalProps) {
  const [dob, setDob] = useState(userDob || "");
  const [ukara, setUkara] = useState(userUkara || "");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  useEffect(() => {
    if (userDob && !dob) setDob(userDob.slice(0, 10));
    if (userUkara && !ukara) setUkara(userUkara);
  }, [userDob, userUkara, dob, ukara]);

  if (!isOpen) return null;

  const isRif = (prizeClassification || "RIF") === "RIF";
  const calculatedAge = calculateAgeFromDobString(dob);
  const isUnder18 = calculatedAge !== null && calculatedAge < 18;
  const isValidAge = calculatedAge !== null && calculatedAge >= 18;

  const isFormValid =
    isValidAge &&
    (!isRif || (ukara && ukara.trim().length > 0)) &&
    acceptedTerms;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isPending) return;
    onConfirm({
      dateOfBirth: dob,
      ukaraNumber: isRif ? ukara.trim() : undefined,
      acceptedTerms,
    });
  };

  const totalPrice = quantity * ticketPrice;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#161810] border border-[#2D3C13] rounded-2xl w-full max-w-lg p-6 sm:p-8 flex flex-col gap-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#2D3C13] pb-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#1A230A] border border-[#43581E] text-[#8CB34A]">
                18+ Compliance Verification
              </span>
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                isRif ? 'bg-amber-950/40 border-amber-800 text-amber-400' : 'bg-blue-950/40 border-blue-800 text-blue-400'
              }`}>
                {isRif ? 'RIF Competition' : 'Non-RIF Accessory'}
              </span>
            </div>
            <h3 className="font-heading font-bold text-xl text-[#E8EDD4] mt-1">
              Checkout Eligibility Check
            </h3>
            <p className="font-sans text-xs text-[#B3B8AA]">
              {raffleTitle} ({quantity} ticket{quantity > 1 ? 's' : ''} — £{totalPrice.toFixed(2)})
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#72943A] hover:text-[#E8EDD4] transition-colors p-1"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="flex flex-col gap-5">
          
          {/* DOB Input */}
          <div className="flex flex-col gap-2">
            <label className="font-sans font-medium text-xs text-[#E8EDD4] flex items-center justify-between">
              <span>Date of Birth (18+ Required) <span className="text-[#F76B6B]">*</span></span>
              {calculatedAge !== null && (
                <span className={isValidAge ? "text-[#8CB34A] text-xs font-semibold" : "text-[#F76B6B] text-xs font-semibold"}>
                  Age: {calculatedAge} {isValidAge ? "(Verified 18+)" : "(Under 18 Blocked)"}
                </span>
              )}
            </label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
              className="h-12 px-4 bg-[#0D0D0B] border border-[#2D3C13] rounded-lg font-sans text-sm text-[#E8EDD4] focus:border-[#8CB34A] outline-none transition-colors"
            />
            {isUnder18 && (
              <p className="font-sans text-xs text-[#F76B6B] bg-red-950/50 border border-red-900 p-2.5 rounded-lg">
                ⚠️ Under UK law (VCRA 2006), participants must be 18 years or older. You cannot proceed with checkout.
              </p>
            )}
          </div>

          {/* Conditional UKARA Input */}
          {isRif ? (
            <div className="flex flex-col gap-2 p-4 bg-[#0D0D0B] border border-[#2D3C13] rounded-xl">
              <div className="flex items-center justify-between">
                <label className="font-sans font-medium text-xs text-[#E8EDD4]">
                  UKARA Registration Number <span className="text-[#F76B6B]">*</span>
                </label>
                <span className="text-[10px] text-[#8CB34A] uppercase font-semibold">Mandatory for RIF</span>
              </div>
              <input
                type="text"
                value={ukara}
                onChange={(e) => setUkara(e.target.value)}
                placeholder="e.g. UKARA123456"
                required={isRif}
                className="h-12 px-4 bg-[#161810] border border-[#2D3C13] rounded-lg font-sans text-sm text-[#E8EDD4] placeholder:text-[#5A752A] focus:border-[#8CB34A] outline-none transition-colors uppercase"
              />
              <p className="font-sans text-[11px] text-[#B3B8AA] leading-normal mt-1">
                📌 Required as evidence supporting a statutory legal defence under VCRA Section 37 for Realistic Imitation Firearms. UKARA is checked following a win to confirm it is active and linked to the winner. <em className="text-[#8CB34A]">Note: UKARA is not a licence.</em>
              </p>
            </div>
          ) : (
            <div className="p-3 bg-[#1A230A] border border-[#2D3C13] rounded-xl text-xs text-[#8CB34A]">
              ✓ <strong>UKARA Not Required:</strong> This item is classified as an accessory/non-RIF product. UKARA defence details are not required for checkout.
            </div>
          )}

          {/* T&C Acceptance Checkbox */}
          <div className="flex items-start gap-3 p-3 bg-[#0D0D0B] border border-[#2D3C13] rounded-xl">
            <input
              type="checkbox"
              id="acceptedTermsCheck"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded border-[#2D3C13] bg-[#1A230A] accent-[#8CB34A] cursor-pointer"
            />
            <label htmlFor="acceptedTermsCheck" className="font-sans text-xs text-[#E8EDD4] leading-relaxed cursor-pointer select-none">
              I confirm that I am 18 years of age or older, all information provided is accurate, and I accept the official{" "}
              <a href="/terms" target="_blank" className="text-[#8CB34A] underline font-medium hover:text-[#A0D056]">
                Terms & Conditions (v1.0)
              </a>{" "}
              and RIF legal defence requirements.
            </label>
          </div>

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
              disabled={!isFormValid || isPending}
              className="h-11 px-6 bg-[#8CB34A] hover:bg-[#A0D056] disabled:bg-[#8CB34A]/50 disabled:cursor-not-allowed text-[#0D0D0B] font-heading font-semibold text-sm rounded-lg transition-colors shadow-[0_0_15px_rgba(140,179,74,0.2)] flex items-center gap-2"
            >
              {isPending ? "Processing Entry..." : `Confirm & Pay — £${totalPrice.toFixed(2)}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
