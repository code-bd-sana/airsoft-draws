import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class TicketsService {
  constructor(private readonly prisma: PrismaService) {}

  async purchaseTickets(userId: string, raffleId: string, quantity: number) {
    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be at least 1');
    }

    return this.prisma.$transaction(async (tx) => {
      // 1. Fetch the active raffle and lock it for update if needed.
      // We will use standard query here, and rely on the transaction isolation.
      const raffle = await tx.raffle.findUnique({
        where: { id: raffleId },
        include: { instantWins: true }
      });

      if (!raffle) {
        throw new NotFoundException('Competition not found');
      }

      if (raffle.status !== 'ACTIVE') {
        throw new BadRequestException('This competition is not active');
      }

      if (raffle.ticketsSold + quantity > raffle.totalTickets) {
        throw new BadRequestException(`Only ${raffle.totalTickets - raffle.ticketsSold} tickets remaining`);
      }

      // 2. Determine available ticket numbers
      const existingTickets = await tx.ticket.findMany({
        where: { raffleId },
        select: { ticketNumber: true }
      });
      const usedNumbers = new Set(existingTickets.map(t => t.ticketNumber));
      
      const availableNumbers: number[] = [];
      for (let i = 1; i <= raffle.totalTickets; i++) {
        if (!usedNumbers.has(i)) {
          availableNumbers.push(i);
        }
      }

      if (availableNumbers.length < quantity) {
        throw new BadRequestException('Not enough ticket numbers available');
      }

      // 3. Shuffle and pick random numbers
      // Fisher-Yates shuffle on the available numbers
      for (let i = availableNumbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [availableNumbers[i], availableNumbers[j]] = [availableNumbers[j], availableNumbers[i]];
      }
      const assignedNumbers = availableNumbers.slice(0, quantity);

      // 4. Create Simulated Transaction
      const totalAmount = Number(raffle.pricePerTicket) * quantity;
      const gatewayTransactionId = `SIM_PAY_${crypto.randomUUID()}`;
      
      const transaction = await tx.transaction.create({
        data: {
          userId,
          type: 'TICKET_PURCHASE',
          amount: totalAmount,
          status: 'COMPLETED', // Simulating instant success
          paymentGateway: 'SIMULATED',
          gatewayTransactionId,
          relatedEntityId: raffle.id,
        }
      });

      // 5. Create Tickets
      const ticketsData = assignedNumbers.map(num => ({
        raffleId: raffle.id,
        userId,
        transactionId: transaction.id,
        ticketNumber: num,
      }));

      await tx.ticket.createMany({
        data: ticketsData
      });

      // Fetch the created tickets to return them
      const createdTickets = await tx.ticket.findMany({
        where: { transactionId: transaction.id }
      });

      // 6. Check for Instant Wins
      const instantWinsData = [];
      const userInstantWins: any[] = [];

      for (const ticket of createdTickets) {
        const matchedInstantWin = raffle.instantWins.find(
          iw => iw.ticketNumber === ticket.ticketNumber && !iw.isClaimed
        );

        if (matchedInstantWin) {
          // Mark as claimed
          await tx.instantWin.update({
            where: { id: matchedInstantWin.id },
            data: { isClaimed: true }
          });

          // Create Winner record
          const winner = await tx.winner.create({
            data: {
              userId,
              raffleId: raffle.id,
              ticketId: ticket.id,
              winType: 'INSTANT_WIN',
              prizeName: matchedInstantWin.prizeName,
              deliveryStatus: 'PENDING',
            }
          });

          userInstantWins.push(winner);
        }
      }

      // 7. Update Raffle Tickets Sold
      await tx.raffle.update({
        where: { id: raffle.id },
        data: {
          ticketsSold: {
            increment: quantity
          }
        }
      });

      return {
        message: 'Tickets purchased successfully',
        transaction,
        tickets: createdTickets,
        instantWins: userInstantWins,
      };
    }, {
      // Optional: Set isolation level or timeout if needed
      maxWait: 5000,
      timeout: 10000,
    });
  }

  async getUserTickets(userId: string) {
    return this.prisma.ticket.findMany({
      where: { userId },
      include: {
        raffle: {
          select: {
            id: true,
            title: true,
            mainImage: true,
            endDate: true,
            status: true,
          }
        },
        winners: true,
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}
