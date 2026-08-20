# Airsoft Draws — Complete UK RIF Compliance Master Document

**Platform:** Airsoft Draws (UK Airsoft Prize Competition Platform)  
**Date:** August 20, 2026  
**Document Version:** 1.0.0 (Master Compliance Edition)  

---

# Table of Contents
1. Executive Client Compliance Summary
2. Statutory Research & Source Register
3. Client Decisions & Legal Review Register
4. Technical Implementation Report
5. Step-by-Step Testing & Verification Guide

---

# Section 1 — Executive Client Compliance Summary

## 1.1. Overview & Statutory Background
Airsoft Draws operates a specialized UK prize-competition platform for airsoft equipment, accessories, and sports replicas. Under UK law, specifically the **Violent Crime Reduction Act 2006 (VCRA 2006)** and the **VCRA Regulations 2007 (SI 2007/2606)**, airsoft devices configured as realistic imitations are classified as **Realistic Imitation Firearms (RIFs)**.

To operate in full accordance with UK legislation, Advertising Standards Authority (ASA) CAP Codes, and Information Commissioner's Office (ICO) data protection principles, Airsoft Draws has deployed a multi-layered compliance framework across the platform.

## 1.2. Core Compliance Measures Implemented

### Age Verification (18+ Statutory Restriction)
- **Checkout Enforcement:** Every participant must provide their date of birth at checkout. The system dynamically calculates exact age, accounting for birthdays and leap years.
- **Under-18 Blocking:** Access to checkout is strictly blocked for anyone under 18 on both the web interface and API backend.
- **Post-Win ID Match:** Winners must submit a photo of government-issued ID (passport or driving licence) which is verified by compliance staff against the winner's name and date of birth prior to prize dispatch.

### Prize Classification System
All competitions are explicitly categorized prior to publication:
1. **RIF (Realistic Imitation Firearm):** Physical airsoft replica guns requiring age 18+ and verified legal defence prior to dispatch.
2. **Two-Tone (IF):** Non-realistic devices painted in at least 51% bright unreal color (orange, red, blue, green, etc.).
3. **Accessory / Non-RIF:** Optics, tactical gear, clothing, merchandise, or vouchers.

### Conditional UKARA & Statutory Legal Defence Collection
- **Mandatory for RIFs:** UKARA registration numbers (or alternative skirmisher defence evidence) are required at checkout **only** for RIF competitions.
- **Not Required for Accessories:** Participants purchasing tickets for optics, gear, or clothing are not burdened with unnecessary UKARA prompts.
- **Legal Terminology:** In strict compliance with Home Office guidelines, UKARA is explicitly documented as **evidence supporting a statutory legal defence under VCRA Section 37**, and is **never described as a "licence"**.

### Identity Document Privacy & Security (UK GDPR)
- Government-issued ID documents are stored in a private directory inaccessible to public web traffic.
- Documents are viewed by authorized compliance personnel via role-gated, authenticated administrative tools.
- Personal data minimisation is enforced; full dates of birth and UKARA numbers are masked in standard API logs and analytics.

### Lawful Alternative Prize & Transfer Process
- **Cash Alternatives:** If a winner cannot provide evidence of a valid legal defence, the RIF prize is blocked from release and an advertised cash alternative (e.g. 80% valuation) is offered.
- **Two-Tone Substitution:** Where approved, a two-tone device may be substituted.
- **Controlled Transfers:** Prizes may only be transferred to a secondary recipient if the new recipient completes the full 18+ age verification, photo ID check, and UKARA defence verification.

### Discreet Packaging & Controlled Fulfillment
- **Discreet Packaging Mandatory:** All shipped RIF items must be packed in solid cardboard boxes, opaque parcel bags, sealed black padded envelopes, or solid black shrink wrap. No external logos, weapon branding, or product descriptions appear on the outside of packages.
- **Tracked Logistics:** Delivery is executed via tracked services (e.g. Parcelforce Worldwide) requiring signature upon delivery.
- **Office Collection:** Registered office collections require physical identity re-verification by staff.

