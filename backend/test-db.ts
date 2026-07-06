import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const raffles = await prisma.raffle.findMany()
  console.log(raffles.map(r => ({ id: r.id, title: r.title, status: r.status, startDate: r.startDate, endDate: r.endDate })))
}
main()
