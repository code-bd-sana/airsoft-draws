"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "../../../lib/constants";
import PrimaryButton from "../shared/PrimaryButton";
import { cn } from "../../../lib/utils";
import logo from '../../../public/logo3.png';
import { useAuthUser, useLogout } from "../../../hooks/useAuthHooks";

/**
 * Global website navigation navbar with sticky backdrop blur and responsive mobile slide-out sidebar y.
 */
export default function WebsiteNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { data: user } = useAuthUser();
  const logout = useLogout();

  // Monitor scrolling to add backdrop background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 w-full z-45 transition-all duration-300 border-b",
          scrolled
            ? "bg-bg/90 backdrop-blur-md border-divider/80 py-3"
            : "bg-transparent border-transparent py-5"
        )}
      >
        <div className="container-custom flex items-center justify-between">
          {/* Branding Logo */}
          <Link href="/" className="flex items-center select-none group py-0.5">
            <Image
              alt="Airsoft Draws Logo"
              src={logo}
              height={150}
              width={150}
              priority
              className="object-contain transition-transform duration-200 group-hover:scale-105 drop-shadow-md brightness-110 contrast-125"
            />
          </Link>
          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "font-sans text-xs font-semibold uppercase tracking-wider transition-colors duration-200",
                    isActive ? "text-text-brand" : "text-text-muted hover:text-text-brand"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <>
                <PrimaryButton href="/dashboard" className="px-5 py-2 text-xs">
                  Dashboard
                </PrimaryButton>
                <button
                  onClick={logout}
                  className="font-sans text-xs font-semibold text-text-primary hover:text-error uppercase tracking-wider transition-colors duration-200 px-3 py-2 cursor-pointer"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="font-sans text-xs font-semibold text-text-primary hover:text-text-brand uppercase tracking-wider transition-colors duration-200 px-3 py-2"
                >
                  Log In
                </Link>
                <PrimaryButton href="/host/register" className="px-5 py-2 text-xs">
                  Start Hosting
                </PrimaryButton>
              </>
            )}
          </div>

          {/* Hamburger Mobile Menu Toggle */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden flex items-center justify-center p-2 text-text-primary hover:text-text-brand transition-colors duration-200 cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-45 lg:hidden transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar Slide-out Drawer Panel */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-[280px] max-w-[80vw] bg-surface z-50 lg:hidden shadow-card transition-transform duration-300 ease-in-out border-l border-divider flex flex-col justify-between p-6",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div>
          {/* Header Inside Sidebar */}
          <div className="flex items-center justify-between pb-5 border-b border-divider mb-6">
            <span className="font-heading font-bold text-xs text-text-muted uppercase tracking-wider">
              Navigation Menu
            </span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-1.5 text-text-muted hover:text-text-primary hover:bg-bg rounded-button transition-all duration-200 cursor-pointer"
              aria-label="Close Menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Links list */}
          <nav className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "font-heading font-bold text-sm uppercase tracking-wider transition-colors duration-200 py-1.5 border-b border-divider/20",
                    isActive ? "text-text-brand" : "text-text-primary hover:text-text-brand"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Login and Host Buttons */}
        <div className="flex flex-col gap-3.5 pt-6 border-t border-divider mt-auto">
          {user ? (
            <>
              <PrimaryButton
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 text-xs"
              >
                Dashboard
              </PrimaryButton>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="flex items-center justify-center font-sans font-semibold text-xs text-error hover:text-error/80 uppercase tracking-wider py-3 border border-error/50 rounded-button transition-colors duration-200 cursor-pointer"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center font-sans font-semibold text-xs text-text-primary hover:text-text-brand uppercase tracking-wider py-3 border border-border rounded-button transition-colors duration-200"
              >
                Log In
              </Link>
              <PrimaryButton
                href="/host/register"
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 text-xs"
              >
                Start Hosting
              </PrimaryButton>
            </>
          )}
        </div>
      </div>
    </>
  );
}
