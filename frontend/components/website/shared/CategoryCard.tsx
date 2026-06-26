import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Category } from "../../../types/category.types";

interface CategoryCardProps {
  category: Category;
}

/**
 * Reusable Card component for browsing by category.
 */
export default function CategoryCard({ category }: CategoryCardProps) {
  const { title, slug, image, drawCount } = category;

  return (
    <Link
      href={`#live-draws?category=${slug}`}
      className="group relative flex flex-col justify-end h-[160px] md:h-[200px] bg-surface border border-border rounded-card overflow-hidden shadow-card transition-all duration-300 hover:border-primary hover:shadow-glow"
    >
      {/* Background Image */}
      {image && (
        <div className="absolute inset-0 bg-bg transition-transform duration-300 group-hover:scale-105">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 50vw, 240px"
            className="object-cover opacity-45 group-hover:opacity-60 transition-opacity duration-300"
            unoptimized
          />
        </div>
      )}

      {/* Dark overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-transparent" />

      {/* Info Container */}
      <div className="relative p-5 z-10">
        <h3 className="font-heading font-bold text-lg text-text-primary mb-1 group-hover:text-text-brand transition-colors duration-200">
          {title}
        </h3>
        <p className="font-sans text-xs text-text-muted">
          {drawCount} Active Competitions
        </p>
      </div>
    </Link>
  );
}
