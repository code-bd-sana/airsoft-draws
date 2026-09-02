## Context

The backend uses NestJS with `@nestjs/swagger` and `swagger-ui-express`. Endpoints are distributed across 17 controllers and multiple modules (Auth, Users, Hosts, Raffles, Tickets, Subscriptions, Payment, Categories, Mail, Marketing, and Admin). Several endpoints use inline anonymous TypeScript object signatures for `@Body()`, preventing Swagger from rendering request body schemas and interactive input fields.

See `proposal.md` for motivation and scope.

## Goals / Non-Goals

**Goals:**
- Provide complete, interactive OpenAPI 3.0 documentation for all 17 backend controllers.
- Support dual-authentication in Swagger UI (Bearer JWT token and Cookie `accessToken`).
- Refactor all inline anonymous `@Body()` request types into structured DTO classes with `@ApiProperty` decorators.
- Document all route parameters (`@ApiParam`), query filters (`@ApiQuery`), status codes, and error models.
- Maintain 100% test pass rate across all 36 test suites.

**Non-Goals:**
- Modifying any database schema, Prisma models, or migrations.
- Altering business logic, endpoint routing paths, or JSON response shapes.
- Modifying frontend client code.

## Decisions

### 1. Dual-Authentication Configuration in Swagger
- **Decision**: Configure `DocumentBuilder` in `main.ts` with both `addBearerAuth()` and `addCookieAuth('accessToken')`.
- **Rationale**: The frontend relies on HTTP-only `accessToken` cookies, while API clients and Swagger UI testers may use Bearer tokens in headers. Supporting both allows seamless interactive API testing in Swagger.
- **Alternatives Considered**: Only supporting Bearer tokens would require manual header crafting in curl or third-party tools.

### 2. Converting Inline Request Bodies to Formal DTOs
- **Decision**: Define explicit DTO classes in their respective module `dto/` folders for any controller method currently taking inline types (e.g. `body: { planId: string; ... }`).
- **Rationale**: NestJS Swagger generates request body schemas exclusively from class definitions decorated with `@ApiProperty()`. Inline types produce empty `{}` schemas in OpenAPI.
- **Alternatives Considered**: Using raw `@ApiBody({ schema: { ... } })` annotations on methods would duplicate type definitions and drift from code over time.

### 3. Module Tagging and Logical Organization
- **Decision**: Group endpoints into clear logical tags:
  - `General` (`AppController`)
  - `Authentication` (`AuthController`)
  - `Users` (`UsersController`)
  - `Hosts` (`HostsController`)
  - `Raffles` (`RafflesController`)
  - `Tickets` (`TicketsController`)
  - `Subscriptions` (`SubscriptionsController`)
  - `Payment` (`PaymentController`)
  - `Categories` (`CategoriesController`)
  - `Contact` (`ContactController`)
  - `Marketing Compliance` (`MarketingController`)
  - `Admin - Dashboard` (`AdminDashboardController`)
  - `Admin - Hosts` (`AdminHostsController`)
  - `Admin - Orders` (`AdminOrdersController`)
  - `Admin - Users` (`AdminUsersController`)
  - `Admin - Winners` (`AdminWinnersController`)
  - `Admin - Withdrawals` (`AdminWithdrawalsController`)

## Risks / Trade-offs

- **[Risk] Adding DTOs might accidentally introduce strict class-validator rejections on previously permissive routes**:
  - *Mitigation*: Ensure all optional fields in newly created DTOs are decorated with `@IsOptional()` and `@ApiPropertyOptional()`, matching the exact runtime behavior of existing handlers.
- **[Risk] Test suite breakages due to DTO imports or controller signature changes**:
  - *Mitigation*: Run `npm test` after modifying each controller to verify continuous 100% test pass rate.
