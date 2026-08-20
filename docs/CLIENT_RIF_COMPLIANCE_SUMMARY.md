# Executive Compliance Summary — UK RIF Regulations & Legal Defences

**Platform:** Airsoft Draws (UK Airsoft Prize Competition Platform)  
**Date:** August 20, 2026  
**Target Audience:** Client Management, Payment Service Providers, Merchant Acquirers, Compliance Auditors  

---

## 1. Overview & Statutory Background

Airsoft Draws operates a specialized UK prize-competition platform for airsoft equipment, accessories, and sports replicas. Under UK law, specifically the **Violent Crime Reduction Act 2006 (VCRA 2006)** and the **VCRA Regulations 2007 (SI 2007/2606)**, airsoft devices configured as realistic imitations are classified as **Realistic Imitation Firearms (RIFs)**.

To operate in full accordance with UK legislation, Advertising Standards Authority (ASA) CAP Codes, and Information Commissioner's Office (ICO) data protection principles, Airsoft Draws has deployed a multi-layered compliance framework across the platform.

---

## 2. Core Compliance Measures Implemented

### 2.1. Strict Age Verification (18+ Statutory Restriction)
- **Checkout Enforcement:** Every participant must provide their date of birth at checkout. The system dynamically calculates exact age, accounting for birthdays and leap years.
- **Under-18 Blocking:** Access to checkout is strictly blocked for anyone under 18 on both the web interface and API backend.
- **Post-Win ID Match:** Winners must submit a photo of government-issued ID (passport or driving licence) which is verified by compliance staff against the winner's name and date of birth prior to prize dispatch.

### 2.2. Prize Classification System
All competitions are explicitly categorized prior to publication:
1. **RIF (Realistic Imitation Firearm):** Physical airsoft replica guns requiring age 18+ and verified legal defence prior to dispatch.
2. **Two-Tone (IF):** Non-realistic devices painted in at least 51% bright unreal color (orange, red, blue, green, etc.).
3. **Accessory / Non-RIF:** Optics, tactical gear, clothing, merchandise, or vouchers.

### 2.3. Conditional UKARA & Statutory Legal Defence Collection
- **Mandatory for RIFs:** UKARA registration numbers (or alternative skirmisher defence evidence) are required at checkout **only** for RIF competitions.
- **Not Required for Accessories:** Participants purchasing tickets for optics, gear, or clothing are not burdened with unnecessary UKARA prompts.
- **Legal Terminology:** In strict compliance with Home Office guidelines, UKARA is explicitly documented as **evidence supporting a statutory legal defence under VCRA Section 37**, and is **never described as a "licence"**.

### 2.4. Identity Document Privacy & Security (UK GDPR)
- Government-issued ID documents are stored in a private directory inaccessible to public web traffic.
- Documents are viewed by authorized compliance personnel via role-gated, authenticated administrative tools.
- Personal data minimisation is enforced; full dates of birth and UKARA numbers are masked in standard API logs and analytics.

### 2.5. Lawful Alternative Prize & Transfer Process
- **Cash Alternatives:** If a winner cannot provide evidence of a valid legal defence, the RIF prize is blocked from release and an advertised cash alternative (e.g. 80% valuation) is offered.
- **Two-Tone Substitution:** Where approved, a two-tone device may be substituted.
- **Controlled Transfers:** Prizes may only be transferred to a secondary recipient if the new recipient completes the full 18+ age verification, photo ID check, and UKARA defence verification.

### 2.6. Discreet Packaging & Controlled Fulfillment
- **Discreet Packaging Mandatory:** All shipped RIF items must be packed in solid cardboard boxes, opaque parcel bags, sealed black padded envelopes, or solid black shrink wrap. No external logos, weapon branding, or product descriptions appear on the outside of packages.
- **Tracked Logistics:** Delivery is executed via tracked services (e.g. Parcelforce Worldwide) requiring signature upon delivery.
- **Office Collection:** Registered office collections require physical identity re-verification by staff.

### 2.7. Responsible Marketing Safeguards & Reporting
- All promotional materials adhere to ASA/CAP rules: no weapon glamourisation, no encouragement of violence, and no content appealing to minors.
- A public **Marketing Concern Reporting System** is available for visitors to submit policy feedback directly to compliance officers.

---

## 3. Summary of System Audit & Status

| Requirement Area | Legal & Regulatory Standard | Technical Status |
|---|---|---|
| **Age Limit** | VCRA 2006 Section 40 (18+) | **Fully Enforced (Frontend & Backend)** |
| **RIF Defence Verification** | VCRA 2006 Section 37 / UKARA | **Fully Enforced (Conditional RIF Rules)** |
| **ID Storage Security** | ICO UK GDPR Data Security | **Fully Enforced (Private Secure Storage)** |
| **Discreet Logistics** | Public Safety & Carrier Terms | **Fully Enforced (Packaging Checklist)** |
| **Marketing Safeguards** | ASA CAP Code Section 3 & 15 | **Fully Enforced (Reporting System Live)** |
| **Compliance Audit Trail** | Merchant Acquirer Standards | **Fully Enforced (AuditLog Table Active)** |
