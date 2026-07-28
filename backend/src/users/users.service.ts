import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid current password');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(changePasswordDto.newPassword, salt);

    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    return { message: 'Password updated successfully' };
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { hostProfile: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { businessName, bio, ...userData } = updateProfileDto;

    const updatedUser = await this.prisma.$transaction(async (prisma) => {
      const u = await prisma.user.update({
        where: { id: userId },
        data: userData,
        include: { hostProfile: true },
      });

      if (u.role === 'HOST') {
        const hostProfileData: any = {};
        if (businessName !== undefined)
          hostProfileData.businessName = businessName;
        if (bio !== undefined) hostProfileData.bio = bio;
        if (userData.phone !== undefined)
          hostProfileData.phone = userData.phone;
        if (userData.address !== undefined)
          hostProfileData.address = userData.address;

        if (Object.keys(hostProfileData).length > 0) {
          if (u.hostProfile) {
            await prisma.hostProfile.update({
              where: { userId },
              data: hostProfileData,
            });
          } else if (businessName !== undefined) {
            // Need businessName at minimum to create
            await prisma.hostProfile.create({
              data: { userId, ...hostProfileData },
            });
          }
        }
      }
      return prisma.user.findUnique({
        where: { id: userId },
        include: { hostProfile: true },
      });
    });

    const { passwordHash, ...userWithoutPassword } = updatedUser!;
    return {
      message: 'Profile updated successfully',
      user: userWithoutPassword,
    };
  }

  async updateAvatar(userId: string, avatarUrl: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { avatarUrl },
    });

    const { passwordHash, ...userWithoutPassword } = updatedUser;
    return {
      message: 'Avatar updated successfully',
      user: userWithoutPassword,
    };
  }

  async getMyWinners(userId: string) {
    const winners = await this.prisma.winner.findMany({
      where: { userId },
      include: {
        raffle: {
          include: {
            host: true,
            instantWins: true,
          },
        },
        ticket: {
          select: {
            ticketNumber: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return winners.map((w) => {
      const instantWinDetails =
        w.winType === 'INSTANT_WIN'
          ? w.raffle.instantWins.find(
              (iw) => iw.ticketNumber === w.ticket.ticketNumber,
            )
          : null;

      const prizeImage =
        w.winType === 'INSTANT_WIN'
          ? instantWinDetails?.image || w.raffle.mainImage
          : w.raffle.mainImage;

      const prizeName =
        w.prizeName ||
        (w.winType === 'INSTANT_WIN'
          ? instantWinDetails?.prizeName
          : w.raffle.prizeName);

      return {
        id: w.id,
        raffleId: w.raffleId,
        ticketId: w.ticketId,
        winType: w.winType, // 'INSTANT_WIN' | 'MAIN_DRAW'
        prizeName: prizeName || 'Prize',
        prizeImage: prizeImage || null,
        rrpValue: instantWinDetails?.rrpValue
          ? Number(instantWinDetails.rrpValue)
          : w.raffle.mainPrizeValue
            ? Number(w.raffle.mainPrizeValue)
            : null,
        ticketNumber: w.ticket.ticketNumber,
        deliveryStatus: w.deliveryStatus,
        verificationStatus: w.verificationStatus,
        trackingNumber: w.trackingNumber,
        createdAt: w.createdAt,
        raffle: {
          id: w.raffle.id,
          title: w.raffle.title,
          slug: w.raffle.slug,
          mainImage: w.raffle.mainImage,
          hostBusinessName: w.raffle.host?.businessName || 'Host',
          status: w.raffle.status,
        },
        instantWinDetails: instantWinDetails
          ? {
              id: instantWinDetails.id,
              prizeName: instantWinDetails.prizeName,
              image: instantWinDetails.image,
              rrpValue: instantWinDetails.rrpValue
                ? Number(instantWinDetails.rrpValue)
                : null,
            }
          : null,
      };
    });
  }
}

