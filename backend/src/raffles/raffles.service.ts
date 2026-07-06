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
    // Basic implementation for public raffles (active only)
    const { search, page = 1, limit = 12 } = query;
    const skip = (Number(page) - 1) * Number(limit);

    const now = new Date();
    const whereClause: any = { 
      status: 'ACTIVE',
      startDate: { lte: now },
      endDate: { gte: now }
    };
    
    if (search) {
      whereClause.title = { contains: search, mode: 'insensitive' };
    }

    const [raffles, total] = await Promise.all([
      this.prisma.raffle.findMany({
        where: whereClause,
        include: { host: { include: { user: true } } },
        skip,
        take: Number(limit),
        orderBy: { endDate: 'asc' },
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

  async findHostRaffles(hostId: string) {
    const hostProfile = await this.prisma.hostProfile.findUnique({ where: { userId: hostId } });
    if (!hostProfile) return [];

    return this.prisma.raffle.findMany({
      where: { hostId: hostProfile.id },
      orderBy: { createdAt: 'desc' }
    });
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

  async getPendingApprovals() {
    return this.prisma.raffle.findMany({
      where: { status: 'PENDING_APPROVAL' },
      include: { host: { include: { user: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }
}
