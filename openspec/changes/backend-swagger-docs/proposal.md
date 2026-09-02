## Why

The Airsoft Draws NestJS backend currently has 17 controllers spanning public, client, host, and admin domains. While some basic Swagger tags exist, several endpoints lack comprehensive parameter schemas, response models, error definitions, and strongly-typed request body DTOs (using inline anonymous types instead). Additionally, protected routes require seamless dual-authentication support (Bearer JWT header and HTTP cookies) so that developers, frontend engineers, and QA can reliably explore and test every API endpoint directly in Swagger UI.

## What Changes

- **Global OpenAPI Configuration (`main.ts`)**:
  - Enhance `DocumentBuilder` with dual authentication schemas: Bearer JWT (`bearer`) and HTTP Cookie Auth (`accessToken`).
  - Configure dynamic server environment base URLs (`APP_URL` / `PORT`).
  - Define structured Swagger tags and module groupings (Authentication, Users, Hosts, Raffles, Tickets, Subscriptions, Payment, Categories, Contact, Marketing Compliance, and Admin Modules).
- **Strongly-Typed Request DTOs**:
  - Replace all inline anonymous `@Body()` object declarations across controllers with structured, decorated DTO classes (e.g. `CreateSubscriptionRequestDto`, `ApproveSubscriptionRequestDto`, `UpdateWinnerDeliveryStatusDto`, `ComplianceVerificationDto`, `AlternativePrizeDto`, `PrizeTransferDto`, `FulfillmentPackagingDto`, `UpdateWithdrawalStatusDto`, `UpdateMarketingReportDto`).
  - Annotate all existing and new DTOs with `@ApiProperty` / `@ApiPropertyOptional`, detailed field descriptions, validation constraints, enums, and realistic example payloads.
- **Controller Route Documentation**:
  - Decorate every route across all 17 controllers with `@ApiTags()`, `@ApiOperation()`, `@ApiParam()`, `@ApiQuery()`, `@ApiBody()`, `@ApiConsumes()`, and comprehensive `@ApiResponse()` statuses (200, 201, 400, 401, 403, 404, 409).
  - Annotate protected routes with `@ApiBearerAuth()` and cookie requirements.
- **Zero Business Logic Modification**:
  - Strictly maintain existing business functionality, database models, route paths, runtime response payloads, and 100% test pass rate across all 36 test suites.

## Capabilities

### New Capabilities
- `backend-swagger-docs`: Comprehensive OpenAPI 3.0 specification and Swagger UI documentation covering all 17 backend controllers, routes, parameters, DTOs, and dual authentication.

### Modified Capabilities

## Impact

- **Affected Code**: `backend/src/main.ts`, all controllers in `backend/src/**`, new and existing DTOs in `backend/src/**/dto/`.
- **Dependencies**: `@nestjs/swagger` and `swagger-ui-express` (already installed).
- **External Behavior**: Unchanged API responses and database behaviors; enriched Swagger UI at `/api` and OpenAPI JSON at `/api-json`.
