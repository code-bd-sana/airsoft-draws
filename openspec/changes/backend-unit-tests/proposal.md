## Why

The backend currently lacks comprehensive automated unit test coverage across its controllers and services, creating risks of regressions during feature development and refactoring. Introducing a full NestJS Jest unit test suite covering every controller endpoint and service business logic with zero reliance on live databases or external APIs guarantees reliability, validates error handling, and hardens role-based security.

## What Changes

- **Test Infrastructure & Mock Factories**: Implement centralized and reusable mock providers for `PrismaService` (all 14 models and `$transaction`), `JwtService`, `MailService`, and external HTTP calls.
- **Controller Unit Tests**: Implement test suites for all 17 NestJS controllers, verifying HTTP responses, DTO parsing, guard behavior, authentication token validation, and error code mappings.
- **Service Unit Tests**: Implement test suites for all 19 NestJS services, testing business logic branches, database query inputs/outputs, exception throwing, quota calculations, and state machines.
- **Error Condition Coverage**: Test not-found cases (404), validation failures (400), authentication/token errors (401), unauthorized role access (403), business rule violations (competition limits, Instant Wins locks), and server errors.
- **Test Suite Execution & Zero Regression**: Ensure `npm test` runs cleanly and all test suites pass with 100% success rate without changing existing API behavior or modifying production data.

## Capabilities

### New Capabilities
- `backend-unit-testing`: Defines testing requirements and verification criteria for all NestJS backend controllers and services covering authentication, competitions, subscriptions, tickets, user profiles, admin moderation, and compliance workflows.

### Modified Capabilities
<!-- None -->

## Impact

- **Test Files Added**: Unit test files (`*.spec.ts`) across `backend/src/` for all controllers and services.
- **Zero Production Code Behavior Changes**: Business logic, API routes, database schemas, and frontend contracts remain identical.
- **CI/Test Pipeline**: `npm test` passes cleanly with fast, isolated in-memory unit tests.
