/## Context

The Airsoft Draws platform provides dedicated public profiles for verified competition hosts (`/hosts/[slug]`). The platform allows hosts to register via an 8-step wizard (`/host/register`) and update profile fields within the host dashboard (`/dashboard/host/profile`).

However, inspecting `/hosts/airsoft-tactical-armory` revealed that the backend API returned `bio: null` (hardcoded in `hosts.service.ts`), the demo seed user lacked an avatar image, and the frontend "About" tab rendered static hardcoded placeholder text ("About TacticalGear UK", Manchester, etc.) instead of host properties.

## Goals / Non-Goals

**Goals:**
- Connect backend `findOnePublic` and `findAllVerifiedPublic` to return real `bio`, `logo` (`avatarUrl`), `location`, and `address`.
- Update demo seed data in `prisma/seed.ts` and `seed-demo.ts` with a realistic logo and full profile fields for `Airsoft Tactical Armory`.
- Refactor `frontend/app/hosts/[slug]/page.tsx` and `HostProfileTabs.tsx` to dynamically render the host's actual name, bio, and location in the "About" tab.
- Support slug auto-generation on host registration in `auth.service.ts`.
- Provide clean redirect routes for `/host` and `/hosts` to prevent 404 dead ends.

**Non-Goals:**
- Redesigning the entire host dashboard or live raffle purchase flow.
- Modifying underlying database table schemas (the current `User` and `HostProfile` schemas already possess all necessary columns: `avatarUrl`, `bio`, `location`, `slug`, `address`, `phone`).
- Building an external social media integration system.

## Decisions

### 1. Data Mapping in `HostsService.findOnePublic`
- **Decision**: In `backend/src/hosts/hosts.service.ts`, populate `bio` directly with `host.bio` and include `location: host.user.location || host.address`.
- **Rationale**: The database already stores the biography in `HostProfile.bio` and location in `User.location`. Releasing these fields resolves the primary root cause without schema migrations.

### 2. Rendering Dynamic Content in `HostProfileTabs`
- **Decision**: Pass the `host` object into `HostProfileTabs` as a prop alongside `raffles`. Replace the static JSX in the `about` tab with:
  ```tsx
  <h3 className="font-heading font-medium text-[18px] text-[#E8EDD4]">
    About {host.name}
  </h3>
  <p className="font-sans text-[14px] text-[#72943A] leading-relaxed">
    {host.bio || "This host has not yet provided a detailed biography."}
  </p>
  {host.location && (
    <div className="flex gap-4 mt-2">
      <span className="font-sans text-[13px] text-[#A0D056]">
        📍 {host.location}
      </span>
    </div>
  )}
  ```
- **Rationale**: Directly eliminates the hardcoded "About TacticalGear UK" text and ensures every host profile uniquely displays their own details.

### 3. Demo Host Seed Data Enhancement
- **Decision**: In `backend/prisma/seed.ts` and `backend/seed-demo.ts`, assign a high-quality tactical avatar/logo path (e.g. `/uploads/avatars/airsoft-tactical-armory.jpg` or existing public logo) to the demo host user, and ensure bio and location are populated.
- **Rationale**: Guarantees that local development, demo environments, and automated testing showcase a complete, visually appealing verified host profile.

### 4. Automatic Slug Generation on Host Registration
- **Decision**: In `auth.service.ts` during host registration, generate a parameterized URL slug from `registerDto.businessName` (e.g. `businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')`), appending random suffix if collision occurs.
- **Rationale**: Prevents new hosts from having null slugs or relying on raw UUIDs in URLs.

### 5. Redirect Handling for `/host` and `/hosts`
- **Decision**: Add `page.tsx` under `app/hosts/` and `app/host/` that use Next.js `redirect("/verified-hosts")`.
- **Rationale**: Users typing `/host` or `/hosts` into the address bar will reach the verified directory instead of experiencing a 404 page.

## Risks / Trade-offs

- **[Risk] Missing avatar images for hosts that haven't uploaded one**:
  - *Mitigation*: Maintain the fallback letter monogram (e.g., "AT" for Airsoft Tactical Armory) in `HostProfileHeader` when `logo` is null or invalid.
- **[Risk] Hosts without a bio**:
  - *Mitigation*: Provide sensible default copy ("Verified host on Airsoft Draws organizing audited competitions.") rather than empty blank containers.
