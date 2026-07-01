# Database Design Guide for Airsoft Draws

Designing a robust database is the most critical step for your backend architecture, especially for a raffle platform where transactions (ticket purchases) and data integrity are paramount. 

Follow this step-by-step guide to design your PostgreSQL database using Prisma.

---

## Step 1: Identify the Core Entities (Requirements Gathering)
First, list out all the "nouns" in your system. What are the main objects your application needs to store data about?

For **Airsoft Draws**, the core entities will likely be:
1. **User**: The people using the platform (Customers, Hosts, Admins).
2. **Raffle (or Draw/Competition)**: The event where prizes are given out.
3. **Ticket**: The individual entries purchased by users for a specific raffle.
4. **Prize**: The item(s) being given away in a raffle.
5. **Payment/Transaction**: The record of a user paying for tickets.
6. **HostProfile**: Specific details for verified hosts (business name, verification status).

---

## Step 2: Define the Relationships (Conceptual Design)
Determine how these entities relate to one another. 
- **1-to-1 (1:1)**: A `User` (if they are a host) has ONE `HostProfile`.
- **1-to-Many (1:N)**: A `User` can buy MANY `Tickets`. A `Raffle` has MANY `Tickets`. A `Host` can create MANY `Raffles`.
- **Many-to-Many (M:N)**: Generally, try to resolve these with a junction table. For example, a `User` buys `Tickets` in a `Raffle`. The `Ticket` table acts as the junction between `User` and `Raffle`.

---

## Step 3: Define Attributes and Data Types (Logical Design)
For each entity, determine what data it holds. Always use standard PostgreSQL types via Prisma.

**Crucial Fields Every Table Should Have:**
- `id`: A unique identifier (Use UUIDs or CUIDs in Prisma, e.g., `@default(uuid())` or `@default(cuid())`). CUIDs are great for distributed systems.
- `createdAt`: Timestamp of when the record was created (`@default(now())`).
- `updatedAt`: Timestamp of the last update (`@updatedAt`).
- `deletedAt`: Optional (used for "Soft Deletes" so you don't actually delete data, just hide it).

---

## Step 4: Draft the Schema (Prisma Example)
Here is a starting blueprint for how you should structure your `schema.prisma`. 

```prisma
// This is a draft schema to guide your thinking

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String
  firstName     String?
  lastName      String?
  role          Role      @default(CUSTOMER) // Enum: CUSTOMER, HOST, ADMIN
  
  // Relations
  hostProfile   HostProfile? 
  tickets       Ticket[]
  payments      Payment[]
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

enum Role {
  CUSTOMER
  HOST
  ADMIN
}

model HostProfile {
  id              String   @id @default(cuid())
  businessName    String
  isVerified      Boolean  @default(false)
  
  // Relation back to User
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id])
  
  raffles         Raffle[] // A host can have many raffles
}

model Raffle {
  id              String   @id @default(cuid())
  title           String
  description     String
  pricePerTicket  Decimal  @db.Decimal(10, 2)
  maxTickets      Int
  ticketsSold     Int      @default(0)
  startDate       DateTime
  endDate         DateTime
  status          RaffleStatus @default(DRAFT) // Enum: DRAFT, ACTIVE, ENDED, CANCELLED
  
  // Relations
  hostId          String
  host            HostProfile @relation(fields: [hostId], references: [id])
  tickets         Ticket[]
}

enum RaffleStatus {
  DRAFT
  ACTIVE
  ENDED
  CANCELLED
}

model Ticket {
  id          String   @id @default(cuid())
  ticketNumber Int     // e.g., Ticket #45 out of 100
  
  // Relations
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  
  raffleId    String
  raffle      Raffle   @relation(fields: [raffleId], references: [id])
  
  paymentId   String
  payment     Payment  @relation(fields: [paymentId], references: [id])
  
  isWinner    Boolean  @default(false)
  
  createdAt   DateTime @default(now())
  
  // Ensure a specific ticket number in a specific raffle is completely unique
  @@unique([raffleId, ticketNumber]) 
}

model Payment {
  id            String   @id @default(cuid())
  amount        Decimal  @db.Decimal(10, 2)
  status        PaymentStatus @default(PENDING) // Enum: PENDING, COMPLETED, FAILED
  stripeId      String?  @unique
  
  // Relations
  userId        String
  user          User     @relation(fields: [userId], references: [id])
  tickets       Ticket[]
  
  createdAt     DateTime @default(now())
}

enum PaymentStatus {
  PENDING
  COMPLETED
  FAILED
}
```

---

## Step 5: Normalization vs. Denormalization
- **Normalization**: Keep data in one place to avoid inconsistencies. (e.g., Don't put the User's Email inside the Ticket table).
- **Denormalization (For Performance)**: Sometimes it's okay to duplicate data for speed. In the example above, `Raffle.ticketsSold` is a denormalized field. Instead of counting all tickets in the `Ticket` table every time someone loads the homepage, we keep a running tally in the `Raffle` table. 

## Step 6: Plan for Concurrency and Transactions
In a raffle, two people might try to buy the last ticket at the exact same millisecond. 
- Your database design MUST support transactions. 
- When a user buys a ticket, you will use Prisma's `$transaction` API to:
  1. Create the `Payment`.
  2. Create the `Ticket` records.
  3. Increment `Raffle.ticketsSold`.
  If any of these fail, the whole transaction rolls back, preventing data corruption.

## Step 7: Indexing Strategy
To make your app fast, you must index columns that you search or filter by often.
- Primary Keys (`id`) and `@unique` fields are automatically indexed.
- You should add indexes to fields like `Raffle.status` or `Raffle.endDate` if you frequently run queries like *"Find all ACTIVE raffles ending this week"*. 
- In Prisma, you add indexes using `@@index([columnName])` at the bottom of the model.

---

### Your Next Action:
1. Review the draft schema above.
2. Discuss with your team (or me) if there are any specific features (like "Instant Wins" or "Coupons/Discounts") that need to be added to this schema.
3. Once we agree on the exact tables and fields, we can apply this schema to your codebase using `prisma format` and `prisma migrate dev`.
