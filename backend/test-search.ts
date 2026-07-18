import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const raffles = await prisma.raffle.findMany({
    where: {
      OR: [
        { title: { contains: 'Mridula', mode: 'insensitive' } },
        { host: { businessName: { contains: 'Mridula', mode: 'insensitive' } } }
      ]
    },
    include: { host: true }
  });
  console.log(raffles.map(r => ({ title: r.title, host: r.host.businessName })));
}
main().catch(console.error).finally(() => prisma.$disconnect());
