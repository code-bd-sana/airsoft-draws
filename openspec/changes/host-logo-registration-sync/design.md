# Design: Host Logo Registration & Profile Synchronization

## Architecture & Data Flow

```
+---------------------------------------------------------------------------------------+
|                               UNIFIED LOGO DATA ARCHITECTURE                          |
+---------------------------------------------------------------------------------------+

 1. REGISTRATION UPLOAD PATH
    [HostRegistrationForm (Step 4)] 
          │  (User selects logo file)
          ▼
    [Upload API: POST /api/v1/auth/upload-logo]
          │  (Stores file in `./uploads/avatars/<hash>.<ext>`)
          ▼
    [Returns { avatarUrl: "http://.../uploads/avatars/<hash>.<ext>" }]
          │
          ▼
    [Step 8 Registration Submit: POST /api/v1/auth/register]
          │  Payload includes { ..., avatarUrl: "..." }
          ▼
    [AuthService.register()]
          │  Inserts into Prisma User: { ..., avatarUrl }
          │  Generates HostProfile slug from businessName (e.g., "tactical-gear-uk")
          ▼
    [Database: User (avatarUrl) & HostProfile (slug, bio, businessName)]

 2. DASHBOARD UPDATE PATH
    [HostProfileForm (Dashboard)]
          │  (User clicks camera icon to change logo)
          ▼
    [Upload API: POST /api/v1/users/avatar]
          │  (Saves new file to `./uploads/avatars/`)
          ▼
    [UsersService.updateAvatar()]
          │  Updates Prisma User: { avatarUrl }
          ▼
    [Database: User (avatarUrl)]

 3. PUBLIC VIEWING PATH
    [/verified-hosts & /hosts/:slug]
          │  (Fetches GET /api/v1/hosts/verified or GET /api/v1/hosts/public/:slug)
          ▼
    [HostsService]
          │  Selects `host.user.avatarUrl` as `logo`
          ▼
    [Frontend Cards & Header]
          │  Renders `<img src={host.logo} />`
```

## Detailed Technical Changes

### 1. Backend Authentication (`backend/src/auth/`)
- **Upload Endpoint**: Add `POST /api/v1/auth/upload-logo` in `AuthController` with `FileInterceptor` targeting `./uploads/avatars`, matching the storage mechanism of `UsersController.uploadAvatar`.
- **Register DTO**: Add optional `avatarUrl?: string` field to `RegisterDto` with `@IsOptional() @IsString()`.
- **Slug Generation**: In `AuthService.register()`, when role is `HOST`, compute a URL-friendly slug from `businessName`:
  ```ts
  const baseSlug = registerDto.businessName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  // Deduplicate if slug already exists
  ```
- **User Creation**: Pass `avatarUrl: registerDto.avatarUrl` to `prisma.user.create()`.

### 2. Frontend Host Registration (`frontend/components/host-auth/HostRegistrationForm.tsx`)
- Keep the selected `File` object in state alongside the local preview DataURL.
- Either upload immediately upon selection on Step 4 or asynchronously upload during Step 8 submission before calling `registerMutation.mutateAsync`.
- Include `avatarUrl` in the `registerMutation` payload.

### 3. Public Host Profiles & Directory
- Verify that `frontend/app/verified-hosts/page.tsx` and `frontend/app/hosts/[slug]/page.tsx` seamlessly render the `host.logo` without distortion, supporting both relative `/uploads/...` paths and full URLs.
- Ensure fallback redirects are active for `/host` and `/hosts`.
