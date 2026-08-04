import {
  Injectable,
  InternalServerErrorException,
  Logger,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';
import { TicketsService } from '../tickets/tickets.service';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => TicketsService))
    private readonly ticketsService: TicketsService,
  ) {}

  private generateHash(requestBodyString: string): string {
    const apiKey = process.env.CASHFLOWS_API_KEY || '';
    const dataToHash = apiKey + requestBodyString;
    return crypto
      .createHash('sha512')
      .update(dataToHash)
      .digest('hex')
      .toUpperCase();
  }

  async createSubscriptionCheckout(hostId: string, planId: string) {
    const plan = await this.prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });
    if (!plan) throw new BadRequestException('Plan not found');

    const host = await this.prisma.hostProfile.findUnique({
      where: { userId: hostId },
      include: { user: true },
    });
    if (!host) throw new BadRequestException('Host profile not found');

    const baseUrl =
      process.env.CASHFLOWS_BASE_URL || 'https://gateway-int.cashflows.com';
    const configId = process.env.CASHFLOWS_CONFIGURATION_ID || '';

    // Test Payment Flow (Enabled if USE_TEST_PAYMENT=true in .env)
    if (process.env.USE_TEST_PAYMENT === 'true') {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + plan.durationDays);

      // Deactivate existing subscriptions
      await this.prisma.hostSubscription.updateMany({
        where: { hostId: host.id, status: 'ACTIVE' },
        data: { status: 'EXPIRED' },
      });

      // Create new active subscription
      const newSub = await this.prisma.hostSubscription.create({
        data: {
          hostId: host.id,
          planId,
          status: 'ACTIVE',
          startDate,
          endDate,
        },
      });

      // Create a test transaction record
      const transactionId = `TEST_SUB_${crypto.randomUUID()}`;
      await this.prisma.transaction.create({
        data: {
          userId: host.user.id,
          type: 'SUBSCRIPTION_FEE',
          amount: plan.price,
          status: 'COMPLETED',
          paymentGateway: 'TEST',
          gatewayTransactionId: transactionId,
          relatedEntityId: newSub.id,
        },
      });

      this.logger.log(
        `Activated TEST subscription for host ${hostId} with plan ${plan.name}`,
      );
      return {
        isTest: true,
        transactionId,
        message: 'Test payment successful',
      };
    }

    // Generate unique order number
    const orderNumber = `SUB_${hostId.slice(0, 8)}_${Date.now()}`;

    // Request payload for Cashflows Hosted Payment Page / Checkout
    const requestPayload = {
      Request: {
        type: 'Payment',
        amountToCollect: plan!.price.toString(),
        currency: 'GBP',
        order: {
          orderNumber: orderNumber,
        },
        recurring: true, // Mark as recurring for subscriptions
        customer: {
          email: host!.user.email,
          firstName: host!.user.firstName || '',
          lastName: host!.user.lastName || '',
        },
        returnUrl: `${process.env.FRONTEND_URL}/dashboard/host/billing?status=success`,
        cancelUrl: `${process.env.FRONTEND_URL}/dashboard/host/billing?status=cancel`,
      },
    };

    const apiKey = process.env.CASHFLOWS_API_KEY || '';

    const innerRequestPayload = {
      type: 'Payment',
      amountToCollect: Number(plan.price).toFixed(2),
      currency: 'GBP',
      order: {
        orderNumber: orderNumber,
      },
      recurring: true,
      customer: {
        email: host.user.email,
        firstName: host.user.firstName || '',
        lastName: host.user.lastName || '',
      },
      returnUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard/host/billing?status=success`,
      cancelUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard/host/billing?status=cancel`,
    };

    const innerRequestString = JSON.stringify(innerRequestPayload);
    const hash = crypto
      .createHash('sha512')
      .update(apiKey + innerRequestString)
      .digest('hex')
      .toUpperCase();

    const fullPayload = {
      ConfigurationId: configId,
      Hash: hash,
      Request: innerRequestPayload,
    };

    try {
      this.logger.log(`Initiating Cashflows subscription checkout to ${baseUrl}/api/gateway/payment-jobs`);
      const response = await fetch(`${baseUrl}/api/gateway/payment-jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ConfigurationId: configId,
          Hash: hash,
        },
        body: innerRequestString,
      });

      const responseText = await response.text();
      let data: any = {};
      try {
        data = JSON.parse(responseText);
      } catch {
        data = { rawText: responseText };
      }

      if (!response.ok) {
        this.logger.error('Cashflows Subscription API error', data);
        throw new BadRequestException(
          data.message || data.error || `Cashflows API error (${response.status})`,
        );
      }

      this.logger.log(`CASHFLOWS SUCCESS RESPONSE DATA: ${JSON.stringify(data, null, 2)}`);

      let redirectUrl =
        data.links?.action?.url ||
        (typeof data.links?.action === 'string' ? data.links.action : null) ||
        data.redirectUrl ||
        data.paymentUrl ||
        data.url ||
        data.hostedPaymentPageUrl ||
        data.checkoutUrl ||
        data.href ||
        data.link;

      if (!redirectUrl && Array.isArray(data.actions)) {
        const checkoutAction = data.actions.find(
          (a: any) => a.rel === 'checkout' || a.rel === 'payment' || a.rel === 'redirect' || a.rel === 'hosted_checkout',
        );
        if (checkoutAction) redirectUrl = checkoutAction.href || checkoutAction.url;
      }

      if (!redirectUrl && data.data?.reference) {
        redirectUrl = `${baseUrl}/payment?ref=${data.data.reference}`;
      }

      if (!redirectUrl) {
        this.logger.error('Cashflows API response payload:', JSON.stringify(data, null, 2));
        throw new BadRequestException(`Cashflows gateway response: ${JSON.stringify(data)}`);
      }

      return { url: redirectUrl };
    } catch (error: any) {
      this.logger.error(`Cashflow API error: ${error.message}`);
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(
        `Cashflows Payment Gateway Error: ${error.message}`,
      );
    }
  }

  async handleWebhook(signature: string, payload: any) {
    this.logger.log(`Received Cashflow webhook signature: ${signature}`);
    
    let parsedPayload = payload;
    let payloadString = '';

    if (Buffer.isBuffer(payload)) {
      payloadString = payload.toString('utf8');
      try {
        parsedPayload = JSON.parse(payloadString);
      } catch {
        parsedPayload = { raw: payloadString };
      }
    } else if (typeof payload === 'string') {
      payloadString = payload;
      try {
        parsedPayload = JSON.parse(payload);
      } catch {
        parsedPayload = { raw: payload };
      }
    } else {
      parsedPayload = payload || {};
      payloadString = JSON.stringify(payload);
    }

    console.log('=====================================================');
    console.log('CASHFLOWS INCOMING WEBHOOK NOTIFICATION DATA:');
    console.log(JSON.stringify(parsedPayload, null, 2));
    console.log('=====================================================');

    try {
      const data = parsedPayload.data || parsedPayload;
      const orderNumber = data.order?.orderNumber || data.orderNumber;
      const status = (data.paymentStatus || data.status || parsedPayload.event || '').toString().toUpperCase();

      this.logger.log(`Webhook Event Status: ${status}, OrderNumber: ${orderNumber}`);

      // Handle Ticket Purchase Order (orderNumber format: TCK_raffleId_userId_quantity_timestamp)
      if (orderNumber && orderNumber.startsWith('TCK_')) {
        const parts = orderNumber.split('_');
        const raffleId = parts[1];
        const userId = parts[2];
        const quantity = parseInt(parts[3] || '1', 10);

        if (raffleId && userId && quantity > 0) {
          this.logger.log(`Allocating ${quantity} tickets for user ${userId} in raffle ${raffleId} via webhook...`);
          
          // Use USE_TEST_PAYMENT="true" mode inside purchaseTickets by temporarily bypassing flag
          const currentFlag = process.env.USE_TEST_PAYMENT;
          process.env.USE_TEST_PAYMENT = 'true';
          try {
            const ticketResult: any = await this.ticketsService.purchaseTickets(userId, raffleId, quantity);
            this.logger.log(`Successfully allocated tickets via webhook: ${JSON.stringify(ticketResult?.tickets?.map((t: any) => t.ticketNumber))}`);
          } finally {
            process.env.USE_TEST_PAYMENT = currentFlag;
          }
        }
      }

      // Handle Host Subscription Order (orderNumber format: SUB_hostId_timestamp or data.hostId)
      if (
        status.includes('COMPLETED') ||
        status.includes('PAID') ||
        status.includes('CAPTURED') ||
        status.includes('SUCCESS')
      ) {
        const hostId = data.hostId || (orderNumber && orderNumber.startsWith('SUB_') ? orderNumber.split('_')[1] : null);
        const planId = data.planId;

        if (hostId && planId) {
          const plan = await this.prisma.subscriptionPlan.findUnique({
            where: { id: planId },
          });
          const host = await this.prisma.hostProfile.findUnique({
            where: { userId: hostId },
          });

          if (plan && host) {
            const startDate = new Date();
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + plan.durationDays);

            await this.prisma.hostSubscription.updateMany({
              where: { hostId: host.id, status: 'ACTIVE' },
              data: { status: 'EXPIRED' },
            });

            await this.prisma.hostSubscription.create({
              data: {
                hostId: host.id,
                planId,
                status: 'ACTIVE',
                startDate,
                endDate,
              },
            });

            this.logger.log(
              `Activated subscription for host ${hostId} with plan ${plan.name} via webhook`,
            );
          }
        }
      }

      return { success: true, message: 'Webhook notification processed successfully' };
    } catch (err: any) {
      this.logger.error(`Cashflow webhook error: ${err.message}`);
      return { success: false, error: err.message };
    }
  }
}
