"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "../../../lib/utils";

interface RaffleImageGalleryProps {
  images: string[];
  title: string;
  instantWinCount?: number;
}

/**
 * Image gallery component with active main photo frame and thumbnail selector row.
 * Includes the Figma overlay badge for Instant Win counts.
 */
export default function RaffleImageGallery({
  images,
  title,
  instantWinCount = 0,
}: RaffleImageGalleryProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Present/Gift icon for the instant win badge
  const giftIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="w-3.5 h-3.5 text-[#8cb34a]"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.75 7.5h.375c.69 0 1.25-.56 1.25-1.25v-.375Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.875A2.625 2.625 0 1 1 14.25 7.5h-.375a1.25 1.25 0 0 1-1.25-1.25v-.375Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.75 7.5h4.5m-4.5 0A2.625 2.625 0 0 0 7.5 9.75v.375c0 .69.56 1.25 1.25 1.25h.375m0-3V21m4.5-13.5v13.5m0-13.5h.375c.69 0 1.25.56 1.25 1.25v.375a1.25 1.25 0 0 1-1.25 1.25h-.375"
      />
    </svg>
  );

  return (
    <div className="flex flex-col gap-4 w-full select-none">
      {/* Main Image Frame */}
      <div className="relative w-full h-[320px] sm:h-[400px] md:h-[460px] bg-surface border border-border rounded-card overflow-hidden">
        {images.length > 0 ? (
          <Image
            src={images[activeImageIndex]}
            alt={`${title} - Gallery Photo`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 980px"
            className="object-cover opacity-85 transition-all duration-300"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-muted text-xs">
            No Images Available
          </div>
        )}

        {/* Floating Instant Win Badge (Bottom Left) */}
        {instantWinCount > 0 && (
          <div className="absolute left-4 bottom-4 bg-[#0a0b07]/90 backdrop-blur-sm border border-border-medium flex items-center gap-1.5 px-3 py-1.5 rounded-[20px] select-none shadow-md pointer-events-none">
            {giftIcon}
            <span className="text-[11px] font-semibold text-[#8cb34a] tracking-wide uppercase">
              {instantWinCount} Instant Win Prizes
            </span>
          </div>
        )}
      </div>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImageIndex(idx)}
              className={cn(
                "relative w-20 h-16 sm:w-24 sm:h-20 bg-surface rounded-button overflow-hidden border transition-all duration-200 cursor-pointer",
                activeImageIndex === idx
                  ? "border-primary shadow-glow opacity-100"
                  : "border-border opacity-60 hover:opacity-100"
              )}
            >
              <Image
                src={img}
                alt={`${title} Thumbnail ${idx + 1}`}
                fill
                sizes="96px"
                className="object-cover"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
