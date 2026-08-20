import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AdminWinnersService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllWinners(
    page: number = 1,
    limit: number = 20,
    deliveryStatus?: string,
    verificationStatus?: string,
    winType?: string,
  ) {
    const skip = (page - 1) * limit;
    const where: Prisma.WinnerWhereInput = {};

    if (deliveryStatus && deliveryStatus !== 'All') {
      where.deliveryStatus = deliveryStatus;
    }

    if (verificationStatus && verificationStatus !== 'All') {
      where.verificationStatus = verificationStatus;
    }

    if (winType && winType !== 'All') {
      where.winType = winType;
    }

    const [winners, total] = await Promise.all([
      this.prisma.winner.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: true,
          raffle: true,
          ticket: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.winner.count({ where }),
    ]);

    return {
      data: winners,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async verifyWinner(id: string, reviewerId?: string) {
    const winner = await this.prisma.winner.findUnique({
      where: { id },
      include: { raffle: true },
    });

    if (!winner) {
      throw new NotFoundException('Winner not found');
    }

    const updated = await this.prisma.winner.update({
      where: { id },
      data: {
        verificationStatus: 'APPROVED_FOR_FULFILMENT',
        ukaraStatus: winner.raffle?.prizeClassification === 'RIF' ? 'VALID' : 'NOT_REQUIRED',
        dobMatch: true,
        nameMatch: true,
        verifiedByUserId: reviewerId || null,
        verifiedAt: new Date(),
      },
      include: {
        user: true,
        raffle: true,
        ticket: true,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        userId: reviewerId || null,
        action: 'WINNER_VERIFIED',
        entityType: 'WINNER',
        entityId: id,
        details: `Winner verified for fulfilment by staff ID: ${reviewerId || 'Admin'}`,
      },
    });

    return updated;
  }

  async saveIdDocument(winnerId: string, filePath: string, fileType: string, reviewerId?: string) {
    const winner = await this.prisma.winner.findUnique({ where: { id: winnerId } });
    if (!winner) throw new NotFoundException('Winner record not found');

    const updated = await this.prisma.winner.update({
      where: { id: winnerId },
      data: {
        idDocumentUrl: filePath,
        idDocumentType: fileType,
        verificationStatus: 'ID_SUBMITTED',
      },
      include: { user: true, raffle: true, ticket: true },
    });

    await this.prisma.auditLog.create({
      data: {
        userId: reviewerId || null,
        action: 'WINNER_ID_DOCUMENT_UPLOADED',
        entityType: 'WINNER',
        entityId: winnerId,
        details: `Private ID document uploaded (${fileType}). Status: ID_SUBMITTED`,
      },
    });

    return updated;
  }

  async getIdDocumentPath(winnerId: string) {
    const winner = await this.prisma.winner.findUnique({ where: { id: winnerId } });
    if (!winner || !winner.idDocumentUrl) {
      throw new NotFoundException('ID document not found for this winner');
    }
    const fullPath = path.resolve(winner.idDocumentUrl);
    if (!fs.existsSync(fullPath)) {
      throw new NotFoundException('Identity document file does not exist on disk');
    }
    return fullPath;
  }

  async updateVerification(
    id: string,
    payload: {
      verificationStatus: string;
      ukaraStatus?: string;
      dobMatch?: boolean;
      nameMatch?: boolean;
    },
    reviewerId?: string,
  ) {
    const winner = await this.prisma.winner.findUnique({ where: { id } });
    if (!winner) throw new NotFoundException('Winner record not found');

    const updated = await this.prisma.winner.update({
      where: { id },
      data: {
        verificationStatus: payload.verificationStatus,
        ukaraStatus: payload.ukaraStatus || winner.ukaraStatus,
        dobMatch: payload.dobMatch !== undefined ? payload.dobMatch : winner.dobMatch,
        nameMatch: payload.nameMatch !== undefined ? payload.nameMatch : winner.nameMatch,
        verifiedByUserId: reviewerId || winner.verifiedByUserId,
        verifiedAt: new Date(),
      },
      include: { user: true, raffle: true, ticket: true },
    });

    await this.prisma.auditLog.create({
      data: {
        userId: reviewerId || null,
        action: 'WINNER_VERIFICATION_UPDATED',
        entityType: 'WINNER',
        entityId: id,
        details: `Verification status updated to ${payload.verificationStatus}, UKARA status: ${payload.ukaraStatus || 'Unchanged'}`,
      },
    });

    return updated;
  }

  async updateAlternative(
    id: string,
    payload: {
      alternativeType: string;
      alternativeAmount?: number;
      alternativeReason?: string;
      alternativeStatus?: string;
    },
    reviewerId?: string,
  ) {
    const winner = await this.prisma.winner.findUnique({ where: { id } });
    if (!winner) throw new NotFoundException('Winner record not found');

    const updated = await this.prisma.winner.update({
      where: { id },
      data: {
        alternativeType: payload.alternativeType,
        alternativeAmount: payload.alternativeAmount !== undefined ? payload.alternativeAmount : winner.alternativeAmount,
        alternativeReason: payload.alternativeReason || winner.alternativeReason,
        alternativeStatus: payload.alternativeStatus || 'OFFERED',
        alternativeDecisionBy: reviewerId || null,
        verificationStatus: payload.alternativeType === 'CASH' ? 'CASH_ALT_OFFERED' : 'TWO_TONE_ALT_OFFERED',
      },
      include: { user: true, raffle: true, ticket: true },
    });

    await this.prisma.auditLog.create({
      data: {
        userId: reviewerId || null,
        action: 'WINNER_ALTERNATIVE_OFFERED',
        entityType: 'WINNER',
        entityId: id,
        details: `Alternative ${payload.alternativeType} offered. Amount: £${payload.alternativeAmount || 0}`,
      },
    });

    return updated;
  }

  async updateTransfer(
    id: string,
    payload: {
      transferRecipientName: string;
      transferRecipientDob?: string;
      transferRecipientUkara?: string;
      transferStatus: string;
      transferAdminNotes?: string;
    },
    reviewerId?: string,
  ) {
    const winner = await this.prisma.winner.findUnique({ where: { id } });
    if (!winner) throw new NotFoundException('Winner record not found');

    const recipientDob = payload.transferRecipientDob ? new Date(payload.transferRecipientDob) : null;

    const updated = await this.prisma.winner.update({
      where: { id },
      data: {
        transferRecipientName: payload.transferRecipientName,
        transferRecipientDob: recipientDob,
        transferRecipientUkara: payload.transferRecipientUkara || null,
        transferStatus: payload.transferStatus,
        transferAdminNotes: payload.transferAdminNotes || null,
        verificationStatus: 'TRANSFER_VERIFICATION_REQUIRED',
      },
      include: { user: true, raffle: true, ticket: true },
    });

    await this.prisma.auditLog.create({
      data: {
        userId: reviewerId || null,
        action: 'WINNER_TRANSFER_UPDATED',
        entityType: 'WINNER',
        entityId: id,
        details: `Transfer request updated for recipient: ${payload.transferRecipientName}, Status: ${payload.transferStatus}`,
      },
    });

    return updated;
  }

  async updateFulfillment(
    id: string,
    payload: {
      fulfillmentMethod?: string;
      packagingType?: string;
      discreetPackagingConfirmed?: boolean;
      courierName?: string;
      trackingNumber?: string;
      collectionStaffMember?: string;
      deliveryStatus?: string;
    },
    reviewerId?: string,
  ) {
    const winner = await this.prisma.winner.findUnique({
      where: { id },
      include: { raffle: true },
    });
    if (!winner) throw new NotFoundException('Winner record not found');

    const isRif = (winner.raffle?.prizeClassification || 'RIF') === 'RIF';
    if (isRif && !['APPROVED_FOR_FULFILMENT', 'SHIPPED', 'COLLECTED', 'COMPLETED'].includes(winner.verificationStatus)) {
      throw new BadRequestException('Cannot dispatch or collect a RIF prize before full age and UKARA verification approval.');
    }

    const updated = await this.prisma.winner.update({
      where: { id },
      data: {
        fulfillmentMethod: payload.fulfillmentMethod || winner.fulfillmentMethod,
        packagingType: payload.packagingType || winner.packagingType,
        discreetPackagingConfirmed: payload.discreetPackagingConfirmed !== undefined ? payload.discreetPackagingConfirmed : winner.discreetPackagingConfirmed,
        courierName: payload.courierName || winner.courierName,
        trackingNumber: payload.trackingNumber !== undefined ? payload.trackingNumber : winner.trackingNumber,
        collectionStaffMember: payload.collectionStaffMember || winner.collectionStaffMember,
        deliveryStatus: payload.deliveryStatus || (payload.fulfillmentMethod === 'OFFICE_COLLECTION' ? 'COLLECTED' : 'SHIPPED'),
        verificationStatus: payload.fulfillmentMethod === 'OFFICE_COLLECTION' ? 'COLLECTED' : 'SHIPPED',
      },
      include: { user: true, raffle: true, ticket: true },
    });

    await this.prisma.auditLog.create({
      data: {
        userId: reviewerId || null,
        action: 'WINNER_FULFILLMENT_UPDATED',
        entityType: 'WINNER',
        entityId: id,
        details: `Fulfillment method: ${payload.fulfillmentMethod || 'SHIPPED'}, Packaging: ${payload.packagingType || 'BOX'}, Tracking: ${payload.trackingNumber || 'N/A'}`,
      },
    });

    return updated;
  }
}
