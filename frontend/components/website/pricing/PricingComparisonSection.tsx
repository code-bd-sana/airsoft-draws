import React from "react";
import { COMPARISON_ROWS } from "../../../data/pricing/pricing-comparison.data";

/**
 * Tabular comparison matrix for Free vs Premium vs Pro features.
 * Features clean alternate row coloring, check/dash status indicators, and mobile scroll support.
 */
export default function PricingComparisonSection() {
  // Renders cell value helper: boolean checks or string labels
  const renderCell = (value: string | boolean) => {
    if (typeof value === "boolean") {
      return value ? (
        <div className="flex justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={3}
            stroke="currentColor"
            className="w-5 h-5 text-primary shrink-0"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
      ) : (
        <div className="flex justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-4 h-4 text-text-muted/30 shrink-0"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
          </svg>
        </div>
      );
    }
    return <span className="font-sans text-xs md:text-sm text-text-brand font-medium">{value}</span>;
  };

  return (
    <section className="w-full bg-elevated py-20 border-b border-divider">
      <div className="container-custom">
        {/* Header Title */}
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-2xl md:text-4xl text-text-primary tracking-tight">
            Compare All Features
          </h2>
        </div>

        {/* Scrollable Comparison Table Frame */}
        <div className="w-full max-w-5xl mx-auto overflow-x-auto rounded-[14px] border border-border shadow-card">
          <table className="w-full min-w-[768px] border-collapse text-left">
            
            {/* Table Header */}
            <thead>
              <tr className="bg-surface border-b border-border h-[58px]">
                <th className="font-heading font-bold text-xs md:text-sm text-text-secondary px-6 uppercase tracking-wider w-1/4">
                  Feature
                </th>
                <th className="font-heading font-bold text-xs md:text-sm text-text-primary text-center px-6 uppercase tracking-wider w-1/4">
                  Free
                </th>
                <th className="font-heading font-bold text-xs md:text-sm text-text-primary text-center px-6 uppercase tracking-wider w-1/4">
                  Premium
                </th>
                <th className="font-heading font-bold text-xs md:text-sm text-text-primary text-center px-6 uppercase tracking-wider w-1/4">
                  Pro
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {COMPARISON_ROWS.map((row, index) => (
                <tr
                  key={row.featureName}
                  className={index % 2 === 0 ? "bg-bg" : "bg-surface"}
                >
                  {/* Feature Label Name */}
                  <td className="font-sans font-medium text-xs md:text-sm text-text-muted px-6 py-4.5">
                    {row.featureName}
                  </td>
                  
                  {/* Free Value */}
                  <td className="text-center px-6 py-4.5 border-l border-divider/50">
                    {renderCell(row.freeValue)}
                  </td>
                  
                  {/* Premium Value */}
                  <td className="text-center px-6 py-4.5 border-l border-divider/50">
                    {renderCell(row.premiumValue)}
                  </td>
                  
                  {/* Pro Value */}
                  <td className="text-center px-6 py-4.5 border-l border-divider/50">
                    {renderCell(row.proValue)}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>
    </section>
  );
}
