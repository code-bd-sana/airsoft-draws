# Airsoft Draws - AI Project Context

**Target Audience:** AI Agents & LLMs acting as coding assistants. 
**Purpose:** Read this file to instantly understand the project architecture, tech stack, folder structure, and how the frontend and backend communicate.

---

## 1. Project Overview
Airsoft Draws is a B2B2C platform for hosting and participating in airsoft gear raffles/competitions. 
It uses a decoupled architecture:
- **Backend:** NestJS (Node.js framework) + Prisma ORM + PostgreSQL.
- **Frontend:** Next.js 16 (React 19, App Router) + Tailwind CSS v4 + React Query + Axios.

---

## 2. Backend Architecture (NestJS)
**Location:** `/backend`

### Tech Stack
- **Framework:** NestJS
- **Database:** PostgreSQL
- **ORM:** Prisma (`backend/prisma/schema.prisma`)
- **Validation:** `class-validator` & `class-transformer`
- **Authentication:** JWT via HTTP-only Cookies

### Folder Structure (`/backend/src`)
- `common/`: Global interceptors (`transform.interceptor.ts`), exception filters (`all-exceptions.filter.ts`).
- `config/`: Environment configuration objects (`index.ts`).
- `prisma/`: `PrismaService` which extends `PrismaClient` and handles DB connections.
- Feature Modules (`auth`, `users`, `raffles`, `tickets`, `subscriptions`, `payment`, `hosts`, etc.): Follows the Controller -> Service pattern.

### API Response Format
The backend uses a `TransformInterceptor` that automatically wraps all successful responses. 
If a controller returns `{ id: 1, name: "Test" }`, the client receives:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Test"
  },
  "timestamp": "2026-07-11T..."
}
```

### Authentication Flow
1. User logs in via `/api/v1/auth/login`.
2. Backend generates a JWT and attaches it to an HTTP-only cookie named `accessToken`.
3. Subsequent requests automatically send this cookie.
4. Backend `AuthGuard` extracts the token from `req.cookies.accessToken` to verify identity.

---

## 3. Frontend Architecture (Next.js)
**Location:** `/frontend`

### Tech Stack
- **Framework:** Next.js 16 (App Router `app/`)
- **Styling:** Tailwind CSS v4
- **State/Fetching:** `@tanstack/react-query`
- **HTTP Client:** `axios`

### Folder Structure (`/frontend`)
- `app/`: Next.js routes (pages, layouts). Grouped logically by domain (e.g. `(website)`, `(admin)`, `(host)`).
- `components/`: UI components separated by domain (`website/`, `dashboard/`, `host-auth/`).
- `services/`: Axios configuration and API wrapper functions (e.g., `api.ts`, `auth.service.ts`).
- `hooks/`: Custom React hooks, often wrapping React Query mutations/queries.
- `config/`: Environment configurations (`env.config.ts`).

### API Integration (How they connect)
The frontend communicates with the NestJS backend via Axios (`frontend/services/api.ts`).

**Crucial detail for AI agents:**
The `api.ts` file has a **response interceptor**. It automatically detects the backend's `TransformInterceptor` wrapper (`{ success: true, data: ... }`) and **unwraps it**.
Therefore, in frontend components or services, when you await an Axios call, `response.data` is ALREADY the unwrapped payload. You do NOT need to do `response.data.data`.

### Example Integration Flow

**1. Backend Controller:**
```typescript
@Get('me')
async getMe() {
  return { id: 1, email: "test@test.com" }; 
  // Interceptor wraps this -> { success: true, data: { id: 1... } }
}
```

**2. Frontend Service (`services/user.service.ts`):**
```typescript
import { api } from './api';

export const getProfile = async () => {
  const response = await api.get('/auth/me');
  return response.data; // Thanks to Axios interceptor, this is { id: 1, email: "test@test.com" }
};
```

**3. Frontend Component (`components/Profile.tsx`):**
```typescript
import { useQuery } from '@tanstack/react-query';
import { getProfile } from '@/services/user.service';

const Profile = () => {
  const { data, isLoading } = useQuery({ queryKey: ['profile'], queryFn: getProfile });
  
  if (isLoading) return <p>Loading...</p>;
  return <div>{data?.email}</div>;
};
```

---

## 4. Cheat Sheet for AI Agents
When the user asks you to **"add a new feature"**, follow this pattern:
1. **Database:** Add the model in `backend/prisma/schema.prisma` and run `npm run prisma:migrate` (or ask user to do it).
2. **Backend Module:** Create or update the relevant Module, Controller, and Service.
3. **Backend Validation:** Create a DTO in `src/module-name/dto/` using `class-validator` for POST/PATCH bodies.
4. **Backend Routes:** Make sure the route uses the prefix `@Controller('api/v1/...')`.
5. **Frontend Service:** Add the corresponding Axios API call in `frontend/services/`.
6. **Frontend UI:** Use React Query (`useQuery` for GET, `useMutation` for POST/PUT/DELETE) in the Next.js component to interact with the service.
