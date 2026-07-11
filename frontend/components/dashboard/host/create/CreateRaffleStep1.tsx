import React from "react";
import { RaffleFormData } from "./CreateRaffleWizard";

interface Props {
  formData: RaffleFormData;
  updateForm: (data: Partial<RaffleFormData>) => void;
  onNext: () => void;
}

const categories = [
  "Airsoft Rifles",
  "Airsoft Pistols",
  "Tactical Gear",
  "Accessories",
  "Sniper Rifles",
  "Bundles",
];

export default function CreateRaffleStep1({ formData, updateForm, onNext }: Props) {
  return (
    <div className="flex flex-col w-full animate-in fade-in zoom-in-95 duration-200">
      <div className="flex flex-col gap-[8px] mb-[32px]">
        <h2 className="font-heading font-medium text-[24px] text-[#e8edd4]">
          Basic Details
        </h2>
        <p className="font-sans font-normal text-[14px] text-[#b3b8aa]">
          Start by giving your raffle a catchy title and clear description.
        </p>
      </div>

      <div className="flex flex-col gap-[24px]">
        {/* Title */}
        <div className="flex flex-col gap-[8px]">
          <label className="font-sans font-medium text-[13px] text-[#e8edd4]">
            Raffle Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => updateForm({ title: e.target.value })}
            placeholder="e.g. Tokyo Marui Next Gen HK416"
            className="h-[48px] px-[16px] bg-[#0d0d0b] border border-[#2d3c13] rounded-[8px] font-sans font-normal text-[14px] text-[#e8edd4] placeholder:text-[#5a752a] outline-none focus:border-[#8cb34a] transition-colors"
          />
        </div>

        {/* Category */}
        <div className="flex flex-col gap-[8px]">
          <label className="font-sans font-medium text-[13px] text-[#e8edd4]">
            Category
          </label>
          <div className="relative">
            <select
              value={formData.category}
              onChange={(e) => updateForm({ category: e.target.value })}
              className="w-full h-[48px] px-[16px] bg-[#0d0d0b] border border-[#2d3c13] rounded-[8px] font-sans font-normal text-[14px] text-[#e8edd4] outline-none focus:border-[#8cb34a] transition-colors appearance-none cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <svg
              className="w-5 h-5 text-[#5a752a] absolute right-[16px] top-1/2 -translate-y-1/2 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-[8px]">
          <label className="font-sans font-medium text-[13px] text-[#e8edd4]">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => updateForm({ description: e.target.value })}
            placeholder="Describe the item, condition, and any rules..."
            className="h-[140px] p-[16px] bg-[#0d0d0b] border border-[#2d3c13] rounded-[8px] font-sans font-normal text-[14px] text-[#e8edd4] placeholder:text-[#5a752a] outline-none focus:border-[#8cb34a] transition-colors resize-none"
          />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-end mt-[40px] pt-[24px] border-t border-[#2d3c13]">
        <button
          onClick={onNext}
          disabled={!formData.title.trim()}
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
