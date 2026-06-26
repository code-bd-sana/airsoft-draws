import React from "react";
import { trustStatsData, trustBenefitsData } from "../../../data/homepage/trust-benefits.data";
import StatCard from "../shared/StatCard";

/**
 * Trust & Statistics section containing stats counters and platform benefits.
 */
export default function TrustBenefitsSection() {
  // Render benefit icons
  const renderBenefitIcon = (iconName: string) => {
    const classes = "w-6 h-6 text-text-brand";
    switch (iconName) {
      case "ShieldCheckIcon":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={classes}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.75 3.75 0 0 1 21 12Z" />
          </svg>
        );
      case "LockClosedIcon":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={classes}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
          </svg>
        );
      case "SparklesIcon":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={classes}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 21l-.813-5.096L3 15l5.096-.813L9 9l.813 5.096L15 15l-5.096.813ZM19.071 5.929 18.5 9l-.571-3.071L15 5.5l3.071-.571L18.5 2l.571 3.071L22 5.5l-2.929.571Zm-1.5 11 17.5l.5-2.5-.5-11-2.5-.5-11Z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <section className="py-20 bg-surface border-t border-divider">
      <div className="container-custom">
        {/* Horizontal Stats Row */}
        <div className="bg-bg border border-border rounded-card grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-divider shadow-card mb-20 overflow-hidden">
          {trustStatsData.map((stat) => (
            <StatCard key={stat.id} stat={stat} />
          ))}
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trustBenefitsData.map((benefit) => (
            <div
              key={benefit.id}
              className="flex flex-col bg-bg border border-border rounded-card p-6 md:p-8 transition-all duration-300 hover:border-border-medium hover:shadow-glow"
            >
              {/* Icon Holder */}
              <div className="flex items-center justify-center w-12 h-12 rounded bg-accent-bg border border-divider mb-6">
                {renderBenefitIcon(benefit.iconName)}
              </div>
              
              <h3 className="font-heading font-bold text-lg text-text-primary mb-3">
                {benefit.title}
              </h3>
              
              <p className="font-sans text-xs md:text-sm text-text-muted leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
