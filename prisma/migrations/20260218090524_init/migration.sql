/*
  Warnings:

  - The required column `id` was added to the `categories` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `categoryId` to the `medicines` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "medicines" DROP CONSTRAINT "medicines_categoryName_fkey";

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "medicines" ADD COLUMN     "categoryId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "medicines" ADD CONSTRAINT "medicines_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
