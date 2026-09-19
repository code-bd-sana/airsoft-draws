import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Optional,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class SubscriptionsService {
  constructor(
    private prisma: PrismaService,
    @Optional()
    private notificationsService?: NotificationsService,
  ) {}

  async getPlans() {
    return this.prisma.subscriptionPlan.findMany({
      orderBy: { price: 'asc' },
    });
  }

  async getMySubscription(hostId: string) {
    const host = await this.prisma.hostProfile.findUnique({
      where: { userId: hostId },
    }); if (!host) return null;

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
    const host = await this.prisma.hostProfile.findUnique({
      where: { userId: hostId },
    });
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

  async getMyBillingHistory(userIdOrHostId: string) {
    const host = await this.prisma.hostProfile.findFirst({
      where: { OR: [{ userId: userIdOrHostId }, { id: userIdOrHostId }] },
      include: {
        subscriptions: {
          include: { plan: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    const targetUserId = host?.userId || userIdOrHostId;

    if (host && host.subscriptions) {
      for (const sub of host.subscriptions) {
        if (Number(sub.plan.price) > 0) {
          const existingTx = await this.prisma.transaction.findFirst({
            where: { relatedEntityId: sub.id, type: 'SUBSCRIPTION_FEE' },
          });
          if (!existingTx) {
            await this.prisma.transaction.create({
              data: {
                userId: targetUserId,
                type: 'SUBSCRIPTION_FEE',
                amount: sub.plan.price,
                status: 'COMPLETED',
                paymentGateway: 'CASHFLOWS',
                gatewayTransactionId: `INV-${sub.id.slice(0, 8).toUpperCase()}`,
                relatedEntityId: sub.id,
                createdAt: sub.createdAt,
              },
            });
          }
        }
      }
    }

    return this.prisma.transaction.findMany({
      where: { userId: targetUserId, type: 'SUBSCRIPTION_FEE' },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllSubscriptions(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) {
    const page = Math.max(1, Number(params?.page) || 1);
    const limit = Math.max(1, Number(params?.limit) || 10);
    const skip = (page - 1) * limit;
    const search = params?.search?.trim();
    const status = params?.status?.trim();

    const where: any = {};

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { host: { businessName: { contains: search, mode: 'insensitive' } } },
        { host: { user: { email: { contains: search, mode: 'insensitive' } } } },
        { host: { user: { firstName: { contains: search, mode: 'insensitive' } } } },
        { host: { user: { lastName: { contains: search, mode: 'insensitive' } } } },
        { plan: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [total, subscriptions] = await Promise.all([
      this.prisma.hostSubscription.count({ where }),
      this.prisma.hostSubscription.findMany({
        where,
        skip,
        take: limit,
        include: {
          plan: true,
          host: {
            include: { user: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const subscriptionsWithTx = await Promise.all(
      subscriptions.map(async (sub) => {
        const transaction = await this.prisma.transaction.findFirst({
          where: { relatedEntityId: sub.id, type: 'SUBSCRIPTION_FEE' },
          orderBy: { createdAt: 'desc' },
        });
        return { ...sub, transaction };
      }),
    );

    const totalPages = Math.ceil(total / limit);

    return {
      subscriptions: subscriptionsWithTx,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async getAdminStats() {
    // Get all active subscriptions
    const activeSubscriptions = await this.prisma.hostSubscription.findMany({
      where: { status: 'ACTIVE' },
      include: { plan: true },
    });

    let mrr = 0;
    const planCounts: Record<string, number> = {};
    const planNames: Record<string, string> = {};

    activeSubscriptions.forEach((sub) => {
      // Calculate MRR (assuming price is per month)
      if (sub.plan && sub.plan.price) {
        mrr += Number(sub.plan.price);
      }

      // Count plans
      const planId = sub.planId;
      if (!planCounts[planId]) {
        planCounts[planId] = 0;
        planNames[planId] = sub.plan?.name || 'Unknown';
      }
      planCounts[planId]++;
    });

    // Format plan distribution for the pie chart
    const totalActive = activeSubscriptions.length;
    const planDistribution = Object.keys(planCounts).map((planId) => {
      const count = planCounts[planId];
      const percentage =
        totalActive > 0 ? Math.round((count / totalActive) * 100) : 0;
      return {
        name: planNames[planId],
        value: count,
        percentage: `${percentage}%`,
      };
    });

    return {
      mrr,
      totalActive,
      planDistribution,
    };
  }

  // --- Manual Subscription Requests & Admin Approval Workflow ---

  async createSubscriptionRequest(
    userId: string,
    planId: string,
    requestedDays?: number,
    note?: string,
  ) {
    const host = await this.prisma.hostProfile.findUnique({
      where: { userId },
    });
    if (!host) throw new BadRequestException('Host profile not found');

    const plan = await this.prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });
    if (!plan) throw new BadRequestException('Subscription plan not found');

    // Check if there is an existing PENDING request for this host
    const existingPending = await this.prisma.subscriptionRequest.findFirst({
      where: { hostId: host.id, status: 'PENDING' },
    });

    const request = existingPending
      ? await this.prisma.subscriptionRequest.update({
          where: { id: existingPending.id },
          data: {
            planId,
            requestedDays: requestedDays || plan.durationDays,
            note: note || existingPending.note,
            updatedAt: new Date(),
          },
          include: { plan: true, host: { include: { user: true } } },
        })
      : await this.prisma.subscriptionRequest.create({
          data: {
            hostId: host.id,
            planId: plan.id,
            status: 'PENDING',
            requestedDays: requestedDays || plan.durationDays,
            note: note || null,
          },
          include: { plan: true, host: { include: { user: true } } },
        });

    if (this.notificationsService) {
      try {
        await this.notificationsService.notifyAdmins({
          type: 'APPROVAL',
          title: 'New Subscription Request',
          subtitle: `${host.businessName || 'A host'} requested the ${plan.name} plan.`,
          link: '/dashboard/admin/subscriptions',
          metadata: {
            hostId: host.id,
            planId: plan.id,
            planName: plan.name,
          },
        });

        await this.notificationsService.createNotification({
          userId,
          type: 'APPROVAL',
          title: 'Subscription Request Submitted',
          subtitle: `Your request for the ${plan.name} plan is pending review.`,
          link: '/dashboard/host/billing',
          metadata: {
            planId: plan.id,
            planName: plan.name,
          },
        });
      } catch (err) {
        console.error('Failed to dispatch subscription request notifications:', err);
      }
    }

    return request;
  }

  async getMySubscriptionRequest(userId: string) {
    const host = await this.prisma.hostProfile.findUnique({
      where: { userId },
    });
    if (!host) return null;

    return this.prisma.subscriptionRequest.findFirst({
      where: { hostId: host.id },
      include: { plan: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllSubscriptionRequestsAdmin() {
    return this.prisma.subscriptionRequest.findMany({
      include: {
        plan: true,
        host: {
          include: { user: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async approveSubscriptionRequest(
    requestId: string,
    approvedDays?: number,
    adminNotes?: string,
  ) {
    const subRequest = await this.prisma.subscriptionRequest.findUnique({
      where: { id: requestId },
      include: { plan: true, host: { include: { user: true } } },
    });

    if (!subRequest) {
      throw new NotFoundException('Subscription request not found');
    }

    const durationDays =
      approvedDays || subRequest.requestedDays || subRequest.plan.durationDays || 30;

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + durationDays);

    // Deactivate previous active subscriptions for host
    await this.prisma.hostSubscription.updateMany({
      where: { hostId: subRequest.hostId, status: 'ACTIVE' },
      data: { status: 'EXPIRED' },
    });

    // Create new ACTIVE host subscription
    const newSub = await this.prisma.hostSubscription.create({
      data: {
        hostId: subRequest.hostId,
        planId: subRequest.planId,
        status: 'ACTIVE',
        startDate,
        endDate,
      },
      include: { plan: true },
    });

    // Create transaction record
    const transactionId = `MANUAL_SUB_${subRequest.id.slice(0, 8)}_${Date.now()}`;
    await this.prisma.transaction.create({
      data: {
        userId: subRequest.host.userId,
        type: 'SUBSCRIPTION_FEE',
        amount: subRequest.plan.price,
        status: 'COMPLETED',
        paymentGateway: 'MANUAL_ADMIN',
        gatewayTransactionId: transactionId,
        relatedEntityId: newSub.id,
      },
    });

    // Mark subscription request as APPROVED
    const updatedRequest = await this.prisma.subscriptionRequest.update({
      where: { id: requestId },
      data: {
        status: 'APPROVED',
        approvedDays: durationDays,
        adminNotes: adminNotes || 'Approved by Admin',
        updatedAt: new Date(),
      },
      include: { plan: true, host: { include: { user: true } } },
    });

    if (this.notificationsService && subRequest.host?.userId) {
      try {
        await this.notificationsService.createNotification({
          userId: subRequest.host.userId,
          type: 'APPROVAL',
          title: 'Subscription Activated',
          subtitle: `Your ${subRequest.plan.name} subscription has been approved and activated for ${durationDays} days!`,
          link: '/dashboard/host/billing',
          metadata: {
            subscriptionId: newSub.id,
            planId: subRequest.planId,
            planName: subRequest.plan.name,
            durationDays,
          },
        });
      } catch (err) {
        console.error('Failed to dispatch subscription approval notification:', err);
      }
    }

    return {
      subscription: newSub,
      request: updatedRequest,
      message: `Subscription approved successfully for ${durationDays} days.`,
    };
  }

  async rejectSubscriptionRequest(requestId: string, adminNotes?: string) {
    const subRequest = await this.prisma.subscriptionRequest.findUnique({
      where: { id: requestId },
    });
    if (!subRequest) throw new NotFoundException('Subscription request not found');

    const updated = await this.prisma.subscriptionRequest.update({
      where: { id: requestId },
      data: {
        status: 'REJECTED',
        adminNotes: adminNotes || 'Rejected by Admin',
        updatedAt: new Date(),
      },
      include: { plan: true, host: { include: { user: true } } },
    });

    if (this.notificationsService && updated.host?.userId) {
      try {
        await this.notificationsService.createNotification({
          userId: updated.host.userId,
          type: 'APPROVAL',
          title: 'Subscription Request Rejected',
          subtitle: adminNotes
            ? `Your subscription request was rejected: ${adminNotes}`
            : 'Your subscription request was not approved.',
          link: '/dashboard/host/billing',
          metadata: {
            requestId,
            reason: adminNotes,
          },
        });
      } catch (err) {
        console.error('Failed to dispatch subscription rejection notification:', err);
      }
    }

    return updated;
  }

  async assignSubscriptionManually(
    hostProfileId: string,
    planId: string,
    durationDays: number = 30,
    adminNotes?: string,
  ) {
    const host = await this.prisma.hostProfile.findUnique({
      where: { id: hostProfileId },
      include: { user: true },
    });
    if (!host) throw new BadRequestException('Host profile not found');

    const plan = await this.prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });
    if (!plan) throw new BadRequestException('Plan not found');

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + durationDays);

    await this.prisma.hostSubscription.updateMany({
      where: { hostId: host.id, status: 'ACTIVE' },
      data: { status: 'EXPIRED' },
    });

    const newSub = await this.prisma.hostSubscription.create({
      data: {
        hostId: host.id,
        planId: plan.id,
        status: 'ACTIVE',
        startDate,
        endDate,
      },
      include: { plan: true },
    });

    const transactionId = `ADMIN_DIRECT_${Date.now()}`;
    await this.prisma.transaction.create({
      data: {
        userId: host.userId,
        type: 'SUBSCRIPTION_FEE',
        amount: plan.price,
        status: 'COMPLETED',
        paymentGateway: 'MANUAL_ADMIN',
        gatewayTransactionId: transactionId,
        relatedEntityId: newSub.id,
      },
    });

    return {
      subscription: newSub,
      message: `Direct subscription assigned successfully for ${durationDays} days.`,
    };
  }
}
