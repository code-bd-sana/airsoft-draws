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
      name: 'Free',
      price: 0,
      durationDays: 30,
      maxActiveRaffles: 1,
    },
    {
      name: 'Premium',
      price: 29,
      durationDays: 30,
      maxActiveRaffles: 3,
    },
    {
      name: 'Pro',
      price: 79,
      durationDays: 30,
      maxActiveRaffles: null,
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
      existingPlan = await prisma.subscriptionPlan.update({
        where: { id: existingPlan.id },
        data: plan,
      });
      console.log(`✅ Updated plan: ${plan.name}`);
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
  const adminEmail = process.env.ADMIN_EMAIL || 'info@airsoftdraws.com';
  const adminPasswordPlain = process.env.ADMIN_PASSWORD || 'Milobrodiejessie';
  const adminPassword = await bcrypt.hash(adminPasswordPlain, salt);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash: adminPassword,
      role: 'ADMIN',
      isEmailVerified: true,
      firstName: 'System',
      lastName: 'Admin',
    },
    create: {
      email: adminEmail,
      passwordHash: adminPassword,
      role: 'ADMIN',
      isEmailVerified: true,
      firstName: 'System',
      lastName: 'Admin',
    },
  });
  console.log(`✅ Admin Account ready (Email: ${adminEmail} | Pass: ${adminPasswordPlain})`);

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

  // 6. Seed Sample Active Competitions
  console.log('Seeding Sample Active Competitions...');
  const sampleCompetitions = [
    {
      title: 'Tokyo Marui M4A1 MWS Gas Blowback Rifle',
      slug: 'tokyo-marui-m4a1-mws-gbb',
      category: 'Airsoft Rifles',
      prizeClassification: 'RIF',
      description: 'The pinnacle of gas blowback performance featuring the legendary ZET system, CNC aluminum receiver, authentic Colt markings, and crisp cycling recoil.',
      mainImage: 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?q=80&w=600&auto=format&fit=crop',
      mainPrizeValue: 620.00,
      pricePerTicket: 3.50,
      totalTickets: 250,
      ticketsSold: 140,
      startDate: new Date(),
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      status: 'ACTIVE',
      isAutoDraw: true,
      autoDrawDate: true,
      autoDrawSoldOut: false,
      minTickets: 1,
      maxTickets: 30,
    },
    {
      title: 'G&G CM16 Raider 2.0 AEG Rifle',
      slug: 'gg-cm16-raider-2-aeg',
      category: 'Airsoft Rifles',
      prizeClassification: 'RIF',
      description: 'The definitive skirmish weapon. Upgraded version 2 gearbox, rotary hop-up unit, lightweight polymer body, and high-torque motor.',
      mainImage: 'https://images.unsplash.com/photo-1584281729288-89826ac97b0b?q=80&w=600&auto=format&fit=crop',
      mainPrizeValue: 240.00,
      pricePerTicket: 1.50,
      totalTickets: 200,
      ticketsSold: 95,
      startDate: new Date(),
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
      status: 'ACTIVE',
      isAutoDraw: true,
      autoDrawDate: true,
      autoDrawSoldOut: false,
      minTickets: 1,
      maxTickets: 25,
    },
    {
      title: 'Krytac Trident MK2 CRB-M Rifle',
      slug: 'krytac-trident-mk2-crb-m',
      category: 'Airsoft Rifles',
      prizeClassification: 'RIF',
      description: 'Engineered for tournament and CQB performance. Features an integrated Nautilus 8mm bearing gearbox, Defiance TR110 M-LOK rail, and ambidextrous selector.',
      mainImage: 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?q=80&w=600&auto=format&fit=crop',
      mainPrizeValue: 480.00,
      pricePerTicket: 2.75,
      totalTickets: 220,
      ticketsSold: 180,
      startDate: new Date(),
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
      status: 'ACTIVE',
      isAutoDraw: true,
      autoDrawDate: true,
      autoDrawSoldOut: false,
      minTickets: 1,
      maxTickets: 20,
    },
    {
      title: 'Tokyo Marui Hi-Capa 5.1 Custom Gold Match',
      slug: 'tm-hi-capa-5-1-gold-match',
      category: 'Airsoft Pistols',
      prizeClassification: 'RIF',
      description: 'The standard of competitive IPSC airsoft pistols. Upgraded gold accents, fiber-optic front sight, lightened slide, and rail mount.',
      mainImage: 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?q=80&w=600&auto=format&fit=crop',
      mainPrizeValue: 210.00,
      pricePerTicket: 2.00,
      totalTickets: 150,
      ticketsSold: 75,
      startDate: new Date(),
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4),
      status: 'ACTIVE',
      isAutoDraw: true,
      autoDrawDate: true,
      autoDrawSoldOut: false,
      minTickets: 1,
      maxTickets: 15,
    },
    {
      title: 'Vortex Crossfire II 1-4x24 Riflescope',
      slug: 'vortex-crossfire-ii-1-4x24-scope',
      category: 'Accessories',
      prizeClassification: 'ACCESSORY',
      description: 'Crystal-clear illuminated V-Brite reticle with fully multi-coated lenses, fast-focus eyepiece, and aircraft-grade aluminum tube.',
      mainImage: 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?q=80&w=600&auto=format&fit=crop',
      mainPrizeValue: 290.00,
      pricePerTicket: 1.50,
      totalTickets: 240,
      ticketsSold: 110,
      startDate: new Date(),
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 6),
      status: 'ACTIVE',
      isAutoDraw: true,
      autoDrawDate: true,
      autoDrawSoldOut: false,
      minTickets: 1,
      maxTickets: 25,
    },
  ];

  for (const comp of sampleCompetitions) {
    const existing = await prisma.raffle.findUnique({ where: { slug: comp.slug } });
    if (!existing) {
      await prisma.raffle.create({
        data: {
          ...comp,
          hostId: hostProfile.id,
        },
      });
      console.log(`✅ Created competition: ${comp.title}`);
    }
  }

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
