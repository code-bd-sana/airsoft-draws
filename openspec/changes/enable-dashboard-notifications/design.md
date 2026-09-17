## Context

See `proposal.md` for motivation and background. The application utilizes NestJS (backend) with Prisma ORM connected to PostgreSQL, and Next.js 16 (frontend) with React Query / SWR client data fetching. `DashboardTopbar` and `NotificationsDropdown` currently exist as static UI shells with hardcoded dummy items.

## Goals / Non-Goals

**Goals:**
- Provide reliable database persistence for notifications across all user roles (Admin, Host, User).
- Enable event-driven notification dispatch without disrupting existing core business transactions (purchases, raffle creation, payouts).
- Deliver live dashboard notifications in `NotificationsDropdown` with real unread count badges, filtering, and mark-as-read controls.
- Implement the full host notification history page at `/dashboard/host/notifications`.

**Non-Goals:**
- Native browser push notifications (WebPush / ServiceWorker) - out of scope for in-app dashboard notification milestone.
- Complex bi-directional WebSocket infrastructure - polling with React Query window focus refetch provides high reliability with minimal server overhead.
- SMS / Twilio notifications.

## Decisions

### 1. Data Model in Prisma Schema
Introduce the `Notification` model:
```prisma
model Notification {
  id          String    @id @default(uuid()) @db.VarChar(255)
  userId      String    @map("user_id") @db.VarChar(255)
  type        String    @db.VarChar(50) // WIN, PAYMENT, DRAW, APPROVAL, WITHDRAWAL, SYSTEM
  title       String    @db.VarChar(255)
  subtitle    String?   @db.Text
  link        String?   @db.VarChar(255)
  isRead      Boolean   @default(false) @map("is_read")
  metadata    Json?
  createdAt   DateTime  @default(now()) @map("created_at")

  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, isRead])
  @@index([createdAt])
  @@map("notifications")
}
```
*Rationale*: A dedicated table with a foreign key to `User` and composite index on `[userId, isRead]` ensures sub-millisecond retrieval of user notifications and unread badge counts.

### 2. Non-Blocking Event Hook Architecture
Notification creation calls inside business services (e.g., `TicketsService`, `RafflesService`, `HostsService`) will be wrapped in try/catch error logging.
*Rationale*: If a notification dispatch ever fails, it MUST NOT abort ticket transactions, raffle approvals, or payment processing. Business logic reliability remains paramount.

### 3. Client Data Fetching Strategy (React Query Polling)
Use React Query / SWR with a 30-second refetch interval and automatic refetch on window focus.
*Rationale*: Avoids stateful WebSocket connection overhead, firewall proxies, and disconnection recovery complexities while delivering near-instant updates for users actively browsing the dashboard.

### 4. Direct Action Redirection
Each notification record includes an optional `link` field (e.g., `/dashboard/user/tickets`, `/dashboard/host/competitions`, `/dashboard/admin/approvals`). When a user clicks a notification in the dropdown, the frontend automatically marks it as read and navigates to the target page.

## Risks / Trade-offs

- **[Risk: High volume of notifications slowing queries]**  
  → *Mitigation*: Indexed on `[userId, isRead]` and `[createdAt]` with pagination default of 15 items per fetch.
- **[Risk: Stale unread count]**  
  → *Mitigation*: React Query cache invalidation triggers immediately upon marking notifications as read or clicking a notification item.
- **[Risk: Admin notifications targeting multiple admin users]**  
  → *Mitigation*: Helper utility `notifyAdmins()` queries all users with `role: 'ADMIN'` and dispatches records in a single `createMany` batch.
