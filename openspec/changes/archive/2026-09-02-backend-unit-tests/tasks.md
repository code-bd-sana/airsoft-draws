## 1. Test Mock Infrastructure & Core Services

- [x] 1.1 Create centralized Prisma mock factory in `src/test-utils/prisma-mock.ts` supporting all 14 models and interactive `$transaction`, and verify with a test runner check.
- [x] 1.2 Implement unit tests for `AppController`, `AppService`, and `PrismaService` lifecycle hooks, and verify with `npx jest src/app.controller.spec.ts src/app.service.spec.ts src/prisma/prisma.service.spec.ts`.

## 2. Authentication & User Management Test Suites

- [x] 2.1 Implement unit tests for `AuthService` (register, login, forgot/reset password, email verification) and `AuthController`, and verify with `npx jest src/auth`.
- [x] 2.2 Implement unit tests for `UsersService` (profile lookup, update, password change) and `UsersController`, and verify with `npx jest src/users`.
- [x] 2.3 Implement unit tests for `HostsService` (profile, balances, withdrawal requests) and `HostsController`, and verify with `npx jest src/hosts`.

## 3. Subscriptions & Payment Test Suites

- [x] 3.1 Implement unit tests for `SubscriptionsService` (plan limits, requests, renewals) and `SubscriptionsController`, and verify with `npx jest src/subscriptions`.
- [x] 3.2 Implement unit tests for `PaymentService` (checkout sessions, Stripe webhooks, status checks) and `PaymentController`, and verify with `npx jest src/payment`.

## 4. Raffles, Tickets & Draw Scheduler Test Suites

- [x] 4.1 Implement unit tests for `RafflesService` (CRUD, plan quota checks, Instant Wins validation, status filters) and `RafflesController`, and verify with `npx jest src/raffles/raffles`.
- [x] 4.2 Implement unit tests for `TicketsService` (purchasing, ticket allocation, validation) and `TicketsController`, and verify with `npx jest src/tickets`.
- [x] 4.3 Implement unit tests for `DrawSchedulerService` (cron job, winner selection, raffle finalization), and verify with `npx jest src/raffles/draw-scheduler.service.spec.ts`.

## 5. Categories, Mail & Marketing Test Suites

- [x] 5.1 Implement unit tests for `CategoriesService` and `CategoriesController`, and verify with `npx jest src/categories`.
- [x] 5.2 Implement unit tests for `MailService` and `ContactController`, and verify with `npx jest src/mail`.
- [x] 5.3 Implement unit tests for `MarketingService` and `MarketingController`, and verify with `npx jest src/marketing`.

## 6. Admin Module Test Suites

- [x] 6.1 Implement unit tests for `AdminDashboardService` and `AdminDashboardController`, and verify with `npx jest src/admin/dashboard`.
- [x] 6.2 Implement unit tests for `AdminHostsService` and `AdminHostsController`, and verify with `npx jest src/admin/hosts`.
- [x] 6.3 Implement unit tests for `AdminOrdersService` and `AdminOrdersController` (including refunds), and verify with `npx jest src/admin/orders`.
- [x] 6.4 Implement unit tests for `AdminUsersService` and `AdminUsersController` (block/unblock, role moderation), and verify with `npx jest src/admin/users`.
- [x] 6.5 Implement unit tests for `AdminWinnersService` and `AdminWinnersController`, and verify with `npx jest src/admin/winners`.
- [x] 6.6 Implement unit tests for `AdminWithdrawalsService` and `AdminWithdrawalsController`, and verify with `npx jest src/admin/withdrawals`.

## 7. Full Suite Verification & Zero Regression

- [x] 7.1 Execute full `npm test` across all backend test suites and verify 100% pass rate with zero failures.
