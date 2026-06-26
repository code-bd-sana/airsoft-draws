"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

/**
 * Renders the video placeholder section.
 * Clicking the card opens a responsive overlay modal playing a detailed guide video.
 */
export default function HowItWorksVideoSection() {
  const [modalOpen, setModalOpen] = useState(false);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [modalOpen]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section className="py-16 md:py-24 bg-surface border-t border-b border-divider">
      <div className="container-custom flex flex-col items-center">
        
        {/* Playable Video Card Trigger */}
        <div
          onClick={() => setModalOpen(true)}
          className="relative w-full max-w-[1010px] aspect-[1010/526] rounded-card border border-border overflow-hidden cursor-pointer shadow-card group hover:border-primary transition-all duration-500 ease-out"
        >
          {/* Card background 3D illustration image */}
          <Image
            src="http://localhost:3845/assets/526657551df58b8e03d621873eaa6a0575eb6137.png"
            alt="Watch How Airsoft Draws Works"
            fill
            sizes="(max-width: 768px) 100vw, 1010px"
            className="object-cover opacity-80 group-hover:scale-[1.02] group-hover:opacity-95 transition-all duration-700 ease-out"
            unoptimized
          />

          {/* Green play button circle overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:bg-primary-hover group-hover:shadow-[0_0_30px_rgba(140,179,74,0.4)] transition-all duration-300 ease-out">
              {/* Play SVG Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-6 h-6 text-primary-text translate-x-0.5"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Video Card Title Subtext */}
        <p className="font-heading font-medium text-sm md:text-base text-text-primary mt-6 tracking-wide select-none">
          Watch: How a Draw Works in 90 Seconds
        </p>

        {/* Client-side Modal Overlay Video Player */}
        {modalOpen && (
          <div
            onClick={() => setModalOpen(false)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 md:p-8 animate-fade-in"
          >
            {/* Modal Content Box */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl aspect-video bg-bg border border-border rounded-card overflow-hidden shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-text-muted hover:text-text-primary hover:bg-black/80 transition-colors duration-200 cursor-pointer"
                aria-label="Close Video Player"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* YouTube embed or placeholder video player */}
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="How It Works Guide Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
