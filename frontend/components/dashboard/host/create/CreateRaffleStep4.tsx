import React, { useState } from "react";
import { RaffleFormData } from "./CreateRaffleWizard";

interface Props {
  formData: RaffleFormData;
  updateForm: (data: Partial<RaffleFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function CreateRaffleStep4({ formData, updateForm, onNext, onPrev }: Props) {
  const [numInstantWins, setNumInstantWins] = useState(
    formData.instantWins.length > 0 ? formData.instantWins.length.toString() : "1"
  );

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hasInstantWins = e.target.checked;
    updateForm({ hasInstantWins });
    if (hasInstantWins && formData.instantWins.length === 0) {
      updateForm({
        instantWins: Array(parseInt(numInstantWins) || 1).fill({ prizeName: "", imageFile: null, imageUrl: null })
      });
    }
  };

  const handleNumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setNumInstantWins(val);
    const num = parseInt(val) || 0;
    
    if (formData.hasInstantWins) {
      const currentLength = formData.instantWins.length;
      if (num > currentLength) {
        // add more
        const toAdd = Array(num - currentLength).fill({ prizeName: "", imageFile: null, imageUrl: null });
        updateForm({ instantWins: [...formData.instantWins, ...toAdd] });
      } else if (num < currentLength) {
        // remove some
        updateForm({ instantWins: formData.instantWins.slice(0, num) });
      }
    }
  };

  const updateInstantWin = (index: number, field: string, value: any) => {
    const updated = [...formData.instantWins];
    updated[index] = { ...updated[index], [field]: value };
    
    if (field === "imageFile") {
      updated[index].imageUrl = value ? URL.createObjectURL(value) : null;
    }
    
    updateForm({ instantWins: updated });
  };

  const applyToAll = (index: number) => {
    const source = formData.instantWins[index];
    const updated = formData.instantWins.map(iw => ({
      ...iw,
      prizeName: source.prizeName,
      imageFile: source.imageFile,
      imageUrl: source.imageUrl,
    }));
    updateForm({ instantWins: updated });
  };

  const isValid = !formData.hasInstantWins || formData.instantWins.every(iw => iw.prizeName.trim() !== "");

  return (
    <div className="flex flex-col w-full animate-in fade-in zoom-in-95 duration-200">
      <div className="flex flex-col gap-[8px] mb-[32px]">
        <h2 className="font-heading font-bold text-[24px] text-[#e8edd4]">
          Instant Wins
        </h2>
        <p className="font-sans font-normal text-[14px] text-[#a0d056]">
          Would you like to offer instant wins for this competition?
        </p>
      </div>

      <div className="flex flex-col gap-[24px]">
        <label className="flex items-center gap-3 cursor-pointer">
          <input 
            type="checkbox" 
            className="w-5 h-5 rounded border-[#2d3c13] bg-[#1a230a] text-[#8cb34a] focus:ring-[#8cb34a] focus:ring-offset-[#111210]"
            checked={formData.hasInstantWins}
            onChange={handleToggle}
          />
          <span className="font-sans font-medium text-[15px] text-[#e8edd4]">Enable Instant Wins</span>
        </label>

        {formData.hasInstantWins && (
          <div className="flex flex-col gap-[24px] mt-2 border-t border-[#2d3c13] pt-6">
            <div className="flex flex-col gap-[8px]">
              <label className="font-sans font-medium text-[13px] text-[#e8edd4]">
                Number of Instant Wins
              </label>
              <input
                type="number"
                min="1"
                max={formData.totalTickets || "1000"}
                value={numInstantWins}
                onChange={handleNumChange}
                className="w-full sm:w-[200px] h-[48px] bg-[#0d0d0b] border border-[#2d3c13] rounded-[12px] px-[16px] text-[#e8edd4] font-sans text-[15px] focus:outline-none focus:border-[#8cb34a] transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {formData.instantWins.map((iw, idx) => (
                <div key={idx} className="bg-[#0d0d0b] border border-[#2d3c13] rounded-[12px] p-4 flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-[#a0d056] font-semibold text-[14px]">Prize #{idx + 1}</h4>
                    {idx === 0 && formData.instantWins.length > 1 && (
                      <button
                        onClick={() => applyToAll(0)}
                        className="text-[12px] text-[#8cb34a] hover:underline"
                        title="Copy this prize's name and image to all other instant wins"
                      >
                        Apply to all
                      </button>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-[12px] text-[#e8edd4]">Prize Name*</label>
                    <input
                      type="text"
                      value={iw.prizeName}
                      onChange={(e) => updateInstantWin(idx, "prizeName", e.target.value)}
                      placeholder="e.g. £50 Site Credit"
                      className="w-full h-[40px] bg-[#1a230a] border border-[#2d3c13] rounded-[8px] px-[12px] text-[#e8edd4] font-sans text-[14px] focus:outline-none focus:border-[#8cb34a] transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[12px] text-[#e8edd4]">Prize Image</label>
                    <div className="flex items-center gap-3">
                      {iw.imageUrl && (
                        <div className="w-12 h-12 rounded overflow-hidden shrink-0 bg-[#161810]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={iw.imageUrl} alt="preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => updateInstantWin(idx, "imageFile", e.target.files?.[0] || null)}
                        className="text-[12px] text-[#b3b8aa] file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-[12px] file:font-semibold file:bg-[#2d3c13] file:text-[#e8edd4] hover:file:bg-[#43581e] cursor-pointer"
                      />
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-[16px] mt-[48px] pt-[24px] border-t border-[#2d3c13]">
        <button
          onClick={onPrev}
          className="w-full sm:w-auto h-[48px] px-[32px] rounded-[12px] bg-transparent border border-[#2d3c13] hover:bg-[#1a230a] text-[#e8edd4] font-heading font-medium text-[15px] transition-colors"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!isValid}
          className="w-full sm:w-auto h-[48px] px-[32px] rounded-[12px] bg-[#8cb34a] hover:bg-[#a0d056] text-[#0d0d0b] font-heading font-bold text-[15px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
