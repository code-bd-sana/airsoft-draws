import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import { Pool } from 'pg';
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding ACTIVE not-sold-out raffles...');

  const baseUrl = process.env.APP_URL || 'http://127.0.0.1:5000';

  const hostProfile = await prisma.hostProfile.findFirst();
  if (!hostProfile) {
    console.error('No host profile found. Cannot create raffles.');
    return;
  }

  // Active dates
  const startDate = new Date(Date.now() - 1000 * 60 * 60 * 24 * 5); // Started 5 days ago
  const endDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 10); // Ends in 10 days

  const activeRaffles = [
    {
      title: 'KRYTAC Trident MK2',
      prizeName: 'KRYTAC Trident MK2',
      mainImage: `${baseUrl}/uploads/categories/rifles.jpg`,
      slug: 'active-krytac',
      ticketsSold: 45,
      totalTickets: 250,
      category: 'rifles',
    },
    {
      title: 'Novritsch SSG10 A1',
      prizeName: 'Novritsch SSG10 A1',
      mainImage: `${baseUrl}/uploads/categories/sniper.jpg`,
      slug: 'active-ssg10',
      ticketsSold: 12,
      totalTickets: 150,
      category: 'sniper-rifles',
    },
    {
      title: 'Tokyo Marui Hi-Capa 5.1',
      prizeName: 'Tokyo Marui Hi-Capa 5.1',
      mainImage: `${baseUrl}/uploads/categories/pistols.jpg`,
      slug: 'active-hi-capa',
      ticketsSold: 89,
      totalTickets: 200,
      category: 'pistols',
    },
    {
      title: 'Dye i5 Goggle',
      prizeName: 'Dye i5 Goggle',
      mainImage: `${baseUrl}/uploads/categories/gear_and_apparel.jpg`,
      slug: 'active-dye-i5',
      ticketsSold: 110,
      totalTickets: 300,
      category: 'gear-and-apparel',
    },
  ];

  for (const r of activeRaffles) {
    await prisma.raffle.upsert({
      where: { slug: r.slug },
      update: {
        status: 'ACTIVE',
        endDate: endDate,
        mainImage: r.mainImage,
        ticketsSold: r.ticketsSold,
        totalTickets: r.totalTickets,
      },
      create: {
        hostId: hostProfile.id,
        title: r.title,
        slug: r.slug,
        prizeName: r.prizeName,
        mainImage: r.mainImage,
        category: r.category,
        description: `Amazing active competition for ${r.prizeName}. Grab your tickets before they run out!`,
        pricePerTicket: 2.5,
        totalTickets: r.totalTickets,
        ticketsSold: r.ticketsSold,
        startDate: startDate,
        endDate: endDate,
        status: 'ACTIVE',
      },
    });
    console.log(`Created/Updated ACTIVE raffle: ${r.title}`);
  }

  console.log('Active raffles seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
