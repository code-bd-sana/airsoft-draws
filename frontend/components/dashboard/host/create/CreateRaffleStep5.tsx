import React from "react";
import { RaffleFormData } from "./CreateRaffleWizard";
import { cn } from "../../../../lib/utils";

interface Props {
  formData: RaffleFormData;
  updateForm: (data: Partial<RaffleFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function CreateRaffleStep5({ formData, updateForm, onNext, onPrev }: Props) {
  return (
    <div className="flex flex-col w-full animate-in fade-in zoom-in-95 duration-200">
      <div className="flex flex-col gap-[8px] mb-[32px]">
        <h2 className="font-heading font-medium text-[24px] text-[#e8edd4]">
          Schedule & Rules
        </h2>
        <p className="font-sans font-normal text-[14px] text-[#b3b8aa]">
          Determine when your raffle goes live and when the winner is drawn.
        </p>
      </div>

      <div className="flex flex-col gap-[24px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
          {/* Start Date */}
          <div className="flex flex-col gap-[8px]">
            <label className="font-sans font-medium text-[13px] text-[#e8edd4]">
              Start Date & Time
            </label>
            <input
              type="datetime-local"
              value={formData.startDate}
              onChange={(e) => updateForm({ startDate: e.target.value })}
              className="h-[48px] px-[16px] bg-[#0d0d0b] border border-[#2d3c13] rounded-[8px] font-sans font-normal text-[14px] text-[#e8edd4] placeholder:text-[#5a752a] outline-none focus:border-[#8cb34a] transition-colors [color-scheme:dark]"
            />
          </div>

          {/* End Date */}
          <div className="flex flex-col gap-[8px]">
            <label className="font-sans font-medium text-[13px] text-[#e8edd4]">
              Draw Date & Time
            </label>
            <input
              type="datetime-local"
              value={formData.endDate}
              onChange={(e) => updateForm({ endDate: e.target.value })}
              className="h-[48px] px-[16px] bg-[#0d0d0b] border border-[#2d3c13] rounded-[8px] font-sans font-normal text-[14px] text-[#e8edd4] placeholder:text-[#5a752a] outline-none focus:border-[#8cb34a] transition-colors [color-scheme:dark]"
            />
          </div>
        </div>

        {/* Toggles */}
        <div className="flex flex-col gap-[16px] mt-[16px]">
          {/* Draw Strategy: Manual vs Auto */}
          <div className="flex flex-col gap-[16px] p-[16px] bg-[#0d0d0b] border border-[#2d3c13] rounded-[8px]">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-[4px]">
                <span className="font-sans font-medium text-[14px] text-[#e8edd4]">
                  Draw Type
                </span>
                <span className="font-sans font-normal text-[12px] text-[#5a752a]">
                  How will the winner be selected?
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-[12px] mt-[8px] pt-[16px] border-t border-[#2d3c13]">
              <label className="flex items-start gap-[12px] cursor-pointer">
                <input 
                  type="radio"
                  name="drawType"
                  checked={!formData.isAutoDraw}
                  onChange={() => updateForm({ isAutoDraw: false, autoDrawDate: false, autoDrawSoldOut: false })}
                  className="mt-1 w-[16px] h-[16px] rounded-full border-[#2d3c13] bg-[#161810] text-[#8cb34a] focus:ring-[#8cb34a]"
                />
                <div className="flex flex-col gap-1">
                  <span className="font-sans font-medium text-[14px] text-[#e8edd4]">
                    Live Draw
                  </span>
                  <span className="font-sans font-normal text-[12px] text-[#b3b8aa]">
                    You will manually run the draw from your dashboard (e.g., live on Instagram).
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-[12px] cursor-pointer">
                <input 
                  type="radio"
                  name="drawType"
                  checked={formData.isAutoDraw}
                  onChange={() => updateForm({ isAutoDraw: true, autoDrawDate: true, autoDrawSoldOut: true })}
                  className="mt-1 w-[16px] h-[16px] rounded-full border-[#2d3c13] bg-[#161810] text-[#8cb34a] focus:ring-[#8cb34a]"
                />
                <div className="flex flex-col gap-1">
                  <span className="font-sans font-medium text-[14px] text-[#e8edd4]">
                    Automatic Draw
                  </span>
                  <span className="font-sans font-normal text-[12px] text-[#b3b8aa]">
                    System automatically draws a winner when all tickets are sold out OR the end time expires.
                  </span>
                </div>
              </label>
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
          onClick={onNext}
          disabled={!formData.startDate || !formData.endDate}
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
