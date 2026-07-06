import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  async getPlans() {
    return this.prisma.subscriptionPlan.findMany({
      orderBy: { price: 'asc' },
    });
  }

  async getMySubscription(hostId: string) {
    const host = await this.prisma.hostProfile.findUnique({ where: { userId: hostId } });
    if (!host) return null;

    const sub = await this.prisma.hostSubscription.findFirst({
      where: { hostId: host.id },
      include: { plan: true },
      orderBy: { createdAt: 'desc' },
    });
    
    if (!sub) return null;

    const transaction = await this.prisma.transaction.findFirst({
      where: { relatedEntityId: sub.id, type: 'SUBSCRIPTION_FEE' },
      orderBy: { createdAt: 'desc' },
    });

    return { ...sub, transaction };
  }

  async cancelSubscription(hostId: string) {
    const host = await this.prisma.hostProfile.findUnique({ where: { userId: hostId } });
    if (!host) throw new BadRequestException('Host profile not found');

    const activeSub = await this.prisma.hostSubscription.findFirst({
      where: { hostId: host.id, status: 'ACTIVE' },
    });

    if (!activeSub) {
      throw new BadRequestException('No active subscription found to cancel');
    }

    return this.prisma.hostSubscription.update({
      where: { id: activeSub.id },
      data: { status: 'CANCELLED' },
    });
  }

  async getMyBillingHistory(hostId: string) {
    return this.prisma.transaction.findMany({
      where: { userId: hostId, type: 'SUBSCRIPTION_FEE' },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllSubscriptions() {
    const subscriptions = await this.prisma.hostSubscription.findMany({
      include: {
        plan: true,
        host: {
          include: { user: true }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    return Promise.all(subscriptions.map(async (sub) => {
      const transaction = await this.prisma.transaction.findFirst({
        where: { relatedEntityId: sub.id, type: 'SUBSCRIPTION_FEE' },
        orderBy: { createdAt: 'desc' },
      });
      return { ...sub, transaction };
    }));
  }
}
