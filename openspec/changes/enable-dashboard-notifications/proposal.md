## Why

Currently, the dashboard header across Admin, Host, and User portals displays a notification bell icon with hardcoded dummy data and a static unread dot, while the backend lacks any notification data model or service. Crucial platform lifecycle events—such as ticket purchases, instant win claims, raffle approvals or rejections, winner selections, withdrawal updates, and subscription approvals—occur silently without notifying the relevant stakeholders. Adding a unified, robust in-app notification system keeps all users and administrators informed of high-priority actions without disrupting existing workflows.

## What Changes

- **Database Model**: Introduce a `Notification` entity in Prisma schema with relations to `User`, typed categories (`WIN`, `PAYMENT`, `DRAW`, `APPROVAL`, `WITHDRAWAL`, `SYSTEM`), status flags (`isRead`), redirect links, and structured metadata.
- **Backend Service & API (`NotificationsModule`)**: Create a comprehensive NestJS module providing:
  - `GET /api/v1/notifications`: Paginated list of notifications for the authenticated user with status and type filters.
  - `GET /api/v1/notifications/unread-count`: Fast query returning unread notification count for the topbar badge.
  - `PATCH /api/v1/notifications/:id/read`: Mark an individual notification as read.
  - `PATCH /api/v1/notifications/read-all`: Bulk mark all unread notifications as read.
- **Event Dispatching Integration**: Add non-intrusive notification creation calls into existing backend services:
  - Ticket purchases and instant win claims in `TicketsService`.
  - Raffle approvals and rejections in `RafflesService`.
  - Winner selection and draw completion in `RafflesService` and `DrawSchedulerService`.
  - Withdrawal submissions and status updates in `HostsService` and `AdminWithdrawalsService`.
  - Subscription request submissions and approvals in `SubscriptionsService`.
- **Frontend Dashboard Integration**:
  - Connect `DashboardTopbar` to dynamically render the unread notification badge count.
  - Update `NotificationsDropdown` to fetch real data via SWR / polling, support filter tabs (All, Unread, Wins, Payments, Draws), mark-as-read interactions, and route navigation on click.
  - Replace the placeholder on `/dashboard/host/notifications` with a dedicated notification history view.

## Capabilities

### New Capabilities
- `dashboard-notifications`: Real-time and persistent in-app notification system supporting event-driven creation, read/unread state tracking, role-scoped dispatching (Admin, Host, User), and interactive dashboard UI dropdown and history views.

### Modified Capabilities
<!-- None -->

## Impact

- **Database**: Add `notifications` table and indexes (`user_id`, `is_read`, `created_at`) via Prisma.
- **Backend APIs**: New endpoints under `/api/v1/notifications` protected by JWT guard. Zero breaking changes to existing endpoints.
- **Frontend Components**: `NotificationsDropdown.tsx`, `DashboardTopbar.tsx`, and `/dashboard/host/notifications/page.tsx` connected to live notification hooks.
