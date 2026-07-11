import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding dummy raffles for testing...');

  const hostUser = await prisma.user.findUnique({
    where: { email: 'host@airsoftdraw.demo' },
  });

  if (!hostUser) {
    console.log('Demo host not found! Run npx ts-node seed-demo.ts first.');
    return;
  }

  const hostProfile = await prisma.hostProfile.findUnique({
    where: { userId: hostUser.id },
  });

  if (!hostProfile) {
    console.log('Demo host profile not found!');
    return;
  }

  const hostId = hostProfile.id;

  const fiestaSlugs = [
    'instant-win-fiesta-1',
    'instant-win-fiesta-2',
    'instant-win-fiesta-3',
    'instant-win-fiesta-4',
    'instant-win-fiesta-5'
  ];

  // Delete existing Fiestas if any
  const existingFiestas = await prisma.raffle.findMany({
    where: { slug: { in: fiestaSlugs } },
  });

  if (existingFiestas.length > 0) {
    const raffleIds = existingFiestas.map(r => r.id);
    await prisma.winner.deleteMany({ where: { raffleId: { in: raffleIds } } });
    await prisma.ticket.deleteMany({ where: { raffleId: { in: raffleIds } } });
    await prisma.instantWin.deleteMany({ where: { raffleId: { in: raffleIds } } });
    await prisma.raffle.deleteMany({ where: { id: { in: raffleIds } } });
  }

  const now = new Date();
  const getFutureDate = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  const fiestaRaffles = fiestaSlugs.map((slug, i) => ({
    title: `Instant Win Fiesta #${i + 1}`,
    slug,
    category: 'Bundles',
    description: `A special testing competition where EVERY ticket is an instant win! Buy a ticket and enjoy the animation.`,
    mainImage: `https://placehold.co/800x600/1a230a/eab308?text=Fiesta+%23${i + 1}`,
    prizeName: `Fiesta Grand Prize #${i + 1}`,
    pricePerTicket: 0.50,
    totalTickets: 20,
    ticketsSold: 0,
    startDate: now,
    endDate: getFutureDate(30),
    status: 'ACTIVE',
    hostId
  }));

  for (const raffle of fiestaRaffles) {
    const createdRaffle = await prisma.raffle.create({ data: raffle });
    console.log(`Created fiesta: ${createdRaffle.title}`);

    // Create 20 instant wins for tickets 1 through 20
    const instantWinsData = Array.from({ length: 20 }, (_, index) => {
      const ticketNumber = index + 1;
      const prizes = ['£10 Site Credit', 'Mystery Box', 'Gas Can', 'Tracer Unit', 'Speedloader', 'Patch Bundle'];
      const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];
      return {
        raffleId: createdRaffle.id,
        ticketNumber,
        prizeName: randomPrize
      };
    });

    await prisma.instantWin.createMany({ data: instantWinsData });
    console.log(` -> Added 20 Instant Wins for: ${createdRaffle.title}`);
  }

  console.log('Fiesta Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
