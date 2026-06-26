import React from "react";
import Link from "next/link";
import { cn } from "../../../lib/utils";

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

/**
 * Reusable Primary Button matching the brand lime colors.
 * Automatically wraps in a Next Link if 'href' is supplied.
 */
export default function PrimaryButton({
  children,
  onClick,
  href,
  className,
  icon,
  disabled = false,
  type = "button",
}: PrimaryButtonProps) {
  const baseClasses = cn(
    "inline-flex items-center justify-center bg-primary hover:bg-primary-hover text-primary-text font-sans font-semibold text-sm px-6 py-3 rounded-button transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-95",
    className
  );

  const content = (
    <>
      <span>{children}</span>
      {icon && <span className="ml-2 inline-flex">{icon}</span>}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={baseClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseClasses}
    >
      {content}
    </button>
  );
}
