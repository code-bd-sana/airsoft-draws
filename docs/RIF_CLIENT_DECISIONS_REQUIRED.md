# UK RIF Compliance — Client Decisions & Legal Review Register

**Project:** Airsoft Draws Competition Platform  
**Date:** August 20, 2026  
**Status:** Active Governance Document  

---

## 1. Unresolved Client Business Decisions

The technical implementation provides configurable options and default fallbacks for each decision below. The client management team must formally record decisions on the following items:

| Ref | Decision Item | Context & Options | Default Technical Implementation | Status |
|---|---|---|---|---|
| **DEC-01** | **Resolution Order: Cash Alternative vs Two-Tone Substitution** | Client statements contain conflicting preferences: one statement notes two-toning can be offered where a winner lacks UKARA, another states a cash alternative is provided, while terms state only RIFs are offered and IFs are not permitted. | Configurable workflow allowing Admin to choose: (1) Cash Alternative, (2) Two-Tone Substitution (if operational supplier is available), or (3) Forfeiture. | **Pending Client Decision** |
| **DEC-02** | **Cash Alternative Valuation Formula** | How is the cash alternative calculated when a winner lacks a legal defence? | Default: 80% of main prize cash value (or 100% RRP minus platform fees/handling cost). Configurable in Admin settings. | **Pending Client Decision** |
| **DEC-03** | **Prize Forfeiture Window** | If a winner fails to provide valid ID or legal defence, how long before the prize is forfeited or alternative is enforced? | Default: 28 calendar days from winner notification. | **Pending Client Decision** |
| **DEC-04** | **Alternative Legal Defences Accepted (Non-UKARA)** | Beyond UKARA, what documentary evidence is acceptable for airsoft skirmishers (e.g. site membership card, site insurance evidence, film production licence)? | Configurable verification status `ALT_DEFENCE_UNDER_REVIEW` requiring manual Admin document review. | **Pending Client Decision** |
| **DEC-05** | **Identity Document Retention Period** | Under UK GDPR, how long should uploaded ID document images be retained after winner verification is completed? | Default: 90 days post-verification (purge files, keep audit hash/status log). | **Pending Client Decision** |
| **DEC-06** | **Courier Approval & Contract Verification** | Parcelforce terms require specific booking accounts for firearms/airsoft items. Has an explicit merchant account been set up with Parcelforce for airsoft device transport? | Tracked shipping fields implemented with Parcelforce and Royal Mail options; courier terms warning displayed to staff. | **Pending Client Decision** |
| **DEC-07** | **Office Collection Verification Protocol** | For in-person office collection, what registered address and operating hours are authorized for collection? | Registered office collection option implemented with physical ID recheck and staff sign-off log. | **Pending Client Decision** |
| **DEC-08** | **Staff Marketing Training Evidence** | The client states "we use trained staff to manage marketing". Is evidence or a staff training log maintained for ASA compliance audits? | Marketing reporting system implemented. Documented as a business claim requiring client internal records. | **Pending Client Decision** |

---

## 2. Items Requiring Formal UK Solicitor Review

The following legal wording and policy matters must be submitted to a qualified UK solicitor specializing in commercial gaming, firearms law, and consumer rights:

1. **Prize Transfer Legality under VCRA 2006:** Confirm whether transferring a prize RIF to a secondary recipient constitutes a new commercial supply under VCRA Section 36 requiring secondary compliance.
2. **Forfeiture Clause Enforceability:** Confirm enforceability of prize forfeiture clauses under the Consumer Rights Act 2015 when a winner fails UKARA verification.
3. **Cash Alternative Terms:** Ensure cash alternative terms comply with Gambling Commission guidance regarding prize competitions and free entry routes.
