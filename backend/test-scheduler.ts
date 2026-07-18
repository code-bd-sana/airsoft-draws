import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const expiredRaffles = await prisma.raffle.findMany({
    where: {
      status: 'ENDED',
      OR: [
        { ticketsSold: { gte: prisma.raffle.fields.totalTickets } }
      ]
    },
    select: { title: true, ticketsSold: true, totalTickets: true }
  });
  console.log(expiredRaffles);
}
main().catch(console.error).finally(() => prisma.$disconnect());
