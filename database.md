# Airsoft Draws - Database Logic & Flow Guide

This document explains the step-by-step logic and connection between the tables in your PostgreSQL database for the Airsoft Draws platform. 

## 1. User Management (Roles: Admin, Host, Client)
**Table**: `users`
- Everything starts here. When anyone registers, they get a row in the `users` table.
- The `role` column determines what they can do (`ADMIN`, `HOST`, or `CLIENT`).
- We added `location` (e.g. "London") and `avatar_url` to the `users` table because your Winners page design specifically shows the winner's location and initials/avatar.

## 2. Host Onboarding & Subscriptions
**Tables**: `host_profiles`, `subscription_plans`, `host_subscriptions`, `transactions`
- If a user registers as a `HOST`, a row is created in `host_profiles` linked to their `user_id`.
- Before a host can create a raffle, they must buy a subscription.
- The host selects a plan from `subscription_plans`.
- When they pay, two things happen:
  1. A row is added to `transactions` recording the payment (Type: `SUBSCRIPTION_FEE`).
  2. A row is added to `host_subscriptions` giving them an `ACTIVE` status and an `end_date`.

## 3. Raffle Creation & Admin Approval
**Table**: `raffles`
- Once subscribed, the Host creates a Raffle.
- The raffle is saved in the `raffles` table with the status `PENDING_APPROVAL`. It will **NOT** show on the website yet.
- The Admin logs into the Admin Dashboard, checks the raffle details, and updates the status to `ACTIVE`. 
- Now, clients can see the live raffle.

## 4. Instant Wins Setup
**Table**: `instant_wins`
- When the host creates the raffle, they can also set up Instant Wins.
- They pick specific ticket numbers (e.g., Ticket #45, #102) and assign prizes to them.
- These are saved in the `instant_wins` table (linked to the `raffle_id`). `is_claimed` is set to `FALSE`.

## 5. Client Ticket Purchase Flow
**Tables**: `tickets`, `transactions`
- A Client wants to buy 5 tickets for a raffle.
- They go to checkout and pay via Stripe/PayPal.
- The system processes the payment and does the following in a single database transaction:
  1. Creates a `transactions` row (Type: `TICKET_PURCHASE`).
  2. Creates 5 rows in the `tickets` table linked to the `raffle_id`, `user_id`, and `transaction_id`.
  3. Increments `tickets_sold` on the `raffles` table by 5.

## 6. The Winner System (You were right, we need a Winners table!)
**Table**: `winners`
- When a ticket is purchased, the system checks if the ticket number matches any `ticket_number` in the `instant_wins` table.
  - If YES: The `instant_wins.is_claimed` becomes TRUE, and a row is instantly created in the `winners` table (win_type: `INSTANT_WIN`).
- When the raffle ends, a random draw happens to find the Main Winner.
  - The winning ticket is selected.
  - A row is added to the `winners` table (win_type: `MAIN_DRAW`).
- **Why a `winners` table?** Your `app/winners/page.tsx` UI shows a list of winners with their delivery status ("Verified Delivery", "Shipped"). By having a dedicated `winners` table, we can track `delivery_status` and `tracking_number` specifically for the prizes, and the frontend can query this table extremely fast to show the Winners Gallery.

## 7. Host Wallet & Withdrawals
**Tables**: `host_profiles`, `withdrawals`, `transactions`
- When clients buy tickets, the Host's `wallet_balance` in the `host_profiles` table increases.
- The Host goes to their dashboard and requests a withdrawal.
- A row is created in `withdrawals` with status `PENDING`.
- The Admin sees this, transfers the money manually (or via an API like Stripe Connect), and marks the withdrawal as `COMPLETED`.
- The system creates a `transactions` row (Type: `HOST_WITHDRAWAL`) to keep the financial history accurate, and deducts the amount from the Host's `wallet_balance`.

---
## Summary of Connections (Foreign Keys)
- Every table is linked back to its owner.
- A `Ticket` knows exactly which `Transaction` paid for it.
- A `Winner` knows exactly which `User` won, which `Ticket` won, and which `Raffle` it belonged to.
- A `Withdrawal` is strictly linked to a `HostProfile`. 

This database design ensures zero data loss, strict financial auditing, and extremely fast queries for your frontend UI.
