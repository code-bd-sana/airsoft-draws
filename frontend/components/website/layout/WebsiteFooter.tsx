import React from "react";
import Link from "next/link";
import { FOOTER_SECTIONS, BRAND_NAME } from "../../../lib/constants";

/**
 * Global website footer matching the Figma Frame 46 design specification.
 */
export default function WebsiteFooter() {
  // Render social media icons using simple inline SVGs
  const renderSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "facebook":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
          </svg>
        );
      case "twitter":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        );
      case "instagram":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01" />
          </svg>
        );
      case "discord":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.094 13.094 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <footer className="bg-bg border-t border-divider py-16 mt-auto">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Logo & Intro Column */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <Link href="/" className="flex items-center gap-2.5 w-fit">
              <div className="flex items-center justify-center w-8 h-8 rounded bg-accent-bg border border-primary">
                <span className="w-2.5 h-2.5 rounded-full bg-primary" />
              </div>
              <span className="font-heading font-bold text-lg text-text-primary uppercase tracking-wide">
                {BRAND_NAME}
              </span>
            </Link>

            <p className="font-sans text-xs text-text-muted leading-relaxed max-w-sm">
              The premier marketplace for airsoft gear prize competitions. Win top-tier replicas, tactical loadouts, and cash prizes from just £1. Transparent escrow payouts for secure hosting.
            </p>

            {/* Social Icons row */}
            <div className="flex items-center gap-3.5 mt-2">
              {["Facebook", "Twitter", "Instagram", "Discord"].map((platform) => (
                <a
                  key={platform}
                  href={`https://${platform.toLowerCase()}.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-9 h-9 rounded bg-accent-bg border border-divider text-text-muted hover:text-text-brand hover:border-primary transition-all duration-200"
                  aria-label={`${platform} Profile`}
                >
                  {renderSocialIcon(platform)}
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title} className="flex flex-col gap-4">
              <h4 className="font-heading font-bold text-xs text-text-brand uppercase tracking-wider">
                {section.title}
              </h4>
              <ul className="flex flex-col gap-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="font-sans text-xs text-text-muted hover:text-text-primary transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Regulatory & Copy row */}
        <div className="border-t border-divider pt-8 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 text-[10px] text-text-muted leading-relaxed">
          <div className="max-w-3xl">
            <p className="mb-2">
              © {new Date().getFullYear()} {BRAND_NAME}. All rights reserved. Registered in England & Wales.
            </p>
            <p>
              Prize draws are operated in accordance with the UK Gambling Act 2005 as compliant prize competitions. Participation is limited to individuals aged 18 or older resident in eligible jurisdictions. Ticket purchases are final and escrowed securely.
            </p>
          </div>
          
          <div className="flex items-center gap-4 self-start lg:self-center bg-accent-bg border border-divider px-4 py-2.5 rounded-button text-[10px] text-text-brand font-semibold whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            100% Secure SSL Escrow Payments
          </div>
        </div>
      </div>
    </footer>
  );
}
