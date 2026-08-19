"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "../../../lib/utils";

const SECTIONS = [
  { id: "promoter", title: "1. The Promoter" },
  { id: "competition", title: "2. The Competition" },
  { id: "how-to-enter", title: "3. How to Enter" },
  { id: "free-entry", title: "3.11. Free Postal Entry Route" },
  { id: "choosing-winner", title: "4. Choosing a Winner" },
  { id: "eligibility", title: "5. Eligibility & Age Verification" },
  { id: "product-classification", title: "6. Product Classification & RIF Defence Checks (UKARA)" },
  { id: "claiming-prize", title: "7. Claiming Prize & Cash Alternative Process" },
  { id: "discreet-shipping", title: "8. Discreet Packaging & Controlled Fulfilment" },
  { id: "responsible-marketing", title: "9. Responsible Advertising & Marketing" },
  { id: "non-transferability", title: "10. Non-Transferability of Prizes" },
  { id: "liability", title: "11. Limitation of Liability" },
  { id: "data-protection", title: "12. Data Protection & Privacy" },
  { id: "general", title: "13. General Terms & Governing Law" },
  { id: "aml-policy", title: "14. Anti-Money Laundering (AML) Policy" },
  { id: "fair-play", title: "15. Fair Play & One Account Policy" },
];

