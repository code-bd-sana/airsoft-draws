"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ResetPasswordFormValues, UserAuthFormState } from "../../types/user-auth.types";
import { validateResetPasswordForm } from "../../lib/validations/user-auth.validation";
import PrimaryButton from "../website/shared/PrimaryButton";
import { cn, extractApiError } from "../../lib/utils";
import { useSearchParams } from "next/navigation";
import { useResetPasswordMutation } from "../../hooks/useUserHooks";

export default function ResetPasswordForm() {
  const [formData, setFormData] = useState<ResetPasswordFormValues>({
    password: "",
    confirmPassword: "",
  });

  const [formState, setFormState] = useState<UserAuthFormState<ResetPasswordFormValues>>({
    values: formData,
    isSubmitting: false,
    submitStatus: "idle",
  });

  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string; form?: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear field-specific error and general form error on change
    if (errors[name as keyof typeof errors] || errors.form) {
      setErrors((prev) => ({ ...prev, [name]: undefined, form: undefined }));
    }
  };

  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const mutation = useResetPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateResetPasswordForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    if (!token) {
      setErrors({ form: "Reset token is missing from the URL. Please use the link sent to your email." });
      return;
    }

    setFormState((prev) => ({
      ...prev,
      isSubmitting: true,
    }));

    try {
      await mutation.mutateAsync({
        token,
        newPassword: formData.password,
      });

      setFormState({
        values: formData,
        isSubmitting: false,
        submitStatus: "success",
      });
    } catch (err: any) {
      setErrors({
        form: extractApiError(err, "Failed to reset password. The link might be expired or invalid."),
      });
      setFormState((prev) => ({
        ...prev,
        isSubmitting: false,
      }));
    }
  };

  if (formState.submitStatus === "success") {
    return (
      <div className="bg-surface border border-divider p-6 md:p-10 rounded-card shadow-card w-full max-w-xl mx-auto flex flex-col items-center text-center animate-fadeIn select-none">
        <div className="w-12 h-12 rounded-full bg-success-bg border border-success flex items-center justify-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-6 h-6 text-[#4ade80]"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
        <h2 className="font-heading font-normal text-2xl md:text-3xl text-text-primary mb-3">
          Password Reset Successful
        </h2>
        <p className="font-sans text-xs md:text-sm text-text-secondary leading-relaxed mb-8 max-w-sm">
          Your password has been successfully updated. You can now log in to your account with your new credentials.
        </p>
        <Link href="/login" className="w-full">
          <PrimaryButton type="button" className="w-full py-3.5 uppercase tracking-wider font-heading font-semibold text-sm">
            Go to Login
          </PrimaryButton>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-divider p-6 md:p-10 rounded-card shadow-card w-full max-w-xl mx-auto flex flex-col gap-6 animate-fadeIn">
      {/* Header section */}
      <div className="flex flex-col gap-2 mb-2">
        <h2 className="font-heading font-normal text-3xl md:text-[36px] text-text-primary">
          Reset Password
        </h2>
        <p className="font-sans text-xs md:text-sm text-text-secondary leading-relaxed">
          Create a new secure password for your account below.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {errors.form && (
          <div className="bg-[#f76b6b]/10 border border-[#f76b6b]/20 text-[#f76b6b] text-sm p-3 rounded-lg text-center animate-fadeIn">
            {errors.form}
          </div>
        )}

        {/* New Password */}
        <div className="flex flex-col w-full gap-1.5">
          <label htmlFor="password" className="font-sans font-medium text-xs md:text-sm text-text-primary">
            New Password
          </label>
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleInputChange}
              disabled={formState.isSubmitting}
              className={cn(
                "w-full bg-bg border border-border rounded-button pl-4 pr-12 py-2.5 font-sans text-xs md:text-sm text-text-primary placeholder:text-text-muted/40 transition-all duration-200 outline-none",
                errors.password
                  ? "border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500/30"
                  : "focus:border-primary focus:ring-1 focus:ring-primary/20",
                formState.isSubmitting && "opacity-50 cursor-not-allowed"
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted/60 hover:text-text-brand p-1 cursor-pointer select-none transition-colors duration-200"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          </div>
          {errors.password && (
            <span className="font-sans text-[11px] text-red-500 mt-1 self-start animate-fadeIn">
              {errors.password}
            </span>
          )}
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col w-full gap-1.5">
          <label htmlFor="confirmPassword" className="font-sans font-medium text-xs md:text-sm text-text-primary">
            Confirm Password
          </label>
          <div className="relative w-full">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              disabled={formState.isSubmitting}
              className={cn(
                "w-full bg-bg border border-border rounded-button pl-4 pr-12 py-2.5 font-sans text-xs md:text-sm text-text-primary placeholder:text-text-muted/40 transition-all duration-200 outline-none",
                errors.confirmPassword
                  ? "border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500/30"
                  : "focus:border-primary focus:ring-1 focus:ring-primary/20",
                formState.isSubmitting && "opacity-50 cursor-not-allowed"
              )}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted/60 hover:text-text-brand p-1 cursor-pointer select-none transition-colors duration-200"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <span className="font-sans text-[11px] text-red-500 mt-1 self-start animate-fadeIn">
              {errors.confirmPassword}
            </span>
          )}
        </div>

        <PrimaryButton
          type="submit"
          disabled={formState.isSubmitting}
          className="w-full py-3.5 mt-2 font-heading font-semibold text-sm tracking-wide uppercase"
        >
          {formState.isSubmitting ? "Updating..." : "Reset Password →"}
        </PrimaryButton>
      </form>
    </div>
  );
}
