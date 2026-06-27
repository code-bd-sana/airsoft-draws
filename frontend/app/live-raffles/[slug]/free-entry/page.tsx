import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import WebsiteNavbar from "../../../../components/website/layout/WebsiteNavbar";
import WebsiteFooter from "../../../../components/website/layout/WebsiteFooter";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const metadata: Metadata = {
  title: "Free Entry Information | Airsoft Draws",
};

export default async function FreeEntryPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <>
      <WebsiteNavbar />
      <main className="flex-grow bg-bg pt-28 pb-20">
        <div className="container-custom max-w-3xl">
          <Link href={`/live-raffles/${slug}`} className="text-xs font-semibold text-text-muted hover:text-text-primary transition-colors flex items-center gap-1 mb-8 w-fit">
            ← Back to Competition
          </Link>
          
          <div className="bg-[#161810] border border-border rounded-card p-6 md:p-10">
            <h1 className="font-heading font-bold text-3xl text-text-primary mb-6">
              Free Postal Entry
            </h1>
            
            <div className="space-y-6 text-sm text-text-muted leading-relaxed font-sans">
              <p>
                To enter this competition for free by post, you must send an unenclosed postcard containing the following information:
              </p>
              
              <ul className="list-disc pl-5 space-y-2 text-[#72943a]">
                <li>The name of the competition you wish to enter.</li>
                <li>Your full name and address.</li>
                <li>Your date of birth (you must be 18 or older).</li>
                <li>Your contact telephone number and email address.</li>
                <li>The correct answer to the competition question (if applicable).</li>
              </ul>
              
              <div className="bg-accent-bg border border-border p-5 rounded-md my-6">
                <h3 className="font-heading font-bold text-text-primary mb-2">Send your entry to:</h3>
                <p className="text-text-secondary">
                  [TODO: CLIENT APPROVED LEGAL ADDRESS]<br />
                  PO Box 1234<br />
                  London<br />
                  EC1A 1BB
                </p>
              </div>
              
              <p>
                <strong>Important Information:</strong>
              </p>
              <ul className="list-disc pl-5 space-y-2 text-text-muted">
                <li>Postal entries are limited to one entry per household per competition.</li>
                <li>Your entry must arrive before the closing date of the competition. Entries received after this date will not be processed.</li>
                <li>All free entries must be handwritten and clearly legible. Illegible entries will be disqualified.</li>
                <li>By entering, you confirm you have read and agree to our full Terms and Conditions.</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <WebsiteFooter />
    </>
  );
}
