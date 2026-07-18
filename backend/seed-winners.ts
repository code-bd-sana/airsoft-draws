import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding recent winners...');
  
  const baseUrl = process.env.APP_URL || 'http://127.0.0.1:5000';

  // 1. Create or ensure dummy users exist
  const dummyUsers = [
    { email: 'winner1@example.com', firstName: 'James', lastName: 'O.', location: 'London, UK', avatarUrl: `${baseUrl}/uploads/avatars/winner1.jpg` },
    { email: 'winner2@example.com', firstName: 'Sarah', lastName: 'T.', location: 'Manchester, UK', avatarUrl: `${baseUrl}/uploads/avatars/winner2.jpg` },
    { email: 'winner3@example.com', firstName: 'Michael', lastName: 'B.', location: 'Birmingham, UK', avatarUrl: `${baseUrl}/uploads/avatars/winner3.jpg` },
    { email: 'winner4@example.com', firstName: 'Emma', lastName: 'W.', location: 'Leeds, UK', avatarUrl: `${baseUrl}/uploads/avatars/winner4.jpg` },
  ];

  const createdUsers: any[] = [];
  for (const u of dummyUsers) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: { avatarUrl: u.avatarUrl, firstName: u.firstName, lastName: u.lastName, location: u.location, role: 'CLIENT' },
      create: { 
        email: u.email, 
        passwordHash: '$2b$10$EP0.b0Yp94xZ9/OaK8h.rOn1pL6eM36RXZRjLd8R6G3Hh.T66O7m6', // dummy 
        firstName: u.firstName, 
        lastName: u.lastName, 
        location: u.location, 
        avatarUrl: u.avatarUrl,
        role: 'CLIENT'
      }
    });
    createdUsers.push(user);
  }

  // Find host to create raffles if needed, or use existing active raffles
  let hostProfile = await prisma.hostProfile.findFirst();
  if (!hostProfile) {
    console.error('No host profile found. Cannot create raffles.');
    return;
  }

  // Let's create some dummy raffles that have just ended
  const pastDates = [
    new Date(Date.now() - 1000 * 60 * 60 * 24 * 1), // 1 day ago
    new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
  ];

  const dummyRaffles = [
    { title: 'Tokyo Marui NGRS', prizeName: 'Tokyo Marui NGRS', mainImage: `${baseUrl}/uploads/categories/rifles.jpg`, slug: 'past-tokyo-marui' },
    { title: 'Viper Tactical Bundle', prizeName: 'Viper Tactical Bundle', mainImage: `${baseUrl}/uploads/categories/tactical_vests.jpg`, slug: 'past-viper-bundle' },
    { title: 'Mystery Box Ultimate', prizeName: 'Mystery Box Ultimate', mainImage: `${baseUrl}/uploads/categories/mysterybox.jpg`, slug: 'past-mystery-box' },
    { title: 'Glock 19 Gen 4', prizeName: 'Glock 19 Gen 4', mainImage: `${baseUrl}/uploads/categories/pistols.jpg`, slug: 'past-glock-19' },
  ];

  const createdRaffles: any[] = [];
  for (let i = 0; i < dummyRaffles.length; i++) {
    const r = dummyRaffles[i];
    const raffle = await prisma.raffle.upsert({
      where: { slug: r.slug },
      update: { 
        status: 'ENDED', 
        endDate: pastDates[i], 
        mainImage: r.mainImage 
      },
      create: {
        hostId: hostProfile.id,
        title: r.title,
        slug: r.slug,
        prizeName: r.prizeName,
        mainImage: r.mainImage,
        description: `Ended competition for ${r.prizeName}`,
        pricePerTicket: 5.00,
        totalTickets: 100,
        ticketsSold: 100,
        startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
        endDate: pastDates[i],
        status: 'ENDED'
      }
    });
    createdRaffles.push(raffle);
  }

  // Now create tickets and winners
  for (let i = 0; i < createdRaffles.length; i++) {
    const raffle = createdRaffles[i];
    const user = createdUsers[i];

    // Check if winner exists for this raffle
    const existingWinner = await prisma.winner.findFirst({ where: { raffleId: raffle.id } });
    if (!existingWinner) {
      // 1. Create a dummy transaction
      const tx = await prisma.transaction.create({
        data: {
          userId: user.id,
          type: 'TICKET_PURCHASE',
          amount: 5.00,
          status: 'COMPLETED'
        }
      });

      // 2. Create a dummy ticket
      const ticket = await prisma.ticket.create({
        data: {
          raffleId: raffle.id,
          userId: user.id,
          transactionId: tx.id,
          ticketNumber: 42
        }
      });

      // 3. Create the winner
      const deliveryStatuses = ['DELIVERED', 'SHIPPED', 'DELIVERED', 'PENDING'];
      
      await prisma.winner.create({
        data: {
          userId: user.id,
          raffleId: raffle.id,
          ticketId: ticket.id,
          winType: 'MAIN_DRAW',
          prizeName: raffle.prizeName || 'Grand Prize',
          deliveryStatus: deliveryStatuses[i],
          verificationStatus: 'VERIFIED'
        }
      });
      console.log(`Created winner for ${raffle.title}`);
    } else {
      console.log(`Winner already exists for ${raffle.title}`);
    }
  }

  console.log('Winners seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
