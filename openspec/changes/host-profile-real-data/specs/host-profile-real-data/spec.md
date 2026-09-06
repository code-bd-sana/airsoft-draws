## Purpose

Ensure verified airsoft hosts present accurate, dynamic, and complete branding (business name, logo avatar, biography, location, and competitions) across public profile pages and directory listings, replacing hardcoded placeholder content with real database-backed information.

## MODIFIED Requirements

### Requirement: Real Host Biography and Profile Details via Public API
The backend public host endpoint `GET /api/v1/hosts/public/:slug` SHALL return the real host biography, location, and user avatar URL rather than null or static placeholders.

#### Scenario: Fetching existing host by slug
- **GIVEN** a host exists with business name "Airsoft Tactical Armory", bio "Official verified supplier of custom airsoft builds.", location "Manchester, UK", and an avatar URL
- **WHEN** a client sends a GET request to `/api/v1/hosts/public/airsoft-tactical-armory`
- **THEN** the response status is 200
- **AND** the payload contains `bio` matching the database record
- **AND** the payload contains `logo` matching the host user's `avatarUrl`
- **AND** the payload contains the host's `location`

#### Scenario: Fetching verified hosts directory
- **GIVEN** multiple verified hosts exist in the database
- **WHEN** a client sends a GET request to `/api/v1/hosts/verified`
- **THEN** each returned host profile includes their real `description` (derived from `host.bio`) and `logo`

### Requirement: Dynamic Frontend Public Host Profile
The public host profile page at `/hosts/[slug]` SHALL display the host's real brand name, logo image, biography, and geographical location across both the header and the "About" tab.

#### Scenario: Viewing host profile header
- **GIVEN** the host has an avatar image URL
- **WHEN** an entrant views `/hosts/airsoft-tactical-armory`
- **THEN** the header displays the actual host logo image in the circular avatar container
- **AND** the header displays the host's real biography snippet

#### Scenario: Viewing "About" tab on host profile
- **GIVEN** an entrant navigates to `/hosts/airsoft-tactical-armory` and selects the "About" tab
- **WHEN** the tab content renders
- **THEN** the heading displays "About Airsoft Tactical Armory"
- **AND** the body displays the host's real registered biography
- **AND** the location badge displays the host's registered city/country
- **AND** no hardcoded references to "TacticalGear UK" appear

### Requirement: Host Onboarding Logo and Slug Generation
When a host registers via `/host/register`, the system SHALL generate a unique URL slug from the business name and persist the host profile details.

#### Scenario: Registering a new host with business branding
- **GIVEN** a prospective host completes the multi-step registration with business name "Valkyrie Airsoft Custom" and bio "Custom precision upgrades"
- **WHEN** the host submits the registration form
- **THEN** a `HostProfile` is created with slug `valkyrie-airsoft-custom`
- **AND** the bio and business details are stored in the database
- **AND** visiting `/hosts/valkyrie-airsoft-custom` resolves the host's public profile

### Requirement: Host Route Redirection
The system SHALL provide seamless routing for common root paths `/host` and `/hosts`.

#### Scenario: Navigating to `/hosts` directory
- **WHEN** a user navigates to `/hosts`
- **THEN** the application redirects the user to `/verified-hosts`

#### Scenario: Navigating to `/host` landing
- **WHEN** an unauthenticated user navigates to `/host`
- **THEN** the application redirects the user to `/host/register` or `/verified-hosts`
