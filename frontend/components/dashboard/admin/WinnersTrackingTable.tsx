'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useState } from 'react';
import { Winner, winnerService } from '../../../services/winner.service';
import VerifyWinnerModal from './VerifyWinnerModal';

export default function WinnersTrackingTable() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWinner, setSelectedWinner] = useState<Winner | null>(null);

  const queryClient = useQueryClient();

  const filters = ['All', 'Pending Verification', 'Verified & Published', 'Prize Delivered'];

  const getVerificationQuery = (filter: string) => {
    switch (filter) {
      case 'Pending Verification':
        return 'PENDING';
      case 'Verified & Published':
        return 'VERIFIED';
      default:
        return 'All';
    }
  };

  const getDeliveryQuery = (filter: string) => {
    if (filter === 'Prize Delivered') return 'DELIVERED';
    return 'All';
  };

  const { data: winnersResponse, isLoading } = useQuery({
    queryKey: ['adminWinners', activeFilter],
    queryFn: () =>
      winnerService.getAdminWinners({
        verificationStatus: getVerificationQuery(activeFilter),
        status: getDeliveryQuery(activeFilter),
      }),
  });

  const winners = winnersResponse?.data || [];

  const handleVerify = (winner: Winner) => {
    setSelectedWinner(winner);
    setIsModalOpen(true);
  };

  // Ensure this handles the verification correctly locally if we are mocking the modal API call inside it,
  // or we can refresh the table on modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    queryClient.invalidateQueries({ queryKey: ['adminWinners'] });
  };

  const getStatusStyle = (winner: Winner) => {
    if (winner.deliveryStatus === 'DELIVERED')
      return 'border-[#4ADE80]/30 bg-[#083b18] text-[#4ADE80]';
    if (winner.verificationStatus === 'VERIFIED')
      return 'border-[#4ADE80]/30 bg-[#083b18] text-[#4ADE80]';
    if (winner.verificationStatus === 'PENDING')
      return 'border-[#D97706]/30 bg-[#78350F] text-[#F59E0B]';
    return 'border-[#2D3C13] bg-[#111210] text-[#72943A]';
  };

  const getDisplayStatus = (winner: Winner) => {
    if (winner.deliveryStatus === 'DELIVERED') return 'Prize Delivered';
    if (winner.verificationStatus === 'VERIFIED') return 'Verified';
    if (winner.verificationStatus === 'PENDING') return 'Pending Verification';
    return 'Unknown';
  };

  return (
    <div className='flex flex-col gap-6 w-full mt-4'>
      {/* Top Filter Pills */}
      <div className='flex items-center gap-2'>
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-[8px] font-sans font-medium text-[12px] transition-colors ${
              activeFilter === filter
                ? 'bg-transparent border border-[#8CB34A] text-[#E8EDD4]'
                : 'bg-transparent border border-[#2D3C13] text-[#72943A] hover:bg-[#1A230A] hover:text-[#A0D056]'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Table Container */}
      <div className='w-full bg-[#161810] border border-[#2D3C13] rounded-[16px] overflow-hidden overflow-x-auto mt-2'>
        <table className='w-full min-w-[1050px] text-left border-collapse'>
          <thead>
            <tr className='border-b border-[#2D3C13] bg-[#111210]'>
              <th className='py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[18%]'>
                WINNER
              </th>
              <th className='py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[18%]'>
                COMPETITION WON
              </th>
              <th className='py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[12%] text-center'>
                WIN TYPE
              </th>
              <th className='py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[12%] text-center'>
                DRAW DATE
              </th>
              <th className='py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[12%] text-center'>
                PRIZE VALUE
              </th>
              <th className='py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[15%] text-center'>
                STATUS
              </th>
              <th className='py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[13%] text-right'>
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className='py-8 text-center text-[#72943A] font-sans text-sm'>
                  Loading winners...
                </td>
              </tr>
            ) : winners.length === 0 ? (
              <tr>
                <td colSpan={7} className='py-8 text-center text-[#72943A] font-sans text-sm'>
                  No winners found.
                </td>
              </tr>
            ) : (
              winners.map((winner, i) => {
                const name =
                  `${winner.user?.firstName || ''} ${winner.user?.lastName || ''}`.trim() ||
                  'Unknown';
                const initials = name.substring(0, 2).toUpperCase();

                return (
                  <tr
                    key={winner.id}
                    className={`${i !== winners.length - 1 ? 'border-b border-[#2D3C13]' : ''} hover:bg-[#1A230A] transition-colors`}
                  >
                    <td className='py-4 px-6'>
                      <div className='flex items-center gap-3'>
                        <div className='w-7 h-7 rounded-full bg-[#1A230A] border border-[#43581E] flex items-center justify-center shrink-0 overflow-hidden'>
                          {winner.user?.avatarUrl ? (
                            <img
                              src={winner.user.avatarUrl}
                              alt='Winner'
                              className='w-full h-full object-cover'
                            />
                          ) : (
                            <span className='font-sans font-medium text-[10px] text-[#8CB34A]'>
                              {initials}
                            </span>
                          )}
                        </div>
                        <span className='font-sans font-medium text-[13px] text-[#E8EDD4]'>
                          {name}
                        </span>
                      </div>
                    </td>
                    <td className='py-4 px-6'>
                      <span className='font-sans text-[13px] text-[#72943A]'>
                        {winner.raffle?.title || 'Unknown Raffle'}
                      </span>
                    </td>
                    <td className='py-4 px-6 text-center'>
                      {winner.winType === 'INSTANT_WIN' ? (
                        <span className='font-sans font-medium text-[12px] text-[#A0D056]'>
                          Instant Win
                        </span>
                      ) : (
                        <span className='font-sans font-medium text-[12px] text-[#F59E0B]'>
                          Main Draw
                        </span>
                      )}
                    </td>
                    <td className='py-4 px-6 text-center'>
                      <span className='font-sans text-[13px] text-[#72943A]'>
                        {format(new Date(winner.createdAt), 'dd MMM yyyy')}
                      </span>
                    </td>
                    <td className='py-4 px-6 text-center'>
                      <span className='font-sans font-medium text-[13px] text-[#E8EDD4]'>
                        {winner.prizeName}
                      </span>
                    </td>
                    <td className='py-4 px-6 text-center'>
                      <span
                        className={`px-3 py-1 rounded-full border font-sans font-medium text-[10px] whitespace-nowrap ${getStatusStyle(winner)}`}
                      >
                        {getDisplayStatus(winner)}
                      </span>
                    </td>
                    <td className='py-4 px-6'>
                      <div className='flex items-center justify-end gap-3'>
                        {winner.verificationStatus === 'PENDING' && (
                          <button
                            onClick={() => handleVerify(winner)}
                            className='h-[32px] px-5 rounded-[8px] bg-[#8CB34A] hover:bg-[#A0D056] text-[#0D0D0B] font-heading font-medium text-[12px] transition-colors'
                          >
                            Verify
                          </button>
                        )}
                        {winner.verificationStatus === 'VERIFIED' &&
                          winner.deliveryStatus === 'PENDING' && (
                            <button className='h-[32px] px-5 rounded-[8px] bg-transparent border border-[#2D3C13] text-[#72943A] font-heading font-medium text-[12px] cursor-not-allowed opacity-50'>
                              Awaiting Delivery
                            </button>
                          )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <VerifyWinnerModal isOpen={isModalOpen} onClose={handleModalClose} winner={selectedWinner} />
    </div>
  );
}
