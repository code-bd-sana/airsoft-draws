import React from "react";
import type { Metadata } from "next";
import WebsiteNavbar from "../../components/website/layout/WebsiteNavbar";
import WebsiteFooter from "../../components/website/layout/WebsiteFooter";
import ContactHero from "../../components/website/contact/ContactHero";
import ContactForm from "../../components/website/contact/ContactForm";
import ContactInfoCards from "../../components/website/contact/ContactInfoCards";

export const metadata: Metadata = {
  title: "Contact Us | Airsoft Draws",
  description:
    "Have questions about draw competitions, hosting fees, or verification? Send us a message and our support crew will reach out within 24 hours.",
};

/**
 * Public 'Contact' page route at `/contact`.
 * Composes layout for header navbar, Hero subheadings, two-column form & support contact grids, and footer.
 */
export default function ContactPage() {
  return (
    <>
      {/* Sticky top navbar */}
      <WebsiteNavbar />

      <main className="min-h-screen flex flex-col bg-bg pt-20 lg:pt-[66px]">
        {/* Page Hero subheaders */}
        <ContactHero />

        {/* Form and Support Info section */}
        <section className="w-full bg-bg py-16 md:py-24">
          <div className="container-custom max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12">
              
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
        </section>
      </main>

      {/* Global website footer */}
      <WebsiteFooter />
    </>
  );
}
