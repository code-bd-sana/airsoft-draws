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

export default async function VerifiedHostsPage() {
  let verifiedHosts = [];
  try {
    const apiUrl = process.env.BACKEND_API_URL || 'http://127.0.0.1:5000/api/v1';
    const res = await fetch(`${apiUrl}/hosts/verified`, {
      cache: 'no-store'
    });
    if (res.ok) {
      const json = await res.json();
      verifiedHosts = json.data || json;
    }
  } catch (err) {
    console.error("Failed to fetch verified hosts", err);
  }

  return (
    <>
      <WebsiteNavbar />
      <main className="flex-grow bg-bg pt-28 pb-20">
        <div className="container-custom">
          <div className="max-w-[800px] mb-12 flex flex-col gap-3">
            <h1 className="font-heading font-bold text-[36px] md:text-[48px] text-[#E8EDD4] tracking-tight">
              All Verified Hosts
            </h1>
            <p className="font-sans text-[14px] md:text-[16px] text-[#72943A] leading-relaxed max-w-[600px]">
              Explore our directory of fully vetted partners. Every host on Airsoft Draws undergoes rigorous background and business checks to ensure your competitions are secure, fair, and legally compliant.
            </p>
          </div>
          
          <VerifiedHostsList hosts={verifiedHosts} />
        </div>
      </main>
      <WebsiteFooter />
    </>
  );
}
