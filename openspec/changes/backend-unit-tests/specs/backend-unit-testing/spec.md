## Purpose

Defines comprehensive unit testing requirements and verification criteria for all NestJS backend API controllers and services with 100% mocked database and external dependencies.

## ADDED Requirements

### Requirement: Complete Controller and Service Unit Test Coverage
The test suite SHALL provide unit test coverage for all 17 NestJS controllers and 19 services across the application using `@nestjs/testing` and Jest.

#### Scenario: Running the complete test suite
- **WHEN** `npm test` is executed in the backend directory
- **THEN** all controller and service unit test suites execute and pass with 0 failures.

### Requirement: Database and External Service Mocking
The test suite SHALL mock `PrismaService`, `JwtService`, `MailService`, payment webhooks, and filesystem operations in memory without reading or modifying live databases or making real network requests.

#### Scenario: Executing tests in isolated environment
- **WHEN** tests are run without an active database connection or external network access
- **THEN** tests execute successfully using deterministic mock responses.

### Requirement: Authentication and Authorization Verification
The unit tests SHALL verify that routes requiring authentication or specific roles enforce token verification and role guards correctly.

#### Scenario: Controller handles missing or invalid authentication token
- **WHEN** an authenticated route is invoked with an invalid or missing token
- **THEN** the controller/guard throws a 401 Unauthorized exception.

#### Scenario: Non-admin user attempts admin endpoint
- **WHEN** a user with a non-admin role invokes an admin-protected endpoint
- **THEN** the role guard rejects the request with a 403 Forbidden exception.

### Requirement: Business Logic and Quota Limit Validation
The unit tests SHALL verify critical business constraints, including competition creation quotas, feature gating, ticket stock limits, and draw winner selection.

#### Scenario: Host exceeds active competition plan limit
- **WHEN** a host on the Free plan attempts to create a 2nd active competition
- **THEN** the service rejects the request with a 403 Forbidden exception.

#### Scenario: Free tier host attempts to configure Instant Wins
- **WHEN** a host on the Free plan submits Instant Win prizes
- **THEN** the service throws a 403 Forbidden exception restricting Instant Wins to paid tiers.

#### Scenario: Drawing a raffle winner
- **WHEN** an admin triggers a draw for a competition with sold tickets
- **THEN** the service selects a valid winning ticket, creates a Winner record, and transitions the competition status to ENDED.

### Requirement: Error and Not Found Handling
The unit tests SHALL verify that invalid inputs, negative quantities, duplicate unique records, and missing entity IDs return appropriate HTTP status codes (400, 404, 409).

#### Scenario: Requesting non-existent entity by ID
- **WHEN** an endpoint is queried with a non-existent entity identifier
- **THEN** the service throws a 404 NotFoundException.

#### Scenario: Purchasing tickets with invalid quantity
- **WHEN** a ticket purchase is submitted with quantity less than or equal to 0
- **THEN** the endpoint returns a 400 BadRequestException.
