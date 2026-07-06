import React from "react";
import { RaffleFormData } from "./CreateRaffleWizard";

interface Props {
  formData: RaffleFormData;
  updateForm: (data: Partial<RaffleFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
  setImageFile: (file: File | null) => void;
}

export default function CreateRaffleStep3({ formData, updateForm, onNext, onPrev, setImageFile }: Props) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      updateForm({ coverImage: url });
    }
  };

  const handleClearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateForm({ coverImage: null });
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col w-full animate-in fade-in zoom-in-95 duration-200">
      <div className="flex flex-col gap-[8px] mb-[32px]">
        <h2 className="font-heading font-medium text-[24px] text-[#e8edd4]">
          Media & Images
        </h2>
        <p className="font-sans font-normal text-[14px] text-[#b3b8aa]">
          Upload high-quality images of the prize. The first image will be the cover.
        </p>
      </div>

      <div className="flex flex-col gap-[24px]">
        {/* Main Cover Image Upload */}
        <div className="flex flex-col gap-[8px]">
          <label className="font-sans font-medium text-[13px] text-[#e8edd4]">
            Cover Image
          </label>
          <div 
            onClick={!formData.coverImage ? handleUploadClick : undefined}
            className={`w-full h-[240px] border-2 border-dashed rounded-[16px] flex flex-col items-center justify-center transition-colors relative overflow-hidden group ${
              formData.coverImage 
                ? "border-[#2d3c13] bg-[#0d0d0b]" 
                : "border-[#2d3c13] hover:border-[#8cb34a] hover:bg-[#1a230a]/50 cursor-pointer bg-[#0d0d0b]"
            }`}
          >
            {formData.coverImage ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={formData.coverImage} 
                  alt="Cover preview" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    onClick={handleClearImage}
                    className="h-[40px] px-[16px] bg-[#f76b6b] text-white font-sans font-medium text-[13px] rounded-[8px] hover:bg-[#ef4444] transition-colors"
                  >
                    Remove Image
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="w-[48px] h-[48px] rounded-full bg-[#1a230a] flex items-center justify-center mb-[16px]">
                  <svg className="w-6 h-6 text-[#8cb34a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                  </svg>
                </div>
                <span className="font-sans font-medium text-[14px] text-[#e8edd4]">
                  Click to upload cover image
                </span>
                <span className="font-sans font-normal text-[12px] text-[#5a752a] mt-1">
                  SVG, PNG, JPG or GIF (max. 800x400px)
                </span>
              </>
            )}
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
            />
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
          disabled={!formData.coverImage}
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
