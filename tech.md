# Project Analysis

## Overview
The project is located in `frontend/` and is built using Next.js 16 (App Router), React 19, Tailwind CSS v4, and Prisma. The folder structure follows a modern, component-driven approach. 

## Structure
- **app/**: Next.js App Router containing pages for landing, authentication (`login`, `register`, `forgot-password`, `reset-password`, `verify-email`), dashboards (`dashboard`, `admin`, `host`, `hosts`, `verified-hosts`), and product features (`live-raffles`, `winners`, `how-it-works`, `pricing`).
- **app/api/**: Basic API scaffolding (admin, demo-auth, leads) which currently points to rudimentary backend capabilities.
- **components/**: Well-structured directories separating `admin`, `dashboard`, `host-auth`, `user-auth`, and `website` components.
- **prisma/**: Currently contains a simple schema with only a `Lead` model. This suggests the project is in the early stages, serving mostly as a landing page to capture leads before a full launch.

## Architecture & UI/UX
- The frontend is using Next.js App Router for routing.
- The UI/UX flow starts from a highly composed landing page with sections (Hero, Featured Competitions, Categories, Trust Benefits, Winners, Instant Wins).
- Layouts include a sticky top navigation with backdrop blur and responsive mobile sidebars.
- State management is minimal right now (React local state), but complex global state will be required.

# Existing Features
- High-fidelity Landing Page with various sections designed to build trust and funnel users.
- Basic Authentication UI scaffolding.
- Lead Generation (Prisma `Lead` model for capturing emails/names).
- Responsive Navigation Bar.
- Next.js API Routes setup for minimal backend functionality (leads, demo auth).

# Product Overview

**What kind of product is this?**
Airsoft Draws is a B2B2C Raffle/Competition platform. It allows verified "Hosts" to run raffles or draws for airsoft gear (and potentially other items), while normal "Users" can buy tickets to participate in these draws. 

**What problem does it solve?**
It provides a centralized, trustworthy platform for hosting and participating in airsoft gear competitions. It solves the problem of independent hosts running fragmented, untrusted raffles by bringing them under one verified platform.

**Who are the users?**
1. **Admins**: Platform owners who verify hosts and monitor the system.
2. **Hosts**: Businesses or verified individuals who supply prizes and run raffles.
3. **Users (Customers)**: End users who browse live raffles, purchase tickets, and win prizes.

**Future Features**
- Comprehensive ticket purchasing system with payment gateway integration (Stripe/PayPal).
- Real-time live draw functionality.
- Automated instant win detection and notification.
- Host dashboards for raffle management, ticket sales analytics, and payouts.
- User dashboards for tracking purchased tickets, active draws, and winnings.

**Best Architecture**
A Microservices or Modular Monolith architecture. Given the need for strict data consistency (ticket limits, payment processing) and separation of concerns (Host vs. Admin vs. User portals), a robust modular monolith is the best starting point for a scalable SaaS.

# Future Scalability
To handle concurrent ticket purchases during high-demand live draws, the architecture must support:
- Distributed caching (e.g., Redis) for rapid reads on available ticket counts.
- Queue systems for processing high volumes of ticket purchases without dropping transactions.
- WebSockets for real-time updates on remaining tickets or live winner announcements.

# Recommended Architecture

## Backend Recommendation
I recommend **NestJS**.

### Comparison: Express.js vs NestJS

- **Express.js**: Highly flexible, unopinionated, and lightweight. However, as the project grows, managing folder structure, dependency injection, and complex business logic becomes a manual, error-prone effort.
- **NestJS**: Highly opinionated, uses Angular-like modules, dependency injection, and decorators. It provides an enterprise-ready architecture out-of-the-box.

### Why NestJS?
- **Maintainability & Folder Structure**: NestJS enforces a modular structure (`UsersModule`, `RafflesModule`, `PaymentsModule`). This keeps the codebase clean as the platform grows.
- **Developer Experience**: It leverages TypeScript natively with robust decorators for validation (`class-validator`), Swagger generation, and routing.
- **Enterprise Readiness**: Built-in dependency injection makes testing a breeze. It has native wrappers for WebSockets, Microservices, and Queues (BullMQ).
- **Scalability**: When Airsoft Draws needs to break out the payment processing into a separate microservice due to load, NestJS handles this transition smoothly.

# Database Recommendation

I recommend **PostgreSQL**.

### Comparison: PostgreSQL vs MongoDB

- **MongoDB (NoSQL)**: Great for unstructured data and rapid prototyping. Document stores are flexible but can struggle with complex, multi-entity transactions natively.
- **PostgreSQL (SQL)**: A powerful, ACID-compliant relational database. 

### Why PostgreSQL?
- **Data Relationships**: This platform has strict relational requirements (User -> Ticket -> Raffle -> Host -> Payment). SQL models this perfectly.
- **Transactions**: When purchasing a ticket, we must ensure the ticket is assigned to the user, the raffle's available ticket count is decremented, and the payment is recorded in a single atomic transaction. PostgreSQL guarantees this.
- **Search & Filtering**: Searching for raffles by category, price, or end date using SQL is highly optimized and indexable.
- **Future Scalability**: PostgreSQL handles millions of rows effortlessly and supports advanced features like JSONB if we ever need NoSQL-like flexibility.

# Complete Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: Prisma (Since it's already scaffolded in the frontend and offers great DX).
- **Caching & Queues**: Redis (For caching raffle states) + BullMQ (For queuing background jobs like processing ticket draws, sending emails, and payouts).
- **Authentication**: JWT & Passport (Integrated via NestJS auth guards).
- **Storage**: AWS S3 (For storing raffle prize images, user avatars).
- **Real-time**: Socket.io (For live ticket availability and draw events).
- **Validation**: class-validator & class-transformer.
- **Documentation**: Swagger (NestJS `@nestjs/swagger`).
- **Email Service**: Resend or SendGrid.
- **File Upload**: multer combined with AWS S3 streams.

# Folder Structure Recommendation

For the NestJS Backend:
```
src/
├── common/             # Global guards, interceptors, filters, decorators
├── config/             # Environment configuration validations
├── prisma/             # Prisma service and module
├── modules/
│   ├── auth/           # Login, Registration, JWT generation
│   ├── users/          # User profiles, ticket history
│   ├── hosts/          # Host verification, profiles
│   ├── raffles/        # Raffle CRUD, live status
│   ├── tickets/        # Ticket generation, assignment logic
│   ├── payments/       # Stripe/PayPal integration
│   ├── notifications/  # Email, SMS via Queue
│   └── uploads/        # AWS S3 image uploads
├── app.module.ts       # Root module
└── main.ts             # Entry point
```

# Security Recommendations
- **Rate Limiting**: Implement strict rate-limiting on authentication and ticket purchasing endpoints using `@nestjs/throttler`.
- **Concurrency Control**: Use database-level locks (e.g., `SELECT ... FOR UPDATE`) or Redis locks to prevent race conditions during ticket purchases (preventing double-selling the last ticket).
- **Authentication & Authorization**: Strict RBAC (Role-Based Access Control). Admin endpoints, Host endpoints, and User endpoints must be completely isolated using NestJS Guards.
- **Data Sanitization**: Global validation pipes using `class-validator` with `whitelist: true` to strip malicious payloads.

# Performance Recommendations
- **Caching**: Cache active raffles using Redis. The homepage heavily relies on displaying active draws; hitting the DB for every user visit will bottleneck the system.
- **Database Indexing**: Index foreign keys (`userId`, `raffleId`) and frequently searched columns (`status`, `endDate`).
- **Pagination**: Use cursor-based pagination for raffle lists to handle large datasets efficiently.

# DevOps Recommendations
- **Docker**: Containerize the NestJS application and use `docker-compose` for local development (spinning up Postgres & Redis).
- **CI/CD**: GitHub Actions to run ESLint, Prettier, Jest tests, and Prisma schema validation on every PR.
- **Deployment**: Deploy via AWS ECS (Fargate) or a PaaS like Render/Railway for easy scaling.
- **Monitoring**: Datadog or Sentry for error tracking and performance monitoring.
- **Secrets Management**: AWS Secrets Manager or Doppler to securely inject environment variables.

# Production Checklist
- [ ] Database backups configured (Point-in-Time Recovery enabled).
- [ ] Redis cluster configured for high availability.
- [ ] SSL/TLS enforced for all communication.
- [ ] Centralized structured logging (e.g., Winston, Pino) forwarding to Datadog/CloudWatch.
- [ ] Comprehensive E2E tests for the payment and ticket allocation flows.
- [ ] DDoS protection and WAF configured (e.g., Cloudflare).
- [ ] Load balancer setup to distribute traffic across multiple Node.js instances.

# Future Improvements
- **Missing Features**: An automated refund system for canceled draws, and an affiliate/referral system to boost user acquisition.
- **API Design**: Implement a strictly versioned API (e.g., `/v1/raffles`) from day one.
- **Frontend Architecture**: Move towards a Turborepo monorepo setup to share types, Prisma clients, and UI components between the backend (NestJS) and frontend (Next.js).

# Final Recommendation
The current Next.js application has a beautiful, robust foundation for the frontend. To support the complex, transaction-heavy nature of a raffle platform, **build the backend using NestJS with PostgreSQL and Prisma**. 

Use a **Turborepo** structure to extract the existing `prisma` folder from the `frontend` into a shared `packages/database` directory so both the Next.js frontend and the NestJS backend can share the exact same types and database client. Use Redis for real-time ticket availability and BullMQ for asynchronous tasks like choosing winners to ensure the platform is highly scalable and production-ready.
