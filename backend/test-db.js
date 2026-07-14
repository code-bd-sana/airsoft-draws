const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const raffles = await prisma.raffle.findMany();
  console.log('Total raffles:', raffles.length);
  console.log('Active raffles:', raffles.filter(r => r.status === 'ACTIVE').length);
}
main().catch(console.error).finally(() => prisma.$disconnect());
