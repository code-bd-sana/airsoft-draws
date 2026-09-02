## 1. Global Swagger Configuration & General Endpoints

- [x] 1.1 Enhance Swagger `DocumentBuilder` in `backend/src/main.ts` with Bearer auth, Cookie auth (`accessToken`), dynamic server URL, and module tag descriptions, and verify with `npm run build`.
- [x] 1.2 Add Swagger annotations (`@ApiTags('General')`, `@ApiOperation`, `@ApiResponse`) to `backend/src/app.controller.ts`, and verify with `npx jest src/app.controller.spec.ts`.

## 2. Auth, Users & Hosts Module Documentation

- [x] 2.1 Complete Swagger route documentation, response schemas, and DTO annotations for `backend/src/auth/auth.controller.ts`, and verify with `npx jest src/auth`.
- [x] 2.2 Complete Swagger route documentation, avatar upload schemas, and DTO annotations for `backend/src/users/users.controller.ts`, and verify with `npx jest src/users`.
- [x] 2.3 Complete Swagger route documentation, query filters, and DTO annotations for `backend/src/hosts/hosts.controller.ts`, and verify with `npx jest src/hosts`.

## 3. Raffles, Tickets, Subscriptions & Payment Documentation

- [x] 3.1 Create explicit request DTOs (`create-subscription-request.dto.ts`, `approve-subscription-request.dto.ts`, `reject-subscription-request.dto.ts`, `assign-subscription-manually.dto.ts`) and complete Swagger annotations for `backend/src/subscriptions/subscriptions.controller.ts`, and verify with `npx jest src/subscriptions`.
- [x] 3.2 Complete Swagger documentation and webhook headers for `backend/src/payment/payment.controller.ts`, and verify with `npx jest src/payment`.
- [x] 3.3 Create `update-winner-delivery-status.dto.ts` and complete Swagger annotations for all public, host, and admin endpoints in `backend/src/raffles/raffles.controller.ts`, and verify with `npx jest src/raffles/raffles`.
- [x] 3.4 Complete Swagger documentation, response schemas, and DTO annotations for `backend/src/tickets/tickets.controller.ts`, and verify with `npx jest src/tickets`.

## 4. Categories, Mail & Marketing Documentation

- [x] 4.1 Complete Swagger documentation, multipart image schemas, and DTO annotations for `backend/src/categories/categories.controller.ts`, and verify with `npx jest src/categories`.
- [x] 4.2 Complete Swagger documentation and response schemas for `backend/src/mail/contact.controller.ts`, and verify with `npx jest src/mail`.
- [x] 4.3 Create `update-marketing-report.dto.ts` and complete Swagger route documentation for `backend/src/marketing/marketing.controller.ts`, and verify with `npx jest src/marketing`.

## 5. Admin Modules Documentation

- [x] 5.1 Complete Swagger route documentation and query parameter annotations for `backend/src/admin/dashboard/admin-dashboard.controller.ts`, and verify with `npx jest src/admin/dashboard`.
- [x] 5.2 Complete Swagger route documentation and query parameter annotations for `backend/src/admin/hosts/admin-hosts.controller.ts`, and verify with `npx jest src/admin/hosts`.
- [x] 5.3 Complete Swagger route documentation and refund status annotations for `backend/src/admin/orders/admin-orders.controller.ts`, and verify with `npx jest src/admin/orders`.
- [x] 5.4 Complete Swagger route documentation and user moderation annotations for `backend/src/admin/users/admin-users.controller.ts`, and verify with `npx jest src/admin/users`.
- [x] 5.5 Create compliance DTOs (`compliance-verification.dto.ts`, `alternative-prize.dto.ts`, `prize-transfer.dto.ts`, `fulfillment-packaging.dto.ts`) and complete Swagger annotations for `backend/src/admin/winners/admin-winners.controller.ts`, and verify with `npx jest src/admin/winners`.
- [x] 5.6 Create `update-withdrawal-status.dto.ts` and complete Swagger annotations for `backend/src/admin/withdrawals/admin-withdrawals.controller.ts`, and verify with `npx jest src/admin/withdrawals`.

## 6. Full Build & Verification

- [x] 6.1 Execute full `npm test` across all backend test suites to verify 100% pass rate.
- [x] 6.2 Execute `npm run build` in `backend/` to verify clean TypeScript compilation and valid OpenAPI metadata generation.
