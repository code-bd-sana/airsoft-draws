# Airsoft Draws - Comprehensive System Architecture & Codebase Improvement Report

---

## 1. Executive Summary & Architecture Overview

### 1.1 Project Description
**Airsoft Draws** is a B2B2C e-commerce raffle and competition platform designed specifically for the airsoft gear ecosystem. The platform enables verified third-party vendors (**Hosts**) to create, host, and monetize prize draws, while registered users (**Clients**) purchase tickets to enter draws and win instant-win prizes or main draw rewards. System administrators (**Admins**) oversee host verification, raffle approvals, monetary payouts, financial transactions, and random number generator (RNG) winner selection.

### 1.2 System Architecture Stack
The platform employs a decoupled client-server architecture:

```
┌─────────────────────────────────────────────────────────────────┐
│                      Next.js 16 Frontend                        │
│       React 19 | App Router | Tailwind CSS v4 | React Query      │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                   HTTP-Only Cookie Auth (JWT)
                      Axios API Client Wrapper
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      NestJS Node.js Backend                     │
│    Controllers | Services | DTOs | Guards | Interceptors        │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                            Prisma ORM
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      PostgreSQL Database                        │
│        Relational Tables | Foreign Keys | UUID Primary Keys      │
└─────────────────────────────────────────────────────────────────┘
```

