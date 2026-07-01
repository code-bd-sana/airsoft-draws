# Professional System Design Checklist

Before writing a single line of backend code, a Senior Architect ensures that the system is fully mapped out. We have already completed the two most important steps (**Database ERD** and **API Specifications**). 

Here is a list of the remaining documents and diagrams you can prepare to make this a truly enterprise-grade System Design:

---

## 1. Sequence Diagrams (Data Flow)
A sequence diagram shows exactly how data moves between the User, Frontend, Backend, Database, and Third-party APIs (like Stripe).
**Documents to create:**
- `flow_ticket_purchase.md`: How the system handles a user buying a ticket (Stripe Webhook integration is critical here).
- `flow_main_draw.md`: How the Random Number Generator (RNG) picks a winner fairly without crashing the server.

*Tool to use: [SequenceDiagram.org](https://sequencediagram.org) or Mermaid.js*

## 2. State Machine Diagrams (Entity Lifecycles)
In a complex app, entities change states. If a state changes incorrectly (e.g., selling tickets for a `DRAFT` raffle), the system breaks.
**Documents to create:**
- `state_raffle.md`: The lifecycle of a Raffle (`DRAFT` ➔ `PENDING_APPROVAL` ➔ `ACTIVE` ➔ `ENDED` ➔ `DRAWING` ➔ `COMPLETED` / `CANCELLED`).
- `state_withdrawal.md`: The lifecycle of a Host's payout request (`PENDING` ➔ `APPROVED` ➔ `PROCESSING` ➔ `COMPLETED`).

*Tool to use: [Stately.ai](https://stately.ai) or Mermaid.js*

## 3. High-Level Architecture Diagram (HLD)
A visual map of your servers and services.
**What it should show:**
- Next.js Frontend (Vercel)
- NestJS Backend (AWS / Render)
- PostgreSQL Database
- Redis (For caching active raffles & queueing)
- Background Workers (For sending emails and picking winners)

*Tool to use: [Eraser.io](https://eraser.io) or Draw.io*

## 4. Security & Compliance Strategy
**Documents to create:**
- `security_plan.md`: Outlines how you will handle JWT token storage (HttpOnly cookies vs LocalStorage), Rate Limiting (preventing DDOS on the login/purchase endpoints), and Role-Based Access Control (RBAC).

## 5. Infrastructure & DevOps Plan
**Documents to create:**
- `devops_plan.md`: How will you deploy the code? (e.g., Dockerizing the NestJS app, setting up GitHub Actions for CI/CD, configuring staging vs production environments).

---

### What should we do next?
If you want to continue designing before coding, I highly recommend we create the **Sequence Diagram for Ticket Purchasing**. It is the most complex part of your app because it involves real money, real-time ticket availability, and Stripe webhooks. 

Would you like me to generate the Mermaid code for the **Ticket Purchase Sequence Diagram** so you can visually see how the payment flow will work?
