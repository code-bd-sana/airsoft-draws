## Why

Airsoft Draws currently only allows entering one competition at a time through a direct payment redirect. Entrants participating in multiple raffles must undergo separate checkout and payment processing for each draw. Introducing an "Add to Basket" (Cart) mechanism alongside a dedicated `/checkout` page with contact and shipping details enables customers to bundle multiple competitions in one order, streamline purchasing, ensure accurate prize delivery details, and auto-populate profile data for logged-in users while preserving existing direct-entry capabilities.

## What Changes

- **Basket System (localStorage)**: Introduce client-side basket state management (`BasketContext` backed by `localStorage`) to allow adding, updating quantities of, and removing raffle entries across the platform.
- **Global Header Badge**: Add a responsive shopping basket icon with a live item counter badge in `WebsiteNavbar` (desktop and mobile drawer).
- **Raffle Entry Interaction**: Enhance `RaffleEntryCard` to provide an "Add to Basket" action alongside the existing direct entry action without breaking single-entry flows.
- **Dedicated Basket Page (`/basket`)**: Create a dedicated basket page displaying selected competitions, thumbnails, ticket counts, price per ticket, subtotal calculations, and a "Proceed to Checkout" call-to-action.
- **Unified Checkout Page (`/checkout`)**:
  - Contact details form: First Name, Last Name, Email, Phone, Date of Birth (with 18+ age validation and VCRA 2006 compliance restriction).
  - Prize Shipping Address form: Address Line 1, Line 2 (optional), Town/City, Postcode, Country (default United Kingdom).
  - Legal Compliance: UKARA registration check (mandatory if any item is RIF) and Terms & Conditions acceptance checkbox (v1.0).
  - Profile Auto-Fill & Auto-Save: Automatically pre-fill contact and shipping fields for logged-in users and persist updated delivery details back to their profile.
  - Authentication prompt or inline login for unauthenticated users prior to order placement (preserving basket items).
- **Multi-Raffle Checkout Backend Endpoint**: Introduce `POST /api/v1/tickets/checkout` in `TicketsController` to handle atomic multi-competition ticket allocations, instant-win validations, host wallet crediting, and unified transaction creation.
- **Payment Gateway Adaptation**: Support both simulated test payments (`USE_TEST_PAYMENT=true`) and Cashflows payment gateway integration with a new multi-item order identifier format (`BSK_<transactionId>_<timestamp>`) while maintaining backwards compatibility for existing single-purchase orders (`TCK_`).
- **Post-Purchase Order Confirmation**: Display all allocated tickets across all purchased draws and show celebratory win notifications for instant-win prizes.

## Capabilities

### New Capabilities
- `basket-and-checkout`: Provides cart state management, dedicated basket page, checkout page with contact/shipping collection and profile pre-filling, and backend atomic multi-raffle ticket order processing.

### Modified Capabilities
<!-- None -->

## Non-goals

- Modifying existing single-raffle direct purchase endpoints (`POST /api/v1/tickets/purchase/:raffleId`).
- Modifying PostgreSQL database schemas (existing Prisma models support multi-ticket transactions and text address storage).
- Server-side synchronized carts for unauthenticated guest visitors across multiple devices.

## Impact

- **Frontend**: Adds `BasketContext`, `/basket` route, `/checkout` route, updates `WebsiteNavbar` and `RaffleEntryCard`.
- **Backend**: Adds `checkout` endpoint and DTOs (`BasketCheckoutDto`, `BasketCheckoutItemDto`, `ShippingDetailsDto`).
