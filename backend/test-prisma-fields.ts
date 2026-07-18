import { PrismaClient } from '@prisma/client';
console.log(new PrismaClient().raffle?.fields?.totalTickets);
