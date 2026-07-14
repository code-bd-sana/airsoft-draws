# Airsoft Draws - Project Analysis & Report

## 1. Project Overview & Site Description
**Airsoft Draws** is a B2B2C Raffle and Competition platform specifically tailored for airsoft gear. The platform allows verified "Hosts" (businesses or individuals) to run raffles, while "Users" (clients) purchase tickets to participate in these draws, potentially winning either instantly or via a main draw. 

The architecture is decoupled:
- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS v4.
- **Backend:** NestJS, PostgreSQL, Prisma ORM.

## 2. API List (Architecture Design)
The backend uses RESTful principles with versioned routes (`/api/v1/...`). Below is the structured API list:

### Authentication & Authorization
- `POST /api/v1/auth/register` - Register user.
- `POST /api/v1/auth/verify-email` - Verify email.
- `POST /api/v1/auth/login` - Authenticate & return JWT token (HTTP-only cookies).
- `POST /api/v1/auth/forgot-password` / `reset-password` - Password recovery.
- `GET /api/v1/auth/me` - Get logged-in user info.

### Public APIs
- `GET /api/v1/raffles` - Fetch active raffles (paginated/filtered).
- `GET /api/v1/raffles/:id` - Fetch details of a specific live raffle.
- `GET /api/v1/winners` - Fetch global list for Winners Gallery.
- `GET /api/v1/winners/raffle/:raffleId` - Fetch winners for a concluded raffle.

### Client (User) APIs
- `GET/PATCH /api/v1/users/profile` - Manage user profile.
- `GET /api/v1/users/tickets` - View purchased tickets.
- `GET /api/v1/users/wins` - View won prizes.
- `POST /api/v1/tickets/purchase` - Initialize Stripe Checkout.

### Host Dashboard APIs
- `POST /api/v1/hosts/onboard` - Submit host business details.
- `GET/POST /api/v1/hosts/subscription` - Check/buy subscriptions.
- `GET /api/v1/hosts/wallet` - Check total earnings.
- `POST /api/v1/hosts/withdraw` - Submit withdrawal request.
- `POST/PATCH /api/v1/raffles` - Create/edit a draft raffle.
- `GET /api/v1/raffles/my-raffles` - List host's raffles.
- `POST /api/v1/raffles/:id/instant-wins` - Configure instant wins.

### Admin Dashboard APIs
- `GET /api/v1/admin/users` & `hosts` - List users and hosts.
- `PATCH /api/v1/admin/hosts/:id/verify` - Approve/reject host profiles.
- `GET /api/v1/admin/raffles/pending` - List pending raffles.
- `PATCH /api/v1/admin/raffles/:id/approve` or `reject` - Moderate raffles.
- `GET /api/v1/admin/transactions` & `withdrawals` - View financials.
- `POST /api/v1/admin/raffles/:id/draw-winner` - **CRITICAL:** Trigger RNG for main draw.

### Webhooks
- `POST /api/v1/webhooks/stripe` - Handles payment successes securely.

## 3. Remaining Tasks
Based on the system design checklist and current project state, the following tasks remain:
- **System Design Diagrams:** Create Sequence Diagrams for Ticket Purchasing and Main Draw processes. Also, state machine diagrams for Raffle lifecycle and Withdrawals.
- **Security & Compliance Strategy:** Document JWT storage strictly, configure Rate Limiting (preventing DDOS on endpoints), and set up strict RBAC.
- **Infrastructure & DevOps Plan:** Containerize the Next.js and NestJS apps with Docker, configure CI/CD via GitHub Actions, and set up staging/production environments.
- **Backend Refinement:** Full implementation of Stripe Webhooks, Redis caching, and BullMQ background workers for automated draws and email notifications.

## 4. Challenges in this Project
- **Concurrency in Ticket Purchases:** Preventing race conditions when multiple users try to buy the last ticket simultaneously. This requires database-level locking or Redis locks.
- **True Randomness for Winner Selection:** Generating a fair, unbiased winner for the main draw securely without crashing the server.
- **Data Consistency:** Ensuring that transactions (purchases), ticket creation, and `ticketsSold` increments happen atomically using `$transaction`.
- **Handling Webhooks Securely:** Validating Stripe signatures correctly and securely avoiding replay attacks.

## 5. Coding Problems & Areas for Improvement
After analyzing the codebase, here are the significant architectural and coding issues that must be addressed:

### A. Duplicated Prisma Schemas (Major Issue)
- **Problem:** Currently, the `frontend/prisma/schema.prisma` only contains a basic `Lead` model, while `backend/prisma/schema.prisma` contains the full robust database schema. This creates a split-brain scenario where the frontend and backend are not sharing the same types or database client.
- **Solution:** Transition to a **Turborepo** monorepo structure. Extract the database logic into a shared package (`packages/database`). This ensures both the NestJS backend and Next.js frontend share the exact same Prisma client and generated TypeScript types.

### B. Mixed API Logic
- **Problem:** The frontend has an `app/api` folder acting as a backend for leads and demo auth, while a completely separate NestJS backend exists in `/backend/src`.
- **Solution:** Deprecate the Next.js API routes (`app/api`) and route all data fetching and mutations exclusively through the NestJS backend via Axios to maintain a single source of truth.

### C. Performance & Scalability Enhancements
- Implement `@nestjs/throttler` for rate-limiting.
- Add Redis for caching the active raffles list to reduce DB load on the homepage.
- Implement BullMQ (Redis Queues) in NestJS to process the actual "Draw Winner" logic in the background, rather than blocking the main HTTP thread.
