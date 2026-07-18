import React from "react";
import { RaffleFormData } from "./CreateRaffleWizard";
import { cn } from "../../../../lib/utils";

interface Props {
  formData: RaffleFormData;
  onPrev: () => void;
  onPublish: () => void;
  isSubmitting?: boolean;
}

export default function CreateRaffleStep6({ formData, onPrev, onPublish, isSubmitting = false }: Props) {
  // Calculate potential earnings
  const tickets = parseInt(formData.totalTickets) || 0;
  const price = parseFloat(formData.ticketPrice) || 0;
  const gross = tickets * price;
  const platformFee = gross * 0.1; // 10% demo
  const net = gross - platformFee;

  return (
    <div className="flex flex-col w-full animate-in fade-in zoom-in-95 duration-200">
      <div className="flex flex-col gap-[8px] mb-[32px]">
        <h2 className="font-heading font-medium text-[24px] text-[#e8edd4]">
          Review & Publish
        </h2>
        <p className="font-sans font-normal text-[14px] text-[#b3b8aa]">
          Review your raffle details carefully before making it live.
        </p>
      </div>

      <div className="flex flex-col gap-[24px]">
        
        {/* Basic Details Summary */}
        <div className="flex flex-col p-[24px] bg-[#0d0d0b] border border-[#2d3c13] rounded-[16px] gap-[16px]">
          <h3 className="font-heading font-medium text-[16px] text-[#e8edd4] border-b border-[#1a230a] pb-2">
            Basic Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
            <div className="flex flex-col gap-[4px]">
              <span className="font-sans font-medium text-[11px] uppercase text-[#5a752a]">Title</span>
              <span className="font-sans font-medium text-[14px] text-[#e8edd4]">{formData.title || "—"}</span>
            </div>
            <div className="flex flex-col gap-[4px]">
              <span className="font-sans font-medium text-[11px] uppercase text-[#5a752a]">Category</span>
              <span className="font-sans font-medium text-[14px] text-[#e8edd4]">{formData.category || "—"}</span>
            </div>
            <div className="flex flex-col gap-[4px]">
              <span className="font-sans font-medium text-[11px] uppercase text-[#5a752a]">Main Prize Value</span>
              <span className="font-sans font-medium text-[14px] text-[#e8edd4]">{formData.mainPrizeValue ? `£${formData.mainPrizeValue}` : "—"}</span>
            </div>
            <div className="flex flex-col gap-[4px] sm:col-span-2">
              <span className="font-sans font-medium text-[11px] uppercase text-[#5a752a]">Description</span>
              <p className="font-sans font-normal text-[14px] text-[#e8edd4] whitespace-pre-wrap">{formData.description || "—"}</p>
            </div>
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="flex flex-col p-[24px] bg-[#0d0d0b] border border-[#2d3c13] rounded-[16px] gap-[16px]">
          <h3 className="font-heading font-medium text-[16px] text-[#e8edd4] border-b border-[#1a230a] pb-2">
            Pricing & Projections
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-[16px]">
            <div className="flex flex-col gap-[4px]">
              <span className="font-sans font-medium text-[11px] uppercase text-[#5a752a]">Tickets</span>
              <span className="font-sans font-medium text-[16px] text-[#e8edd4]">{formData.totalTickets || "0"}</span>
            </div>
            <div className="flex flex-col gap-[4px]">
              <span className="font-sans font-medium text-[11px] uppercase text-[#5a752a]">Price</span>
              <span className="font-sans font-medium text-[16px] text-[#e8edd4]">£{price.toFixed(2)}</span>
            </div>
            <div className="flex flex-col gap-[4px]">
              <span className="font-sans font-medium text-[11px] uppercase text-[#5a752a]">Platform Fee</span>
              <span className="font-sans font-medium text-[16px] text-[#f76b6b]">-£{platformFee.toFixed(2)}</span>
            </div>
            <div className="flex flex-col gap-[4px]">
              <span className="font-sans font-medium text-[11px] uppercase text-[#5a752a]">Est. Earnings</span>
              <span className="font-heading font-bold text-[18px] text-[#8cb34a]">£{net.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Schedule Summary */}
        <div className="flex flex-col p-[24px] bg-[#0d0d0b] border border-[#2d3c13] rounded-[16px] gap-[16px]">
          <h3 className="font-heading font-medium text-[16px] text-[#e8edd4] border-b border-[#1a230a] pb-2">
            Schedule & Settings
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
            <div className="flex flex-col gap-[4px]">
              <span className="font-sans font-medium text-[11px] uppercase text-[#5a752a]">Start Date</span>
              <span className="font-sans font-medium text-[14px] text-[#e8edd4]">
                {formData.startDate ? new Date(formData.startDate).toLocaleString() : "—"}
              </span>
            </div>
            <div className="flex flex-col gap-[4px]">
              <span className="font-sans font-medium text-[11px] uppercase text-[#5a752a]">Draw Date</span>
              <span className="font-sans font-medium text-[14px] text-[#e8edd4]">
                {formData.endDate ? new Date(formData.endDate).toLocaleString() : "—"}
              </span>
            </div>
            <div className="flex flex-col gap-[4px]">
              <span className="font-sans font-medium text-[11px] uppercase text-[#5a752a]">Auto Draw</span>
              <span className={cn("font-sans font-medium text-[14px]", formData.isAutoDraw ? "text-[#8cb34a]" : "text-[#5a752a]")}>
                {formData.isAutoDraw ? "Enabled" : "Disabled"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between mt-[40px] pt-[24px] border-t border-[#2d3c13]">
        <button
          onClick={onPrev}
          className="h-[48px] px-[24px] bg-transparent border border-[#2d3c13] hover:bg-[#1a230a] text-[#5a752a] hover:text-[#e8edd4] transition-colors rounded-[8px] flex items-center justify-center font-sans font-medium text-[14px]"
        >
          Back
        </button>
        <button
          onClick={onPublish}
          disabled={isSubmitting}
          className="h-[48px] px-[32px] bg-[#8cb34a] hover:bg-[#72943a] transition-colors rounded-[8px] flex items-center gap-[8px] justify-center shadow-[0_0_20px_rgba(140,179,74,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="font-heading font-medium text-[16px] text-[#0d0d0b]">
            {isSubmitting ? "Publishing..." : "Publish Raffle"}
          </span>
          {!isSubmitting && (
            <svg className="w-5 h-5 text-[#0d0d0b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
