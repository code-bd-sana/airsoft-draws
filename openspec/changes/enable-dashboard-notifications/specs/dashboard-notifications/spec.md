## Purpose

Provides in-app notification creation, persistent database storage, unread tracking, and real-time dashboard presentation for Admin, Host, and User stakeholders across critical competition and transaction events.

## ADDED Requirements

### Requirement: Notification In-App Storage and Retrieval
The system SHALL store notifications persistently in the database and allow authenticated users to fetch their paginated notifications sorted in reverse chronological order.

#### Scenario: Authenticated user fetches their notifications
- **WHEN** an authenticated user sends `GET /api/v1/notifications` with optional `page`, `limit`, `type`, and `unreadOnly` parameters
- **THEN** the system MUST return a JSON list of notifications belonging exclusively to that user, including `id`, `type`, `title`, `subtitle`, `link`, `isRead`, `metadata`, and `createdAt`, with total count and pagination metadata

#### Scenario: Unauthenticated request rejected
- **WHEN** an unauthenticated request attempts to access `GET /api/v1/notifications`
- **THEN** the system MUST return an HTTP 401 Unauthorized response

### Requirement: Unread Notification Count Badge
The system SHALL provide a lightweight endpoint returning the count of unread notifications for the authenticated user to power the dashboard topbar badge.

#### Scenario: Querying unread notifications count
- **WHEN** an authenticated user requests `GET /api/v1/notifications/unread-count`
- **THEN** the system MUST return a JSON payload with `{ count: number }` indicating how many unread notifications exist for that user

### Requirement: Mark Notifications as Read
The system SHALL allow users to mark an individual notification or all their unread notifications as read.

#### Scenario: Mark single notification as read
- **WHEN** an authenticated user sends `PATCH /api/v1/notifications/:id/read` for a notification belonging to them
- **THEN** the system MUST set `isRead` to `true` on that notification and return the updated record

#### Scenario: Prevent marking other users notifications
- **WHEN** a user attempts to mark as read a notification that belongs to another user
- **THEN** the system MUST return an HTTP 404 Not Found or 403 Forbidden response without modifying the notification

#### Scenario: Mark all user notifications as read
- **WHEN** an authenticated user sends `PATCH /api/v1/notifications/read-all`
- **THEN** the system MUST mark all unread notifications belonging to that user as `isRead: true` and return the number of updated records

### Requirement: Event-Driven Lifecycle Notifications
The system SHALL automatically create notifications when critical platform events occur, delivering them to the appropriate Admin, Host, or User accounts.

#### Scenario: Ticket purchase creates buyer and host notifications
- **WHEN** a user completes a ticket purchase for a raffle
- **THEN** the system MUST create a `PAYMENT` notification for the purchasing user with ticket details AND a `PAYMENT` sale notification for the host who created the raffle

#### Scenario: Instant win claim creates winner and host notifications
- **WHEN** a purchased ticket triggers an instant win prize
- **THEN** the system MUST create a `WIN` notification for the ticket buyer AND an instant win alert notification for the host

#### Scenario: Raffle approval or rejection notifies host
- **WHEN** an administrator approves or rejects a host's submitted competition
- **THEN** the system MUST create an `APPROVAL` notification for the competition host indicating whether it went live or was rejected with notes

#### Scenario: Winner drawn notifies winner and host
- **WHEN** a raffle draw is executed and a winning ticket is selected
- **THEN** the system MUST create a `WIN` notification for the winner and a `DRAW` completion notification for the host

#### Scenario: Host withdrawal request notifies admin and host
- **WHEN** a host submits a new withdrawal request
- **THEN** the system MUST create a `WITHDRAWAL` notification for all system administrators, and upon approval/rejection, create a status update notification for the host

#### Scenario: Subscription request submission and approval notifies admin and host
- **WHEN** a host submits a subscription request or an admin approves it
- **THEN** the system MUST notify administrators upon submission, and notify the host upon approval/activation

### Requirement: Dashboard Dropdown and History Presentation
The frontend dashboard topbar and dedicated notification pages SHALL render live notification records, support category filtering, and enable interactive mark-as-read and direct link navigation.

#### Scenario: User opens notification dropdown in topbar
- **WHEN** any logged-in user clicks the notification bell in `DashboardTopbar`
- **THEN** the system MUST display their recent notifications, show the dynamic unread count dot, allow filtering by tabs (All, Unread, Wins, Payments, Draws), and allow single or bulk mark-as-read

#### Scenario: Host views full notifications page
- **WHEN** a host navigates to `/dashboard/host/notifications`
- **THEN** the system MUST render the full notification history list with pagination, search, and type filtering instead of a coming soon placeholder
