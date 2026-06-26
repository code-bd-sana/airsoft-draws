import React from "react";
import { cn } from "../../../lib/utils";

interface InputFieldProps {
  label: string;
  id: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

/**
 * Reusable form input element matching the Airsoft Draws styling system.
 */
export default function InputField({
  label,
  id,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
}: InputFieldProps) {
  return (
    <div className="flex flex-col w-full">
      <label
        htmlFor={id}
        className="font-sans font-medium text-xs md:text-sm text-text-secondary mb-1.5 self-start select-none"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={cn(
          "w-full bg-bg border border-border rounded-button px-4 py-2.5 font-sans text-xs md:text-sm text-text-primary placeholder:text-text-muted/40 transition-all duration-200 outline-none",
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
