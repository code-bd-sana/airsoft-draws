# 🧪 Airsoft Draws — End-to-End QA Testing Master Plan & Jira Documentation Guide

**Prepared by:** Lead Software Engineer & Principal QA Automation Lead  
**Platform Version:** 1.0.0 (Decoupled Next.js + NestJS + PostgreSQL + Cashflows Gateway)  
**Target Audience:** QA Testers, Software Engineers, Product Managers  

---

## 📌 Executive Overview

This master test plan provides a step-by-step blueprint to test every single feature, workflow, role, and edge case across **Airsoft Draws**. 

It is structured into **10 Sequential Testing Phases**, complete with **Jira Test Execution Templates**, pre-requisite test data, expected behaviors, and bug report formats.

---

## 🛠️ Phase 1: Environment & Test Setup Preparation

Before executing test cases, prepare your environment and seed test accounts.

### 1.1 Environment Setup (`.env`)
Ensure your `backend/.env` contains the following active keys:

```env
# Server & DB
PORT=5000
DATABASE_URL="postgresql://airsoft_draw_test:2E5kvUm$2b@localhost:5432/airsoft_draw_test"
JWT_SECRET="super-secret-key-change-in-production"
FRONTEND_URL="http://localhost:3000"

# Cashflows Integration
CASHFLOWS_CONFIGURATION_ID="260826100033554432"
CASHFLOWS_API_KEY="48dc6700-eb4f-4d3f-940d-8a3f750137d4"
CASHFLOWS_BASE_URL="https://gateway-int.cashflows.com"
USE_TEST_PAYMENT="false" # Set "true" for instant test mode, "false" for live Cashflows Gateway redirect
```

### 1.2 Database Seeding Commands
Run the provided seeds in `backend/` to populate test categories, plans, and demo accounts:
```bash
cd backend
npm run prisma:seed # Runs seeds for active categories, plans, and demo users
```

