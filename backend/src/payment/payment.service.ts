import { Injectable, InternalServerErrorException, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(private readonly prisma: PrismaService) {}

  private generateHash(requestBodyString: string): string {
    const apiKey = process.env.CASHFLOWS_API_KEY || '';
    const dataToHash = apiKey + requestBodyString;
    return crypto.createHash('sha512').update(dataToHash).digest('hex').toUpperCase();
  }

  async createSubscriptionCheckout(hostId: string, planId: string) {
    const plan = await this.prisma.subscriptionPlan.findUnique({ where: { id: planId } });
    if (!plan) throw new BadRequestException('Plan not found');

    const host = await this.prisma.hostProfile.findUnique({
      where: { userId: hostId },
      include: { user: true },
    });
    if (!host) throw new BadRequestException('Host profile not found');

    const baseUrl = process.env.CASHFLOWS_BASE_URL || 'https://gateway-int.cashflows.com';
    const configId = process.env.CASHFLOWS_CONFIGURATION_ID || '';

    // Test Payment Flow
    if (process.env.USE_TEST_PAYMENT === 'true') {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + plan.durationDays);

      // Deactivate existing subscriptions
      await this.prisma.hostSubscription.updateMany({
        where: { hostId: host.id, status: 'ACTIVE' },
        data: { status: 'EXPIRED' }
      });

      // Create new active subscription
      const newSub = await this.prisma.hostSubscription.create({
        data: {
          hostId: host.id,
          planId,
          status: 'ACTIVE',
          startDate,
          endDate,
        }
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
        }
      });

      this.logger.log(`Activated TEST subscription for host ${hostId} with plan ${plan.name}`);
      return { 
        isTest: true, 
        transactionId, 
        message: 'Test payment successful' 
      };
    }

    
    // Generate unique order number
    const orderNumber = `SUB_${hostId.slice(0,8)}_${Date.now()}`;

    // Request payload for Cashflows Hosted Payment Page / Checkout
    const requestPayload = {
      Request: {
        type: "Payment",
        amountToCollect: plan.price.toString(),
        currency: "GBP",
        order: {
          orderNumber: orderNumber,
        },
        recurring: true, // Mark as recurring for subscriptions
        customer: {
           email: host.user.email,
           firstName: host.user.firstName || '',
           lastName: host.user.lastName || '',
        },
        returnUrl: `${process.env.FRONTEND_URL}/dashboard/host/billing?status=success`,
        cancelUrl: `${process.env.FRONTEND_URL}/dashboard/host/billing?status=cancel`
      }
    };

    const requestString = JSON.stringify(requestPayload);
    const hash = this.generateHash(requestString);

    try {
      /*
      // Real Implementation Example:
      const response = await fetch(`${baseUrl}/api/gateway/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ConfigurationId': configId,
          'Hash': hash,
          'RequestOrigin': 'API'
        },
        body: requestString
      });
      
      const data = await response.json();
      if (!response.ok) {
         this.logger.error('Cashflows API error', data);
         throw new BadRequestException('Failed to generate checkout session');
      }
      return { url: data.redirectUrl || data.paymentUrl };
      */
     
      // Simulating URL returned by Cashflows API
      const sessionId = `cf_sess_${Math.random().toString(36).substr(2, 9)}`;
      return {
        id: sessionId,
        url: `${baseUrl}/pay/${sessionId}?planId=${planId}&hostId=${hostId}`
      };
    } catch (error: any) {
       this.logger.error(`Cashflow API error: ${error.message}`);
       throw new InternalServerErrorException('Error creating subscription checkout');
    }
  }

  async handleWebhook(signature: string, payload: any) {
    this.logger.log(`Received Cashflow webhook signature: ${signature}`);
    const secret = process.env.CASHFLOWS_WEBHOOK_SECRET || '';
    
    let parsedPayload = payload;
    let payloadString = '';
    
    if (Buffer.isBuffer(payload)) {
       payloadString = payload.toString('utf8');
       parsedPayload = JSON.parse(payloadString);
    } else {
       payloadString = JSON.stringify(payload);
    }

    // Verify webhook signature (HMAC SHA512)
    const expectedSignature = crypto.createHmac('sha512', secret).update(payloadString).digest('hex').toUpperCase();
    
    // if (signature !== expectedSignature) {
    //   this.logger.warn('Invalid Cashflows webhook signature');
    //   // throw new BadRequestException('Invalid signature');
    // }

    try {
      // Handle the payment success event
      if (parsedPayload.event === 'payment.success' || parsedPayload.event === 'PaymentCaptured') {
        const data = parsedPayload.data || parsedPayload.metadata || parsedPayload;
        const hostId = data.hostId;
        const planId = data.planId;
        
        if (hostId && planId) {
          const plan = await this.prisma.subscriptionPlan.findUnique({ where: { id: planId } });
          if (!plan) throw new BadRequestException('Plan not found');

          const host = await this.prisma.hostProfile.findUnique({ where: { userId: hostId } });
          if (!host) throw new BadRequestException('Host profile not found');

          const startDate = new Date();
          const endDate = new Date();
          endDate.setDate(endDate.getDate() + plan.durationDays);

          // Deactivate existing subscriptions
          await this.prisma.hostSubscription.updateMany({
            where: { hostId: host.id, status: 'ACTIVE' },
            data: { status: 'EXPIRED' }
          });

          // Create new active subscription
          await this.prisma.hostSubscription.create({
            data: {
              hostId: host.id,
              planId,
              status: 'ACTIVE',
              startDate,
              endDate,
            }
          });

          this.logger.log(`Activated subscription for host ${hostId} with plan ${plan.name}`);
        }
      }
      return { received: true };
    } catch (err: any) {
      this.logger.error(`Cashflow webhook error: ${err.message}`);
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }
  }
}
