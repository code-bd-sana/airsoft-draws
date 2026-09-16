-- AlterTable
ALTER TABLE "raffles" ADD COLUMN     "max_tickets" INTEGER,
ADD COLUMN     "min_tickets" INTEGER NOT NULL DEFAULT 1;
