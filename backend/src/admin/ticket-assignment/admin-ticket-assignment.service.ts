import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RafflesService } from '../../raffles/raffles.service';
import { AdminAssignTicketsDto } from './dto/admin-assign-tickets.dto';
import * as crypto from 'crypto';

@Injectable()
export class AdminTicketAssignmentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly rafflesService: RafflesService,
  ) {}

  /**
   * Get all active (and recently active) competitions for ticket assignment
   */
  async getCompetitions(query?: { search?: string; status?: string; hostId?: string }) {
    const where: any = {};

    if (query?.status && query.status !== 'ALL') {
      where.status = query.status;
    } else if (!query?.status) {
      where.status = 'ACTIVE';
    }

    if (query?.hostId) {
      where.hostId = query.hostId;
    }

    if (query?.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { prizeName: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const raffles = await this.prisma.raffle.findMany({
      where,
      include: {
        host: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        instantWins: {
          select: {
            id: true,
            ticketNumber: true,
            prizeName: true,
            rrpValue: true,
            isClaimed: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return raffles.map((raffle) => {
      const unclaimedInstantWins = raffle.instantWins.filter((iw) => !iw.isClaimed).length;
      const remainingTickets = Math.max(raffle.totalTickets - raffle.ticketsSold, 0);

      const hostName =
        raffle.host?.businessName ||
        (raffle.host?.user
          ? `${raffle.host.user.firstName || ''} ${raffle.host.user.lastName || ''}`.trim()
          : 'Airsoft Host');

      return {
        id: raffle.id,
        title: raffle.title,
        slug: raffle.slug,
        mainImage: raffle.mainImage,
        status: raffle.status,
        category: raffle.category,
        totalTickets: raffle.totalTickets,
        ticketsSold: raffle.ticketsSold,
        remainingTickets,
        pricePerTicket: Number(raffle.pricePerTicket),
        startDate: raffle.startDate,
        endDate: raffle.endDate,
        isAutoDraw: raffle.isAutoDraw,
        hostId: raffle.hostId,
        hostName,
        totalInstantWins: raffle.instantWins.length,
        unclaimedInstantWins,
      };
    });
  }

  /**
   * Get detailed competition info, instant wins breakdown, and sold tickets map
   */
  async getCompetitionTicketDetails(raffleId: string) {
    const raffle = await this.prisma.raffle.findUnique({
      where: { id: raffleId },
      include: {
        host: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        instantWins: {
          orderBy: { ticketNumber: 'asc' },
        },
      },
    });

    if (!raffle) {
      throw new NotFoundException('Competition not found');
    }

    // Fetch all existing tickets for this competition
    const existingTickets = await this.prisma.ticket.findMany({
      where: { raffleId },
      select: {
        id: true,
        ticketNumber: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        transaction: {
          select: {
            id: true,
            paymentGateway: true,
            amount: true,
          },
        },
      },
      orderBy: { ticketNumber: 'asc' },
    });

    const hostName =
      raffle.host?.businessName ||
      (raffle.host?.user
        ? `${raffle.host.user.firstName || ''} ${raffle.host.user.lastName || ''}`.trim()
        : 'Airsoft Host');

    const totalSold = existingTickets.length;
    const remaining = Math.max(raffle.totalTickets - totalSold, 0);

    return {
      raffle: {
        id: raffle.id,
        title: raffle.title,
        slug: raffle.slug,
        mainImage: raffle.mainImage,
        pricePerTicket: Number(raffle.pricePerTicket),
        totalTickets: raffle.totalTickets,
        ticketsSold: totalSold,
        remainingTickets: remaining,
        status: raffle.status,
        startDate: raffle.startDate,
        endDate: raffle.endDate,
        category: raffle.category,
        isAutoDraw: raffle.isAutoDraw,
        host: {
          id: raffle.hostId,
          businessName: hostName,
          walletBalance: raffle.host ? Number(raffle.host.walletBalance) : 0,
        },
      },
      stats: {
        totalTickets: raffle.totalTickets,
        soldTickets: totalSold,
        availableTickets: remaining,
        totalInstantWins: raffle.instantWins.length,
        unclaimedInstantWins: raffle.instantWins.filter((iw) => !iw.isClaimed).length,
        ticketPrice: Number(raffle.pricePerTicket),
        totalValue: raffle.totalTickets * Number(raffle.pricePerTicket),
        soldValue: totalSold * Number(raffle.pricePerTicket),
      },
      instantWins: raffle.instantWins.map((iw) => ({
        id: iw.id,
        ticketNumber: iw.ticketNumber,
        prizeName: iw.prizeName,
        rrpValue: iw.rrpValue ? Number(iw.rrpValue) : null,
        image: iw.image,
        isClaimed: iw.isClaimed,
      })),
      soldTickets: existingTickets.map((t) => ({
        id: t.id,
        ticketNumber: t.ticketNumber,
        userId: t.user?.id,
        userName: `${t.user?.firstName || ''} ${t.user?.lastName || ''}`.trim() || t.user?.email,
        userEmail: t.user?.email,
        purchasedAt: t.createdAt,
        paymentGateway: t.transaction?.paymentGateway || 'UNKNOWN',
      })),
    };
  }

  /**
   * Search users by name, email, or ID
   */
  async searchUsers(query: string) {
    if (!query || query.trim().length === 0) {
      return this.prisma.user.findMany({
        where: { role: 'CLIENT' },
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isBlocked: true,
          ukaraNumber: true,
          avatarUrl: true,
        },
      });
    }

    const trimmed = query.trim();

    return this.prisma.user.findMany({
      where: {
        OR: [
          { email: { contains: trimmed, mode: 'insensitive' } },
          { firstName: { contains: trimmed, mode: 'insensitive' } },
          { lastName: { contains: trimmed, mode: 'insensitive' } },
          { id: trimmed },
        ],
      },
      take: 15,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isBlocked: true,
        ukaraNumber: true,
        avatarUrl: true,
      },
    });
  }

  /**
   * Assign tickets manually to a user
   * Credits host wallet and tracks payment as ADMIN_MANUAL with zero accounting discrepancies
   */
  async assignTickets(adminId: string, dto: AdminAssignTicketsDto) {
    const { raffleId, userId, ticketNumbers, quantity, adminNotes } = dto;

    // 1. Verify user exists and is active
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('Recipient user not found');
    }
    if (user.isBlocked) {
      throw new BadRequestException('Cannot assign tickets to a blocked user account');
    }

    // 2. Verify raffle exists and is active
    const raffle = await this.prisma.raffle.findUnique({
      where: { id: raffleId },
      include: {
        host: true,
        instantWins: true,
      },
    });
    if (!raffle) {
      throw new NotFoundException('Competition not found');
    }
    if (raffle.status === 'ENDED' || raffle.status === 'CANCELLED') {
      throw new BadRequestException(`Cannot assign tickets to a ${raffle.status.toLowerCase()} competition`);
    }

    // 3. Determine and validate ticket numbers
    let selectedNumbers: number[] = [];

    if (ticketNumbers && ticketNumbers.length > 0) {
      // Deduplicate
      const uniqueNumbers = Array.from(new Set(ticketNumbers));

      for (const num of uniqueNumbers) {
        if (!Number.isInteger(num) || num < 1 || num > raffle.totalTickets) {
          throw new BadRequestException(
            `Ticket number #${num} is invalid. Numbers must be between 1 and ${raffle.totalTickets}.`,
          );
        }
      }

      // Check if any are already taken
      const conflicts = await this.prisma.ticket.findMany({
        where: {
          raffleId,
          ticketNumber: { in: uniqueNumbers },
        },
        select: { ticketNumber: true },
      });

      if (conflicts.length > 0) {
        const taken = conflicts.map((c) => `#${c.ticketNumber}`).join(', ');
        throw new BadRequestException(`Ticket(s) ${taken} are already sold or assigned.`);
      }

      selectedNumbers = uniqueNumbers;
    } else {
      // Pick random available numbers
      const qty = quantity && quantity > 0 ? quantity : 1;

      const existingTickets = await this.prisma.ticket.findMany({
        where: { raffleId },
        select: { ticketNumber: true },
      });
      const usedNumbers = new Set(existingTickets.map((t) => t.ticketNumber));

      const availableNumbers: number[] = [];
      for (let i = 1; i <= raffle.totalTickets; i++) {
        if (!usedNumbers.has(i)) {
          availableNumbers.push(i);
        }
      }

      if (availableNumbers.length < qty) {
        throw new BadRequestException(
          `Only ${availableNumbers.length} ticket(s) remaining. Cannot assign ${qty}.`,
        );
      }

      // Shuffle
      for (let i = availableNumbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [availableNumbers[i], availableNumbers[j]] = [availableNumbers[j], availableNumbers[i]];
      }

      selectedNumbers = availableNumbers.slice(0, qty);
    }

    const assignedCount = selectedNumbers.length;
    const pricePerTicket = Number(raffle.pricePerTicket);
    const totalAmount = pricePerTicket * assignedCount;

    // 4. Atomic Prisma Transaction
    const result = await this.prisma.$transaction(
      async (tx) => {
        // A. Create Transaction record with paymentGateway = 'ADMIN_MANUAL'
        const gatewayTransactionId = `ADMIN_ASSIGN_${Date.now()}_${crypto.randomUUID().slice(0, 8)}`;
        const transaction = await tx.transaction.create({
          data: {
            userId,
            type: 'TICKET_PURCHASE',
            amount: totalAmount,
            status: 'COMPLETED',
            paymentGateway: 'ADMIN_MANUAL',
            gatewayTransactionId,
            relatedEntityId: raffle.id,
          },
        });

        // B. Credit Host Wallet Balance (ensuring host accounting remains 100% consistent)
        if (raffle.hostId) {
          await tx.hostProfile.update({
            where: { id: raffle.hostId },
            data: {
              walletBalance: {
                increment: totalAmount,
              },
            },
          });
        }

        // C. Increment Raffle ticketsSold
        const updatedRaffle = await tx.raffle.update({
          where: { id: raffle.id },
          data: {
            ticketsSold: {
              increment: assignedCount,
            },
          },
        });

        // D. Create Ticket records
        const now = new Date();
        const ticketsData = selectedNumbers.map((num) => ({
          raffleId: raffle.id,
          userId,
          transactionId: transaction.id,
          ticketNumber: num,
          acceptedTermsVersion: 'admin-assigned-v1',
          acceptedTermsAt: now,
        }));

        await tx.ticket.createMany({
          data: ticketsData,
        });

        const createdTickets = await tx.ticket.findMany({
          where: {
            transactionId: transaction.id,
            raffleId: raffle.id,
          },
        });

        // E. Check and claim Instant Wins
        const instantWinsWon: any[] = [];
        for (const ticket of createdTickets) {
          const matchedInstantWin = raffle.instantWins.find(
            (iw) => iw.ticketNumber === ticket.ticketNumber && !iw.isClaimed,
          );

          if (matchedInstantWin) {
            await tx.instantWin.update({
              where: { id: matchedInstantWin.id },
              data: { isClaimed: true },
            });

            const winner = await tx.winner.create({
              data: {
                userId,
                raffleId: raffle.id,
                ticketId: ticket.id,
                winType: 'INSTANT_WIN',
                prizeName: matchedInstantWin.prizeName,
                deliveryStatus: 'PENDING',
                verificationStatus: 'WINNER_SELECTED',
                ukaraStatus: 'NOT_REQUIRED',
                isClaimed: false,
              },
            });

            instantWinsWon.push({
              ...winner,
              ticketNumber: ticket.ticketNumber,
              prizeName: matchedInstantWin.prizeName,
              rrpValue: matchedInstantWin.rrpValue ? Number(matchedInstantWin.rrpValue) : null,
              prizeImage: matchedInstantWin.image || null,
            });
          }
        }

        // F. Create Audit Log
        await tx.auditLog.create({
          data: {
            userId: adminId,
            action: 'ADMIN_MANUAL_TICKET_ASSIGNMENT',
            entityType: 'RAFFLE',
            entityId: raffle.id,
            details: JSON.stringify({
              assignedToUserId: userId,
              assignedToUserEmail: user.email,
              ticketNumbers: selectedNumbers,
              quantity: assignedCount,
              totalAmount,
              notes: adminNotes || 'Admin manual assignment',
            }),
          },
        });

        // G. Send Notification to recipient user
        await tx.notification.create({
          data: {
            userId,
            type: 'PAYMENT',
            title: 'Tickets Allocated by Admin',
            subtitle: `You have been assigned ${assignedCount} ticket(s) for "${raffle.title}" (Tickets: #${selectedNumbers.join(', #')}).`,
            link: '/dashboard/user/tickets',
          },
        });

        if (instantWinsWon.length > 0) {
          for (const win of instantWinsWon) {
            await tx.notification.create({
              data: {
                userId,
                type: 'WIN',
                title: 'Instant Win Unlocked!',
                subtitle: `Congratulations! Ticket #${win.ticketNumber} won an Instant Win prize: ${win.prizeName}!`,
                link: '/dashboard/user/winners',
              },
            });
          }
        }

        return {
          transaction,
          updatedRaffle,
          createdTickets,
          instantWinsWon,
        };
      },
      {
        maxWait: 5000,
        timeout: 10000,
      },
    );

    // 5. Check auto draw trigger outside transaction
    if (
      result.updatedRaffle.isAutoDraw &&
      result.updatedRaffle.autoDrawSoldOut &&
      result.updatedRaffle.ticketsSold >= result.updatedRaffle.totalTickets &&
      result.updatedRaffle.status === 'ACTIVE'
    ) {
      try {
        await this.rafflesService.drawWinner(result.updatedRaffle.id);
      } catch (err) {
        console.error('Failed to trigger auto draw on sold out:', err);
      }
    }

    const userName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email;

    return {
      success: true,
      message: `Successfully assigned ${assignedCount} ticket(s) to ${userName}`,
      assignedNumbers: selectedNumbers,
      quantity: assignedCount,
      totalAmount,
      transactionId: result.transaction.id,
      paymentGateway: 'ADMIN_MANUAL',
      raffle: {
        id: raffle.id,
        title: raffle.title,
        pricePerTicket,
      },
      recipient: {
        id: user.id,
        name: userName,
        email: user.email,
      },
      instantWinsWon: result.instantWinsWon,
      notes: adminNotes,
    };
  }

  /**
   * Get assignment history of all admin manual assignments
   */
  async getAssignmentHistory(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [total, transactions] = await Promise.all([
      this.prisma.transaction.count({
        where: { paymentGateway: 'ADMIN_MANUAL' },
      }),
      this.prisma.transaction.findMany({
        where: { paymentGateway: 'ADMIN_MANUAL' },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          tickets: {
            include: {
              raffle: {
                select: {
                  id: true,
                  title: true,
                  slug: true,
                  mainImage: true,
                  pricePerTicket: true,
                },
              },
            },
          },
        },
      }),
    ]);

    const formatted = transactions.map((tx) => {
      const raffle = tx.tickets[0]?.raffle;
      const ticketNumbers = tx.tickets.map((t) => t.ticketNumber).sort((a, b) => a - b);
      const recipientName =
        `${tx.user?.firstName || ''} ${tx.user?.lastName || ''}`.trim() || tx.user?.email;

      return {
        id: tx.id,
        gatewayTransactionId: tx.gatewayTransactionId,
        date: tx.createdAt,
        amount: Number(tx.amount),
        ticketsCount: tx.tickets.length,
        ticketNumbers,
        recipient: {
          id: tx.user?.id,
          name: recipientName,
          email: tx.user?.email,
        },
        raffle: raffle
          ? {
              id: raffle.id,
              title: raffle.title,
              slug: raffle.slug,
              mainImage: raffle.mainImage,
              pricePerTicket: Number(raffle.pricePerTicket),
            }
          : null,
      };
    });

    return {
      data: formatted,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
