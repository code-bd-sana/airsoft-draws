## 1. Database & Seed Updates

- [x] 1.1 Update `backend/prisma/seed.ts` with Free (price 0, maxActiveRaffles: 1), Premium (price 29, maxActiveRaffles: 3), and Pro (price 79, maxActiveRaffles: null), and verify file contains the updated values.
- [x] 1.2 Update `backend/seed-plans.ts` with the identical prices and limits, and verify with seed file check.
- [x] 1.3 Execute plan seeding script or database upsert to sync existing `subscription_plans` records in PostgreSQL, and verify via database query or script execution.

## 2. Backend Validation & Limit Enforcement

- [x] 2.1 Verify and refine `backend/src/raffles/raffles.service.ts` limit check in `create()` to ensure active/pending/draft competitions are accurately capped at 1 for Free and 3 for Premium, and verify the error message is clear.
- [x] 2.2 Verify Instant Wins feature gate remains blocked for Free tier and allowed for Premium/Pro in `backend/src/raffles/raffles.service.ts`.
- [x] 2.3 Verify payment service and subscription service pricing logic properly handle £29.00 and £79.00 values.

## 3. Frontend Data & Pricing Page Synchronization

- [x] 3.1 Update `frontend/data/pricing/pricing-plans.data.ts` to reflect 1 live competition for Free, up to 3 live competitions for Premium (£29), and unlimited live competitions for Pro (£79), and verify TypeScript compilation.
- [x] 3.2 Update `frontend/data/pricing/pricing-comparison.data.ts` matrix rows for active/live competition counts (Free: 1, Premium: 3, Pro: Unlimited).
- [x] 3.3 Update `frontend/data/pricing/pricing-faq.data.ts` FAQ entries referencing old plan limits to state up to 3 live competitions for Premium.
- [x] 3.4 Verify `frontend/components/dashboard/host/billing/CurrentPlanCard.tsx` and host creation wizard correctly present the updated plan limits.

## 4. Documentation & Verification

- [x] 4.1 Update `README.md` and `QA_TESTING_GUIDE.md` to remove any outdated pricing test strings.
- [x] 4.2 Run end-to-end typecheck and build on frontend and backend to verify zero regressions.
