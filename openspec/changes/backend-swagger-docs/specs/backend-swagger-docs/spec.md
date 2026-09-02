## Purpose

Provides comprehensive, interactive OpenAPI 3.0 documentation and Swagger UI testing capabilities for all backend endpoints across the platform.

## ADDED Requirements

### Requirement: Interactive Swagger Documentation
The system SHALL expose an interactive Swagger UI documentation endpoint at `/api` and an OpenAPI specification JSON document at `/api-json`.

#### Scenario: Accessing Swagger UI
- **WHEN** a client or developer navigates to `/api` in a web browser
- **THEN** the system displays the Swagger UI interface containing all documented API tags, controllers, schemas, and endpoints

#### Scenario: Accessing OpenAPI JSON
- **WHEN** a client or automated tool requests `/api-json`
- **THEN** the system returns a valid OpenAPI 3.0 specification in JSON format

### Requirement: Dual-Authentication in Swagger UI
The Swagger UI SHALL support authorization via Bearer JWT token header and HTTP cookie token (`accessToken`) for testing protected routes directly from the browser.

#### Scenario: Authorizing with Bearer Token
- **WHEN** a user enters a valid JWT token into the Swagger UI Authorize modal under the Bearer scheme
- **THEN** subsequent test requests executed from Swagger UI include the `Authorization: Bearer <token>` header

#### Scenario: Testing Protected Endpoints
- **WHEN** an authorized user executes a protected API call from Swagger UI
- **THEN** the API successfully validates authentication and processes the request according to the user's role

### Requirement: Strongly-Typed Request and Response Schemas
Every API endpoint SHALL have explicit request body schemas, path/query parameters, status codes, and error models defined in Swagger.

#### Scenario: Inspecting Request Models
- **WHEN** a user expands an endpoint in Swagger UI
- **THEN** the system displays explicit property types, descriptions, validation constraints, and realistic example payloads

#### Scenario: Documenting Error Responses
- **WHEN** an endpoint can return error statuses (such as 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict)
- **THEN** Swagger UI lists the corresponding status codes with clear descriptions and error response structures
