import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { verifiedHostsData } from "../../../data/hosts/hosts.data";
import { liveDrawsData } from "../../../data/homepage/featured-draws.data";
import WebsiteNavbar from "../../../components/website/layout/WebsiteNavbar";
import WebsiteFooter from "../../../components/website/layout/WebsiteFooter";
import DrawCard from "../../../components/website/shared/DrawCard";
import HostReviewList from "../../../components/website/host-reviews/HostReviewList";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const host = verifiedHostsData.find(h => h.slug === slug);
  return {
    title: host ? `${host.name} | Verified Host` : "Host Not Found",
  };
}

export default async function VerifiedHostDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const host = verifiedHostsData.find(h => h.slug === slug);

  if (!host) {
    notFound();
  }

  // Mock: Assign first 3 draws to this host
  const hostDraws = liveDrawsData.slice(0, 3);

  return (
    <>
      <WebsiteNavbar />
      <main className="flex-grow bg-bg pt-28 pb-20">
        <div className="container-custom">
          {/* Back link */}
          <Link href="/verified-hosts" className="text-xs font-semibold text-text-muted hover:text-text-primary transition-colors flex items-center gap-1 mb-8 w-fit">
            ← Back to Hosts
          </Link>

          {/* Host Profile Header */}
          <div className="bg-[#161810] border border-border rounded-[14px] p-6 md:p-10 mb-12 flex flex-col md:flex-row gap-6 md:gap-10 items-start md:items-center relative">
            {host.isVerified && (
              <div className="absolute top-6 right-6 bg-primary text-primary-text px-3 py-1 rounded-badge text-xs font-semibold flex items-center select-none font-sans shadow-sm">
                ✓ Verified
              </div>
            )}
            
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-accent-bg border-2 border-border-medium flex items-center justify-center font-heading font-bold text-4xl text-text-brand shrink-0">
              {host.logo || host.name.charAt(0)}
            </div>
            
            <div className="flex flex-col">
              <h1 className="font-heading font-bold text-3xl md:text-4xl text-text-primary mb-2">
                {host.name}
              </h1>
              <p className="font-sans text-sm md:text-base text-text-muted max-w-2xl mb-4">
                {host.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-6 text-sm font-sans text-text-secondary">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-text-primary">{host.competitionCount}</span>
                  <span>Competitions</span>
                </div>
                {host.averageRating && (
                  <div className="flex items-center gap-2">
                    <span className="text-[#eab308] text-lg">★</span>
                    <span className="font-semibold text-text-primary">{host.averageRating}</span>
                    <span>({host.totalReviews} reviews)</span>
                  </div>
                )}
                {host.category && (
                  <div className="flex items-center gap-2">
                    <span>Category:</span>
                    <span className="font-semibold text-text-primary">{host.category}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Host's Active Competitions */}
          <div className="mb-16">
            <h2 className="font-heading font-bold text-2xl text-text-primary mb-6">
              Active Competitions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {hostDraws.map((draw) => (
                <DrawCard key={draw.id} draw={draw} />
              ))}
            </div>
          </div>

          {/* Host Reviews Section */}
          <div>
            <h2 className="font-heading font-bold text-2xl text-text-primary mb-6">
              Host Reviews
            </h2>
            <HostReviewList hostId={host.id} />
          </div>
        </div>
      </main>
      <WebsiteFooter />
    </>
  );
}
