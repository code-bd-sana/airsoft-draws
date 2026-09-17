import { Injectable, NotFoundException, Optional } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../../notifications/notifications.service';

@Injectable()
export class AdminWithdrawalsService {
  constructor(
    private readonly prisma: PrismaService,
    @Optional()
    private readonly notificationsService?: NotificationsService,
  ) {}

  async findAll() {
    const withdrawals = await this.prisma.withdrawal.findMany({
      include: {
        host: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return withdrawals.map((w) => {
      const wObj = w as any;
      let parsedDetails = {};
      try {
        if (w.payoutDetails) parsedDetails = JSON.parse(w.payoutDetails);
      } catch (e) {
        parsedDetails = { raw: w.payoutDetails };
      }

      return {
        id: w.id,
        hostId: w.hostId,
        hostBusinessName: w.host.businessName,
        hostUserEmail: w.host.user.email,
        hostUserName: `${w.host.user.firstName || ''} ${w.host.user.lastName || ''}`.trim(),
        amount: Number(w.amount),
        feeAmount: Number(
          wObj.feeAmount !== null && wObj.feeAmount !== undefined
            ? wObj.feeAmount
            : Number(w.amount) * 0.15,
        ),
        netAmount: Number(
          wObj.netAmount !== null && wObj.netAmount !== undefined
            ? wObj.netAmount
            : Number(w.amount) * 0.85,
        ),
        status: w.status,
        payoutMethod: w.payoutMethod || 'BANK_TRANSFER',
        payoutDetails: parsedDetails,
        adminNotes: w.adminNotes,
        createdAt: w.createdAt,
        updatedAt: w.updatedAt,
      };
    });
  }

  async updateStatus(
    id: string,
    status: 'APPROVED' | 'COMPLETED' | 'REJECTED',
    adminNotes?: string,
  ) {
    const withdrawal = await this.prisma.withdrawal.findUnique({
      where: { id },
      include: { host: true },
    });

    if (!withdrawal) {
      throw new NotFoundException('Withdrawal request not found');
    }

    if (withdrawal.status === status) {
      return withdrawal;
    }

    const result = await this.prisma.$transaction(async (tx) => {
      // If rejected and previously PENDING, refund host's wallet
      if (status === 'REJECTED' && withdrawal.status === 'PENDING') {
        await tx.hostProfile.update({
          where: { id: withdrawal.hostId },
          data: {
            walletBalance: {
              increment: withdrawal.amount,
            },
          },
        });
      }

      const updated = await tx.withdrawal.update({
        where: { id },
        data: {
          status,
          adminNotes: adminNotes || withdrawal.adminNotes,
        },
      });

      return updated;
    });

    if (this.notificationsService && withdrawal.host?.userId) {
      try {
        const isApproved = status === 'APPROVED' || status === 'COMPLETED';
        await this.notificationsService.createNotification({
          userId: withdrawal.host.userId,
          type: 'WITHDRAWAL',
          title: isApproved ? 'Withdrawal Approved' : 'Withdrawal Request Rejected',
          subtitle: isApproved
            ? `Your payout request of £${Number(withdrawal.amount).toFixed(2)} has been ${status.toLowerCase()}.`
            : `Your payout request of £${Number(withdrawal.amount).toFixed(2)} was rejected.${adminNotes ? ' Reason: ' + adminNotes : ''}`,
          link: '/dashboard/host/wallet',
          metadata: {
            withdrawalId: withdrawal.id,
            status,
            amount: Number(withdrawal.amount),
          },
        });
      } catch (err) {
        console.error('Failed to dispatch withdrawal status notification:', err);
      }
    }

    return result;
  }
}
