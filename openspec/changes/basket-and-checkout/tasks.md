## 1. Backend Multi-Ticket Checkout API & Gateway Integration

- [x] 1.1 Create `BasketCheckoutDto`, `BasketCheckoutItemDto`, and `ShippingDetailsDto` in `backend/src/tickets/dto/checkout.dto.ts` with validation decorators (`class-validator`) and verify NestJS compilation passes
- [x] 1.2 Implement atomic `checkout` method in `backend/src/tickets/tickets.service.ts` validating active status, ticket availability, 18+ age, and UKARA compliance, auto-saving contact and shipping details to user profile, and allocating tickets across multiple raffles in a Prisma transaction
- [x] 1.3 Add Cashflows gateway multi-item order support with `BSK_${transactionId}_${Date.now()}` format while preserving single-item `TCK_` handlers
- [x] 1.4 Expose `@Post('checkout')` in `backend/src/tickets/tickets.controller.ts` with JWT and role guards, update controller unit tests, and verify with `npm test -- src/tickets`

## 2. Frontend Basket State & Client Persistence

- [x] 2.1 Implement `BasketContext` and `useBasket` hook in `frontend/features/basket/BasketContext.tsx` managing `localStorage` (`airsoft_draws_basket`), quantity adjustments, stock validation, item removal, and total calculations
- [x] 2.2 Mount `BasketProvider` in `frontend/app/providers.tsx` (or root layout) and verify client hydration without cascading re-renders

## 3. Navigation & Competition Entry Integration

- [x] 3.1 Update `frontend/components/website/layout/WebsiteNavbar.tsx` to display a shopping basket icon with real-time numeric counter badge on desktop and mobile drawer linking to `/basket`
- [x] 3.2 Update `frontend/components/website/raffle-details/RaffleEntryCard.tsx` to include "Add to Basket" with interactive feedback notification while preserving existing direct entry modal

## 4. Dedicated Basket Page (`/basket`)

- [x] 4.1 Create `/basket` page route in `frontend/app/basket/page.tsx` rendering an empty state CTA when basket is empty and an itemized cart table when populated
- [x] 4.2 Build itemized cart table with competition thumbnail, title, unit price, quantity increment/decrement controls, item deletion, subtotal calculations, and a "Proceed to Checkout" button linking to `/checkout`

## 5. Unified Checkout Page (`/checkout`)

- [x] 5.1 Create `/checkout` page route in `frontend/app/checkout/page.tsx` with two-column responsive layout and order summary card
- [x] 5.2 Build Contact Details and Prize Shipping Address forms pre-filled from `useAuthUser()` data (`firstName`, `lastName`, `email`, `phone`, `dateOfBirth`, `address`) with optional/automatic profile sync
- [x] 5.3 Implement real-time 18+ Date of Birth validation (VCRA 2006 compliance notice), conditional UKARA input (mandatory for RIF items), and Terms & Conditions acceptance checkbox
- [x] 5.4 Implement unauthenticated user handling on `/checkout` with inline authentication/registration prompt that preserves basket items in `localStorage`
- [x] 5.5 Connect checkout form submission to `api.post('/tickets/checkout')`, clear `localStorage` on success, and display the multi-ticket confirmation view showing all allocated ticket numbers and instant-win prizes

## 6. Integration Verification & Quality Assurance

- [x] 6.1 Execute backend unit tests (`npm test -- src/tickets`) and verify backend production build (`npm run build`)
- [x] 6.2 Execute frontend typecheck (`npx tsc --noEmit`) and verify clean compilation
- [x] 6.3 Verify end-to-end purchasing workflow in simulated mode: add multiple raffles to basket, proceed to checkout, verify profile auto-save, and inspect allocated ticket numbers
