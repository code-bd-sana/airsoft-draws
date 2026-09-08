# Delta Spec: Host Logo Registration & Profile Synchronization

## Purpose

Unify host logo handling across the registration wizard, host dashboard profile, verified hosts directory, and public host profile pages so that logos uploaded during onboarding persist immediately to the user's avatar in the database and display consistently across the platform.

## MODIFIED Requirements

### Requirement: Host Logo Persistence During Registration
The system SHALL persist the host's uploaded logo/avatar to `User.avatarUrl` during host registration so that the logo is stored in the same storage destination (`./uploads/avatars/`) and schema column as dashboard profile uploads.

#### Scenario: Registering a host with a business logo
- **GIVEN** a user completes the host registration form and uploads a valid PNG or JPEG logo at Step 4
- **WHEN** the user submits the registration form at Step 8
- **THEN** the logo file is uploaded to the backend avatar storage (`/uploads/avatars/`)
- **AND** the created `User` record has `avatarUrl` populated with the generated avatar URL
- **AND** when the host visits their Host Dashboard profile, their uploaded logo is displayed without needing re-upload

### Requirement: Automatic Host Profile Slug Generation
When a host account is created, the system SHALL generate a unique, URL-safe slug from the host's `businessName` and assign it to the `HostProfile`.

#### Scenario: Creating a host profile with business name
- **GIVEN** a host registers with `businessName: "Tactical Armory UK"`
- **WHEN** the `HostProfile` is created in the database
- **THEN** the `slug` field is populated with a URL-safe string such as `"tactical-armory-uk"`
- **AND** the public profile resolves at `/hosts/tactical-armory-uk` as well as its UUID fallback

### Requirement: Dynamic Field Binding on Public Host Pages
The public host directory at `/verified-hosts` and individual host page at `/hosts/[slug]` SHALL display real dynamic data from the database with no hardcoded fallback texts.

#### Scenario: Viewing a verified host in the directory
- **GIVEN** a verified host exists with `businessName`, `bio`, and `avatarUrl`
- **WHEN** a visitor views `/verified-hosts`
- **THEN** the host card renders the host's real logo image, name, bio snippet, and active competitions count
- **AND** clicking the card navigates to `/hosts/[slug]`

#### Scenario: Viewing individual host profile page
- **GIVEN** a visitor navigates to `/hosts/[slug]` (or `/hosts/[id]`)
- **WHEN** the page loads
- **THEN** the header renders the host's real avatar logo, business name, bio, verified badge, member since year, and hosted draws count
- **AND** the "About" tab displays the host's registered biography, location/address, and member since year
- **AND** the "Active Draws" and "Past Draws" tabs render real competitions filtered from the host's raffle catalog
