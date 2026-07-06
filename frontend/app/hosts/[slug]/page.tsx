import React from "react";
import { Metadata } from "next";
import WebsiteNavbar from "../../../components/website/layout/WebsiteNavbar";
import WebsiteFooter from "../../../components/website/layout/WebsiteFooter";
import HostProfileHeader from "../../../components/website/host-profile/HostProfileHeader";
import HostProfileTabs from "../../../components/website/host-profile/HostProfileTabs";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  let name = slug;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api/v1'}/hosts/public/${slug}`);
    if (res.ok) {
      const json = await res.json();
      const host = json.data || json;
      name = host.name;
    }
  } catch (e) {}

  return {
    title: `${name} | Airsoft Draws Verified Host`,
    description: `View live and past competitions hosted by ${name}.`,
  };
}

export default async function HostProfilePage({ params }: PageProps) {
  const { slug } = await params;
  
  let host = null;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api/v1'}/hosts/public/${slug}`, {
      cache: 'no-store'
    });
    if (res.ok) {
      const json = await res.json();
      host = json.data || json;
    }
  } catch (e) {
    console.error("Failed to fetch host", e);
  }

  if (!host) {
    return (
      <>
        <WebsiteNavbar />
        <main className="min-h-screen bg-background flex items-center justify-center pt-[80px]">
          <div className="text-center">
            <h1 className="text-2xl text-[#E8EDD4] mb-4">Host Not Found</h1>
            <p className="text-[#72943A]">This host does not exist or has been removed.</p>
          </div>
        </main>
        <WebsiteFooter />
      </>
    );
  }

  const name = host.name;
  const initials = name.split(' ').map((w: string) => w[0]).join('').substring(0, 2).toUpperCase();

  return (
    <>
      <WebsiteNavbar />
      
      <main className="min-h-screen bg-background pt-[80px] md:pt-[90px]">
        <section className="py-12 md:py-16">
          <div className="container-custom">
            
            <div className="max-w-[1200px] mx-auto w-full flex flex-col">
              <HostProfileHeader 
                name={name}
                logo={host.logo || initials}
                bio={host.bio || "Airsoft draws host"}
                isVerified={host.isVerified}
                drawsHosted={host.drawsHosted}
                rating={host.rating}
                memberSince={host.memberSince}
              />
              
              <HostProfileTabs raffles={host.raffles} />
            </div>

          </div>
        </section>
      </main>

      <WebsiteFooter />
    </>
  );
}
