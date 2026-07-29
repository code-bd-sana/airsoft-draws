'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../../features/auth/AuthContext';
import { cn } from '../../../lib/utils';

export default function MobileBottomDock() {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();

  const isDashboardRoute = pathname.startsWith('/dashboard');

  // Determine user role dashboard path
  const getDashboardHome = () => {
    if (!user) return '/dashboard/user';
    if (user.role === 'ADMIN') return '/dashboard/admin';
    if (user.role === 'HOST') return '/dashboard/host';
    return '/dashboard/user';
  };

  const dashboardHome = getDashboardHome();

  return (
    <div className='fixed bottom-0 left-0 right-0 z-40 block lg:hidden bg-[#0D0D0B]/95 backdrop-blur-xl border-t border-[#2D3C13] shadow-[0_-10px_25px_rgba(0,0,0,0.5)]'>
      <div className='flex items-center justify-around h-16 px-2 max-w-md mx-auto'>
        {/* Tab 1: Home */}
        <Link
          href='/'
          className={cn(
            'flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-all duration-200',
            pathname === '/'
              ? 'text-[#8CB34A] font-semibold scale-105'
              : 'text-[#72943A] hover:text-[#E8EDD4]',
          )}
        >
          <svg
            className='w-5 h-5 mb-0.5'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth={2}
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v4.875h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25'
            />
          </svg>
          <span className='text-[10px] font-sans tracking-tight'>Home</span>
        </Link>

        {/* Tab 2: Competitions */}
        <Link
          href='/login'
          className={cn(
            'flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-all duration-200',
            pathname === '/live-raffles' || pathname.startsWith('/live-raffles')
              ? 'text-[#8CB34A] font-semibold scale-105'
              : 'text-[#72943A] hover:text-[#E8EDD4]',
          )}
        >
          <svg
            className='w-5 h-5 mb-0.5'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth={2}
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-12h12c.621 0 1.125.504 1.125 1.125v1.757a1.5 1.5 0 0 0 0 2.236v1.757a1.5 1.5 0 0 0 0 2.236v1.757a1.5 1.5 0 0 0-1.125 1.125H7.5a1.125 1.125 0 0 1-1.125-1.125v-1.757a1.5 1.5 0 0 0 0-2.236V11.23a1.5 1.5 0 0 0 0-2.236V7.125A1.125 1.125 0 0 1 7.5 6Z'
            />
          </svg>
          <span className='text-[10px] font-sans tracking-tight'>Login</span>
        </Link>

        {/* Tab 3: Center Context Switcher Button (Public Website <-> Dashboard) */}
        <Link
          href={isDashboardRoute ? '/live-raffles' : isAuthenticated ? dashboardHome : '/login'}
          className='flex flex-col items-center justify-center relative -top-3 shrink-0 group'
        >
          <div
            className={cn(
              'w-12 h-12 rounded-full flex items-center justify-center shadow-[0_0_18px_rgba(140,179,74,0.35)] transition-all duration-300 transform group-active:scale-95 border',
              isDashboardRoute
                ? 'bg-[#1A230A] border-[#8CB34A] text-[#A0D056]'
                : 'bg-[#8CB34A] border-[#A0D056] text-[#0D0D0B]',
            )}
          >
            {isDashboardRoute ? (
              <svg
                className='w-6 h-6 animate-pulse'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m-17.432-6A8.959 8.959 0 0 0 3 12c0 .778.099 1.533.284 2.253'
                />
              </svg>
            ) : (
              <svg
                className='w-6 h-6'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3 1 3m0 0l.5 1.5m-1-1.5h-9.5m0 0l-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605'
                />
              </svg>
            )}
          </div>
          <span className='text-[9px] font-sans font-bold uppercase tracking-wider text-[#A0D056] mt-0.5'>
            {isDashboardRoute ? 'Public Site' : 'Dashboard'}
          </span>
        </Link>

        {/* Tab 4: Winners */}
        <Link
          href='/winners'
          className={cn(
            'flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-all duration-200',
            pathname === '/winners'
              ? 'text-[#8CB34A] font-semibold scale-105'
              : 'text-[#72943A] hover:text-[#E8EDD4]',
          )}
        >
          <svg
            className='w-5 h-5 mb-0.5'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth={2}
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M16.5 18.75h-9m9 0a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3h-9a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3m9 0v-3.375c0-.621-.504-1.125-1.125-1.125h-6.75c-.621 0-1.125.504-1.125 1.125V18.75m9 0h-9'
            />
          </svg>
          <span className='text-[10px] font-sans tracking-tight'>Winners</span>
        </Link>

        {/* Tab 5: My Tickets */}
        <Link
          href={isAuthenticated ? '/dashboard/user/tickets' : '/login'}
          className={cn(
            'flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-all duration-200',
            pathname === '/dashboard/user/tickets'
              ? 'text-[#8CB34A] font-semibold scale-105'
              : 'text-[#72943A] hover:text-[#E8EDD4]',
          )}
        >
          <svg
            className='w-5 h-5 mb-0.5'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth={2}
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'
            />
          </svg>
          <span className='text-[10px] font-sans tracking-tight'>
            {isAuthenticated ? 'My Tickets' : 'Log In'}
          </span>
        </Link>
      </div>
    </div>
  );
}
