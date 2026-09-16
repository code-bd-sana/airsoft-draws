## Context

See `proposal.md` for motivation and background.

The Airsoft Draws platform operates with a decoupled architecture:
- **Frontend**: Next.js 16 (App Router), Tailwind CSS v4, React Query, Axios (`frontend/services/api.ts`).
- **Backend**: NestJS, Prisma ORM with PostgreSQL, `TicketsService` and `PaymentService`.
- **Payment Modes**:
  - Test / Simulated (`USE_TEST_PAYMENT=true`): Immediate database allocation of tickets.
  - Cashflows Gateway (`USE_TEST_PAYMENT=false`): Creates a Cashflows payment job, redirects the user to the hosted checkout page, and confirms tickets upon return or webhook notification.

Currently, `TicketsController.purchaseTickets` handles only single-raffle purchases (`POST /api/v1/tickets/purchase/:raffleId`), and Cashflows generates order numbers formatted as `TCK_${raffleId}_${userId}_${quantity}_${Date.now()}`.

## Goals / Non-Goals

**Goals:**
- Provide a persistent client-side basket (cart) using `BasketContext` and `localStorage`.
- Display a real-time basket indicator badge in `WebsiteNavbar` across desktop and mobile screens.
- Add an "Add to Basket" action to `RaffleEntryCard` alongside existing purchase options.
- Provide a dedicated `/basket` page with quantity adjustment, item removal, and subtotal calculation.
- Provide a responsive `/checkout` page with a contact and UK shipping details form.
- Auto-fill shipping and contact fields for authenticated users from their existing profile data (`firstName`, `lastName`, `email`, `phone`, `dateOfBirth`, `address`).
- Introduce a backend multi-raffle checkout endpoint (`POST /api/v1/tickets/checkout`) that atomically validates inventory, allocates ticket numbers, credits host wallets, and checks instant wins across all purchased draws in a single database transaction.
- Update payment gateway handling to support multi-raffle Cashflows order identifiers (`BSK_<transactionId>_<timestamp>`) while preserving the existing single-item `TCK_` flow.

**Non-Goals:**
- Server-side synchronized carts for unauthenticated users across multiple devices.
- Modifying or deprecating the existing single-ticket endpoint `POST /api/v1/tickets/purchase/:raffleId`.
- Discount codes, coupons, or promo vouchers (deferred to future iterations).

## Decisions

### Decision 1: Client-Side Basket State via React Context + LocalStorage
- **Rationale**: Storing the basket in browser local storage wrapped by a React Context (`BasketContext`) provides instant client responsiveness, zero server overhead while browsing, and full cart persistence across page reloads and navigation.
- **Alternatives considered**:
  - *Server-side database cart table*: Rejected because it introduces unnecessary database writes for browsing visitors, requires session/cart cleanup cron jobs, and adds latency.

### Decision 2: Two-Page Workflow (`/basket` -> `/checkout`)
- **Rationale**: Separating cart review (`/basket`) from final checkout (`/checkout`) aligns with standard e-commerce conventions. It allows users to clearly review tickets, adjust quantities, and inspect subtotals before engaging in the detailed contact, shipping, and age verification form.
- **Alternatives considered**:
  - *All-in-one single page*: Can be overwhelming on mobile viewports where reviewing items and completing detailed address fields creates excessively long pages.

### Decision 3: Atomic Multi-Raffle Database Transaction
- **Rationale**: When an entrant purchases tickets across multiple competitions in a single checkout, all ticket allocations must succeed together. If any competition sells out or has insufficient tickets before payment settles, the entire transaction must roll back cleanly.
- **Alternatives considered**:
  - *Sequential separate transactions per raffle*: Rejected because partial failures would cause severe inconsistencies (user charged for 3 raffles but only 2 allocated).

### Decision 4: Distinct Multi-Item Order Identifier (`BSK_`) for Gateway Payments
- **Rationale**: Cashflows requires an `orderNumber` string. The single-purchase flow packed `raffleId`, `userId`, and `quantity` into the string (`TCK_${raffleId}_...`). For multi-draw baskets, packing multiple IDs exceeds gateway length limits. Storing a pending `Transaction` record with metadata and using `BSK_${transactionId}_${Date.now()}` allows the return confirmation and webhook to query the transaction directly and allocate tickets reliably.
- **Alternatives considered**:
  - *Splitting one basket payment into multiple gateway charges*: Poor UX for entrants (multiple card charges and gateway redirects).
  - *Encoding JSON in orderNumber*: Exceeds character limits of Cashflows `orderNumber`.

### Decision 5: User Profile Pre-Filling & Automatic Address Synchronization
- **Rationale**: Authenticated users should not re-enter their details. Using `useAuthUser()` pre-populates First Name, Last Name, Email, Phone Number, Date of Birth, and Shipping Address on the `/checkout` page. The checkout submission automatically updates the user record in the database (`firstName`, `lastName`, `phone`, `dateOfBirth`, `ukaraNumber`, `address`, `location`), satisfying the user requirement *"Automatically saved to your profile"*.
- **Alternatives considered**:
  - *Forcing profile update prior to checkout*: High checkout friction; inline editing with automatic profile sync provides superior UX.

### Decision 6: Authentication Flow at Checkout
- **Rationale**: In Airsoft Draws, every ticket requires a valid `userId` foreign key. Unauthenticated visitors can freely browse and add items to their basket. When they proceed to `/checkout`:
  - If authenticated: form pre-fills and proceeds directly.
  - If unauthenticated: an inline banner/modal prompts them to log in or register, preserving their basket in local storage and returning to `/checkout` immediately upon authentication.

## Risks / Trade-offs

- **[Inventory Race Condition]**: Tickets may sell out while an item sits in an entrant's basket.
  → *Mitigation*: Perform a real-time availability check when loading `/basket` and execute atomic inventory verification inside the database transaction at the moment of checkout. Return clear 400 Bad Request messages indicating which competition has insufficient tickets.
- **[Backwards Compatibility]**: Modifying ticket allocation could impact single purchases.
  → *Mitigation*: Implement `checkout` as a new controller endpoint (`POST /api/v1/tickets/checkout`) and retain `purchaseTickets` (`POST /api/v1/tickets/purchase/:raffleId`) and existing `TCK_` order number parsing intact.
- **[UK Address Formatting]**: Entrants might enter unstructured address strings.
  → *Mitigation*: Provide structured input fields (Address Line 1, Address Line 2, City, Postcode, Country) in the checkout form, while storing a consolidated string in `user.address` to match existing schema constraints.

## Migration Plan

1. **Backend Deployment**:
   - Add checkout DTOs (`BasketCheckoutDto`, `BasketCheckoutItemDto`, `ShippingDetailsDto`) and `checkout` method in `TicketsService`.
   - Add `BSK_` order prefix handling in `TicketsService`/`PaymentService` for Cashflows return and webhook.
   - Run unit tests to ensure zero impact on existing single-raffle purchasing.
2. **Frontend Deployment**:
   - Deploy `BasketContext`, `/basket` route, and `/checkout` route.
   - Add basket badge to `WebsiteNavbar`.
   - Add "Add to Basket" button in `RaffleEntryCard`.
3. **Rollback Strategy**:
   - Since existing endpoints and payment handlers remain unchanged, rolling back frontend changes restores the site to the single-entry flow without data corruption.
