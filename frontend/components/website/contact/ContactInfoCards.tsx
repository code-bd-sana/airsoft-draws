import React from "react";
import Link from "next/link";
import { CONTACT_INFO_ITEMS } from "../../../data/contact/contact-info.data";

/**
 * Sidebar contact details stack including support schedule, FAQ promo,
 * and quick contact method cards.
 */
export default function ContactInfoCards() {
  // Renders card icon based on type
  const renderIcon = (type: string) => {
    switch (type) {
      case "email":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5 text-text-brand"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
            />
          </svg>
        );
      case "chat":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5 text-text-brand"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a.598.598 0 0 1-.655-.705l.85-3.47a7.453 7.453 0 0 1-1.89-3.53C3.72 12.217 7.73 8.25 12.75 8.25S21.75 12.217 21 12Z"
            />
          </svg>
        );
      case "time":
      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5 text-text-brand"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        );
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      
      {/* 3 Quick Contact Info Cards */}
      {CONTACT_INFO_ITEMS.map((item) => (
        <div
          key={item.id}
          className="bg-elevated border border-border rounded-[14px] p-5 flex items-center gap-4 transition-all duration-200 hover:border-border-medium"
        >
          {/* Rounded Icon Circle */}
          <div className="w-10 h-10 rounded-full bg-accent-bg border border-border-medium flex items-center justify-center shrink-0">
            {renderIcon(item.type)}
          </div>
          
          {/* Card Body */}
          <div className="flex flex-col min-w-0">
            <span className="font-sans font-medium text-sm text-text-primary">
              {item.title}
            </span>
            {item.href ? (
              <a
                href={item.href}
                className="font-sans text-xs text-text-secondary hover:text-text-brand truncate mt-0.5"
              >
                {item.value}
              </a>
            ) : (
              <span className="font-sans text-xs text-text-secondary truncate mt-0.5">
                {item.value}
              </span>
            )}
          </div>
        </div>
      ))}

      {/* FAQ Promo Card */}
      <div className="bg-[#1a230a] border border-[#2d3c13] rounded-[14px] p-5.5 flex flex-col items-start hover:shadow-glow transition-all duration-300">
        <h4 className="font-sans font-medium text-sm text-text-primary mb-2">
          Looking for quick answers?
        </h4>
        <p className="font-sans text-[13px] text-text-secondary leading-relaxed mb-4">
          Our FAQ covers the most common questions about entries, payments, and hosting.
        </p>
        <Link
          href="/pricing#faq"
          className="font-sans font-medium text-[13px] text-text-brand hover:underline flex items-center gap-1 group"
        >
          Visit our FAQ
          <span className="transition-transform duration-200 group-hover:translate-x-1">&#8594;</span>
        </Link>
      </div>

      {/* Support Hours Card */}
      <div className="bg-elevated border border-border rounded-[14px] p-5.5 flex flex-col">
        <h4 className="font-sans font-medium text-sm text-text-primary mb-4">
          Support Hours
        </h4>
        <div className="flex flex-col font-sans text-xs md:text-sm">
          {/* Mon-Fri */}
          <div className="flex justify-between py-2 border-b border-divider">
            <span className="text-text-secondary">Monday – Friday</span>
            <span className="text-text-primary">9:00am – 6:00pm GMT</span>
          </div>
          {/* Sat */}
          <div className="flex justify-between py-2 border-b border-divider">
            <span className="text-text-secondary">Saturday</span>
            <span className="text-text-primary">10:00am – 2:00pm GMT</span>
          </div>
          {/* Sun */}
          <div className="flex justify-between py-2 border-b border-divider">
            <span className="text-text-secondary">Sunday</span>
            <span className="text-text-muted/40">Closed</span>
          </div>
        </div>
      </div>

    </div>
  );
}
