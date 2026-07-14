import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AdminWinnersService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllWinners(
    page: number = 1,
    limit: number = 20,
    deliveryStatus?: string,
    verificationStatus?: string,
  ) {
    const skip = (page - 1) * limit;

    const where: Prisma.WinnerWhereInput = {};
    
    if (deliveryStatus && deliveryStatus !== 'All') {
      where.deliveryStatus = deliveryStatus;
    }

    if (verificationStatus && verificationStatus !== 'All') {
      where.verificationStatus = verificationStatus;
    }

    const [winners, total] = await Promise.all([
      this.prisma.winner.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: true,
          raffle: true,
          ticket: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.winner.count({ where }),
    ]);

    return {
      data: winners,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async verifyWinner(id: string) {
    const winner = await this.prisma.winner.findUnique({
      where: { id },
    });

    if (!winner) {
      throw new NotFoundException('Winner not found');
    }

    return this.prisma.winner.update({
      where: { id },
      data: {
        verificationStatus: 'VERIFIED',
      },
      include: {
        user: true,
        raffle: true,
        ticket: true,
      },
    });
  }
}
