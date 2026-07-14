"use client";

import React, { useEffect, useState } from 'react';
import SectionHeader from '../shared/SectionHeader';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import { raffleService, RecentWinner } from '@/services/raffle.service';

/**
 * Recent Winners / Community Wins grid section.
 */
export default function WinnersSection() {
  const [winners, setWinners] = useState<RecentWinner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWinners() {
      try {
        const data = await raffleService.getRecentWinners();
        setWinners(data);
      } catch (error) {
        console.error('Failed to load winners', error);
      } finally {
        setLoading(false);
      }
    }
    loadWinners();
  }, []);

  // Render check badge icon
  const CheckBadgeIcon = () => (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth={2}
      stroke='currentColor'
      className='w-3.5 h-3.5 mr-1.5 text-text-brand'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.75 3.75 0 0 1 21 12Z'
      />
    </svg>
  );

  if (loading) {
    return (
      <section id='recent-winners' className='py-20 bg-bg border-t border-divider'>
        <div className='container-custom'>
          <SectionHeader
            badgeText='COMMUNITY WINS'
            headingText='Recent Winners'
            paragraphText='Real people, real premium prizes. See our most recent lucky winners and their verified prize deliveries.'
          />
          <div className='text-center text-text-muted'>Loading winners...</div>
        </div>
      </section>
    );
  }

  if (winners.length === 0) {
    return null; // hide section if no winners yet
  }

  return (
    <section id='recent-winners' className='py-20 bg-bg border-t border-divider'>
      <div className='container-custom'>
        {/* Section Header */}
        <SectionHeader
          badgeText='COMMUNITY WINS'
          headingText='Recent Winners'
          paragraphText='Real people, real premium prizes. See our most recent lucky winners and their verified prize deliveries.'
        />

        {/* Winners Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
          {winners.map((winner) => (
            <div
              key={winner.id}
              className='bg-surface border border-border rounded-card p-6 flex flex-col justify-between shadow-card transition-all duration-300 hover:border-border-medium hover:shadow-glow'
            >
              {/* Top part: Initials/Image avatar & name */}
              <div>
                <div className='flex items-center justify-between mb-4'>
                  {winner.avatarUrl ? (
                    <div className='w-12 h-12 rounded overflow-hidden border border-divider'>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={winner.avatarUrl}
                        alt={winner.name}
                        className='w-full h-full object-cover'
                      />
                    </div>
                  ) : (
                    <div className='flex items-center justify-center w-12 h-12 rounded bg-accent-bg border border-divider text-text-brand font-heading font-bold text-sm'>
                      {winner.initials}
                    </div>
                  )}

                  {/* Delivery Status Tag */}
                  <span className='inline-flex items-center bg-success-bg border border-success/40 px-2 py-0.5 rounded-badge text-[9px] font-semibold text-success-text tracking-wide uppercase'>
                    <CheckBadgeIcon />
                    {winner.statusText}
                  </span>
                </div>

                <h3 className='font-heading font-bold text-base text-text-primary mb-1'>
                  {winner.name}
                </h3>

                <p className='font-sans text-[11px] text-text-muted mb-4'>{winner.location}</p>

                {/* Divider */}
                <div className='border-t border-divider my-4' />

                {/* Prize Info */}
                <div className='flex flex-col mb-4'>
                  <span className='text-[9px] text-text-muted uppercase tracking-wider font-semibold mb-1'>
                    PRIZE WON
                  </span>
                  <span className='font-heading font-bold text-sm text-text-brand line-clamp-2'>
                    {winner.prizeWon}
                  </span>
                </div>
              </div>

              {/* Bottom part: Timestamp */}
              <div className='font-sans text-[10px] text-text-muted italic pt-2 mt-auto'>
                {formatDistanceToNow(new Date(winner.whenWon), { addSuffix: true })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