### Responsible Marketing Safeguards & Reporting
- All promotional materials adhere to ASA/CAP rules: no weapon glamourisation, no encouragement of violence, and no content appealing to minors.
- A public **Marketing Concern Reporting System** is available for visitors to submit policy feedback directly to compliance officers.

---

# Section 2 — Statutory Research & Source Register

## 2.1. Statutory Legislation
* **Violent Crime Reduction Act 2006 (Part 2, Sections 36–40)**  
  *URL:* [https://www.legislation.gov.uk/ukpga/2006/38/part/2/crossheading/imitation-firearms](https://www.legislation.gov.uk/ukpga/2006/38/part/2/crossheading/imitation-firearms)  
  *Requirements:* Prohibits manufacture, import, sale, and supply of RIFs without legal defence (Sec 36). Establishes skirmishing defence (Sec 37). Prohibits supply to under 18s (Sec 40).

* **VCRA 2006 (Realistic Imitation Firearms) Regulations 2007 (SI 2007/2606)**  
  *URL:* [https://www.legislation.gov.uk/uksi/2007/2606](https://www.legislation.gov.uk/uksi/2007/2606)  
  *Requirements:* Defines airsoft skirmishing defence criteria (public liability insurance, site attendance). Sets 51% color rules for two-tone IFs.

* **Home Office Guide on Firearms Licensing Law**  
  *URL:* [https://www.gov.uk/government/publications/firearms-law-guidance-to-the-police-2012/guide-on-firearms-licensing-law-accessible-version](https://www.gov.uk/government/publications/firearms-law-guidance-to-the-police-2012/guide-on-firearms-licensing-law-accessible-version)  
  *Requirements:* Defines kinetic energy limits (<1.3J automatic, <2.5J single-shot). Clarifies age 18+ supply restrictions.

## 2.2. Industry Guidance
* **UKARA Official Guidelines**  
  *URL:* [https://www.ukara.org.uk/](https://www.ukara.org.uk/)  
  *Requirements:* Explicitly clarifies that UKARA IS NOT A LICENCE. It is a central database of verified skirmishers used as evidence of a legal defence.

## 2.3. Advertising & Data Protection
* **ASA CAP Code Guidance on Weapons**  
  *URL:* [https://www.asa.org.uk/advice-online/weapons-general.html](https://www.asa.org.uk/advice-online/weapons-general.html)  
  *Requirements:* CAP Code Sec 3 & 15: No weapon glamourisation, violence, or minor appeal. UKARA must not be called a licence.

* **ICO UK GDPR Principles & Security**  
  *URL:* [https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/data-protection-principles/a-guide-to-the-data-protection-principles/](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/data-protection-principles/a-guide-to-the-data-protection-principles/)  
  *Requirements:* Private, encrypted storage for identity documents, role-based access, masked sensitive attributes, retention rules.

---

# Section 3 — Client Decisions & Legal Review Register

| Ref | Item | Context & Recommendation | Status |
|---|---|---|---|
| **DEC-01** | **Cash Alt vs Two-Tone Order** | Default implementation offers 80% Cash Alternative or Two-Tone substitution if UKARA defence fails. | Configured / Pending Client Confirmation |
| **DEC-02** | **Cash Alt Percentage** | Default: 80% of main prize cash valuation. | Configured / Configurable in Admin |
| **DEC-03** | **Forfeiture Window** | Default: 28 days post-winner notification. | Configured |
| **DEC-04** | **ID Retention Schedule** | Default: 90 days retention after winner verification. | Configured |

---

# Section 4 — Technical Implementation Report

## Summary of Codebase Changes
1. **Prisma Schema (`schema.prisma`):** Added `dateOfBirth`, `ukaraNumber` to `User`; `prizeClassification` to `Raffle`; `acceptedTermsVersion` to `Ticket`; full compliance status tracking, ID document fields, alternative prize fields, transfer details, and packaging options to `Winner`. Created `MarketingReport` and `AuditLog` tables.
2. **NestJS Backend (`backend/src/`):** Enforced 18+ age calculation in `tickets.service.ts`, conditional UKARA enforcement for RIFs, terms acceptance (`v1.0`), private ID document uploads (`uploads/private_documents`), admin verification endpoints, and `MarketingModule`.
3. **Next.js Frontend (`frontend/components/`):** Added Prize Classification selector in host wizard (`CreateRaffleStep1.tsx`), 18+ and conditional UKARA modal (`CheckoutComplianceModal.tsx`) in `RaffleEntryCard.tsx`, multi-tab admin audit manager (`AdminWinnerComplianceModal.tsx`), and marketing concern reporting modal (`MarketingReportModal.tsx`).

---

# Section 5 — Step-by-Step Testing & Verification Guide

Follow this guide to test all newly implemented features:

### 1. Test Competition Creation with Prize Classification
- **Url:** `/dashboard/host/create`
- **Steps:**
  1. Fill in Title and Category.
  2. Notice the new **Prize Classification** selector (`RIF`, `Two-Tone (IF)`, `Accessory / Non-RIF`).
  3. Select `RIF (Realistic Firearm)`.
  4. Check the mandatory RIF checkbox: *"This competition prize is a RIF..."*.
  5. Click **Next Step** and complete the wizard.
  6. **Expected Result:** Competition is created with `prizeClassification: "RIF"`.

### 2. Test 18+ Age & Conditional UKARA Checkout
- **Url:** Go to any active competition detail page (e.g. `/live-raffles/...`).
- **Steps:**
  1. Select ticket quantity and click **Enter Draw**.
  2. The **Checkout Eligibility Check** modal pops up.
  3. **Under-18 Test:** Enter a DOB under 18 (e.g., 2012-01-01). Notice the red warning message appears and the Confirm button is disabled.
  4. **18+ Valid DOB Test:** Change DOB to an 18+ date (e.g., 1998-05-15). Notice age displays `Age: 28 (Verified 18+)`.
  5. **UKARA Conditional Test:** For a RIF competition, UKARA is required. Enter `UKARA123456`. (If testing an accessory item, notice UKARA is automatically marked "Not Required").
  6. Check the Terms & Conditions acceptance box.
  7. Click **Confirm & Pay**.
  8. **Expected Result:** Ticket purchase succeeds, saving DOB, UKARA, and terms version (`v1.0`).

### 3. Test Admin Winner Compliance & Verification Manager
- **Url:** `/dashboard/admin/winners`
- **Steps:**
  1. Find a winner row in the table. Notice the badges: Prize Classification (`RIF`), UKARA status (`PENDING_VERIFICATION`), and Compliance Status.
  2. Click **Audit Compliance**.
  3. **Tab 1 (ID & UKARA Check):** Upload a government ID image/PDF. Click **View Private ID Securely** to test private file streaming. Check DOB Match & Name Match. Update UKARA status to `VALID`. Click **Save Verification Decision**.
  4. **Tab 2 (Cash / Two-Tone Alt):** Select `CASH` alternative and enter amount `350.00`. Click **Save Alternative Offer**.
  5. **Tab 3 (Prize Transfer):** Enter recipient name, DOB, UKARA, and set status to `VERIFIED`. Click **Save Transfer Record**.
  6. **Tab 4 (Packaging & Dispatch):** Select packaging type (e.g. `Solid Cardboard Box`), check `Discreet Packaging Confirmed`, select courier `Parcelforce`, enter tracking number `PB123456789GB`. Click **Save Dispatch & Fulfillment Record**.
  7. **Expected Result:** All compliance actions update in real-time, audit logs are generated, and dispatch is saved.

### 4. Test Marketing Concern Reporting
- **Steps:**
  1. Open the **Report Marketing Concern** modal (or endpoint `POST /api/v1/marketing-reports`).
  2. Select reason `"Weapons Presentation / Glamourisation"`, fill description, and submit.
  3. Check `/dashboard/admin/reports` (or endpoint `GET /api/v1/admin/marketing-reports`).
  4. **Expected Result:** Report appears in the admin review queue.
