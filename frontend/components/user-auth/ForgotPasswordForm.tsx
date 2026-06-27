"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ForgotPasswordFormValues, UserAuthFormState } from "../../types/user-auth.types";
import { validateForgotPasswordForm } from "../../lib/validations/user-auth.validation";
import PrimaryButton from "../website/shared/PrimaryButton";
import { cn } from "../../lib/utils";

export default function ForgotPasswordForm() {
  const [formData, setFormData] = useState<ForgotPasswordFormValues>({
    email: "",
  });

  const [formState, setFormState] = useState<UserAuthFormState<ForgotPasswordFormValues>>({
    values: formData,
    isSubmitting: false,
    submitStatus: "idle",
  });

  const [errors, setErrors] = useState<{ email?: string }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ email: e.target.value });
    if (errors.email) setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForgotPasswordForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setFormState((prev) => ({
      ...prev,
      isSubmitting: true,
    }));

    setTimeout(() => {
      setFormState({
        values: formData,
        isSubmitting: false,
        submitStatus: "success",
      });
    }, 1200);
  };

  if (formState.submitStatus === "success") {
    return (
      <div className="bg-surface border border-divider p-6 md:p-10 rounded-card shadow-card w-full max-w-xl mx-auto flex flex-col items-center text-center animate-fadeIn select-none">
        <div className="w-12 h-12 rounded-full bg-accent-bg border border-primary flex items-center justify-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6 text-text-brand"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
          </svg>
        </div>
        <h2 className="font-heading font-normal text-2xl md:text-3xl text-text-primary mb-3">
          Check Your Email
        </h2>
        <p className="font-sans text-xs md:text-sm text-text-secondary leading-relaxed mb-8 max-w-sm">
          We&apos;ve sent a password recovery link to <span className="text-text-primary font-medium">{formState.values.email}</span>. Please check your inbox and follow the instructions to reset your password.
        </p>
        <Link
          href="/login"
          className="font-sans font-semibold text-xs text-text-brand hover:text-primary-hover uppercase tracking-wider transition-colors duration-200"
        >
          &larr; Back to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-divider p-6 md:p-10 rounded-card shadow-card w-full max-w-xl mx-auto flex flex-col gap-6 animate-fadeIn">
      {/* Header section */}
      <div className="flex flex-col gap-2 mb-2">
        <h2 className="font-heading font-normal text-3xl md:text-[36px] text-text-primary">
          Forgot Password
        </h2>
        <p className="font-sans text-xs md:text-sm text-text-secondary leading-relaxed">
          Enter your email address below, and we&apos;ll send you a link to reset your password.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col w-full gap-1.5">
          <label htmlFor="email" className="font-sans font-medium text-xs md:text-sm text-text-primary">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleInputChange}
            disabled={formState.isSubmitting}
            className={cn(
              "w-full bg-bg border border-border rounded-button px-4 py-2.5 font-sans text-xs md:text-sm text-text-primary placeholder:text-text-muted/40 transition-all duration-200 outline-none",
              errors.email
                ? "border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500/30"
                : "focus:border-primary focus:ring-1 focus:ring-primary/20",
              formState.isSubmitting && "opacity-50 cursor-not-allowed"
            )}
          />
          {errors.email && (
            <span className="font-sans text-[11px] text-red-500 mt-1 self-start animate-fadeIn">
              {errors.email}
            </span>
          )}
        </div>

        <PrimaryButton
          type="submit"
          disabled={formState.isSubmitting}
          className="w-full py-3.5 mt-2 font-heading font-semibold text-sm tracking-wide uppercase"
        >
          {formState.isSubmitting ? "Sending..." : "Send Reset Link →"}
        </PrimaryButton>

        <div className="text-center mt-2">
          <Link
            href="/login"
            className="font-sans font-semibold text-xs text-text-secondary hover:text-text-primary transition-colors duration-200"
          >
            &larr; Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
}
