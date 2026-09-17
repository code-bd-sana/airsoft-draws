## 1. Database & Schema

- [x] 1.1 Add `Notification` model to `backend/prisma/schema.prisma` with relation to `User` and indexes, and verify schema validation with `npx prisma validate`.
- [x] 1.2 Apply schema changes to database via `npx prisma db push` and regenerate Prisma client with `npx prisma generate`.

## 2. Backend Notifications Module

- [x] 2.1 Create `backend/src/notifications` module structure with `notifications.module.ts`, `notifications.service.ts`, and `notifications.controller.ts`.
- [x] 2.2 Implement `NotificationsService` with methods: `findAllForUser`, `getUnreadCount`, `markAsRead`, `markAllAsRead`, `createNotification`, and `notifyAdmins`.
- [x] 2.3 Implement `NotificationsController` exposing endpoints: `GET /api/v1/notifications`, `GET /api/v1/notifications/unread-count`, `PATCH /api/v1/notifications/:id/read`, and `PATCH /api/v1/notifications/read-all` secured with `JwtAuthGuard`.
- [x] 2.4 Add comprehensive unit tests in `notifications.service.spec.ts` and `notifications.controller.spec.ts` and verify with `npm test`.

## 3. Event Dispatch Integration

- [x] 3.1 Integrate ticket purchase and instant win notifications in `TicketsService` and verify records are generated for buyer and host.
- [x] 3.2 Integrate raffle approval and rejection notifications in `RafflesService` and verify host receives status update.
- [x] 3.3 Integrate winner drawn notifications in `RafflesService` and `DrawSchedulerService`.
- [x] 3.4 Integrate withdrawal request and status update notifications in `HostsService` and `AdminWithdrawalsService`.
- [x] 3.5 Integrate subscription request and approval notifications in `SubscriptionsService`.

## 4. Frontend Hooks & Dashboard UI Integration

- [x] 4.1 Create `frontend/hooks/useNotificationHooks.ts` providing React Query hooks for fetching notifications, unread count polling (30s interval), and mark-as-read mutations.
- [x] 4.2 Update `DashboardTopbar.tsx` to dynamically render the unread notification badge/dot based on live count.
- [x] 4.3 Update `NotificationsDropdown.tsx` to display real notifications, support filter tabs (All, Unread, Wins, Payments, Draws), direct link redirection, and "Mark all as read" functionality.
- [x] 4.4 Replace the placeholder in `frontend/app/dashboard/host/notifications/page.tsx` with a dedicated notification history page featuring filtering and pagination.

## 5. End-to-End Verification

- [x] 5.1 Run backend unit tests and build with `npm run build` in `backend`.
- [x] 5.2 Run frontend production build with `npm run build` in `frontend` and ensure zero TypeScript or routing errors.
- [x] 5.3 Test live API response and verify notification creation and unread badge retrieval across Admin, Host, and User.
