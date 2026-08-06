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
  console.log('🌱 Starting Database Seeding...');

  // 1. Seed Subscription Plans
  console.log('Seeding Subscription Plans...');
  const plans = [
    {
      name: 'Premium',
      price: 29.99,
      durationDays: 30,
      maxActiveRaffles: 5,
    },
    {
      name: 'Pro',
      price: 99.99,
      durationDays: 30,
      maxActiveRaffles: 999999,
    },
  ];

  const createdPlans: any[] = [];
  for (const plan of plans) {
    let existingPlan = await prisma.subscriptionPlan.findFirst({
      where: { name: plan.name },
    });

    if (!existingPlan) {
      existingPlan = await prisma.subscriptionPlan.create({ data: plan });
      console.log(`✅ Created plan: ${plan.name}`);
    } else {
      console.log(`ℹ️ Plan already exists: ${plan.name}`);
    }
    createdPlans.push(existingPlan);
  }

  // 2. Seed Categories
  console.log('Seeding Categories...');
  const categories = [
    { name: 'AEG Rifles', slug: 'aeg-rifles' },
    { name: 'GBB Pistols', slug: 'gbb-pistols' },
    { name: 'Sniper Rifles', slug: 'sniper-rifles' },
    { name: 'Tactical Gear', slug: 'tactical-gear' },
  ];

  for (const cat of categories) {
    const existingCat = await prisma.category.findUnique({
      where: { slug: cat.slug },
    });
    if (!existingCat) {
      await prisma.category.create({ data: cat });
      console.log(`✅ Created category: ${cat.name}`);
    }
  }

  const salt = await bcrypt.genSalt(10);

  // 3. Seed Admin Account
  console.log('Seeding Admin Account...');
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
  console.log('✅ Admin Account ready (Email: admin@gmail.com | Pass: admin@gmail.com)');

  // 4. Seed Host Account
  console.log('Seeding Host Account...');
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

  // Ensure Host Profile exists
  let hostProfile = await prisma.hostProfile.findUnique({
    where: { userId: hostUser.id },
  });

  if (!hostProfile) {
    hostProfile = await prisma.hostProfile.create({
      data: {
        userId: hostUser.id,
        businessName: 'Airsoft Tactical Armory',
        slug: 'airsoft-tactical-armory',
        bio: 'Official verified supplier of custom airsoft builds.',
        isVerified: true,
        walletBalance: 150.00,
      },
    });
    console.log('✅ Created Host Profile');
  }

  // Active Host Subscription
  const proPlan = createdPlans.find((p) => p.name === 'Pro') || createdPlans[0];
  const existingSub = await prisma.hostSubscription.findFirst({
    where: { hostId: hostProfile.id, status: 'ACTIVE' },
  });

  if (!existingSub && proPlan) {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);

    await prisma.hostSubscription.create({
      data: {
        hostId: hostProfile.id,
        planId: proPlan.id,
        status: 'ACTIVE',
        startDate,
        endDate,
      },
    });
    console.log('✅ Created Active Host Subscription');
  }

  console.log('✅ Host Account ready (Email: host@gmail.com | Pass: host@gmail.com)');

  // 5. Seed Client Account
  console.log('Seeding Client Account...');
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
  console.log('✅ Client Account ready (Email: client@gmail.com | Pass: client@gmail.com)');

  console.log('🚀 Seeding Completed Successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
