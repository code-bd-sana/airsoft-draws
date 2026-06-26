import React from "react";
import { cn } from "../../../lib/utils";

interface TextareaFieldProps {
  label: string;
  id: string;
  name: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
}

/**
 * Reusable form textarea element matching the Airsoft Draws styling system.
 */
export default function TextareaField({
  label,
  id,
  name,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  rows = 5,
}: TextareaFieldProps) {
  return (
    <div className="flex flex-col w-full">
      <label
        htmlFor={id}
        className="font-sans font-medium text-xs md:text-sm text-text-secondary mb-1.5 self-start select-none"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        rows={rows}
        className={cn(
          "w-full bg-bg border border-border rounded-button px-4 py-3 font-sans text-xs md:text-sm text-text-primary placeholder:text-text-muted/40 transition-all duration-200 outline-none resize-none",
          error
            ? "border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500/30"
            : "focus:border-primary focus:ring-1 focus:ring-primary/20",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      />
      {error && (
        <span className="font-sans text-[11px] text-red-500 mt-1 self-start select-none animate-fadeIn">
          {error}
        </span>
      )}
    </div>
  );
}