export default function TermsContent() {
  const [activeSection, setActiveSection] = useState("promoter");

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
              <span>📜 Official Legal Documentation</span>
            </div>
            <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-[#E8EDD4] tracking-tight">
              Terms & Conditions
            </h1>
            <p className="font-sans text-sm sm:text-base text-[#72943A] max-w-2xl">
              Official rules governing all prize competitions, age verification, RIF compliance, UKARA legal defence, discreet fulfilment, and fair play on Airsoft Draws.
            </p>
            <div className="flex items-center gap-4 text-xs font-sans text-[#5A752A] pt-2">
              <span>Last Updated: August 2026</span>
              <span>•</span>
              <span>Effective Version: 3.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Sticky Toc + Content */}
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
                  href="/contact"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#1A230A] hover:bg-[#2D3C13] border border-[#43581E] text-[#A0D056] text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  ✉️ Need Legal Help? Contact Us
                </Link>
              </div>
            </div>
          </aside>

          {/* Right Main Text Content */}
          <main className="lg:col-span-8 space-y-12 text-sm leading-relaxed text-[#B3B8AA]">
            
            {/* 1. The Promoter */}
            <section id="promoter" className="bg-[#161810] border border-[#2D3C13] rounded-2xl p-6 sm:p-8 space-y-4">
              <h2 className="font-heading font-bold text-xl text-[#E8EDD4] border-b border-[#2D3C13] pb-3">
                1. The Promoter
              </h2>
              <p>
                1.1. The Promoter is: <strong className="text-[#E8EDD4]">Airsoft Draws Ltd</strong> ("Airsoft Draws") whose registered office is at Synergy House, Lawson Street, North Shields NE29 6TG.
              </p>
              <p>
                1.2. Our correspondence address is: <span className="text-[#E8EDD4]">Synergy House, Lawson Street, North Shields NE29 6TG</span>.
              </p>
              <p>
                1.3. If you wish to contact us for any reason, please email us at{" "}
                <a href="mailto:info@airsoftdraws.com" className="text-[#8CB34A] font-semibold hover:underline">
                  info@airsoftdraws.com
                </a>.
              </p>
            </section>

            {/* 2. The Competition */}
            <section id="competition" className="bg-[#161810] border border-[#2D3C13] rounded-2xl p-6 sm:p-8 space-y-4">
              <h2 className="font-heading font-bold text-xl text-[#E8EDD4] border-b border-[#2D3C13] pb-3">
                2. The Competition
              </h2>
              <p>
                2.1. These terms and conditions apply to all competitions listed on the Promoter’s website at{" "}
                <a href="https://airsoftdraws.com" className="text-[#8CB34A] font-semibold hover:underline">
                  https://airsoftdraws.com
                </a>{" "}
                (the “Website”).
              </p>
              <p>
                2.2. All competitions are skill-based competitions. Entry fees for online entries are payable each time you enter. Where the Promoter offers an easy or multiple choice question, a free postal entry route is available.
              </p>
              <p>
                2.3. To be in with a chance of winning, everyone who enters the competition (an “Entrant”) will be required to correctly answer a question or solve a problem set by the Promoter (the “Competition Question”).
              </p>
            </section>

            {/* 3. How to Enter */}
            <section id="how-to-enter" className="bg-[#161810] border border-[#2D3C13] rounded-2xl p-6 sm:p-8 space-y-4">
              <h2 className="font-heading font-bold text-xl text-[#E8EDD4] border-b border-[#2D3C13] pb-3">
                3. How to Enter
              </h2>
              <p>
                3.1. The competition will run from and including the opening and closing dates specified on the Website. These dates shall be referred to as the “Opening Date” and “Closing Date” respectively. All times and dates referred to are London, England time (GMT/BST).
              </p>
              <p>
                3.2. If it is absolutely necessary to do so, the Promoter reserves the right to change the Opening and Closing Dates. If the Promoter does change dates, the new details will be displayed on the Website. The Promoter will not extend the Closing Date simply to sell more entries.
              </p>
              <p>
                3.3. All competition entries must be received by the Promoter no later than the specified time on the Closing Date. Entries received after the specified time may be disqualified without a refund.
              </p>
              <p>
                3.4. The maximum number of entries to the competition will be stated on the Website. The number of entries you are able to make may be limited if the maximum number of entries is reached.
              </p>
              <p>
                3.5. Entrants can enter each competition as many times as they wish until the maximum per-user ticket limit is submitted.
              </p>
              <p>
                3.6. To enter online: (a) view the Competition on the Website; (b) select ticket quantity & answer the skill question; (c) complete checkout payment to receive your order confirmation & allocated ticket number(s).
              </p>

              {/* Free Postal Entry Box */}
              <div id="free-entry" className="mt-6 bg-[#111210] border border-[#8CB34A]/40 rounded-xl p-5 space-y-3">
                <h3 className="font-heading font-bold text-base text-[#A0D056] flex items-center gap-2">
                  <span>✉️ 3.11. Free Postal Entry Route Method</span>
                </h3>
                <p className="text-xs leading-relaxed text-[#B3B8AA]">
                  You may enter any competition for free by post by complying with the following conditions:
                </p>
                <ul className="list-disc list-inside space-y-1.5 text-xs text-[#E8EDD4] pl-2">
                  <li>Send your entry on an unenclosed postcard by 1st or 2nd class post to: <strong className="text-[#A0D056]">Airsoft Draws Ltd, Synergy House, Lawson Street, North Shields NE29 6TG</strong>.</li>
                  <li>Include your full name, postal address, contact phone number, email address, and the exact Competition Name.</li>
                  <li><strong>Mandatory Requirement:</strong> You MUST have created a free registered account on the Website for the free entry to be processed. Details on the postcard MUST correspond exactly to your registered account.</li>
                  <li>Each free entry must be posted separately in an individual postcard. Bulk entries in an envelope will count as only one single entry.</li>
                  <li>Entries must be received prior to the Closing Date.</li>
                </ul>
              </div>
            </section>

            {/* 4. Choosing a Winner */}
            <section id="choosing-winner" className="bg-[#161810] border border-[#2D3C13] rounded-2xl p-6 sm:p-8 space-y-4">
              <h2 className="font-heading font-bold text-xl text-[#E8EDD4] border-b border-[#2D3C13] pb-3">
                4. Choosing a Winner
              </h2>
              <p>
                4.1. All valid Entrants will be placed into a draw and the winner will be chosen by a secure random number generator (RNG) live draw within 7 days of the Closing Date (“Draw Date”).
              </p>
              <p>
                4.2. All Entrants will have their names and entry numbers included in an entry spreadsheet published on the Website during the live draw. If you wish to censor your name on the live spreadsheet, notify us at{" "}
                <a href="mailto:info@airsoftdraws.com" className="text-[#8CB34A] underline">info@airsoftdraws.com</a> at least 48 hours prior to the draw.
              </p>
            </section>

            {/* 5. Eligibility & Mandatory Age Verification */}
            <section id="eligibility" className="bg-[#161810] border border-[#2D3C13] rounded-2xl p-6 sm:p-8 space-y-4">
              <h2 className="font-heading font-bold text-xl text-[#E8EDD4] border-b border-[#2D3C13] pb-3">
                5. Eligibility & Mandatory Age Verification
              </h2>
              <p>
                5.1. Eligibility is strictly restricted to winners and participants aged <strong className="text-[#E8EDD4]">18 years or over</strong> who are legal residents of the United Kingdom. Employees of Airsoft Draws, their immediate families, or agents directly connected with competition administration are excluded from participating.
              </p>
              <p>
                5.2. <strong className="text-[#E8EDD4]">Formal Age Verification:</strong> Following a successful prize claim, you will be required to provide evidence of your age using a valid form of government-issued photo identification (e.g. UK Driving Licence or Passport) prior to the release or dispatch of any prize.
              </p>
              <p>
                5.3. Fraudulent activity, account misrepresentation under 18 years of age, hacking, or abusive behavior toward staff will result in immediate entry disqualification and account termination.
              </p>
            </section>

            {/* 6. Product Classification & Legal Defence Requirements (RIF / UKARA) */}
            <section id="product-classification" className="bg-[#161810] border border-[#2D3C13] rounded-2xl p-6 sm:p-8 space-y-4">
              <h2 className="font-heading font-bold text-xl text-[#E8EDD4] border-b border-[#2D3C13] pb-3">
                6. Product Classification & Legal Defence Requirements (RIF / UKARA)
              </h2>
              <p>
                6.1. <strong className="text-[#E8EDD4]">Product Classification:</strong> All physical airsoft replica prizes offered on Airsoft Draws are strictly classified as Realistic Imitation Firearms (RIFs) or two-tone devices under the UK Violent Crime Reduction Act 2006 (VCRA). We exclusively offer RIFs as physical replica prizes.
              </p>
              <p>
                6.2. <strong className="text-[#E8EDD4]">Legal Defence Check Prior to Release:</strong> If a prize is claimed for a RIF, the winner must provide evidence of a valid legal defence under UK law before the prize can be released (such as verifiable evidence that the winner is a regular, insured airsoft skirmisher).
              </p>
              <p>
                6.3. <strong className="text-[#E8EDD4]">UKARA Registration Status:</strong> An active UKARA registration database entry is acceptable evidence of a legal defence. However, UKARA registration shall not be described, construed, or represented as a "license".
              </p>
              <p>
                6.4. Merchants and the Promoter must evidence age checks, legal defence checks for RIFs, product classification, and safe fulfilment arrangements before any sale, transfer, or prize release is executed.
              </p>
            </section>

            {/* 7. Claiming Prize & Cash Alternative Process */}
            <section id="claiming-prize" className="bg-[#161810] border border-[#2D3C13] rounded-2xl p-6 sm:p-8 space-y-4">
              <h2 className="font-heading font-bold text-xl text-[#E8EDD4] border-b border-[#2D3C13] pb-3">
                7. Claiming Prize & Cash Alternative Process
              </h2>
              <p>
                7.1. <strong className="text-[#E8EDD4]">21-Day Claim Period:</strong> Winners will be notified via phone or email within 7 days of the Draw Date and have 21 days from initial notification to complete verification and claim their prize.
              </p>
              <p>
                7.2. <strong className="text-[#E8EDD4]">Substitution & Cash-Equivalent Process:</strong> If a winner cannot lawfully receive the prize (for example, if UKARA registration or skirmisher defence is not valid or cannot be verified), the winner will be given the advertised cash alternative instead.
              </p>
              <p>
                7.3. Cash prizes and cash alternatives will be paid directly into the winner's verified UK bank account via secure bank transfer.
              </p>
              <p>
                7.4. If a winner fails to claim the prize or cash alternative within 21 days, or refuses verification, the prize will be forfeited and an alternate winner may be drawn.
              </p>
            </section>

            {/* 8. Discreet Packaging & Controlled Fulfilment */}
            <section id="discreet-shipping" className="bg-[#161810] border border-[#2D3C13] rounded-2xl p-6 sm:p-8 space-y-4">
              <h2 className="font-heading font-bold text-xl text-[#E8EDD4] border-b border-[#2D3C13] pb-3">
                8. Discreet Packaging & Controlled Fulfilment
              </h2>
              <p>
                8.1. <strong className="text-[#E8EDD4]">Discreet Packaging:</strong> Airsoft devices must be transported discreetly, covered or cased, and not displayed in public. If a prize is claimed for a RIF (we only offer RIFs), all shipped prizes are transported discreetly wrapped in opaque black shrink wrap or securely boxed.
              </p>
              <p>
                8.2. <strong className="text-[#E8EDD4]">Tracked Recorded Delivery:</strong> All shipped prizes are sent via recorded courier delivery with full tracking information provided to the winner upon dispatch.
              </p>
              <p>
                8.3. <strong className="text-[#E8EDD4]">Controlled Delivery & Handover:</strong> Fulfilment is strictly controlled, including mandatory proof of identity, age verification, tracked release, and delivery or collection arrangements that completely avoid public display or unsafe handover.
              </p>
            </section>

            {/* 9. Responsible Advertising & Marketing Standards */}
            <section id="responsible-marketing" className="bg-[#161810] border border-[#2D3C13] rounded-2xl p-6 sm:p-8 space-y-4">
              <h2 className="font-heading font-bold text-xl text-[#E8EDD4] border-b border-[#2D3C13] pb-3">
                9. Responsible Advertising & Marketing Standards
              </h2>
              <p>
                9.1. We agree to ensure our advertising and marketing strictly avoids glamourising weapons, threatening imagery, irresponsible use, or content likely to appeal to minors.
              </p>
              <p>
                9.2. If you have any questions or concerns regarding our advertising or marketing practices, please contact us immediately at{" "}
                <a href="mailto:info@airsoftdraws.com" className="text-[#8CB34A] font-semibold hover:underline">
                  info@airsoftdraws.com
                </a>.
              </p>
            </section>

            {/* 10. Non-Transferability of Prizes */}
            <section id="non-transferability" className="bg-[#161810] border border-[#2D3C13] rounded-2xl p-6 sm:p-8 space-y-4">
              <h2 className="font-heading font-bold text-xl text-[#E8EDD4] border-b border-[#2D3C13] pb-3">
                10. Non-Transferability of Prizes
              </h2>
              <p>
                10.1. Prizes are strictly awarded to the winning ticket holder and cannot be transferred, assigned, or gifted to another person unless full lawful eligibility checks (including formal photo age verification and UKARA / legal defence checks) are repeated and satisfied for the recipient prior to release.
              </p>
            </section>

            {/* 11. Limitation of Liability */}
            <section id="liability" className="bg-[#161810] border border-[#2D3C13] rounded-2xl p-6 sm:p-8 space-y-4">
              <h2 className="font-heading font-bold text-xl text-[#E8EDD4] border-b border-[#2D3C13] pb-3">
                11. Limitation of Liability
              </h2>
              <p>
                11.1. Airsoft Draws accepts no liability for technical failures, network outages, or delayed entries.
              </p>
              <p>
                11.2. To the fullest extent permitted by law, the Promoter shall not be liable for any loss, damage, or personal injury suffered by any Entrant as a result of entering the competition or accepting any prize.
              </p>
            </section>

            {/* 12. Data Protection & Privacy */}
            <section id="data-protection" className="bg-[#161810] border border-[#2D3C13] rounded-2xl p-6 sm:p-8 space-y-4">
              <h2 className="font-heading font-bold text-xl text-[#E8EDD4] border-b border-[#2D3C13] pb-3">
                12. Data Protection & Privacy
              </h2>
              <p>
                12.1. Personal information provided will be processed strictly in accordance with our Privacy Policy and UK GDPR regulations.
              </p>
              <p>
                12.2. Winners consent to the publication of their full name and town for statutory Advertising Standards Authority (ASA) compliance proof.
              </p>
              <p>
                12.3. Entrants may request removal or correction of their personal data by contacting our Data Protection team at{" "}
                <a href="mailto:info@airsoftdraws.com" className="text-[#8CB34A] underline">info@airsoftdraws.com</a>.
              </p>
            </section>

            {/* 13. General Terms & Governing Law */}
            <section id="general" className="bg-[#161810] border border-[#2D3C13] rounded-2xl p-6 sm:p-8 space-y-4">
              <h2 className="font-heading font-bold text-xl text-[#E8EDD4] border-b border-[#2D3C13] pb-3">
                13. General Terms & Governing Law
              </h2>
              <p>
                13.1. Competitions are governed by English Law and the exclusive jurisdiction of the courts of England & Wales.
              </p>
              <p>
                13.2. Competitions on Airsoft Draws are in no way sponsored, endorsed, or administered by Meta (Facebook/Instagram).
              </p>
            </section>

            {/* 14. Anti-Money Laundering (AML) Policy */}
            <section id="aml-policy" className="bg-[#161810] border border-[#2D3C13] rounded-2xl p-6 sm:p-8 space-y-4">
              <h2 className="font-heading font-bold text-xl text-[#E8EDD4] border-b border-[#2D3C13] pb-3">
                14. Anti-Money Laundering (AML) Policy
              </h2>
              <p>
                14.1. Airsoft Draws enforces strict anti-money laundering measures under UK regulations and the Gambling Act 2005.
              </p>
              <p>
                14.2. A designated Money Laundering Reporting Officer (MLRO) oversees platform compliance.
              </p>
              <p>
                14.3. Anonymous accounts, cash payments, or registrations under 18 years of age are strictly prohibited. Refunds & prize transfers are executed back to the original funding route.
              </p>
            </section>

            {/* 15. Fair Play & Strict One Account Policy */}
            <section id="fair-play" className="bg-[#161810] border border-[#2D3C13] rounded-2xl p-6 sm:p-8 space-y-4">
              <h2 className="font-heading font-bold text-xl text-[#E8EDD4] border-b border-[#2D3C13] pb-3">
                15. Fair Play & Strict One Account Policy
              </h2>
              <p>
                15.1. <strong className="text-[#E8EDD4]">One Account Per Person:</strong> Each participant is strictly limited to one user account on Airsoft Draws.
              </p>
              <p>
                15.2. Creating duplicate accounts to gain an unfair advantage in free giveaways or ticket limits is strictly forbidden.
              </p>
              <p>
                15.3. If duplicate accounts are detected, all entries will be rendered void and forfeited without refund, and offending accounts will be permanently banned.
              </p>
            </section>

          </main>

        </div>
      </div>
    </div>
  );
}

