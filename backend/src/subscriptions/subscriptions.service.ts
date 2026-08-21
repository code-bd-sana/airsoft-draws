import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
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
          include: { user: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return Promise.all(
      subscriptions.map(async (sub) => {
        const transaction = await this.prisma.transaction.findFirst({
          where: { relatedEntityId: sub.id, type: 'SUBSCRIPTION_FEE' },
          orderBy: { createdAt: 'desc' },
        });
        return { ...sub, transaction };
      }),
    );
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

    if (existingPending) {
      return this.prisma.subscriptionRequest.update({
        where: { id: existingPending.id },
        data: {
          planId,
          requestedDays: requestedDays || plan.durationDays,
          note: note || existingPending.note,
          updatedAt: new Date(),
        },
        include: { plan: true, host: { include: { user: true } } },
      });
    }

    return this.prisma.subscriptionRequest.create({
      data: {
        hostId: host.id,
        planId: plan.id,
        status: 'PENDING',
        requestedDays: requestedDays || plan.durationDays,
        note: note || null,
      },
      include: { plan: true, host: { include: { user: true } } },
    });
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

    return this.prisma.subscriptionRequest.update({
      where: { id: requestId },
      data: {
        status: 'REJECTED',
        adminNotes: adminNotes || 'Rejected by Admin',
        updatedAt: new Date(),
      },
      include: { plan: true, host: { include: { user: true } } },
    });
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
