import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding a Cash Prize competition...');

  // Get first host
  const host = await prisma.hostProfile.findFirst();
  if (!host) {
    console.log("No host found. Skipping.");
    return;
  }

  // Create cash prize raffle
  const cashRaffle = await prisma.raffle.create({
    data: {
      hostId: host.id,
      title: '£10,000 Tax-Free Cash',
      slug: '10k-tax-free-cash',
      description: 'Win a life-changing £10,000 tax-free cash! Sent directly to your bank account within minutes of winning.',
      mainImage: 'http://127.0.0.1:5000/uploads/categories/cash_prizes.jpg',
      prizeName: '£10,000 Cash',
      pricePerTicket: 4.99,
      totalTickets: 3000,
      ticketsSold: 852,
      startDate: new Date(),
      endDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      status: 'ACTIVE',
      isAutoDraw: true,
      category: 'cash-prizes',
    },
  });

  console.log(`Successfully added Cash Prize raffle: ${cashRaffle.title}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
