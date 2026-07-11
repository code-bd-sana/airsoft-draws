-- AlterTable
ALTER TABLE "raffles" ADD COLUMN     "auto_draw_date" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "auto_draw_sold_out" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_auto_draw" BOOLEAN NOT NULL DEFAULT true;
