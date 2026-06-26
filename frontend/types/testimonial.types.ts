/**
 * Interface representing customer testimonials.
 */
export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  avatar?: string;
  rating: number; // 1 to 5 stars
  quote: string;
  location?: string;
}
