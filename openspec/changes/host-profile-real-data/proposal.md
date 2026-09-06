## Why

Currently, visiting a host's public profile page (such as `/hosts/airsoft-tactical-armory`) exhibits multiple severe data disconnects:
1. The backend public host API (`hosts.service.ts` -> `findOnePublic`) hardcodes `bio: null`, completely ignoring the host's real biography saved in the database.
2. The frontend profile page's "About" tab (`HostProfileTabs.tsx`) renders static fake copy (`About TacticalGear UK`, Manchester location, fake website) instead of dynamic host information.
3. The host avatar/logo is absent or falls back to generic initials because:
   - The database seed data for `Airsoft Tactical Armory` does not configure an `avatarUrl` on the user record.
   - The multi-step host registration wizard (`HostRegistrationForm.tsx`) collects a photo/logo on Step 4 but drops it during submission rather than persisting it.
4. Host slugs are not automatically generated from the business name upon registration, and navigating to `/host` or `/hosts` results in 404 errors.

To establish trust with ticket buyers and present a professional platform, the host profile and directory pages must faithfully render genuine host information—including business name, logo, biography, and verified location—consistent with the data collected during onboarding and editable in the host dashboard.

## What Changes

- **Backend API & Service (`backend/src/hosts/hosts.service.ts`)**:
  - Update `findOnePublic(slug)` to return real `bio` from `host.bio` instead of hardcoded `null`.
  - Return `location` from `host.user.location` and `address` from `host.address`.
  - Update `findAllVerifiedPublic()` to return `description: host.bio` instead of `description: null`.
- **Database Seed & Demo Data (`backend/prisma/seed.ts`, `backend/seed-demo.ts`)**:
  - Assign a valid avatar image to the demo host user (`Airsoft Tactical Armory`).
  - Populate full profile fields (`bio`, `location`, `phone`) so the seeded host demonstrates complete functionality out of the box.
- **Frontend Host Profile (`frontend/app/hosts/[slug]/page.tsx`, `HostProfileTabs.tsx`, `HostProfileHeader.tsx`)**:
  - Pass the complete host profile data (including `name`, `bio`, `logo`, `location`, `phone`) to `HostProfileTabs`.
  - In `HostProfileTabs.tsx`, replace the hardcoded "About TacticalGear UK" section with dynamic host content (`host.name`, `host.bio`, and `host.location`).
  - Ensure `HostProfileHeader.tsx` gracefully displays uploaded logos, local asset URLs, and remote URLs.
- **Host Registration Flow (`HostRegistrationForm.tsx`, `auth.service.ts`)**:
  - Include auto-generation of unique URL slugs (e.g. `airsoft-tactical-armory`) from `businessName` during host registration.
  - Connect avatar/logo persistence during or immediately following registration.
- **Route Navigation (`frontend/app/host`, `frontend/app/hosts`)**:
  - Add friendly redirects for `/host` and `/hosts` to point to `/verified-hosts` or `/host/register` rather than failing with 404.

## Capabilities

### New Capabilities
- None (builds on existing host profile domain).

### Modified Capabilities
- `host-profile-real-data`: Dynamic data binding for public host profiles, verified host directory listings, database seed completeness, and host onboarding persistence.

## Impact

- **Affected Files**:
  - `backend/src/hosts/hosts.service.ts`
  - `backend/src/auth/auth.service.ts`
  - `backend/prisma/seed.ts` & `backend/seed-demo.ts`
  - `frontend/app/hosts/[slug]/page.tsx`
  - `frontend/components/website/host-profile/HostProfileHeader.tsx`
  - `frontend/components/website/host-profile/HostProfileTabs.tsx`
  - `frontend/components/host-auth/HostRegistrationForm.tsx`
  - `frontend/app/verified-hosts/page.tsx` (verified host listings)
  - `frontend/app/hosts/page.tsx` & `frontend/app/host/page.tsx` (redirects)
- **Dependencies**: No external library additions needed.
- **External Behavior**: Real host biography and logo will be visible across the public website; fake placeholder "TacticalGear UK" content is eliminated.
