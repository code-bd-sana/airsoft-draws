-- SQL Schema for Airsoft Draws (Detailed Version v2 with Winners Table)
-- Import this directly into DrawSQL

CREATE TABLE "users" (
  "id" VARCHAR(255) PRIMARY KEY,
  "email" VARCHAR(255) UNIQUE NOT NULL,
  "password_hash" VARCHAR(255) NOT NULL,
  "is_email_verified" BOOLEAN DEFAULT FALSE,
  "first_name" VARCHAR(100),
  "last_name" VARCHAR(100),
  "avatar_url" VARCHAR(255),
  "location" VARCHAR(255), -- e.g. "London, UK" for showing on Winners page
  "role" VARCHAR(50) DEFAULT 'CLIENT', -- Roles: ADMIN, HOST, CLIENT
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "host_profiles" (
  "id" VARCHAR(255) PRIMARY KEY,
  "user_id" VARCHAR(255) UNIQUE NOT NULL,
  "business_name" VARCHAR(255) NOT NULL,
  "wallet_balance" DECIMAL(10, 2) DEFAULT 0.00, -- Earnings available for withdrawal
  "is_verified" BOOLEAN DEFAULT FALSE,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "subscription_plans" (
  "id" VARCHAR(255) PRIMARY KEY,
  "name" VARCHAR(100) NOT NULL,
  "price" DECIMAL(10, 2) NOT NULL,
  "duration_days" INTEGER NOT NULL,
  "max_active_raffles" INTEGER, -- Optional limit
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "host_subscriptions" (
  "id" VARCHAR(255) PRIMARY KEY,
  "host_id" VARCHAR(255) NOT NULL,
  "plan_id" VARCHAR(255) NOT NULL,
  "status" VARCHAR(50) DEFAULT 'ACTIVE', -- ACTIVE, EXPIRED, CANCELLED
  "start_date" TIMESTAMP NOT NULL,
  "end_date" TIMESTAMP NOT NULL,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "raffles" (
  "id" VARCHAR(255) PRIMARY KEY,
  "host_id" VARCHAR(255) NOT NULL,
  "title" VARCHAR(255) NOT NULL,
  "description" TEXT,
  "prize_name" VARCHAR(255),
  "price_per_ticket" DECIMAL(10, 2) NOT NULL,
  "total_tickets" INTEGER NOT NULL,
  "tickets_sold" INTEGER DEFAULT 0,
  "start_date" TIMESTAMP NOT NULL,
  "end_date" TIMESTAMP NOT NULL,
  "status" VARCHAR(50) DEFAULT 'PENDING_APPROVAL', -- DRAFT, PENDING_APPROVAL, ACTIVE, ENDED, CANCELLED
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "instant_wins" (
  "id" VARCHAR(255) PRIMARY KEY,
  "raffle_id" VARCHAR(255) NOT NULL,
  "ticket_number" INTEGER NOT NULL, -- The specific lucky number
  "prize_name" VARCHAR(255) NOT NULL,
  "is_claimed" BOOLEAN DEFAULT FALSE,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "transactions" (
  "id" VARCHAR(255) PRIMARY KEY,
  "user_id" VARCHAR(255) NOT NULL,
  "type" VARCHAR(50) NOT NULL, -- TICKET_PURCHASE, SUBSCRIPTION_FEE, HOST_WITHDRAWAL
  "amount" DECIMAL(10, 2) NOT NULL,
  "status" VARCHAR(50) DEFAULT 'COMPLETED', -- PENDING, COMPLETED, FAILED, REFUNDED
  "payment_gateway" VARCHAR(50), -- STRIPE, PAYPAL
  "gateway_transaction_id" VARCHAR(255),
  "related_entity_id" VARCHAR(255), -- Polymorphic ID (Subscription ID, Ticket Order ID, etc)
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "tickets" (
  "id" VARCHAR(255) PRIMARY KEY,
  "raffle_id" VARCHAR(255) NOT NULL,
  "user_id" VARCHAR(255) NOT NULL,
  "transaction_id" VARCHAR(255) NOT NULL,
  "ticket_number" INTEGER NOT NULL,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "winners" (
  "id" VARCHAR(255) PRIMARY KEY,
  "user_id" VARCHAR(255) NOT NULL,
  "raffle_id" VARCHAR(255) NOT NULL,
  "ticket_id" VARCHAR(255) NOT NULL,
  "win_type" VARCHAR(50) NOT NULL, -- MAIN_DRAW or INSTANT_WIN
  "prize_name" VARCHAR(255) NOT NULL,
  "delivery_status" VARCHAR(50) DEFAULT 'PENDING', -- PENDING, SHIPPED, DELIVERED
  "tracking_number" VARCHAR(255),
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "withdrawals" (
  "id" VARCHAR(255) PRIMARY KEY,
  "host_id" VARCHAR(255) NOT NULL,
  "amount" DECIMAL(10, 2) NOT NULL,
  "status" VARCHAR(50) DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED, COMPLETED
  "admin_notes" TEXT,
  "payout_method" VARCHAR(100), -- BANK_TRANSFER, PAYPAL
  "payout_details" TEXT,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Foreign Key Relationships
ALTER TABLE "host_profiles" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");
ALTER TABLE "host_subscriptions" ADD FOREIGN KEY ("host_id") REFERENCES "host_profiles" ("id");
ALTER TABLE "host_subscriptions" ADD FOREIGN KEY ("plan_id") REFERENCES "subscription_plans" ("id");
ALTER TABLE "raffles" ADD FOREIGN KEY ("host_id") REFERENCES "host_profiles" ("id");
ALTER TABLE "instant_wins" ADD FOREIGN KEY ("raffle_id") REFERENCES "raffles" ("id");
ALTER TABLE "tickets" ADD FOREIGN KEY ("raffle_id") REFERENCES "raffles" ("id");
ALTER TABLE "tickets" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");
ALTER TABLE "tickets" ADD FOREIGN KEY ("transaction_id") REFERENCES "transactions" ("id");
ALTER TABLE "transactions" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");
ALTER TABLE "winners" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");
ALTER TABLE "winners" ADD FOREIGN KEY ("raffle_id") REFERENCES "raffles" ("id");
ALTER TABLE "winners" ADD FOREIGN KEY ("ticket_id") REFERENCES "tickets" ("id");
ALTER TABLE "withdrawals" ADD FOREIGN KEY ("host_id") REFERENCES "host_profiles" ("id");
