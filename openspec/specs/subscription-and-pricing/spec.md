## Purpose

Defines host subscription tiers, pricing rates, live competition limits, feature gating, and backend quota enforcement across the Airsoft Draws platform.

## Requirements

### Requirement: Standardized Subscription Tiers and Pricing
The system SHALL support three distinct subscription plans with predefined monthly pricing and live competition allowances:
1. **Free Plan**: £0 per month, with a limit of 1 live competition and access to basic host dashboard tools.
2. **Premium Plan**: £29 per month, with a limit of up to 3 live competitions, access to Instant Wins, and 3 monthly featured listings.
3. **Pro Plan**: £79 per month, with unlimited live competitions, access to Instant Wins, unlimited featured listings, custom branding, and advanced analytics.

#### Scenario: Host views pricing plans on public pricing page
- **WHEN** any visitor navigates to `/pricing`
- **THEN** the system displays Free at £0/mo (1 live competition), Premium at £29/mo (up to 3 live competitions), and Pro at £79/mo (unlimited live competitions).

#### Scenario: Host checks current plan quota in billing dashboard
- **WHEN** an authenticated host accesses `/dashboard/host/billing`
- **THEN** the system displays their current active subscription plan along with its specific live competition limit (1 for Free, 3 for Premium, Unlimited for Pro).

### Requirement: Enforcing Live Competition Limits
The backend SHALL enforce the active subscription plan's maximum live competition limit upon competition creation and publication. Active, pending review, and draft competitions count towards the host's quota if applicable.

#### Scenario: Free plan host creates a second live competition
- **WHEN** a host on the Free plan who already has 1 active or pending competition attempts to create a new competition
- **THEN** the backend rejects the creation with a 403 Forbidden error stating that the maximum limit of 1 competition for the Free plan has been reached.

#### Scenario: Premium plan host creates up to 3 live competitions
- **WHEN** a host on the Premium plan has 2 active competitions and creates a 3rd competition
- **THEN** the backend allows the creation and transitions the competition to pending review.

#### Scenario: Premium plan host attempts to exceed 3 live competitions
- **WHEN** a host on the Premium plan who already has 3 active or pending competitions attempts to create a 4th competition
- **THEN** the backend rejects the request with a 403 Forbidden error indicating the plan limit of 3 live competitions has been reached.

#### Scenario: Pro plan host creates multiple competitions without limit
- **WHEN** a host on the Pro plan creates more than 3 active competitions
- **THEN** the backend permits the creation without rejecting for plan limit quotas.

### Requirement: Feature Gating for Instant Wins
The system SHALL restrict Instant Wins creation to paid subscription tiers (Premium and Pro).

#### Scenario: Free plan host attempts to enable Instant Wins
- **WHEN** a host on the Free plan attempts to add Instant Wins to a competition
- **THEN** the system disallows Instant Wins and prompts the host to upgrade to Premium or Pro.

#### Scenario: Premium or Pro host adds Instant Wins
- **WHEN** a host on the Premium or Pro plan configures Instant Wins during competition creation
- **THEN** the system validates and saves the instant win prizes successfully.
