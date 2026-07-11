/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `host_profiles` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `raffles` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "instant_wins" DROP CONSTRAINT "instant_wins_raffle_id_fkey";

-- AlterTable
ALTER TABLE "host_profiles" ADD COLUMN     "address" TEXT,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "phone" VARCHAR(50),
ADD COLUMN     "slug" VARCHAR(255);

-- AlterTable
ALTER TABLE "instant_wins" ADD COLUMN     "image" VARCHAR(255);

-- AlterTable
ALTER TABLE "raffles" ADD COLUMN     "main_image" VARCHAR(255),
ADD COLUMN     "slug" VARCHAR(255);

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "address" TEXT,
ADD COLUMN     "phone" VARCHAR(50);

-- CreateIndex
CREATE UNIQUE INDEX "host_profiles_slug_key" ON "host_profiles"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "raffles_slug_key" ON "raffles"("slug");

-- AddForeignKey
ALTER TABLE "instant_wins" ADD CONSTRAINT "instant_wins_raffle_id_fkey" FOREIGN KEY ("raffle_id") REFERENCES "raffles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
