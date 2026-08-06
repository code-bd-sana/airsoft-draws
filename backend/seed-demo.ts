import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const salt = await bcrypt.genSalt(10);

  // 1. Admin
  const adminPassword = await bcrypt.hash('admin@gmail.com', salt);
  await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: {
      passwordHash: adminPassword,
      role: 'ADMIN',
      isEmailVerified: true,
      firstName: 'System',
      lastName: 'Admin',
    },
    create: {
      email: 'admin@gmail.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
      isEmailVerified: true,
      firstName: 'System',
      lastName: 'Admin',
    },
  });

  // 2. Host
  const hostPassword = await bcrypt.hash('host@gmail.com', salt);
  const hostUser = await prisma.user.upsert({
    where: { email: 'host@gmail.com' },
    update: {
      passwordHash: hostPassword,
      role: 'HOST',
      isEmailVerified: true,
      firstName: 'Tactical',
      lastName: 'Host',
    },
    create: {
      email: 'host@gmail.com',
      passwordHash: hostPassword,
      role: 'HOST',
      isEmailVerified: true,
      firstName: 'Tactical',
      lastName: 'Host',
    },
  });

  const hostProfile = await prisma.hostProfile.findUnique({
    where: { userId: hostUser.id },
  });
  if (!hostProfile) {
    await prisma.hostProfile.create({
      data: {
        userId: hostUser.id,
        businessName: 'Airsoft Tactical Armory',
        slug: 'airsoft-tactical-armory',
        bio: 'Official verified supplier of custom airsoft builds.',
        isVerified: true,
        walletBalance: 150.00,
      },
    });
  }

  // 3. Client
  const clientPassword = await bcrypt.hash('client@gmail.com', salt);
  await prisma.user.upsert({
    where: { email: 'client@gmail.com' },
    update: {
      passwordHash: clientPassword,
      role: 'CLIENT',
      isEmailVerified: true,
      firstName: 'John',
      lastName: 'Player',
    },
    create: {
      email: 'client@gmail.com',
      passwordHash: clientPassword,
      role: 'CLIENT',
      isEmailVerified: true,
      firstName: 'John',
      lastName: 'Player',
    },
  });

  console.log('Seed demo completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