### 1.3 Baseline Test Accounts Matrix
| Account Role | Test Email | Default Password | Initial State |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@gmail.com` | `admin@gmail.com` | Active, System Admin Control |
| **Host** | `host@gmail.com` | `host@gmail.com` | Active Verified Profile, Active `Pro` Subscription, £150 Wallet |
| **Client/User** | `client@gmail.com` | `client@gmail.com` | Email Verified, Active |

---

## 🔑 Phase 2: Authentication & Authorization Flow Testing

| Test ID | Feature | Steps to Execute | Expected Outcome | Jira Priority |
| :--- | :--- | :--- | :--- | :--- |
| **AUTH-01** | User Registration (Client) | 1. Go to `/register`.<br>2. Enter Email, Password, Name.<br>3. Submit form. | Account created, verification email sent, redirected to `/register/success`. | High |
| **AUTH-02** | User Login & Cookie Token | 1. Go to `/login`.<br>2. Enter credentials.<br>3. Inspect browser cookies. | JWT `accessToken` stored as `HTTP-Only` cookie. Redirected to dashboard. | Critical |
| **AUTH-03** | Unauthorized Guard Restriction | 1. Log out.<br>2. Attempt direct access to `/dashboard/admin` or `/dashboard/host`. | Blocked by Guard, redirected to `/login` with 401 Unauthorized. | Critical |
| **AUTH-04** | Role Access Restriction | 1. Log in as `CLIENT`.<br>2. Access `/dashboard/admin`. | Blocked by `RolesGuard`, redirected to client dashboard. | High |
| **AUTH-05** | Password Reset Request | 1. Go to `/forgot-password`.<br>2. Enter email. | Reset link sent via SMTP service without leaking account existence. | Medium |

---

## 💼 Phase 3: Host Onboarding & Subscription Flow Testing

| Test ID | Feature | Steps to Execute | Expected Outcome | Jira Priority |
| :--- | :--- | :--- | :--- | :--- |
| **HOST-01** | Host Profile Onboarding | 1. Register new user.<br>2. Navigate to Host Onboarding (`/host`).<br>3. Submit Business Name & Bio. | `HostProfile` created in DB linked to `userId`. Status `isVerified = false`. | High |
| **HOST-02** | Subscription Checkout Trigger | 1. Log in as Host.<br>2. Go to `/pricing`.<br>3. Click "Subscribe" on a Plan. | Backend calls Cashflows Gateway API (`/api/gateway/payment-jobs`). Redirects to Cashflows checkout URL. | Critical |
| **HOST-03** | Cashflows Subscription Confirmation | 1. Complete payment on Cashflows.<br>2. Redirect back to `/dashboard/host/billing?status=success`. | `PaymentReturnListener` calls `/payment/confirm`. `HostSubscription` status updated to `ACTIVE`. | Critical |
| **HOST-04** | Active Subscription Lockout | 1. Attempt to create raffle with `EXPIRED` subscription. | System blocks raffle creation and prompts subscription purchase. | High |

---

## 🎯 Phase 4: Raffle Creation & Admin Moderation Testing

| Test ID | Feature | Steps to Execute | Expected Outcome | Jira Priority |
| :--- | :--- | :--- | :--- | :--- |
| **RAF-01** | Host Create Raffle | 1. Go to `/dashboard/host/create-raffle`.<br>2. Enter Title, Prize Value, Ticket Price, Total Tickets, End Date.<br>3. Upload main image.<br>4. Submit. | Raffle saved with status `PENDING_APPROVAL`. Main image saved in `/uploads`. | Critical |
| **RAF-02** | Instant Wins Configuration | 1. In Create Raffle form, add 3 Instant Win prizes (e.g., Ticket #5, #25, #50).<br>2. Save. | `InstantWin` records created in DB linked to `raffleId` with `isClaimed = false`. | High |
| **RAF-03** | Admin Pending Approvals Queue | 1. Log in as Admin.<br>2. Navigate to `/dashboard/admin/raffles`. | Pending raffle displayed with host details and prize specs. | High |
| **RAF-04** | Admin Approve Raffle | 1. Click "Approve" on pending raffle. | Raffle status updated to `ACTIVE`. Now visible on public homepage and `/live-raffles`. | Critical |
| **RAF-05** | Admin Reject Raffle | 1. Click "Reject" on pending raffle. | Raffle status reverted to `DRAFT` or `CANCELLED` with admin notes. | Medium |

---

## 🌐 Phase 5: Public Website & Client Discovery Testing

| Test ID | Feature | Steps to Execute | Expected Outcome | Jira Priority |
| :--- | :--- | :--- | :--- | :--- |
| **PUB-01** | Live Raffles Grid & Search | 1. Go to `/live-raffles`.<br>2. Enter search term in search bar. | Instant search results filtered dynamically. | Medium |
| **PUB-02** | Category Filtering | 1. Click category tab (e.g. "Rifles", "Pistols"). | Grid displays only raffles matching selected category slug. | Medium |
| **PUB-03** | Raffle Details Page & Countdown | 1. Click on a raffle card.<br>2. Observe countdown timer. | Displays price, tickets remaining, pool value, and real-time live ticking countdown. | High |
| **PUB-04** | Free Postal Entry Compliance Modal | 1. On Raffle details page, click "Free Postal Entry". | Modal opens displaying UK Gambling Act 2005 compliant postal entry instructions. | High |

---

## 🎟️ Phase 6: Client Ticket Purchasing & Instant Win Testing

| Test ID | Feature | Steps to Execute | Expected Outcome | Jira Priority |
| :--- | :--- | :--- | :--- | :--- |
| **TCK-01** | Quantity Selector & Price Tally | 1. On Raffle details page, use quick-pick buttons (1, 5, 10, 20). | Total price updates dynamically (`quantity * pricePerTicket`). | Medium |
| **TCK-02** | Cashflows Ticket Payment Redirect | 1. Log in as Client.<br>2. Select 5 tickets.<br>3. Click "Enter Draw". | Redirected to Cashflows Hosted Payment Page (`https://gateway-int.cashflows.com/payment?ref=...`). | Critical |
| **TCK-03** | Ticket Allocation on Return | 1. Finish payment on Cashflows.<br>2. Redirect back to website with `ordernumber=TCK_...`. | `PaymentReturnListener` triggers `/payment/confirm`. Fisher-Yates shuffle assigns 5 random ticket numbers. | Critical |
| **TCK-04** | Instant Win Claiming | 1. Purchase ticket number matching an Instant Win ticket (e.g. Ticket #5). | `InstantWin.isClaimed` set to `true`. `Winner` record created (`winType: INSTANT_WIN`). | Critical |
| **TCK-05** | Wallet Credit & Tally Update | 1. Complete ticket purchase. | `Raffle.ticketsSold` incremented by quantity. Host's `walletBalance` credited with total purchase amount. | Critical |

---

## 🏆 Phase 7: Winner Selection & Shipping Workflow Testing

| Test ID | Feature | Steps to Execute | Expected Outcome | Jira Priority |
| :--- | :--- | :--- | :--- | :--- |
| **WIN-01** | Auto-Draw on Sold Out | 1. Buy out all remaining tickets of a raffle with `isAutoDraw = true`. | Status changes to `ENDED`. Random draw selects winning ticket. `Winner` record created (`winType: MAIN_DRAW`). | Critical |
| **WIN-02** | Admin Manual Draw Trigger | 1. Log in as Admin.<br>2. Go to `/dashboard/admin/draws`.<br>3. Select concluded raffle and click "Draw Winner". | Random number generator picks winning ticket securely. Winner record generated. | Critical |
| **WIN-03** | User My Wins Dashboard | 1. Log in as winning Client.<br>2. Navigate to `/dashboard/user/winners`. | Prize displayed with delivery status (`PENDING`). | High |
| **WIN-04** | Shipping & Tracking Update | 1. Log in as Host/Admin.<br>2. Go to winners management.<br>3. Change status to `SHIPPED` and enter tracking number `GB123456789`. | Status updated. Client dashboard shows "Shipped" with tracking link. | High |

---

## 💰 Phase 8: Host Wallet & Payout Withdrawals Testing

| Test ID | Feature | Steps to Execute | Expected Outcome | Jira Priority |
| :--- | :--- | :--- | :--- | :--- |
| **WAL-01** | Host Wallet Balance Display | 1. Log in as Host.<br>2. Navigate to `/dashboard/host/wallet`. | Displays accurate net earnings from ticket sales. | High |
| **WAL-02** | Submit Withdrawal Request | 1. Click "Request Withdrawal".<br>2. Enter amount & payout details (e.g., Bank details). | `Withdrawal` row created with status `PENDING`. | High |
| **WAL-03** | Admin Payout Approval | 1. Log in as Admin.<br>2. Go to `/dashboard/admin/withdrawals`.<br>3. Click "Approve & Complete". | Status updated to `COMPLETED`. Host `walletBalance` deducted. `HOST_WITHDRAWAL` transaction logged. | Critical |

---

## 🛡️ Phase 9: System Moderation & Admin Operations Testing

| Test ID | Feature | Steps to Execute | Expected Outcome | Jira Priority |
| :--- | :--- | :--- | :--- | :--- |
| **ADM-01** | Verify Host Profile | 1. Log in as Admin.<br>2. Go to `/dashboard/admin/hosts`.<br>3. Click "Verify Host". | Host profile `isVerified` set to `true`. Verification badge appears on public directory. | High |
| **ADM-02** | Block / Unblock User | 1. In Admin Users table, click "Block User". | User `isBlocked` set to `true`. User logged out and blocked from logging in. | High |
| **ADM-03** | Category Management | 1. Go to `/dashboard/admin/categories`.<br>2. Add new category "Accessories". | Category saved in DB and appears in public filters immediately. | Medium |

---

## ⚡ Phase 10: Security, Concurrency & Stress Edge Cases

| Test ID | Feature | Stress Scenario | Expected Outcome | Jira Priority |
| :--- | :--- | :--- | :--- | :--- |
| **EDGE-01** | Concurrency Ticket Race Condition | Two users attempt to buy the last 1 remaining ticket at the exact same millisecond. | Database `$transaction` isolation locks row. 1 user succeeds, 2nd user receives clean error *"Only 0 tickets remaining"*. | Critical |
| **EDGE-02** | Invalid Webhook Signature | Send POST request to `/api/v1/payment/webhook` with tampered JSON body. | Backend verifies HMAC-SHA512 hash and rejects tampered request safely. | High |
| **EDGE-03** | Duplicate Ticket Confirmation | Refresh return URL `?ordernumber=TCK_...` multiple times. | Backend checks transaction idempotency and prevents duplicate ticket allocation. | High |

---

## 📋 Jira Logging & Documentation Standards

When logging bugs or test executions in Jira, use the following standardized templates:

### 1. Jira Bug Report Template

```markdown
**Summary:** [Module] Brief description of the bug (e.g., [Tickets] Fisher-Yates shuffle fails when remaining tickets count is 1)

**Issue Type:** 🐛 Bug
**Component:** Backend / Frontend / Cashflows Payment
**Priority:** Highest / High / Medium / Low
**Environment:** Staging / Localhost (macOS, Chrome v126)

---

### 📝 Steps to Reproduce:
1. Log in as Client (`client@airsoftdraws.com`).
2. Navigate to Live Raffle `/live-raffles/vfc-hk416-bundle`.
3. Select quantity: `5`.
4. Click "Enter Draw" and complete Cashflows test payment.
5. Observe return page behavior.

### 🎯 Expected Result:
User is redirected to raffle page with 5 new ticket numbers allocated and success modal displayed.

### ❌ Actual Result:
User is redirected to page, but ticket count remains unchanged and 404 error logged in console.

### 📸 Attachments / Console Logs:
```json
{
  "error": "Cashflows Gateway Error (404)"
}
```
```

---

### 2. Jira Test Execution Status Summary Template

```markdown
| Test ID | Module | Tester | Date Executed | Status (PASS/FAIL) | Linked Jira Bug |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **AUTH-01** | Auth | Rakib | 06-Aug-2026 | ✅ PASS | N/A |
| **HOST-02** | Subscriptions | Rakib | 06-Aug-2026 | ✅ PASS | N/A |
| **TCK-03** | Tickets | Rakib | 06-Aug-2026 | ✅ PASS | N/A |
| **WIN-01** | Winner Draw | Rakib | 06-Aug-2026 | ✅ PASS | N/A |
```
