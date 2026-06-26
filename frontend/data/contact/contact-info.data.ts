import { ContactInfoCardItem } from "../../types/contact.types";

export const CONTACT_INFO_ITEMS: ContactInfoCardItem[] = [
  {
    id: "email",
    title: "Email Support",
    description: "Get in touch via email.",
    value: "support@airsoftdraws.com",
    href: "mailto:support@airsoftdraws.com",
    type: "email",
  },
  {
    id: "chat",
    title: "Live Chat",
    description: "Chat with our support crew.",
    value: "Available 9am–6pm GMT",
    type: "chat",
  },
  {
    id: "time",
    title: "Response Time",
    description: "Average turnaround time.",
    value: "Within 24 hours",
    type: "time",
  },
];