* **Backend:** [NestJS](https://nestjs.com/) framework (TypeScript), running on Node.js.
* **Database & ORM:** PostgreSQL managed via [Prisma ORM](https://www.prisma.io/).
* **Frontend:** [Next.js 16](https://nextjs.org/) (App Router), React 19, Tailwind CSS v4.
* **Data Fetching & State:** `@tanstack/react-query` v5 + `axios` v1.
* **Authentication:** JWT tokens stored in HTTP-Only cookies (`accessToken`).

---

## 2. Deep-Dive Backend Code Analysis (`/backend`)

### 2.1 Backend Folder & Architecture Map
The backend is located in `/backend/src` and follows NestJS's modular domain-driven layout:

```
/backend/src
├── admin/                     # Admin domain (Dashboard, Hosts, Orders, Users, Winners, Withdrawals)
├── auth/                      # Authentication (Register, Login, Password Reset, Cookie management, JWT Strategy)
├── categories/                # Competition categories management
├── common/                    # Global cross-cutting concerns
│   ├── filters/               # Global Exception Filter (all-exceptions.filter.ts)
│   └── interceptors/         # Response Transform Interceptor (transform.interceptor.ts)
├── config/                    # Environment & application configurations
├── hosts/                     # Host onboarding, wallet, earnings, withdrawal requests
├── payment/                   # Payment gateways (Stripe Checkout & Webhook handling)
├── prisma/                    # Prisma DB service wrapper (PrismaService extending PrismaClient)
├── raffles/                   # Core Competition/Raffle domain (CRUD, public listings, draw winner RNG)
├── subscriptions/             # Host subscription plans and billing status
├── tickets/                   # Ticket purchase transaction handling & instant win matching
└── users/                     # User profile management & ticket history
```

### 2.2 API Creation & Request Handling Lifecycle
Every API endpoint in NestJS is created via standard Controller class annotations and follows a strict 5-layer execution path:

1. **Routing & HTTP Method Decorators:** `@Controller('api/v1/raffles')` defines the base path. `@Get()`, `@Post()`, `@Patch()`, `@Delete()` handle standard REST verbs.
2. **Guards & Authentication:** `@UseGuards(JwtAuthGuard)` extracts the `accessToken` cookie from the HTTP header/cookies, validates the JWT signature, and attaches the `user` payload to `req.user`. `@Roles('ADMIN', 'HOST')` validates role-based access control (RBAC).
3. **DTO & Pipe Validation:** Requests with payloads parse incoming JSON through `ValidationPipe` (configured globally in `main.ts`). DTOs use `class-validator` annotations (`@IsString()`, `@IsNumber()`, `@IsOptional()`) to validate field boundaries.
4. **Service Layer Execution:** Controllers delegate business operations to domain Services (`RafflesService`, `TicketsService`, `AuthService`). Services execute database queries using `PrismaService`.
5. **Global Response Wrapping:** All successful HTTP responses pass through `TransformInterceptor` (`common/interceptors/transform.interceptor.ts`), wrapping data in a uniform envelope:
   ```json
   {
     "success": true,
     "data": { ... },
     "meta": { "total": 10, "page": 1, "lastPage": 1 },
     "timestamp": "2026-07-27T17:54:06.000Z"
   }
   ```

### 2.3 Database Schema & Modeling (`backend/prisma/schema.prisma`)
The PostgreSQL schema consists of 11 relational models:

| Model | Table Name | Purpose | Primary Keys & Indexes |
| :--- | :--- | :--- | :--- |
| `User` | `users` | Account credentials, profile details, role (`ADMIN`, `HOST`, `CLIENT`). | `id` (UUID), `email` (Unique) |
| `HostProfile` | `host_profiles` | Verified vendor profile, business details, wallet balance. | `id` (UUID), `userId` (Unique), `slug` (Unique) |
| `SubscriptionPlan` | `subscription_plans` | Host platform tier limits and monthly pricing. | `id` (UUID) |
| `HostSubscription` | `host_subscriptions` | Active subscription instance for a host profile. | `id` (UUID), FKs: `hostId`, `planId` |
| `Raffle` | `raffles` | Competition details, total/sold tickets, start/end dates, draw flags. | `id` (UUID), `slug` (Unique), FK: `hostId` |
| `InstantWin` | `instant_wins` | Pre-assigned ticket numbers with instant physical/cash prizes. | `id` (UUID), FK: `raffleId` |
| `Transaction` | `transactions` | Payment ledger for ticket purchases, subscriptions, withdrawals. | `id` (UUID), FK: `userId` |
| `Ticket` | `tickets` | Purchased competition entry containing ticket number. | `id` (UUID), FKs: `raffleId`, `userId`, `transactionId` |
| `Winner` | `winners` | Log of main draw winners and instant win claimers. | `id` (UUID), FKs: `userId`, `raffleId`, `ticketId` |
| `Withdrawal` | `withdrawals` | Host revenue payout requests. | `id` (UUID), FK: `hostId` |
| `Category` | `categories` | Airsoft equipment categories (AEGs, GBBs, Gear, Optics). | `id` (UUID), `name` (Unique), `slug` (Unique) |

---

## 3. Deep-Dive Frontend Code Analysis (`/frontend`)

### 3.1 Frontend Folder & App Router Structure
The frontend is built with Next.js 16 App Router (`/frontend/app`) and structured logically by user roles and application features:

```
/frontend
├── app/
│   ├── (public pages)/        # page.tsx, live-raffles/, winners/, hosts/, pricing/, how-it-works/
│   ├── admin/                 # Legacy admin route redirect page
│   ├── dashboard/             # Core Dashboard Layouts & Interfaces
│   │   ├── admin/             # Admin tools (approvals, raffles, hosts, users, draws, orders, withdrawals)
│   │   ├── host/              # Host tools (create competition, sales, billing, payouts, performance)
│   │   └── user/              # Client tools (tickets, transactions, wins, profile settings)
│   ├── login/ & register/     # Auth pages
│   ├── api/                   # Local Next.js API route handlers (Leads, Admin mock endpoints)
│   └── layout.tsx             # Root layout with Fonts (Space Grotesk, Inter) & Toaster
├── components/                # Reusable UI components
│   ├── website/               # Hero, Raffle Cards, Winners Ticker, Navbar, Footer
│   └── dashboard/             # Sidebar, Header, Metrics Cards, Tables
├── config/                    # Environment config (envConfig)
├── features/                  # AuthContext provider
├── hooks/                     # Custom React Query hooks (useRaffles, useTickets, useAuth, etc.)
├── lib/                       # Utilities, helper functions, validation schemas, db.ts
└── services/                  # Axios HTTP client wrapper and API service calls
```

### 3.2 API Integration, Interceptor & Data Fetching Flow
Data fetching is managed through a layered pipeline:

1. **Axios Central Client (`frontend/services/api.ts`):**
   * Configured with `withCredentials: true` so HTTP-only `accessToken` cookies are transmitted automatically on every request.
   * **Automatic Response Unwrapping:** The response interceptor automatically detects NestJS's `TransformInterceptor` structure (`{ success: true, data: ... }`) and unwraps `response.data` to return only the inner payload. Frontend services directly consume unwrapped data without writing `res.data.data`.
2. **Services Layer (`frontend/services/*.service.ts`):**
   * Encapsulates Axios HTTP requests for each domain (`auth.service.ts`, `raffle.service.ts`, `ticket.service.ts`, `admin.service.ts`).
3. **React Query Hooks (`frontend/hooks/*.ts`):**
   * Custom hooks wrap service calls with TanStack React Query `useQuery` and `useMutation`.
   * Standard caching behavior is set to `staleTime: 60000` (1 minute) with `refetchOnWindowFocus: false`.

### 3.3 Line-by-Line / Page-by-Page Code Review

#### Public Pages Architecture (`app/`)
* **Homepage (`app/page.tsx`):**
  * Renders `Hero`, `FeaturedRaffles`, `LiveRafflesSection`, `RecentWinnersSection`, and `StatsSection`.
  * Fetches public stats via `usePublicStats()` and recent winners via `useRecentWinners()`. Uses client-side fallback mocks if queries return undefined.
* **Live Raffles Listing (`app/live-raffles/page.tsx`):**
  * Implements dynamic category filtering, search query params, status filters (`Live`, `Upcoming`, `Past`), and pagination.
  * Connects to `usePublicRaffles(queryParams)`. Handles loading skeletons and empty states gracefully.
* **Raffle Details Page (`app/live-raffles/[slug]/page.tsx`):**
  * Fetches raffle details using slug identifier via `usePublicRaffle(slug)`.
  * Features interactive ticket selection, quantity selection buttons, price calculator, instant win prize tables, host details modal, and checkout trigger.
* **Winners Gallery (`app/winners/page.tsx`):**
  * Displays tabbed layout (`All Time`, `This Week`, `This Month`) and filter dropdowns (`Instant Wins`, `Main Draws`).
  * Consumes `usePublicWinners(query)`.
* **Host Storefront (`app/hosts/[slug]/page.tsx`):**
  * Displays host profile header, verified badge, rating stats, and all raffles created by the specific host.

#### User Dashboard Routes (`app/dashboard/user/`)
* **Overview (`app/dashboard/user/page.tsx`):** Displays quick metrics (Total Tickets Bought, Active Draws Entered, Total Wins) and recent tickets table.
* **My Tickets (`app/dashboard/user/tickets/page.tsx`):** Shows purchased tickets grouped by raffle, ticket numbers, purchase dates, and live draw countdown timers.
* **Wins Gallery (`app/dashboard/user/winners/page.tsx`):** Displays prizes won by the user with shipment/delivery tracking status (`PENDING`, `SHIPPED`, `DELIVERED`).
* **Profile & Settings (`app/dashboard/user/profile/page.tsx`, `settings/`):** Form interface for updating personal details, address, and phone number.

#### Host Dashboard Routes (`app/dashboard/host/`)
* **Host Overview (`app/dashboard/host/page.tsx`):** Displays earnings metrics, total tickets sold, active competition count, and recent sales charts.
* **Create Competition (`app/dashboard/host/create/page.tsx`):** Multi-step form for creating new raffles, uploading prize images, configuring ticket prices/quantities, draw dates, and configuring instant win prize ticket assignments.
* **Host Competitions (`app/dashboard/host/competitions/page.tsx`):** Management table for active, draft, pending approval, and ended raffles with quick actions to edit or update images.
* **Sales & Payouts (`app/dashboard/host/sales/page.tsx`, `payouts/`):** View total ticket revenue and submit withdrawal requests to bank/PayPal accounts.

#### Admin Dashboard Routes (`app/dashboard/admin/`)
* **Admin Overview (`app/dashboard/admin/page.tsx`):** High-level operational metrics across users, hosts, pending raffle approvals, total volume, and system logs.
* **Pending Approvals (`app/dashboard/admin/approvals/page.tsx`):** Moderation queue where admins review host-submitted raffles and approve them to go `ACTIVE` or reject them.
* **Draw Winner Engine (`app/dashboard/admin/draws/page.tsx`):** Interface allowing admins to trigger the random number generator for ended competitions.

---

## 4. Categorized Audit of Areas Open for Improvement

The following audit categorizes all identified architectural weaknesses, edge cases, and code improvement opportunities into **8 distinct technical categories**:

```
                                  IMPROVEMENT CATEGORIES
  ┌─────────────────────────────────┬─────────────────────────────────┐
  │ Category A: Database & Schema   │ Category B: Concurrency & RNG   │
  ├─────────────────────────────────┼─────────────────────────────────┤
  │ Category C: Backend & Queues    │ Category D: API Standards & DTOs│
  ├─────────────────────────────────┼─────────────────────────────────┤
  │ Category E: Frontend & Caching  │ Category F: Error Boundaries    │
  ├─────────────────────────────────┼─────────────────────────────────┤
  │ Category G: Auth & Payments     │ Category H: Monorepo & Testing  │
  └─────────────────────────────────┴─────────────────────────────────┘
```

---

### Category A: Database Schema & Data Integrity

#### 1. Absence of Composite Unique Constraint on Ticket Numbers
* **Current Implementation:** In `backend/prisma/schema.prisma`, the `Ticket` model defines `raffleId` and `ticketNumber` as standalone fields without a composite unique index (`@@unique([raffleId, ticketNumber])`).
* **Issue / Risk:** If two purchase transactions run concurrently, the database will accept duplicate rows for ticket #5 in the exact same raffle, breaking competition integrity and prize calculations.
* **Recommendation:** Add `@@unique([raffleId, ticketNumber])` in `schema.prisma`.

#### 2. String Primitive Usage Instead of PostgreSQL Enums
* **Current Implementation:** Statuses and roles across `User` (`role`), `Raffle` (`status`), `Transaction` (`type`), and `Withdrawal` (`status`) are stored as standard `@db.VarChar(50)` strings with hardcoded defaults.
* **Issue / Risk:** Allows invalid strings to bypass database integrity if a service fails to sanitize values. PostgreSQL enums provide strict column typing and optimize storage.
* **Recommendation:** Convert `role`, `raffle_status`, `transaction_type`, `win_type`, and `withdrawal_status` into native Prisma `enum` declarations.

#### 3. Missing Database Indexes for Query Performance
* **Current Implementation:** The schema lacks indexes on high-frequency query parameters.
* **Issue / Risk:** As table size grows beyond 100,000 rows, full-table scans will degrade database performance.
* **Recommendation:** Add the following indexes:
  * `Ticket`: `@@index([raffleId, userId])`, `@@index([raffleId, ticketNumber])`
  * `Raffle`: `@@index([status, startDate, endDate])`, `@@index([hostId, status])`
  * `Transaction`: `@@index([userId, status])`, `@@index([gatewayTransactionId])`
  * `InstantWin`: `@@index([raffleId, isClaimed])`

---

### Category B: Concurrency, Fair Draw & Randomness Architecture

#### 1. High Memory & Latency Overhead in Ticket Allocation
* **Current Implementation:** In `TicketsService.purchaseTickets()` (`tickets.service.ts#L49-L60`), ticket numbers are chosen by querying **ALL** existing tickets from the database into Node.js heap memory (`tx.ticket.findMany({ where: { raffleId } })`) and filtering available numbers with a JavaScript `for` loop.
* **Issue / Risk:** For a raffle with 100,000 tickets, every single purchase request fetches 100,000 records into RAM and iterates over them. Under concurrent load, this causes Out-Of-Memory (OOM) crashes and high latency.
* **Recommendation:** Use SQL set differences, database sequences, or pre-generated ticket pools in a dedicated queue table.

#### 2. Non-Cryptographic Randomness (`Math.random()`)
* **Current Implementation:** Fisher-Yates ticket shuffling (`tickets.service.ts#L69`) and winner selection in `RafflesService.drawWinner()` (`raffles.service.ts#L503`) use standard JavaScript `Math.random()`.
* **Issue / Risk:** `Math.random()` is PRNG pseudo-random and predictable. Using it for monetary prize draws fails compliance with legal raffle standards and UK Gambling Commission requirements.
* **Recommendation:** Replace `Math.random()` with `crypto.randomInt()` from Node.js `crypto` module, or integrate verifiable hardware/blockchain RNG (e.g. Chainlink VRF or Quantumbold).

#### 3. Race Conditions During Concurrent Purchases
* **Current Implementation:** `purchaseTickets()` wraps queries in `$transaction`, but relies on standard read-committed isolation without row-level locking (`SELECT FOR UPDATE`).
* **Issue / Risk:** Multiple requests executing within the same millisecond can select the same available ticket numbers before either transaction completes creation.
* **Recommendation:** Use pessimistic locking via raw SQL (`SELECT * FROM raffles WHERE id = $1 FOR UPDATE`) or implement a Redis distributed lock (`redlock`) during ticket checkout.

---

### Category C: Backend Performance, Scalability & Queueing

#### 1. Synchronous Auto-Draw Execution in HTTP Handler
* **Current Implementation:** In `TicketsService.purchaseTickets()` (`tickets.service.ts#L173-L177`), when a ticket purchase sells out a raffle, `this.rafflesService.drawWinner()` is called directly inline inside the HTTP response handler.
* **Issue / Risk:** The user buying the last ticket experiences a long delay while the server processes winner selection, database writes, and instant win queries. If an error occurs during auto-draw, the HTTP request fails unexpectedly.
* **Recommendation:** Offload draw events to an asynchronous background worker queue using **BullMQ + Redis**.

#### 2. Lack of Rate Limiting (DDoS & Brute-Force Vulnerability)
* **Current Implementation:** The NestJS application has no rate-limiting middleware or throttler guard registered.
* **Issue / Risk:** Auth endpoints (`/api/v1/auth/login`, `/api/v1/auth/register`) and payment/ticket endpoints are vulnerable to brute-force attacks and automated bot ticket scalping.
* **Recommendation:** Implement `@nestjs/throttler` globally with custom limits (e.g. 10 requests/min for auth endpoints, 100 requests/min for general APIs).

#### 3. Absence of Caching for Public Read APIs
* **Current Implementation:** Public endpoints like `/api/v1/raffles` and `/api/v1/winners` hit the PostgreSQL database directly on every single visitor request.
* **Issue / Risk:** High traffic surges on active raffles will overload database connection pools.
* **Recommendation:** Implement Redis caching (`cache-manager` + `cache-manager-redis-store`) for public raffle lists and winner stats with a short TTL (10–30 seconds) and cache invalidation on updates.

---

### Category D: API Standards, Validation & Type Safety

#### 1. Unsafe Usage of `any` Types in Backend Services
* **Current Implementation:** Several service methods accept raw `any` types (e.g., `RafflesService.create(hostId: string, data: any)`, `findAllPublic(query: any)`).
* **Issue / Risk:** Disables TypeScript's compile-time type safety, allowing unexpected property access crashes at runtime (`TypeError: Cannot read properties of undefined`).
* **Recommendation:** Define strict NestJS DTO classes with `class-validator` annotations (`CreateRaffleDto`, `QueryRaffleDto`) for all endpoint parameters.

#### 2. Residual Next.js API Routes in Frontend
* **Current Implementation:** The frontend contains route handlers under `frontend/app/api/` (`leads/`, `admin/`) using direct `@prisma/client` connections (`lib/db.ts`).
* **Issue / Risk:** Creates a split-brain backend architecture where frontend and backend maintain separate database queries and logic.
* **Recommendation:** Deprecate `frontend/app/api/` completely and migrate all data handlers exclusively to NestJS backend modules.

---

### Category E: Frontend Data Fetching, State Hydration & Caching

#### 1. Inconsistent React Query Cache Invalidation
* **Current Implementation:** After completing mutations (e.g., purchasing tickets or updating profile details), some components do not call `queryClient.invalidateQueries()`.
* **Issue / Risk:** The user interface displays stale cached data (e.g. outdated ticket counts or old profile info) until a manual page refresh is executed.
* **Recommendation:** Standardize mutation callbacks (`onSuccess`) across all custom hooks in `/frontend/hooks` to invalidate relevant query keys (`['raffles']`, `['user-tickets']`, `['profile']`).

#### 2. Hydration Warning Suppression Masking Underlying SSR Issues
* **Current Implementation:** Root layout (`app/layout.tsx`) specifies `suppressHydrationWarning` on `<html>` and `<body>`.
* **Issue / Risk:** Hides genuine React 19 hydration mismatches between Server Components and Client Components (such as date formatting or local storage access).
* **Recommendation:** Remove `suppressHydrationWarning` and fix root causes using `useEffect` or dynamic imports with `{ ssr: false }` for date/browser-dependent components.

#### 3. Hardcoded Mock Fallbacks in Production Components
* **Current Implementation:** Components like `RecentWinnersSection` or `StatsSection` fall back to static local arrays when API requests return empty.
* **Issue / Risk:** Users may be confused by dummy data mixed with real live draw data.
* **Recommendation:** Separate mock data into explicit storybook/dev mock files and ensure production components render true empty states (`No winners yet`).

---

### Category F: Error Boundaries, Resilience & UX Edge Cases

#### 1. Missing Next.js App Router Error Boundaries
* **Current Implementation:** Routes lack localized `error.tsx` and root `global-error.tsx` boundary files.
* **Issue / Risk:** An unhandled runtime error inside a nested component will crash the entire page tree and render a blank screen.
* **Recommendation:** Add `error.tsx` files inside `app/`, `app/dashboard/`, `app/live-raffles/`, and `app/admin/` with fallback UI and retry buttons (`reset()`).

#### 2. Missing Loading Skeletons and Suspense Fallbacks
* **Current Implementation:** Dashboard routes (`dashboard/user/tickets`, `dashboard/host/competitions`) rely solely on client-side React Query `isLoading` states without Next.js native `loading.tsx` visual skeletons.
* **Issue / Risk:** Results in Cumulative Layout Shift (CLS) and poor user experience on slow network connections.
* **Recommendation:** Create dedicated `loading.tsx` skeleton screens for all dynamic App Router segments.

---

### Category G: Security, Authorization & Payment Webhook Integrity

#### 1. Simulated Payment Operations in Core Flows
* **Current Implementation:** Ticket purchases generate simulated IDs (`SIM_PAY_${UUID}`) and mark transactions as `COMPLETED` immediately (`tickets.service.ts#L86`).
* **Issue / Risk:** Payment validation is skipped, permitting free ticket generation if deployed without strict Stripe signature verification.
* **Recommendation:** Require mandatory Stripe PaymentIntent creation, client secret confirmation, and asynchronous Stripe Webhook validation (`POST /api/v1/webhooks/stripe`).

#### 2. Lack of Explicit XSS Sanitization for Rich Text Content
* **Current Implementation:** Competition descriptions created by hosts are stored directly in PostgreSQL and rendered on competition detail pages.
* **Issue / Risk:** Malicious hosts could inject malicious scripts (`<script>` or `onload=` attributes) into competition descriptions.
* **Recommendation:** Sanitize html content using `DOMPurify` on the frontend or `sanitize-html` package on the backend prior to database persistence.

---

### Category H: Code Quality, Monorepo Refactoring & Test Automation

#### 1. Duplicated Prisma Schemas Between Frontend & Backend
* **Current Implementation:** Both `/backend/prisma/schema.prisma` and `/frontend/prisma/schema.prisma` exist independently.
* **Issue / Risk:** Out-of-sync types between frontend and backend leads to build failures and model mismatches.
* **Recommendation:** Adopt a **Turborepo** monorepo workspace structure with a single shared package (`packages/database`).

#### 2. Total Absence of Automated Testing
* **Current Implementation:** No unit tests (`*.spec.ts`), integration tests, or end-to-end (E2E) tests are present in either repository.
* **Issue / Risk:** Refactoring core logic (such as ticket purchasing or draw winner RNG) risks breaking financial ledger calculations without warning.
* **Recommendation:**
  * Implement NestJS unit & integration tests using Jest (`@nestjs/testing`).
  * Implement E2E tests for ticket purchase workflows using Cypress or Playwright.

---

## 5. Summary Matrix & Actionable Improvement Roadmap

| Priority | Category | Problem Statement | Recommended Solution |
| :--- | :--- | :--- | :--- |
| 🔴 **CRITICAL** | **B. Concurrency & RNG** | Non-cryptographic `Math.random()` used for draw winner selection and ticket shuffle. | Implement `crypto.randomInt()` or hardware/blockchain verifiable RNG. |
| 🔴 **CRITICAL** | **A. Database Integrity** | Missing unique constraint on `(raffleId, ticketNumber)`. | Add `@@unique([raffleId, ticketNumber])` to Prisma schema. |
| 🔴 **CRITICAL** | **G. Payment Security** | Ticket purchases bypass real Stripe webhook verification. | Enforce Stripe Webhook handler (`stripe.webhooks.constructEvent`) before ticket creation. |
| 🟠 **HIGH** | **B. Concurrency & RNG** | Ticket allocation loads all sold tickets into Node.js memory. | Refactor ticket generation to SQL set math or atomic sequence reservation. |
| 🟠 **HIGH** | **C. Scalability** | Synchronous auto-draw execution blocks HTTP response thread. | Offload winner draws to **BullMQ + Redis** background workers. |
| 🟠 **HIGH** | **C. Performance** | No API rate limiting or Redis caching on public endpoints. | Add `@nestjs/throttler` and Redis cache store for public raffle lists. |
| 🟡 **MEDIUM** | **F. Error Handling** | Missing Next.js `error.tsx` boundaries and `loading.tsx` skeletons. | Add error boundaries and skeleton loaders across all App Router segments. |
| 🟡 **MEDIUM** | **H. Monorepo Refactor** | Split-brain Prisma schemas and frontend API handlers. | Migrate repository to **Turborepo** monorepo with shared packages. |
| 🟢 **LOW** | **H. Code Quality** | Zero unit or E2E test coverage. | Add Jest unit tests for backend services and Playwright E2E tests for checkout flow. |

---

*Report prepared for **Airsoft Draws** engineering team.*
