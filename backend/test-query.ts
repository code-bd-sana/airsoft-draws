import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const raffles = await prisma.raffle.findMany({
    select: {
      id: true,
      title: true,
      status: true,
      startDate: true,
      endDate: true,
      category: true,
      slug: true,
    }
  });
  console.log(JSON.stringify(raffles, null, 2));
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
