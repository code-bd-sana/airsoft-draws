import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import WebsiteNavbar from "../../components/website/layout/WebsiteNavbar";
import WebsiteFooter from "../../components/website/layout/WebsiteFooter";

export const metadata: Metadata = {
  title: "Host Rules & Guidelines | Airsoft Draws",
};

export default function HostRulesPage() {
  return (
    <>
      <WebsiteNavbar />
      <main className="flex-grow bg-bg pt-28 pb-20">
        <div className="container-custom max-w-3xl">
          <Link href="/" className="text-xs font-semibold text-text-muted hover:text-text-primary transition-colors flex items-center gap-1 mb-8 w-fit">
            ← Back to Home
          </Link>
          
          <div className="bg-[#161810] border border-border rounded-card p-6 md:p-10">
            <h1 className="font-heading font-bold text-3xl md:text-4xl text-text-primary mb-6 tracking-tight">
              Host Rules & Guidelines
            </h1>
            
            <div className="space-y-6 text-sm text-text-muted leading-relaxed font-sans">
              <p>
                As a Verified Host on Airsoft Draws, you are expected to maintain the highest standards of integrity, transparency, and customer service. Please review our mandatory guidelines below.
              </p>

              <div className="bg-accent-bg border border-border p-5 rounded-md my-6">
                <h3 className="font-heading font-bold text-text-primary mb-2 text-base">
                  [TODO: PLACEHOLDER FOR APPROVED HOST RULES]
                </h3>
                <p className="text-text-secondary">
                  The final legal and operational rules for hosts must be inserted here. This includes Escrow agreements, verification requirements, prize fulfillment timelines, and commission terms.
                </p>
              </div>

              <h3 className="font-heading font-bold text-lg text-text-primary mt-8 mb-4">
                1. Prize Authenticity
              </h3>
              <p>
                All items offered as prizes must be exactly as described in the competition listing. If an item is second-hand or has minor defects, this must be stated explicitly. All Airsoft Replicas must comply with the VCRA and the winner must provide a valid UKARA or equivalent defense.
              </p>

              <h3 className="font-heading font-bold text-lg text-text-primary mt-8 mb-4">
                2. Live Draws & Randomization
              </h3>
              <p>
                All main draws must be conducted live using a verifiable third-party random number generator (e.g., Google Random Number Generator). Screen sharing must be active during the draw, and recordings must be retained for at least 30 days.
              </p>

              <h3 className="font-heading font-bold text-lg text-text-primary mt-8 mb-4">
                3. Dispatch & Shipping
              </h3>
              <p>
                Hosts are required to dispatch physical prizes within 7 working days of the winner being verified. Tracking information must be provided to the platform to release Escrow funds.
              </p>

              <div className="mt-12 pt-8 border-t border-divider">
                <p className="text-xs text-text-secondary">
                  If you have questions regarding these rules, please <Link href="/contact" className="text-primary hover:underline">contact our support team</Link>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <WebsiteFooter />
    </>
  );
}
