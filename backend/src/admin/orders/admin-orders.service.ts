import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminOrdersService {
  constructor(private prisma: PrismaService) {}

  async getAllOrders(page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;

    const where: any = {
      type: 'TICKET_PURCHASE',
    };

    if (search) {
      where.OR = [
        { gatewayTransactionId: { contains: search, mode: 'insensitive' } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { user: { firstName: { contains: search, mode: 'insensitive' } } },
        { user: { lastName: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [transactions, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: true,
          tickets: {
            include: {
              raffle: true,
            },
          },
        },
      }),
      this.prisma.transaction.count({ where }),
    ]);

    const mappedOrders = transactions.map((tx) => {
      const ticketsCount = tx.tickets?.length || 0;
      const competitionName =
        ticketsCount > 0 ? tx.tickets[0].raffle.title : 'Unknown Competition';

      let buyerName = 'Unknown Buyer';
      let buyerInitials = 'U';

      if (tx.user) {
        buyerName =
          `${tx.user.firstName || ''} ${tx.user.lastName || ''}`.trim() ||
          tx.user.email;
        buyerInitials = buyerName.substring(0, 2).toUpperCase();
      }

      return {
        id: tx.id,
        orderId:
          tx.gatewayTransactionId?.substring(0, 8) || tx.id.substring(0, 8),
        buyerName,
        buyerInitials,
        competition: competitionName,
        tickets: ticketsCount,
        amount: Number(tx.amount),
        payment: tx.paymentGateway || 'Card',
        status:
          tx.status === 'COMPLETED'
            ? 'Paid'
            : tx.status === 'REFUNDED'
              ? 'Refunded'
              : 'Failed',
        date: tx.createdAt.toISOString(),
      };
    });

    return {
      orders: mappedOrders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getOrdersStats() {
    const ticketTransactions = await this.prisma.transaction.findMany({
      where: { type: 'TICKET_PURCHASE' },
      include: {
        _count: {
          select: { tickets: true },
        },
      },
    });

    const totalOrders = ticketTransactions.length;
    let totalTicketsSold = 0;
    let totalOrderValue = 0;
    let refundedOrders = 0;

    for (const tx of ticketTransactions) {
      totalTicketsSold += tx._count.tickets;

      if (tx.status === 'COMPLETED') {
        totalOrderValue += Number(tx.amount);
      } else if (tx.status === 'REFUNDED') {
        refundedOrders++;
      }
    }

    return {
      totalOrders,
      totalTicketsSold,
      totalOrderValue,
      refundedOrders,
    };
  }

  async processRefund(transactionId: string, reason?: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (transaction.type !== 'TICKET_PURCHASE') {
      throw new BadRequestException('Can only refund ticket purchases');
    }

    if (transaction.status === 'REFUNDED') {
      throw new BadRequestException('Transaction is already refunded');
    }

    if (transaction.status !== 'COMPLETED') {
      throw new BadRequestException(
        `Cannot refund a transaction with status ${transaction.status}`,
      );
    }

    // In a real application, we would call Stripe or PayPal API here to process the actual refund.
    // For this simulation, we'll just update the status in the database.

    const updatedTransaction = await this.prisma.transaction.update({
      where: { id: transactionId },
      data: { status: 'REFUNDED' },
    });

    return {
      message: 'Refund processed successfully',
      transaction: updatedTransaction,
    };
  }
}
