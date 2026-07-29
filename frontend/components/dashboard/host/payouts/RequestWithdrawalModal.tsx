"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRequestWithdrawalMutation } from "../../../../hooks/useHostWalletHooks";
import { cn } from "../../../../lib/utils";

interface RequestWithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
}

export default function RequestWithdrawalModal({
  isOpen,
  onClose,
  availableBalance,
}: RequestWithdrawalModalProps) {
  const [mounted, setMounted] = useState(false);
  const [amount, setAmount] = useState<string>("");
  const [payoutMethod, setPayoutMethod] = useState<"BANK_TRANSFER" | "PAYPAL">("BANK_TRANSFER");

  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Bank transfer details
  const [accountHolderName, setAccountHolderName] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [sortCode, setSortCode] = useState("");
  
  // PayPal detail
  const [paypalEmail, setPaypalEmail] = useState("");

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const withdrawMutation = useRequestWithdrawalMutation();

  if (!isOpen || !mounted) return null;

  const numAmount = parseFloat(amount) || 0;
  const feeAmount = numAmount * 0.10;
  const netAmount = numAmount * 0.90;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (numAmount < 10) {
      setErrorMessage("Minimum withdrawal amount is £10.00");
      return;
    }

    if (numAmount > availableBalance) {
      setErrorMessage(`Cannot withdraw more than your available balance (£${availableBalance.toFixed(2)})`);
      return;
    }

    let payoutDetails: Record<string, any> = {};

    if (payoutMethod === "BANK_TRANSFER") {
      if (!accountHolderName.trim() || !bankName.trim() || !accountNumber.trim()) {
        setErrorMessage("Please complete all required bank account fields.");
        return;
      }
      payoutDetails = {
        accountHolderName: accountHolderName.trim(),
        bankName: bankName.trim(),
        accountNumber: accountNumber.trim(),
        sortCode: sortCode.trim(),
      };
    } else {
      if (!paypalEmail.trim() || !paypalEmail.includes("@")) {
        setErrorMessage("Please provide a valid PayPal email address.");
        return;
      }
      payoutDetails = {
        paypalEmail: paypalEmail.trim(),
      };
    }

    withdrawMutation.mutate(
      {
        amount: numAmount,
        payoutMethod,
        payoutDetails,
      },
      {
        onSuccess: (res) => {
          setSuccessMessage("Withdrawal request submitted successfully! Your payout is now in processing.");
          setTimeout(() => {
            setSuccessMessage(null);
            onClose();
          }, 2000);
        },
        onError: (err: any) => {
          setErrorMessage(err.response?.data?.message || err.message || "Failed to submit withdrawal request.");
        },
      }
    );
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#161810] border border-[#2d3c13] rounded-[20px] w-full max-w-[540px] overflow-hidden shadow-2xl flex flex-col z-[10000]">
        
        {/* Header */}
        <div className="p-6 border-b border-[#2d3c13] flex items-center justify-between bg-[#111210]">
          <div>
            <h3 className="font-heading font-bold text-[20px] text-[#e8edd4]">
              Request Payout Withdrawal
            </h3>
            <p className="font-sans text-[13px] text-[#8cb34a] mt-0.5">
              Available Balance: <strong className="text-[#a0d056]">£{availableBalance.toFixed(2)}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#72943a] hover:text-[#e8edd4] transition-colors p-1 rounded-lg hover:bg-[#1a230a]"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[80vh]">
          
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-800/50 text-red-200 text-xs font-sans">
              ⚠️ {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-800/50 text-emerald-200 text-xs font-sans">
              ✅ {successMessage}
            </div>
          )}

          {/* Amount Input */}
          <div className="space-y-1.5">
            <label className="block text-[12px] font-sans font-medium text-[#b3b8aa] uppercase tracking-wider">
              Withdrawal Amount (£)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8cb34a] font-bold text-lg">£</span>
              <input
                type="number"
                step="0.01"
                min="10"
                max={availableBalance}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full h-12 pl-9 pr-20 bg-[#0d0d0b] border border-[#2d3c13] rounded-xl text-[#e8edd4] font-heading text-lg font-bold focus:outline-none focus:border-[#8cb34a] transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setAmount(availableBalance.toString())}
                className="absolute right-3 top-1/2 -translate-y-1/2 px-2.5 py-1 text-xs font-sans font-bold bg-[#1a230a] text-[#a0d056] border border-[#2d3c13] rounded-lg hover:bg-[#2d3c13] transition-colors"
              >
                Max
              </button>
            </div>
          </div>

          {/* 10% Fee Breakdown Card */}
          <div className="bg-[#111210] border border-[#2d3c13] rounded-xl p-4 space-y-2 text-xs font-sans">
            <div className="flex justify-between text-[#b3b8aa]">
              <span>Requested Gross Amount:</span>
              <span className="font-semibold text-[#e8edd4]">£{numAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[#f76b6b]">
              <span>Platform Fee (10%):</span>
              <span className="font-semibold">-£{feeAmount.toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-[#2d3c13] flex justify-between text-sm font-bold">
              <span className="text-[#8cb34a]">Net Amount You Receive:</span>
              <span className="text-[#a0d056]">£{netAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Payout Method Tabs */}
          <div className="space-y-1.5">
            <label className="block text-[12px] font-sans font-medium text-[#b3b8aa] uppercase tracking-wider">
              Select Payout Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPayoutMethod("BANK_TRANSFER")}
                className={cn(
                  "p-3.5 rounded-xl border font-sans text-xs font-semibold flex items-center justify-center gap-2 transition-all",
                  payoutMethod === "BANK_TRANSFER"
                    ? "bg-[#1a230a] border-[#8cb34a] text-[#a0d056] shadow-sm"
                    : "bg-[#0d0d0b] border-[#2d3c13] text-[#72943a] hover:bg-[#111210]"
                )}
              >
                🏦 Bank Transfer
              </button>

              <button
                type="button"
                onClick={() => setPayoutMethod("PAYPAL")}
                className={cn(
                  "p-3.5 rounded-xl border font-sans text-xs font-semibold flex items-center justify-center gap-2 transition-all",
                  payoutMethod === "PAYPAL"
                    ? "bg-[#1a230a] border-[#8cb34a] text-[#a0d056] shadow-sm"
                    : "bg-[#0d0d0b] border-[#2d3c13] text-[#72943a] hover:bg-[#111210]"
                )}
              >
                🅿️ PayPal
              </button>
            </div>
          </div>

          {/* Conditional Fields based on method */}
          {payoutMethod === "BANK_TRANSFER" ? (
            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-xs text-[#b3b8aa] mb-1 font-sans">Account Holder Name *</label>
                <input
                  type="text"
                  value={accountHolderName}
                  onChange={(e) => setAccountHolderName(e.target.value)}
                  placeholder="e.g. John Doe / Business Ltd"
                  className="w-full h-10 px-3.5 bg-[#0d0d0b] border border-[#2d3c13] rounded-lg text-xs text-[#e8edd4] focus:outline-none focus:border-[#8cb34a]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#b3b8aa] mb-1 font-sans">Bank Name *</label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="e.g. Barclays / HSBC"
                    className="w-full h-10 px-3.5 bg-[#0d0d0b] border border-[#2d3c13] rounded-lg text-xs text-[#e8edd4] focus:outline-none focus:border-[#8cb34a]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#b3b8aa] mb-1 font-sans">Sort Code / Routing</label>
                  <input
                    type="text"
                    value={sortCode}
                    onChange={(e) => setSortCode(e.target.value)}
                    placeholder="e.g. 12-34-56"
                    className="w-full h-10 px-3.5 bg-[#0d0d0b] border border-[#2d3c13] rounded-lg text-xs text-[#e8edd4] focus:outline-none focus:border-[#8cb34a]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#b3b8aa] mb-1 font-sans">Account Number / IBAN *</label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="e.g. 12345678 or GB82 WEST 1234 5678"
                  className="w-full h-10 px-3.5 bg-[#0d0d0b] border border-[#2d3c13] rounded-lg text-xs text-[#e8edd4] focus:outline-none focus:border-[#8cb34a]"
                  required
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-xs text-[#b3b8aa] mb-1 font-sans">PayPal Email Address *</label>
                <input
                  type="email"
                  value={paypalEmail}
                  onChange={(e) => setPaypalEmail(e.target.value)}
                  placeholder="your-paypal-email@domain.com"
                  className="w-full h-10 px-3.5 bg-[#0d0d0b] border border-[#2d3c13] rounded-lg text-xs text-[#e8edd4] focus:outline-none focus:border-[#8cb34a]"
                  required
                />
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#2d3c13]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#2d3c13] text-xs font-sans font-semibold text-[#b3b8aa] hover:bg-[#1a230a] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={withdrawMutation.isPending || numAmount <= 0}
              className="px-6 py-2.5 rounded-xl bg-[#8cb34a] hover:bg-[#a0d056] text-[#0d0d0b] font-sans font-bold text-xs shadow-lg transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {withdrawMutation.isPending ? "Submitting..." : `Confirm & Withdraw £${netAmount.toFixed(2)}`}
            </button>
          </div>

        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
