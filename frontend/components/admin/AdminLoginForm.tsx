"use client";

import React, { useState } from "react";
import InputField from "../website/shared/InputField";
import PrimaryButton from "../website/shared/PrimaryButton";

/**
 * Password login gate for protected admin sections.
 */
export default function AdminLoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError("Password is required.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Authentication failed.");
      }

      // Refresh to reload the server component route and display dashboard
      window.location.reload();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to authenticate.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-surface border border-border rounded-[16px] p-6 md:p-8 shadow-card relative z-10 my-16">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="text-center">
          <h2 className="font-heading font-bold text-lg md:text-xl text-text-primary uppercase tracking-wide mb-1">
            Admin Access
          </h2>
          <p className="font-sans text-xs text-text-muted">
            Enter password to view registered early-access leads.
          </p>
        </div>

        {error && (
          <div className="bg-red-950/40 border border-red-500/30 text-red-400 text-xs rounded-button p-3 text-center animate-fadeIn">
            {error}
          </div>
        )}

        <InputField
          label="Admin Password"
          id="password"
          name="password"
          type="password"
          placeholder="••••••••••••"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (error) setError("");
          }}
          disabled={isSubmitting}
          required
        />

        <PrimaryButton
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 mt-1 font-semibold tracking-wide"
          icon={
            isSubmitting && (
              <svg className="animate-spin h-4 w-4 text-primary-text" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )
          }
        >
          {isSubmitting ? "Authenticating..." : "Unlock Dashboard"}
        </PrimaryButton>
      </form>
    </div>
  );
}
