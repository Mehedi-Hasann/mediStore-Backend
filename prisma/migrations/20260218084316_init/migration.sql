/*
  Warnings:

  - The primary key for the `categories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `medicines` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "medicines" DROP CONSTRAINT "medicines_categoryId_fkey";

-- AlterTable
ALTER TABLE "categories" DROP CONSTRAINT "categories_pkey",
DROP COLUMN "id";

-- AlterTable
ALTER TABLE "medicines" DROP COLUMN "categoryId";

-- AddForeignKey
ALTER TABLE "medicines" ADD CONSTRAINT "medicines_categoryName_fkey" FOREIGN KEY ("categoryName") REFERENCES "categories"("categoryName") ON DELETE RESTRICT ON UPDATE CASCADE;
