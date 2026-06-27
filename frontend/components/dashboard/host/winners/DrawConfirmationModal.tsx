import React from "react";
import { HostDrawItem } from "../../../../types/host-dashboard.types";

interface Props {
  draw: HostDrawItem;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DrawConfirmationModal({ draw, isOpen, onClose, onConfirm }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d0d0b]/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#161810] border border-[#2d3c13] rounded-[16px] p-[32px] w-full max-w-[480px] flex flex-col items-center shadow-2xl animate-in zoom-in-95 duration-200">
        
        <div className="w-[64px] h-[64px] rounded-full bg-[#8cb34a]/10 flex items-center justify-center mb-[24px]">
          {/* Trophy icon */}
          <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#8cb34a" className="w-[32px] h-[32px]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
          </svg>
        </div>

        <h2 className="font-heading font-medium text-[24px] text-[#e8edd4] mb-[12px] text-center">
          Confirm Random Draw
        </h2>
        
        <p className="font-sans font-normal text-[15px] text-[#b3b8aa] text-center mb-[32px] leading-relaxed">
          This will randomly select 1 winner from <span className="text-[#8cb34a] font-medium">{draw.verifiedEntries}</span> verified entries for <strong>{draw.name}</strong>. This action cannot be undone.
        </p>

        <div className="flex flex-col w-full gap-[12px]">
          <button 
            onClick={onConfirm}
            className="w-full h-[48px] bg-[#8cb34a] hover:bg-[#72943a] transition-colors rounded-[8px] flex items-center justify-center"
          >
            <span className="font-heading font-medium text-[15px] text-[#0d0d0b]">
              Confirm & Draw Winner
            </span>
          </button>
          
          <button 
            onClick={onClose}
            className="w-full h-[48px] bg-transparent border border-[#2d3c13] hover:bg-[#1a230a] transition-colors rounded-[8px] flex items-center justify-center"
          >
            <span className="font-heading font-medium text-[15px] text-[#e8edd4]">
              Cancel
            </span>
          </button>
        </div>

      </div>
    </div>
  );
}
