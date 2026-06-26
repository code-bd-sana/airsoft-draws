/**
 * Interface representing a single step in the 'How It Works' journey.
 * Built to easily bind CMS or API data in the future.
 */
export interface HowItWorksStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
}
