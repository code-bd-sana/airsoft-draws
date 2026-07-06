import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding Subscription Plans...');
  
  const plans = [
    {
      name: 'Free Tier',
      price: 0.00,
      durationDays: 30,
      maxActiveRaffles: 1,
    },
    {
      name: 'Premium',
      price: 29.99,
      durationDays: 30,
      maxActiveRaffles: 5,
    },
    {
      name: 'Pro',
      price: 99.99,
      durationDays: 30,
      maxActiveRaffles: 999999, // Uncapped basically
    }
  ];

  for (const plan of plans) {
    const existingPlan = await prisma.subscriptionPlan.findFirst({
      where: { name: plan.name }
    });

    if (!existingPlan) {
      await prisma.subscriptionPlan.create({ data: plan });
      console.log(`Created plan: ${plan.name}`);
    } else {
      console.log(`Plan already exists: ${plan.name}`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
