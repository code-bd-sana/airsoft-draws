import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import WebsiteNavbar from "../../components/website/layout/WebsiteNavbar";
import WebsiteFooter from "../../components/website/layout/WebsiteFooter";

export const metadata: Metadata = {
  title: "Host Rules & Guidelines | Airsoft Draws",
  description: "Official rules and compliance guidelines for verified hosts on Airsoft Draws.",
};

const hostRules = [
  {
    number: "01",
    title: "Prize Authenticity",
    badge: "VCRA & UKARA Compliant",
    icon: (
      <svg className="w-6 h-6 text-[#8CB34A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    ),
    description:
      "All items offered as prizes must be exactly as described in the competition listing. The prize must be brand new and unused, it can be opened for photo and marketing purposes. All Airsoft Replicas must comply with the VCRA and the winner must provide a valid UKARA or equivalent defence.",
    highlights: ["Brand New & Unused", "VCRA Compliance", "Mandatory UKARA Defence Check"],
  },
  {
    number: "02",
    title: "Live Draws & Randomization",
    badge: "Official Lottery Machine",
    icon: (
      <svg className="w-6 h-6 text-[#8CB34A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
      </svg>
    ),
    description:
      "All main draws will be drawn using Airsoft Draws approved lottery ball machine, as a host you may select an auto draw to which our system will randomly select a winner following the completion of the competition. All Live draws will be conducted live on Airsoft Draws Instagram and will be posted for replays.",
    highlights: ["Airsoft Draws Lottery Machine", "Instagram Live Stream", "Auto-Draw System Available"],
  },
  {
    number: "03",
    title: "Dispatch & Shipping",
    badge: "7-Day Dispatch SLA",
    icon: (
      <svg className="w-6 h-6 text-[#8CB34A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM18.75 18.75a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM3.75 6h10.334a1.5 1.5 0 011.342.832l2.67 5.341H21a1.5 1.5 0 011.5 1.5v3a1.5 1.5 0 01-1.5 1.5h-1.05a2.25 2.25 0 00-4.4 0H8.45a2.25 2.25 0 00-4.4 0H3.75A1.5 1.5 0 012.25 17.25v-9.75A1.5 1.5 0 013.75 6z" />
      </svg>
    ),
    description:
      "Hosts are required to dispatch physical prizes within 7 working days of the winner being verified. Tracking information must be provided. Any loss or damaged prizes are the responsibility of the host to rectify and are not the responsibility of Airsoft Draws LTD.",
    highlights: ["Dispatch within 7 Working Days", "Tracked Courier Only", "Host Full Liability for Transit"],
  },
  {
    number: "04",
    title: "Payouts",
    badge: "Business Accounts Only",
    icon: (
      <svg className="w-6 h-6 text-[#8CB34A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15iA2.25 2.25 0 002.25 6.75v10.5A2.25 2.25 0 004.5 19.5z" />
      </svg>
    ),
    description:
      "Payouts must be paid to a business account and not a personal account. They will be paid after successful shipping; payment will be made the next working day. Upon a review, acceptance and 5 successful competitions have been run with no issues we will payout the next working day following the competition draw.",
    highlights: ["Registered Business Account", "Next Working Day Payout", "Fast-Track Payout after 5 Successful Draws"],
  },
  {
    number: "05",
    title: "Cancellations & Competition Extensions",
    badge: "Strict Non-Cancellation",
    isWarning: true,
    icon: (
      <svg className="w-6 h-6 text-[#F76B6B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.001A11.959 11.959 0 0112 2.964zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
    description:
      "Once the competition is submitted and accepted, the competition goes live. You cannot cancel the competition, and you cannot extend the competition. Regardless of how many tickets are sold the prize must be paid out. Please ensure you understand the risk of hosting a competition.",
    highlights: ["No Competition Extensions", "No Cancellations Allowed", "Guaranteed Prize Draw Regardless of Ticket Sales"],
  },
];

export default function HostRulesPage() {
  return (
    <>
      <WebsiteNavbar />
      <main className="flex-grow bg-[#0D0D0B] text-[#E8EDD4] pt-28 pb-24">
        <div className="container-custom max-w-4xl px-4 sm:px-6">
          
          {/* Top Breadcrumb Link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-sans font-semibold text-[#72943A] hover:text-[#8CB34A] transition-colors mb-8 group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            <span>Back to Home</span>
          </Link>

          {/* Hero Header Card */}
          <div className="bg-[#161810] border border-[#2D3C13] rounded-2xl p-6 sm:p-10 mb-10 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-[#8CB34A]/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A230A] border border-[#8CB34A]/40 text-[#8CB34A] text-xs font-sans font-bold uppercase tracking-wider mb-4">
              <span className="w-2 h-2 rounded-full bg-[#8CB34A] animate-pulse" />
              Verified Host Governance
            </div>

            <h1 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-[#E8EDD4] tracking-tight mb-4 leading-tight">
              Host Rules & Guidelines
            </h1>

            <p className="font-sans text-sm sm:text-base text-[#B3B8AA] leading-relaxed max-w-3xl">
              As a Verified Host on Airsoft Draws, you are expected to maintain the highest standards of integrity, transparency, and customer service. Please review our mandatory operational rules below prior to listing a competition.
            </p>
          </div>

          {/* Rules List */}
          <div className="space-y-6">
            {hostRules.map((rule) => (
              <div
                key={rule.number}
                className={`bg-[#161810] border rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:border-[#8CB34A]/50 ${
                  rule.isWarning ? "border-[#F76B6B]/40 bg-[#1F1414]/30" : "border-[#2D3C13]"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-[#2D3C13]">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl flex items-center justify-center shrink-0 ${
                      rule.isWarning ? "bg-[#331717] border border-[#F76B6B]/30" : "bg-[#1A230A] border border-[#8CB34A]/30"
                    }`}>
                      {rule.icon}
                    </div>
                    <div>
                      <span className="text-xs font-sans font-bold text-[#72943A] uppercase tracking-wider block">
                        Rule {rule.number}
                      </span>
                      <h2 className="font-heading font-bold text-xl sm:text-2xl text-[#E8EDD4]">
                        {rule.title}
                      </h2>
                    </div>
                  </div>

                  <span className={`self-start sm:self-auto text-xs font-sans font-semibold px-3 py-1 rounded-full border ${
                    rule.isWarning 
                      ? "bg-[#331717] border-[#F76B6B]/50 text-[#F76B6B]" 
                      : "bg-[#1A230A] border-[#8CB34A]/40 text-[#8CB34A]"
                  }`}>
                    {rule.badge}
                  </span>
                </div>

                <p className="font-sans text-sm sm:text-base text-[#D4D8C4] leading-relaxed mb-6">
                  {rule.description}
                </p>

                {/* Key Points Badges */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {rule.highlights.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#0D0D0B] border border-[#2D3C13] text-xs font-sans text-[#A0D056]"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8CB34A]" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Questions & Support Callout */}
          <div className="mt-12 bg-gradient-to-r from-[#161810] via-[#1A230A] to-[#161810] border border-[#8CB34A]/40 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="font-heading font-bold text-lg text-[#E8EDD4]">
                Have Questions About Host Rules?
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#B3B8AA]">
                If you have questions regarding these rules or UKARA compliance, please contact our support team.
              </p>
            </div>

            <Link
              href="/contact"
              className="px-6 py-3 rounded-xl bg-[#8CB34A] hover:bg-[#A0D056] text-[#0D0D0B] font-heading font-bold text-sm transition-all shadow-md whitespace-nowrap shrink-0"
            >
              Contact Support →
            </Link>
          </div>

        </div>
      </main>
      <WebsiteFooter />
    </>
  );
}
