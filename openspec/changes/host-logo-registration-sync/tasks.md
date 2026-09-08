# Tasks: Host Logo Registration & Profile Synchronization

## 1. Backend API Updates
- [x] 1.1 Add `POST /api/v1/auth/upload-logo` in `backend/src/auth/auth.controller.ts` with `FileInterceptor` uploading to `./uploads/avatars`.
- [x] 1.2 Add `avatarUrl?: string` to `backend/src/auth/dto/register.dto.ts`.
- [x] 1.3 Update `AuthService.register()` in `backend/src/auth/auth.service.ts` to persist `avatarUrl` to `User` and generate unique `slug` for `HostProfile`.

## 2. Frontend Registration Flow
- [x] 2.1 Add `uploadLogo` method to `frontend/services/auth.service.ts` hitting `/api/v1/auth/upload-logo`.
- [x] 2.2 Update `HostRegistrationForm.tsx` to retain the selected image file and upload it during onboarding.
- [x] 2.3 Pass `avatarUrl` into `registerMutation.mutateAsync` when submitting on Step 8.

## 3. Public Pages & Routing Verification
- [x] 3.1 Verify `/verified-hosts` displays real dynamic host data and logos.
- [x] 3.2 Verify `/hosts/[slug]` and `/hosts/[id]` display complete dynamic data across header and tabs.
- [x] 3.3 Add route redirect from `/host` to `/host/register` and `/hosts` to `/verified-hosts`.

## 4. End-to-End Verification
- [x] 4.1 Test full host registration with a logo upload and verify database persistence.
- [x] 4.2 Verify the logo displays immediately on the Host Dashboard and Public Host Profile.
- [x] 4.3 Test changing the logo from the Host Dashboard Profile and verify it synchronizes across all public pages.
