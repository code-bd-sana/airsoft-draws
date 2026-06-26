import React from "react";
import PrimaryButton from "../shared/PrimaryButton";
import SecondaryButton from "../shared/SecondaryButton";
import { formatCurrency } from "../../../lib/utils";

/**
 * Host CTA section featuring hosting benefits and a preview of the Host dashboard.
 */
export default function FinalCtaSection() {
  const hostDashboardPreview = {
    activeDrawsCount: 3,
    ticketsSoldThisMonth: 1240,
    totalEarnedAmount: 3100,
    monthlyTargetPercent: 62,
  };

  // Render a bullet check mark
  const bulletCheck = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      stroke="currentColor"
      className="w-4 h-4 text-text-brand flex-shrink-0"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );

  // Render start icon
  const boltIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="w-4 h-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
      />
    </svg>
  );

  return (
    <section id="host-info" className="py-20 bg-bg border-t border-divider">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Panel: Promo Info */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            <div className="inline-flex items-center bg-accent-bg border border-border px-3 py-1.5 rounded-badge text-[10px] font-semibold uppercase tracking-wider text-text-brand mb-6">
              FOR HOSTS
            </div>
            
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-text-primary leading-tight mb-6">
              Run Your Own Airsoft Competition
            </h2>
            
            <p className="font-sans text-sm md:text-base text-text-muted leading-relaxed mb-6">
              Turn your surplus airsoft gear into cash or launch competitions as an established retailer. We handle everything from secure payment collections to automated random draws.
            </p>

            {/* Benefits Bullet Grid */}
            <ul className="flex flex-col gap-3.5 mb-8 w-full">
              {[
                "Set your own ticket price & ticket volumes",
                "Secure, industry-leading payment integrations",
                "Escrow-protected payouts for total peace of mind",
                "Instant exposure to our active airsoft player base",
              ].map((bullet, idx) => (
                <li key={idx} className="flex items-center gap-3 font-sans text-xs md:text-sm text-text-primary">
                  {bulletCheck}
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>

            {/* CTA Buttons Row */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <PrimaryButton href="#" icon={boltIcon} className="w-full sm:w-auto px-8 py-3.5">
                Start Hosting
              </PrimaryButton>
              <SecondaryButton href="#" className="w-full sm:w-auto px-8 py-3.5">
                View Pricing
              </SecondaryButton>
            </div>
          </div>

          {/* Right Panel: Host Dashboard Preview Card */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end w-full">
            <div className="w-full max-w-[500px] bg-surface border border-border rounded-card p-6 md:p-8 shadow-card hover:border-border-medium hover:shadow-glow transition-all duration-300">
              
              <div className="flex items-center justify-between pb-4 border-b border-divider mb-6">
                <h3 className="font-heading font-bold text-sm text-text-primary uppercase tracking-wider">
                  Host Dashboard Preview
                </h3>
                <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
              </div>

              {/* Stats Counters */}
              <div className="flex flex-col gap-5 mb-8">
                <div className="flex items-center justify-between">
                  <span className="font-sans text-xs text-text-muted font-medium">
                    Active Competitions
                  </span>
                  <span className="font-heading font-bold text-sm text-text-brand">
                    {hostDashboardPreview.activeDrawsCount}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="font-sans text-xs text-text-muted font-medium">
                    Tickets Sold This Month
                  </span>
                  <span className="font-heading font-bold text-sm text-text-brand">
                    {hostDashboardPreview.ticketsSoldThisMonth.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="font-sans text-xs text-text-muted font-medium">
                    Total Earned Payouts
                  </span>
                  <span className="font-heading font-bold text-sm text-text-brand">
                    {formatCurrency(hostDashboardPreview.totalEarnedAmount, 0)}
                  </span>
                </div>
              </div>

              {/* Targets Progress Bar */}
              <div className="pt-4 border-t border-divider">
                <div className="flex justify-between items-center text-xs text-text-muted mb-2 font-medium">
                  <span>Monthly sales target</span>
                  <span className="text-text-brand font-semibold">
                    {hostDashboardPreview.monthlyTargetPercent}%
                  </span>
                </div>
                <div className="w-full h-2 bg-bg rounded-badge overflow-hidden border border-divider">
                  <div
                    className="h-full bg-primary rounded-badge"
                    style={{ width: `${hostDashboardPreview.monthlyTargetPercent}%` }}
                  />
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
