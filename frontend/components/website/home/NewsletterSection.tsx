"use client";

import React, { useState } from "react";
import PrimaryButton from "../shared/PrimaryButton";

/**
 * Newsletter Section allowing users to subscribe to weekly draw updates.
 */
export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    // Simulate API request
    setSubscribed(true);
    setEmail("");
  };

  return (
    <section className="py-20 bg-bg border-t border-divider">
      <div className="container-custom">
        <div className="bg-surface border border-border rounded-card p-8 md:p-12 lg:p-16 max-w-4xl mx-auto text-center relative overflow-hidden shadow-card">
          {/* Subtle radial glow background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/5 rounded-full filter blur-[80px] pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="inline-flex items-center bg-accent-bg border border-border px-3 py-1.5 rounded-badge text-[10px] font-semibold uppercase tracking-wider text-text-brand mb-6">
              NEWSLETTER
            </div>

            <h2 className="font-heading font-bold text-2xl md:text-3xl lg:text-4xl text-text-primary mb-4 leading-tight">
              Never Miss a Draw
            </h2>

            <p className="font-sans text-xs md:text-sm text-text-muted leading-relaxed mb-8">
              Sign up to receive weekly notifications when new high-tier airsoft bundles, cash draws, or special instant win events go live. Unsubscribe at any time.
            </p>

            {subscribed ? (
              <div className="bg-success-bg/30 border border-success/30 px-6 py-4 rounded-button text-center max-w-md mx-auto">
                <p className="font-sans text-xs md:text-sm text-success-text font-semibold flex items-center justify-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  Thank you! You have successfully subscribed.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-bg border border-border focus:border-primary text-text-primary px-4 py-3 rounded-button text-xs md:text-sm font-sans outline-none placeholder:text-text-muted transition-colors duration-200"
                />
                <PrimaryButton type="submit" className="px-6 py-3">
                  Subscribe
                </PrimaryButton>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
