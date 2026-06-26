import React from "react";
import SectionHeader from "../shared/SectionHeader";
import TestimonialCard from "../shared/TestimonialCard";
import { testimonialsData } from "../../../data/homepage/testimonials.data";

/**
 * Customer Reviews and Testimonials grid section.
 */
export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-surface border-t border-divider">
      <div className="container-custom">
        {/* Section Header */}
        <SectionHeader
          badgeText="TESTIMONIALS"
          headingText="What Our Community Says"
          paragraphText="Thousands of happy competitors and verified hosts trust our escrow platform for fair draws."
        />

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {testimonialsData.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}
