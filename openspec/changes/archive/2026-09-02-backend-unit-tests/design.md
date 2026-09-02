## Context

See `proposal.md` for background motivation. Currently, the backend runs on NestJS with Jest and `ts-jest`, but existing tests are minimal scaffolding that fail due to unmocked `PrismaService` and `JwtService` dependencies. This design provides the technical architecture and mock patterns to test all 17 controllers and 19 services in total isolation.

## Goals / Non-Goals

**Goals:**
- Provide unit tests (`*.spec.ts`) for all 17 NestJS controllers and 19 services.
- Establish centralized mock factories for `PrismaService` (all 14 models + `$transaction`), `JwtService`, and `MailService`.
- Verify input validations, business logic boundaries (active competition quotas, Instant Wins tier gating), error handling (400, 401, 403, 404), and state transitions.
- Guarantee that `npm test` runs cleanly and passes 100% in an isolated in-memory environment with zero reliance on live databases or external APIs.

**Non-Goals:**
- Modifying production business logic, API route paths, payload contracts, or database schemas.
- Setting up Docker-dependent E2E integration test suites.
- Adding frontend testing or altering UI components.

## Decisions

### Decision 1: Shared Reusable Mock Helpers vs Per-File Ad-hoc Mocks
- **Choice:** Create a reusable test mock utility (`src/test-utils/prisma-mock.ts` or local helper functions) providing complete mock implementations for all 14 Prisma models (`user`, `hostProfile`, `subscriptionPlan`, `hostSubscription`, `subscriptionRequest`, `category`, `raffle`, `raffleImage`, `instantWinPrize`, `ticket`, `transaction`, `winner`, `withdrawal`, `activityLog`) and `$transaction`.
- **Rationale:** Prevents copy-pasting hundreds of lines of mock objects across 30+ test suites and ensures uniform mocking behavior.
- **Alternative Considered:** Defining mocks inline in every test file (leads to boilerplate, brittle tests, and maintenance burden).

### Decision 2: Isolated Controller Testing via Mocked Services
- **Choice:** Test controllers using `@nestjs/testing` `TestingModule` with the corresponding service mocked via `{ provide: ServiceName, useValue: mockService }`.
- **Rationale:** Ensures controllers are tested strictly on input mapping, HTTP response formatting, and guard compatibility rather than duplicating service testing.

### Decision 3: Service Testing via In-Memory Prisma Mock
- **Choice:** Inject mocked `PrismaService` into service testing modules and stub method returns (`findUnique`, `findMany`, `create`, `update`, `count`, etc.) for each scenario.
- **Rationale:** Fast execution (< 5s for full suite) with deterministic assertions for all branches (success, 404 NotFound, 403 Forbidden, 400 BadRequest).

### Decision 4: Mocking `$transaction` Callbacks
- **Choice:** Mock `prisma.$transaction` to accept either an array of promises or an interactive transaction callback function, invoking the callback with the mock Prisma client.
- **Rationale:** Accurately exercises transaction logic in `raffles.service.ts`, `tickets.service.ts`, and `payment.service.ts` without needing a real database transaction.

## Risks / Trade-offs

- **[Risk]** Mocked return objects drift from actual Prisma entity shapes.
  - **Mitigation:** Type mock return fixtures using TypeScript interfaces matching Prisma client generated models.
- **[Risk]** Guards (`JwtAuthGuard`, `RolesGuard`) failing during unit test instantiation.
  - **Mitigation:** Provide mock `JwtService` and `Reflector` in controller test module definitions or mock guard execution.
