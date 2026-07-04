import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
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

    const isPasswordValid = await bcrypt.compare(changePasswordDto.currentPassword, user.passwordHash);
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
      include: { hostProfile: true }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { businessName, ...userData } = updateProfileDto;

    const updatedUser = await this.prisma.$transaction(async (prisma) => {
      const u = await prisma.user.update({
        where: { id: userId },
        data: userData,
        include: { hostProfile: true }
      });

      if (u.role === 'HOST' && businessName !== undefined) {
        if (u.hostProfile) {
          await prisma.hostProfile.update({
            where: { userId },
            data: { businessName }
          });
        } else {
          await prisma.hostProfile.create({
            data: { userId, businessName }
          });
        }
      }
      return prisma.user.findUnique({
        where: { id: userId },
        include: { hostProfile: true }
      });
    });

    const { passwordHash, ...userWithoutPassword } = updatedUser!;
    return { message: 'Profile updated successfully', user: userWithoutPassword };
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
    return { message: 'Avatar updated successfully', user: userWithoutPassword };
  }
}
