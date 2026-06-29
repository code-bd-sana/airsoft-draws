"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HostLoginFormValues, HostAuthFormState } from "../../types/host-auth.types";
import { validateLoginForm } from "../../lib/validations/host-auth.validation";
import AuthSuccessState from "./AuthSuccessState";
import { cn } from "../../lib/utils";

export default function HostLoginForm() {
  const router = useRouter();
  
  // Controlled form values state
  const [formData, setFormData] = useState<HostLoginFormValues>({
    email: "",
    password: "",
    rememberMe: false,
  });

  // Overall form visual state
  const [formState, setFormState] = useState<HostAuthFormState<HostLoginFormValues>>({
    values: formData,
    isSubmitting: false,
    submitStatus: "idle",
  });

  // Client-side validation errors state
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Perform validation checks
    const validationErrors = validateLoginForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    // 2. Submit form (mock loading state)
    setFormState((prev) => ({
      ...prev,
      isSubmitting: true,
      submitStatus: "idle",
    }));

    setTimeout(() => {
      // Mock successful login
      setFormState((prev) => ({
        ...prev,
        isSubmitting: false,
        submitStatus: "success",
      }));
    }, 1500);
  };

  if (formState.submitStatus === "success") {
    return (
      <AuthSuccessState
        title="Welcome Back!"
        description="Your Host session has been successfully simulated. Directing you to the dashboard..."
        buttonText="Go to Dashboard"
        buttonHref="/host/dashboard"
      />
    );
  }

  return (
    <div className="relative w-full max-w-[829px] mx-auto flex flex-col gap-[24px] animate-fadeIn">
      {/* Toast Alert popup for mock actions */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-accent-bg border border-primary text-text-brand px-4 py-3 rounded-button shadow-card text-xs md:text-sm animate-fadeIn">
          {toastMessage}
        </div>
      )}

      {/* Nav Tabs Selector */}
      <div className="flex items-center justify-center self-center md:self-start">
        <div className="bg-surface border border-accent-bg flex gap-[6px] items-center px-[7px] py-[6px] rounded-[99px]">
          <Link
            href="/login"
            className="bg-transparent border border-transparent rounded-[99px] flex flex-col items-center justify-center px-[15px] py-[6px] hover:bg-elevated transition-colors"
          >
            <span className="font-sans font-medium text-[12px] leading-[18px] text-text-secondary tracking-[0.48px] whitespace-nowrap">
              User Login
            </span>
          </Link>
          <div className="bg-accent-bg border border-border-medium rounded-[99px] flex flex-col items-center justify-center px-[15px] py-[6px]">
            <span className="font-sans font-medium text-[12px] leading-[18px] text-text-brand tracking-[0.48px] whitespace-nowrap">
              Host Login
            </span>
          </div>
        </div>
      </div>

      {/* Main Login Card wrapper */}
      <div className="bg-surface border border-accent-bg p-6 md:p-[41px] rounded-[16px] w-full">
        {/* Header section */}
        <div className="flex flex-col gap-2 mb-[35px]">
          <h2 className="font-heading font-normal text-[36px] text-text-primary leading-tight">
            Log In
          </h2>
          <div className="flex items-center gap-1.5 pt-[8px]">
            <span className="font-sans font-normal text-[14px] leading-[19.5px] text-text-secondary">
              New to Airsoft Draws?
            </span>
            <Link
              href="/host/register"
              className="font-sans font-medium text-[14px] leading-[19.5px] text-primary hover:text-primary-hover transition-colors"
            >
              Apply to become a host →
            </Link>
          </div>
        </div>

        {/* Semantic Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-[20px]">
          {/* Email input field */}
          <div className="flex flex-col w-full gap-[6px]">
            <label
              htmlFor="email"
              className="font-sans font-medium text-[14px] text-text-primary leading-normal"
            >
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
                "w-full h-[46px] bg-bg border border-border rounded-[8px] px-[13px] font-sans font-normal text-[14px] text-text-primary placeholder:text-text-primary/50 transition-all duration-200 outline-none",
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

          {/* Password input field */}
          <div className="flex flex-col w-full gap-[6px]">
            <label
              htmlFor="password"
              className="font-sans font-medium text-[14px] text-text-primary leading-normal"
            >
              Password
            </label>
            <div className="relative w-full h-[46px]">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                disabled={formState.isSubmitting}
                className={cn(
                  "w-full h-full bg-bg border border-border rounded-[8px] pl-[13px] pr-[43px] font-sans font-normal text-[14px] text-text-primary placeholder:text-text-primary/50 transition-all duration-200 outline-none",
                  errors.password
                    ? "border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500/30"
                    : "focus:border-primary focus:ring-1 focus:ring-primary/20",
                  formState.isSubmitting && "opacity-50 cursor-not-allowed"
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-[13px] top-1/2 -translate-y-1/2 text-text-primary/50 hover:text-text-brand p-1 cursor-pointer select-none transition-colors duration-200"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  /* Eye Slash Icon */
                  <svg className="w-[16px] h-[16px]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  /* Eye Icon */
                  <svg className="w-[16px] h-[16px]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
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

          {/* Remember me & Forgot Password */}
          <div className="flex items-center justify-between mt-[4px] h-[24px]">
            <label className="flex items-center gap-[10px] cursor-pointer group">
              <div className="flex items-start pt-[1px]">
                <div className="relative w-[18px] h-[18px]">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    disabled={formState.isSubmitting}
                    className="appearance-none absolute inset-0 w-[18px] h-[18px] rounded-[4px] border border-border bg-transparent checked:bg-primary checked:border-primary focus:ring-0 cursor-pointer transition-colors"
                  />
                  {formData.rememberMe && (
                    <svg className="absolute inset-0 w-[18px] h-[18px] text-bg p-[3px] pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </div>
              </div>
              <span className="font-sans font-medium text-[13px] leading-[19.5px] text-text-secondary group-hover:text-text-primary transition-colors select-none">
                Remember me
              </span>
            </label>
            <button
              type="button"
              onClick={() => showToast("Forgot Password request simulated! An email would be sent here.")}
              className="font-sans font-semibold text-[16px] leading-[24px] text-primary hover:text-primary-hover transition-colors cursor-pointer select-none"
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={formState.isSubmitting}
            className="w-full mt-[12px] h-[48px] bg-primary hover:bg-primary-hover text-bg font-heading font-semibold text-[15px] leading-[22.5px] rounded-[8px] flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {formState.isSubmitting ? "Logging In..." : "Log In →"}
          </button>

          {/* Divider */}
          <div className="flex items-center justify-center gap-[12px] mt-[20px] mb-[18px]">
            <div className="bg-border h-[0.5px] flex-1" />
            <span className="font-sans font-normal text-[12px] leading-[18px] text-text-secondary uppercase">
              OR
            </span>
            <div className="bg-border h-[0.5px] flex-1" />
          </div>

          {/* Social login buttons */}
          <div className="flex flex-col gap-[12px]">
            {/* Google Button */}
            <button
              type="button"
              onClick={() => showToast("Google authentication flow simulated.")}
              className="w-full h-[46px] bg-elevated hover:bg-bg border border-border rounded-[8px] flex items-center justify-center gap-[10px] font-sans font-medium text-[14px] leading-[21px] text-text-primary cursor-pointer transition-colors select-none"
            >
              <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.56 5.56 0 018.43 13c0-3.036 2.463-5.514 5.56-5.514 1.348 0 2.583.473 3.564 1.373l3.055-3.055C18.665 3.823 16.48 3 14 3a10 10 0 100 20c5.522 0 10-4.478 10-10 0-.682-.055-1.355-.164-2.015H12.24z" />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Apple Button */}
            <button
              type="button"
              onClick={() => showToast("Apple authentication flow simulated.")}
              className="w-full h-[46px] bg-elevated hover:bg-bg border border-border rounded-[8px] flex items-center justify-center gap-[10px] font-sans font-medium text-[14px] leading-[21px] text-text-primary cursor-pointer transition-colors select-none"
            >
              <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.2.67-2.92 1.5-.61.7-1.15 1.84-1.01 2.96 1.12.09 2.27-.57 2.94-1.4z" />
              </svg>
              <span>Continue with Apple</span>
            </button>
          </div>

          {/* Bottom user login redirect link */}
          <div className="w-full mt-[24px] flex items-center justify-center gap-[2px] select-none text-[13px] leading-[19.5px]">
            <span className="font-sans font-normal text-text-secondary">Are you a host? </span>
            <Link
              href="/login"
              className="font-sans font-semibold text-primary hover:text-primary-hover transition-colors"
            >
              Go to User Login →
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
