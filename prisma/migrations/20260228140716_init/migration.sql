/*
  Warnings:

  - Added the required column `description` to the `reviews` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "description" TEXT NOT NULL,
ALTER COLUMN "rating" DROP NOT NULL;
