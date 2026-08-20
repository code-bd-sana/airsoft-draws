# Platform Legal Compliance & System Upgrade Report
## UK RIF Regulations (VCRA 2006) & Operational Verification Suite

**Client Platform:** Airsoft Draws (UK Airsoft Prize Competition Platform)  
**Date:** August 20, 2026  
**Document Reference:** AD-COMPLIANCE-2026-V1  
**Status:** Implementation Complete & Production Verified  

---

## Executive Summary

We are pleased to confirm that the **Airsoft Draws** platform has undergone a comprehensive compliance audit, system upgrade, and legal alignment update. The platform is now fully equipped to meet all statutory requirements under the **UK Violent Crime Reduction Act 2006 (VCRA 2006)**, the **VCRA (Realistic Imitation Firearms) Regulations 2007 (SI 2007/2606)**, the **Advertising Standards Authority (ASA) CAP Codes**, and the **Information Commissioner’s Office (ICO) UK GDPR** data protection principles.

Every update requested has been technically enforced across the database, backend API, user checkout flow, host competition creation wizard, and administrative compliance suite.

---

## 1. Summary of Completed System Upgrades

### 1.1. Statutory Age Verification (18+ Mandatory Restriction)
* **Checkout Enforcement:** Every participant is required to provide a Date of Birth (DOB) at checkout. The platform dynamically calculates exact age, accounting for birthdays and leap years.
* **Under-18 Blocking:** Participants under 18 years of age are automatically blocked from completing ticket purchases on both the website interface and API servers.
* **Post-Win ID Verification:** Prior to prize release, winners must provide government-issued photo ID (passport or driving licence) which is verified by compliance officers against the winner’s registered name and DOB.

### 1.2. Prize Classification System
All competitions are now explicitly classified prior to publication:
1. **RIF (Realistic Imitation Firearm):** Physical airsoft replica guns requiring age 18+ and verified legal defence prior to dispatch.
2. **Two-Tone (IF):** Non-realistic devices painted in at least 51% bright unreal color (orange, red, blue, green, etc.).
3. **Accessory / Non-RIF:** Optics, tactical gear, clothing, merchandise, or vouchers.

### 1.3. Conditional UKARA & Legal Defence Collection
* **Targeted UKARA Prompt:** UKARA registration numbers (or alternative skirmisher defence evidence) are collected at checkout **only** when purchasing tickets for RIF competitions.
* **Streamlined Accessory Checkout:** Participants purchasing tickets for optics, gear, or clothing are not prompted for UKARA numbers.
* **Correct Terminology:** In strict compliance with UK Home Office guidance, UKARA is explicitly documented as **evidence supporting a statutory legal defence under VCRA Section 37**, and is **never described as a "licence"**.

### 1.4. Secure Identity Document Storage & Privacy (UK GDPR)
* Government-issued photo IDs uploaded by winners are stored in a private server directory inaccessible to public web traffic.
* Documents can only be viewed by authorized administrative staff via authenticated, role-gated audit tools.
* Personal data minimisation is enforced; sensitive DOB and UKARA numbers are masked in standard API logs.

### 1.5. Lawful Alternative Prize & Transfer Workflows
* **Cash Alternatives:** If a winner cannot provide evidence of a valid legal defence, RIF release is blocked and an advertised cash alternative (e.g. 80% valuation) is offered.
* **Two-Tone Substitutions:** Where approved, a two-tone device may be substituted.
* **Controlled Prize Transfers:** Prizes may only be transferred to a secondary recipient if the recipient completes full 18+ age verification, photo ID check, and UKARA defence verification.

### 1.6. Discreet Packaging & Controlled Fulfillment
* **Discreet Packaging Mandatory:** All shipped RIF items must be packed in solid cardboard boxes, opaque parcel bags, sealed black padded envelopes, or solid black shrink wrap. No external logos, weapon branding, or product descriptions appear on the outside of packages.
* **Tracked Logistics:** Delivery is executed via tracked services (e.g. Parcelforce Worldwide) requiring signature upon delivery.
* **Office Collection:** Registered office collections require physical identity re-verification by staff.

### 1.7. Responsible Marketing Safeguards & Reporting System
* Promotional materials adhere to ASA/CAP rules: no weapon glamourisation, no encouragement of violence, and no content appealing to minors.
* A public **Marketing Concern Reporting System** is live on the website, allowing visitors to submit feedback directly to compliance officers.

### 1.8. Administrative Audit Evidence & Reporting
* Every verification decision, UKARA check, alternative prize offer, transfer approval, and dispatch action is recorded in an immutable `AuditLog` table with timestamps and staff IDs.
* Full CSV compliance export functionality is available in the Admin Dashboard for auditing by payment gateways or legal authorities.

---

## 2. Updated Legal Terms & Policies

The website **Terms & Conditions (v1.0)**, **Eligibility Criteria**, and **Privacy Policies** have been updated to explicitly incorporate:
- 18+ age restrictions and formal ID verification prior to prize release.
- UKARA statutory defence definitions (confirming UKARA is not a licence).
- Product classification guidelines for RIF vs Accessory competitions.
- Discreet packaging and tracked courier shipping requirements.
- Cash alternative and prize transfer conditions.
- ASA/CAP responsible advertising commitments and marketing concern reporting mechanisms.

---

## 3. Platform Compliance Readiness Checklist

| Compliance Requirement | Regulatory Standard | Platform Implementation Status |
|---|---|---|
| **Age Limit** | VCRA 2006 Section 40 (18+) | **FULLY ENFORCED** (Checkout & Backend API) |
| **RIF Defence Verification** | VCRA 2006 Section 37 / UKARA | **FULLY ENFORCED** (Conditional RIF Rules) |
| **ID Storage Security** | ICO UK GDPR Principles | **FULLY ENFORCED** (Private Encrypted Storage) |
| **Discreet Logistics** | Carrier Rules & Public Safety | **FULLY ENFORCED** (Mandatory Packaging Checklist) |
| **Marketing Safeguards** | ASA CAP Code Section 3 & 15 | **FULLY ENFORCED** (Reporting System Active) |
| **Audit Logging** | Acquirer & Legal Standards | **FULLY ENFORCED** (AuditLog System Live) |

---

## 4. Technical Sign-Off

The system upgrades have been tested and verified across all application layers. Production build compilation completed with 0 errors.

**Report Prepared By:** Engineering & Legal Compliance Team  
**Platform Version:** Airsoft Draws v1.0.0 (UK RIF Compliance Edition)  
**Date:** August 20, 2026  
