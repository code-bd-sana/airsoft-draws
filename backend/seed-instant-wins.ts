import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Adding Instant Wins to an active raffle...');

  // Get an active raffle
  const activeRaffle = await prisma.raffle.findFirst({
    where: { status: 'ACTIVE' },
  });

  if (!activeRaffle) {
    console.error('No active raffles found to attach instant wins.');
    return;
  }

  // Create a couple of instant wins for this raffle
  const instantWinsData = [
    {
      raffleId: activeRaffle.id,
      ticketNumber: 50,
      prizeName: '£50 Site Credit',
    },
    {
      raffleId: activeRaffle.id,
      ticketNumber: 150,
      prizeName: 'Mystery Box Mini',
    },
    {
      raffleId: activeRaffle.id,
      ticketNumber: 220,
      prizeName: 'Extra 5 Tickets',
    }
  ];

  // Delete existing ones to avoid duplicates if re-running
  await prisma.instantWin.deleteMany({
    where: { raffleId: activeRaffle.id }
  });

  await prisma.instantWin.createMany({
    data: instantWinsData
  });

  console.log(`Successfully added 3 instant wins to the raffle: ${activeRaffle.title}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
