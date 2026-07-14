import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import { Pool } from 'pg';
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding categories with new images...');

  const baseUrl = process.env.APP_URL || 'http://127.0.0.1:5000';

  const categoriesToSeed = [
    {
      name: 'Airsoft Rifles',
      slug: 'airsoft-rifles',
      icon: 'Crosshair',
      isActive: true,
      image: `${baseUrl}/uploads/categories/rifles.jpg`,
    },
    {
      name: 'Pistols',
      slug: 'pistols',
      icon: 'Gun',
      isActive: true,
      image: `${baseUrl}/uploads/categories/pistols.jpg`,
    },
    {
      name: 'Sniper Rifles',
      slug: 'sniper-rifles',
      icon: 'Crosshair',
      isActive: true,
      image: `${baseUrl}/uploads/categories/sniper.jpg`,
    },
    {
      name: 'Shotguns',
      slug: 'shotguns',
      icon: 'Gun',
      isActive: true,
      image: `${baseUrl}/uploads/categories/shotgun.jpg`,
    },
    {
      name: 'Optics & Sights',
      slug: 'optics-sights',
      icon: 'Target',
      isActive: true,
      image: `${baseUrl}/uploads/categories/optics.jpg`,
    },
    {
      name: 'Gear & Apparel',
      slug: 'gear-and-apparel',
      icon: 'Helmet',
      isActive: true,
      image: `${baseUrl}/uploads/categories/gear_and_apparel.jpg`,
    },
    {
      name: 'Tactical Vests',
      slug: 'tactical-vests',
      icon: 'Shield',
      isActive: true,
      image: `${baseUrl}/uploads/categories/tactical_vests.jpg`,
    },
    {
      name: 'Accessories',
      slug: 'accessories',
      icon: 'Ammo',
      isActive: true,
      image: `${baseUrl}/uploads/categories/accessories.jpg`,
    },
    {
      name: 'BBs & Gas',
      slug: 'bbs-and-gas',
      icon: 'Ammo',
      isActive: true,
      image: `${baseUrl}/uploads/categories/bbs.png`,
    },
    {
      name: 'Bundles',
      slug: 'bundles',
      icon: 'Star',
      isActive: true,
      image: `${baseUrl}/uploads/categories/bundles.jpg`,
    },
    {
      name: 'Mystery Box',
      slug: 'mystery-box',
      icon: 'Star',
      isActive: true,
      image: `${baseUrl}/uploads/categories/mysterybox.jpg`,
    },
    {
      name: 'Cash Prizes',
      slug: 'cash-prizes',
      icon: 'Star',
      isActive: true,
      image: `${baseUrl}/uploads/categories/cash_prizes.jpg`,
    },
  ];

  for (const cat of categoriesToSeed) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        icon: cat.icon,
        image: cat.image,
        name: cat.name,
        isActive: cat.isActive,
      },
      create: cat,
    });
    console.log(`Seeded category: ${cat.name}`);
  }

  console.log('Categories seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
