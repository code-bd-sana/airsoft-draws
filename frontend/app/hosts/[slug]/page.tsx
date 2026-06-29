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
  
  // Format slug to readable name for basic mock
  const name = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return {
    title: `${name} | Airsoft Draws Verified Host`,
    description: `View live and past competitions hosted by ${name}.`,
  };
}

export default async function HostProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const name = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const initials = name.split(' ').map(w => w[0]).join('').substring(0, 2);

  return (
    <>
      <WebsiteNavbar />
      
      <main className="min-h-screen bg-background pt-[80px] md:pt-[90px]">
        <section className="py-12 md:py-16">
          <div className="container-custom">
            
            <div className="max-w-[1200px] mx-auto w-full flex flex-col">
              <HostProfileHeader 
                name={name}
                logo={initials}
                bio="Premium airsoft gear retailer based in Manchester, UK"
                isVerified={true}
                drawsHosted={98}
                rating={4.9}
                memberSince={2024}
              />
              
              <HostProfileTabs />
            </div>

          </div>
        </section>
      </main>

      <WebsiteFooter />
    </>
  );
}
