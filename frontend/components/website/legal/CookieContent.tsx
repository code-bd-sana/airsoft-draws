"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "../../../lib/utils";

const SECTIONS = [
  { id: "introduction", title: "1. Introduction & Consent" },
  { id: "what-are-cookies", title: "2. What Are Cookies?" },
  { id: "how-we-use-cookies", title: "3. How We Use Cookies" },
  { id: "types-of-cookies", title: "4. Types of Cookies We Use" },
  { id: "control-preferences", title: "5. Controlling Cookie Preferences" },
];

export default function CookieContent() {
  const [activeSection, setActiveSection] = useState("introduction");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const section of SECTIONS) {
        const element = document.getElementById(section.id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-full bg-[#0D0D0B] text-[#E8EDD4] pt-24 pb-20">
      
      {/* Top Banner */}
      <div className="border-b border-[#2D3C13] bg-[#111210]/60 backdrop-blur-md py-12 mb-12">
        <div className="container-custom max-w-6xl mx-auto px-4">
          <div className="flex flex-col gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A230A] border border-[#43581E] text-[#8CB34A] text-xs font-semibold w-fit">
              <span>🍪 Cookie Transparency</span>
            </div>
            <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-[#E8EDD4] tracking-tight">
              Cookie Policy
            </h1>
            <p className="font-sans text-sm sm:text-base text-[#72943A] max-w-2xl">
              This policy details what cookies are, how Airsoft Draws uses them, the categories of cookies deployed, and how to manage your cookie preferences.
            </p>
            <div className="flex items-center gap-4 text-xs font-sans text-[#5A752A] pt-2">
              <span>Last Updated: April 2026</span>
              <span>•</span>
              <span>Applies to Domain: airsoftdraws.com</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Toc + Content */}
      <div className="container-custom max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Table of Contents */}
          <aside className="lg:col-span-4 hidden lg:block">
            <div className="sticky top-28 bg-[#161810] border border-[#2D3C13] rounded-2xl p-5 space-y-2">
              <h3 className="font-heading font-bold text-xs text-[#8CB34A] uppercase tracking-wider mb-3 px-2">
                Table of Contents
              </h3>
              <nav className="flex flex-col space-y-1">
                {SECTIONS.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => scrollTo(sec.id)}
                    className={cn(
                      "text-left px-3 py-2 rounded-xl text-xs font-sans transition-all duration-200 truncate",
                      activeSection === sec.id
                        ? "bg-[#1A230A] text-[#A0D056] font-semibold border-l-2 border-[#8CB34A] pl-3"
                        : "text-[#72943A] hover:bg-[#111210] hover:text-[#E8EDD4]"
                    )}
                  >
                    {sec.title}
                  </button>
                ))}
              </nav>
              
              <div className="pt-4 border-t border-[#2D3C13] mt-4">
                <Link
                  href="/privacy"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#1A230A] hover:bg-[#2D3C13] border border-[#43581E] text-[#A0D056] text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  🔒 View Privacy Policy
                </Link>
              </div>
            </div>
          </aside>

          {/* Right Main Text Content */}
          <main className="lg:col-span-8 space-y-12 text-sm leading-relaxed text-[#B3B8AA]">
            
            {/* 1. Introduction & Scope */}
            <section id="introduction" className="bg-[#161810] border border-[#2D3C13] rounded-2xl p-6 sm:p-8 space-y-4">
              <h2 className="font-heading font-bold text-xl text-[#E8EDD4] border-b border-[#2D3C13] pb-3">
                1. Introduction & Consent
              </h2>
              <p>
                This Cookie Policy explains what cookies are and how <strong className="text-[#E8EDD4]">Airsoft Draws</strong> uses them. It details the types of cookies we deploy (i.e. the information we collect using cookies and how that information is used) and how to control your cookie preferences.
              </p>
              <p>
                For further information on how we use, store, and keep your personal data secure, please refer to our{" "}
                <Link href="/privacy" className="text-[#8CB34A] font-semibold underline">
                  Privacy Policy
                </Link>.
              </p>
              <p>
                You can at any time change or withdraw your consent from the Cookie Declaration on our website. You can also learn more about who we are, how you can contact us, and how we process personal data in our Privacy Policy.
              </p>
              <div className="bg-[#111210] border border-[#2D3C13] rounded-xl p-4 mt-2">
                <span className="font-sans text-xs text-[#8CB34A] font-semibold block">Consent Domain Scope:</span>
                <span className="font-sans text-xs text-[#E8EDD4]">Your cookie consent applies to the following domain: <strong>airsoftdraws.com</strong></span>
              </div>
            </section>

            {/* 2. What Are Cookies */}
            <section id="what-are-cookies" className="bg-[#161810] border border-[#2D3C13] rounded-2xl p-6 sm:p-8 space-y-4">
              <h2 className="font-heading font-bold text-xl text-[#E8EDD4] border-b border-[#2D3C13] pb-3">
                2. What Are Cookies?
              </h2>
              <p>
                Cookies are small text files that are used to store small pieces of information. They are stored on your device when the website is loaded on your browser.
              </p>
              <p>
                These cookies help us make the website function properly, make it more secure, provide a better user experience, and understand how the website performs so we can analyze what works and where improvements are needed.
              </p>
            </section>

            {/* 3. How Do We Use Cookies */}
            <section id="how-we-use-cookies" className="bg-[#161810] border border-[#2D3C13] rounded-2xl p-6 sm:p-8 space-y-4">
              <h2 className="font-heading font-bold text-xl text-[#E8EDD4] border-b border-[#2D3C13] pb-3">
                3. How Do We Use Cookies?
              </h2>
              <p>
                Similar to most online services, our website uses first-party and third-party cookies for several purposes.
              </p>
              <div className="space-y-3 pt-1">
                <div className="bg-[#111210] p-4 rounded-xl border border-[#2D3C13]">
                  <h4 className="font-heading font-bold text-xs text-[#A0D056]">First-Party Cookies</h4>
                  <p className="text-xs text-[#B3B8AA] mt-1">
                    First-party cookies are mostly necessary for the website to function the right way, and they do not collect any of your personally identifiable data.
                  </p>
                </div>
                <div className="bg-[#111210] p-4 rounded-xl border border-[#2D3C13]">
                  <h4 className="font-heading font-bold text-xs text-[#A0D056]">Third-Party Cookies</h4>
                  <p className="text-xs text-[#B3B8AA] mt-1">
                    The third-party cookies used on our website are mainly for understanding how the website performs, how you interact with our website, keeping our services secure, providing relevant announcements/promotions, providing a better user experience, and speeding up your future interactions with our site.
                  </p>
                </div>
              </div>
            </section>

            {/* 4. What Types of Cookies Do We Use */}
            <section id="types-of-cookies" className="bg-[#161810] border border-[#2D3C13] rounded-2xl p-6 sm:p-8 space-y-4">
              <h2 className="font-heading font-bold text-xl text-[#E8EDD4] border-b border-[#2D3C13] pb-3">
                4. What Types of Cookies Do We Use?
              </h2>

              <div className="space-y-4 pt-2">
                
                {/* Essential */}
                <div className="bg-[#111210] p-5 rounded-xl border border-[#2D3C13] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-heading font-bold text-sm text-[#A0D056]">Essential Cookies</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1A230A] text-[#8CB34A] border border-[#43581E]">Strictly Necessary</span>
                  </div>
                  <p className="text-xs text-[#B3B8AA]">
                    Some cookies are essential for you to experience the full functionality of our site. They allow us to maintain user sessions and prevent security threats. They do not collect or store personal information. For example, these cookies allow you to log in to your Airsoft Draws account, add tickets to your cart, and check out securely.
                  </p>
                </div>

                {/* Functional */}
                <div className="bg-[#111210] p-5 rounded-xl border border-[#2D3C13] space-y-1.5">
                  <h4 className="font-heading font-bold text-sm text-[#A0D056]">Functional Cookies</h4>
                  <p className="text-xs text-[#B3B8AA]">
                    These cookies support non-essential functionalities on our website, such as embedding video content or sharing website content on social media platforms.
                  </p>
                </div>

                {/* Statistics */}
                <div className="bg-[#111210] p-5 rounded-xl border border-[#2D3C13] space-y-1.5">
                  <h4 className="font-heading font-bold text-sm text-[#A0D056]">Statistics Cookies</h4>
                  <p className="text-xs text-[#B3B8AA]">
                    These cookies store information like visitor counts, unique visitors, pages visited, referral sources, etc. This data helps us understand and analyze how well the website performs and where improvements are needed.
                  </p>
                </div>

                {/* Preferences */}
                <div className="bg-[#111210] p-5 rounded-xl border border-[#2D3C13] space-y-1.5">
                  <h4 className="font-heading font-bold text-sm text-[#A0D056]">Preferences Cookies</h4>
                  <p className="text-xs text-[#B3B8AA]">
                    These cookies help us store your settings and browsing preferences (such as theme or regional settings) so you enjoy an efficient experience on future visits.
                  </p>
                </div>

              </div>
            </section>

            {/* 5. How Can I Control Cookie Preferences */}
            <section id="control-preferences" className="bg-[#161810] border border-[#2D3C13] rounded-2xl p-6 sm:p-8 space-y-4">
              <h2 className="font-heading font-bold text-xl text-[#E8EDD4] border-b border-[#2D3C13] pb-3">
                5. How Can I Control Cookie Preferences?
              </h2>
              <p>
                Should you decide to change your preferences later through your browsing session, you can clear your cookies in your browser and reload the page. This will display the consent notice again, enabling you to customize your preferences or withdraw your consent entirely.
              </p>
              <p>
                In addition, different web browsers provide different methods to block and delete cookies used by websites. You can change your browser settings to block or delete cookies:
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="bg-[#111210] p-3 rounded-xl border border-[#2D3C13] text-center">
                  <span className="font-sans font-bold text-xs text-[#E8EDD4] block">Google Chrome</span>
                  <span className="text-[10px] text-[#72943A]">Settings &gt; Privacy</span>
                </div>
                <div className="bg-[#111210] p-3 rounded-xl border border-[#2D3C13] text-center">
                  <span className="font-sans font-bold text-xs text-[#E8EDD4] block">Apple Safari</span>
                  <span className="text-[10px] text-[#72943A]">Preferences &gt; Privacy</span>
                </div>
                <div className="bg-[#111210] p-3 rounded-xl border border-[#2D3C13] text-center">
                  <span className="font-sans font-bold text-xs text-[#E8EDD4] block">Mozilla Firefox</span>
                  <span className="text-[10px] text-[#72943A]">Options &gt; Privacy</span>
                </div>
                <div className="bg-[#111210] p-3 rounded-xl border border-[#2D3C13] text-center">
                  <span className="font-sans font-bold text-xs text-[#E8EDD4] block">Microsoft Edge</span>
                  <span className="text-[10px] text-[#72943A]">Settings &gt; Cookies</span>
                </div>
              </div>

              <p className="text-xs text-[#72943A] pt-3">
                For further information on managing your data, please contact our privacy team at <a href="mailto:info@airsoftdraws.com" className="text-[#8CB34A] underline">info@airsoftdraws.com</a>.
              </p>
            </section>

          </main>

        </div>
      </div>
    </div>
  );
}
