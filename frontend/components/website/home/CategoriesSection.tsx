import React from "react";
import SectionHeader from "../shared/SectionHeader";
import CategoryCard from "../shared/CategoryCard";
import { categoriesData } from "../../../data/homepage/categories.data";

/**
 * Categories listing section displaying category cards in a grid layout.
 */
export default function CategoriesSection() {
  return (
    <section className="py-20 bg-bg border-t border-divider">
      <div className="container-custom">
        {/* Section Header */}
        <SectionHeader
          badgeText="CATEGORIES"
          headingText="Browse by Category"
          paragraphText="Find exactly what you are looking for by exploring our curated airsoft competition sections."
        />

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {categoriesData.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
