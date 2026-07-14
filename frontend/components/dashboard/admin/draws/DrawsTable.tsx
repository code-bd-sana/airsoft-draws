'use client';

import React from 'react';
import { format } from 'date-fns';
import { Raffle } from '../../../../services/raffle.service';

export default function DrawsTable({
  draws,
  onSelectDraw,
}: {
  draws: Raffle[];
  onSelectDraw: (draw: Raffle) => void;
}) {
  const getStatusPill = (status: string) => {
    switch (status) {
      case 'PENDING_APPROVAL':
        return (
          <span className='px-3 py-1 rounded-full border border-[#D97706]/30 bg-[#78350F] text-[#F59E0B] font-sans font-medium text-[10px]'>
            Pending Approval
          </span>
        );
      case 'DRAFT':
        return (
          <span className='px-3 py-1 rounded-full border border-[#6B7280]/30 bg-[#374151] text-[#9CA3AF] font-sans font-medium text-[10px]'>
            Draft
          </span>
        );
      case 'ENDED':
        return (
          <span className='px-3 py-1 rounded-full border border-[#4ADE80]/30 bg-[#083b18] text-[#4ADE80] font-sans font-medium text-[10px]'>
            Completed
          </span>
        );
      case 'ACTIVE':
        return (
          <span className='px-3 py-1 rounded-full border border-[#EAB308]/30 bg-[#854D0E] text-[#FDE047] font-sans font-medium text-[10px]'>
            In Progress
          </span>
        );
      case 'CANCELLED':
        return (
          <span className='px-3 py-1 rounded-full border border-[#EF4444]/30 bg-[#7F1D1D] text-[#F87171] font-sans font-medium text-[10px]'>
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  const getDrawType = (draw: Raffle) => {
    if (!draw.isAutoDraw) return 'Manual (Host)';
    if (draw.isAutoDraw && draw.autoDrawSoldOut) return 'Auto (Sold Out)';
    return 'Auto (Date)';
  };

  const getTypeStyle = (type: string) => {
    if (type.includes('Auto')) return 'text-[#4ADE80]';
    if (type.includes('Manual')) return 'text-[#F59E0B]';
    return 'text-[#E8EDD4]';
  };

  return (
    <div className='w-full bg-[#161810] border border-[#2D3C13] rounded-[16px] overflow-hidden overflow-x-auto'>
      <table className='w-full min-w-[900px] text-left border-collapse'>
        <thead>
          <tr className='border-b border-[#2D3C13] bg-[#111210]'>
            <th className='py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[20%]'>
              COMPETITION NAME
            </th>
            <th className='py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[20%]'>
              HOST
            </th>
            <th className='py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[15%] text-center'>
              DRAW TYPE
            </th>
            <th className='py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[15%] text-center'>
              END DATE
            </th>
            <th className='py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[10%] text-center'>
              TOTAL TICKETS
            </th>
            <th className='py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[10%] text-center'>
              STATUS
            </th>
            <th className='py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[10%] text-right'>
              ACTIONS
            </th>
          </tr>
        </thead>
        <tbody>
          {draws.map((draw, i) => {
            const hostName = draw.host?.businessName || 'Unknown Host';
            const hostInitials = hostName.substring(0, 2).toUpperCase();
            const drawType = getDrawType(draw);

            return (
              <tr
                key={draw.id}
                className={`${i !== draws.length - 1 ? 'border-b border-[#2D3C13]' : ''} hover:bg-[#1A230A] transition-colors`}
              >
                <td className='py-4 px-6'>
                  <span className='font-sans font-medium text-[13px] text-[#E8EDD4]'>
                    {draw.title}
                  </span>
                </td>
                <td className='py-4 px-6'>
                  <div className='flex items-center gap-3'>
                    <div className='w-6 h-6 rounded-full bg-[#1A230A] border border-[#43581E] flex items-center justify-center shrink-0 overflow-hidden'>
                      {draw.host?.user?.avatarUrl ? (
                        <img
                          src={draw.host.user.avatarUrl}
                          alt='Host'
                          className='w-full h-full object-cover'
                        />
                      ) : (
                        <span className='font-sans font-medium text-[9px] text-[#8CB34A]'>
                          {hostInitials}
                        </span>
                      )}
                    </div>
                    <span className='font-sans text-[13px] text-[#72943A]'>{hostName}</span>
                  </div>
                </td>
                <td className='py-4 px-6 text-center'>
                  <span className={`font-sans font-medium text-[12px] ${getTypeStyle(drawType)}`}>
                    {drawType}
                  </span>
                </td>
                <td className='py-4 px-6 text-center'>
                  <span className={`font-sans font-medium text-[12px] text-[#72943A]`}>
                    {draw.endDate ? format(new Date(draw.endDate), 'dd MMM yyyy HH:mm') : 'N/A'}
                  </span>
                </td>
                <td className='py-4 px-6 text-center'>
                  <span className='font-sans font-medium text-[13px] text-[#E8EDD4]'>
                    {draw.totalTickets}
                  </span>
                </td>
                <td className='py-4 px-6 text-center flex justify-center'>
                  {getStatusPill(draw.status)}
                </td>
                <td className='py-4 px-6'>
                  <div className='flex items-center justify-end gap-3'>
                    <button
                      onClick={() => onSelectDraw(draw)}
                      className='font-sans font-medium text-[12px] text-[#72943A] hover:text-[#E8EDD4] transition-colors'
                    >
                      View
                    </button>
                    {/* The Force Draw button is removed as Admin is just a monitor */}
                  </div>
                </td>
              </tr>
            );
          })}
          {draws.length === 0 && (
            <tr>
              <td colSpan={7} className='py-8 text-center text-[#72943A] font-sans text-sm'>
                No draws found for this filter.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
