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
      firstName: 'Demo',
      lastName: 'Admin'
    },
    create: {
      email: 'admin@gmail.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
      isEmailVerified: true,
      firstName: 'Demo',
      lastName: 'Admin'
    },
  });

  // 2. Host
  const hostPassword = await bcrypt.hash('password123', salt);
  const hostUser = await prisma.user.upsert({
    where: { email: 'host@airsoftdraw.demo' },
    update: {
      passwordHash: hostPassword,
      role: 'HOST',
      isEmailVerified: true,
      firstName: 'Demo',
      lastName: 'Host'
    },
    create: {
      email: 'host@airsoftdraw.demo',
      passwordHash: hostPassword,
      role: 'HOST',
      isEmailVerified: true,
      firstName: 'Demo',
      lastName: 'Host'
    },
  });
  
  // Create host profile if missing
  const hostProfile = await prisma.hostProfile.findUnique({ where: { userId: hostUser.id } });
  if (!hostProfile) {
    await prisma.hostProfile.create({
      data: {
        userId: hostUser.id,
        businessName: 'Demo Host Business',
        isVerified: true,
      }
    });
  }

  // 3. Client
  const clientPassword = await bcrypt.hash('password123', salt);
  await prisma.user.upsert({
    where: { email: 'user@airsoftdraw.demo' },
    update: {
      passwordHash: clientPassword,
      role: 'CLIENT',
      isEmailVerified: true,
      firstName: 'Demo',
      lastName: 'User'
    },
    create: {
      email: 'user@airsoftdraw.demo',
      passwordHash: clientPassword,
      role: 'CLIENT',
      isEmailVerified: true,
      firstName: 'Demo',
      lastName: 'User'
    },
  });

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
