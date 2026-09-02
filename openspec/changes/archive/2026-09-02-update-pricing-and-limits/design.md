## Context

The system has existing models and logic across frontend, backend, and PostgreSQL database for subscriptions and competitions. The current seeds and static data contain inconsistent prices (e.g. £29.99 vs £29, £79.99 vs £79) and differing limits (2 vs 5 vs unlimited). The goal is to standardize the tier structure across all layers without altering the visual theme or existing application architecture.

## Goals / Non-Goals

**Goals:**
- Unify subscription pricing: Free (£0), Premium (£29), Pro (£79).
- Unify live competition limits: Free (1), Premium (3), Pro (unlimited / `null`).
- Enforce backend validation on competition creation so hosts cannot exceed their active plan's live competition allowance.
- Keep Instant Wins restricted to Premium and Pro tiers.
- Synchronize database seed scripts and update active database records.
- Update frontend marketing pages, comparison tables, FAQs, and billing dashboards.

**Non-Goals:**
- Redesigning the pricing UI/UX layout or modifying styling themes.
- Changing payment gateway providers (Cashflows / Test simulation remains intact).
- Altering the core raffle draw or ticket purchase mechanics.

## Decisions

1. **Quota Calculation Scope in `RafflesService.create()`**:
   - *Decision*: Count competitions with status in `['ACTIVE', 'PENDING_APPROVAL', 'DRAFT']` against the host's quota when `maxActiveRaffles` is not `null`.
   - *Rationale*: Prevents hosts from creating or submitting unlimited pending/draft competitions to bypass active quotas. Once a competition reaches `ENDED` or `CANCELLED`, the slot opens back up.
   - *Alternative Considered*: Counting only `ACTIVE` status. Rejected because hosts could flood the review queue with pending competitions.

2. **Database Schema Preservation**:
   - *Decision*: Retain the existing `SubscriptionPlan` schema (`maxActiveRaffles` as nullable integer, `price` as decimal) and update seed files and data in-place.
   - *Rationale*: No destructive migrations needed; existing relations and foreign keys remain valid.

3. **Frontend Data as Single Source for Marketing/Pricing**:
   - *Decision*: Update `PRICING_PLANS`, `COMPARISON_ROWS`, and `PRICING_FAQ` in `frontend/data/pricing/` so that marketing cards and feature tables match the backend subscription plans.

## Risks / Trade-offs

- **[Risk] Existing Hosts on Legacy Limits in DB** → *Mitigation*: Run seed upsert script / database update script to synchronize existing rows in the `subscription_plans` table to match the new rates and limits.
- **[Risk] Free Tier Bypass Attempt** → *Mitigation*: The backend explicitly blocks raffle creation if no active subscription exists and blocks instant wins on the Free plan.

## Migration & Rollout Plan

1. Update `backend/prisma/seed.ts` and `backend/seed-plans.ts`.
2. Run Prisma seed/upsert script against PostgreSQL database.
3. Update `frontend/data/pricing/*` and host dashboard components.
4. Update documentation files (`README.md`, `QA_TESTING_GUIDE.md`).
