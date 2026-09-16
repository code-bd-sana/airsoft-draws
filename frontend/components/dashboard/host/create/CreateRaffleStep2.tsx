import React from "react";
import { RaffleFormData } from "./CreateRaffleWizard";

interface Props {
  formData: RaffleFormData;
  updateForm: (data: Partial<RaffleFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function CreateRaffleStep2({ formData, updateForm, onNext, onPrev }: Props) {
  return (
    <div className="flex flex-col w-full animate-in fade-in zoom-in-95 duration-200">
      <div className="flex flex-col gap-[8px] mb-[32px]">
        <h2 className="font-heading font-medium text-[24px] text-[#e8edd4]">
          Tickets & Pricing
        </h2>
        <p className="font-sans font-normal text-[14px] text-[#b3b8aa]">
          Set the parameters for your raffle tickets and expected revenue.
        </p>
      </div>

      <div className="flex flex-col gap-[24px]">
        {/* Main Prize Value */}
        <div className="flex flex-col gap-[8px]">
          <label className="font-sans font-medium text-[13px] text-[#e8edd4]">
            Main Prize Value (£)
          </label>
          <div className="relative">
            <span className="absolute left-[16px] top-1/2 -translate-y-1/2 font-sans font-normal text-[14px] text-[#5a752a]">
              £
            </span>
            <input
              type="number"
              step="0.01"
              value={formData.mainPrizeValue}
              onChange={(e) => updateForm({ mainPrizeValue: e.target.value })}
              placeholder="e.g. 1500.00"
              className="w-full h-[48px] pl-[32px] pr-[16px] bg-[#0d0d0b] border border-[#2d3c13] rounded-[8px] font-sans font-normal text-[14px] text-[#e8edd4] placeholder:text-[#5a752a] outline-none focus:border-[#8cb34a] transition-colors"
            />
          </div>
        </div>

        {/* Total Tickets */}
        <div className="flex flex-col gap-[8px]">
          <label className="font-sans font-medium text-[13px] text-[#e8edd4]">
            Total Number of Tickets
          </label>
          <input
            type="number"
            value={formData.totalTickets}
            onChange={(e) => updateForm({ totalTickets: e.target.value })}
            placeholder="e.g. 500"
            className="h-[48px] px-[16px] bg-[#0d0d0b] border border-[#2d3c13] rounded-[8px] font-sans font-normal text-[14px] text-[#e8edd4] placeholder:text-[#5a752a] outline-none focus:border-[#8cb34a] transition-colors"
          />
        </div>

        {/* Ticket Price */}
        <div className="flex flex-col gap-[8px]">
          <label className="font-sans font-medium text-[13px] text-[#e8edd4]">
            Ticket Price (£)
          </label>
          <div className="relative">
            <span className="absolute left-[16px] top-1/2 -translate-y-1/2 font-sans font-normal text-[14px] text-[#5a752a]">
              £
            </span>
            <input
              type="number"
              step="0.01"
              value={formData.ticketPrice}
              onChange={(e) => updateForm({ ticketPrice: e.target.value })}
              placeholder="e.g. 2.50"
              className="w-full h-[48px] pl-[32px] pr-[16px] bg-[#0d0d0b] border border-[#2d3c13] rounded-[8px] font-sans font-normal text-[14px] text-[#e8edd4] placeholder:text-[#5a752a] outline-none focus:border-[#8cb34a] transition-colors"
            />
          </div>
        </div>

        {/* Entrant Limits: Minimum & Maximum Tickets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
          {/* Minimum Tickets Per Order */}
          <div className="flex flex-col gap-[8px]">
            <div className="flex items-center justify-between">
              <label className="font-sans font-medium text-[13px] text-[#e8edd4]">
                Minimum Tickets Per Order
              </label>
              <span className="font-sans text-[11px] text-[#8cb34a]">Default: 1</span>
            </div>
            <input
              type="number"
              min="1"
              value={formData.minTickets}
              onChange={(e) => updateForm({ minTickets: e.target.value })}
              placeholder="e.g. 1"
              className="h-[48px] px-[16px] bg-[#0d0d0b] border border-[#2d3c13] rounded-[8px] font-sans font-normal text-[14px] text-[#e8edd4] placeholder:text-[#5a752a] outline-none focus:border-[#8cb34a] transition-colors"
            />
            <span className="font-sans text-[12px] text-[#8c9477]">
              The minimum number of tickets an entrant must purchase in an order.
            </span>
          </div>

          {/* Maximum Tickets Per Entrant */}
          <div className="flex flex-col gap-[8px]">
            <div className="flex items-center justify-between">
              <label className="font-sans font-medium text-[13px] text-[#e8edd4]">
                Maximum Tickets Per Entrant
              </label>
              <span className="font-sans text-[11px] text-[#8c9477]">Optional</span>
            </div>
            <input
              type="number"
              min="1"
              value={formData.maxTickets || ""}
              onChange={(e) => updateForm({ maxTickets: e.target.value })}
              placeholder="e.g. 25 (blank = unlimited)"
              className="h-[48px] px-[16px] bg-[#0d0d0b] border border-[#2d3c13] rounded-[8px] font-sans font-normal text-[14px] text-[#e8edd4] placeholder:text-[#5a752a] outline-none focus:border-[#8cb34a] transition-colors"
            />
            <span className="font-sans text-[12px] text-[#8c9477]">
              Caps total tickets any single user can hold for this raffle.
            </span>
          </div>
        </div>

        {/* Validation Errors */}
        {formData.maxTickets && formData.minTickets && Number(formData.maxTickets) < Number(formData.minTickets) && (
          <p className="text-red-400 text-xs font-sans mt-[-12px]">
            Maximum tickets ({formData.maxTickets}) cannot be less than minimum tickets ({formData.minTickets}).
          </p>
        )}
        {formData.maxTickets && formData.totalTickets && Number(formData.maxTickets) > Number(formData.totalTickets) && (
          <p className="text-red-400 text-xs font-sans mt-[-12px]">
            Maximum tickets per entrant ({formData.maxTickets}) cannot exceed total tickets ({formData.totalTickets}).
          </p>
        )}
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
          onClick={onNext}
          disabled={
            !formData.totalTickets ||
            !formData.ticketPrice ||
            (!!formData.maxTickets && !!formData.minTickets && Number(formData.maxTickets) < Number(formData.minTickets)) ||
            (!!formData.maxTickets && !!formData.totalTickets && Number(formData.maxTickets) > Number(formData.totalTickets))
          }
          className="h-[48px] px-[32px] bg-[#8cb34a] disabled:bg-[#8cb34a]/50 disabled:cursor-not-allowed hover:bg-[#72943a] transition-colors rounded-[8px] flex items-center justify-center"
        >
          <span className="font-heading font-medium text-[16px] text-[#0d0d0b]">
            Next Step
          </span>
        </button>
      </div>
    </div>
  );
}
