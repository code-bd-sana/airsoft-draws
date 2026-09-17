import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Inject,
  forwardRef,
  Optional,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';
import { RafflesService } from '../raffles/raffles.service';
import { BasketCheckoutDto } from './dto/checkout.dto';
import { NotificationsService } from '../notifications/notifications.service';

export function calculateAge(dob: Date, referenceDate: Date = new Date()): number {
  let age = referenceDate.getFullYear() - dob.getFullYear();
  const monthDiff = referenceDate.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && referenceDate.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

@Injectable()
export class TicketsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => RafflesService))
    private readonly rafflesService: RafflesService,
    @Optional()
    private readonly notificationsService?: NotificationsService,
  ) {}

  async purchaseTickets(userId: string, raffleId: string, payload: any) {
    const quantity = typeof payload === 'number' ? payload : payload?.quantity || 1;
    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be at least 1');
    }

    // If USE_TEST_PAYMENT is false, redirect to Cashflows Payment Gateway
    if (process.env.USE_TEST_PAYMENT === 'false') {
      return this.createCashflowsTicketCheckout(userId, raffleId, payload);
    }

    return this.allocateTicketsInDatabase(userId, raffleId, payload);
  }

  async allocateTicketsInDatabase(
    userId: string,
    raffleId: string,
    payload: any,
    existingTransactionId?: string,
  ) {
    const quantity = typeof payload === 'number' ? payload : payload?.quantity || 1;
    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be at least 1');
    }

    const dto = typeof payload === 'object' ? payload : { quantity };

    // 1. Fetch User and Raffle
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User account not found');
    }

    const raffle = await this.prisma.raffle.findUnique({
      where: { id: raffleId },
      include: { instantWins: true, host: true },
    });
    if (!raffle) {
      throw new NotFoundException('Competition not found');
    }

    if (raffle.status !== 'ACTIVE') {
      throw new BadRequestException('This competition is not active');
    }

    if (raffle.ticketsSold + quantity > raffle.totalTickets) {
      throw new BadRequestException(
        `Only ${raffle.totalTickets - raffle.ticketsSold} tickets remaining`,
      );
    }

    // Min and Max Tickets per Entrant Validation
    const minTickets = (raffle as any).minTickets || 1;
    if (quantity < minTickets) {
      throw new BadRequestException(
        `You must purchase at least ${minTickets} ticket(s) for this competition.`,
      );
    }

    const maxTickets = (raffle as any).maxTickets;
    if (maxTickets && maxTickets > 0) {
      const existingUserTicketsCount = await this.prisma.ticket.count({
        where: { raffleId, userId },
      });
      const allowedRemaining = maxTickets - existingUserTicketsCount;
      if (allowedRemaining <= 0) {
        throw new BadRequestException(
          `You have already reached the maximum ticket limit (${maxTickets}) for this competition.`,
        );
      }
      if (quantity > allowedRemaining) {
        throw new BadRequestException(
          `You can only purchase up to ${allowedRemaining} more ticket(s) for this competition (maximum limit: ${maxTickets}, you already own: ${existingUserTicketsCount}).`,
        );
      }
    }

    // 2. Terms Acceptance Check
    if (dto.acceptedTerms !== undefined && !dto.acceptedTerms) {
      throw new BadRequestException('You must accept the Terms and Conditions to complete entry.');
    }

    // 3. Date of Birth & 18+ Age Validation
    let dobToUse = dto.dateOfBirth ? new Date(dto.dateOfBirth) : user.dateOfBirth;

    if (dto.dateOfBirth && (!user.dateOfBirth || user.dateOfBirth.toISOString().slice(0,10) !== dto.dateOfBirth)) {
      const parsedDob = new Date(dto.dateOfBirth);
      if (!isNaN(parsedDob.getTime())) {
        dobToUse = parsedDob;
        await this.prisma.user.update({
          where: { id: userId },
          data: { dateOfBirth: parsedDob },
        });
      }
    }

    if (!dobToUse || isNaN(dobToUse.getTime())) {
      throw new BadRequestException('Date of birth is required at checkout to confirm age eligibility (18+).');
    }

    const age = calculateAge(dobToUse);
    if (age < 18) {
      throw new BadRequestException('Eligibility is restricted to participants aged 18 years or older.');
    }

    // 4. Conditional UKARA Requirement
    const isRifCompetition = (raffle.prizeClassification || 'RIF') === 'RIF';
    let ukaraToUse = dto.ukaraNumber || user.ukaraNumber;

    if (isRifCompetition) {
      if (!ukaraToUse || !ukaraToUse.trim()) {
        throw new BadRequestException('A valid UKARA registration number is required to enter a Realistic Imitation Firearm (RIF) competition.');
      }
      if (dto.ukaraNumber && dto.ukaraNumber.trim() !== user.ukaraNumber) {
        await this.prisma.user.update({
          where: { id: userId },
          data: { ukaraNumber: dto.ukaraNumber.trim() },
        });
        ukaraToUse = dto.ukaraNumber.trim();
      }
    }

    const result = await this.prisma.$transaction(
      async (tx) => {
        if (maxTickets && maxTickets > 0) {
          const txUserTicketsCount = await tx.ticket.count({
            where: { raffleId, userId },
          });
          if (txUserTicketsCount + quantity > maxTickets) {
            throw new BadRequestException(
              `Maximum ticket limit (${maxTickets}) exceeded for this competition.`,
            );
          }
        }

        // Determine available ticket numbers
        const existingTickets = await tx.ticket.findMany({
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

        if (availableNumbers.length < quantity) {
          throw new BadRequestException('Not enough ticket numbers available');
        }

        // Shuffle and pick random numbers
        for (let i = availableNumbers.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [availableNumbers[i], availableNumbers[j]] = [
            availableNumbers[j],
            availableNumbers[i],
          ];
        }
        const assignedNumbers = availableNumbers.slice(0, quantity);

        // Create or reuse Transaction Record
        const totalAmount = Number(raffle.pricePerTicket) * quantity;
        let transaction: any;
        let finalTxId = existingTransactionId;

        if (!finalTxId) {
          const gatewayTransactionId = `SIM_PAY_${crypto.randomUUID()}`;
          transaction = await tx.transaction.create({
            data: {
              userId,
              type: 'TICKET_PURCHASE',
              amount: totalAmount,
              status: 'COMPLETED',
              paymentGateway: 'SIMULATED',
              gatewayTransactionId,
              relatedEntityId: raffle.id,
            },
          });
          finalTxId = transaction.id;
        } else {
          transaction = await tx.transaction.findUnique({
            where: { id: finalTxId },
          });
        }

        // Create Tickets with Accepted Terms Metadata
        const now = new Date();
        const ticketsData = assignedNumbers.map((num) => ({
          raffleId: raffle.id,
          userId,
          transactionId: finalTxId!,
          ticketNumber: num,
          acceptedTermsVersion: 'v1.0',
          acceptedTermsAt: now,
        }));

        await tx.ticket.createMany({
          data: ticketsData,
        });

        // Fetch created tickets
        const createdTickets = await tx.ticket.findMany({
          where: {
            transactionId: finalTxId!,
            raffleId: raffle.id,
          },
        });

        // Check for Instant Wins
        const userInstantWins: any[] = [];

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
                ukaraStatus: isRifCompetition ? 'PENDING_VERIFICATION' : 'NOT_REQUIRED',
              },
            });

            userInstantWins.push(winner);
          }
        }

        // 7. Update Raffle Tickets Sold & Credit Host Wallet Balance
        const updatedRaffle = await tx.raffle.update({
          where: { id: raffle.id },
          data: {
            ticketsSold: {
              increment: quantity,
            },
          },
        });

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

        return {
          updatedRaffle,
          transaction,
          createdTickets,
          userInstantWins,
        };
      },
      {
        // Optional: Set isolation level or timeout if needed
        maxWait: 5000,
        timeout: 10000,
      },
    );

    // 8. Outside the transaction, check if we need to trigger auto-draw or close manual draw
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
    } else if (
      !result.updatedRaffle.isAutoDraw &&
      result.updatedRaffle.ticketsSold >= result.updatedRaffle.totalTickets &&
      result.updatedRaffle.status === 'ACTIVE'
    ) {
      try {
        await this.prisma.raffle.update({
          where: { id: result.updatedRaffle.id },
          data: { status: 'ENDED' },
        });
      } catch (err) {
        console.error('Failed to update manual raffle status on sold out:', err);
      }
    }

    // 9. Dispatch in-app notifications (Non-blocking)
    if (this.notificationsService) {
      try {
        await this.notificationsService.createNotification({
          userId,
          type: 'PAYMENT',
          title: 'Ticket Purchase Confirmed',
          subtitle: `You successfully purchased ${quantity} ticket(s) for "${raffle.title}".`,
          link: '/dashboard/user/tickets',
          metadata: {
            raffleId: raffle.id,
            transactionId: result.transaction?.id || existingTransactionId,
            ticketCount: quantity,
          },
        });

        if (raffle.host?.userId) {
          await this.notificationsService.createNotification({
            userId: raffle.host.userId,
            type: 'PAYMENT',
            title: 'New Ticket Sale',
            subtitle: `${quantity} ticket(s) sold for "${raffle.title}".`,
            link: '/dashboard/host/competitions',
            metadata: {
              raffleId: raffle.id,
              quantity,
            },
          });
        }

        if (result.userInstantWins && result.userInstantWins.length > 0) {
          for (const win of result.userInstantWins) {
            await this.notificationsService.createNotification({
              userId,
              type: 'WIN',
              title: '🎉 Instant Win Prize Claimed!',
              subtitle: `Congratulations! You won "${win.prizeName}" in "${raffle.title}".`,
              link: '/dashboard/user/wins',
              metadata: {
                raffleId: raffle.id,
                prizeName: win.prizeName,
                ticketId: win.ticketId,
              },
            });

            if (raffle.host?.userId) {
              await this.notificationsService.createNotification({
                userId: raffle.host.userId,
                type: 'WIN',
                title: 'Instant Win Hit on Competition',
                subtitle: `An entrant won "${win.prizeName}" on "${raffle.title}".`,
                link: '/dashboard/host/competitions',
                metadata: {
                  raffleId: raffle.id,
                  prizeName: win.prizeName,
                },
              });
            }
          }
        }
      } catch (notifErr) {
        console.error('Failed to dispatch ticket purchase notifications:', notifErr);
      }
    }

    return {
      message: 'Tickets purchased successfully',
      transaction: result.transaction,
      tickets: result.createdTickets,
      instantWins: result.userInstantWins,
    };
  }

  async getUserTickets(userId: string) {
    return this.prisma.ticket.findMany({
      where: { userId },
      include: {
        raffle: {
          select: {
            id: true,
            title: true,
            slug: true,
            mainImage: true,
            endDate: true,
            status: true,
            prizeName: true,
            description: true,
            pricePerTicket: true,
            totalTickets: true,
            ticketsSold: true,
            instantWins: true,
            host: {
              include: { user: true },
            },
          },
        },
        winners: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createCashflowsTicketCheckout(
    userId: string,
    raffleId: string,
    payload: any,
  ) {
    const quantity = typeof payload === 'number' ? payload : Number(payload?.quantity || 1);
    const raffle = await this.prisma.raffle.findUnique({
      where: { id: raffleId },
    });

    if (!raffle) {
      throw new NotFoundException('Competition not found');
    }

    if (raffle.status !== 'ACTIVE') {
      throw new BadRequestException('This competition is not active');
    }

    if (raffle.ticketsSold + quantity > raffle.totalTickets) {
      throw new BadRequestException(
        `Only ${raffle.totalTickets - raffle.ticketsSold} tickets remaining`,
      );
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const baseUrl =
      process.env.CASHFLOWS_BASE_URL || 'https://gateway.cashflows.com';
    const configId = process.env.CASHFLOWS_CONFIGURATION_ID || '';
    const apiKey = process.env.CASHFLOWS_API_KEY || '';

    const totalAmount = (Number(raffle.pricePerTicket) * quantity).toFixed(2);
    const pendingTx = await this.prisma.transaction.create({
      data: {
        userId,
        type: 'TICKET_PURCHASE',
        amount: Number(totalAmount),
        status: 'PENDING',
        paymentGateway: 'CASHFLOWS',
        relatedEntityId: `BSK_ITEMS:${raffleId}:${quantity}`,
      },
    });

    const orderNumber = `BSK_${pendingTx.id}_${Date.now()}`;

    const innerRequestPayload = {
      type: 'Payment',
      amountToCollect: totalAmount,
      currency: 'GBP',
      order: {
        orderNumber: orderNumber,
        note: `Ticket purchase: ${quantity} ticket(s) for ${raffle.title}`,
      },
      customer: {
        email: user?.email || '',
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
      },
      returnUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/success?type=basket&order=${orderNumber}`,
      cancelUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/cancel?type=basket&order=${orderNumber}`,
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
      console.log(`Sending Cashflows Ticket Checkout request to ${baseUrl}/api/gateway/payment-jobs`);
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
        console.error('Cashflows Ticket API Error Response:', data);
        throw new BadRequestException(
          data.message || data.error || `Cashflows Gateway Error (${response.status})`,
        );
      }

      console.log('CASHFLOWS SUCCESS RESPONSE DATA:', JSON.stringify(data, null, 2));

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
        console.error('Cashflows Ticket API response payload:', JSON.stringify(data, null, 2));
        throw new BadRequestException(`Cashflows gateway response: ${JSON.stringify(data)}`);
      }

      return {
        url: redirectUrl,
      };
    } catch (error: any) {
      console.error(`Cashflow Ticket Checkout Error: ${error.message}`);
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Cashflows Gateway Error: ${error.message}`);
    }
  }

  async checkout(userId: string, dto: BasketCheckoutDto) {
    if (!dto.items || !Array.isArray(dto.items) || dto.items.length === 0) {
      throw new BadRequestException('Basket must contain at least one item');
    }

    // Consolidate duplicate raffle entries if any
    const itemMap = new Map<string, number>();
    for (const item of dto.items) {
      if (!item.quantity || item.quantity <= 0) {
        throw new BadRequestException('Quantity must be at least 1 for all items');
      }
      itemMap.set(item.raffleId, (itemMap.get(item.raffleId) || 0) + item.quantity);
    }

    // 1. Fetch User and verify status
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User account not found');
    }
    if (user.isBlocked) {
      throw new BadRequestException('Your account has been suspended. Please contact support.');
    }

    // 2. Terms Acceptance Check
    if (!dto.acceptedTerms) {
      throw new BadRequestException('You must accept the Terms and Conditions to complete checkout.');
    }

    // 3. Date of Birth & 18+ Age Validation
    const parsedDob = new Date(dto.dateOfBirth);
    if (!dto.dateOfBirth || isNaN(parsedDob.getTime())) {
      throw new BadRequestException('A valid Date of Birth is required to confirm eligibility.');
    }
    const age = calculateAge(parsedDob);
    if (age < 18) {
      throw new BadRequestException(
        'Eligibility is restricted to participants aged 18 years or older under UK law (VCRA 2006).',
      );
    }

    // 4. Fetch and validate all Raffles
    const raffleIds = Array.from(itemMap.keys());
    const raffles = await this.prisma.raffle.findMany({
      where: { id: { in: raffleIds } },
      include: { instantWins: true, host: true },
    });

    if (raffles.length !== raffleIds.length) {
      throw new NotFoundException('One or more selected competitions could not be found');
    }

    let hasRifCompetition = false;
    let totalBasketAmount = 0;

    for (const raffle of raffles) {
      if (raffle.status !== 'ACTIVE') {
        throw new BadRequestException(`Competition "${raffle.title}" is no longer active`);
      }

      const qty = itemMap.get(raffle.id)!;
      if (raffle.ticketsSold + qty > raffle.totalTickets) {
        const remaining = Math.max(0, raffle.totalTickets - raffle.ticketsSold);
        throw new BadRequestException(
          `Only ${remaining} ticket(s) remaining for "${raffle.title}"`,
        );
      }

      // Min & Max Tickets per Entrant Validation
      const minTickets = (raffle as any).minTickets || 1;
      if (qty < minTickets) {
        throw new BadRequestException(
          `You must purchase at least ${minTickets} ticket(s) for "${raffle.title}".`,
        );
      }

      const maxTickets = (raffle as any).maxTickets;
      if (maxTickets && maxTickets > 0) {
        const existingUserTicketsCount = await this.prisma.ticket.count({
          where: { raffleId: raffle.id, userId },
        });
        const allowedRemaining = maxTickets - existingUserTicketsCount;
        if (allowedRemaining <= 0) {
          throw new BadRequestException(
            `You have already reached the maximum ticket limit (${maxTickets}) for "${raffle.title}".`,
          );
        }
        if (qty > allowedRemaining) {
          throw new BadRequestException(
            `You can only purchase up to ${allowedRemaining} more ticket(s) for "${raffle.title}" (maximum limit: ${maxTickets}, you already own: ${existingUserTicketsCount}).`,
          );
        }
      }

      if ((raffle.prizeClassification || 'RIF') === 'RIF') {
        hasRifCompetition = true;
      }

      totalBasketAmount += Number(raffle.pricePerTicket) * qty;
    }

    // 5. UKARA Requirement for RIF items
    const ukaraToUse = dto.ukaraNumber?.trim() || user.ukaraNumber?.trim() || '';
    if (hasRifCompetition && !ukaraToUse) {
      throw new BadRequestException(
        'A valid UKARA registration number is required to enter competitions containing Realistic Imitation Firearms (RIF).',
      );
    }

    // 6. Auto-Save Contact & Shipping Address to User Profile
    const formattedAddress = [
      dto.shippingAddress?.addressLine1,
      dto.shippingAddress?.addressLine2,
      dto.shippingAddress?.city,
      dto.shippingAddress?.postalCode,
      dto.shippingAddress?.country,
    ]
      .filter(Boolean)
      .join(', ');

    const locationStr = dto.shippingAddress
      ? `${dto.shippingAddress.city}, ${dto.shippingAddress.country}`
      : user.location;

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        dateOfBirth: parsedDob,
        address: formattedAddress || user.address,
        location: locationStr || user.location,
        ...(ukaraToUse ? { ukaraNumber: ukaraToUse } : {}),
      },
    });

    // 7. Gateway vs Test / Simulated Allocation
    if (process.env.USE_TEST_PAYMENT === 'false') {
      return this.createCashflowsBasketCheckout(
        userId,
        dto,
        totalBasketAmount,
        raffles,
      );
    }

    return this.allocateBasketTicketsInDatabase(
      userId,
      dto,
      totalBasketAmount,
      raffles,
      itemMap,
    );
  }

  async allocateBasketTicketsInDatabase(
    userId: string,
    dto: BasketCheckoutDto,
    totalBasketAmount: number,
    raffles: any[],
    itemMap: Map<string, number>,
  ) {
    const gatewayTransactionId = `SIM_BSK_${crypto.randomUUID()}`;
    const now = new Date();

    const result = await this.prisma.$transaction(
      async (tx) => {
        // Create Consolidated Master Transaction
        const transaction = await tx.transaction.create({
          data: {
            userId,
            type: 'TICKET_PURCHASE',
            amount: totalBasketAmount,
            status: 'COMPLETED',
            paymentGateway: 'SIMULATED',
            gatewayTransactionId,
            relatedEntityId: 'BASKET_PURCHASE',
          },
        });

        const allCreatedTickets: any[] = [];
        const allUserInstantWins: any[] = [];
        const updatedRaffles: any[] = [];

        for (const raffle of raffles) {
          const quantity = itemMap.get(raffle.id)!;
          const isRif = (raffle.prizeClassification || 'RIF') === 'RIF';

          const maxTickets = (raffle as any).maxTickets;
          if (maxTickets && maxTickets > 0) {
            const txUserTicketsCount = await tx.ticket.count({
              where: { raffleId: raffle.id, userId },
            });
            if (txUserTicketsCount + quantity > maxTickets) {
              throw new BadRequestException(
                `Maximum ticket limit (${maxTickets}) exceeded for "${raffle.title}".`,
              );
            }
          }

          // Determine available ticket numbers
          const existingTickets = await tx.ticket.findMany({
            where: { raffleId: raffle.id },
            select: { ticketNumber: true },
          });
          const usedNumbers = new Set(existingTickets.map((t) => t.ticketNumber));

          const availableNumbers: number[] = [];
          for (let i = 1; i <= raffle.totalTickets; i++) {
            if (!usedNumbers.has(i)) {
              availableNumbers.push(i);
            }
          }

          if (availableNumbers.length < quantity) {
            throw new BadRequestException(
              `Not enough ticket numbers available for "${raffle.title}"`,
            );
          }

          // Shuffle and pick random numbers
          for (let i = availableNumbers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [availableNumbers[i], availableNumbers[j]] = [
              availableNumbers[j],
              availableNumbers[i],
            ];
          }
          const assignedNumbers = availableNumbers.slice(0, quantity);

          // Create Tickets
          const ticketsData = assignedNumbers.map((num) => ({
            raffleId: raffle.id,
            userId,
            transactionId: transaction.id,
            ticketNumber: num,
            acceptedTermsVersion: 'v1.0',
            acceptedTermsAt: now,
          }));

          await tx.ticket.createMany({
            data: ticketsData,
          });

          // Fetch created tickets for this raffle
          const createdTickets = await tx.ticket.findMany({
            where: {
              transactionId: transaction.id,
              raffleId: raffle.id,
            },
          });
          allCreatedTickets.push(...createdTickets);

          // Check instant wins
          for (const ticket of createdTickets) {
            const matchedInstantWin = raffle.instantWins?.find(
              (iw: any) =>
                iw.ticketNumber === ticket.ticketNumber && !iw.isClaimed,
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
                  ukaraStatus: isRif ? 'PENDING_VERIFICATION' : 'NOT_REQUIRED',
                },
              });

              allUserInstantWins.push({
                ...winner,
                ticketNumber: ticket.ticketNumber,
                raffleTitle: raffle.title,
              });
            }
          }

          // Update sold count
          const updated = await tx.raffle.update({
            where: { id: raffle.id },
            data: {
              ticketsSold: {
                increment: quantity,
              },
            },
          });
          updatedRaffles.push(updated);

          // Credit host wallet
          if (raffle.hostId) {
            const raffleAmount = Number(raffle.pricePerTicket) * quantity;
            await tx.hostProfile.update({
              where: { id: raffle.hostId },
              data: {
                walletBalance: {
                  increment: raffleAmount,
                },
              },
            });
          }
        }

        return {
          transaction,
          allCreatedTickets,
          allUserInstantWins,
          updatedRaffles,
        };
      },
      {
        maxWait: 5000,
        timeout: 15000,
      },
    );

    // Outside transaction, check auto-draw / sold-out conditions
    for (const updatedRaffle of result.updatedRaffles) {
      if (
        updatedRaffle.isAutoDraw &&
        updatedRaffle.autoDrawSoldOut &&
        updatedRaffle.ticketsSold >= updatedRaffle.totalTickets &&
        updatedRaffle.status === 'ACTIVE'
      ) {
        try {
          await this.rafflesService.drawWinner(updatedRaffle.id);
        } catch (err) {
          console.error('Failed to trigger auto draw on sold out:', err);
        }
      } else if (
        !updatedRaffle.isAutoDraw &&
        updatedRaffle.ticketsSold >= updatedRaffle.totalTickets &&
        updatedRaffle.status === 'ACTIVE'
      ) {
        try {
          await this.prisma.raffle.update({
            where: { id: updatedRaffle.id },
            data: { status: 'ENDED' },
          });
        } catch (err) {
          console.error('Failed to update manual raffle status on sold out:', err);
        }
      }
    }

    if (this.notificationsService) {
      try {
        await this.notificationsService.createNotification({
          userId,
          type: 'PAYMENT',
          title: 'Order Confirmed',
          subtitle: `You purchased ${result.allCreatedTickets.length} ticket(s) across ${result.updatedRaffles.length} competition(s).`,
          link: '/dashboard/user/tickets',
          metadata: {
            transactionId: result.transaction.id,
            ticketCount: result.allCreatedTickets.length,
          },
        });

        for (const r of result.updatedRaffles) {
          const matchedRaffle = raffles.find((item) => item.id === r.id);
          if (matchedRaffle?.host?.userId) {
            await this.notificationsService.createNotification({
              userId: matchedRaffle.host.userId,
              type: 'PAYMENT',
              title: 'New Ticket Sale',
              subtitle: `Tickets sold for "${r.title}".`,
              link: '/dashboard/host/competitions',
              metadata: { raffleId: r.id },
            });
          }
        }

        for (const win of result.allUserInstantWins) {
          await this.notificationsService.createNotification({
            userId,
            type: 'WIN',
            title: '🎉 Instant Win Prize Claimed!',
            subtitle: `Congratulations! You won "${win.prizeName}"!`,
            link: '/dashboard/user/wins',
            metadata: {
              prizeName: win.prizeName,
            },
          });
        }
      } catch (notifErr) {
        console.error('Failed to dispatch basket notifications:', notifErr);
      }
    }

    return {
      message: 'Basket checkout completed successfully',
      transaction: result.transaction,
      tickets: result.allCreatedTickets,
      instantWins: result.allUserInstantWins,
      totalAmount: totalBasketAmount,
    };
  }

  async createCashflowsBasketCheckout(
    userId: string,
    dto: BasketCheckoutDto,
    totalBasketAmount: number,
    raffles: any[],
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const baseUrl =
      process.env.CASHFLOWS_BASE_URL || 'https://gateway.cashflows.com';
    const configId = process.env.CASHFLOWS_CONFIGURATION_ID || '';
    const apiKey = process.env.CASHFLOWS_API_KEY || '';

    // Create a pending Transaction record
    const pendingTransaction = await this.prisma.transaction.create({
      data: {
        userId,
        type: 'TICKET_PURCHASE',
        amount: totalBasketAmount,
        status: 'PENDING',
        paymentGateway: 'CASHFLOWS',
        relatedEntityId: `BSK_ITEMS:${dto.items.map((i) => `${i.raffleId}:${i.quantity}`).join(',')}`.slice(0, 255),
      },
    });

    const totalAmountStr = totalBasketAmount.toFixed(2);
    const orderNumber = `BSK_${pendingTransaction.id}_${Date.now()}`;

    const innerRequestPayload = {
      type: 'Payment',
      amountToCollect: totalAmountStr,
      currency: 'GBP',
      order: {
        orderNumber,
        note: `Basket checkout: ${dto.items.length} competition(s)`,
      },
      customer: {
        email: dto.email || user?.email || '',
        firstName: dto.firstName || user?.firstName || '',
        lastName: dto.lastName || user?.lastName || '',
      },
      returnUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/success?type=basket&order=${orderNumber}`,
      cancelUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/cancel?type=basket&order=${orderNumber}`,
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
      console.log(
        `Sending Cashflows Basket Checkout request to ${baseUrl}/api/gateway/payment-jobs`,
      );
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
        console.error('Cashflows Basket API Error Response:', data);
        throw new BadRequestException(
          data.message ||
            data.error ||
            `Cashflows Gateway Error (${response.status})`,
        );
      }

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
          (a: any) =>
            a.rel === 'checkout' ||
            a.rel === 'payment' ||
            a.rel === 'redirect' ||
            a.rel === 'hosted_checkout',
        );
        if (checkoutAction)
          redirectUrl = checkoutAction.href || checkoutAction.url;
      }

      if (!redirectUrl && data.data?.reference) {
        redirectUrl = `${baseUrl}/payment?ref=${data.data.reference}`;
      }

      if (!redirectUrl) {
        throw new BadRequestException(
          `Cashflows gateway response: ${JSON.stringify(data)}`,
        );
      }

      return {
        url: redirectUrl,
        orderNumber,
        transactionId: pendingTransaction.id,
      };
    } catch (error: any) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new BadRequestException(`Cashflows Gateway Error: ${error.message}`);
    }
  }

  async getUserOrders(userId: string) {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        type: 'TICKET_PURCHASE',
      },
      orderBy: { createdAt: 'desc' },
      include: {
        tickets: {
          include: {
            raffle: {
              select: {
                id: true,
                title: true,
                slug: true,
                mainImage: true,
                pricePerTicket: true,
                status: true,
                endDate: true,
                totalTickets: true,
                ticketsSold: true,
                prizeClassification: true,
              },
            },
          },
        },
      },
    });

    // For any transaction (especially PENDING ones), extract competition items from relatedEntityId
    const raffleIdsToFetch = new Set<string>();
    for (const tx of transactions) {
      if (tx.relatedEntityId && tx.relatedEntityId.startsWith('BSK_ITEMS:')) {
        const rawItems = tx.relatedEntityId.replace('BSK_ITEMS:', '').split(',');
        for (const rawItem of rawItems) {
          const [rId] = rawItem.split(':');
          if (rId) raffleIdsToFetch.add(rId);
        }
      }
    }

    const fetchedRaffles = await this.prisma.raffle.findMany({
      where: { id: { in: Array.from(raffleIdsToFetch) } },
      select: {
        id: true,
        title: true,
        slug: true,
        mainImage: true,
        pricePerTicket: true,
        status: true,
        endDate: true,
        totalTickets: true,
        ticketsSold: true,
        prizeClassification: true,
        minTickets: true,
        maxTickets: true,
      },
    });

    const raffleMap = new Map<string, any>();
    fetchedRaffles.forEach((r) => raffleMap.set(r.id, r));

    const now = new Date();

    const orders = transactions.map((tx) => {
      let items: any[] = [];
      let isSoldOutOrClosed = false;
      let closedReason: string | null = null;
      let totalTicketsCount = 0;

      if (tx.status === 'COMPLETED' && tx.tickets.length > 0) {
        // Group completed tickets by raffle
        const map = new Map<string, { raffle: any; quantity: number; ticketNumbers: number[] }>();
        for (const t of tx.tickets) {
          totalTicketsCount++;
          if (!map.has(t.raffleId)) {
            map.set(t.raffleId, {
              raffle: t.raffle,
              quantity: 0,
              ticketNumbers: [],
            });
          }
          const entry = map.get(t.raffleId)!;
          entry.quantity++;
          entry.ticketNumbers.push(t.ticketNumber);
        }

        items = Array.from(map.values()).map((entry) => ({
          raffleId: entry.raffle.id,
          title: entry.raffle.title,
          slug: entry.raffle.slug,
          mainImage: entry.raffle.mainImage || '',
          pricePerTicket: Number(entry.raffle.pricePerTicket),
          quantity: entry.quantity,
          ticketNumbers: entry.ticketNumbers,
          status: entry.raffle.status,
          isEnded:
            entry.raffle.status === 'ENDED' ||
            (entry.raffle.endDate && new Date(entry.raffle.endDate) <= now),
        }));
      } else if (tx.relatedEntityId && tx.relatedEntityId.startsWith('BSK_ITEMS:')) {
        // Parse pending or incomplete items
        const rawItems = tx.relatedEntityId.replace('BSK_ITEMS:', '').split(',');
        for (const rawItem of rawItems) {
          const [rId, qtyStr] = rawItem.split(':');
          const qty = parseInt(qtyStr || '1', 10);
          const raffle = raffleMap.get(rId);

          if (raffle) {
            totalTicketsCount += qty;
            const remaining = Math.max(0, raffle.totalTickets - raffle.ticketsSold);
            const isRaffleEnded =
              raffle.status !== 'ACTIVE' ||
              (raffle.endDate && new Date(raffle.endDate) <= now);
            const isRaffleSoldOut = remaining < qty;

            if (isRaffleEnded || isRaffleSoldOut) {
              isSoldOutOrClosed = true;
              if (isRaffleEnded) {
                closedReason = `"${raffle.title}" is closed or ended`;
              } else if (isRaffleSoldOut) {
                closedReason = `"${raffle.title}" is sold out (${remaining} ticket(s) left)`;
              }
            }

            items.push({
              raffleId: raffle.id,
              title: raffle.title,
              slug: raffle.slug,
              mainImage: raffle.mainImage || '',
              pricePerTicket: Number(raffle.pricePerTicket),
              quantity: qty,
              remainingTickets: remaining,
              status: raffle.status,
              isEnded: isRaffleEnded,
              isSoldOut: isRaffleSoldOut,
            });
          }
        }
      }

      const canPay =
        (tx.status === 'PENDING' || tx.status === 'CANCELLED') &&
        !isSoldOutOrClosed &&
        items.length > 0;

      return {
        id: tx.id,
        orderNumber: tx.gatewayTransactionId?.startsWith('BSK_')
          ? tx.gatewayTransactionId
          : `BSK_${tx.id.substring(0, 8).toUpperCase()}`,
        amount: Number(tx.amount),
        status: tx.status, // PENDING, COMPLETED, CANCELLED, FAILED
        paymentGateway: tx.paymentGateway || 'CASHFLOWS',
        createdAt: tx.createdAt.toISOString(),
        items,
        totalTickets: totalTicketsCount,
        canPay,
        isSoldOutOrClosed,
        closedReason,
      };
    });

    return orders;
  }

  async retryOrderPayment(userId: string, transactionId: string) {
    const tx = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
      include: { user: true },
    });

    if (!tx || tx.userId !== userId) {
      throw new NotFoundException('Order not found');
    }

    if (tx.status === 'COMPLETED') {
      throw new BadRequestException('This order has already been paid and completed.');
    }

    if (!tx.relatedEntityId || !tx.relatedEntityId.startsWith('BSK_ITEMS:')) {
      throw new BadRequestException('Order items data is invalid or missing.');
    }

    const rawItems = tx.relatedEntityId.replace('BSK_ITEMS:', '').split(',');
    const itemMap = new Map<string, number>();
    for (const rawItem of rawItems) {
      const [rId, qtyStr] = rawItem.split(':');
      const qty = parseInt(qtyStr || '1', 10);
      if (rId && qty > 0) {
        itemMap.set(rId, qty);
      }
    }

    const raffleIds = Array.from(itemMap.keys());
    const raffles = await this.prisma.raffle.findMany({
      where: { id: { in: raffleIds } },
    });

    if (raffles.length !== raffleIds.length) {
      throw new BadRequestException(
        'One or more competitions in this order are no longer available.',
      );
    }

    const now = new Date();
    for (const raffle of raffles) {
      const qty = itemMap.get(raffle.id)!;
      // 1. Check if competition is active and not ended
      if (
        raffle.status !== 'ACTIVE' ||
        (raffle.endDate && new Date(raffle.endDate) <= now)
      ) {
        throw new BadRequestException(
          `Oops! "${raffle.title}" is closed or ended.`,
        );
      }

      // 2. Check if enough tickets remaining
      const remaining = Math.max(0, raffle.totalTickets - raffle.ticketsSold);
      if (qty > remaining) {
        throw new BadRequestException(
          `Oops! "${raffle.title}" is sold out. Only ${remaining} ticket(s) remaining.`,
        );
      }
    }

    // All competitions verified active and have available tickets!
    const baseUrl =
      process.env.CASHFLOWS_BASE_URL || 'https://gateway.cashflows.com';
    const configId = process.env.CASHFLOWS_CONFIGURATION_ID || '';
    const apiKey = process.env.CASHFLOWS_API_KEY || '';

    const orderNumber = `BSK_${tx.id}_${Date.now()}`;
    const totalAmountStr = Number(tx.amount).toFixed(2);

    const innerRequestPayload = {
      type: 'Payment',
      amountToCollect: totalAmountStr,
      currency: 'GBP',
      order: {
        orderNumber,
        note: `Resume order payment: ${raffles.map((r) => r.title).join(', ')}`.slice(0, 100),
      },
      customer: {
        email: tx.user?.email || '',
        firstName: tx.user?.firstName || '',
        lastName: tx.user?.lastName || '',
      },
      returnUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/success?type=basket&order=${orderNumber}`,
      cancelUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/cancel?type=basket&order=${orderNumber}`,
    };

    const innerRequestString = JSON.stringify(innerRequestPayload);
    const hash = crypto
      .createHash('sha512')
      .update(apiKey + innerRequestString)
      .digest('hex')
      .toUpperCase();

    try {
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
        throw new BadRequestException(
          data.message || 'Failed to initialize payment gateway.',
        );
      }

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
          (a: any) =>
            a.rel === 'checkout' ||
            a.rel === 'payment' ||
            a.rel === 'redirect' ||
            a.rel === 'hosted_checkout',
        );
        if (checkoutAction)
          redirectUrl = checkoutAction.href || checkoutAction.url;
      }

      if (!redirectUrl && data.data?.reference) {
        redirectUrl = `${baseUrl}/payment?ref=${data.data.reference}`;
      }

      if (!redirectUrl) {
        throw new BadRequestException(
          'Cashflows did not return a checkout payment URL.',
        );
      }

      // Update gatewayTransactionId and ensure status is PENDING
      await this.prisma.transaction.update({
        where: { id: tx.id },
        data: {
          gatewayTransactionId: orderNumber,
          status: 'PENDING',
        },
      });

      return {
        url: redirectUrl,
      };
    } catch (error: any) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new BadRequestException(`Payment Gateway Error: ${error.message}`);
    }
  }
}


