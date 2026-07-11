import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding dummy raffles for testing...');

  // 1. Get the host profile
  const hostUser = await prisma.user.findUnique({
    where: { email: 'host@airsoftdraw.demo' },
  });

  if (!hostUser) {
    console.log('Demo host not found! Run npx ts-node seed-demo.ts first.');
    return;
  }

  const hostProfile = await prisma.hostProfile.findUnique({
    where: { userId: hostUser.id },
  });

  if (!hostProfile) {
    console.log('Demo host profile not found!');
    return;
  }

  const hostId = hostProfile.id;

  // 2. Clear existing dummy raffles and their instant wins to start fresh
  const dummySlugs = [
    'tokyo-marui-m4a1-mws-gbbr',
    'vfc-glock-19x-gbb',
    'silverback-srs-a2-sniper',
    'crye-g3-combat-pants',
    'eotech-exps3-sight',
    'classic-army-nemesis-x9',
    'tm-hicapa-gold-match'
  ];

  const existingRaffles = await prisma.raffle.findMany({
    where: { slug: { in: dummySlugs } },
  });

  if (existingRaffles.length > 0) {
    const raffleIds = existingRaffles.map(r => r.id);
    
    // Delete instant wins first due to foreign key constraints
    await prisma.instantWin.deleteMany({
      where: { raffleId: { in: raffleIds } }
    });
    
    // Then delete the raffles
    await prisma.raffle.deleteMany({
      where: { id: { in: raffleIds } }
    });
    
    console.log(`Deleted ${existingRaffles.length} existing dummy raffles.`);
  }

  const now = new Date();
  
  // Helper to get dates
  const getPastDate = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  const getFutureDate = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  const dummyRaffles = [
    {
      title: 'Tokyo Marui M4A1 MWS Gas Blowback',
      slug: 'tokyo-marui-m4a1-mws-gbbr',
      category: 'Rifles',
      description: 'The legendary TM MWS. Incredible performance out of the box.',
      mainImage: 'https://placehold.co/800x600/1a230a/8cb34a?text=TM+M4A1+MWS',
      prizeName: 'TM M4A1 MWS',
      pricePerTicket: 2.50,
      totalTickets: 200,
      ticketsSold: 0,
      startDate: getPastDate(5),
      endDate: getFutureDate(2), // Ending soon
      status: 'ACTIVE',
      hostId
    },
    {
      title: 'VFC Glock 19X GBB Pistol',
      slug: 'vfc-glock-19x-gbb',
      category: 'Pistols',
      description: 'Fully licensed Glock 19X replica by VFC.',
      mainImage: 'https://placehold.co/800x600/1a230a/8cb34a?text=VFC+Glock+19X',
      prizeName: 'VFC Glock 19X',
      pricePerTicket: 1.00,
      totalTickets: 150,
      ticketsSold: 0,
      startDate: getPastDate(2),
      endDate: getFutureDate(10),
      status: 'ACTIVE',
      hostId
    },
    {
      title: 'Silverback SRS A2 Sniper Rifle',
      slug: 'silverback-srs-a2-sniper',
      category: 'Snipers',
      description: 'The ultimate airsoft sniper rifle. Bullpup design.',
      mainImage: 'https://placehold.co/800x600/1a230a/8cb34a?text=SRS+A2+Sniper',
      prizeName: 'SRS A2 Sniper',
      pricePerTicket: 5.00,
      totalTickets: 100,
      ticketsSold: 0, 
      startDate: getPastDate(10),
      endDate: getFutureDate(1), // Ending very soon
      status: 'ACTIVE',
      hostId
    },
    {
      title: 'Crye Precision G3 Combat Pants',
      slug: 'crye-g3-combat-pants',
      category: 'Gear',
      description: 'Multicam G3 combat pants, size 32R.',
      mainImage: 'https://placehold.co/800x600/1a230a/8cb34a?text=Crye+G3+Pants', 
      prizeName: 'Crye G3 Pants',
      pricePerTicket: 3.50,
      totalTickets: 75,
      ticketsSold: 0,
      startDate: getPastDate(1),
      endDate: getFutureDate(14),
      status: 'ACTIVE',
      hostId
    },
    {
      title: 'EOTECH EXPS3 Holographic Sight',
      slug: 'eotech-exps3-sight',
      category: 'Accessories',
      description: 'Real steel EOTECH sight for the ultimate mil-sim setup.',
      mainImage: 'https://placehold.co/800x600/1a230a/8cb34a?text=EOTECH+EXPS3',
      prizeName: 'EOTECH EXPS3',
      pricePerTicket: 4.00,
      totalTickets: 150,
      ticketsSold: 0,
      startDate: getFutureDate(2), // Upcoming
      endDate: getFutureDate(16),
      status: 'ACTIVE',
      hostId
    },
    {
      title: 'Classic Army Nemesis X9',
      slug: 'classic-army-nemesis-x9',
      category: 'Rifles',
      description: 'Compact 9mm style AR AEG, perfect for CQB.',
      mainImage: 'https://placehold.co/800x600/1a230a/8cb34a?text=Nemesis+X9',
      prizeName: 'Nemesis X9',
      pricePerTicket: 1.50,
      totalTickets: 250,
      ticketsSold: 0,
      startDate: getPastDate(20),
      endDate: getPastDate(1), // Past (Ended)
      status: 'ACTIVE', // Status is active but dates make it past
      hostId
    },
    {
      title: 'Tokyo Marui Hi-Capa 5.1 Gold Match',
      slug: 'tm-hicapa-gold-match',
      category: 'Gas Blowback',
      description: 'The gold standard for practical pistol shooting.',
      mainImage: 'https://placehold.co/800x600/1a230a/8cb34a?text=Hi-Capa+Gold',
      prizeName: 'TM Hi-Capa Gold',
      pricePerTicket: 2.00,
      totalTickets: 100,
      ticketsSold: 0,
      startDate: getPastDate(3),
      endDate: getFutureDate(7),
      status: 'ACTIVE',
      hostId
    },
  ];

  for (const raffle of dummyRaffles) {
    const createdRaffle = await prisma.raffle.create({
      data: raffle
    });
    console.log(`Created raffle: ${createdRaffle.title}`);

    // Add Instant Wins to some raffles (e.g., MWS and Hi-Capa)
    if (raffle.slug === 'tokyo-marui-m4a1-mws-gbbr') {
      await prisma.instantWin.createMany({
        data: [
          { raffleId: createdRaffle.id, ticketNumber: 15, prizeName: '£50 Site Voucher' },
          { raffleId: createdRaffle.id, ticketNumber: 55, prizeName: 'Gas Can' },
          { raffleId: createdRaffle.id, ticketNumber: 120, prizeName: 'BBs (0.28g)' }
        ]
      });
      console.log(` -> Added 3 Instant Wins for: ${createdRaffle.title}`);
    }

    if (raffle.slug === 'tm-hicapa-gold-match') {
      await prisma.instantWin.createMany({
        data: [
          { raffleId: createdRaffle.id, ticketNumber: 10, prizeName: 'Extra Mag' },
          { raffleId: createdRaffle.id, ticketNumber: 88, prizeName: 'Tracer Unit' }
        ]
      });
      console.log(` -> Added 2 Instant Wins for: ${createdRaffle.title}`);
    }
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
