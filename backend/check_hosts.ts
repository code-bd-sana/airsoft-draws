import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const hosts = await prisma.hostProfile.findMany();
  console.log('All Hosts:', hosts.map(h => ({ id: h.id, businessName: h.businessName, isVerified: h.isVerified })));
}
main().catch(console.error).finally(() => prisma.$disconnect());
