'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useState } from 'react';
import { Winner, winnerService } from '../../../services/winner.service';
import AdminWinnerComplianceModal from './AdminWinnerComplianceModal';

export default function WinnersTrackingTable() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [winTypeFilter, setWinTypeFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWinner, setSelectedWinner] = useState<Winner | null>(null);

  const queryClient = useQueryClient();

  const filters = ['All', 'Pending Verification', 'Approved For Fulfilment', 'Prize Delivered'];
  const winTypeFilters = ['All', 'Main Draw', 'Instant Win'];

  const getVerificationQuery = (filter: string) => {
    switch (filter) {
      case 'Pending Verification':
        return 'WINNER_SELECTED';
      case 'Approved For Fulfilment':
        return 'APPROVED_FOR_FULFILMENT';
      default:
        return 'All';
    }
  };

  const getDeliveryQuery = (filter: string) => {
    if (filter === 'Prize Delivered') return 'DELIVERED';
    return 'All';
  };

  const getWinTypeQuery = (filter: string) => {
    switch (filter) {
      case 'Main Draw':
        return 'MAIN_DRAW';
      case 'Instant Win':
        return 'INSTANT_WIN';
      default:
        return 'All';
    }
  };

  const { data: winnersResponse, isLoading } = useQuery({
    queryKey: ['adminWinners', activeFilter, winTypeFilter],
    queryFn: () =>
      winnerService.getAdminWinners({
        verificationStatus: getVerificationQuery(activeFilter),
        status: getDeliveryQuery(activeFilter),
        winType: getWinTypeQuery(winTypeFilter),
      }),
  });

  const winners = winnersResponse?.data || [];

  const handleVerify = (winner: Winner) => {
    setSelectedWinner(winner);
    setIsModalOpen(true);
  };

  const handleExportCSV = () => {
    if (winners.length === 0) return;

    const headers = [
      "ID",
      "Winner Name",
      "User Email",
      "Competition Won",
      "Classification",
      "Win Type",
      "Prize Name",
      "Draw Date",
      "Verification Status",
      "UKARA Status",
      "Delivery Status"
    ];

    const rows = winners.map((winner: any) => {
      const name = `${winner.user?.firstName || ''} ${winner.user?.lastName || ''}`.trim() || 'Unknown';
      const email = winner.user?.email || 'N/A';
      const competition = winner.raffle?.title || 'Unknown Raffle';
      const classification = winner.raffle?.prizeClassification || 'RIF';
      const winType = winner.winType === 'INSTANT_WIN' ? 'Instant Win' : 'Main Draw';
      const prize = winner.prizeName || 'N/A';
      const drawDate = winner.createdAt ? format(new Date(winner.createdAt), 'dd MMM yyyy HH:mm') : 'N/A';
      const verificationStatus = winner.verificationStatus || 'N/A';
      const ukaraStatus = winner.ukaraStatus || 'NOT_REQUIRED';
      const deliveryStatus = winner.deliveryStatus || 'N/A';

      return [
        winner.id,
        name,
        email,
        competition,
        classification,
        winType,
        prize,
        drawDate,
        verificationStatus,
        ukaraStatus,
        deliveryStatus
      ];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);

    const filterTag = activeFilter.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const winTypeTag = winTypeFilter.toLowerCase().replace(/[^a-z0-9]/g, '_');
    link.setAttribute("download", `winners_compliance_export_${filterTag}_${winTypeTag}_${new Date().toISOString().slice(0, 10)}.csv`);

    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    queryClient.invalidateQueries({ queryKey: ['adminWinners'] });
  };

  const getStatusStyle = (winner: any) => {
    if (winner.deliveryStatus === 'DELIVERED' || winner.verificationStatus === 'COMPLETED')
      return 'border-[#4ADE80]/30 bg-[#083b18] text-[#4ADE80]';
    if (winner.verificationStatus === 'APPROVED_FOR_FULFILMENT')
      return 'border-[#8CB34A]/30 bg-[#1A230A] text-[#8CB34A]';
    if (winner.verificationStatus === 'VERIFICATION_FAILED')
      return 'border-red-800 bg-red-950 text-red-400';
    if (winner.verificationStatus === 'CASH_ALT_OFFERED' || winner.verificationStatus === 'TWO_TONE_ALT_OFFERED')
      return 'border-amber-800 bg-amber-950 text-amber-400';
    return 'border-[#D97706]/30 bg-[#78350F] text-[#F59E0B]';
  };

  return (
    <div className='flex flex-col gap-6 w-full mt-4'>
      {/* Filters Container */}
      <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-4'>
        {/* Status Filters */}
        <div className='flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0'>
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-[8px] font-sans font-medium text-[12px] whitespace-nowrap transition-colors ${
                activeFilter === filter
                  ? 'bg-transparent border border-[#8CB34A] text-[#E8EDD4]'
                  : 'bg-transparent border border-[#2D3C13] text-[#72943A] hover:bg-[#1A230A] hover:text-[#A0D056]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Win Type Filters & Export CSV */}
        <div className='flex flex-wrap items-center gap-4'>
          <div className='flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0'>
            {winTypeFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setWinTypeFilter(filter)}
                className={`px-4 py-2 rounded-[8px] font-sans font-medium text-[12px] whitespace-nowrap transition-colors ${
                  winTypeFilter === filter
                    ? 'bg-transparent border border-[#8CB34A] text-[#E8EDD4]'
                    : 'bg-transparent border border-[#2D3C13] text-[#72943A] hover:bg-[#1A230A] hover:text-[#A0D056]'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <button 
            onClick={handleExportCSV}
            disabled={winners.length === 0}
            className="h-[36px] px-4 bg-[#111210] border border-[#2D3C13] hover:border-[#5A752A] hover:bg-[#1A230A] rounded-[8px] flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer shrink-0"
            title="Export filtered winners to CSV"
          >
            <svg className="w-4 h-4 text-[#8CB34A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            <span className="font-sans font-medium text-[12px] text-[#E8EDD4]">Export Compliance CSV</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className='w-full bg-[#161810] border border-[#2D3C13] rounded-[16px] overflow-hidden overflow-x-auto mt-2'>
        <table className='w-full min-w-[1050px] text-left border-collapse'>
          <thead>
            <tr className='border-b border-[#2D3C13] bg-[#111210]'>
              <th className='py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[18%]'>
                WINNER & ID
              </th>
              <th className='py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[18%]'>
                COMPETITION & CLASS
              </th>
              <th className='py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[12%] text-center'>
                WIN TYPE
              </th>
              <th className='py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[12%] text-center'>
                DRAW DATE
              </th>
              <th className='py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[14%] text-center'>
                UKARA / DEFENCE
              </th>
              <th className='py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[15%] text-center'>
                COMPLIANCE STATUS
              </th>
              <th className='py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[11%] text-right'>
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className='py-8 text-center text-[#72943A] font-sans text-sm'>
                  Loading winners compliance list...
                </td>
              </tr>
            ) : winners.length === 0 ? (
              <tr>
                <td colSpan={7} className='py-8 text-center text-[#72943A] font-sans text-sm'>
                  No winners found.
                </td>
              </tr>
            ) : (
              winners.map((winner: any, i: number) => {
                const name =
                  `${winner.user?.firstName || ''} ${winner.user?.lastName || ''}`.trim() ||
                  'Unknown';
                const initials = name.substring(0, 2).toUpperCase();
                const classification = winner.raffle?.prizeClassification || 'RIF';

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
                        <div className="flex flex-col">
                          <span className='font-sans font-medium text-[13px] text-[#E8EDD4]'>
                            {name}
                          </span>
                          <span className="font-sans text-[10px] text-[#5A752A]">
                            {winner.user?.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className='py-4 px-6'>
                      <div className="flex flex-col gap-1">
                        <span className='font-sans text-[13px] text-[#E8EDD4] font-medium'>
                          {winner.raffle?.title || 'Unknown Raffle'}
                        </span>
                        <span className={`text-[10px] font-semibold w-fit px-2 py-0.5 rounded border ${
                          classification === 'RIF' 
                            ? 'bg-amber-950/40 border-amber-800 text-amber-400' 
                            : 'bg-blue-950/40 border-blue-800 text-blue-400'
                        }`}>
                          {classification}
                        </span>
                      </div>
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
                      <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-semibold ${
                        winner.ukaraStatus === 'VALID' 
                          ? 'bg-[#1A230A] border-[#8CB34A] text-[#8CB34A]'
                          : winner.ukaraStatus === 'NOT_REQUIRED'
                          ? 'bg-gray-900 border-gray-700 text-gray-400'
                          : 'bg-amber-950 border-amber-800 text-amber-400'
                      }`}>
                        {winner.ukaraStatus || 'NOT_REQUIRED'}
                      </span>
                    </td>
                    <td className='py-4 px-6 text-center'>
                      <span
                        className={`px-3 py-1 rounded-full border font-sans font-medium text-[10px] whitespace-nowrap ${getStatusStyle(winner)}`}
                      >
                        {winner.verificationStatus || 'WINNER_SELECTED'}
                      </span>
                    </td>
                    <td className='py-4 px-6 text-right'>
                      <button
                        onClick={() => handleVerify(winner)}
                        className='h-[32px] px-4 rounded-[8px] bg-[#8CB34A] hover:bg-[#A0D056] text-[#0D0D0B] font-heading font-medium text-[12px] transition-colors shadow-[0_0_10px_rgba(140,179,74,0.15)]'
                      >
                        Audit Compliance
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <AdminWinnerComplianceModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        winner={selectedWinner}
        onRefresh={() => queryClient.invalidateQueries({ queryKey: ['adminWinners'] })}
      />
    </div>
  );
}
