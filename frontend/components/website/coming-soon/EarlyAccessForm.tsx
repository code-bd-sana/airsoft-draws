"use client";

import React, { useState } from "react";
import InputField from "../shared/InputField";
import PrimaryButton from "../shared/PrimaryButton";
import { cn } from "../../../lib/utils";

/**
 * Early Access Lead Form allowing interested users to register.
 * Saves lead details to PostgreSQL and handles duplicate error check alerts.
 */
export default function EarlyAccessForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"CUSTOMER" | "HOST">("CUSTOMER");
  
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [generalError, setGeneralError] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = (): boolean => {
    let isValid = true;
    setNameError("");
    setEmailError("");
    setGeneralError("");

    if (!fullName.trim()) {
      setNameError("Full name is required.");
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError("Email address is required.");
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setGeneralError("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          role: role,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong.");
      }

      setIsSuccess(true);
      setFullName("");
      setEmail("");
      setRole("CUSTOMER");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to submit. Please try again.";
      setGeneralError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-surface border border-border rounded-[16px] p-6 md:p-8 shadow-card relative z-10 my-8">
      {isSuccess ? (
        <div className="flex flex-col items-center text-center py-4 animate-fadeIn">
          <div className="w-12 h-12 rounded-full bg-success-bg border border-success flex items-center justify-center mb-4">
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
          <h3 className="font-heading font-bold text-lg text-text-primary mb-2">
            You&apos;re on the List!
          </h3>
          <p className="font-sans text-xs md:text-sm text-text-muted leading-relaxed">
            Thank you for registering. We will notify you as soon as the early-access launch begins. Keep an eye on your inbox!
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <h3 className="font-heading font-bold text-base md:text-lg text-text-primary mb-1 text-center">
            Join the Waitlist
          </h3>
          <p className="font-sans text-xs text-text-muted text-center mb-4">
            Register below to secure your early-access spot.
          </p>

          {/* General Error Notice */}
          {generalError && (
            <div className="bg-red-950/40 border border-red-500/30 text-red-400 text-xs rounded-button p-3 text-center">
              {generalError}
            </div>
          )}

          {/* Full Name Input */}
          <InputField
            label="Full Name"
            id="fullName"
            name="fullName"
            placeholder="John Smith"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              if (nameError) setNameError("");
            }}
            error={nameError}
            disabled={isSubmitting}
            required
          />

          {/* Email Input */}
          <InputField
            label="Email Address"
            id="email"
            name="email"
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError("");
            }}
            error={emailError}
            disabled={isSubmitting}
            required
          />

          {/* Role Selection */}
          <div className="flex flex-col gap-1.5 w-full">
            <label className="font-sans font-medium text-xs md:text-sm text-text-secondary select-none self-start mb-0.5">
              I want to:
            </label>
            <div className="flex gap-3 w-full">
              <button
                type="button"
                onClick={() => setRole("CUSTOMER")}
                disabled={isSubmitting}
                className={cn(
                  "flex-1 font-sans text-xs md:text-sm font-semibold py-2.5 rounded-button border text-center transition-all duration-200 cursor-pointer disabled:opacity-50 select-none",
                  role === "CUSTOMER"
                    ? "bg-accent-bg border-primary text-text-brand shadow-glow"
                    : "bg-bg border-border text-text-muted hover:text-text-primary"
                )}
              >
                Enter Draws (Player)
              </button>
              <button
                type="button"
                onClick={() => setRole("HOST")}
                disabled={isSubmitting}
                className={cn(
                  "flex-1 font-sans text-xs md:text-sm font-semibold py-2.5 rounded-button border text-center transition-all duration-200 cursor-pointer disabled:opacity-50 select-none",
                  role === "HOST"
                    ? "bg-accent-bg border-primary text-text-brand shadow-glow"
                    : "bg-bg border-border text-text-muted hover:text-text-primary"
                )}
              >
                Host Draws (Host)
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <PrimaryButton
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 mt-2 font-semibold tracking-wide"
            icon={
              isSubmitting ? (
                <svg className="animate-spin h-4 w-4 text-primary-text" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <span className="leading-none">&#8594;</span>
              )
            }
          >
            {isSubmitting ? "Registering..." : "Join Waitlist"}
          </PrimaryButton>

          {/* Trust Text */}
          <p className="font-sans text-[10px] text-text-muted/50 text-center mt-2">
            🔒 Your details are secure. No spam. Unsubscribe anytime.
          </p>
        </form>
      )}
    </div>
  );
}
