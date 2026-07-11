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
                  Automated Draw
                </span>
                <span className="font-sans font-normal text-[12px] text-[#5a752a]">
                  If disabled, you must manually run the draw from your dashboard.
                </span>
              </div>
              <div 
                onClick={() => updateForm({ isAutoDraw: !formData.isAutoDraw })}
                className={cn(
                  "w-[40px] h-[24px] rounded-full p-[2px] transition-colors duration-200 ease-in-out shrink-0 cursor-pointer",
                  formData.isAutoDraw ? "bg-[#8cb34a]" : "bg-[#2d3c13]"
                )}
              >
                <div className={cn(
                  "w-[20px] h-[20px] bg-[#0d0d0b] rounded-full transition-transform duration-200 ease-in-out",
                  formData.isAutoDraw ? "translate-x-[16px]" : "translate-x-0"
                )} />
              </div>
            </div>

            {formData.isAutoDraw && (
              <div className="flex flex-col gap-[12px] mt-[8px] pt-[16px] border-t border-[#2d3c13]">
                <label className="flex items-center gap-[12px] cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={formData.autoDrawDate}
                    onChange={(e) => updateForm({ autoDrawDate: e.target.checked })}
                    className="w-[16px] h-[16px] rounded-[4px] border-[#2d3c13] bg-[#161810] text-[#8cb34a] focus:ring-[#8cb34a]"
                  />
                  <span className="font-sans font-normal text-[13px] text-[#b3b8aa]">
                    Run draw automatically when the <strong className="text-[#e8edd4]">Draw Date & Time</strong> ends.
                  </span>
                </label>
                <label className="flex items-center gap-[12px] cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={formData.autoDrawSoldOut}
                    onChange={(e) => updateForm({ autoDrawSoldOut: e.target.checked })}
                    className="w-[16px] h-[16px] rounded-[4px] border-[#2d3c13] bg-[#161810] text-[#8cb34a] focus:ring-[#8cb34a]"
                  />
                  <span className="font-sans font-normal text-[13px] text-[#b3b8aa]">
                    Run draw automatically as soon as <strong className="text-[#e8edd4]">all tickets are sold</strong>.
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* Guaranteed Draw */}
          <div 
            onClick={() => updateForm({ guaranteedDraw: !formData.guaranteedDraw })}
            className="flex items-center justify-between p-[16px] bg-[#0d0d0b] border border-[#2d3c13] rounded-[8px] cursor-pointer hover:border-[#8cb34a] transition-colors"
          >
            <div className="flex flex-col gap-[4px]">
              <span className="font-sans font-medium text-[14px] text-[#e8edd4]">
                Guaranteed Draw
              </span>
              <span className="font-sans font-normal text-[12px] text-[#5a752a]">
                Draw will take place regardless of ticket sales volume.
              </span>
            </div>
            <div className={cn(
              "w-[40px] h-[24px] rounded-full p-[2px] transition-colors duration-200 ease-in-out shrink-0",
              formData.guaranteedDraw ? "bg-[#8cb34a]" : "bg-[#2d3c13]"
            )}>
              <div className={cn(
                "w-[20px] h-[20px] bg-[#0d0d0b] rounded-full transition-transform duration-200 ease-in-out",
                formData.guaranteedDraw ? "translate-x-[16px]" : "translate-x-0"
              )} />
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
