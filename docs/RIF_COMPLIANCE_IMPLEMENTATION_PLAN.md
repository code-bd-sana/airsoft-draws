# Comprehensive UK RIF Compliance & Verification System — Implementation Plan

**Project:** Airsoft Draws — UK Airsoft Prize Competition Platform  
**Document Version:** 1.0.0  
**Date:** August 20, 2026  
**Status:** Approved Technical Plan & Implementation Blueprint  

---

## 1. Executive Summary

This document establishes the end-to-end technical implementation plan for full compliance with UK law governing Realistic Imitation Firearms (RIFs), age restrictions (18+), UKARA legal defence verification, controlled fulfillment, identity document security, cash/two-tone alternative workflows, prize transfers, marketing safeguards, and audit logging for the **Airsoft Draws** platform.

The system will enforce legal compliance at every layer: database schema, backend NestJS API validation, frontend Next.js checkout and wizard forms, admin verification dashboards, discreet fulfillment procedures, and user-facing terms & policies.

---

## 2. Complete Codebase Audit

Every core requirement was audited across the frontend, backend, database schema, and admin workflows:

| Audit Item | Status | Detailed Finding & Impact |
|---|---|---|
| **Frontend Framework & Structure** | Already Implemented & Working | Next.js 16 (App Router), React 19, Tailwind CSS. Clean component structure in `frontend/components/` and `frontend/app/`. |
| **Backend Framework & APIs** | Already Implemented & Working | NestJS with TypeScript REST APIs (`backend/src/`). |
| **Database & Schema** | Partially Implemented | PostgreSQL via Prisma (`backend/prisma/schema.prisma`). Lacks explicit prize classification enums, user DOB, UKARA fields, ID document uploads, alternatives tracking, transfers, audit logs, and marketing report models. |
| **Authentication & User Roles** | Already Implemented & Working | JWT-based auth with `CLIENT`, `HOST`, `ADMIN` roles. |
| **Competition Creation** | Partially Implemented | Host wizard step 1 allows basic title/category/description and frontend RIF checkbox, but backend schema lacks mandatory `prizeClassification` field (`RIF`, `TWO_TONE_IF`, `ACCESSORY`). |
| **Competition Approval** | Partially Implemented | Admin can approve raffles (`PENDING_APPROVAL` -> `ACTIVE`), but approval does not enforce prize classification. |
| **Prize Classification** | Partially Implemented | Only free-text category exists. Needs explicit enum `prizeClassification` on `Raffle` (`RIF`, `TWO_TONE_IF`, `ACCESSORY`) with backend validation blocking publication without classification. |
| **Competition Details** | Already Implemented & Working | `RaffleEntryCard.tsx` and details page render competition specs. Needs classification badge. |
| **Cart & Checkout** | Missing Backend Enforcement | Ticket purchase (`/tickets/purchase/:raffleId`) does not enforce 18+ age validation or conditional UKARA collection on backend! |
| **Date-of-Birth Collection** | Missing | `User` schema lacks `dateOfBirth` / `dob`. Checkout lacks DOB input. |
| **Age Validation** | Missing | No frontend/backend check ensuring user is 18+ at checkout or handling birthdays/leap years. |
| **Terms Acceptance** | Missing Tracking | Terms exist on site, but checkout does not record accepted terms version (e.g. `v1.0`) and timestamp in DB. |
| **UKARA Collection** | Missing Conditional Logic | Checkout does not conditionally require UKARA for RIF raffles, nor bypass it for optics/accessories. |
| **UKARA Verification** | Partially Implemented | Lacks formal status state machine (`NOT_REQUIRED`, `PENDING_VERIFICATION`, `VALID`, `INVALID`, `EXPIRED`, `DETAILS_MISMATCH`, `ALT_DEFENCE_REVIEW`). |
| **Winner Selection** | Already Implemented & Working | Auto and manual draw winner selection working in `raffles.service.ts`. |
| **Winner Verification** | Partially Implemented | `Winner` model has basic `verificationStatus`, but lacks ID document fields, identity matching, DOB matching, and verification workflow steps. |
| **ID-Document Upload** | Missing | No private upload endpoint or encrypted storage for identity documents (passports, driving licences). |
| **Cash Alternatives** | Missing | No schema or workflow for cash alternative processing when legal defence fails. |
| **Two-Tone Substitutions** | Missing | No workflow or status for offering a two-tone substitution when UKARA is missing. |
| **Prize Transfers** | Missing | No recipient verification or transfer approval workflow. |
| **Shipping & Tracking** | Partially Implemented | `Winner` has basic `trackingNumber` and `deliveryStatus`, but lacks discreet packaging confirmation, courier selection, or fulfillment verification. |
| **Office Collection** | Missing | No office collection option or in-person identity verification logging. |
| **Marketing Approval** | Documentation Only | Marketing claims managed by business staff. Needs technical reporting system. |
| **Marketing Reporting** | Missing | No database model or API/UI for reporting marketing concerns. |
| **Admin Dashboard** | Partially Implemented | Basic winners table exists, but lacks dedicated compliance verification panel. |
| **Notifications** | Partially Implemented | Sonner toasts exist; email/dashboard notifications need compliance updates. |
| **Audit Logs** | Missing | No dedicated `AuditLog` table for tracking staff compliance actions. |
| **Privacy Policy & Terms** | Partially Implemented | `TermsContent.tsx` exists, needs complete updates for data protection, legal defence, transfers, and packaging. |

