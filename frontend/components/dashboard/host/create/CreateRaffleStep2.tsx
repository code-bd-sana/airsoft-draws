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

        {/* Minimum Tickets (Optional depending on design, I'll add it) */}
        <div className="flex flex-col gap-[8px]">
          <label className="font-sans font-medium text-[13px] text-[#e8edd4]">
            Minimum Tickets Per Person (Optional)
          </label>
          <input
            type="number"
            value={formData.minTickets}
            onChange={(e) => updateForm({ minTickets: e.target.value })}
            placeholder="e.g. 1"
            className="h-[48px] px-[16px] bg-[#0d0d0b] border border-[#2d3c13] rounded-[8px] font-sans font-normal text-[14px] text-[#e8edd4] placeholder:text-[#5a752a] outline-none focus:border-[#8cb34a] transition-colors"
          />
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
          onClick={onNext}
          disabled={!formData.totalTickets || !formData.ticketPrice}
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
