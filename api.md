# API Architecture Design for Airsoft Draws

Based on the database schema and business logic, here is the complete, professional API architecture required for the backend. 

*We will use RESTful principles, JSON responses, and route versioning (`/api/v1/...`).*

---

## 1. Authentication & Authorization APIs
*Handles user registration, login, and token management using JWT.*

- `POST /api/v1/auth/register` : Register a new user (Client or Host) and send a verification email.
- `POST /api/v1/auth/verify-email` : Verify user's email using the token sent to their inbox.
- `POST /api/v1/auth/login` : Authenticate user and return JWT token.
- `POST /api/v1/auth/forgot-password` : Send password reset email.
- `POST /api/v1/auth/reset-password` : Reset password using email token.
- `GET /api/v1/auth/me` : Get the currently logged-in user's basic info.

---

## 2. Public APIs (No Login Required)
*APIs used by the frontend to display data to anyone visiting the website.*

- `GET /api/v1/raffles` : Fetch all `ACTIVE` raffles (Supports pagination, search, and category filters).
- `GET /api/v1/raffles/:id` : Fetch detailed information about a specific live raffle (including price, ticket limits).
- `GET /api/v1/winners` : Fetch the global list of winners for the "Winners Gallery" page.
- `GET /api/v1/winners/raffle/:raffleId` : Fetch who won a specific concluded raffle.

---

## 3. Client (User) APIs
*Requires `CLIENT` JWT Token.*

- `GET /api/v1/users/profile` : Get the user's profile data (location, avatar).
- `PATCH /api/v1/users/profile` : Update user profile details.
- `GET /api/v1/users/tickets` : View all tickets the user has purchased, grouped by raffle.
- `GET /api/v1/users/wins` : View all prizes the user has won (Instant or Main).
- `POST /api/v1/tickets/purchase` : Initialize the payment flow to buy tickets (Creates Stripe Checkout Session).

---

## 4. Host Dashboard APIs
*Requires `HOST` JWT Token.*

### Subscriptions & Wallet
- `POST /api/v1/hosts/onboard` : Submit business details to become a Host.
- `GET /api/v1/hosts/subscription` : Check current active subscription status.
- `POST /api/v1/hosts/subscription/buy` : Initialize payment for a subscription plan.
- `GET /api/v1/hosts/wallet` : Check total earnings (`wallet_balance`).
- `POST /api/v1/hosts/withdraw` : Submit a request to withdraw funds.
- `GET /api/v1/hosts/withdrawals` : View history of withdrawal requests.

### Raffle Management
- `POST /api/v1/raffles` : Create a new raffle (Status defaults to `PENDING_APPROVAL`).
- `PATCH /api/v1/raffles/:id` : Edit a draft raffle.
- `GET /api/v1/raffles/my-raffles` : List all raffles created by this host (including draft, pending, active, ended).
- `POST /api/v1/raffles/:id/instant-wins` : Configure the instant win ticket numbers and prizes for a specific raffle.

---

## 5. Admin Dashboard APIs
*Requires `ADMIN` JWT Token.*

### User & Host Management
- `GET /api/v1/admin/users` : List all users (with search and ban capabilities).
- `GET /api/v1/admin/hosts` : List all hosts.
- `PATCH /api/v1/admin/hosts/:id/verify` : Approve/Reject a host profile.

### Raffle Moderation
- `GET /api/v1/admin/raffles/pending` : List all raffles waiting for admin approval.
- `PATCH /api/v1/admin/raffles/:id/approve` : Approve a raffle (changes status to `ACTIVE`).
- `PATCH /api/v1/admin/raffles/:id/reject` : Reject a raffle (sends it back to host as `DRAFT`).

### Financials & Operations
- `GET /api/v1/admin/transactions` : Global view of all money moving through the platform (Tickets, Subs, Payouts).
- `GET /api/v1/admin/withdrawals` : View all pending withdrawal requests from hosts.
- `PATCH /api/v1/admin/withdrawals/:id/complete` : Mark a payout as completed after sending the money.
- `POST /api/v1/admin/raffles/:id/draw-winner` : **CRITICAL API.** The admin clicks a button to securely trigger the Random Number Generator to select the Main Winner for a concluded raffle.

---

## 6. Webhooks (System APIs)
*Hidden endpoints used by third-party services to talk to your server securely.*

- `POST /api/v1/webhooks/stripe` : Stripe calls this automatically when a user successfully pays for tickets or a host pays for a subscription. This API verifies the signature, creates the `tickets` or updates `host_subscriptions`, and creates the `transaction` record.

---

## Recommended Technologies for these APIs:
1. **NestJS**: For building this robust, modular routing structure.
2. **Passport.js & JWT**: For handling the `ADMIN`, `HOST`, and `CLIENT` Guards.
3. **Stripe API**: For handling ticket purchases and host payouts.
4. **BullMQ (Redis)**: For handling the `draw-winner` API so it runs securely in the background without locking up the server.
