/*
  Warnings:

  - You are about to drop the column `shippingAddress` on the `orders` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `address` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "address" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "shippingAddress";

-- CreateIndex
CREATE UNIQUE INDEX "address_userId_key" ON "address"("userId");

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
