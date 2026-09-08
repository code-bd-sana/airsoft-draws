# Proposal: Unify Host Registration & Profile Logo Synchronization

## Why

During host registration (`/host/register`), hosts upload a logo or profile photo in Step 4 ("Logo & Branding" / "Photo & Bio"). However, the registration submission drops the uploaded image data, and the backend registration API (`/api/v1/auth/register`) lacks avatar/logo persistence. 

Consequently:
1. Newly registered hosts have no avatar (`user.avatarUrl` is `null`), causing public pages (`/verified-hosts` and `/hosts/[slug]`) and the host dashboard profile to display fallback initials instead of their uploaded logo.
2. In contrast, uploading a logo from the Host Dashboard Profile (`HostProfileForm`) uploads the file to `/uploads/avatars/` and updates `user.avatarUrl`, immediately rendering properly across all public pages.
3. This creates a severe inconsistency where logos uploaded during onboarding vanish, requiring the host to re-upload them later from their dashboard.
4. Additionally, host profiles created during registration are missing auto-generated URL slugs, forcing profile routing to rely solely on UUIDs.

To establish platform consistency and seamless onboarding, the registration workflow must upload and store the host logo in the exact same location and schema (`user.avatarUrl` in `./uploads/avatars/`) as the dashboard profile update, ensuring immediate visibility across the host dashboard, verified hosts directory, and public host profile pages.

## What Changes

- **Backend Authentication & Registration (`backend/src/auth/`)**:
  - Add a public image upload endpoint `POST /api/v1/auth/upload-logo` (or `/api/v1/auth/upload-avatar`) storing to `./uploads/avatars/` returning the public avatar URL, OR support `avatarUrl` in `RegisterDto`.
  - In `AuthService.register()`, persist `avatarUrl` to the newly created `User` record.
  - Generate a clean, URL-friendly unique `slug` for the `HostProfile` based on `businessName` during registration.
- **Frontend Host Registration Wizard (`frontend/components/host-auth/HostRegistrationForm.tsx`)**:
  - Connect Step 4 photo/logo selection with immediate or pre-submit upload to the backend avatar storage.
  - Include the resulting `avatarUrl` in the `registerMutation` payload on Step 8.
- **Frontend & Backend Public Profile Consistency**:
  - Ensure all fields across `/verified-hosts` and `/hosts/[slug]` (or `/hosts/[id]`) dynamically read from the database record (`host.businessName`, `host.user.avatarUrl`, `host.bio`, `host.user.location`, `host.isVerified`, active/past competitions count).
- **Host Route Redirects**:
  - Redirect root `/hosts` to `/verified-hosts` and `/host` to `/host/register`.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `host-logo-sync`: Seamless logo persistence during host onboarding, unified avatar storage with the dashboard profile, and slug generation for public host profiles.

## Impact

- **Affected Files**:
  - `backend/src/auth/auth.controller.ts`
  - `backend/src/auth/auth.service.ts`
  - `backend/src/auth/dto/register.dto.ts`
  - `frontend/components/host-auth/HostRegistrationForm.tsx`
  - `frontend/services/auth.service.ts`
  - `frontend/app/verified-hosts/page.tsx`
  - `frontend/app/hosts/[slug]/page.tsx`
- **Dependencies**: No new npm dependencies.
- **External Behavior**: Host logos uploaded during registration are immediately stored in the user profile and visible on the Host Dashboard and Public Profile pages without needing manual re-upload.
