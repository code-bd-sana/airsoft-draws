import { NavLink, SocialLink } from "../types/common.types";

export const BRAND_NAME = "Airsoft Draws";

export const NAV_LINKS: NavLink[] = [
  { label: "Live Raffles", href: "/live-raffles" },
  { label: "Winners", href: "/winners" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

export const SOCIAL_LINKS: SocialLink[] = [
  { platform: "Facebook", href: "https://facebook.com", iconName: "facebook" },
  { platform: "Twitter", href: "https://twitter.com", iconName: "twitter" },
  { platform: "Instagram", href: "https://instagram.com", iconName: "instagram" },
  { platform: "Discord", href: "https://discord.com", iconName: "discord" },
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
      { label: "Host Guidelines", href: "/#host-info" },
      { label: "Escrow Protection", href: "/#host-info" },
      { label: "Payout Calculator", href: "/#host-info" },
    ],
  },
  {
    title: "Support & Legal",
    links: [
      { label: "Help & FAQ", href: "/pricing#faq" },
      { label: "Contact Support", href: "/contact" },
      { label: "Terms of Service", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Responsible Play", href: "#" },
    ],
  },
];
