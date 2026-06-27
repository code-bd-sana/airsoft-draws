import React from "react";
import { Metadata } from "next";
import { verifiedHostsData } from "../../data/hosts/hosts.data";
import VerifiedHostsList from "../../components/website/verified-hosts/VerifiedHostsList";
import WebsiteNavbar from "../../components/website/layout/WebsiteNavbar";
import WebsiteFooter from "../../components/website/layout/WebsiteFooter";

export const metadata: Metadata = {
  title: "Verified Hosts | Airsoft Draws",
  description: "Browse verified hosts running premium airsoft competitions.",
};

export default function VerifiedHostsPage() {
  return (
    <>
      <WebsiteNavbar />
      <main className="flex-grow bg-bg pt-28 pb-20">
        <div className="container-custom">
          <div className="max-w-2xl mb-12">
            <h1 className="font-heading font-bold text-4xl md:text-5xl text-text-primary tracking-tight mb-4">
              Verified Hosts
            </h1>
            <p className="font-sans text-base text-text-muted leading-relaxed">
              Explore trusted partners running secure prize competitions.
            </p>
          </div>
          
          <VerifiedHostsList hosts={verifiedHostsData} />
        </div>
      </main>
      <WebsiteFooter />
    </>
  );
}
