-- DropForeignKey
ALTER TABLE "tickets" DROP CONSTRAINT "tickets_raffle_id_fkey";

-- DropForeignKey
ALTER TABLE "winners" DROP CONSTRAINT "winners_raffle_id_fkey";

-- DropForeignKey
ALTER TABLE "winners" DROP CONSTRAINT "winners_ticket_id_fkey";

-- AlterTable
ALTER TABLE "instant_wins" ADD COLUMN     "rrp_value" DECIMAL(10,2);

-- AlterTable
ALTER TABLE "raffles" ADD COLUMN     "main_prize_value" DECIMAL(10,2),
ADD COLUMN     "prize_classification" VARCHAR(50) NOT NULL DEFAULT 'RIF';

-- AlterTable
ALTER TABLE "tickets" ADD COLUMN     "accepted_terms_at" TIMESTAMP(3),
ADD COLUMN     "accepted_terms_version" VARCHAR(20);

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "date_of_birth" TIMESTAMP(3),
ADD COLUMN     "ukara_number" VARCHAR(100);

-- AlterTable
ALTER TABLE "winners" ADD COLUMN     "alternative_amount" DECIMAL(10,2),
ADD COLUMN     "alternative_decision_by" VARCHAR(255),
ADD COLUMN     "alternative_reason" TEXT,
ADD COLUMN     "alternative_status" VARCHAR(50),
ADD COLUMN     "alternative_type" VARCHAR(50),
ADD COLUMN     "collection_staff_member" VARCHAR(255),
ADD COLUMN     "courier_name" VARCHAR(100),
ADD COLUMN     "discreet_packaging_confirmed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "dob_match" BOOLEAN,
ADD COLUMN     "fulfillment_method" VARCHAR(50),
ADD COLUMN     "id_document_type" VARCHAR(50),
ADD COLUMN     "id_document_url" TEXT,
ADD COLUMN     "name_match" BOOLEAN,
ADD COLUMN     "packaging_type" VARCHAR(50),
ADD COLUMN     "transfer_admin_notes" TEXT,
ADD COLUMN     "transfer_recipient_dob" TIMESTAMP(3),
ADD COLUMN     "transfer_recipient_name" VARCHAR(255),
ADD COLUMN     "transfer_recipient_ukara" VARCHAR(100),
ADD COLUMN     "transfer_status" VARCHAR(50),
ADD COLUMN     "transferred_to_user_id" VARCHAR(255),
ADD COLUMN     "ukara_status" VARCHAR(50) NOT NULL DEFAULT 'NOT_REQUIRED',
ADD COLUMN     "verification_status" VARCHAR(50) NOT NULL DEFAULT 'WINNER_SELECTED',
ADD COLUMN     "verified_at" TIMESTAMP(3),
ADD COLUMN     "verified_by_user_id" VARCHAR(255);

-- AlterTable
ALTER TABLE "withdrawals" ADD COLUMN     "fee_amount" DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN     "net_amount" DECIMAL(10,2) DEFAULT 0.00;

-- CreateTable
CREATE TABLE "subscription_requests" (
    "id" VARCHAR(255) NOT NULL,
    "host_id" VARCHAR(255) NOT NULL,
    "plan_id" VARCHAR(255) NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    "requested_days" INTEGER,
    "note" TEXT,
    "admin_notes" TEXT,
    "approved_days" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subscription_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" VARCHAR(255) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "icon" VARCHAR(50),
    "image" VARCHAR(255),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketing_reports" (
    "id" VARCHAR(255) NOT NULL,
    "raffle_id" VARCHAR(255),
    "reason" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "reporter_email" VARCHAR(255),
    "status" VARCHAR(50) NOT NULL DEFAULT 'SUBMITTED',
    "assigned_reviewer_id" VARCHAR(255),
    "resolution_notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "marketing_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" VARCHAR(255) NOT NULL,
    "user_id" VARCHAR(255),
    "action" VARCHAR(100) NOT NULL,
    "entity_type" VARCHAR(50) NOT NULL,
    "entity_id" VARCHAR(255) NOT NULL,
    "details" TEXT,
    "ip_address" VARCHAR(100),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- AddForeignKey
ALTER TABLE "subscription_requests" ADD CONSTRAINT "subscription_requests_host_id_fkey" FOREIGN KEY ("host_id") REFERENCES "host_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription_requests" ADD CONSTRAINT "subscription_requests_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "subscription_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_raffle_id_fkey" FOREIGN KEY ("raffle_id") REFERENCES "raffles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "winners" ADD CONSTRAINT "winners_raffle_id_fkey" FOREIGN KEY ("raffle_id") REFERENCES "raffles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "winners" ADD CONSTRAINT "winners_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
