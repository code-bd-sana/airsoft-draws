"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserLoginFormValues, UserAuthFormState } from "../../types/user-auth.types";
import { validateLoginForm } from "../../lib/validations/user-auth.validation";
import PrimaryButton from "../website/shared/PrimaryButton";
import AuthSuccessState from "../host-auth/AuthSuccessState";
import { cn, extractApiError } from "../../lib/utils";
import { useLoginMutation } from "../../hooks/useAuthHooks";

export default function UserLoginForm() {
  const router = useRouter();

  // Controlled form values state
  const [formData, setFormData] = useState<UserLoginFormValues>({
    email: "",
    password: "",
    rememberMe: false,
  });

  // Overall form state
  const [formState, setFormState] = useState<UserAuthFormState<UserLoginFormValues>>({
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

  const loginMutation = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Perform validation checks
    const validationErrors = validateLoginForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setFormState((prev) => ({ ...prev, isSubmitting: true }));

    try {
      await loginMutation.mutateAsync({
        email: formData.email,
        password: formData.password,
      });
      // The mutation handles redirect on success
    } catch (error: any) {
      setFormState((prev) => ({ ...prev, isSubmitting: false }));
      if (error.response?.data?.message === 'Please verify your email address before logging in') {
        showToast("Please verify your email address before logging in. Redirecting...");
        setTimeout(() => {
          router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
        }, 1500);
      } else {
        showToast(extractApiError(error, "Login failed. Please check your credentials."));
      }
    }
  };

  if (formState.submitStatus === "success") {
    return (
      <AuthSuccessState
        title="Welcome Back!"
        description="Your Player session has been successfully simulated. Directing you to the draws homepage..."
        buttonText="Explore Competitions"
        buttonHref="/"
      />
    );
  }

  return (
    <div className="relative w-full max-w-xl mx-auto flex flex-col gap-6 animate-fadeIn">
      {/* Toast Alert popup for mock actions */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-accent-bg border border-primary text-text-brand px-4 py-3 rounded-button shadow-card text-xs md:text-sm animate-fadeIn">
          {toastMessage}
        </div>
      )}



      {/* Main Login Card wrapper */}
      <div className="bg-surface border border-divider p-6 md:p-10 rounded-card shadow-card w-full">
        {/* Header section */}
        <div className="flex flex-col gap-2 mb-8">
          <h2 className="font-heading font-normal text-3xl md:text-[36px] text-text-primary">
            Log In
          </h2>
          <div className="flex flex-wrap items-center gap-1.5 text-xs md:text-sm">
            <span className="text-text-secondary/70">New user?</span>
            <Link
              href="/register"
              className="font-medium text-primary hover:text-primary-hover transition-colors duration-200"
            >
              Register now →
            </Link>
          </div>
        </div>

        {/* Semantic Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Email input field */}
          <div className="flex flex-col w-full gap-1.5">
            <label
              htmlFor="email"
              className="font-sans font-medium text-xs md:text-sm text-text-primary"
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

          {/* Password input field */}
          <div className="flex flex-col w-full gap-1.5">
            <label
              htmlFor="password"
              className="font-sans font-medium text-xs md:text-sm text-text-primary"
            >
              Password
            </label>
            <div className="relative w-full">
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
                  /* Eye Slash Icon */
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  /* Eye Icon */
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

          {/* Remember me & Forgot Password */}
          <div className="flex items-center justify-between mt-1 text-xs md:text-sm">
            <label className="flex items-center gap-2 text-text-secondary select-none cursor-pointer">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                disabled={formState.isSubmitting}
                className="w-4.5 h-4.5 rounded border border-border bg-bg text-primary focus:ring-0 focus:ring-offset-0 focus:outline-none accent-primary transition-all duration-200 cursor-pointer"
              />
              <span>Remember me</span>
            </label>
            <Link
              href="/forgot-password"
              className="font-sans font-semibold text-text-brand hover:text-primary-hover transition-colors duration-200"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <PrimaryButton
            type="submit"
            disabled={formState.isSubmitting}
            className="w-full py-3.5 mt-2 font-heading font-semibold text-sm tracking-wide uppercase"
          >
            {formState.isSubmitting ? "Logging In..." : "Log In →"}
          </PrimaryButton>

          {/* OR Divider */}
          {/* <div className="flex items-center gap-3 my-2 select-none">
            <div className="h-px bg-border flex-1" />
            <span className="font-sans text-xs text-border-medium uppercase tracking-wider font-semibold">
              OR
            </span>
            <div className="h-px bg-border flex-1" />
          </div> */}

          {/* Social Logins */}
          {/* <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => showToast("Google Login request simulated!")}
              disabled={formState.isSubmitting}
              className="w-full bg-elevated border border-border hover:bg-border/30 hover:border-border-medium rounded-button py-2.5 font-sans font-medium text-xs md:text-sm text-text-primary transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer select-none"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.977 0-.742-.08-1.306-.177-1.866H12.24z" />
              </svg>
              <span>Continue with Google</span>
            </button>
            <button
              type="button"
              onClick={() => showToast("Apple Login request simulated!")}
              disabled={formState.isSubmitting}
              className="w-full bg-elevated border border-border hover:bg-border/30 hover:border-border-medium rounded-button py-2.5 font-sans font-medium text-xs md:text-sm text-text-primary transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer select-none"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.17.67-2.88 1.49-.6.69-1.12 1.83-.98 2.94 1.07.08 2.21-.56 2.87-1.37z" />
              </svg>
              <span>Continue with Apple</span>
            </button>
          </div> */}
        </form>
      </div>



    </div>
  );
}
