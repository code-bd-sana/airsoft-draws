import React from "react";
import { cn } from "../../../../lib/utils";

interface CreateRaffleStepperProps {
  currentStep: number;
  totalSteps: number;
}

const steps = [
  "Basic Info",
  "Prize Details",
  "Media",
  "Ticket Settings",
  "Review & Submit",
];

export default function CreateRaffleStepper({ currentStep, totalSteps }: CreateRaffleStepperProps) {
  return (
    <div className="w-full flex items-start justify-between relative mb-[40px] px-[20px]">
      {steps.map((label, index) => {
        const stepNum = index + 1;
        const isCompleted = stepNum < currentStep;
        const isActive = stepNum === currentStep;
        const isPending = stepNum > currentStep;
        const isLast = index === steps.length - 1;

        return (
          <React.Fragment key={label}>
            {/* Step Item */}
            <div className="flex flex-col items-center gap-[12px] relative z-10 w-[80px] shrink-0">
              <div
                className={cn(
                  "w-[32px] h-[32px] rounded-full flex items-center justify-center font-sans font-medium text-[13px] transition-colors border",
                  isCompleted && "bg-[#161810] border-[#43581e] text-[#8cb34a]",
                  isActive && "bg-[#8cb34a] border-[#8cb34a] text-[#0d0d0b]",
                  isPending && "bg-[#161810] border-[#2d3c13] text-[#43581e]"
                )}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : (
                  stepNum
                )}
              </div>
              <span
                className={cn(
                  "font-sans font-medium text-[11px] text-center whitespace-nowrap",
                  (isCompleted || isActive) ? "text-[#e8edd4]" : "text-[#43581e]"
                )}
              >
                {stepNum}. {label}
              </span>
            </div>

            {/* Connecting Line */}
            {!isLast && (
              <div className="flex-1 h-[2px] mt-[15px] mx-[8px] shrink">
                <div 
                  className={cn(
                    "w-full h-full transition-colors",
                    isCompleted ? "bg-[#2d3c13]" : "bg-[#1a230a]"
                  )}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
