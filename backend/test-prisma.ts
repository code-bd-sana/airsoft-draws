import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const raffle = await prisma.raffle.findFirst({
      where: { slug: 'tokyo-marui-mws-gbbr-z6ox9v', status: 'ACTIVE' },
      include: { 
        host: { include: { user: true } },
        instantWins: true 
      }
    });
    console.log(raffle);
  } catch (e) {
    console.error("PRISMA ERROR:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
