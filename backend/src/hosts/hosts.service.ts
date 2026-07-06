import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HostsService {
  constructor(private prisma: PrismaService) {}

  async findAllVerifiedPublic() {
    const hosts = await this.prisma.hostProfile.findMany({
      where: {
        isVerified: true,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        _count: {
          select: {
            raffles: {
              where: {
                status: 'ACTIVE',
              },
            },
          },
        },
      },
    });

    return hosts.map((host) => ({
      id: host.id,
      slug: host.slug || host.id,
      name: host.businessName,
      logo: host.user.avatarUrl,
      description: null, // Host description can be added later
      category: null,
      competitionCount: host._count.raffles,
      averageRating: 5.0, // Mocked for now
      totalReviews: 12, // Mocked for now
      isVerified: host.isVerified,
    }));
  }

  async findOnePublic(slug: string) {
    const host = await this.prisma.hostProfile.findFirst({
      where: {
        OR: [
          { slug },
          { id: slug },
        ],
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        raffles: {
          where: {
            status: {
              in: ['ACTIVE', 'ENDED'],
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            instantWins: true,
          },
        },
        _count: {
          select: {
            raffles: {
              where: {
                status: 'ACTIVE',
              },
            },
          },
        },
      },
    });

    if (!host) {
      throw new NotFoundException('Host not found');
    }

    return {
      id: host.id,
      slug: host.slug || host.id,
      name: host.businessName,
      logo: host.user.avatarUrl,
      bio: null,
      isVerified: host.isVerified,
      drawsHosted: host._count.raffles,
      rating: 5.0, // Mocked
      memberSince: host.createdAt.getFullYear(),
      raffles: host.raffles.map(raffle => {
        // Format endDate as "Ends in Xd Yh" or a clean date string
        const end = new Date(raffle.endDate);
        const formattedEndDate = end.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        
        return {
          id: raffle.id,
          slug: raffle.slug || raffle.id,
          title: raffle.title,
          description: raffle.description,
          image: raffle.mainImage || '/images/default-raffle.png',
          ticketPrice: raffle.pricePerTicket ? Number(raffle.pricePerTicket.toString()) : 0,
          totalTickets: raffle.totalTickets,
          soldTickets: raffle.ticketsSold,
          endDate: `Ends ${formattedEndDate}`,
          status: raffle.status, // ACTIVE, ENDED, etc.
          category: 'airsoft', // Default or add to schema later
          isInstantWin: raffle.instantWins?.length > 0,
          instantWinsCount: raffle.instantWins?.length || 0,
        };
      }),
    };
  }
}