---

## 3. Relevant Files & Modules

### Backend Modules to Update/Create:
- [schema.prisma](file:///Users/syedrakibhasan/projects/airsoft-draws/backend/prisma/schema.prisma) — Add models & fields for `prizeClassification`, `dateOfBirth`, `ukaraNumber`, `acceptedTermsVersion`, `Winner` compliance fields, `WinnerIdDocument`, `WinnerAlternative`, `WinnerTransfer`, `MarketingReport`, `AuditLog`.
- `backend/src/tickets/tickets.service.ts` & `tickets.controller.ts` — Enforce 18+ DOB, conditional UKARA, terms acceptance during ticket purchase.
- `backend/src/raffles/raffles.service.ts` & `raffles.controller.ts` — Enforce mandatory `prizeClassification` during raffle creation/approval.
- `backend/src/winners/` — New module for winner verification, private ID uploads, cash alternative selection, prize transfer requests, fulfillment approval.
- `backend/src/marketing/` — New module for marketing concern reporting (`POST /api/v1/marketing-reports`, admin management).
- `backend/src/admin/` — Extend admin endpoints for winner compliance management, audit logs, and marketing report reviews.

### Frontend Components to Update/Create:
- `frontend/components/website/raffle-details/RaffleEntryCard.tsx` — Add checkout age modal / inputs (DOB, 18+ check, conditional UKARA for RIFs, T&C acceptance).
- `frontend/components/dashboard/host/create/CreateRaffleStep1.tsx` — Add explicit `prizeClassification` selector (`RIF`, `TWO_TONE_IF`, `ACCESSORY`).
- `frontend/components/dashboard/admin/WinnersTrackingTable.tsx` & `AdminWinnerComplianceModal.tsx` — Full compliance review, ID verification, UKARA check, alternative selection, transfer approval, packaging confirmation.
- `frontend/components/website/legal/TermsContent.tsx` — Update legal terms & conditions.
- `frontend/components/website/marketing/MarketingReportModal.tsx` — Add marketing concern reporting modal on competition pages and footer.

---

## 4. Authoritative Research & Legal Framework Summary

1. **VCRA 2006 (Sections 36–40)**: RIF supply prohibited without legal defence. Age 18+ statutory restriction.
2. **SI 2007/2606**: Skirmishing defence criteria (insured site attendance). Two-tone 51% color rules for IFs.
3. **UKARA**: **NOT A LICENCE**. Database of verified skirmishers. Must not be described as a licence.
4. **ICO / UK GDPR**: Data minimisation, masked DOB/UKARA in logs/APIs, private encrypted storage for ID documents, short-lived signed URLs, defined retention schedules.
5. **Parcelforce / Shipping**: Tracked delivery, discreet packaging (solid cardboard box, parcel bag, sealed black envelope, solid black shrink wrap), no external weapon markings.

---

## 5. Requirement-by-Requirement Implementation Plan

### A. Prize Classification
- Add `prizeClassification` enum on `Raffle` table (`RIF`, `TWO_TONE_IF`, `ACCESSORY`).
- Require classification on creation & admin approval.
- Backfill existing raffles: Airsoft guns -> `RIF`, Optics/Gear -> `ACCESSORY`.

### B. Checkout Age Verification & T&Cs
- Collect user DOB at checkout (or profile if missing).
- Calculate exact age handling leap years and birthdays (`age < 18` blocked on frontend AND backend `/tickets/purchase`).
- Record `acceptedTermsVersion` (`v1.0`) and `acceptedTermsAt`.
- Mask sensitive DOB in public API responses.

### C. Conditional UKARA Collection
- Check if raffle has `prizeClassification === 'RIF'`.
- If `RIF`, require UKARA number (or legal defence declaration) at checkout.
- If `ACCESSORY` or `TWO_TONE_IF`, do NOT require UKARA.
- Statuses: `NOT_REQUIRED`, `PENDING_VERIFICATION`, `VALID`, `INVALID`, `EXPIRED`, `DETAILS_MISMATCH`, `ALT_DEFENCE_REVIEW`.

### D. Winner Verification Workflow
- Winner state machine: `WINNER_SELECTED` -> `VERIFICATION_REQUIRED` -> `ID_SUBMITTED` -> `AGE_VERIFIED` -> `IDENTITY_MATCH_CONFIRMED` -> `UKARA_VERIFIED` -> `APPROVED_FOR_FULFILMENT` -> `SHIPPED` / `COLLECTED` -> `COMPLETED`.
- Admin performs check of ID, DOB match, name match, UKARA match, and approves release.

### E. Private Identity Document Security
- Private file upload directory `uploads/private_documents/` (not accessible via public HTTP static route).
- Controller endpoint `/api/v1/winners/id-document/:winnerId` protected with `@UseGuards(JwtAuthGuard, RolesGuard)` requiring `ADMIN` role.
- Masked URLs and sensitive data in API responses.

### F. Cash Alternative, Two-Tone & Forfeiture
- If verification fails or winner lacks UKARA, Admin can offer Cash Alternative (e.g. 80% value) or Two-Tone substitution.
- Complete record of offer, winner response, admin decision, and timestamps.

### G. Prize Transfers
- Winner requests transfer -> Admin verifies recipient (Name, DOB 18+, ID, UKARA for RIF, address) -> Transfer approved -> Prize shipped to recipient address.

### H. Discreet Packaging & Controlled Fulfillment
- Fulfillment form requires checking: `Discreet Packaging` (Box, Bag, Sealed Black Envelope, Black Shrink Wrap), `Courier` (Parcelforce, Royal Mail) or `Office Collection` (In-person ID check).
- Block dispatch until packaging & verification are confirmed.

### I. Marketing Safeguards & Reporting
- Add `MarketingReport` table & `POST /api/v1/marketing-reports` API.
- Add "Report Marketing Concern" button on competition pages.
- Admin review dashboard for marketing reports.

### J. Admin Compliance Evidence & Audit Logs
- Create `AuditLog` table (`userId`, `action`, `entityType`, `entityId`, `details`, `ipAddress`, `createdAt`).
- Record audit logs for all verification decisions, status changes, transfers, and alternative approvals.

### K. Terms & Content Updates
- Update `TermsContent.tsx` with all legal classifications, age checks, UKARA explanations, discreet packaging, cash alternatives, transfers, and privacy retention rules.

---

## 6. Traceability Matrix

| Requirement | Audit Finding | Implementation Location | Verification Method | Status |
|---|---|---|---|---|
| **A. Prize Classification** | Missing schema enum | `schema.prisma`, `CreateRaffleStep1.tsx`, `raffles.service.ts` | Unit & E2E Test | Planned |
| **B. Checkout Age Verification** | Missing backend check | `tickets.service.ts`, `RaffleEntryCard.tsx` | Unit & Integration Test | Planned |
| **C. Conditional UKARA** | Missing conditional logic | `tickets.service.ts`, `RaffleEntryCard.tsx` | Unit & Integration Test | Planned |
| **D. Winner Verification** | Partial statuses | `schema.prisma`, `winners.service.ts`, `WinnersTrackingTable.tsx` | Integration & E2E Test | Planned |
| **E. ID Document Security** | Missing private endpoint | `winners.controller.ts` (Private route) | Security Test | Planned |
| **F. Cash & Two-Tone Alt** | Missing workflow | `schema.prisma`, `winners.service.ts` | Integration Test | Planned |
| **G. Prize Transfers** | Missing workflow | `schema.prisma`, `winners.service.ts` | Integration Test | Planned |
| **H. Discreet Packaging** | Missing confirmation | `schema.prisma`, `WinnersTrackingTable.tsx` | Manual & Unit Test | Planned |
| **I. Marketing Reporting** | Missing model & API | `schema.prisma`, `marketing.service.ts` | E2E Test | Planned |
| **J. Admin Audit Logs** | Missing model | `schema.prisma`, `audit.service.ts` | Unit Test | Planned |
| **K. Terms & Policies** | Partial coverage | `TermsContent.tsx` | Content Review | Planned |
