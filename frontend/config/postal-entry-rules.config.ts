export interface PostalEntryRulesConfig {
  title: string;
  subtitle: string;
  promoterName: string;
  promoterAddress: {
    line1: string;
    line2: string;
    city: string;
    postcode: string;
    country: string;
  };
  rulesList: string[];
  postcardDetails: string[];
  noticeText: string;
}

export const POSTAL_ENTRY_RULES: PostalEntryRulesConfig = {
  title: "Free Postal Entry Instructions",
  subtitle: "Under UK law (Gambling Act 2005 / ASA regulations), every prize competition provides an equal free entry route by post.",
  promoterName: "Airsoft Draws Ltd",
  promoterAddress: {
    line1: "Synergy House",
    line2: "Lawson Street",
    city: "North Shields",
    postcode: "NE29 6TG",
    country: "United Kingdom",
  },
  postcardDetails: [
    "Full Legal Name",
    "Date of Birth (Must be 18+)",
    "Contact Address & Postcode",
    "Email Address (matching your Airsoft Draws account)",
    "Telephone / Mobile Number",
    "Target Competition Title & Draw Code",
  ],
  rulesList: [
    "Send your entry on an unenclosed postcard via First or Second Class post to the promoter's address below.",
    "Each postcard counts as one (1) free entry into the specified competition draw.",
    "Hand-delivered entries or entries sent in envelopes will not be accepted.",
    "Your postal entry must be received before the competition closing date & time.",
    "Postal entries are treated with the exact same chance of winning as paid online ticket entries.",
    "You must have an active Airsoft Draws user account registered with the matching email address.",
  ],
  noticeText:
    "Placeholder Content: Final official UK Gambling Commission & ASA legal terms for postal entries will be updated here.",
};
