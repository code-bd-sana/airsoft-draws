import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RafflesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(hostId: string, data: any) {
    const hostProfile = await this.prisma.hostProfile.findUnique({
      where: { userId: hostId },
      include: {
        subscriptions: {
          where: { status: 'ACTIVE' },
          include: { plan: true },
          orderBy: { createdAt: 'desc' },
          take: 1
        },
        raffles: true
      }
    });

    if (!hostProfile) {
      throw new BadRequestException('Host profile not found');
    }

    const activeSub = hostProfile.subscriptions[0];
    if (!activeSub) {
      throw new ForbiddenException('You must have an active subscription to create a competition.');
    }

    // Check free tier limits (assuming plan price == 0 means free)
    if (Number(activeSub.plan.price) === 0) {
      const maxFreeRaffles = 3;
      if (hostProfile.raffles.length >= maxFreeRaffles) {
        throw new ForbiddenException(`Free plan is limited to ${maxFreeRaffles} competitions. Please upgrade your plan.`);
      }
    }

    // Generate unique slug
    const baseSlug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const uniqueStr = Math.random().toString(36).substring(2, 8);
    const slug = `${baseSlug}-${uniqueStr}`;

    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);

    const totalTickets = Number(data.totalTickets) || 0;

    const raffle = await this.prisma.raffle.create({
      data: {
        hostId: hostProfile.id,
        title: data.title,
        slug,
        description: data.description || '',
        pricePerTicket: data.ticketPrice || 0,
        totalTickets,
        startDate,
        endDate,
        status: 'PENDING_APPROVAL', // Requires admin approval
        isAutoDraw: data.isAutoDraw !== undefined ? data.isAutoDraw : true,
        autoDrawDate: data.autoDrawDate !== undefined ? data.autoDrawDate : true,
        autoDrawSoldOut: data.autoDrawSoldOut !== undefined ? data.autoDrawSoldOut : false,
      },
    });

    if (data.instantWins && Array.isArray(data.instantWins) && data.instantWins.length > 0) {
      // Generate unique random ticket numbers
      const numInstantWins = data.instantWins.length;
      if (numInstantWins <= totalTickets) {
        const uniqueTickets = new Set<number>();
        while (uniqueTickets.size < numInstantWins) {
          uniqueTickets.add(Math.floor(Math.random() * totalTickets) + 1);
        }
        const ticketNumbers = Array.from(uniqueTickets);

        const instantWinsData = data.instantWins.map((iw: any, index: number) => ({
          raffleId: raffle.id,
          ticketNumber: ticketNumbers[index],
          prizeName: iw.prizeName,
          image: iw.image || null,
        }));

        await this.prisma.instantWin.createMany({
          data: instantWinsData
        });
      }
    }

    return raffle;
  }

  async updateMainImage(id: string, hostId: string, url: string) {
    const hostProfile = await this.prisma.hostProfile.findUnique({ where: { userId: hostId } });
    if (!hostProfile) throw new BadRequestException('Host profile not found');

    const raffle = await this.prisma.raffle.findFirst({
      where: { id, hostId: hostProfile.id }
    });

    if (!raffle) throw new NotFoundException('Raffle not found');

    return this.prisma.raffle.update({
      where: { id },
      data: { mainImage: url }
    });
  }

  async findAllPublic(query: any) {
    const { search, page = 1, limit = 12, category, statusFilter, sort } = query;
    const skip = (Number(page) - 1) * Number(limit);

    const now = new Date();
    
    // Base where clause (only ACTIVE)
    const whereClause: any = { 
      status: 'ACTIVE',
    };

    // Category filter
    if (category && category !== 'All') {
      whereClause.category = category;
    }

    // Status filter
    if (statusFilter === 'Live') {
      whereClause.startDate = { lte: now };
      whereClause.endDate = { gte: now };
    } else if (statusFilter === 'Upcoming') {
      whereClause.startDate = { gt: now };
    } else if (statusFilter === 'Past') {
      whereClause.endDate = { lt: now };
    }

    if (search) {
      whereClause.title = { contains: search, mode: 'insensitive' };
    }

    // Sort logic
    let orderBy: any = { createdAt: 'desc' }; // default Latest
    if (sort === 'Ending Soon') {
      orderBy = { endDate: 'asc' };
    } else if (sort === 'Price: Low to High') {
      orderBy = { pricePerTicket: 'asc' };
    } else if (sort === 'Price: High to Low') {
      orderBy = { pricePerTicket: 'desc' };
    }
    


    const [raffles, total] = await Promise.all([
      this.prisma.raffle.findMany({
        where: whereClause,
        include: { host: { include: { user: true } } },
        skip,
        take: Number(limit),
        orderBy,
      }),
      this.prisma.raffle.count({ where: whereClause })
    ]);

    return {
      data: raffles,
      meta: {
        total,
        page: Number(page),
        lastPage: Math.ceil(total / Number(limit))
      }
    };
  }

  async findOnePublic(slug: string) {
    const raffle = await this.prisma.raffle.findFirst({
      where: { slug, status: 'ACTIVE' },
      include: { 
        host: { include: { user: true } },
        instantWins: true 
      }
    });
    if (!raffle) throw new NotFoundException('Raffle not found');
    return raffle;
  }

  async findHostRaffles(hostId: string, query: any = {}) {
    const hostProfile = await this.prisma.hostProfile.findUnique({ where: { userId: hostId } });
    if (!hostProfile) return { data: [], meta: { total: 0, page: 1, lastPage: 1 } };

    const { page = 1, limit = 10, status } = query;
    const skip = (Number(page) - 1) * Number(limit);

    const whereClause: any = { hostId: hostProfile.id };
    
    if (status && status !== 'All') {
      if (status === 'Live') whereClause.status = 'ACTIVE';
      else if (status === 'Pending Review') whereClause.status = 'PENDING_APPROVAL';
      else if (status === 'Ended') whereClause.status = 'ENDED';
      else if (status === 'Drafts') whereClause.status = 'DRAFT';
    }

    const [raffles, total] = await Promise.all([
      this.prisma.raffle.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit)
      }),
      this.prisma.raffle.count({ where: whereClause })
    ]);

    return {
      data: raffles,
      meta: {
        total,
        page: Number(page),
        lastPage: Math.ceil(total / Number(limit)) || 1
      }
    };
  }

  async update(id: string, hostId: string, data: any) {
    const hostProfile = await this.prisma.hostProfile.findUnique({ where: { userId: hostId } });
    if (!hostProfile) throw new BadRequestException('Host profile not found');

    const raffle = await this.prisma.raffle.findFirst({
      where: { id, hostId: hostProfile.id }
    });

    if (!raffle) throw new NotFoundException('Raffle not found');

    return this.prisma.raffle.update({
      where: { id },
      data
    });
  }

  async remove(id: string, hostId: string) {
    const hostProfile = await this.prisma.hostProfile.findUnique({ where: { userId: hostId } });
    if (!hostProfile) throw new BadRequestException('Host profile not found');

    const raffle = await this.prisma.raffle.findFirst({
      where: { id, hostId: hostProfile.id }
    });

    if (!raffle) throw new NotFoundException('Raffle not found');

    return this.prisma.raffle.delete({
      where: { id }
    });
  }

  async approve(id: string) {
    const raffle = await this.prisma.raffle.findUnique({ where: { id } });
    if (!raffle) throw new NotFoundException('Raffle not found');

    return this.prisma.raffle.update({
      where: { id },
      data: { status: 'ACTIVE' }
    });
  }

  async drawWinner(raffleId: string) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Get the raffle and check its status
      const raffle = await tx.raffle.findUnique({
        where: { id: raffleId },
        include: { winners: true, tickets: true }
      });

      if (!raffle) {
        throw new NotFoundException('Raffle not found');
      }

      const hasMainWinner = raffle.winners.some(w => w.winType === 'MAIN_DRAW');
      if (hasMainWinner) {
        throw new BadRequestException('A winner has already been drawn for this competition');
      }

      if (raffle.tickets.length === 0) {
        // If no tickets sold, we just end it without a winner
        await tx.raffle.update({
          where: { id: raffleId },
          data: { status: 'ENDED' }
        });
        return { message: 'Competition ended with no tickets sold' };
      }

      // 2. Select a random ticket
      const randomIndex = Math.floor(Math.random() * raffle.tickets.length);
      const winningTicket = raffle.tickets[randomIndex];

      // 3. Create the Winner record
      const winner = await tx.winner.create({
        data: {
          userId: winningTicket.userId,
          raffleId: raffle.id,
          ticketId: winningTicket.id,
          winType: 'MAIN_DRAW',
          prizeName: raffle.prizeName || raffle.title,
        },
        include: { user: true, ticket: true }
      });

      // 4. Update Raffle status to ENDED
      await tx.raffle.update({
        where: { id: raffleId },
        data: { status: 'ENDED' }
      });

      return winner;
    });
  }

  async getWinners(raffleId: string, hostId?: string) {
    // If hostId is provided, verify ownership, otherwise we might be fetching public winners?
    // Let's assume we fetch all winners for a raffle. The controller can restrict it.
    
    // First, find the raffle
    const raffle = await this.prisma.raffle.findUnique({
      where: { id: raffleId },
      include: {
        instantWins: true,
        winners: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, email: true }
            },
            ticket: true
          }
        }
      }
    });

    if (!raffle) {
      throw new NotFoundException('Raffle not found');
    }

    if (hostId) {
      const hostProfile = await this.prisma.hostProfile.findUnique({ where: { userId: hostId } });
      if (hostProfile?.id !== raffle.hostId) {
        throw new ForbiddenException('You do not have permission to view this.');
      }
    }

    // Since Instant Wins might not have `Winner` records yet (they are created when claimed), 
    // we need to combine the data if needed, or just return the winners array.
    // Wait, earlier we linked instant wins to tickets when purchased. Let's return both.

    // Get tickets that won instant wins
    const instantWinTickets = await this.prisma.ticket.findMany({
      where: {
        raffleId: raffleId,
        ticketNumber: {
          in: raffle.instantWins.map(iw => iw.ticketNumber)
        }
      },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true }
        }
      }
    });

    // Map instant wins with the user who bought that ticket
    const mappedInstantWins = raffle.instantWins.map(iw => {
      const winningTicket = instantWinTickets.find(t => t.ticketNumber === iw.ticketNumber);
      return {
        ...iw,
        winner: winningTicket ? winningTicket.user : null,
        ticket: winningTicket ? winningTicket : null
      };
    });

    return {
      mainDraw: raffle.winners.filter(w => w.winType === 'MAIN_DRAW'),
      instantWins: mappedInstantWins
    };
  }

  async getPendingApprovals() {
    return this.prisma.raffle.findMany({
      where: { status: 'PENDING_APPROVAL' },
      include: { host: { include: { user: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }
}
