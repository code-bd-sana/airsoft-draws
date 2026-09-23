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

export const CASHFLOWS_SUCCESS_STATUSES = [
  'PAID',
  'SETTLED',
  'AUTHORISED',
  'AUTHORIZED',
  'COMPLETED',
  'SUCCESS',
  'ACCEPTED',
];

export const CASHFLOWS_FAILED_STATUSES = [
  'CANCELLED',
  'CANCELED',
  'FAILED',
  'DECLINED',
  'REJECTED',
  'EXPIRED',
  'ABANDONED',
];

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
      process.env.CASHFLOWS_BASE_URL || 'https://gateway.cashflows.com';
    const configId = process.env.CASHFLOWS_CONFIGURATION_ID || '';

    // Free Tier Payment Flow (Always activate immediately without payment gateway)
    if (Number(plan.price) === 0) {
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
          planId: plan.id,
          status: 'ACTIVE',
          startDate,
          endDate,
        },
      });

      // Create a transaction record for Free tier
      const transactionId = `FREE_SUB_${crypto.randomUUID()}`;
      await this.prisma.transaction.create({
        data: {
          userId: host.user.id,
          type: 'SUBSCRIPTION_FEE',
          amount: 0,
          status: 'COMPLETED',
          paymentGateway: 'FREE',
          gatewayTransactionId: transactionId,
          relatedEntityId: newSub.id,
        },
      });

      this.logger.log(
        `Activated Free Tier subscription for host ${hostId} with plan ${plan.name}`,
      );
      return {
        isTest: true,
        isFree: true,
        transactionId,
        message: 'Free Tier subscription activated successfully!',
      };
    }

    // Manual Request Mode Check
    if (process.env.ENABLE_AUTOMATIC_PAYMENT === 'false') {
      return {
        isManualMode: true,
        message: 'Automated payment is currently disabled. Manual subscription request workflow active.',
      };
    }

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

    // Generate unique order number (max 35 chars for Cashflows API)
    const orderNumber = `SUB_${hostId.slice(0, 8)}_${planId.slice(0, 8)}_${Date.now()}`;

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
        returnUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/success?type=subscription&ordernumber=${orderNumber}`,
        cancelUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/cancel?type=subscription&ordernumber=${orderNumber}`,
      },
    };

    const apiKey = process.env.CASHFLOWS_API_KEY || '';

    const innerRequestPayload = {
      type: 'Payment',
      amountToCollect: Number(plan.price).toFixed(2),
      currency: 'GBP',
      order: {
        orderNumber: orderNumber,
        note: `Subscription Plan: ${plan.name}`,
      },
      customer: {
        email: host.user.email,
        firstName: host.user.firstName || 'Valued',
        lastName: host.user.lastName || 'Customer',
      },
      returnUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/success?type=subscription&ordernumber=${orderNumber}`,
      cancelUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/cancel?type=subscription&ordernumber=${orderNumber}`,
    };

    const innerRequestString = JSON.stringify(innerRequestPayload);
    const hash = crypto
      .createHash('sha512')
      .update(apiKey + innerRequestString)
      .digest('hex')
      .toUpperCase();

    try {
      console.log('=====================================================');
      console.log('CASHFLOWS SUBSCRIPTION CHECKOUT REQUEST:');
      console.log('URL:', `${baseUrl}/api/gateway/payment-jobs`);
      console.log('ConfigurationId:', configId);
      console.log('Hash:', hash);
      console.log('Body Payload:', innerRequestString);
      console.log('=====================================================');

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
      console.log('=====================================================');
      console.log(`CASHFLOWS SUBSCRIPTION RESPONSE (Status: ${response.status}):`);
      console.log(responseText);
      console.log('=====================================================');

      let data: any = {};
      try {
        data = JSON.parse(responseText);
      } catch {
        data = { rawText: responseText };
      }

      if (!response.ok) {
        this.logger.error(`Cashflows Subscription API error (${response.status}): ${responseText}`, data);
        throw new BadRequestException(
          data.message || data.error || `Cashflows API error (${response.status}): ${responseText || 'Empty response'}`,
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
      let orderNumber = data.order?.orderNumber || data.orderNumber;
      let status = (data.paymentStatus || data.status || parsedPayload.event || '').toString().toUpperCase();

      const paymentJobRef =
        parsedPayload.paymentJobReference ||
        parsedPayload.paymentjobreference ||
        parsedPayload.paymentJobRef ||
        parsedPayload.paymentjobref ||
        parsedPayload.paymentReference ||
        parsedPayload.paymentref ||
        data.paymentJobReference ||
        data.paymentjobreference ||
        data.paymentJobRef ||
        data.paymentjobref ||
        data.reference ||
        parsedPayload.reference;

      // If webhook carries a paymentJobReference, fetch the full payment job details from Cashflows API
      if (paymentJobRef) {
        this.logger.log(`Fetching Cashflows payment-job details for reference: ${paymentJobRef}`);
        const apiKey = process.env.CASHFLOWS_API_KEY || '';
        const configId = process.env.CASHFLOWS_CONFIGURATION_ID || '';
        const baseUrl = process.env.CASHFLOWS_BASE_URL || 'https://gateway.cashflows.com';

        const getHash = crypto
          .createHash('sha512')
          .update(apiKey)
          .digest('hex')
          .toUpperCase();

        try {
          const jobResponse = await fetch(`${baseUrl}/api/gateway/payment-jobs/${paymentJobRef}`, {
            method: 'GET',
            headers: {
              ConfigurationId: configId,
              Hash: getHash,
              'Content-Type': 'application/json',
            },
          });

          const jobData = await jobResponse.json();
          console.log('=====================================================');
          console.log('CASHFLOWS FETCHED PAYMENT JOB DETAILS:');
          console.log(JSON.stringify(jobData, null, 2));
          console.log('=====================================================');

          const fetchedOrder = jobData.data?.order || jobData.order;
          if (fetchedOrder?.orderNumber) {
            orderNumber = fetchedOrder.orderNumber;
          }
          const fetchedStatus = jobData.data?.paymentStatus || jobData.paymentStatus || jobData.status;
          if (fetchedStatus) {
            status = fetchedStatus.toString().toUpperCase();
          }
        } catch (fetchErr: any) {
          this.logger.error(`Failed to fetch payment job details for ${paymentJobRef}: ${fetchErr.message}`);
        }
      }

      this.logger.log(`Webhook Processing - Event Status: "${status}", OrderNumber: "${orderNumber}"`);

      const isSuccess = CASHFLOWS_SUCCESS_STATUSES.includes(status);
      const isFailedOrCancelled = CASHFLOWS_FAILED_STATUSES.includes(status);

      // Handle Ticket Purchase Order (orderNumber format: TCK_raffleIdPrefix_userIdPrefix_quantity_timestamp)
      if (orderNumber && orderNumber.startsWith('TCK_')) {
        if (!isSuccess) {
          this.logger.log(
            `Skipping TCK ticket allocation for order "${orderNumber}": payment status is "${status}" (not paid/settled).`,
          );
        } else {
          const parts = orderNumber.split('_');
          const rafflePrefix = parts[1];
          const userPrefix = parts[2];
          const quantity = parseInt(parts[3] || '1', 10);

          if (rafflePrefix && userPrefix && quantity > 0) {
            const raffle = await this.prisma.raffle.findFirst({
              where: { id: { startsWith: rafflePrefix } },
            });
            const user = await this.prisma.user.findFirst({
              where: { id: { startsWith: userPrefix } },
            });

            if (raffle && user) {
              this.logger.log(`Allocating ${quantity} tickets for user ${user.id} in raffle ${raffle.id} via webhook...`);
              try {
                const ticketResult: any = await this.ticketsService.allocateTicketsInDatabase(user.id, raffle.id, quantity);
                this.logger.log(`Successfully allocated ${quantity} ticket(s) via webhook: ${JSON.stringify(ticketResult?.tickets?.map((t: any) => t.ticketNumber))}`);
              } catch (tckErr: any) {
                this.logger.warn(`Webhook ticket allocation notice: ${tckErr.message}`);
              }
            }
          }
        }
      }

      // Handle Host Subscription Order (orderNumber format: SUB_hostIdPrefix_planIdPrefix_timestamp)
      if (orderNumber && orderNumber.startsWith('SUB_')) {
        if (!isSuccess) {
          this.logger.log(
            `Skipping SUB subscription activation for order "${orderNumber}": payment status is "${status}" (not paid/settled).`,
          );
        } else {
          const parts = orderNumber.split('_');
          const hostPrefix = parts[1];
          const planPrefix = parts[2];

          if (hostPrefix && planPrefix) {
            const plan = await this.prisma.subscriptionPlan.findFirst({
              where: { id: { startsWith: planPrefix } },
            });
            const host = await this.prisma.hostProfile.findFirst({
              where: { OR: [{ id: { startsWith: hostPrefix } }, { userId: { startsWith: hostPrefix } }] },
            });

            if (plan && host) {
              const startDate = new Date();
              const endDate = new Date();
              endDate.setDate(endDate.getDate() + plan.durationDays);

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
              });

              await this.prisma.transaction.create({
                data: {
                  userId: host.userId,
                  type: 'SUBSCRIPTION_FEE',
                  amount: plan.price,
                  status: 'COMPLETED',
                  paymentGateway: 'CASHFLOWS',
                  gatewayTransactionId: data?.reference || `CASHFLOWS_${newSub.id.slice(0, 8)}`,
                  relatedEntityId: newSub.id,
                },
              });

              this.logger.log(
                `Activated subscription for host ${host.id} with plan ${plan.name} via webhook`,
              );
            }
          }
        }
      }

      // Handle Multi-Item Basket Order (orderNumber format: BSK_transactionId_timestamp)
      if (orderNumber && orderNumber.startsWith('BSK_')) {
        const parts = orderNumber.split('_');
        const transactionId = parts[1];

        if (transactionId) {
          const pendingTx = await this.prisma.transaction.findUnique({
            where: { id: transactionId },
          });

          if (pendingTx) {
            if (isSuccess && pendingTx.status !== 'COMPLETED') {
              this.logger.log(
                `Processing verified paid BSK basket order for transaction ${transactionId} via webhook (status: "${status}")...`,
              );

              await this.prisma.transaction.update({
                where: { id: transactionId },
                data: {
                  status: 'COMPLETED',
                  gatewayTransactionId: paymentJobRef || orderNumber,
                },
              });

              if (
                pendingTx.relatedEntityId &&
                pendingTx.relatedEntityId.startsWith('BSK_ITEMS:')
              ) {
                const rawItems = pendingTx.relatedEntityId
                  .replace('BSK_ITEMS:', '')
                  .split(',');
                for (const rawItem of rawItems) {
                  const [rId, qtyStr] = rawItem.split(':');
                  const qty = parseInt(qtyStr || '1', 10);
                  if (rId && qty > 0) {
                    try {
                      await this.ticketsService.allocateTicketsInDatabase(
                        pendingTx.userId,
                        rId,
                        qty,
                        pendingTx.id,
                      );
                      this.logger.log(
                        `Allocated ${qty} ticket(s) in raffle ${rId} for user ${pendingTx.userId} via webhook`,
                      );
                    } catch (itemErr: any) {
                      this.logger.warn(
                        `Basket item allocation notice (${rId}): ${itemErr.message}`,
                      );
                    }
                  }
                }
              }
            } else if (isFailedOrCancelled && pendingTx.status === 'PENDING') {
              this.logger.log(
                `Marking transaction ${transactionId} as CANCELLED via webhook (gateway status: "${status}"). User can retry later from dashboard. No tickets allocated.`,
              );
              await this.prisma.transaction.update({
                where: { id: transactionId },
                data: {
                  status: 'CANCELLED',
                  gatewayTransactionId: paymentJobRef || orderNumber,
                },
              });
            } else {
              this.logger.log(
                `BSK webhook event with status "${status}" received for tx ${transactionId} (current status: ${pendingTx.status}). Tickets are NOT allocated until payment is completed.`,
              );
            }
          }
        }
      }

      return { success: true, message: 'Webhook notification processed successfully' };
    } catch (err: any) {
      this.logger.error(`Cashflow webhook error: ${err.message}`);
      return { success: false, error: err.message };
    }
  }

  async confirmPaymentReturn(params: {
    paymentJobRef?: string;
    paymentjobref?: string;
    orderNumber?: string;
    ordernumber?: string;
    ref?: string;
    reference?: string;
  }) {
    let orderNumber = params.orderNumber || params.ordernumber;
    const paymentJobRef =
      params.paymentJobRef ||
      params.paymentjobref ||
      params.ref ||
      params.reference;
    let fetchedStatus = '';

    this.logger.log(
      `confirmPaymentReturn called with paymentJobRef: "${paymentJobRef}", orderNumber: "${orderNumber}"`,
    );

    if (paymentJobRef) {
      const apiKey = process.env.CASHFLOWS_API_KEY || '';
      const configId = process.env.CASHFLOWS_CONFIGURATION_ID || '';
      const baseUrl =
        process.env.CASHFLOWS_BASE_URL || 'https://gateway.cashflows.com';
      const getHash = crypto
        .createHash('sha512')
        .update(apiKey)
        .digest('hex')
        .toUpperCase();

      try {
        const jobResponse = await fetch(
          `${baseUrl}/api/gateway/payment-jobs/${paymentJobRef}`,
          {
            method: 'GET',
            headers: {
              ConfigurationId: configId,
              Hash: getHash,
              'Content-Type': 'application/json',
            },
          },
        );
        const jobData = await jobResponse.json();
        const fetchedOrder = jobData.data?.order || jobData.order;
        if (!orderNumber && fetchedOrder?.orderNumber) {
          orderNumber = fetchedOrder.orderNumber;
        }
        const s =
          jobData.data?.paymentStatus ||
          jobData.paymentStatus ||
          jobData.status;
        if (s) {
          fetchedStatus = s.toString().toUpperCase();
        }
        this.logger.log(
          `confirmPaymentReturn fetched Cashflows status: "${fetchedStatus}" for jobRef "${paymentJobRef}"`,
        );
      } catch (err: any) {
        this.logger.error(
          `Failed to fetch job ref ${paymentJobRef} in confirmation: ${err.message}`,
        );
      }
    }

    if (!orderNumber) {
      throw new BadRequestException(
        'Order number or payment job reference is required',
      );
    }

    const isLiveMode = process.env.USE_TEST_PAYMENT === 'false';
    const isVerifiedPaid = CASHFLOWS_SUCCESS_STATUSES.includes(fetchedStatus);
    const isFailedOrCancelled =
      CASHFLOWS_FAILED_STATUSES.includes(fetchedStatus);

    // Process Ticket Purchase Order (Legacy TCK_)
    if (orderNumber.startsWith('TCK_')) {
      if (isLiveMode && paymentJobRef && !isVerifiedPaid) {
        this.logger.warn(
          `confirmPaymentReturn: TCK order ${orderNumber} payment not verified (status: "${fetchedStatus}"). Skipping allocation.`,
        );
        if (isFailedOrCancelled) {
          return {
            success: false,
            status: 'CANCELLED',
            type: 'TICKET_PURCHASE',
            message: `Payment was ${fetchedStatus.toLowerCase()}. No tickets were allocated.`,
          };
        }
        return {
          success: false,
          pending: true,
          type: 'TICKET_PURCHASE',
          message: 'Payment verification is awaiting gateway confirmation',
        };
      }

      const parts = orderNumber.split('_');
      const rafflePrefix = parts[1];
      const userPrefix = parts[2];
      const quantity = parseInt(parts[3] || '1', 10);

      if (rafflePrefix && userPrefix && quantity > 0) {
        const raffle = await this.prisma.raffle.findFirst({
          where: { id: { startsWith: rafflePrefix } },
        });
        const user = await this.prisma.user.findFirst({
          where: { id: { startsWith: userPrefix } },
        });

        if (raffle && user) {
          try {
            const result: any =
              await this.ticketsService.allocateTicketsInDatabase(
                user.id,
                raffle.id,
                quantity,
              );
            this.logger.log(
              `Confirmed & allocated ${quantity} tickets for user ${user.id} in raffle ${raffle.id}`,
            );
            return {
              success: true,
              type: 'TICKET_PURCHASE',
              ...result,
            };
          } catch (err: any) {
            this.logger.warn(`Ticket confirmation notice: ${err.message}`);
            return {
              success: true,
              type: 'TICKET_PURCHASE',
              message: err.message || 'Tickets confirmed',
            };
          }
        }
      }
    }

    // Process Host Subscription Order
    if (orderNumber.startsWith('SUB_')) {
      if (isLiveMode && paymentJobRef && !isVerifiedPaid) {
        this.logger.warn(
          `confirmPaymentReturn: SUB order ${orderNumber} payment not verified (status: "${fetchedStatus}"). Skipping subscription activation.`,
        );
        if (isFailedOrCancelled) {
          return {
            success: false,
            status: 'CANCELLED',
            type: 'SUBSCRIPTION',
            message: `Subscription payment was ${fetchedStatus.toLowerCase()}. Subscription was not activated.`,
          };
        }
        return {
          success: false,
          pending: true,
          type: 'SUBSCRIPTION',
          message: 'Subscription payment is awaiting gateway confirmation',
        };
      }

      const parts = orderNumber.split('_');
      const hostPrefix = parts[1];
      const planPrefix = parts[2];

      if (hostPrefix && planPrefix) {
        const plan = await this.prisma.subscriptionPlan.findFirst({
          where: { id: { startsWith: planPrefix } },
        });
        const host = await this.prisma.hostProfile.findFirst({
          where: {
            OR: [
              { id: { startsWith: hostPrefix } },
              { userId: { startsWith: hostPrefix } },
            ],
          },
        });

        if (plan && host) {
          const startDate = new Date();
          const endDate = new Date();
          endDate.setDate(endDate.getDate() + plan.durationDays);

          await this.prisma.hostSubscription.updateMany({
            where: { hostId: host.id, status: 'ACTIVE' },
            data: { status: 'EXPIRED' },
          });

          const sub = await this.prisma.hostSubscription.create({
            data: {
              hostId: host.id,
              planId: plan.id,
              status: 'ACTIVE',
              startDate,
              endDate,
            },
          });

          const existingTx = await this.prisma.transaction.findFirst({
            where: { relatedEntityId: sub.id, type: 'SUBSCRIPTION_FEE' },
          });
          if (!existingTx) {
            await this.prisma.transaction.create({
              data: {
                userId: host.userId,
                type: 'SUBSCRIPTION_FEE',
                amount: plan.price,
                status: 'COMPLETED',
                paymentGateway: 'CASHFLOWS',
                gatewayTransactionId:
                  paymentJobRef || orderNumber || `SUB_${sub.id.slice(0, 8)}`,
                relatedEntityId: sub.id,
              },
            });
          }

          this.logger.log(
            `Confirmed subscription for host ${host.id} with plan ${plan.name}`,
          );
          return {
            success: true,
            type: 'SUBSCRIPTION',
            subscription: sub,
          };
        }
      }
    }

    // Process Multi-Item Basket Order
    if (orderNumber.startsWith('BSK_')) {
      const parts = orderNumber.split('_');
      const transactionId = parts[1];

      if (transactionId) {
        const pendingTx = await this.prisma.transaction.findUnique({
          where: { id: transactionId },
        });

        if (pendingTx) {
          if (pendingTx.status === 'COMPLETED') {
            const txInstantWins = await this.prisma.winner.findMany({
              where: {
                ticket: { transactionId: pendingTx.id },
                winType: 'INSTANT_WIN',
              },
              include: {
                ticket: { select: { ticketNumber: true } },
                raffle: {
                  select: {
                    title: true,
                    mainImage: true,
                    instantWins: true,
                  },
                },
              },
            });

            const formattedWins = txInstantWins.map((w) => {
              const matchedIw = w.raffle.instantWins.find(
                (iw) => iw.ticketNumber === w.ticket.ticketNumber,
              );
              return {
                id: w.id,
                raffleId: w.raffleId,
                raffleTitle: w.raffle.title,
                ticketId: w.ticketId,
                ticketNumber: w.ticket.ticketNumber,
                prizeName:
                  w.prizeName || matchedIw?.prizeName || 'Instant Win Prize',
                prizeImage: matchedIw?.image || w.raffle.mainImage || null,
                rrpValue: matchedIw?.rrpValue
                  ? Number(matchedIw.rrpValue)
                  : null,
                isClaimed: w.isClaimed,
              };
            });

            return {
              success: true,
              type: 'BASKET_PURCHASE',
              transactionId: pendingTx.id,
              instantWins: formattedWins,
              message:
                'Basket order already confirmed and tickets allocated successfully',
            };
          }

          // If in LIVE mode and payment is not verified as PAID/SETTLED
          if (isLiveMode && !isVerifiedPaid) {
            this.logger.warn(
              `confirmPaymentReturn for tx ${transactionId}: Cashflows status is "${fetchedStatus || 'UNVERIFIED'}" (not verified as PAID). Leaving tx as ${pendingTx.status}. Tickets will NOT be allocated yet.`,
            );

            if (isFailedOrCancelled) {
              await this.prisma.transaction.update({
                where: { id: transactionId },
                data: {
                  status: 'CANCELLED',
                  gatewayTransactionId: paymentJobRef || orderNumber,
                },
              });

              return {
                success: false,
                status: 'CANCELLED',
                type: 'BASKET_PURCHASE',
                transactionId: pendingTx.id,
                message: `Payment was ${fetchedStatus.toLowerCase()}. No tickets were allocated.`,
              };
            }

            return {
              success: false,
              pending: true,
              type: 'BASKET_PURCHASE',
              transactionId: pendingTx.id,
              message:
                'Payment verification is awaiting gateway confirmation. Tickets are reserved only after payment is completed.',
            };
          }

          // Payment is verified or in test mode!
          await this.prisma.transaction.update({
            where: { id: transactionId },
            data: {
              status: 'COMPLETED',
              gatewayTransactionId: paymentJobRef || orderNumber,
            },
          });

          const allBasketInstantWins: any[] = [];
          if (
            pendingTx.relatedEntityId &&
            pendingTx.relatedEntityId.startsWith('BSK_ITEMS:')
          ) {
            const rawItems = pendingTx.relatedEntityId
              .replace('BSK_ITEMS:', '')
              .split(',');
            for (const rawItem of rawItems) {
              const [rId, qtyStr] = rawItem.split(':');
              const qty = parseInt(qtyStr || '1', 10);
              if (rId && qty > 0) {
                try {
                  const allocResult: any =
                    await this.ticketsService.allocateTicketsInDatabase(
                      pendingTx.userId,
                      rId,
                      qty,
                      pendingTx.id,
                    );
                  if (
                    allocResult?.instantWins &&
                    allocResult.instantWins.length > 0
                  ) {
                    allBasketInstantWins.push(...allocResult.instantWins);
                  }
                  this.logger.log(
                    `Confirmed & allocated ${qty} tickets for raffle ${rId} (user ${pendingTx.userId})`,
                  );
                } catch (err: any) {
                  this.logger.warn(
                    `Basket ticket confirmation notice: ${err.message}`,
                  );
                }
              }
            }
          }

          return {
            success: true,
            type: 'BASKET_PURCHASE',
            transactionId: pendingTx.id,
            instantWins: allBasketInstantWins,
            message: 'Basket order confirmed and tickets allocated successfully',
          };
        }
      }
    }

    return { success: true, message: 'Payment confirmation completed' };
  }
}
