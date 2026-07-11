import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding subscription plans...');

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      durationDays: 30,
      maxActiveRaffles: 3,
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 29,
      durationDays: 30,
      maxActiveRaffles: null,
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 79,
      durationDays: 30,
      maxActiveRaffles: null,
    }
  ];

  for (const plan of plans) {
    await prisma.subscriptionPlan.upsert({
      where: { id: plan.id },
      update: {
        name: plan.name,
        price: plan.price,
        durationDays: plan.durationDays,
        maxActiveRaffles: plan.maxActiveRaffles,
      },
      create: {
        id: plan.id,
        name: plan.name,
        price: plan.price,
        durationDays: plan.durationDays,
        maxActiveRaffles: plan.maxActiveRaffles,
      },
    });
    console.log(`Upserted plan: ${plan.name}`);
  }

  console.log('Subscription plans seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
