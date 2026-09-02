## Why

The platform's subscription plans and pricing structure need to be standardized and accurately aligned across the frontend marketing pages, host billing dashboard, competition creation wizards, backend validation services, payment flows, and database. Aligning the plans to Free (1 live competition), Premium (£29, up to 3 live competitions), and Pro (£79, unlimited live competitions) ensures clean tier progression and reliable backend enforcement of competition limits.

## What Changes

- **Free Tier Update**: Fixed at £0/month with a hard cap of 1 live competition (`maxActiveRaffles: 1`). Instant Wins remain disabled for Free tier hosts.
- **Premium Tier Update**: Standardized at £29/month with a limit of up to 3 live competitions (`maxActiveRaffles: 3`). Instant Wins remain enabled.
- **Pro Tier Update**: Standardized at £79/month with unlimited live competitions (`maxActiveRaffles: null`). Instant Wins and professional features remain enabled.
- **Backend Limit Enforcement**: Enforce each plan's live competition limit in `RafflesService.create()` and ensure users cannot create or publish more active/pending competitions than their active subscription plan allows.
- **Database Plan Synchronization**: Update `SubscriptionPlan` records and seed definitions (`prisma/seed.ts` and `seed-plans.ts`) with the new prices and limits.
- **Frontend Pricing UI Synchronization**: Update the pricing comparison matrix, plan cards, FAQ, billing dashboards, and competition creation wizard to reflect the new plan tiers and live limits.
- **Documentation Cleanup**: Update outdated documentation and testing guide references.

## Capabilities

### New Capabilities
- `subscription-and-pricing`: Specifications for host subscription tiers (Free, Premium, Pro), pricing rates (£0, £29, £79), live competition limits (1, 3, unlimited), feature gating (Instant Wins), and backend limit enforcement during competition creation and publishing.

### Modified Capabilities
<!-- None: No pre-existing capability specs in openspec/specs -->

## Impact

- **Database**: `subscription_plans` table updated with revised prices and `max_active_raffles` constraints.
- **Backend Services**: `RafflesService`, `SubscriptionsService`, `PaymentService` in NestJS backend.
- **Frontend Pages & Components**: `/pricing` page (`PricingHero`, `PricingPlanGrid`, `PricingComparisonSection`, `PricingFaqSection`), Host Billing (`CurrentPlanCard`), Host Competition Wizard (`CreateRaffleStep4`, `CreateRaffleWizard`), and documentation files.
- **APIs**: `/api/v1/subscriptions/plans`, `/api/v1/raffles` (limit enforcement).
