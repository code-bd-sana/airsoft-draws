import { NavLink, SocialLink } from "../types/common.types";

export const BRAND_NAME = "Airsoft Draws";

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Competitions", href: "/live-raffles" },
  { label: "Winners", href: "/winners" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "Verified Hosts", href: "/verified-hosts" },
  { label: "Contact", href: "/contact" },
];

export const SOCIAL_LINKS: SocialLink[] = [
  { platform: "Facebook", href: "https://www.facebook.com/share/18zThK3JPJ/?mibextid=wwXIfr", iconName: "facebook" },
  { platform: "Instagram", href: "https://instagram.com/airsoftdraws", iconName: "instagram" },
];

export const FOOTER_SECTIONS = [
  {
    title: "Competitions",
    links: [
      { label: "All Live Draws", href: "/live-raffles" },
      { label: "Rifles & AEGs", href: "/live-raffles?category=rifles" },
      { label: "Pistols & GBBs", href: "/live-raffles?category=pistols" },
      { label: "Tactical Gear & Optics", href: "/live-raffles?category=accessories" },
      { label: "Cash Prize Competitions", href: "/live-raffles?category=cash" },
    ],
  },
  {
    title: "For Hosts",
    links: [
      { label: "Start Hosting", href: "/#host-info" },
      { label: "Pricing & Fees", href: "/pricing" },
    ],
  },
  {
    title: "Support & Legal",
    links: [
      { label: "FAQ", href: "/#faq" },
      { label: "Contact Support", href: "/contact" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Free Entry Method", href: "/terms#free-entry" },
    ],
  },
];
