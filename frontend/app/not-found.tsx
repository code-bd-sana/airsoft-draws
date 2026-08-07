import React from "react";
import Link from "next/link";
import WebsiteNavbar from "../components/website/layout/WebsiteNavbar";
import WebsiteFooter from "../components/website/layout/WebsiteFooter";

export default function NotFound() {
  return (
    <>
      <WebsiteNavbar />
      
      <main className="min-h-screen bg-[#0D0D0B] text-[#E8EDD4] pt-28 pb-20 flex flex-col justify-center relative overflow-hidden">
        {/* Glowing Background Radial Effects */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#8CB34A]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] bg-[#8CB34A]/5 rounded-full blur-[90px] pointer-events-none" />

        <div className="container-custom max-w-4xl mx-auto px-4 text-center relative z-10 my-auto">
          
          {/* Tactical Target Graphic & 404 Badge */}
          <div className="relative inline-flex items-center justify-center mb-8">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-[#161810] border-2 border-[#2D3C13] flex items-center justify-center relative shadow-[0_0_40px_rgba(140,179,74,0.15)]">
              {/* Tactical Crosshair SVG */}
              <svg
                className="w-16 h-16 sm:w-20 sm:h-20 text-[#8CB34A]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth={1.5} strokeDasharray="3 3" />
                <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth={1.5} />
                <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v3m0 14v3M2 12h3m14 0h3" />
              </svg>

              {/* Pulsing ring indicator */}
              <span className="absolute inset-0 rounded-full border border-[#8CB34A]/40 animate-ping opacity-25" />
            </div>

            {/* Glowing 404 Tag */}
            <span className="absolute -bottom-3 bg-[#1A230A] border border-[#8CB34A] text-[#8CB34A] text-xs font-sans font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-md">
              404 • Target Missing
            </span>
          </div>

          {/* Heading & Subtitle */}
          <h1 className="font-heading font-extrabold text-4xl sm:text-6xl text-[#E8EDD4] tracking-tight mb-4 leading-tight">
            Target Out of Range
          </h1>

          <p className="font-sans text-base sm:text-lg text-[#B3B8AA] max-w-xl mx-auto mb-10 leading-relaxed">
            The page or competition you are looking for has moved, expired, or doesn't exist. Take aim back to safety or check out our live raffles.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Link
              href="/"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#8CB34A] hover:bg-[#A0D056] text-[#0D0D0B] font-heading font-bold text-sm transition-all shadow-lg hover:shadow-[#8CB34A]/20 flex items-center justify-center gap-2 group"
            >
              <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              <span>Back to Homepage</span>
            </Link>

            <Link
              href="/live-raffles"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#161810] hover:bg-[#1A230A] border border-[#2D3C13] hover:border-[#8CB34A]/60 text-[#E8EDD4] font-heading font-semibold text-sm transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4 text-[#8CB34A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-12v.75m0 3v.75m0 3v.75m0 3V18M3 7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v9a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 16.5v-9z" />
              </svg>
              <span>Explore Live Raffles</span>
            </Link>
          </div>

          {/* Quick Helpful Links Box */}
          <div className="bg-[#161810] border border-[#2D3C13] rounded-2xl p-6 max-w-2xl mx-auto shadow-md">
            <h3 className="font-heading font-bold text-xs text-[#8CB34A] uppercase tracking-wider mb-4">
              Quick Navigation Shortcuts
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-sans">
              <Link
                href="/how-it-works"
                className="p-3 rounded-xl bg-[#111210] border border-[#2D3C13] text-[#B3B8AA] hover:text-[#E8EDD4] hover:border-[#8CB34A]/40 transition-colors text-center font-medium"
              >
                How It Works
              </Link>

              <Link
                href="/winners"
                className="p-3 rounded-xl bg-[#111210] border border-[#2D3C13] text-[#B3B8AA] hover:text-[#E8EDD4] hover:border-[#8CB34A]/40 transition-colors text-center font-medium"
              >
                Past Winners
              </Link>

              <Link
                href="/pricing"
                className="p-3 rounded-xl bg-[#111210] border border-[#2D3C13] text-[#B3B8AA] hover:text-[#E8EDD4] hover:border-[#8CB34A]/40 transition-colors text-center font-medium"
              >
                Pricing & FAQ
              </Link>

              <Link
                href="/contact"
                className="p-3 rounded-xl bg-[#111210] border border-[#2D3C13] text-[#B3B8AA] hover:text-[#E8EDD4] hover:border-[#8CB34A]/40 transition-colors text-center font-medium"
              >
                Contact Support
              </Link>
            </div>
          </div>

        </div>
      </main>

      <WebsiteFooter />
    </>
  );
}
