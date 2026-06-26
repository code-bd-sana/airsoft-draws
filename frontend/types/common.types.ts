/**
 * Defines standard button component visual variations.
 */
export type ButtonVariant = "primary" | "secondary" | "ghost";

/**
 * Standard interface for navigation links.
 */
export interface NavLink {
  label: string;
  href: string;
  isExternal?: boolean;
}

/**
 * Standard interface for social media platforms and icons.
 */
export interface SocialLink {
  platform: string;
  href: string;
  iconName: string;
}
