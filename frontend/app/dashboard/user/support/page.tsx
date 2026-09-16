"use client";

import React from "react";
import ContactForm from "../../../../components/website/contact/ContactForm";
import ContactInfoCards from "../../../../components/website/contact/ContactInfoCards";

export default function UserSupportPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto w-full animate-fadeIn">
      {/* Header section */}
      <div className="mb-6 lg:mb-8">
        <h1 className="font-heading font-bold text-2xl lg:text-3xl text-[#E8EDD4] mb-2">
          Support & Help Center
        </h1>
        <p className="font-sans text-xs sm:text-sm text-[#72943A]">
          Have a question about your entries, account, or hosting? Submit a message below or chat with our team directly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Contact Form */}
        <div className="lg:col-span-7">
          <ContactForm />
        </div>

        {/* Right Column: Support Info cards */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <ContactInfoCards />
        </div>
      </div>
    </div>
  );
}
