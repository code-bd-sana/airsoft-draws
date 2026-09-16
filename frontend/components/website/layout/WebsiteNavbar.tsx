'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthUser } from '../../../hooks/useAuthHooks';
import { useBasket } from '../../../features/basket/BasketContext';
import { NAV_LINKS } from '../../../lib/constants';
import { cn } from '../../../lib/utils';
import logo from '../../../public/logo3.png';
import PrimaryButton from '../shared/PrimaryButton';

/**
 * Global website navigation navbar with sticky backdrop blur and responsive mobile slide-out sidebar y.
 */
export default function WebsiteNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { data: user } = useAuthUser();
  const { ticketCount } = useBasket();

  // Monitor scrolling to add backdrop background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 w-full z-45 transition-all duration-300 border-b',
          scrolled
            ? 'bg-bg/90 backdrop-blur-md border-divider/80 py-3'
            : 'bg-transparent border-transparent py-5',
        )}
      >
        <div className='w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 flex items-center justify-between gap-3 lg:gap-4'>
          {/* Branding Logo */}
          <Link href='/' className='flex items-center gap-2 select-none group py-0.5 shrink-0'>
            <Image
              alt='Airsoft Draws Logo'
              src={logo}
              height={120}
              width={120}
              priority
              className='w-16 sm:w-20 md:w-20 xl:w-22 2xl:w-24 h-auto object-contain transition-transform duration-200 group-hover:scale-105 drop-shadow-md brightness-110 contrast-125'
            />
            <span className='font-sans font-bold text-sm sm:text-base xl:text-base 2xl:text-lg tracking-[0.12em] 2xl:tracking-[0.18em] uppercase text-[#a8b488] whitespace-nowrap'>
              Airsoft Draws
            </span>
          </Link>
          {/* Desktop Navigation Links */}
          <nav className='hidden xl:flex items-center justify-center gap-2 xl:gap-3 2xl:gap-5 min-[1680px]:gap-7 shrink min-w-0'>
            {NAV_LINKS.map((link) => {
              const isActive =
                pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'font-sans text-[11px] xl:text-[11px] 2xl:text-xs font-semibold uppercase tracking-wider transition-colors duration-200 whitespace-nowrap px-1 py-1 2xl:px-1.5',
                    isActive ? 'text-text-brand' : 'text-text-muted hover:text-text-brand',
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Auth & Basket Buttons (Desktop) */}
          <div className='hidden xl:flex items-center gap-2 xl:gap-2.5 2xl:gap-4 shrink-0'>
            <Link
              href='/basket'
              className='relative flex items-center justify-center p-2 text-text-primary hover:text-text-brand transition-colors duration-200 cursor-pointer shrink-0'
              aria-label='Shopping Basket'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={2}
                stroke='currentColor'
                className='w-5 h-5'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z'
                />
              </svg>
              {ticketCount > 0 && (
                <span className='absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-[20px] px-1 text-[11px] font-bold text-[#0D0D0B] bg-[#8CB34A] rounded-full border border-[#0D0D0B] shadow-sm'>
                  {ticketCount}
                </span>
              )}
            </Link>

            {user ? (
              <PrimaryButton
                href='/dashboard'
                className='px-3.5 py-1.5 2xl:px-5 2xl:py-2 text-[11px] 2xl:text-xs whitespace-nowrap'
              >
                Dashboard
              </PrimaryButton>
            ) : (
              <>
                <Link
                  href='/login'
                  className='font-sans text-[11px] 2xl:text-xs font-semibold text-text-primary hover:text-text-brand uppercase tracking-wider transition-colors duration-200 px-2.5 py-2 whitespace-nowrap'
                >
                  Log In
                </Link>
                <PrimaryButton
                  href='/host/register'
                  className='px-3.5 py-1.5 2xl:px-5 2xl:py-2 text-[11px] 2xl:text-xs whitespace-nowrap'
                >
                  Start Hosting
                </PrimaryButton>
              </>
            )}
          </div>

          {/* Mobile Right Actions (Basket + Hamburger Toggle) */}
          <div className='xl:hidden flex items-center gap-2'>
            <Link
              href='/basket'
              className='relative flex items-center justify-center p-2 text-text-primary hover:text-text-brand transition-colors duration-200 cursor-pointer'
              aria-label='Shopping Basket'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={2}
                stroke='currentColor'
                className='w-5 h-5'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z'
                />
              </svg>
              {ticketCount > 0 && (
                <span className='absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-[20px] px-1 text-[11px] font-bold text-[#0D0D0B] bg-[#8CB34A] rounded-full border border-[#0D0D0B] shadow-sm'>
                  {ticketCount}
                </span>
              )}
            </Link>

            <button
              onClick={toggleMobileMenu}
              className='flex items-center justify-center p-2 text-text-primary hover:text-text-brand transition-colors duration-200 cursor-pointer'
              aria-label='Toggle Navigation Menu'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={2}
                stroke='currentColor'
                className='w-6 h-6'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && (
        <div
          className='fixed inset-0 bg-black/60 backdrop-blur-sm z-45 xl:hidden transition-opacity duration-300'
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar Slide-out Drawer Panel */}
      <div
        className={cn(
          'fixed top-0 right-0 h-full w-[280px] max-w-[80vw] bg-surface z-50 xl:hidden shadow-card transition-transform duration-300 ease-in-out border-l border-divider flex flex-col justify-between p-6 overflow-y-auto',
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div>
          {/* Header Inside Sidebar */}
          <div className='flex items-center justify-between pb-5 border-b border-divider mb-6'>
            <span className='font-heading font-bold text-xs text-text-muted uppercase tracking-wider'>
              Navigation Menu
            </span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className='p-1.5 text-text-muted hover:text-text-primary hover:bg-bg rounded-button transition-all duration-200 cursor-pointer'
              aria-label='Close Menu'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={2.5}
                stroke='currentColor'
                className='w-5 h-5'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M6 18 18 6M6 6l12 12' />
              </svg>
            </button>
          </div>

          {/* Links list */}
          <nav className='flex flex-col gap-4'>
            {NAV_LINKS.map((link) => {
              const isActive =
                pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'font-heading font-bold text-sm uppercase tracking-wider transition-colors duration-200 py-1.5 border-b border-divider/20',
                    isActive ? 'text-text-brand' : 'text-text-primary hover:text-text-brand',
                  )}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Mobile Basket Link */}
            <Link
              href='/basket'
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                'font-heading font-bold text-sm uppercase tracking-wider transition-colors duration-200 py-1.5 border-b border-divider/20 flex items-center justify-between',
                pathname === '/basket' ? 'text-text-brand' : 'text-text-primary hover:text-text-brand',
              )}
            >
              <span>Shopping Basket</span>
              {ticketCount > 0 && (
                <span className='px-2 py-0.5 text-xs font-semibold bg-[#8CB34A] text-[#0D0D0B] rounded-full'>
                  {ticketCount} {ticketCount === 1 ? 'ticket' : 'tickets'}
                </span>
              )}
            </Link>
          </nav>
        </div>

        {/* Bottom Login and Host Buttons */}
        <div className='flex flex-col gap-3.5 pt-6 border-t border-divider mt-auto'>
          {user ? (
            <PrimaryButton
              href='/dashboard'
              onClick={() => setMobileMenuOpen(false)}
              className='py-3 text-xs'
            >
              Dashboard
            </PrimaryButton>
          ) : (
            <>
              <Link
                href='/login'
                onClick={() => setMobileMenuOpen(false)}
                className='flex items-center justify-center font-sans font-semibold text-xs text-text-primary hover:text-text-brand uppercase tracking-wider py-3 border border-border rounded-button transition-colors duration-200'
              >
                Log In
              </Link>
              <PrimaryButton
                href='/host/register'
                onClick={() => setMobileMenuOpen(false)}
                className='py-3 text-xs'
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
